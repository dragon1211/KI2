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

use App\Models\Child;
use App\Models\Father;
use App\Models\FatherRelation;
use App\Models\Meeting;
use App\Models\MeetingApprovals;
use App\Models\TelActivation;

use App\Notifications\SmsNotification;
use App\Mail\ChildrenMainRegistrationMail;

class ChildrenController extends Controller {
    use AuthenticationTrait;
    use AuthorizationTrait;

    /* Traitで使うメソッド */
    protected function getGuard () {
        return 'children';
    }
    protected function getModel () {
        return new \App\Models\Child();
    }

    public function registerTemporary (Request $r) {
        // 電話番号の文字数。
        Validator::extend('tel_size', function ($attribute, $value, $params, $validator) {
            return $this->telsize($value);
        });

        $validate = Validator::make($r->all(), [
            'tel' => 'required|unique:children|numeric|starts_with:0|tel_size'
        ]);

        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if ($get = TelActivation::where('tel', $r->tel)->first()) {
            if (time() > strtotime($get->ttl)) {
                TelActivation::where('tel', $r->tel)->delete();
            }
            else {
                return ['status_code' => 400, 'error_messages' => ['既に使用されている電話番号です。']];
            }
        }

        $token = bin2hex(random_bytes(24));

        $create = [
            'type' => 0,
            'tel' => $r->tel,
            'token' => $token,
            'ttl' => date('Y-m-d H:i:s', strtotime("8 hour")),
        ];

        if (isset($r->father_id) && $r->father_id > 0) {
            $create['father_id'] = $r->father_id;
        }

        try {
            // DBに入ります。
            DB::beginTransaction();

            $telact = new TelActivation;
            $telact->fill($create);
            $telact->push();

            // SMSを送ります。
            $message = view('sms.children.register.temporary', ['token' => $token]);
            \Notification::route('nexmo', '81'.substr($r->tel, 1))->notify(new SmsNotification($message));

            DB::commit();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            DB::rollback();
            return ['status_code' => 400, 'error_messages' => ['登録に失敗しました。']];
        }

        // 仮登録に成功した場合
        return ['status_code' => 200, 'params' => ['tel' => $r->tel]];
    }

    public function checkRegisterMain (Request $r) {
        // トークンの確認
        if (null === ($get = TelActivation::select('tel', 'ttl')->where('token', $r->token)->first())) {
            return ['status_code' => 400, 'error_messages' => ['不正な登録トークン。']];
        }

        // トークンの有効期限が切れた場合
        if (time() > strtotime($get->ttl)) {
            TelActivation::where('token', $r->token)->delete();
            return ['status_code' => 400, 'error_messages' => ['不正な登録トークン。']];
        }

        $get->tel .= rand(100,999);

        // 本登録に成功
        return ['status_code' => 200, 'params' => $get];
    }

    public function registerMain (Request $r) {
        // トークンの確認
        if (null === ($get = TelActivation::where('token', $r->token)->first())) {
            return ['status_code' => 400, 'error_messages' => ['仮登録の有効期限が切れました。改めて親にお問い合わせいただき、再登録の手続きを行ってください。']];
        }

        // 有効期限が切れている場合
        if (time() > strtotime($get->ttl)) {
            return ['status_code' => 400, 'error_messages' => ['仮登録の有効期限が切れました。改めて親にお問い合わせいただき、再登録の手続きを行ってください。']];
        }

        if (!is_null($r->image) && count(Storage::disk('private')->files('/')) >= 9999) {
            Log::critical('ストレージの限界を超えています。9999個ファイルまで保存可能ですので、不要なファイルを削除して下さい。');
            return ['status_code' => 400, 'error_messages' => ['登録に失敗しました。']];
        }

        // ファイルサイズは5MiB以内又はnull
        Validator::extend('image_size', function ($attribute, $value, $params, $validator) {
            return $this->imagesizecannull($value);
        });

        // ミームタイプ
        Validator::extend('image_meme', function ($attribute, $value, $params, $validator) {
            return $this->imagememecannull($value);
        });

        // 規約に同意する
        Validator::extend('agreed', function ($attribute, $value, $params, $validator) {
            return $value == 'true';
        });

        $validate = Validator::make($r->all(), [
            'identity' => 'required|max:20|alpha_num',
            'email' => 'required|unique:children|max:255|email',
            'password' => ['required', 'min:8', 'max:72', 'confirmed', new \App\Rules\Hankaku],
            'last_name' => 'required|max:100',
            'first_name' => 'required|max:100',
            'image' => 'image_size|image_meme',
            'company' => 'max:100',
            'terms' => 'agreed',
        ]);

        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if ($r->image == 'null') {
            $r->image = null;
        }

        $password = Hash::make($r->password);

        if (!is_null($r->image)) {
            $filename = $this->uuidv4().'.jpg';
        }

        $insert = [
            'identity' => $r->identity,
            'email' => $r->email,
            'tel' => $get->tel,
            'password' => $password,
            'last_name' => $r->last_name,
            'first_name' => $r->first_name,
            'image' => !is_null($r->image) ? '/files/'.$filename : '/assets/default/avatar.jpg',
            'company' => $r->company,
        ];

        try {
            DB::beginTransaction();
            $child = new Child;
            $telact = TelActivation::where('token', $r->token)->first();

            if (!is_null($r->image)) {
                $image = base64_decode(substr($r->image, strpos($r->image, ',') + 1));
                Storage::disk('private')->put($filename, $image);
                $this->fiximg($filename);
            }

            $child->fill($insert);
            $child->push();

            if (!is_null($telact->father_id)) {
                // 親子関係の上限ではないの場合
                $fa = Father::select('relation_limit')->where('id', $get->father_id)->first();
                $fr = FatherRelation::where('father_id', $get->father_id)->count();
                if ($fr < $fa->relation_limit) {
                    $rel = new FatherRelation;

                    $add = [
                        'father_id' => $telact->father_id,
                        'child_id' => $child->id,
                        'hire_at' => date('Y-m-d H:i:s', time()),
                    ];

                    if (null !== ($meet = Meeting::select('id')->where('father_id', $telact->father_id)->where('is_favorite', true)->get())) {
                        foreach ($meet as $m) {
                            $app = new MeetingApprovals;

                            $join = [
                                'child_id' => $child->id,
                                'meeting_id' => $m->id,
                            ];

                            $app->fill($join);
                            $app->push();
                        }
                    }

                    $rel->fill($add);
                    $rel->push();
                }
            }

            $telact->delete();

            // メールを送ります。
            Mail::to($r->email)->send(new ChildrenMainRegistrationMail());

            DB::commit();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            DB::rollback();
            if (!is_null($r->image)) Storage::disk('private')->delete($filename);
            return ['status_code' => 400, 'error_messages' => ['登録に失敗しました。']];
        }

        // 本登録に成功
        return ['status_code' => 200, 'success_messages' => ['本登録に成功しました。'], 'params' => ['tel' => $r->tel, 'password' => $password]];
    }

    public function requestPassword (Request $r) {
        // 電話番号の文字数。
        Validator::extend('tel_size', function ($attribute, $value, $params, $validator) {
            return $this->telsize($value);
        });

        $validate = Validator::make($r->all(), [
            'tel' => 'required|numeric|starts_with:0|tel_size'
        ]);

        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if (null === ($result = Child::select('id')->where('tel', $r->tel)->first())) {
            // メールアドレス照合に失敗
            return ['status_code' => 400, 'error_messages' => ['電話番号が未登録です。入力した情報を確認してください。']];
        }

        $token = bin2hex(random_bytes(24));

        $create = [
            'type' => 1,
            'child_id' => $result->id,
            'tel' => $r->tel,
            'token' => $token,
            'ttl' => date('Y-m-d H:i:s', strtotime("8 hour")),
        ];

        try {
            // DBに入る又は変えります。
            DB::beginTransaction();

            $telact = TelActivation::where('child_id', $result->id);
            $telac2 = new TelActivation;

            if (null !== ($telact->first())) {
                $telact->delete();
            }

            $telac2->fill($create);
            $telac2->push();

            // SMSを送ります。
            $message = view('sms.children.password', ['token' => $token]);
            \Notification::route('nexmo', '81'.substr($r->tel, 1))->notify(new SmsNotification($message));

            DB::commit();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            DB::rollback();
            return ['status_code' => 400, 'error_messages' => '電話番号が未登録です。入力した情報を確認してください。'];
        }

        $params = [
            'id' => $result->id,
            'tel' => $r->tel,
        ];

        // メールアドレス照合に成功
        return ['status_code' => 200, 'params' => $params, 'success_messages' => ['再発行用パスワードの送信に成功しました。']];
    }

    public function search (Request $r) {
        if (!isset($r->keyword)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        if (null === ($result = Child::where('first_name', 'LIKE', '%'.$r->keyword.'%')->orWhere('last_name', 'LIKE', '%'.$r->keyword.'%')->orderBy('updated_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function list () {
        $child_select = ['id', 'first_name', 'last_name', 'tel', 'image'];

        if (null === ($result = Child::select($child_select)->orderBy('updated_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfFather (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400];
        }
        $result = [];
        $child_select = ['id', 'image', 'first_name', 'last_name', 'company', 'tel', 'email'];

        if (null === ($list = FatherRelation::select('child_id')->where('father_id', (int)$r->father_id)->orderBy('updated_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($result[] = Child::select($child_select)->where('id', $l->child_id)->first())) {
                $result[$i] = [];
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfMeeting (Request $r) {
        $result = [];
        $child_select = ['id', 'image', 'last_name', 'first_name'];

        if (null === ($list = MeetingApprovals::select('child_id')->where('meeting_id', (int)$r->meeting_id)->orderBy('updated_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $l) {
            if (null === ($result[] = Child::select($child_select)->find($l->child_id))) {
                return ['status_code' => 400];
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfMeetingNotifyUnapprovel (Request $r) {
        if (!isset($r->meeting_id)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        $result = [];
        $child_select = ['id', 'image', 'last_name', 'first_name', 'tel'];
        $meeting_approvals_select = ['approval_at'];

        if (null === ($list = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$r->meeting_id)->whereNull('approval_at')->orderBy('updated_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($result[] = Child::select($child_select)->where('id', $l->child_id)->get())) {
                return ['status_code' => 400];
            }
            $result[$i]['meeting_approval'] = $l->approval_at;
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfMeetingNotifyApprovel (Request $r) {
        if (!isset($r->meeting_id)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        $result = [];
        $child_select = ['id', 'image', 'last_name', 'first_name', 'tel'];
        $meeting_approvals_select = ['approval_at'];

        if (null === ($list = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $r->meeting_id)->whereNotNull('approval_at')->orderBy('updated_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($result[] = Child::select($child_select)->where('id', $l->child_id)->get())) {
                return ['status_code' => 400];
            }
            $result[$i]['meeting_approval'] = $l->approval_at;
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function detail (Request $r, $child_id) {
        if (!isset($child_id)) {
            return ['status_code' => 400];
        }

        $child_select = ['email', 'tel', 'last_name', 'first_name', 'identity', 'image', 'company'];
        $father_relations_select = ['hire_at'];

        // 親詳細の取得に成功
        if (null === ($params = Child::select($child_select)->where('id', (int)$child_id)->first())) {
            return ['status_code' => 400];
        }

        // 親画面から他の親としてアクセスすれば、404となります。
        $err = 'アクセスできません。';
        if (request()->route()->action['as'] == 'cdp') {
            abort_if(null === session()->get('fathers') || null === ($rel = FatherRelation::where('child_id', (int)$child_id)->where('father_id', (int)session()->get('fathers')['id'])->first()), 404, $err);
            unset($params->email);
            unset($params->tel);
        }

        // 同じく子画面から他の親の詳細ページをアクセスすれば、404となります。
        if (request()->route()->action['as'] == 'cdc') {
            abort_if(null === session()->get('children') || (int)session()->get('children')['id'] != (int)$child_id, 404, $err);
        }

        if (request()->route()->action['as'] == 'cdp') {
            if (null === ($params->father_relations = FatherRelation::select($father_relations_select)->where('child_id', (int)$child_id)->where('father_id', (int)$r->father_id)->first())) {
                $params->father_relations = new \stdClass();
            }
        }

        return ['status_code' => 200, 'params' => $params];
    }

    public function updateImage (Request $r, $child_id=null) {
        if (isset($r->child_id)) {
            $child_id = $r->child_id;
        }
        $child_id = request()->route()->action['as'] == 'cia' ? (int)$child_id : (int)session()->get('children')['id'];

        if (!isset($r->image) || !isset($child_id)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        if (count(Storage::disk('private')->files('/')) >= 9999) {
            Log::critical('ストレージの限界を超えています。9999個ファイルまで保存可能ですので、不要なファイルを削除して下さい。');
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // ファイルサイズは5MiB以内
        Validator::extend('image_size', function ($attribute, $value, $params, $validator) {
            return $this->imagesize($value);
        });

        // ミームタイプ
        Validator::extend('image_meme', function ($attribute, $value, $params, $validator) {
            return $this->imagememe($value);
        });

        // バリデーションエラー
        $validate = Validator::make($r->all(), ['image' => 'image_size|image_meme']);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $filename = $this->uuidv4().'.jpg';
        $oldimg = null;

        try {
            DB::beginTransaction();

            $image = base64_decode(substr($r->image, strpos($r->image, ',') + 1));
            Storage::disk('private')->put($filename, $image);
            $this->fiximg($filename);

            $child = Child::find((int)$child_id);
            if (!is_null($child->image) && $child->image != '/assets/default/avatar.jpg') {
                $oldimg = str_replace('/files/', '', $child->image);
                if (!Storage::disk('private')->exists($oldimg)) {
                    Log::warning($oldimg.'というパスは不正です。');
                    $oldimg = null;
                }
            }
            $child->image = '/files/'.$filename;
            $child->save();

            if (request()->route()->action['as'] == 'cic') {
                $login_user_datum = $child->toArray();
                unset($login_user_datum['password']);

                // セッションに保存する
                session()->put('children', $login_user_datum);
            }

            DB::commit();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            Storage::disk('private')->delete($filename);
            DB::rollback();
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        if (!is_null($oldimg)) {
            Storage::disk('private')->delete($oldimg);
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['画像の更新に成功しました。']];
    }

    public function updateProfile (Request $r, $child_id=null) {
        if (isset($r->child_id)) {
            $child_id = $r->child_id;
        }
        $child_id = request()->route()->action['as'] == 'cua' ? (int)$child_id : (int)session()->get('children')['id'];

        if (!isset($child_id)) {
            return ['status_code' => 400, 'error_messages' => ['子の更新に失敗しました。']];
        }

        // 電話番号の文字数。
        Validator::extend('tel_size', function ($attribute, $value, $params, $validator) {
            return $this->telsize($value);
        });

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'email' => 'required|max:255|email',
            'tel' => 'required|numeric|starts_with:0|tel_size',
            'last_name' => 'required|max:100',
            'first_name' => 'required|max:100',
            'identity' => 'required|max:20|alpha_num',
            'company' => 'max:100',
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $update = [
            'email' => $r->email,
            'tel' => $r->tel,
            'last_name' => $r->last_name,
            'first_name' => $r->first_name,
            'identity' => $r->identity,
            'company' => $r->company,
        ];

        try {
            Child::where('id', (int)$child_id)->update($update);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['子の更新に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['子の更新に成功しました。']];
    }

    public function updatePassword (Request $r, $child_id=null) {
        if (isset($r->child_id)) {
            $child_id = $r->child_id;
        }
        else if (isset($r->token)) {
            $child_id = TelActivation::select('id')->where('token', $r->token)->first()->id;
        }
        else if (null !== session()->get('children')['id']) {
            $child_id = (int)session()->get('children')['id'];
        }

        if (is_null($child_id) && !isset($r->token)) {
            return ['status_code' => 400, 'error_messages' => ['パスワードの更新に失敗しました。']];
        }

        if (isset($r->token)) {
            if (null === ($ta = TelActivation::select('child_id')->where('token', $r->token)->first())) {
                return ['status_code' => 400, 'error_messages' => ['パスワードの更新に失敗しました。']];
            }

            $child_id = $ta->child_id;
        }

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'password' => ['required', 'min:8', 'max:72', 'confirmed', new \App\Rules\Hankaku],
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $update = [
            'password' => Hash::make($r->password),
        ];

        try {
            Child::where('id', (int)$child_id)->update($update);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['パスワードの更新に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['パスワードの更新に成功しました。']];
    }

    public function withdrawal (Request $r) {
        $child_id = request()->route()->action['as'] == 'cwa' ? (int)$r->child_id : (int)session()->get('children')['id'];

        // 削除成功
        try {
            // DBに入ります。
            DB::beginTransaction();

            $child = Child::find($child_id);
            $img = $child->image;
            $child->delete();

            if (!is_null($img) && $img != '/assets/default/avatar.jpg') {
                $img = str_replace('/files/', '', $child->image);
                if (!Storage::disk('private')->exists($img)) {
                    Log::warning($img.'というパスは不正です。');
                }
                else {
                    Storage::disk('private')->delete($img);
                }
            }

            Session::forget($this->getGuard());
            DB::commit();
         } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            DB::rollback();
            return ['status_code' => 400];
        }

        // 削除失敗
        return ['status_code' => 200];
    }
}
