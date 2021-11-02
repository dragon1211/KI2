<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Http\Request;

trait AuthorizationTrait {
    // XXX そもそもこのメソッド、使いますか？
    // 認可の処理はMiddlewareでやっているはずなので(このクラスがMiddlewareでcallされている、なら、ギリギリありですが)
    public function checkLogin () {
        // セッションがあれば、管理者のトップページに移転する。なければ、ログイン画面となる。
        if (Session::has($this->getGuard())) {
            // XXX リダイレクト先ですが「常に request()->route()->action['prefix'].'/meeting' 」固定ですか？
            // XXX そうでない場合は、これも「メソッドの戻り値にする」やり方のほうが自由度があると思います
            return redirect(request()->route()->action['prefix'].'/meeting');
        }

        return view(request()->route()->action['prefix'].'/login');
    }
}