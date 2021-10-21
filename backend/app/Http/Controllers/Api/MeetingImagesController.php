<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\MeetingImage;

class MeetingImagesController extends Controller {
    public function register (Request $r) {
        if (!isset($r->meeting_id)) {
            return ['status' => 400];
        }

        foreach ($r->all() as $i) {
            $validate = Validator::make($i, ['image' => 'file|max:1024|mimes:jpg,png,gif']);
        }

        $validate->after(function ($validate) {
            if (count($r->image) > 10) {
                $validate->errors()->add('count', '10枚以上登録できません。');
            }
        });

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $insert = ['meeting_id' => $meeting_id, 'image' => $image];

        foreach ($r->images as $image) {
            try {
                MeetingImage::create($insert);
            } catch (\Throwable $e) {
                // 失敗
                Log::critical($e->getMessage());
                return ['status_code' => 400];
            }
        }
        return ['status_code' => 200];
    }

    public function deleteRelationMeeting ($meeting_id) {
        try {
            MeetingImage::where('meeting_id', $meeting_id)->delete();
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }
}
