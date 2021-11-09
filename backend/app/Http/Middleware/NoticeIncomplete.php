<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

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
        /*
            レスポンスのJSONに「未完了の件数」を付け足す
        */
        return $next($request);
    }
}
