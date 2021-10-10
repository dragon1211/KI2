<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\TelActivation;

class TelActivationsController extends Controller {
  public function deleteRelationChild ($child_id) {
    // 削除成功
    if (TelActivation::where('child_id', $child_id)->delete()) return ['status_code' => 200];

    // 削除失敗
    return ['status_code' => 400];
  }
}
