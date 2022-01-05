<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Middleware\Authenticate as Middleware;

class Authenticate extends Middleware
{
    /**
     * Get the path the user should be redirected to when they are not authenticated.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return string|null
     */
    protected function redirectTo($request) {
        if (!$request->expectsJson()) {
            return route('login');
        }
    }

    public function handle ($request, Closure $next, ...$guard) {
        if (!$request->session()->has($guard[0])) {
            return redirect(route($guard[0].'login'));
        }

        return $next($request);
    }
}
