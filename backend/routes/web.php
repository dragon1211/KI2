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

// ---------------------------------------- Father Account ------------------------------------------ //
Route::group(['prefix' => 'p-account'],                 function () {
    Route::get('/',                                     function () { return view('p_account.auth'); });
    Route::get('/login',                                '\App\Http\Controllers\Api\FathersController@checkLogin')->name('fatherslogin');
    Route::get('/logout',                               '\App\Http\Controllers\Api\FathersController@logout');
    Route::get('/withdrawal/complete',                  function () { return view('p_account.auth'); });

    Route::group(['prefix' => 'register'],              function () {
        Route::get('/{token}',                          function () { return view('p_account.auth'); });
        Route::get('/complete/{token}',                 function () { return view('p_account.auth'); });
        Route::get('/error/{token}',                    function () { return view('p_account.auth'); });
    });
    Route::group(['prefix' => 'forgot-password'],       function () {
        Route::get('/',                                 function () { return view('p_account.auth'); });
        Route::get('/reset/{token}',                    function () { return view('p_account.auth'); });
        Route::get('/complete',                         function () { return view('p_account.auth'); });
    });

    Route::group(['middleware' => ['auth:fathers', 'notice.incomplete']],      function () {
        Route::group(['prefix' => 'meeting'],           function () {
            Route::get('/',                             function () { return view('p_account.index'); });
            Route::get('/detail/{meeting_id}',          function () { return view('p_account.index'); });
            Route::get('/new',                          function () { return view('p_account.index'); });
            Route::get('/edit/{child_id}',              function () { return view('p_account.index'); });
        });
        Route::get('/favorite',                         function () { return view('p_account.index'); });
        Route::get('/search',                           function () { return view('p_account.index'); });
        Route::group(['prefix' => 'child'],             function () {
            Route::get('/',                             function () { return view('p_account.index'); });
            Route::get('/add',                          function () { return view('p_account.index'); });
            Route::get('/edit/hire-date/{child_id}',    function () { return view('p_account.index'); });
            Route::get('/detail/{child_id}',            function () { return view('p_account.index'); });
        });
        Route::group(['prefix' => 'profile'],           function () {
            Route::get('/',                             function () { return view('p_account.index'); });
            Route::group(['prefix' => 'edit'],          function () {
                Route::get('/password/{father_id}',     function () { return view('p_account.index'); });
                Route::get('/{father_id}',              function () { return view('p_account.index'); });
            });
            Route::get('/withdrawal',                   function () { return view('p_account.index'); });
        });
    });
});

Route::group(['prefix' => 'contact-us'],                function () {
    Route::get('/',                                     function () { return view('pages.contact.index'); });
    Route::get('/complete',                             function () { return view('pages.contact.index'); });
});
Route::get('/unknown-error ',                           function () { return view('pages.contact.index'); });

// ---------------------------------------- Child Account ------------------------------------------- //
Route::group(['prefix' => 'c-account'],                 function () {
    Route::get('/register-temporary',                   function () { return view('c_account.auth'); });
    Route::get('/login',                                '\App\Http\Controllers\Api\ChildrenController@checkLogin')->name('childrenlogin');
    Route::get('/logout',                               '\App\Http\Controllers\Api\ChildrenController@logout');
    Route::get('/withdrawal/complete',                  function () { return view('c_account.auth'); });

    Route::group(['prefix' => 'register'],              function () {
        Route::get('/{token}',                          function () { return view('c_account.auth'); });
        Route::get('/complete/{token}',                 function () { return view('c_account.auth'); });
        Route::get('/error/{token}',                    function () { return view('c_account.auth'); });
    });
    Route::group(['prefix' => 'forgot-password'],       function () {
        Route::get('/',                                 function () { return view('c_account.auth'); });
        Route::get('/reset/{token}',                    function () { return view('c_account.auth'); });
        Route::get('/complete',                         function () { return view('c_account.auth'); });
    });

    Route::group(['middleware' => ['auth:children', 'notice.nonapproval']],     function () {
        Route::group(['prefix' => 'meeting'],           function () {
            Route::get('/',                             function () { return view('c_account.index'); });
            Route::get('/detail/{id}',                  function () { return view('c_account.index'); });
        });
        Route::get('/search',                           function () { return view('c_account.index'); });
        Route::group(['prefix' => 'parent'],            function () {
            Route::get('/',                             function () { return view('c_account.index'); });
            Route::get('/detail/{father_id}',           function () { return view('c_account.index'); });
        });

        Route::group(['prefix' => 'profile'],           function () {
            Route::get('/',                             function () { return view('c_account.index'); });
            Route::get('/detail/{child_id}',            function () { return view('c_account.index'); });
            Route::get('/edit/{child_id}',              function () { return view('c_account.index'); });
            Route::get('/password-edit/{child_id}',     function () { return view('c_account.index'); });
            Route::get('/withdrawal',                   function () { return view('c_account.index'); });
        });
    });
});

// ---------------------------------------- Admin Account ------------------------------------------- //
Route::group(['prefix' => 'admin'],                     function () {
    Route::get('/login',                                '\App\Http\Controllers\Api\AdminController@checkLogin')->name('adminslogin');
    Route::get('/logout',                               '\App\Http\Controllers\Api\AdminController@logout');

    Route::group(['middleware' => 'auth:admins'],       function () {
        Route::get('/meeting',                          function () { return view('admin.index'); });
        Route::get('/meeting/detail/{meeting_id}',      function () { return view('admin.index'); });
        Route::get('/meeting/edit/{meeting_id}',        function () { return view('admin.index'); });

        Route::get('/parent',                           function () { return view('admin.index'); });
        Route::get('/parent/detail/{father_id}',        function () { return view('admin.index'); });
        Route::get('/parent/edit/{father_id}',          function () { return view('admin.index'); });
        Route::get('/parent/edit/password/{father_id}', function () { return view('admin.index'); });
        Route::get('/parent/register',                  function () { return view('admin.index'); });

        Route::get('/child',                            function () { return view('admin.index'); });
        Route::get('/child/detail/{child_id}',          function () { return view('admin.index'); });
        Route::get('/child/edit/{child_id}',            function () { return view('admin.index'); });
        Route::get('/child/edit/password/{child_id}',   function () { return view('admin.index'); });
    });
});
