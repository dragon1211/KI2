<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;

use App\Models\Contacts;

class ContactsController extends Controller {
    public function register (Request $r) {
        $validate = Validator::make($r->all(), [
            'email' => 'required|max:255|email',
            'message' => 'required|max:1000'
        ]);
        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $insert = [
            'email' => $r->email,
            'message' => $r->message,
        ];

        try {
            Contacts::create($insert);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => 'お問い合わせの送信に失敗しました。'];
        }

        // 成功
        return ['status_code' => 200, 'params' => $insert];
    }
}
