<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use App\Models\Child;
use App\Models\Father;
use App\Models\FatherRelation;
use App\Models\Meeting;
use App\Models\MeetingApprovals;

class FatherRelationsController extends Controller {
    public function checkNull (Request $r) {
        $father_id = request()->route()->action['as'] == 'chknull_parent' ? (int)session()->get('fathers')['id'] : (int)$r->father_id;

        if (FatherRelation::select('id')->where('father_id', $father_id)->count() == 0) {
            return ['status_code' => 401, 'error_messages' => ['契約上限数に達した為、メンバー追加できません。']];
        }

        return ['status_code' => 200];
    }

    public function check (Request $r) {
        $father_id = request()->route()->action['as'] == 'chk_parent' ? (int)session()->get('fathers')['id'] : (int)$r->father_id;

        $father = Father::select('relation_limit')->where('id', $father_id)->first();

        if ($father->relation_limit <= FatherRelation::select('id')->where('father_id', $father_id)->count()) {
            return ['status_code' => 401, 'error_messages' => ['契約上限数に達した為、メンバー追加できません。']];
        }

        return ['status_code' => 200];
    }

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

        if (null === ($father = Father::select('relation_limit')->where('id', (int)$r->father_id)->first())) {
            return ['status_code' => 400, 'error_messages' => ['子の追加に失敗しました。']];
        }

        if ($father->relation_limit <= FatherRelation::select('id')->where('father_id', (int)$r->father_id)->count()) {
            return ['status_code' => 401, 'error_messages' => ['契約上限数に達した為、メンバー追加できません。']];
        }

        $create = [
            'father_id' => $r->father_id,
            'child_id' => $child->id,
            'hire_at' => date('Y-m-d H:i:s', time()),
        ];

        try {
            DB::beginTransaction();
            if (null === ($fr = FatherRelation::where('child_id', $child->id)->where('father_id', (int)$r->father_id)->first())) {
                $rel = new FatherRelation;
                $rel->fill($create);
                $rel->push();

                if (null !== ($meet = Meeting::select('id', 'is_favorite')->where('father_id', (int)$r->father_id)->get())) {
                    foreach ($meet as $m) {
                        if ($m->is_favorite) {
                            $addapprove = [
                                'meeting_id' => $m->id,
                                'child_id' => $child->id,
                                'approval_at' => null,
                            ];

                            $apr = new MeetingApprovals;
                            $apr->fill($addapprove);
                            $apr->push();
                        }
                    }
                }

                DB::commit();
            }
            else {
                DB::rollback();
                return ['status_code' => 400, 'error_messages' => ['すでに追加されました']];
            }
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            DB::rollback();
            return ['status_code' => 400, 'error_messages' => ['子の追加に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['子の追加に成功しました。'], 'params' => ['child_id' => $child->id, 'limit' => $father->relation_limit]];
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
            DB::beginTransaction();

            $rel = FatherRelation::where('father_id', session()->get('fathers')['id'])->where('child_id', (int)$child_id);

            foreach (Meeting::where('father_id', session()->get('fathers')['id'])->get() as $m) {
                $apr = MeetingApprovals::where('child_id', (int)$child_id)->where('meeting_id', $m->id);
                $apr->delete();
            }

            $rel->delete();

            DB::commit();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            DB::rollback();
            return ['status_code' => 400, 'error_messages' => ['子の削除に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['子の削除に成功しました。']];
    }
}
