<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

use App\Models\Father;
use App\Models\Child;
use App\Models\Meeting;
use App\Models\MeetingApprovals;
use App\Models\FatherRelation;

use App\Mail\MeetingEditNotification;
use App\Mail\MeetingEditAwareness;

class MeetingApprovalsController extends Controller {
    public function countNonApproval (Request $r) {
        return MeetingApprovals::where('child_id', session()->get('children')['id'])->whereNull('approval_at')->count();
    }

    public function countIncomplete (Request $r) {
        $count = 0;

        if (null !== ($list = Meeting::select('id')->where('father_id', (int)session()->get('fathers')['id'])->get())) {
            foreach ($list as $i => $l) {
                if (null === ($apr = MeetingApprovals::select('id')->where('meeting_id', (int)$l->id)->get())) {
                    continue;
                }

                $cnt = MeetingApprovals::select('id')->whereNotNull('approval_at')->where('meeting_id', (int)$l->id)->count();
                $apr = count($apr);
    
                if ($apr != 0 && $apr == $cnt) {
                    continue;
                }
    
                $count++;
            }
        }

        return $count;
    }

    public function register (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->children) || count(json_decode($r->children)) == 0) {
            return ['status_code' => 400];
        }

        $create = ['meeting_id' => $r->meeting_id];

        try {
            foreach (json_decode($r->children) as $child) {
                if (null === ($c = Child::where('id', (int)$child)->first())) {
                    return ['status_code' => 400];
                }

                $create['child_id'] = $child;
                MeetingApprovals::create($create);
                Mail::to($c->email)->send(new MeetingEditNotification(session()->get('fathers')['company'], $r->meeting_id));
            }
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        // 承知登録に成功
        return ['status_code' => 200];
    }

    public function delete (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->children) || count($r->children) == 0) {
            return ['status_code' => 400];
        }

        try {
            DB::beginTransaction();

            foreach ($r->children as $k => $v) {
                $meap = MeetingApprovals::where('child_id', (int)$v)->where('meeting_id', (int)$r->meeting_id);
                $meap->delete();
            }

            DB::commit();
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            DB::rollback();
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }

    public function registerApproval (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->child_id)) {
            return ['status_code' => 400, 'error_messages' => ['承認に失敗しました。']];
        }

        if (null === (MeetingApprovals::where('meeting_id', (int)$r->meeting_id)->where('child_id', (int)$r->child_id)->first())) {
            return ['status_code' => 400, 'error_messages' => ['承認に失敗しました。']];
        }

        if (null === ($meet = Meeting::where('id', (int)$r->meeting_id)->first())) {
            return ['status_code' => 400, 'error_messages' => ['承認に失敗しました。']];
        }

        if (null === ($father = Father::where('id', (int)$meet->father_id)->first())) {
            return ['status_code' => 400, 'error_messages' => ['承認に失敗しました。']];
        }

        // $update = ['approval_at' => null];
        $update = ['approval_at' => date('Y-m-d H:i:s')];

        try {
            MeetingApprovals::where('meeting_id', (int)$r->meeting_id)->where('child_id', (int)$r->child_id)->update($update);
            Mail::to($father->email)->send(new MeetingEditAwareness(session()->get('children')['last_name'], session()->get('children')['first_name'], $r->meeting_id));
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
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
        $child_select = ['id', 'image', 'last_name', 'first_name', 'tel', 'email'];

        if (null === ($params = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$r->meeting_id)->whereNotNull('approval_at')->get())) {
            // エラーの場合
            return ['status_code' => 400];
        }

        foreach ($params as $p) {
            if (null === ($p->child = Child::select($child_select)->where('id', (int)$p->child_id)->first())) {
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
        $child_select = ['id', 'image', 'last_name', 'first_name', 'tel', 'email'];

        if (null === ($params = MeetingApprovals::select($meeting_select)->where('meeting_id', (int)$r->meeting_id)->whereNull('approval_at')->get())) {
            // エラーの場合
            return ['status_code' => 400];
        }

        foreach ($params as $p) {
            if (null === ($p->child = Child::select($child_select)->where('id', (int)$p->child_id)->first())) {
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
