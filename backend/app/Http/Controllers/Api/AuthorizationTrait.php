<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Http\Request;

trait AuthorizationTrait {
    public function checkLogin () {
        $viewpath = str_replace('-', '_', request()->route()->action['prefix']);
        $loginpage = $viewpath.'/'.($this->getGuard() == 'admins' ? 'login' : 'auth');

        if (Session::has($this->getGuard())) {
            return redirect($viewpath.'/meeting');
        }

        return view($loginpage);
    }
}