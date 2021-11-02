<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Child;
use App\Models\Meeting;
use App\Models\MeetingApprovals;
use App\Models\FatherRelation;

class MeetingApprovalsController extends Controller {
    public function register (Request $r, $meeting_id) {
        if (!isset($meeting_id) || !isset($r->children) || count($r->children) == 0) {
            return ['status_code' => 400];
        }

        // 承知登録に失敗
        if (null === (MeetingApprovals::where('id', (int)$r->meeting_id)->where('child_id', (int)$r->child_id)->first())) {
            return ['status_code' => 400];
        }

        $create = ['meeting_id' => $meeting_id];

        try {
            foreach ($r->children as $child) {
                $create['child_id'] = $child;
                MeetingApprovals::where('meeting_id', (int)$meeting_id)->create($create);
            }
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        // 承知登録に成功
        return ['status_code' => 200];
    }

    public function delete ($meeting_id) {
        if (!isset($meeting_id)) {
            return ['status_code' => 400];
        }

        try {
            MeetingApprovals::where('meeting_id', (int)$meeting_id)->delete();
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }

    public function registerApproval (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->child_id)) {
            return ['status_code' => 400, 'error_messages' => ['承認に失敗しました。']];
        }

        if (null === (MeetingApprovals::where('id', (int)$r->meeting_id)->where('child_id', (int)$r->child_id)->first())) {
            return ['status_code' => 400, 'error_messages' => ['承認に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['承認しました。']];
    }

    public function listChildrenOfMeeting (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->child_id)) {
            return ['status_code' => 400, 'error_messages' => ['承認に失敗しました。']];
        }

        $meeting_approvals_select = ['id', 'child_id', 'approval_at'];
        $update = ['hire_at' => date('Y-m-d H:i:s', strtotime($r->hire_at))];

        if (null === ($params = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$r->meeting_id)->where('child_id', (int)$r->child_id)->get())) {
            
            return ['status_code' => 400, 'error_messages' => ['承認に失敗しました。']];
        }

        try {
            FatherRelation::where('child_id', (int)$r->child_id)->update($update);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['登録に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['承認しました。']];
    }

    public function listChildrenOfApprovel (Request $r) {
        if (!isset($r->meeting_id)) {
            return ['status_code' => 400];
        }

        $meeting_approvals_select = ['id', 'child_id', 'approval_at'];
        $child_select = ['id', 'image', 'last_name', 'first_name'];

        if (null === ($params = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$r->meeting_id)->whereNotNull('approval_at')->get())) {
            // エラーの場合
            return ['status_code' => 400];
        }

        foreach ($params as $p) {
            if (null === ($p->child_id = Child::select($child_select)->where('id', (int)$p->child_id)->first())) {
                return ['status_code' => 400];
            }
        }

        return ['status_code' => 200, 'params' => $params];
    }

    public function listChildrenOfUnapprovel (Request $r) {
        if (!isset($r->meeting_id)) {
            return ['status_code' => 400];
        }

        $meeting_select = ['id', 'child_id', 'approval_at'];
        $child_select = ['id', 'image', 'last_name', 'first_name'];

        if (null === ($params = MeetingApprovals::select($meeting_select)->where('meeting_id', (int)$r->meeting_id)->whereNull('approval_at')->get())) {
            // エラーの場合
            return ['status_code' => 400];
        }

        foreach ($params as $p) {
            if (null === ($p->child_id = Child::select($child_select)->where('id', (int)$p->child_id)->first())) {
                return ['status_code' => 400];
            }
        }

        return ['status_code' => 200, 'params' => $params];
    }

    public function deleteRelationMeeting ($meeting_id) {
        if (!isset($meeting_id)) {
            return ['status_code' => 400];
        }

        try {
            MeetingApprovals::where('meeting_id', (int)$meeting_id)->delete();
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }

    public function deleteRelationChild ($child_id) {
        if (!isset($child_id)) {
            return ['status_code' => 400];
        }

        try {
            MeetingApprovals::where('child_id', (int)$child_id)->delete();
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }
}
