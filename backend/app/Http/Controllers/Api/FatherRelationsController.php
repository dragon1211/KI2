<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Child;
use App\Models\FatherRelation;

class FatherRelationsController extends Controller {
    public function register (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400, 'error_messages' => ['子の追加に失敗しました。']];
        }

        $validate = Validator::make($r->all(), [
            'identity' => 'required|max:20|alpha_num',
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if (null === ($child = Child::select('id')->where('identity', $r->identity)->first())) {
            return ['status_code' => 400, 'error_messages' => ['子の追加に失敗しました。']];
        }

        $create = [
            'father_id' => $r->father_id,
            'child_id' => $child->id,
            'hire_at' => date('Y-m-d H:i:s', time()),
        ];

        try {
            FatherRelation::create($create);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['子の追加に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['子の追加に成功しました。'], 'params' => ['child_id' => $child_id]];

        // 1.POSTで受け取ったidentityと紐づくchildrenのデータのidを取得。
        // 2.1で取得したidとPOSTで受け取ったfather_idをfather_relatoinsに登録。（hire_atはPOST時の日時）
    }

    public function updateHireDate (Request $r, $child_id) {
        if (!isset($child_id) || !isset($r->father_id)) {
            return ['status_code' => 400, 'error_messages' => ['子の入社日の更新に失敗しました。']];
        }

        $validate = Validator::make($r->all(), [
            'hire_at' => 'date',
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $update = [
            'hire_at' => date('Y-m-d H:i:s', strtotime($r->hire_at)),
        ];

        try {
            FatherRelation::where('father_id', $r->father_id)->where('child_id', $child_id)->update($update);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['子の入社日の更新に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['子の入社日の更新に成功しました。']];
    }

    public function deleteRelationChild ($child_id) {
        if (!isset($child_id)) {
            return ['status_code' => 400, 'error_messages' => ['子の削除に失敗しました。']];
        }

        try {
            FatherRelation::where('father_id', session()->get('fathers')['id'])->where('child_id', $child_id)->delete();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['子の削除に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['子の削除に成功しました。']];
    }
}
