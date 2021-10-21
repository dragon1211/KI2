<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\FatherRelation;

class FatherRelationsController extends Controller {
    public function updateHireDate (Request $r, $child_id) {
        if (!isset($child_id) || !isset($r->father_id) || !isset($r->hire_at)) {
            return ['status_code' => 400, 'success_messages' => ['子の入社日の更新に失敗しました。']];
        }

        $update = ['hire_at' => date('Y-m-d H:i:s', strtotime($r->hire_at))];

        try {
            FatherRelation::where('father_id', $r->father_id)->where('child_id', $child_id)->update($update);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'success_messages' => ['子の入社日の更新に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['子の入社日の更新に成功しました。']];
    }
}
