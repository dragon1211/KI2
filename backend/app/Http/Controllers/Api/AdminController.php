<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use App\Http\Controllers\Api\AuthenticationTrait;
use App\Http\Controllers\Api\AuthorizationTrait;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AdminController extends Controller {
    use AuthenticationTrait;
    use AuthorizationTrait;

    /* Traitで使うメソッド */
    protected function getGuard () {
        return 'admins';
    }
    protected function getModel () {
        return new \App\Models\Admin();
    }
}
