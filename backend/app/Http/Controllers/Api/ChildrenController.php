<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

use App\Models\Child;
use App\Models\FatherRelation;
use App\Models\MeetingApprovals;
use App\Models\TelActivations;

class ChildrenController extends Controller {
    public function login () {}

    public function registerTemporary (Request $r) {
        $validate = Validator::make($r->all(), [
            'tel' => 'required|unique:children|max:11|numeric|starts_with:0'
        ]);
        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        if ($get = TelActivations::where('tel', $r->tel)->first()) {
            // すでにDBに登録されている場合
            return ['status_code' => 400, 'error_messages' => ['既に使用されている電話番号です。']];
        }

        $token = random_bytes(16);
        $insert = ['tel' => $r->tel, 'token' => $token];

        try {
            Child::create($insert);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['登録に失敗しました。']];
        }

        // TODO: SMSの送信、SMSコントローラーを作る後でします。
        // try {  
        //     $sms = new SMS;
        //     if (!$sms->send($r->tel, $token)) {
        //         // SMSの送信に失敗した場合
        //         return ['status_code' => 401, 'error_messages' => ['SMSの送信に失敗しました。電話番号が正しいかご確認ください。']];
        //     }
        // } catch {
        //     // SMS APIのエラーの場合
        //     Log::critical($e->getMessage());
        //     return ['status_code' => 402, 'error_messages' => ['予期せぬエラーが発生しました。管理者へお問い合わせください。']];
        // }

        // 仮登録に成功した場合
        return ['status_code' => 200, 'params' => ['tel' => $r->tel]];
    }

    public function registerMain (Request $r) {
        $validate = Validator::make($r->all(), [
            'token' => 'required',
            'email' => 'required|unique:children|max:255|email',
            'password' => 'required|min:8|max:72|confirmed',
            'last_name' => 'required|max:100',
            'first_name' => 'required|max:100',
            'identity' => 'required|max:20|alpha_num',
            'image' => 'max:1024|mimes:jpg,png,gif',
            'company' => 'max:100',
        ]);
        if ($validate->fails()) {
            // バリデーションエラー
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        $password = Hash::make($r->password);

        // 有効期限が切れている場合
        if ($get = TelActivations::where('token', $r->token)->first() && strtotime($get->ttl) > time()) {
            return ['status_code' => 400, 'error_messages' => ['仮登録の有効期限が切れました。改めて親にお問い合わせいただき、再登録の手続きを行ってください。']];
        }

        $insert = [
            'email' => $r->email,
            'tel' => $get->tel,
            'tel_verified_at' => date('Y-m-d H:i:s'),
            'password' => $password,
            'last_name' => $r->last_name,
            'first_name' => $r->first_name,
            'identity' => $r->identity,
            'image' => $r->image,
            'company' => $r->company,
        ];

        try {
            Child::create($insert);
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['登録に失敗しました。']];
        }

        // 本登録に成功
        return ['status_code' => 200, 'success_messages' => ['本登録に成功しました。'], 'params' => ['tel' => $r->tel, 'password' => $password]];
    }
  
    public function requestPassword () {}

    public function search (Request $r) {
        if (!isset($r->keyword)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        if (null === ($result = Child::where('first_name', 'LIKE', '%'.$r->keyword.'%')->orWhere('last_name', 'LIKE', '%'.$r->keyword.'%')->orderBy('created_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function list () {
        if (null === ($result = Child::orderBy('created_at', 'desc')->get())) {
            // 親一覧の取得に失敗
            return ['status_code' => 400];
        }

        // 親一覧の取得に成功
        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfFather (Request $r) {
        $result = [];
        $child_select = ['id', 'image', 'last_name', 'first_name'];

        if (null === ($list = FatherRelation::select('father_id')->where('father_id', $r->father_id)->orderBy('created_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $l) {
            if (null === ($result[] = Child::select($child_select)->find($l->father_id))) {
                return ['status_code' => 400];
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfMeeting (Request $r) {
        $result = [];
        $child_select = ['id', 'image', 'last_name', 'first_name'];

        if (null === ($list = MeetingApprovals::select('child_id')->where('meeting_id', $r->meeting_id)->orderBy('created_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $l) {
            if (null === ($result[] = Child::select($child_select)->find($l->child_id))) {
                return ['status_code' => 400];
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfMeetingNotifyUnapprovel (Request $r) {
        if (!isset($r->meeting_id)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        $result = [];
        $child_select = ['id', 'image', 'last_name', 'first_name', 'tel'];
        $meeting_approvals_select = ['approval_at'];

        if (null === ($list = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $r->meeting_id)->whereNull('approval_at')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($result[] = Child::select($child_select)->where('id', $l->child_id)->get())) {
                return ['status_code' => 400];
            }
            $result[$i]['meeting_approval'] = $l->approval_at;
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function listOfMeetingNotifyApprovel (Request $r) {
        if (!isset($r->meeting_id)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        $result = [];
        $child_select = ['id', 'image', 'last_name', 'first_name', 'tel'];
        $meeting_approvals_select = ['approval_at'];

        if (null === ($list = MeetingApprovals::select($meeting_approvals_select)->where('meeting_id', $r->meeting_id)->whereNotNull('approval_at')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($result[] = Child::select($child_select)->where('id', $l->child_id)->get())) {
                return ['status_code' => 400];
            }
            $result[$i]['meeting_approval'] = $l->approval_at;
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function detail (Request $r, $child_id) {
        $result = [];
        $child_select = ['email', 'tel', 'last_name', 'first_name', 'image', 'company'];
        $father_relation_select = ['hire_at'];

        // 親詳細の取得に成功
        if (null === ($list = Child::select('id')->where('id', $child_id)->orderBy('created_at', 'desc')->get())) {
            return ['status_code' => 400];
        }

        foreach ($list as $i => $l) {
            if (null === ($result[] = Child::select($child_select)->find($l->id))) {
                return ['status_code' => 400];
            }
            if (isset($r->father_id)) {
                if (null === ($result[$i]['father_relation'] = FatherRelation::select($father_relation_select)->where('father_id', $r->father_id)->first())) {
                    return ['status_code' => 400];
                }
            }
        }

        return ['status_code' => 200, 'params' => $result];
    }

    public function updateImage (Request $r, $child_id) {
        if (!isset($child_id)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        // バリデーションエラー
        $validate = Validator::make($r->all(), ['image' => 'max:1024|mimes:jpg,png,gif']);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            Child::where('id', $child_id)->update($r->all());
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['画像の更新に成功しました。']];
    }

    public function updateProfile (Request $r, $child_id) {
        if (!isset($child_id)) {
            return ['status_code' => 400, 'error_messages' => ['子の更新に失敗しました。']];
        }

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'email' => 'required|unique:children|max:255|email|alpha_num',
            'tel' => 'required|unique:children|max:11|numeric|starts_with:0',
            'last_name' => 'required|max:100',
            'first_name' => 'required|max:100',
            'company' => 'max:100',
        ]);

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            Child::where('id', $child_id)->update($r->all());
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['子の更新に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['子の更新に成功しました。']];
    }

    public function updatePassword (Request $r, $child_id) {
        if (!isset($child_id)) {
            return ['status_code' => 400, 'error_messages' => ['画像の更新に失敗しました。']];
        }

        // バリデーションエラー
        $validate = Validator::make($r->all(), [
            'password' => 'required|min:8|max:72|confirmed',
        ]);

        $validate->after(function ($validate) {
            if (count($r->image) > 10) {
                $validate->errors()->add('count', '10枚以上登録できません。');
            }
        });

        if ($validate->fails()) {
            return ['status_code' => 422, 'error_messages' => $validate->errors()];
        }

        try {
            Child::where('id', $child_id)->update($r->all());
        } catch (\Throwable $e) {
            // 失敗
            Log::critical($e->getMessage());
            return ['status_code' => 400, 'error_messages' => ['パスワードの更新に失敗しました。']];
        }

        // 成功
        return ['status_code' => 200, 'success_messages' => ['パスワードの更新に成功しました。']];
    }

    public function withdrawal ($child_id) {
        // 削除成功
        try {
            Child::where('id', $child_id)->delete();
         } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return ['status_code' => 400];
        }

        // 削除失敗
        return ['status_code' => 200];
    }
}
