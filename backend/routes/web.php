<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return view('welcome');
});

Route::get('/p-account/meeting', function () {return view('p_account.index');});
Route::get('/p-account/meeting/detail/{meeting_id}', function () {return view('p_account.index');});
Route::get('/p-account/meeting/new', function () {return view('p_account.index');});
Route::get('/p-account/meeting/edit/{child_id}', function () {return view('p_account.index');});
Route::get('/p-account/favorite', function () {return view('p_account.index');});
Route::get('/p-account/search', function () {return view('p_account.index');});
Route::get('/p-account/child', function () {return view('p_account.index');});
Route::get('/p-account/child/add', function () {return view('p_account.index');});
Route::get('/p-account/child/edit/hire-date/{child_id}', function () {return view('p_account.index');});
Route::get('/p-account/child/detail/{child_id}', function () {return view('p_account.index');});
Route::get('/p-account/profile', function () {return view('p_account.index');});
Route::get('/p-account/profile/edit/{father_id}', function () {return view('p_account.index');});
Route::get('/p-account/profile/edit/password/{father_id}', function () {return view('p_account.index');});
Route::get('/p-account/profile/withdrawal', function () {return view('p_account.index');});
Route::get('/p-account/profile/withdrawal/complete', function () {return view('p_account.index');});
Route::get('/p-account', function () {return view('p_account.index');});

Route::get('/contact-us',                                function () { return view('pages.contact.index'); });
Route::get('/contact-us/complete/',                      function () { return view('pages.contact.index'); });
Route::get('/unknown-error ',                            function () { return view('pages.contact.index'); });
//--------------------------------Child Account--------------------------------------//
Route::get('/register-temporary/c-account',              function () { return view('c_account.auth'); });
Route::get('/register/c-account',                        function () { return view('c_account.auth'); });
Route::get('/register/c-account/complete',               function () { return view('c_account.auth'); });
Route::get('/register/c-account/error',                  function () { return view('c_account.auth'); });
Route::get('/login/c-account',                           function () { return view('c_account.auth'); });
Route::get('/forgot-password/c-account',                 function () { return view('c_account.auth'); });
Route::get('/forgot-password/c-account/reset/{token}',   function () { return view('c_account.auth'); });
Route::get('/forgot-password/c-account/complete',        function () { return view('c_account.auth'); });

Route::get('/c-account/meeting',                         function () { return view('c_account.index'); });
Route::get('/c-account/meeting/detail/{id}',             function () { return view('c_account.index'); });
Route::get('/c-account/search',                          function () { return view('c_account.index'); });
Route::get('/c-account/parent',                          function () { return view('c_account.index'); });
Route::get('/c-account/parent/detail/{father_id}',       function () { return view('c_account.index'); });

Route::get('/c-account/profile',                         function () { return view('c_account.index'); });
Route::get('/c-account/profile/detail/{child_id}',       function () { return view('c_account.index'); });
Route::get('/c-account/profile/edit/{child_id}',         function () { return view('c_account.index'); });
Route::get('/c-account/profile/password-edit/{child_id}',function () { return view('c_account.index'); });
Route::get('/c-account/profile/withdrawal',              function () { return view('c_account.index'); });
Route::get('/withdrawal/complete',                       function () { return view('c_account.withdrawal.complete'); });

//--------------------------Admin Account----------------------------------------//
Route::group(['prefix' => 'admin'], function () {
    Route::get('/login',                               '\App\Http\Controllers\Api\AdminController@checkLogin')->name('adminlogin');
    Route::get('/logout',                              '\App\Http\Controllers\Api\AdminController@logout');

    Route::group(['middleware' => 'auth:admins'], function () {
        Route::get('/meeting',                         function () { return view('admin.index'); });
        Route::get('/meeting/edit/{meeting_id}',       function () { return view('admin.index'); });

        Route::get('/parent',                          function () { return view('admin.index'); });
        Route::get('/parent/detail/{father_id}',       function () { return view('admin.index'); });
        Route::get('/parent/edit/{father_id}',         function () { return view('admin.index'); });
        Route::get('/parent/edit/password/{father_id}',function () { return view('admin.index'); });
        Route::get('/parent/register',                 function () { return view('admin.index'); });

        Route::get('/child',                           function () { return view('admin.index'); });
        Route::get('/child/detail/{child_id}',         function () { return view('admin.index'); });
        Route::get('/child/edit/{child_id}',           function () { return view('admin.index'); });
        Route::get('/child/edit/password/{child_id}',  function () { return view('admin.index'); });
    });
});
