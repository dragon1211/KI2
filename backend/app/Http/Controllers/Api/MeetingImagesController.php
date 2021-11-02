<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use App\Models\MeetingImage;

class MeetingImagesController extends Controller {
    public function register (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->image)) {
            return ['status_code' => 400];
        }

        if (MeetingImage::select('id')->where('meeting_id', (int)$r->meeting_id)->count() >= 10) {
            return ['status_code' => 400, 'error_messages' => '画像は最大10個までです。'];
        }

        // ファイルサイズは10MiB以内
        Validator::extend('image_size', function ($attribute, $value, $params, $validator) {
            try {
                return strlen(base64_decode($value)) < 1048576;
            } catch (\Throwable $e) {
                Log::critical($e->getMessage());
                return false;
            }
        });

        // ミームタイプ
        Validator::extend('image_meme', function ($attribute, $value, $params, $validator) {
            try {
                return (
                    mime_content_type($value) == 'image/jpeg' || // jpg
                    mime_content_type($value) == 'image/png'  || // png
                    mime_content_type($value) == 'image/gif'     // gif
                );
            } catch (\Throwable $e) {
                Log::critical($e->getMessage());
                return false;
            }
        });

        // バリデーションエラー
        $validate = Validator::make($r->all(), ['image' => 'image_size|image_meme']);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            $ext = explode('/', mime_content_type($r->image))[1];
            $filename = uniqid() . '.'.$ext;
            $image = base64_decode(substr($r->image, strpos($r->image, ',') + 1));
            Storage::disk('public')->put($filename, $image);

            $insert = [
                'meeting_id' => (int)$r->meeting_id,
                'image' => '/storage/'.$filename,
            ];

            MeetingImage::create($insert);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        $meeting_images_select = ['id', 'image'];

        if (null === ($params = MeetingImage::select($meeting_images_select)->where('meeting_id', (int)$r->meeting_id)->get())) {
            return ['status_code' => 400];
        }

        return ['status_code' => 200, 'params' => $params];
    }

    public function delete ($meeting_id, Request $r) {
        if (!isset($meeting_id) || !isset($r->image_id)) {
            return ['status_code' => 400];
        }

        if (null === ($get = MeetingImage::select('image')->where('id', (int)$r->image_id)->first())) {
            return ['status_code' => 400];
        }

        try {
            MeetingImage::where('id', (int)$r->image_id)->delete();
            Storage::disk('public')->delete($get->image);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        $meeting_images_select = ['id', 'image'];

        if (null === ($params = MeetingImage::select($meeting_images_select)->where('meeting_id', (int)$meeting_id)->get())) {
            $params = [];
        }

        return ['status_code' => 200, 'params' => $params];
    }
}
