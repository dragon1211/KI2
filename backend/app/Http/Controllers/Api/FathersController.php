<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

use Image;

use App\Models\Father;
use App\Models\FatherRelation;
use App\Models\EmailActivation;
use App\Models\MeetingApprovals;

use App\Mail\FathersForgetPasswordMail;
use App\Mail\FathersRegistrationTemporaryMail;
use App\Mail\FathersRegistrationMainMail;

use App\Notifications\SmsNotification;

class FathersController extends Controller {
    use AuthenticationTrait;
    use AuthorizationTrait;

    /* Traitで使うメソッド */
    protected function getGuard () {
        return 'fathers';
    }
    protected function getModel () {
        return new \App\Models\Father();
    }

    public function requestPassword (Request $r) {
        $validate = Validator::make($r->all(), [
            'email' => 'required|max:255|email'
        ]);

        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if (null === ($result = Father::select('id')->where('email', $r->email)->first())) {
            // メールアドレス照合に失敗
            return ['status_code' => 400, 'error_messages' => ['メールアドレスが未登録です。入力した情報を確認してください。']];
        }

        $token = bin2hex(random_bytes(24));

        $create = [
            'type' => 1,
            'father_id' => $result->id,
            'email' => $r->email,
            'token' => $token,
            'ttl' => date('Y-m-d H:i:s', strtotime("8 hour")),

        ];

        try {
            // DBに入ります。
            EmailActivation::create($create);

            // メールを送ります。
            Mail::to($r->email)->send(new FathersForgetPasswordMail($token));
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => 'メールアドレスが未登録です。入力した情報を確認してください。'];
        }

        $params = [
            'id' => $result->id,
            'email' => $r->email,
        ];

        // メールアドレス照合に成功
        return ['status_code' => 200, 'params' => $params, 'success_messages' => ['再発行用パスワードの送信に成功しました。']];
    }

    public function registerTemporary (Request $r) {
        $validate = Validator::make($r->all(), [
            'email' => 'required|unique:fathers|unique:email_activations|max:255|email'
        ]);

        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if ($get = Father::where('email', $r->email)->first()) {
            // すでにfathersに登録されている場合
            return ['status_code' => 400, 'error_messages' => ['入力したメールアドレスは既に登録済みです。同じメールアドレスは使用できません。']];
        }
        else if ($get = EmailActivation::where('email', $r->email)->first()) {
            if (time() > strtotime($get->ttl)) {
                EmailActivation::where('email', $r->email)->delete();
            }
            else {
                return ['status_code' => 400, 'error_messages' => ['入力したメールアドレスは既に登録済みです。同じメールアドレスは使用できません。']];
            }
        }

        $token = bin2hex(random_bytes(24));

        $create = [
            'email' => $r->email,
            'token' => $token,
            'ttl' => date('Y-m-d H:i:s', strtotime("8 hour")),
        ];

        try {
            // DBに入ります。
            EmailActivation::create($create);

            // メールを送ります。
            Mail::to($r->email)->send(new FathersRegistrationTemporaryMail($token));
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => '登録に失敗しました。'];
        }

        // 仮登録に成功した場合
        return ['status_code' => 200, 'token' => $token, 'success_messages' => ['親の仮登録に成功しました。8時間以内に本登録を完了させてください。']];
    }

    public function registerMain (Request $r) {
        if ($r->image == 'null') $r->image = null;

        if (!is_null($r->image) && count(Storage::disk('private')->files('/')) >= 9999) {
            Log::critical('ストレージの限界を超えています。9999個ファイルまで保存可能ですので、不要なファイルを削除して下さい。');
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 電話番号の文字数。
        Validator::extend('tel_size', function ($attribute, $value, $params, $validator) {
            return $this->telsize($value);
        });

        // ファイルサイズは10MiB以内
        Validator::extend('image_size', function ($attribute, $value, $params, $validator) {
            return $this->imagesizecannull($value);
        });

        // ミームタイプ
        Validator::extend('image_meme', function ($attribute, $value, $params, $validator) {
            return $this->imagememecannull($value);
        });

        $validate = Validator::make($r->all(), [
            'token' => 'required',
            'password' => 'required|min:8|max:72|confirmed',
            'company' => 'max:100',
            'image' => 'image_size|image_meme',
            'profile' => 'max:1000',
            'tel' => 'required|unique:fathers|numeric|starts_with:0|tel_size',
        ]);

        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if ($get = EmailActivation::select('email', 'ttl')->where('token', $r->token)->first()) {
            if (time() > strtotime($get->ttl)) {
                // 有効期限が切れている場合
                return['status_code' => 401, 'error_messages' => ['仮登録の有効期限が切れました。改めて管理者にお問い合わせいただき、再登録を行ってください。']];
            }
        }

        $password = Hash::make($r->password);

        if (!is_null($r->image)) {
            $filename = $this->uuidv4() . '.jpg';
            $image = base64_decode(substr($r->image, strpos($r->image, ',') + 1));
            Storage::disk('private')->put($filename, $image);

            $quality = 1;
            $img = Image::make('/work/storage/app/private/'.$filename)->encode('jpg', $quality);
            $img->save('/work/storage/app/private/'.$filename);
        }

        try {
            // DBの値の準備。
            DB::beginTransaction();

            $create = [
                'email' => $get->email,
                'password' => $password,
                'company' => $r->company,
                'image' => !is_null($r->image) ? '/files/'.$filename : '/assets/default/avatar.jpg',
                'profile' => $r->profile,
                'tel' => $r->tel,
            ];

            // DBに入ります。
            $father = new Father;
            $emaact = EmailActivation::where('token', $r->token);

            $father->fill($create);
            $father->push();

            // メールを送ります。
            Mail::to($get->email)->send(new FathersRegistrationMainMail());

            // email_activationsから削除します。
            $emaact->delete();

            DB::commit();
        } catch (\Throwable $e) {
            // 本登録に失敗
            Log::critical($e->getMessage());
            DB::rollback();
            if (!is_null($r->image)) Storage::disk('private')->delete($filename);
            return ['status_code' => 400, 'error_messages' => ['本登録に失敗しました。']];
        }

        // 本登録に成功
        return ['status_code' => 200];
    }

    public function search (Request $r) {
        if (!isset($r->keyword)) {
            return ['status_code' => 400];
        }

        $result = [];
        $father_select = ['id', 'company', 'image', 'email'];
        $father_relation_select = ['created_at'];

        if (null === ($result = Father::select($father_select)->where('company', 'LIKE', '%'.$r->keyword.'%')->orderBy('created_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        // foreach ($list as $i => $l) {
        //     $result[] = $l;
        //     if (null === ($result[$i]['relation'] = FatherRelation::select($father_relation_select)->where('father_id', $l->id)->first())) {
        //         return ['status_code' => 400];
        //     }
        // }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function list () {
        $result = [];
        $father_select = ['id', 'company', 'image', 'email'];
        $father_relation_select = ['created_at'];

        if (null === ($result = Father::select($father_select)->orderBy('created_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        // foreach ($list as $i => $l) {
        //     $result[] = $l;
        //     if (null === ($result[$i]['relation'] = FatherRelation::select($father_relation_select)->where('father_id', $l->id)->first())) {
        //         continue;
        //     }
        // }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfChild (Request $r) {
        $result = [];
        $father_select = ['id', 'company', 'image'];

        if (null === ($list = FatherRelation::select('father_id')->where('child_id', (int)$r->child_id)->orderBy('created_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        foreach ($list as $l) {
            if (null === ($result[] = Father::select($father_select)->find($l->father_id))) {
                return ['status_code' => 400];
            }
        }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function detail ($father_id) {
        $father_select = ['image', 'email', 'tel', 'profile', 'company'];

        // 親画面から他の親としてアクセスすれば、404となります。
        $err = 'アクセスできません。';
        if (request()->route()->action['as'] == 'pdp') {
            abort_if(null === session()->get('fathers') || null === ($rel = Father::where('id', (int)session()->get('fathers')['id'])->first()), 404, $err);
        }

        // 同じく子画面から他の親の詳細ページをアクセスすれば、404となります。
        if (request()->route()->action['as'] == 'mdc') {
            abort_if(null === session()->get('children') || null === ($rel = FatherRelation::where('father_id', (int)$father_id)->where('child_id', (int)session()->get('children')['id'])->first()), 404, $err);
        }

        if (null === ($result = Father::select($father_select)->where('id', (int)$father_id)->orderBy('created_at', 'desc')->first())) {
            // 親詳細の取得に失敗
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 親詳細の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function updateImage (Request $r, $father_id=null) {
        if (isset($r->father_id)) {
            $father_id = $r->father_id;
        }

        if (!isset($r->image) || !isset($father_id)) {
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        if (count(Storage::disk('private')->files('/')) >= 9999) {
            Log::critical('ストレージの限界を超えています。9999個ファイルまで保存可能ですので、不要なファイルを削除して下さい。');
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // ファイルサイズは10MiB以内
        Validator::extend('image_size', function ($attribute, $value, $params, $validator) {
            return $this->imagesize($value);
        });

        // ミームタイプ
        Validator::extend('image_meme', function ($attribute, $value, $params, $validator) {
            return $this->imagememe($value);
        });

        // バリデーションエラー
        $validate = Validator::make($r->all(), ['image' => 'image_size|image_meme']);
        // 300x300px

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $filename = $this->uuidv4() . '.jpg';
        $oldimg = null;

        try {
            DB::beginTransaction();

            $image = base64_decode(substr($r->image, strpos($r->image, ',') + 1));
            Storage::disk('private')->put($filename, $image);

            $quality = 1;
            $img = Image::make('/work/storage/app/private/'.$filename)->encode('jpg', $quality);
            $img->save('/work/storage/app/private/'.$filename);

            $father = Father::find((int)$father_id);
            if (!is_null($father->image) && $father->image != '/assets/default/avatar.jpg') {
                $oldimg = str_replace('/files/', '', $father->image);
                if (!Storage::disk('private')->exists($oldimg)) {
                    Log::warning($oldimg.'というパスは不正です。');
                    $oldimg = null;
                }
            }
            $father->image = '/files/'.$filename;
            $father->save();

            $login_user_datum = $father->toArray();
            unset($login_user_datum['password']);

            // セッションに保存する
            session()->put('fathers', $login_user_datum);

            DB::commit();
        } catch (\Throwable $e) {
            // 親プロフィール画像のアップロードに失敗
            Log::critical($e->getMessage());
            DB::rollback();
            Storage::disk('private')->delete($filename);
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        if (!is_null($oldimg)) {
            Storage::disk('private')->delete($oldimg);
        }

        // 親プロフィール画像のアップロードに成功
        return ['status_code' => 200, 'success_messages' => ['親の更新に成功しました。']];
    }

    public function updateProfile (Request $r, $father_id=null) {
        if (isset($r->father_id)) {
            $father_id = $r->father_id;
        }

        if (!isset($father_id)) {
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 電話番号の文字数。
        Validator::extend('tel_size', function ($attribute, $value, $params, $validator) {
            return $this->telsize($value);
        });

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'email' => 'required|max:255|email',
            'company' => 'max:100',
            'profile' => 'max:1000',
            'tel' => 'required|numeric|starts_with:0|tel_size'
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $update = [
            'email' => $r->email,
            'company' => $r->company,
            'profile' => $r->profile,
            'tel' => $r->tel,
        ];

        try {
            Father::where('id', (int)$father_id)->update($update);
        } catch (\Throwable $e) {
            // 親プロフィール更新失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 親プロフィール更新成功
        return ['status_code' => 200, 'success_messages' => ['親の更新に成功しました。']];
    }

    public function updatePassword (Request $r, $father_id=null) {
        if (isset($r->father_id)) {
            $father_id = $r->father_id;
        }

        else if (isset($r->token)) {
            if (null === ($ea = EmailActivation::select('father_id')->where('token', $r->token)->first())) {
                return ['status_code' => 400, 'error_messages' => ['パスワードの更新に失敗しました。']];
            }
            $father_id = (int)$ea->father_id;
        }

        if (is_null($father_id) && !isset($r->token)) {
            return ['status_code' => 400, 'error_messages' => ['パスワードの更新に失敗しました。']];
        }

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'password' => 'required|min:8|max:72|confirmed',
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            DB::beginTransaction();

            $father = Father::find((int)$father_id);
            $father->password = Hash::make($r->password);
            $father->save();

            if (isset($r->token)) {
                $emaact = EmailActivation::where('token', $r->token);
                $emaact->delete();
            }

            DB::commit();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            DB::rollback();
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['親の更新に成功しました。']];
    }

    public function approvalNotification (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->tel) || empty(json_decode($r->tel))) {
            return ['status_code' => 400];
        }

        $meeting_approvals_select = ['child_id'];
        $children_select = ['tel'];

        if (null === ($ma = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$r->meeting_id)->get())) {
            return ['status_code' => 400];
        }

        try {
            foreach (json_decode($r->tel) as $tel) {
                // SMSを送ります。
                $message = view('sms.fathers.approval', ['meeting_id' => $r->meeting_id]);
                \Notification::route('nexmo', '81'.substr($tel, 1))->notify(new SmsNotification($message));
            }
        }
        catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }

    public function withdrawal (Request $r) {
        try {
            $father = Father::find((int)$r->father_id);
            $img = $father->image;
            $father->delete();

            if (!is_null($img)) {
                Storage::disk('private')->delete($img);
            }
            Session::forget($this->getGuard());
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の削除に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['親の削除に成功しました。']];
    }

    public function delete ($father_id) {
        try {
            Father::where('id', (int)$father_id)->delete();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の削除に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['親の削除に成功しました。']];
    }
}
