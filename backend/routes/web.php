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

Route::get('/p-account', function () {return view('p_account.index');});

Route::get('/contact-us',                                function () { return view('pages.contact.index'); });
Route::get('/contact-us/complete/',                      function () { return view('pages.contact.complete'); });
Route::get('/unknown-error ',                            function () { return view('pages.contact.unknown_error'); });
//--------------------------------Child Account--------------------------------------//
Route::get('/register-temporary/c-account',              function () { return view('c_account.auth.register.temporary'); });
Route::get('/register/c-account',                        function () { return view('c_account.auth.register.index'); });
Route::get('/register/c-account/complete',               function () { return view('c_account.auth.register.complete'); });
Route::get('/register/c-account/error',                  function () { return view('c_account.auth.register.error'); });
Route::get('/login/c-account',                           function () { return view('c_account.auth.login.index'); });
Route::get('/forgot-password/c-account',                function () { return view('c_account.auth.forgot_password.index'); });
Route::get('/forgot-password/c-account/reset/{token}',          function () { return view('c_account.auth.forgot_password.reset'); });
Route::get('/forgot-password/c-account/complete',       function () { return view('c_account.auth.forgot_password.complete'); });

Route::get('/c-account/meeting',                        function () { return view('c_account.meeting.index'); });
Route::get('/c-account/meeting/detail/{id}',            function () { return view('c_account.meeting.detail'); });
Route::get('/c-account/search',                          function () { return view('c_account.search.index'); });
Route::get('/c-account/parent',                          function () { return view('c_account.parent.index'); });
Route::get('/c-account/parent/detail/{father_id}',       function () { return view('c_account.parent.detail'); });

Route::get('/c-account/profile',                         function () { return view('c_account.profile.index'); });
Route::get('/c-account/profile/detail/{child_id}',        function () { return view('c_account.profile.detail'); });
Route::get('/c-account/profile/edit/{child_id}',          function () { return view('c_account.profile.edit'); });
Route::get('/c-account/profile/password-edit/{child_id}', function () { return view('c_account.profile.password_edit'); });
Route::get('/c-account/profile/withdrawal',              function () { return view('c_account.profile.withdrawal'); });
Route::get('/withdrawal/complete',                     function () { return view('c_account.withdrawal.complete'); });



//--------------------------Admin Account----------------------------------------//
Route::get('/login/admin',                         function () { return view('admin.login.index'); });
Route::get('/admin/meeting',                        function () { return view('admin.meeting.index'); });
Route::get('/admin/meeting/detail/{meeting_id}',    function () { return view('admin.meeting.detail'); });
Route::get('/admin/meeting/edit/{meeting_id}',      function () { return view('admin.meeting.edit'); });

Route::get('/admin/parent',                          function () { return view('admin.parent.index'); });
Route::get('/admin/parent/detail/{father_id}',        function () { return view('admin.parent.detail'); });
Route::get('/admin/parent/edit/{father_id}',          function () { return view('admin.parent.edit'); });
Route::get('/admin/parent/edit/password/{father_id}',  function () { return view('admin.parent.edit_password'); });
Route::get('/admin/parent/register',                   function () { return view('admin.parent.register'); });

Route::get('/admin/child',                         function () { return view('admin.child.index'); });
Route::get('/admin/child/detail/{child_id}',         function () { return view('admin.child.detail'); });
Route::get('/admin/child/edit/{child_id}',           function () { return view('admin.child.edit'); });
Route::get('/admin/child/edit/password/{child_id}',   function () { return view('admin.child.edit_password'); });


