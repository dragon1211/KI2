<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\FatherRelation;

class FatherRelationsController extends Controller {
    public function register (Request $r) {
        if (!isset($r->child_id) || !isset($r->father_id) || !isset($r->hire_at)) {
            return ['status_code' => 400, 'success_messages' => '子の登録に失敗しました。'];
        }

        $insert = [
            'father_id' => $r->father_id,
            'child_id' => $r->child_id,
            'hire_at' => date('Y-m-d H:i:s', strtotime($r->hire_at))
        ];

        if (FatherRelation::create($insert)) {
            return ['status_code' => 200, 'success_messages' => '子の登録に成功しました。'];
        }

        return ['status_code' => 400, 'success_messages' => '子の登録に失敗しました。'];
    }

    public function updateHireDate (Request $r, $child_id) {
        if (!isset($child_id) || !isset($r->father_id) || !isset($r->hire_at)) {
            return ['status_code' => 400, 'success_messages' => '子の入社日の更新に失敗しました。'];
        }

        $update = ['hire_at' => date('Y-m-d H:i:s', strtotime($r->hire_at))];

        if (FatherRelation::where('father_id', $r->father_id)->where('child_id', $child_id)->update($update)) {
            return ['status_code' => 200, 'success_messages' => '子の入社日の更新に成功しました。'];
        }

        return ['status_code' => 400, 'success_messages' => '子の入社日の更新に失敗しました。'];
    }

    public function deleteRelationFather ($father_id) {
        // 削除成功
        if (FatherRelation::where('father_id', $father_id)->delete()) {
            return ['status_code' => 200];
        }

        // 削除失敗
        return ['status_code' => 400];
    }

    public function deleteRelationChild ($child_id) {
        // 削除成功
        if (FatherRelation::where('child_id', $child_id)->delete()) {
            return ['status_code' => 200];
        }

        // 削除失敗
        return ['status_code' => 400];
    }
}
