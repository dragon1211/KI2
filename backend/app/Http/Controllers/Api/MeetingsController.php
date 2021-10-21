<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Meeting;
use App\Models\MeetingImage;
use App\Models\MeetingApprovals;
use App\Models\Child;
use App\Models\Father;

class MeetingsController extends Controller {
    public function register (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400, 'error_messages' => ['ミーティングの登録に失敗しました。']];
        }

        $validate = Validator::make($r->all(), [
            'title' => 'required|max:100',
            'text' => 'required|max:2000',
            'memo' => 'max:2000',
            'pdf' => 'mimes:pdf'
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $insert = [
            'father_id' => $r->father_id,
            'title' => $r->title,
            'text' => $r->text,
            'memo' => $r->memo,
            'pdf' => $r->pdf
        ];

        try {
            Child::create($insert);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['ミーティングの登録に失敗しました。']];
        }

        return ['status_code' => 200, 'success_messages' => ['ミーティングの登録に成功しました。']];
    }

    public function registerFavorite (Request $r) {
        if (!isset($r->meeting_id) || !isset($r->is_favorite) || $r->is_favorite > 1) {
            return ['status_code' => 400];
        }

        $update = ['is_favorite' => $r->is_favorite];

        try {
            Meeting::where('id', $r->meeting_id)->update($update);
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
            if (null === ($result[$i]['approval'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $l->id)->orderBy('approval_at', 'desc')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['approval'] as $j => $k) {
                if (null === ($result[$i]['approval'][$j]['child'] = Child::select($child_select)->where('id', $k->child_id)->first())) {
                    return ['status_code' => 400];
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
            if (null === ($result[$i]['approval'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $l->id)->orderBy('approval_at', 'desc')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['approval'] as $j => $k) {
                if (null === ($result[$i]['approval'][$j]['child'] = Child::select($child_select)->where('id', $k->child_id)->first())) {
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
        if (null === ($approval = MeetingApprovals::select('meeting_id')->where('child_id', $r->child_id)->whereNotNull('approval_at')->orderBy('updated_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($approval as $a) {
            if (null === ($list = Meeting::select($meeting_select)->where('id', $a->meeting_id)->get())) {
                return ['status_code' => 400];
            }

            foreach ($list as $i => $l) {
                $result[] = $l;
                if (null === ($result[$i]['meeting_images'] = MeetingImage::select($meeting_images_select)->where('meeting_id', $l->id)->get())) {
                    return ['status_code' => 400];
                }
                if (null === ($result[$i]['fathers'] = Father::select($father_select)->where('id', $l->father_id)->get())) {
                    return ['status_code' => 400];
                }
                if (null === ($result[$i]['meeting_approvals'] = MeetingApprovals::select($meeting_approvals_select)->whereNotNull('approval_at')->where('meeting_id', $l->id)->orderBy('updated_at', 'desc')->get())) {
                    return ['status_code' => 400];
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
        if (null === ($approval = MeetingApprovals::select('meeting_id')->where('child_id', $r->child_id)->whereNull('approval_at')->orderBy('approval_at', 'asc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($approval as $a) {
            if (null === ($list = Meeting::select($meeting_select)->where('id', $a->meeting_id)->get())) {
                return ['status_code' => 400];
            }

            foreach ($list as $i => $l) {
                $result[] = $l;
                if (null === ($result[$i]['meeting_images'] = MeetingImage::select($meeting_images_select)->where('meeting_id', $l->id)->get())) {
                    return ['status_code' => 400];
                }
                if (null === ($result[$i]['fathers'] = Father::select($father_select)->where('id', $l->father_id)->get())) {
                    return ['status_code' => 400];
                }
                if (null === ($result[$i]['meeting_approvals'] = MeetingApprovals::select($meeting_approvals_select)->whereNull('approval_at')->where('meeting_id', $l->id)->orderBy('approval_at', 'asc')->get())) {
                    return ['status_code' => 400];
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
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', $r->father_id)->get())) {
            return ['status_code' => 400];
        }
        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['approvals'] = MeetingApprovals::select($meeting_approvals_select)->whereNotNull('approval_at')->where('meeting_id', $l->id)->orderBy('updated_at', 'desc')->get())) {
                return ['status_code' => 400];
            }
            if (count($result[$i]['approvals']) == 0) {
                unset($result[$i]);
                continue;
            }

            foreach ($result[$i]['approvals'] as $ii => $ra) {
                if (null === ($result[$i]['approvals'][$ii]['child'] = Child::select($child_select)->where('id', $result[$i]['approvals'][$ii]['child_id'])->first())) {
                    return ['status_code' => 400];
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
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', $r->father_id)->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['approvals'] = MeetingApprovals::select($meeting_approvals_select)->whereNull('approval_at')->where('meeting_id', $l->id)->orderBy('updated_at', 'desc')->get())) {
                return ['status_code' => 400];
            }
            if (count($result[$i]['approvals']) > 1) {
                unset($result[$i]);
                continue;
            }

            foreach ($result[$i]['approvals'] as $ii => $ra) {
                if (null === ($result[$i]['approvals'][$ii]['child'] = Child::select($child_select)->where('id', $result[$i]['approvals'][$ii]['child_id'])->first())) {
                    return ['status_code' => 400];
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfFavoriteofFather (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at', 'is_favorite'];
        $meeting_approvals_select = ['child_id', 'approval_at'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', $r->father_id)->where('is_favorite', 1)->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['approvals'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $l->id)->orderBy('updated_at', 'desc')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['approvals'] as $ii => $ra) {
                if (null === ($result[$i]['approvals'][$ii]['child'] = Child::select($child_select)->where('id', $result[$i]['approvals'][$ii]['child_id'])->first())) {
                    return ['status_code' => 400];
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfNonFavoriteofFather (Request $r) {
        if (!isset($r->father_id)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at', 'is_favorite'];
        $meeting_approvals_select = ['child_id', 'approval_at'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', $r->father_id)->where('is_favorite', 0)->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['approvals'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $l->id)->orderBy('updated_at', 'desc')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['approvals'] as $ii => $ra) {
                if (null === ($result[$i]['approvals'][$ii]['child'] = Child::select($child_select)->where('id', $result[$i]['approvals'][$ii]['child_id'])->first())) {
                    return ['status_code' => 400];
                }
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
        $meeting_approvals_select = ['approval_at as date'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['father'] = Father::select($father_select)->where('id', $l->father_id)->first())) {
                return ['status_code' => 400];
            }
            if (null === ($result[$i]['approval'] = MeetingApprovals::select($meeting_approvals_select)->where('child_id', $r->child_id)->whereNotNull('approval_at')->get())) {
                return ['status_code' => 400];
            }
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
        $meeting_approvals_select = ['approval_at as date'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['father'] = Father::select($father_select)->where('id', $l->father_id)->first())) {
                return ['status_code' => 400];
            }
            if (null === ($result[$i]['approval'] = MeetingApprovals::select($meeting_approvals_select)->where('child_id', $r->child_id)->whereNull('approval_at')->get())) {
                return ['status_code' => 400];
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function searchOfCompleteofFather (Request $r) {
        if (!isset($r->father_id) || !isset($r->keyword)) {
            return ['status_code' => 400];
        }

        $result = [];
        $meeting_select = ['id', 'father_id', 'title', 'text', 'memo', 'updated_at'];
        $meeting_images_select = ['image'];
        $meeting_approvals_select = ['approval_at', 'child_id'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', $r->father_id)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null == ($result[$i]['meeting_image'] = MeetingImage::select($meeting_images_select)->where('meeting_id', $l->id)->get())) {
                return ['status_code' => 400];
            }
            if (null == ($result[$i]['meeting_approvals'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $l->id)->whereNull('approval_at')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['meeting_approvals'] as $ii => $ra) {
                if (null == ($result[$i]['meeting_approvals'][$ii]['child'] = Child::select($child_select)->where('id', $result[$i]['meeting_approvals'][$ii]['child_id'])->first())) {
                    return ['status_code' => 400];
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
        $meeting_images_select = ['image'];
        $meeting_approvals_select = ['approval_at', 'child_id'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('father_id', $r->father_id)->where('title', 'LIKE', '%'.$r->keyword.'%')->orWhere('text', 'LIKE', '%'.$r->keyword.'%')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['meeting_image'] = MeetingImage::select($meeting_images_select)->where('meeting_id', $l->id)->get())) {
                return ['status_code' => 400];
            }
            if (null === ($result[$i]['meeting_approvals'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $l->id)->whereNotNull('approval_at')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['meeting_approvals'] as $ii => $ra) {
                if (null === ($result[$i]['meeting_approvals'][$ii]['child'] = Child::select($child_select)->where('id', $result[$i]['meeting_approvals'][$ii]['child_id'])->first())) {
                    return ['status_code' => 400];
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
        $meeting_images_select = ['image'];
        $meeting_approvals_select = ['approval_at', 'child_id'];
        $child_select = ['image'];

        // 取得に成功
        if (null === ($list = Meeting::select($meeting_select)->where('id', $meeting_id)->where('father_id', $r->father_id)->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            $result[] = $l;
            if (null === ($result[$i]['meeting_image'] = MeetingImage::select($meeting_images_select)->where('meeting_id', $l->id)->get())) {
                return ['status_code' => 400];
            }
            if (null === ($result[$i]['approval'] = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $l->id)->whereNotNull('approval_at')->get())) {
                return ['status_code' => 400];
            }

            foreach ($result[$i]['approval'] as $ii => $ra) {
                if (null === ($result[$i]['approval'][$ii]['child'] = Child::select($child_select)->where('id', $ra->child_id)->first())) {
                    return ['status_code' => 400];
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function update (Request $r, $meeting_id) {
        if (!isset($meeting_id)) {
            return ['status_code' => 400, 'error_messages' => ['ミーティングの登録に失敗しました。']];
        }

        $validate = Validator::make($r->all(), [
            'title' => 'required|max:100',
            'text' => 'required|max:2000',
            'memo' => 'max:2000',
            'pdf' => 'mimes:pdf'
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $update = [
            'title' => $r->title,
            'text' => $r->text,
        ];

        if (isset($r->memo)) $update['memo'] = $r->memo;
        if (isset($r->pdf)) $update['pdf'] = $r->pdf;

        try {
            Meetings::where('meeting_id', $meeting_id)->update($update);
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }

    public function delete ($meeting_id) {
        try {
            Meetings::where('meeting_id', $meeting_id)->delete();
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        return ['status_code' => 200];
    }
}
