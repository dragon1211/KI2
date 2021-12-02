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
        if (!isset($r->meeting_id) || !isset($r->image) || empty(json_decode($r->image))) {
            return ['status_code' => 400];
        }

        if (MeetingImage::select('id')->where('meeting_id', (int)$r->meeting_id)->count() >= 10) {
            return ['status_code' => 400, 'error_messages' => '画像は最大10個までです。'];
        }

        if (count(Storage::disk('private')->files('/')) >= 9999) {
            Log::critical('ストレージの限界を超えています。9999個ファイルまで保存可能ですので、不要なファイルを削除して下さい。');
            return ['status_code' => 400, 'error_messages' => ['親の更新に失敗しました。']];
        }

        // ファイルサイズは各5MiB以内
        Validator::extend('image_size', function ($attribute, $value, $params, $validator) {
            return $this->imagesizemulti($value);
        });

        // ミームタイプ
        Validator::extend('image_meme', function ($attribute, $value, $params, $validator) {
            return $this->imagemememulti($value);
        });

        // バリデーションエラー
        $validate = Validator::make($r->all(), ['image' => 'image_size|image_meme']);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $fname = [];

        try {
            foreach (json_decode($r->image) as $img) {
                $filename = $this->uuidv4().'.jpg';
                $fname[] = $filename;
                $image = base64_decode(substr($img, strpos($img, ',') + 1));
                Storage::disk('private')->put($filename, $image);
                $this->fiximg($filename);

                $insert = [
                    'meeting_id' => (int)$r->meeting_id,
                    'image' => '/files/'.$filename,
                ];

                MeetingImage::create($insert);
            }
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            foreach ($fname as $filename) {
                Storage::disk('private')->delete($filename);
            }
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
            Storage::disk('private')->delete($get->image);
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
