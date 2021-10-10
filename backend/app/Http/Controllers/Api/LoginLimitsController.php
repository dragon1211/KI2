<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\LoginLimits;

class LoginLimitsController extends Controller {
    public function countFailure (Request $r) {
        // user_agentがなければ、エラーを出します。
        if (!isset($r->user_agent)) {
            return ['status_code' => 400, 'error_messages' => 'ユーザーエイジェントを読めません。'];
        }

        // 受取
        if ($get = LoginLimits::where('user_agent', $r->user_agent)->first()) {
            // 失敗数は10以上だと、エラーを出します。以内の場合、失敗数を増えます。
            if ($get->fail_number >= 10) {
                return ['status_code' => 400, 'error_messages' => 'ログインに失敗しました。10回連続で失敗すると、一定期間ログインできなくなります。'];
            }
            else {
                $update = ['fail_number' => $get->fail_number+1];
                LoginLimits::where('user_agent', $r->user_agent)->update($update);
            }
        }
        else {
            // まだこのuser_agentがなければ、追加します。
            $create = ['user_agent' => $r->user_agent, 'fail_number' => 1];
            LoginLimits::create($create);
        }

        return ['status' => 200];
    }

    public function delete (Request $r) {
        // 削除成功
        if (LoginLimits::where('user_agent', $r->user_agent)->delete()) {
            return ['status_code' => 200];
        }

        // 削除失敗
        return ['status_code' => 400];
    }
}
