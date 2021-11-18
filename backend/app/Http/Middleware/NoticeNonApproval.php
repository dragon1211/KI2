<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\MeetingApprovals;
use Illuminate\Routing\ResponseFactory;

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
        $response = $next($request);

        if (is_null(session()->get('children'))) {
            session()->forget('children');
            return $response;
        }

        $count = MeetingApprovals::where('child_id', session()->get('children')['id'])->whereNull('approval_at')->count();
        $content = json_decode($response->content(), true);
        if (json_last_error() == JSON_ERROR_NONE) {
            $response->setContent(json_encode(array_merge($content, ['notice' => $count])));
        }

        return $response;
    }
}
