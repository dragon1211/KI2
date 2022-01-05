<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;

// use App\Models\LoginLimits;

trait AuthenticationTrait {
    public function login (Request $r) {
        // if (null === $r->server('HTTP_USER_AGENT')) {
        //     return ['status_code' => 400, 'error_message' => ['不正なuser_agent。']];
        // }

        // if (null !== ($ll = LoginLimits::where('user_agent', $r->server('HTTP_USER_AGENT'))->first())) {
        //     if ((time() >= strtotime($ll->updated_at) + 600) === false) {
        //         LoginLimits::where('user_agent', $r->server('HTTP_USER_AGENT'))->delete();
        //     }
        //     if ($ll->fail_number >= 10) {
        //         return ['status_code' => 400, 'error_message' => ['10回連続で失敗しましたので、10分、ログインロックになりました。']];
        //     }
        // }

        if ($this->getGuard() == 'children') {
            Validator::extend('tel_size', function ($attribute, $value, $params, $validator) {
                return $this->telsize($value);
            });
        }

        $chk = $this->getGuard() == 'children' ?
            ['tel', $r->tel, 'numeric|starts_with:0|tel_size'] :
            ['email', $r->email, 'max:255|email'];

        $validate = Validator::make($r->all(), [
            $chk[0] => 'required|'.$chk[2],
            'password' => ['required', 'min:8', 'max:72', new \App\Rules\Hankaku],
        ]);

        // バリデーションエラー
        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        // 存在しない場合
        if (null === ($get = $this->getModel()->where($chk[0], $chk[1])->first())) {
            return ['status_code' => 400, 'error_message' => ['ログインに失敗しました。10回連続で失敗すると、一定期間ログインできなくなります。']];
        }

        // パスワードが異なる場合
        if (!Hash::check($r->password, $get->password)) {
            // if ($ll = LoginLimits::where('user_agent', $r->server('HTTP_USER_AGENT'))->first()) {
            //     LoginLimits::where('user_agent', $r->server('HTTP_USER_AGENT'))->update(['fail_number' => $ll->fail_number+1]);
            // }
            // else {
            //     LoginLimits::create(['user_agent' => $r->server('HTTP_USER_AGENT'), 'fail_number' => 1]);
            // }
            return ['status_code' => 400, 'error_message' => ['ログインに失敗しました。10回連続で失敗すると、一定期間ログインできなくなります。']];
        }

        // 既にセッションがあれば、ログアウトします。
        if (Session::has('children')) Session::forget('children');
        if (Session::has('fathers'))  Session::forget('fathers');
        if (Session::has('admins'))   Session::forget('admins');

        // セッションを想像する
        $guard = $this->getGuard();
        if (!$r->session()->has($guard)) {
            // 認証されたデータのpassword以外を把握する
            $login_user_datum = $get->toArray();
            unset($login_user_datum['password']);
            // セッションに保存する
            $r->session()->put($guard, $login_user_datum);
        }

        return ['status_code' => 200, 'params' => ['id' => $login_user_datum['id']]];
    }

    public function logout () {
        // セッションを破壊すると、ログイン画面に移転する。
        Session::forget($this->getGuard());

        return redirect(request()->route()->action['prefix'].'/login');
    }
}
