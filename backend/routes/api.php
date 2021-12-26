<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
|--------------------------------------------------------------------------
| ルート名（->name()）の説明
|--------------------------------------------------------------------------
|
| コードは 1 2 3
| 1 = コントローラー（p = Fathers、c = Children、m = Meetings等）
| 2 = 関数（updateImage = i、updatePassword = p、detail = d等）
| 3 = 画面（a = 管理者、p = 親、c = 子、n = なし）
|
*/

Route::group(['prefix' => 'admin'], function () {
    // AdminController
    Route::post('/login', '\App\Http\Controllers\Api\AdminController@login');

    Route::group(['middleware' => 'auth:admins'], function () {
        // AdminController
        Route::post('/logout', '\App\Http\Controllers\Api\AdminController@logout');

        // FathersController
        Route::group(['prefix' => 'fathers'], function () {
            Route::get('/list', '\App\Http\Controllers\Api\FathersController@list');
            Route::get('/search', '\App\Http\Controllers\Api\FathersController@search');
            Route::put('/updateImage/{father_id}', '\App\Http\Controllers\Api\FathersController@updateImage')->name('pia');
            Route::put('/updateProfile/{father_id}', '\App\Http\Controllers\Api\FathersController@updateProfile')->name('pua');
            Route::put('/updatePassword/{father_id}', '\App\Http\Controllers\Api\FathersController@updatePassword')->name('ppa');
            Route::get('/detail/{father_id}', '\App\Http\Controllers\Api\FathersController@detail')->name('pda');
            Route::delete('/delete/{father_id}', '\App\Http\Controllers\Api\FathersController@withdrawal');
            Route::post('/registerTemporary', '\App\Http\Controllers\Api\FathersController@registerTemporary');
        });

        // ChildrenController
        Route::group(['prefix' => 'children'], function () {
            Route::get('/list', '\App\Http\Controllers\Api\ChildrenController@list');
            Route::get('/search', '\App\Http\Controllers\Api\ChildrenController@search');
            Route::put('/updateProfile/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateProfile')->name('cua');
            Route::put('/updateImage/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateImage')->name('cia');
            Route::put('/updatePassword/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updatePassword')->name('cpa');
            Route::get('/detail/{child_id}', '\App\Http\Controllers\Api\ChildrenController@detail')->name('cda');
            Route::delete('/delete/{child_id}', '\App\Http\Controllers\Api\ChildrenController@withdrawal');
        });

        // MeetingsController
        Route::group(['prefix' => 'meetings'], function () {
            Route::get('/list', '\App\Http\Controllers\Api\MeetingsController@list');
            Route::get('/search', '\App\Http\Controllers\Api\MeetingsController@search');
            Route::get('/detail/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@detail')->name('mda');
            Route::put('/update/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@update');
            Route::delete('/delete/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@delete');
        });

        Route::group(['prefix' => 'meeting'], function () {
            // MeetingImagesController
            Route::group(['prefix' => 'images'], function () {
                Route::post('/register', '\App\Http\Controllers\Api\MeetingImagesController@register');
                Route::delete('/delete/{meeting_id}', '\App\Http\Controllers\Api\MeetingImagesController@delete');
            });
    
            // MeetingApprovalsController
            Route::group(['prefix' => 'approvals'], function () {
                Route::post('/register', '\App\Http\Controllers\Api\MeetingApprovalsController@register');
                Route::delete('/delete', '\App\Http\Controllers\Api\MeetingApprovalsController@delete');
            });
        });
    });
});

// ContactsController
Route::post('/contacts/register', '\App\Http\Controllers\Api\ContactsController@register');

Route::group(['prefix' => 'fathers'], function () {
    // FathersController
    Route::get('/checkRegisterMain', '\App\Http\Controllers\Api\FathersController@checkRegisterMain');
    Route::post('/registerMain', '\App\Http\Controllers\Api\FathersController@registerMain');
    Route::post('/requestPassword', '\App\Http\Controllers\Api\FathersController@requestPassword');
    Route::post('/login', '\App\Http\Controllers\Api\FathersController@login');
    Route::put('/updatePassword/{father_id?}', '\App\Http\Controllers\Api\FathersController@updatePassword')->name('ppp');

    Route::group(['middleware' => ['auth:fathers', 'notice.incomplete']], function () {
        Route::put('/updateImage/{father_id}', '\App\Http\Controllers\Api\FathersController@updateImage')->name('pip');
        Route::put('/updateProfile/{father_id}', '\App\Http\Controllers\Api\FathersController@updateProfile')->name('pup');
        Route::delete('/withdrawal', '\App\Http\Controllers\Api\FathersController@withdrawal');
        Route::get('/detail/{father_id}', '\App\Http\Controllers\Api\FathersController@detail')->name('pdp');
        Route::post('/meetingNotification', '\App\Http\Controllers\Api\FathersController@approvalNotification')->name('cmnotifynew');
        Route::post('/meetingEditNotification', '\App\Http\Controllers\Api\FathersController@approvalNotification')->name('cmnotifyedit');

        // ChildrenController
        Route::group(['prefix' => 'children'], function () {
            Route::get('/listOfFather', '\App\Http\Controllers\Api\ChildrenController@listOfFather');
            Route::get('/listOfMeeting', '\App\Http\Controllers\Api\ChildrenController@listOfMeeting');
            Route::post('/listOfMeetingNotifyUnapprovel', '\App\Http\Controllers\Api\ChildrenController@listOfMeetingNotifyUnapprovel');
            Route::post('/listOfMeetingNotifyApprovel', '\App\Http\Controllers\Api\ChildrenController@listOfMeetingNotifyApprovel');
            Route::get('/detail/{child_id}', '\App\Http\Controllers\Api\ChildrenController@detail')->name('cdp');
        });

        // MeetingsController
        Route::group(['prefix' => 'meetings'], function () {
            Route::post('/register', '\App\Http\Controllers\Api\MeetingsController@register');
            Route::post('/registerFavorite', '\App\Http\Controllers\Api\MeetingsController@registerFavorite');
            Route::get('/listOfCompleteOfFather', '\App\Http\Controllers\Api\MeetingsController@listOfCompleteOfFather');
            Route::get('/listOfIncompleteOfFather', '\App\Http\Controllers\Api\MeetingsController@listOfIncompleteOfFather');
            Route::get('/listOfFavoriteOfFather', '\App\Http\Controllers\Api\MeetingsController@listOfFavoriteOfFather');
            Route::get('/listOfNonFavoriteOfFather', '\App\Http\Controllers\Api\MeetingsController@listOfNonFavoriteOfFather');
            Route::get('/searchOfCompleteOfFather', '\App\Http\Controllers\Api\MeetingsController@searchOfCompleteOfFather');
            Route::get('/searchOfIncompleteOfFather', '\App\Http\Controllers\Api\MeetingsController@searchOfIncompleteOfFather');
            Route::get('/detail/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@detail')->name('mdp');
            Route::put('/update/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@update');
            Route::delete('/delete/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@delete');
            Route::put('/updateMemo', '\App\Http\Controllers\Api\MeetingsController@updateMemo');
        });

        Route::group(['prefix' => 'meeting'], function () {
            // MeetingImagesController
            Route::group(['prefix' => 'images'], function () {
                Route::post('/register', '\App\Http\Controllers\Api\MeetingImagesController@register');
                Route::delete('/delete/{meeting_id}', '\App\Http\Controllers\Api\MeetingImagesController@delete');
            });

            // MeetingApprovalsController
            Route::group(['prefix' => 'approvals'], function () {
                Route::post('/register', '\App\Http\Controllers\Api\MeetingApprovalsController@register');
                Route::delete('/delete', '\App\Http\Controllers\Api\MeetingApprovalsController@delete');
                Route::post('/listChildrenOfMeeting', '\App\Http\Controllers\Api\MeetingApprovalsController@listChildrenOfMeeting');
                Route::get('/listChildrenOfApprovel', '\App\Http\Controllers\Api\MeetingApprovalsController@listChildrenOfApprovel');
                Route::get('/listChildrenOfUnapprovel', '\App\Http\Controllers\Api\MeetingApprovalsController@listChildrenOfUnapprovel');
                Route::get('/countIncomplete', '\App\Http\Controllers\Api\MeetingApprovalsController@countIncomplete');
            });
        });

        // FatherRelationsController
        Route::group(['prefix' => 'relations'], function () {
            Route::get('/check', '\App\Http\Controllers\Api\FatherRelationsController@check');
            Route::post('/register', '\App\Http\Controllers\Api\FatherRelationsController@register');
            Route::put('/updateHireDate/{child_id}', '\App\Http\Controllers\Api\FatherRelationsController@updateHireDate');
            Route::delete('/deleteRelationChild/{child_id}', '\App\Http\Controllers\Api\FatherRelationsController@deleteRelationChild');
        });
    });
});

// ChildrenController
Route::group(['prefix' => 'children'], function () {
    Route::post('/registerTemporary', '\App\Http\Controllers\Api\ChildrenController@registerTemporary');
    Route::get('/checkRegisterMain', '\App\Http\Controllers\Api\ChildrenController@checkRegisterMain');
    Route::post('/registerMain', '\App\Http\Controllers\Api\ChildrenController@registerMain');
    Route::post('/requestPassword', '\App\Http\Controllers\Api\ChildrenController@requestPassword');
    Route::post('/login', '\App\Http\Controllers\Api\ChildrenController@login');
    Route::put('/updatePassword/{child_id?}', '\App\Http\Controllers\Api\ChildrenController@updatePassword')->name('cpc');

    Route::group(['middleware' => ['auth:children', 'notice.nonapproval']], function () {
        Route::get('/detail/{child_id}', '\App\Http\Controllers\Api\ChildrenController@detail')->name('cdc');
        Route::put('/updateImage/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateImage')->name('cic');
        Route::put('/updateProfile/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateProfile')->name('cuc');
        Route::delete('/withdrawal', '\App\Http\Controllers\Api\ChildrenController@withdrawal');

        // FathersController
        Route::group(['prefix' => 'fathers'], function () {
            Route::get('/listOfChild', '\App\Http\Controllers\Api\FathersController@listOfChild');
            Route::get('/detail/{father_id}', '\App\Http\Controllers\Api\FathersController@detail')->name('pdc');
        });

        // MeetingsController
        Route::group(['prefix' => 'meetings'], function () {
            Route::get('/listOfApprovalOfChild', '\App\Http\Controllers\Api\MeetingsController@listOfApprovalOfChild');
            Route::get('/listOfNonApprovalOfChild', '\App\Http\Controllers\Api\MeetingsController@listOfNonApprovalOfChild');
            Route::get('/searchOfApprovalOfChild', '\App\Http\Controllers\Api\MeetingsController@searchOfApprovalOfChild');
            Route::get('/searchOfNonApprovalOfChild', '\App\Http\Controllers\Api\MeetingsController@searchOfNonApprovalOfChild');
            Route::get('/detail/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@detail')->name('mdc');
        });

        Route::group(['prefix' => 'meeting'], function () {
            // MeetingApprovalsController
            Route::group(['prefix' => 'approvals'], function () {
                Route::post('/registerApproval', '\App\Http\Controllers\Api\MeetingApprovalsController@registerApproval');
                Route::get('/countNonApproval', '\App\Http\Controllers\Api\MeetingApprovalsController@countNonApproval');
            });
        });
    });
});
