<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Child;
use App\Models\FatherRelation;
use App\Models\Meeting;
use App\Models\MeetingApprovals;

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
            if (null === ($fr = FatherRelation::where('child_id', $child->id)->where('father_id', (int)$r->father_id)->first())) {
                FatherRelation::create($create);
                if (null !== ($meet = Meeting::select('id', 'is_favorite')->where('father_id', (int)$r->father_id)->get())) {
                    foreach ($meet as $m) {
                        if ($m->is_favorite) {
                            $addapprove = [
                                'meeting_id' => $m->id,
                                'child_id' => $child->id,
                                'approval_at' => null,
                            ];

                            MeetingApprovals::create($addapprove);
                        }
                    }
                }
            }
            else {
                return ['status_code' => 400, 'error_messages' => ['すでに追加されました']];
            }
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['子の追加に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['子の追加に成功しました。'], 'params' => ['child_id' => $child->id]];
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
            FatherRelation::where('father_id', (int)$r->father_id)->where('child_id', (int)$child_id)->update($update);
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
