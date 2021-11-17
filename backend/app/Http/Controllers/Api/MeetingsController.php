<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use App\Models\Meeting;
use App\Models\MeetingImage;
use App\Models\MeetingApprovals;
use App\Models\Child;
use App\Models\Father;
use App\Models\FatherRelation;

class MeetingsController extends Controller {
    public function register (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400, 'error_messages' => ['ミーティングの登録に失敗しました。']];
        }

        // tmp
        /////////////////////////
        // ファイルサイズは10MiB以内
        Validator::extend('image_size', function ($attribute, $value, $params, $validator) {
            try {
                $ok = true;
                foreach ($value as $v) {
                    if (strlen(base64_decode($v)) > 1048576) {
                        $ok = false;
                    }
                }
                return $ok;
            } catch (\Throwable $e) {
                Log::critical($e->getMessage());
                return false;
            }
        });

        // ミームタイプ
        Validator::extend('image_meme', function ($attribute, $value, $params, $validator) {
            try {
                $ok = true;
                foreach ($value as $v) {
                    if (
                        mime_content_type($v) == 'image/jpeg' || // jpg
                        mime_content_type($v) == 'image/png'  || // png
                        mime_content_type($v) == 'image/gif'     // gif
                    ) {
                        $ok = false;
                    }
                }
                return $ok;
            } catch (\Throwable $e) {
                Log::critical($e->getMessage());
                return false;
            }
        });
        /////////////////////////

        // ミームタイプ
        Validator::extend('pdf_meme', function ($attribute, $value, $params, $validator) {
            try {
                return mime_content_type($value) == 'application/pdf';
            } catch (\Throwable $e) {
                Log::critical($e->getMessage());
                return false;
            }
        });

        $validate = Validator::make($r->all(), [
            'title' => 'required|max:100',
            'text' => 'required|max:2000',
            'memo' => 'max:2000',
            'pdf' => 'pdf_meme',
            'image' => 'image_size|image_meme', // tmp
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $insert = [
            'father_id' => $r->father_id,
            'title' => $r->title,
            'text' => $r->text,
            'memo' => $r->memo
        ];

        try {
            if (isset($r->pdf)) {
                $filename = uniqid() . '.pdf';
                $pdf = base64_decode(substr($r->pdf, strpos($r->pdf, ',') + 1));

                $insert['pdf'] = '/storage/'.$filename;
                Storage::disk('public')->put($filename, $pdf);
            }

            $id = Meeting::create($insert);

            // tmp
            /////////////////////////
            foreach ($r->image as $img) {
                $ext = explode('/', mime_content_type($img))[1];
                $filename = uniqid() . '.'.$ext;
                $image = base64_decode(substr($img, strpos($img, ',') + 1));
                Storage::disk('public')->put($filename, $image);

                $insert_image = [
                    'meeting_id' => (int)$id,
                    'image' => '/storage/'.$filename,
                ];

                MeetingImage::create($insert_image);
            }
            /////////////////////////

            foreach ($r->children as $child) {
                $insert_approval = [
                    'child_id' => $child,
                    'meeting_id' => (int)$id,
                    'approval_at' => date('Y-m-d H:i:s'),
                ];

                MeetingApprovals::create($insert_approval);
            }

            $params = ['meeting_id' => $id];
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['ミーティングの登録に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['ミーティングの登録に成功しました。'], 'params' => $params];
    }

    public function registerFavorite (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->is_favorite) || $r->is_favorite > 1) {
            return ['status_code' => 400];
        }

        $update = ['is_favorite' => $r->is_favorite];

        try {
            Meeting::where('id', (int)$r->meeting_id)->update($update);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }

    public function search (Request $r) {
        if (!isset($r->keyword)) {
            return ['status_code' => 400];
        }
        $result = [];
        $meeting_select = ['id', 'title', 'text', 'updated_at'];
        $child_select = ['image'];
        $meeting_approvals_select = ['child_id', 'approval_at'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->orderBy('created_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['approval'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$l->id)->orderBy('approval_at', 'desc')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['approval'] as $j => $k) {
                if (null === ($result[$i]['approval'][$j]['child'] = Child::select($child_select)->where('id', $k->child_id)->first())) {
                    $result[$i]['approval'][$j]['child'] = new \stdClass();
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function list () {
        $result = [];
        $meeting_select = ['id', 'title', 'text', 'updated_at'];
        $child_select = ['image'];
        $meeting_approvals_select = ['child_id', 'approval_at'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->orderBy('created_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['approval'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$l->id)->orderBy('approval_at', 'desc')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['approval'] as $j => $k) {
                if (null === ($result[$i]['approval'][$j]['child'] = Child::select($child_select)->where('id', (int)$k->child_id)->first())) {
                    return ['status_code' => 400];
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfApprovalOfChild (Request $r) {
        if (!isset($r->child_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at'];
        $meeting_images_select = ['image'];
        $father_select = ['image', 'company'];
        $meeting_approvals_select = ['approval_at'];

        // 取得に成功
        if (null === ($approval = MeetingApprovals::select('meeting_id')->where('child_id', (int)$r->child_id)->whereNotNull('approval_at')->orderBy('updated_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($approval as $a) {
            if (null !== ($list = Meeting::select($meeting_select)->where('id', (int)$a->meeting_id)->get())) {
                foreach ($list as $i => $l) {
                    if (null === ($fr = FatherRelation::select('id')->where('father_id', (int)$l->father_id)->where('child_id', (int)$r->child_id)->first())) {
                        continue;
                    }
                    if (null === ($l->father = Father::select($father_select)->where('id', (int)$l->father_id)->first())) {
                        $l->father = new \stdClass();
                    }
                    if (null === ($l->meeting_images = MeetingImage::select($meeting_images_select)->where('meeting_id', (int)$l->id)->get())) {
                        $l->meeting_images = [];
                    }
                    if (null === ($l->approval = MeetingApprovals::select($meeting_approvals_select)->whereNotNull('approval_at')->where('meeting_id', (int)$l->id)->first())) {
                        $l->approval = new \stdClass();
                    }
                    $result[] = $l;
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfNonApprovalOfChild (Request $r) {
        if (!isset($r->child_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at'];
        $meeting_images_select = ['image'];
        $father_select = ['image', 'company'];
        $meeting_approvals_select = ['approval_at'];

        // 取得に成功
        if (null === ($approval = MeetingApprovals::select('meeting_id')->where('child_id', (int)$r->child_id)->whereNull('approval_at')->orderBy('approval_at', 'asc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($approval as $a) {
            if (null !== ($list = Meeting::select($meeting_select)->where('id', (int)$a->meeting_id)->get())) {
                foreach ($list as $i => $l) {
                    if (null === ($fr = FatherRelation::select('id')->where('father_id', (int)$l->father_id)->where('child_id', (int)$r->child_id)->first())) {
                        continue;
                    }
                    if (null === ($l->father = Father::select($father_select)->where('id', (int)$l->father_id)->first())) {
                        $l->father = new \stdClass();
                    }
                    if (null === ($l->meeting_images = MeetingImage::select($meeting_images_select)->where('meeting_id', (int)$l->id)->get())) {
                        $l->meeting_images = [];
                    }
                    if (null === ($l->approval = MeetingApprovals::select($meeting_approvals_select)->whereNull('approval_at')->where('meeting_id', (int)$l->id)->first())) {
                        $l->approval = new \stdClass();
                    }
                    $result[] = $l;
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfCompleteOfFather (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at', 'is_favorite'];
        $meeting_approvals_select = ['child_id', 'approval_at'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', (int)$r->father_id)->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($l->approvals = MeetingApprovals::select($meeting_approvals_select)->whereNotNull('approval_at')->where('meeting_id', (int)$l->id)->get())) {
                continue;
            }

            if (count($l->approvals->toArray()) != MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$l->id)->count()) {
                continue;
            }

            foreach ($l->approvals as $ii => $ll) {
                if (null === ($ll->child = Child::select($child_select)->where('id', (int)$ll->child_id)->first())) {
                    $ll->child = new \stdClass();
                }

                if (!in_array($l, $result)) {
                    $result[] = $l;
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfIncompleteOfFather (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at', 'is_favorite'];
        $meeting_approvals_select = ['child_id', 'approval_at'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', (int)$r->father_id)->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($l->approvals = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$l->id)->get())) {
                continue;
            }

            if (count($l->approvals) == MeetingApprovals::select($meeting_approvals_select)->whereNotNull('approval_at')->where('meeting_id', (int)$l->id)->count()) {
                continue;
            }

            foreach ($l->approvals as $ii => $ll) {
                if (null === ($ll->child = Child::select($child_select)->where('id', (int)$ll->child_id)->first())) {
                    $ll->child = new \stdClass();
                }

                if (!in_array($l, $result)) {
                    $result[] = $l;
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfFavoriteOfFather (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at', 'is_favorite'];
        $meeting_approvals_select = ['child_id', 'approval_at'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', (int)$r->father_id)->where('is_favorite', 1)->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($l->approvals = MeetingApprovals::select($meeting_approvals_select)->whereNotNull('approval_at')->where('meeting_id', (int)$l->id)->orderBy('updated_at', 'desc')->get())) {
                continue;
            }

            foreach ($l->approvals as $ii => $ll) {
                if (null === ($ll->child = Child::select($child_select)->where('id', (int)$ll->child_id)->first())) {
                    $ll->child = new \stdClass();
                }
            }

            if (!in_array($l, $result)) {
                $result[] = $l;
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfNonFavoriteOfFather (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at', 'is_favorite'];
        $meeting_approvals_select = ['child_id', 'approval_at'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', (int)$r->father_id)->where('is_favorite', 0)->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($l->approvals = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$l->id)->orderBy('updated_at', 'desc')->get())) {
                continue;
            }

            foreach ($l->approvals as $ii => $ll) {
                if (null === ($ll->child = Child::select($child_select)->where('id', (int)$ll->child_id)->first())) {
                    $ll->child = new \stdClass();
                }
            }

            if (!in_array($l, $result)) {
                $result[] = $l;
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function searchOfApprovalOfChild (Request $r) {
        if (!isset($r->child_id) || !isset($r->keyword)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at'];
        $father_select = ['image', 'company'];
        $meeting_approvals_select = ['approval_at'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->get())) {
            $list = [];
        }

        foreach ($list as $i => $l) {
            if (null === (FatherRelation::select('id')->where('father_id', (int)$l->father_id)->where('child_id', (int)$r->child_id)->first())) {
                continue;
            }
            if (null === ($ma = MeetingApprovals::select('id')->where('child_id', (int)$r->child_id)->where('meeting_id', (int)$l->id)->whereNotNull('approval_at')->first())) {
                continue;
            }
            if (null === ($l->father = Father::select($father_select)->where('id', (int)$l->father_id)->first())) {
                $l->father = new \stdClass();
            }
            if (null === ($l->approval = MeetingApprovals::select($meeting_approvals_select)->where('child_id', (int)$r->child_id)->whereNotNull('approval_at')->first())) {
                $l->approval = new \stdClass();
            }
            $result[] = $l;
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function searchOfNonApprovalOfChild (Request $r) {
        if (!isset($r->child_id) || !isset($r->keyword)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at'];
        $father_select = ['image', 'company'];
        $meeting_approvals_select = ['approval_at'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->get())) {
            $list = [];
        }

        foreach ($list as $i => $l) {
            if (null === (FatherRelation::select('id')->where('father_id', (int)$l->father_id)->where('child_id', (int)$r->child_id)->first())) {
                continue;
            }
            if (null === ($ma = MeetingApprovals::select('id')->where('child_id', (int)$r->child_id)->where('meeting_id', (int)$l->id)->whereNull('approval_at')->first())) {
                continue;
            }
            if (null === ($l->father = Father::select($father_select)->where('id', (int)$l->father_id)->first())) {
                $l->father = new \stdClass();
            }
            if (null === ($l->approval = MeetingApprovals::select($meeting_approvals_select)->where('child_id', (int)$r->child_id)->whereNull('approval_at')->first())) {
                $l->approval = new \stdClass();
            }
            $result[] = $l;
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function searchOfCompleteofFather (Request $r) {
        if (!isset($r->father_id) || !isset($r->keyword)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at', 'is_favorite'];
        $meeting_approvals_select = ['approval_at', 'child_id'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', (int)$r->father_id)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->get())) {
            $list = [];
        }

        foreach ($list as $i => $l) {
            if (null === ($l->approvals = MeetingApprovals::select($meeting_approvals_select)->whereNotNull('approval_at')->where('meeting_id', (int)$l->id)->get())) {
                continue;
            }

            if (count($l->approvals->toArray()) != MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$l->id)->count()) {
                continue;
            }

            foreach ($l->approvals as $ii => $ll) {
                if (null === ($ll->child = Child::select($child_select)->where('id', (int)$ll->child_id)->first())) {
                    $ll->child = new \stdClass();
                }

                if (!in_array($l, $result)) {
                    $result[] = $l;
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function searchOfIncompleteofFather (Request $r) {
        if (!isset($r->father_id) || !isset($r->keyword)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at', 'is_favorite'];
        $meeting_approvals_select = ['approval_at', 'child_id'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', (int)$r->father_id)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->get())) {
            $list = [];
        }

        foreach ($list as $i => $l) {
            if (null === ($l->approvals = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$l->id)->get())) {
                continue;
            }

            if (count($l->approvals) == MeetingApprovals::select($meeting_approvals_select)->whereNotNull('approval_at')->where('meeting_id', (int)$l->id)->count()) {
                continue;
            }

            foreach ($l->approvals as $ii => $ll) {
                if (null === ($ll->child = Child::select($child_select)->where('id', (int)$ll->child_id)->first())) {
                    $ll->child = new \stdClass();
                }

                if (!in_array($l, $result)) {
                    $result[] = $l;
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function detail (Request $r, $meeting_id) {
        if (!isset($meeting_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'pdf', 'updated_at', 'is_favorite'];
        $meeting_images_select = ['id', 'image'];
        $meeting_approvals_select = ['approval_at', 'child_id'];
        $father_select = ['image', 'company', 'tel'];
        $child_select = ['id', 'image', 'last_name', 'first_name', 'tel'];
        $all_child_select = ['id as child_id', 'last_name', 'first_name'];

        // 取得に成功
        if (null === ($result = Meeting::select($meeting_select)->where('id', (int)$meeting_id)->first())) {
            return ['status_code' => 400];
        }

        if (null === ($result->meeting_image = MeetingImage::select($meeting_images_select)->where('meeting_id', (int)$result->id)->get())) {
            $result->meeting_image = [];
        }

        if (request()->route()->action['as'] != 'mdc') {
            if (null === ($result->approval = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$result->id)->get())) {
                $result->approval = [];
            }
        }
        else {
            if (null === ($result->approval = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', (int)$result->id)->first())) {
                $result->approval = new \stdClass();
            }
        }

        if (request()->route()->action['as'] == 'mdc') {
            if (null === ($result->father = Father::select($father_select)->where('id', (int)$result->father_id)->first())) {
                $result->father = new \stdClass();
            }
        }

        if (request()->route()->action['as'] != 'mdc') {
            $result->children = [];
            $rec = [];
    
            if (null !== ($rel = FatherRelation::select('child_id')->where('father_id', (int)$result->father_id)->get())) {
                foreach ($rel as $i => $re) {
                    if (null !== ($rech = Child::select($all_child_select)->where('id', $re->child_id)->first())) {
                        if (!in_array($rech, $rec)) {
                            $rec[$i] = $rech;
                        }
                    }
                }

                $result->children = $rec;
            }

            foreach ($result->approval as $i => $a) {
                if (null === ($result->approval[$i]['child'] = Child::select($child_select)->where('id', (int)$a->child_id)->first())) {
                    $result->approval[$i]['child'] = new \stdClass();
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function update (Request $r, $meeting_id) {
        if (!isset($meeting_id)) {
            return ['status_code' => 400, 'error_messages' => ['ミーティングの登録に失敗しました。']];
        }

        // ミームタイプ
        if (substr($r->pdf, -4) != '.pdf') {
            Validator::extend('pdf_meme', function ($attribute, $value, $params, $validator) {
                try {
                    return mime_content_type($value) == 'application/pdf';
                } catch (\Throwable $e) {
                    Log::critical($e->getMessage());
                    return false;
                }
            });
        }
        else {
            Validator::extend('pdf_meme', function ($attribute, $value, $params, $validator) {
                try {
                    return substr($value, -4) == '.pdf';
                } catch (\Throwable $e) {
                    Log::critical($e->getMessage());
                    return false;
                }
            });
        }

        $validate = Validator::make($r->all(), [
            'title' => 'required|max:100',
            'text' => 'required|max:2000',
            'memo' => 'nullable|max:2000',
            'pdf' => 'pdf_meme',
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $update = [
            'title' => $r->title,
            'text' => $r->text,
        ];

        if (isset($r->memo)) $update['memo'] = $r->memo;
        else if (is_null($r->memo)) $update['memo'] = '';

        try {
            // リクエストでPDFがある場合
            if (isset($r->pdf)) {
                $filename = uniqid() . '.pdf';

                // DBにミーティングがある場合
                if ($chk = Meeting::select('pdf')->where('id', (int)$meeting_id)->first()) {
                    // base64の場合（ファイルパスだったら、スキップ）
                    if (!preg_match('/\/storage\/(.*).pdf/', $r->pdf)) {
                        // もう存在しているPDFのファイル名からパスを外します。
                        $opdf = str_replace('/storage/', '', $chk->pdf);

                        // PDFのbase64をGETします。
                        $pdf = base64_decode(substr($r->pdf, strpos($r->pdf, ',') + 1));

                        // 既にPDFが存在する場合（なければ、スキップ）
                        if (Storage::disk('public')->exists($opdf)) {
                            // 既に存在しているPDFとアップロードしているPDFを比べてみます。異なる場合、存在しているPDFを削除します。
                            if (strcmp(Storage::disk('public')->get($opdf), $pdf) !== 0) {
                                Storage::disk('public')->delete($opdf);
                            }
                        }

                        $update['pdf'] = '/storage/'.$filename;
                        Storage::disk('public')->put($filename, $pdf);
                    }
                }
                // なければ、そのままストレージに保存します。
                else {
                    $update['pdf'] = '/storage/'.$filename;
                    Storage::disk('public')->put($filename, $pdf);
                }
            }

            // データベースに保存します。
            Meeting::where('id', (int)$meeting_id)->update($update);
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }

    public function delete ($meeting_id) {
        try {
            Meeting::where('id', (int)$meeting_id)->delete();
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }
}
