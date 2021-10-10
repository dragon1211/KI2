<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Father;
use App\Models\FatherRelation;

class FathersController extends Controller {
  public function login () {}

  public function registerTemporary () {}

  public function registerMain () {}

  public function list () {
    $result = [];
    $father_select = ['id', 'company', 'image'];
    $father_relation_select = ['created_at'];

    // 親一覧の取得に成功
    if ($list = Father::select($father_select)->orderBy('created_at', 'desc')->get()->toArray()) {
      foreach ($list as $i => $l) {
        $result[] = $l;
        $result[$i]['relation'] = FatherRelation::select($father_relation_select)->where('father_id', $l['id'])->first();
      }

      return ['status_code' => 200, 'params' => $result];
    }

    // 親一覧の取得に失敗
    return ['status_code' => 400];
  }

  public function listOfChild (Request $r) {
    $result = [];
    $father_select = ['id', 'company', 'image'];

    // 親一覧の取得に成功
    if ($list = FatherRelation::where('child_id', $r->child_id)->orderBy('created_at', 'desc')->get()->toArray()) {
      $result = [];

      foreach ($list as $l) {
        $result[] = Father::select($father_select)->find($l['father_id']);
      }

      return ['status_code' => 200, 'params' => $result];
    }

    // 親一覧の取得に失敗
    return ['status_code' => 400];
  }

  public function detail ($father_id) {
    $father_select = ['id', 'email', 'company', 'image', 'tel'];

    // 親詳細の取得に成功
    if ($result = Father::select($father_select)->where('id', $father_id)->orderBy('created_at', 'desc')->get()->toArray()) {
      return ['status_code' => 200, 'params' => $result];
    }

    // 親詳細の取得に失敗
    return ['status_code' => 400];
  }

  public function updateImage ($father_id) {}

  public function updateProfile ($father_id) {}

  public function updatePassword ($father_id) {}

  public function delete ($father_id) {
    // 削除成功
    if (Father::where('id', $father_id)->delete()) {
      return ['status_code' => 200];
    }

    // 削除失敗
    return ['status_code' => 400];
  }

  public function checkEmail () {}
}
