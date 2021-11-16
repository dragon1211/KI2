<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Meeting;
use App\Models\MeetingApprovals;

class NoticeIncomplete
{
    /**
     * 未完了ミーティング通知（親向け）
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);
        $count = 0;

        if (null !== ($list = Meeting::select('id')->where('father_id', (int)session()->get('fathers')['id'])->get())) {
            foreach ($list as $i => $l) {
                $count += MeetingApprovals::where('meeting_id', (int)$l->id)->whereNull('approval_at')->count();
            }
        }

        $content = json_decode($response->content(), true);
        if (json_last_error() == JSON_ERROR_NONE) {
            $response->setContent(json_encode(array_merge($content, ['notice' => $count])));
        }

        return $response;
    }
}
