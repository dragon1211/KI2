<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\LoginLimits;

trait AuthenticationTrait {
    private function makeSession ($guard, $db) {
        //session()->regenerate();

        if (!session()->has($guard)) {
            // 認証されたデータのpasswordとremember_token以外を把握する
            unset($db['password']);
            unset($db['remember_token']);
            // セッションに保存する
            session()->put($guard, $db);
        }

        return $db;
    }

    public function checkSession () {
        if (isset($_COOKIE['remember_token']) && !is_null($_COOKIE['remember_token'])) { // クッキーがある場合
            if (null !== ($get = $this->getModel()->where('remember_token', $_COOKIE['remember_token'])->first())) { // トークンがある場合
                // セッションを想像する
                $login_user_datum = $this->makeSession($this->getGuard(), $get->toArray());

                return ['status_code' => 200, 'params' => ['id' => $login_user_datum['id']]];
            }
        }
        if (session()->has($this->getGuard())) {
            if (null !== ($get = $this->getModel()->where('id', session()->get($this->getGuard())['id'])->first())) { // トークンがある場合
                // セッションを想像する
                $login_user_datum = $this->makeSession($this->getGuard(), $get->toArray());

                return ['status_code' => 200, 'params' => ['id' => $login_user_datum['id']]];
            }

        }

        return ['status_code' => 202];
    }

    public function login (Request $r) {
        $loginid = $this->getGuard() == 'children' ? $r->tel : $r->email;

        if (null !== ($ll = LoginLimits::where('login_id', $loginid)->first())) {
            if ((time() >= strtotime($ll->updated_at) + 600) === true) {
                LoginLimits::where('login_id', $loginid)->delete();
            }

            if (null !== ($ll = LoginLimits::where('login_id', $loginid)->first()) && $ll->fail_number >= 10) {
                return ['status_code' => 400, 'error_message' => ['10回連続で失敗したため、10分間はログインができなくなりました。']];
            }
        }

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
            if (null !== ($loglim = LoginLimits::where('login_id', $loginid)->first())) {
                LoginLimits::where('login_id', $loginid)->increment('fail_number');
            }
            else {
                LoginLimits::create(['login_id' => $loginid, 'fail_number' => 1]);
            }

            return ['status_code' => 400, 'error_message' => ['ログインに失敗しました。10回連続で失敗すると、一定期間ログインできなくなります。']];
        }

        // パスワードが異なる場合
        if (!Hash::check($r->password, $get->password)) {
            if (null !== ($loglim = LoginLimits::where('login_id', $loginid)->first())) {
                LoginLimits::where('login_id', $loginid)->increment('fail_number');
            }
            else {
                LoginLimits::create(['login_id' => $loginid, 'fail_number' => 1]);
            }

            return ['status_code' => 400, 'error_message' => ['ログインに失敗しました。10回連続で失敗すると、一定期間ログインできなくなります。']];
        }

        // 既にセッションがあれば、ログアウトします。
        //if (Session::has('children')) Session::forget('children');
        //if (Session::has('fathers'))  Session::forget('fathers');
        //if (Session::has('admins'))   Session::forget('admins');
        //unset($_COOKIE['remember_token']);
        //setcookie('remember_token', '', time() - 3600, '/', $_SERVER['HTTP_HOST'], 0, 1);

        $expire = (int)time() + ((int)config('session.lifetime') * 60);

        if ($r->remember_token == 'true') {
            $token = bin2hex(random_bytes(24));

            try {
                $this->getModel()->where('id', $get->id)->update(['remember_token' => $token]);
                $expire = (int)time()+157788000;
                setcookie('remember_token', $token, $expire, '/', $_SERVER['HTTP_HOST'], false, true);
            }
            catch (\Throwable $e) {
                Log::critical($e->getMessage());
                return ['status_code' => 400, 'error_message' => ['ログインに失敗しました。10回連続で失敗すると、一定期間ログインできなくなります。']];
            }
        }

        // セッションを想像する
        $login_user_datum = $this->makeSession($this->getGuard(), $get->toArray());
        Log::info([
            'expire' => $expire,
            'now' => time(),
            'env' => env('SESSION_LIFETIME'),
            'config' => config('session.lifetime')
        ]);

        return ['status_code' => 200, 'params' => ['id' => $login_user_datum['id'], 'expire' => (int)$expire * 1000]];
    }

    public function logout () {
        // セッションを破壊すると、ログイン画面に移転する。
        $guard = $this->getGuard();
        if (null !== $rem = $this->getModel()->select('remember_token')->where('id', session()->get($guard)['id'])->first()) {
            $this->getModel()->where('id', session()->get($guard)['id'])->update(['remember_token' => null]);
            unset($_COOKIE['remember_token']);
            setcookie('remember_token', '', time() - 3600, '/', $_SERVER['HTTP_HOST'], 0, 1);
        }

        Session::forget($guard);

        return redirect(request()->route()->action['prefix'].'/login');
    }
}
