<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Child;
use App\Models\FatherRelation;
use App\Models\MeetingApprovals;
use Exception;

class ChildrenController extends Controller {
  public function login () {}

  public function registerTemporary () {}

  public function registerMain () {}

  public function checkTel () {}

  public function list () {
    // 親一覧の取得に成功
    if ($result = Child::orderBy('created_at', 'desc')->get()->toArray()) {
      return ['status_code' => 200, 'params' => $result];
    }

    // 親一覧の取得に失敗
    return ['status_code' => 400];
  }

  public function listOfFather (Request $r) {
    $result = [];
    $child_select = ['id', 'image', 'last_name', 'first_name', 'company'];

    if ($list = FatherRelation::where('father_id', $r->father_id)->orderBy('created_at', 'desc')->get()->toArray()) {
      foreach ($list as $l) {
        $result[] = Child::select($child_select)->find($l['child_id']);
      }

      return ['status_code' => 200, 'params' => $result];
    }

    return ['status_code' => 400];
  }

  public function listOfMeeting (Request $r) {
    $result = [];
    $child_select = ['id', 'image', 'last_name', 'first_name'];

    if ($list = MeetingApprovals::where('meeting_id', $r->meeting_id)->orderBy('created_at', 'desc')->get()->toArray()) {
      foreach ($list as $l) {
        $result[] = Child::select($child_select)->find($l['id']);
      }

      return ['status_code' => 200, 'params' => $result];
    }

    return ['status_code' => 400];
  }

  public function listOfMeetingNotifyUnapprovel () {}

  public function listOfMeetingNotifyApprovel () {}

  public function detail (Request $r, $child_id) {
    $result = [];
    $child_select = ['email', 'tel', 'last_name', 'first_name', 'image', 'company'];
    $father_relation_select = ['hire_at'];

    // 親詳細の取得に成功
    if ($list = Child::where('id', $child_id)->orderBy('created_at', 'desc')->get()->toArray()) {
      foreach ($list as $i => $l) {
        $result[] = Child::select($child_select)->find($l['id']);
        if (isset($r->father_id)) {
          $result[$i]['father_relation'] = FatherRelation::select($father_relation_select)->where('father_id', $r->father_id)->first();
        }
      }

      return ['status_code' => 200, 'params' => $result];
    }

    // 親詳細の取得に失敗
    return ['status_code' => 400];
  }

  public function updateImage ($child_id) {}

  public function updateProfile ($child_id) {}

  public function updatePassword ($child_id) {}

  public function delete ($child_id) {
    try{
      // 削除成功
      if (Child::where('id', $child_id)->delete()) {
        return ['status_code' => 200];
      }
    } catch (Exception $e) {
      // 削除失敗
      return ['status_code' => 400, 'error' => $e->getMessage()];
    }
  }
}
