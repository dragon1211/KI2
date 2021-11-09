<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Model\MeetingApprovals;

class NoticeNonApproval
{
    /**
     * 未承知ミーティング通知（子向け）
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        /*
            レスポンスのJSONに「未承知の件数」を付け足す。
            1.自身のid(children.id)を取得
            2.meeting_approvals.child_id === idの配列を取得
            3.2で取得した配列の中でmeeting_approvals.approval_at === NULLの配列を取得
            4.3で取得した配列の数を返す
        */
        $ma = MeetingApprovals::where('child_id', $request->session()->get('children')['id'])->whereNull('approval_at');

        return [
            'count' => $ma->count(),
            'get' => $ma->get(),
        ];
        // return $next($request);
    }
}
