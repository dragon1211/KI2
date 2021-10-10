<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Child;
use App\Models\Meeting;
use App\Models\MeetingApprovals;

class MeetingApprovalsController extends Controller {
  public function register (Request $r) {}

  public function registerOfApproval (Request $r) {}

  public function listChildrenOfMeeting (Request $r) {}

  public function listChildrenOfApprovel (Request $r) {
    $meeting_select = ['id', 'child_id', 'approval_at'];
    $child_select = ['id', 'image', 'last_name', 'first_name'];

    // meeting_idでミーティングの許可があれば
    if ($params = MeetingApprovals::select($meeting_select)->where('meeting_id', $r->meeting_id)->whereNotNull('approval_at')->get()) {
      // 子を付いてみて。child_idがなければ、すぐ400になります。
      foreach ($params as $p) {
        if (!$p->child_id = Child::select($child_select)->where('id', $p->child_id)->first()) {
          return ['status' => 400];
        }
      }

      return ['status' => 200, 'params' => $params];
    }

    // エラーの場合
    return ['status' => 400];
  }

  public function listChildrenOfUnapprovel (Request $r) {
    $meeting_select = ['id', 'child_id', 'approval_at'];
    $child_select = ['id', 'image', 'last_name', 'first_name'];

    // meeting_idでミーティングの許可がなければ
    if ($params = MeetingApprovals::select($meeting_select)->where('meeting_id', $r->meeting_id)->whereNull('approval_at')->get()) {
      // 子を付いてみて。child_idがなければ、すぐ400になります。
      foreach ($params as $p) {
        if (!$p->child_id = Child::select($child_select)->where('id', $p->child_id)->first()) {
          return ['status' => 400];
        }
      }

      return ['status' => 200, 'params' => $params];
    }

    // エラーの場合
    return ['status' => 400];
  }

  public function deleteRelationMeeting ($meeting_id) {
    // 削除成功
    if (MeetingApprovals::where('meeting_id', $meeting_id)->delete()) return ['status_code' => 200];

    // 削除失敗
    return ['status_code' => 400];
  }

  public function deleteRelationChild ($child_id) {
    // 削除成功
    if (MeetingApprovals::where('child_id', $child_id)->delete()) return ['status_code' => 200];

    // 削除失敗
    return ['status_code' => 400];
  }
}
