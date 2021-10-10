<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\EmailActivation;

class EmailActivationsController extends Controller {
  public function deleteRelationFather ($father_id) {
    // 削除成功
    if (EmailActivation::where('father_id', $father_id)->delete()) {
      return ['status_code' => 200];
    }

    // 削除失敗
    return ['status_code' => 400];
  }
}
