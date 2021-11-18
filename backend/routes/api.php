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
            Route::put('/updateImage/{father_id}', '\App\Http\Controllers\Api\FathersController@updateImage');
            Route::put('/updateProfile/{father_id}', '\App\Http\Controllers\Api\FathersController@updateProfile');
            Route::put('/updatePassword/{father_id}', '\App\Http\Controllers\Api\FathersController@updatePassword');
            Route::get('/detail/{father_id}', '\App\Http\Controllers\Api\FathersController@detail');
            Route::delete('/delete/{father_id}', '\App\Http\Controllers\Api\FathersController@withdrawal');
            Route::post('/registerTemporary', '\App\Http\Controllers\Api\FathersController@registerTemporary');
        });

        // ChildrenController
        Route::group(['prefix' => 'children'], function () {
            Route::get('/list', '\App\Http\Controllers\Api\ChildrenController@list');
            Route::get('/search', '\App\Http\Controllers\Api\ChildrenController@search');
            Route::put('/updateProfile/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateProfile');
            Route::put('/updateImage/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateImage');
            Route::put('/updatePassword/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updatePassword');
            Route::get('/detail/{child_id}', '\App\Http\Controllers\Api\ChildrenController@detail')->name('mda');
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
    Route::post('/registerMain', '\App\Http\Controllers\Api\FathersController@registerMain');
    Route::post('/requestPassword', '\App\Http\Controllers\Api\FathersController@requestPassword');
    Route::post('/login', '\App\Http\Controllers\Api\FathersController@login');
    Route::put('/updatePassword/{father_id?}', '\App\Http\Controllers\Api\FathersController@updatePassword');

    Route::group(['middleware' => ['auth:fathers', 'notice.incomplete']], function () {
        Route::put('/updateImage/{father_id}', '\App\Http\Controllers\Api\FathersController@updateImage');
        Route::put('/updateProfile/{father_id}', '\App\Http\Controllers\Api\FathersController@updateProfile');
        Route::delete('/withdrawal', '\App\Http\Controllers\Api\FathersController@withdrawal');
        Route::get('/detail/{father_id}', '\App\Http\Controllers\Api\FathersController@detail');
        Route::post('/approvalNotification', '\App\Http\Controllers\Api\FathersController@approvalNotification');

        // ChildrenController
        Route::group(['prefix' => 'children'], function () {
            Route::get('/listOfFather', '\App\Http\Controllers\Api\ChildrenController@listOfFather');
            Route::get('/listOfMeeting', '\App\Http\Controllers\Api\ChildrenController@listOfMeeting');
            Route::post('/listOfMeetingNotifyUnapprovel', '\App\Http\Controllers\Api\ChildrenController@listOfMeetingNotifyUnapprovel');
            Route::post('/listOfMeetingNotifyApprovel', '\App\Http\Controllers\Api\ChildrenController@listOfMeetingNotifyApprovel');
            Route::get('/detail/{child_id}', '\App\Http\Controllers\Api\ChildrenController@detail')->name('mdp');
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
            Route::post('/register', '\App\Http\Controllers\Api\FatherRelationsController@register');
            Route::put('/updateHireDate/{child_id}', '\App\Http\Controllers\Api\FatherRelationsController@updateHireDate');
            Route::delete('/deleteRelationChild/{child_id}', '\App\Http\Controllers\Api\FatherRelationsController@deleteRelationChild');
        });
    });
});

// ChildrenController
Route::group(['prefix' => 'children'], function () {
    Route::post('/registerTemporary', '\App\Http\Controllers\Api\ChildrenController@registerTemporary');
    Route::post('/registerMain', '\App\Http\Controllers\Api\ChildrenController@registerMain');
    Route::post('/requestPassword', '\App\Http\Controllers\Api\ChildrenController@requestPassword');
    Route::post('/login', '\App\Http\Controllers\Api\ChildrenController@login');
    Route::put('/updatePassword/{child_id?}', '\App\Http\Controllers\Api\ChildrenController@updatePassword');

    Route::group(['middleware' => ['auth:children', 'notice.nonapproval']], function () {
        Route::get('/detail/{child_id}', '\App\Http\Controllers\Api\ChildrenController@detail')->name('mdc');
        Route::put('/updateImage/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateImage');
        Route::put('/updateProfile/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateProfile');
        Route::delete('/withdrawal', '\App\Http\Controllers\Api\ChildrenController@withdrawal');

        // FathersController
        Route::group(['prefix' => 'fathers'], function () {
            Route::get('/listOfChild', '\App\Http\Controllers\Api\FathersController@listOfChild');
            Route::get('/detail/{father_id}', '\App\Http\Controllers\Api\FathersController@detail');
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
