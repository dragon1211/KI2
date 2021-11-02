<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

use App\Models\Father;
use App\Models\FatherRelation;
use App\Models\EmailActivation;
use App\Mail\FathersRegistrationTemporaryMail;
use App\Mail\FathersRegistrationMainMail;

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

        if ($result = Father::select('id')->where('email', $r->email)->first()) {
            // メールアドレス照合に失敗
            return ['status_code' => 400, 'error_messages' => ['メールアドレスが未登録です。入力した情報を確認してください。']];
        }

        $token = bin2hex(random_bytes(16));
        $create = [
            'type' => 1,
            'father_id' => $result->id,
            'email' => $r->email,
            'token' => $token,
            'ttl' => date('Y-m-d H:i:s', time()+28800)
        ];

        try {
            // DBに入ります。
            EmailActivation::create($create);

            // メールを送ります。
            Mail::to($r->email)->send(new FathersRegistrationTemporaryMail($token));
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
            // すでにemail_activationsに登録されている場合
            return ['status_code' => 400, 'error_messages' => ['入力したメールアドレスは既に登録済みです。同じメールアドレスは使用できません。']];
        }
        else {
            $token = bin2hex(random_bytes(16));
            $create = ['email' => $r->email, 'token' => $token, 'ttl' => date('Y-m-d H:i:s', time()+28800)];

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
        }

        // 仮登録に成功した場合
        return ['status_code' => 200, 'token' => $token, 'success_messages' => ['親の仮登録に成功しました。8時間以内に本登録を完了させてください。']];
    }

    public function registerMain (Request $r) {
        $validate = Validator::make($r->all(), [
            'token' => 'required',
            'password' => 'required|min:8|max:72|confirmed',
            'company' => 'max:100',
            'image' => 'max:1024|mimes:jpg,png,gif',
            'profile' => 'max:1000',
            'tel' => 'required|unique:children|numeric|digits_between:0,99999999999|starts_with:0',
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

        try {
            // DBの値の準備。
            $create = [
                'email' => $get->email,
                'password' => Hash::make($r->password),
                'company' => $r->company,
                'image' => $r->image,
                'profile' => $r->profile,
                'tel' => $r->tel,
            ];

            // DBに入ります。
            Father::create($create);

            // メールを送ります。
            Mail::to($get->email)->send(new FathersRegistrationMainMail());

            // email_activationsから削除します。
            EmailActivation::where('token', $r->token)->delete();
        } catch (\Throwable $e) {
            // 本登録に失敗
            Log::critical($e->getMessage());
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

        if (null === ($result = Father::select($father_select)->where('id', (int)$father_id)->orderBy('created_at', 'desc')->first())) {
            // 親詳細の取得に失敗
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 親詳細の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function updateImage (Request $r, $father_id) {
        if (!isset($r->image) || !isset($father_id)) {
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // ファイルサイズは10MiB以内
        Validator::extend('image_size', function ($attribute, $value, $params, $validator) {
            try {
                return strlen(base64_decode($value)) < 1048576;
            } catch (\Throwable $e) {
                Log::critical($e->getMessage());
                return false;
            }
        });

        // ミームタイプ
        Validator::extend('image_meme', function ($attribute, $value, $params, $validator) {
            try {
                return (
                    mime_content_type($value) == 'image/jpeg' || // jpg
                    mime_content_type($value) == 'image/png'  || // png
                    mime_content_type($value) == 'image/gif'     // gif
                );
            } catch (\Throwable $e) {
                Log::critical($e->getMessage());
                return false;
            }
        });

        // バリデーションエラー
        $validate = Validator::make($r->all(), ['image' => 'image_size|image_meme']);
        // 300x300px

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            $ext = explode('/', mime_content_type($r->image))[1];
            $filename = uniqid() . '.'.$ext;
            $image = base64_decode(substr($r->image, strpos($r->image, ',') + 1));
            Storage::disk('public')->put($filename, $image);

            $update = [
                'image' => '/storage/'.$filename
            ];

            Father::where('id', (int)$father_id)->update($update);
        } catch (\Throwable $e) {
            // 親プロフィール画像のアップロードに失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 親プロフィール画像のアップロードに成功
        return ['status_code' => 200, 'success_messages' => ['親の更新に成功しました。']];
    }

    public function updateProfile (Request $r, $father_id) {
        if (!isset($father_id)) {
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'email' => 'required|max:255|email',
            'company' => 'max:100',
            'profile' => 'max:1000',
            'tel' => 'required|numeric|digits_between:0,99999999999|starts_with:0',
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

    public function updatePassword (Request $r, $father_id) {
        if (!isset($father_id)) {
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'password' => 'required|min:8|max:72|confirmed',
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $update = [
            'password' => Hash::make($r->password)
        ];

        try {
            Father::where('id', (int)$father_id)->update($update);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['親の更新に成功しました。']];
    }

    public function withdrawal (Request $r) {
        try {
            Father::where('id', (int)$r->father_id)->delete();
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
