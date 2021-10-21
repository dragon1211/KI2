<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;

use App\Models\Admin;
use App\Models\LoginLimits;

class AdminController extends Controller {
    protected $guard = 'admins';

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

        $validate = Validator::make($r->all(), [
            'email' => 'required|max:255|email',
            'password' => 'required|min:8|max:72',
        ]);

        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        // 存在しない場合
        if (null === ($admin = Admin::select('id', 'email', 'password')->where('email', $r->email)->first())) {
            return ['status_code' => 400, 'error_message' => ['このアカウントが存在しません。']];
        }

        // パスワードが異なる場合
        if (!Hash::check($r->password, $admin->password)) {
            // if ($ll = LoginLimits::where('user_agent', $r->server('HTTP_USER_AGENT'))->first()) {
            //     LoginLimits::where('user_agent', $r->server('HTTP_USER_AGENT'))->update(['fail_number' => $ll->fail_number+1]);
            // }
            // else {
            //     LoginLimits::create(['user_agent' => $r->server('HTTP_USER_AGENT'), 'fail_number' => 1]);
            // }
            return ['status_code' => 400, 'error_message' => ['ログインに失敗しました。10回連続で失敗すると、一定期間ログインできなくなります。']];
        }

        // セッションを想像する
        if (Auth::guard('admins')->attempt($r->all())) {
            Session::put('admin_email', $admin->email);
            Session::save();
        }
        return ['status_code' => 200];
    }

    public function checkLogin () {
        // セッションがあれば、管理者のトップページに移転する。なければ、ログイン画面となる。
        if (Session::has('admin_email')) {
            return redirect('/admin/meeting');
        }

        return view('admin.login');
    }

    public function logout () {
        // セッションを破壊すると、ログイン画面に移転する。
        if (Session::has('admin_email')) {
            Session::forget('admin_email');
        }

        return redirect('/admin/login');
    }
}
