<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Father;
use App\Models\FatherRelation;
use App\Models\EmailActivations;

class FathersController extends Controller {
    public function login () {}

    public function requestPassword () {}

    public function registerTemporary (Request $r) {
        $validate = Validator::make($r->all(), [
            'email' => 'required|unique:father,email_activations|max:255|email|alpha_num'
        ]);

        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if ($get = Father::where('email', $r->email)->first()) {
            // すでにDBに登録されている場合
            return ['status_code' => 400, 'error_messages' => ['入力したメールアドレスは既に登録済みです。同じメールアドレスは使用できません。']];
        }
        else if ($get = EmailActivations::where('email', $r->email)->first()) {
            // すでにDBに登録されている場合
            return ['status_code' => 400, 'error_messages' => ['入力したメールアドレスは既に登録済みです。同じメールアドレスは使用できません。']];
        }
        else {
            $chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
            $token = '';
            for ($i = 1; $i < 15; $i++) {
                $token .= $chars[rand(0,35)];
            }

            $create = ['email' => $r->email, 'token' => $token, 'ttl' => date('Y-m-d H:i:s', time()+28800)];

            try {
                EmailActivations::create($create);
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
            'tel' => 'required|unique:children|max:11|numeric|starts_with:0',
        ]);
        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $password = Hash::make($r->password);

        if ($get = EmailActivations::where('token', $r->token)->first() && strtotime($get->ttl) > time()) {
            // 有効期限が切れている場合
            return['status_code' => 401, 'error_messages' => ['仮登録の有効期限が切れました。改めて管理者にお問い合わせいただき、再登録を行ってください。']];
        }

        try {
            $create = [
                'email' => $get->email,
                'email_verified_at' => date('Y-m-d H:i:s'),
                'password' => $password,
                'company' => $r->company,
                'image' => $r->image,
                'profile' => $r->profile,
                'tel' => $r->tel,
            ];

            Father::create($create);
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
        $father_select = ['id', 'company', 'image'];
        $father_relation_select = ['created_at'];

        if (null === ($list = Father::select($father_select)->where('company', 'LIKE', '%'.$r->keyword.'%')->orderBy('created_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['relation'] = FatherRelation::select($father_relation_select)->where('father_id', $l->id)->first())) {
                return ['status_code' => 400];
            }
        }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function list () {
        $result = [];
        $father_select = ['id', 'company', 'image'];
        $father_relation_select = ['created_at'];

        if (null === ($list = Father::select($father_select)->orderBy('created_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['relation'] = FatherRelation::select($father_relation_select)->where('father_id', $l->id)->first())) {
                return ['status_code' => 400];
            }
        }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfChild (Request $r) {
        $result = [];
        $father_select = ['id', 'company', 'image'];

        if (null === ($list = FatherRelation::select('father_id')->where('child_id', $r->child_id)->orderBy('created_at', 'desc')->get())) {
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

        if (null === ($result = Father::select($father_select)->where('id', $father_id)->orderBy('created_at', 'desc')->get()->toArray())) {
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

        // バリデーションエラー
        $validate = Validator::make($r->all(), ['image' => 'max:1024|mimes:jpg,png,gif']);
        // 300x300px

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            Father::where('id', $father_id)->update($r->all());
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
            'email' => 'required|unique:fathers|max:255|email|alpha_num',
            'company' => 'max:100',
            'profile' => 'max:1000',
            'tel' => 'required|unique:fathers|max:11|numeric|starts_with:0',
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            Father::where('id', $father_id)->update($r->all());
        } catch (\Throwable $e) {
            // 親プロフィール更新失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 親プロフィール更新成功
        return ['status_code' => 200, 'success_messages' => ['親の更新に成功しました。']];
    }

    public function updatePassword (Request $r, $father_id) {
        if (!isset($r->image) || !isset($father_id)) {
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'password' => 'required|min:8|max:72|confirmed',
        ]);

        $validate->after(function ($validate) {
            if (count($r->image) > 10) {
                $validate->errors()->add('count', '10枚以上登録できません。');
            }
        });

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            Father::where('id', $father_id)->update($r->all());
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['親の更新に成功しました。']];
    }

    public function withdrawal ($father_id) {
        try {
            Father::where('id', $father_id)->delete();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の削除に失敗しました。']];
        }
        
        // 成功
        return ['status_code' => 200, 'success_messages' => ['親の削除に成功しました。']];
    }

    public function delete ($meeting_id) {
        try {
            Meeting::where('id', $meeting_id)->delete();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['親の削除に失敗しました。']];
        }
        
        // 成功
        return ['status_code' => 200, 'success_messages' => ['親の削除に成功しました。']];
    }
}
