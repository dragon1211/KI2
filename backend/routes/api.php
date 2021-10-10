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

// FathersController
// Route::post('/fathers/login/', '\App\Http\Controllers\Api\FathersController@login');
// Route::post('/fathers/registerTemporary/', '\App\Http\Controllers\Api\FathersController@registerTemporary');
// Route::post('/fathers/registerMain/', '\App\Http\Controllers\Api\FathersController@registerMain');
Route::get('/fathers/list/', '\App\Http\Controllers\Api\FathersController@list');
Route::get('/fathers/listOfChild/', '\App\Http\Controllers\Api\FathersController@listOfChild');
Route::get('/fathers/detail/{father_id}', '\App\Http\Controllers\Api\FathersController@detail');
// Route::put('/fathers/updateImage/{father_id}', '\App\Http\Controllers\Api\FathersController@updateImage');
// Route::put('/fathers/updateProfile/{father_id}', '\App\Http\Controllers\Api\FathersController@updateProfile');
// Route::put('/fathers/updatePassword/{father_id}', '\App\Http\Controllers\Api\FathersController@updatePassword');
Route::delete('/fathers/delete/{father_id}', '\App\Http\Controllers\Api\FathersController@delete');
// Route::post('/fathers/checkEmail/', '\App\Http\Controllers\Api\FathersController@checkEmail');

// EmailActivationsController
Route::delete('/email-activations/deleteRelationOfFather/', '\App\Http\Controllers\Api\EmailActivationsController@deleteRelationOfFather');

// TelActivationsController
Route::delete('/tel-activations/deleteRelationOfChild/', '\App\Http\Controllers\Api\TelActivationsController@deleteRelationOfChild');

// MeetingsController
Route::post('/meetings/register/', '\App\Http\Controllers\Api\MeetingsController@register');
Route::post('/meetings/registerFavorite/', '\App\Http\Controllers\Api\MeetingsController@registerFavorite');
Route::get('/meetings/list/', '\App\Http\Controllers\Api\MeetingsController@list');
Route::get('/meetings/listOfApprovalOfChild/', '\App\Http\Controllers\Api\MeetingsController@listOfApprovalOfChild');
Route::get('/meetings/listOfNonApprovalOfChild/', '\App\Http\Controllers\Api\MeetingsController@listOfNonApprovalOfChild');
Route::get('/meetings/listOfCompleteOfFather/', '\App\Http\Controllers\Api\MeetingsController@listOfCompleteOfFather');
Route::get('/meetings/listOfIncompleteOfFather/', '\App\Http\Controllers\Api\MeetingsController@listOfIncompleteOfFather');
Route::get('/meetings/listOfFavoriteOfFather/', '\App\Http\Controllers\Api\MeetingsController@listOfFavoriteOfFather');
Route::get('/meetings/listOfNonFavoriteOfFather/', '\App\Http\Controllers\Api\MeetingsController@listOfNonFavoriteOfFather');
Route::get('/meetings/searchOfApprovalOfChild/', '\App\Http\Controllers\Api\MeetingsController@searchOfApprovalOfChild');
Route::get('/meetings/searchOfNonApprovalOfChild/', '\App\Http\Controllers\Api\MeetingsController@searchOfNonApprovalOfChild');
Route::get('/meetings/searchOfCompleteOfFather/', '\App\Http\Controllers\Api\MeetingsController@searchOfCompleteOfFather');
Route::get('/meetings/searchOfIncompleteOfFather/', '\App\Http\Controllers\Api\MeetingsController@searchOfIncompleteOfFather');
Route::get('/meetings/detail/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@detail');
Route::delete('/meetings/delete/{meeting_id}', '\App\Http\Controllers\Api\MeetingsController@delete');
Route::delete('/meetings/deleteRelationFather/{father_id}', '\App\Http\Controllers\Api\MeetingsController@deleteRelationFather');

// MeetingImagesController
Route::post('/meeting-images/register/', '\App\Http\Controllers\Api\MeetingImagesController@register');
Route::delete('/meeting-images/deleteRelationMeeting/{meeting_id}', '\App\Http\Controllers\Api\MeetingImagesController@deleteRelationMeeting');

// MeetingApprovalsController
// Route::post('/meeting-approvals/register/', '\App\Http\Controllers\Api\MeetingApprovalsController@register');
// Route::post('/meeting-approvals/registerOfApproval/', '\App\Http\Controllers\Api\MeetingApprovalsController@registerOfApproval');
// Route::post('/meeting-approvals/listChildrenOfMeeting/', '\App\Http\Controllers\Api\MeetingApprovalsController@listChildrenOfMeeting');
Route::get('/meeting-approvals/listChildrenOfApprovel/', '\App\Http\Controllers\Api\MeetingApprovalsController@listChildrenOfApprovel');
Route::get('/meeting-approvals/listChildrenOfUnapprovel/', '\App\Http\Controllers\Api\MeetingApprovalsController@listChildrenOfUnapprovel');
Route::delete('/meeting-approvals/deleteRelationMeeting/{meeting_id}', '\App\Http\Controllers\Api\MeetingApprovalsController@deleteRelationMeeting');
Route::delete('/meeting-approvals/deleteRelationChild/{child_id}', '\App\Http\Controllers\Api\MeetingApprovalsController@deleteRelationChild');

// ChildrenController
// Route::post('/children/login/', '\App\Http\Controllers\Api\ChildrenController@login');
// Route::post('/children/registerTemporary/', '\App\Http\Controllers\Api\ChildrenController@registerTemporary');
// Route::post('/children/registerMain/', '\App\Http\Controllers\Api\ChildrenController@registerMain');
// Route::post('/children/checkTel/', '\App\Http\Controllers\Api\ChildrenController@checkTel');
Route::get('/children/list/', '\App\Http\Controllers\Api\ChildrenController@list');
Route::get('/children/listOfFather/', '\App\Http\Controllers\Api\ChildrenController@listOfFather');
Route::get('/children/listOfMeeting/', '\App\Http\Controllers\Api\ChildrenController@listOfMeeting');
// Route::post('/children/listOfMeetingNotifyUnapprovel/', '\App\Http\Controllers\Api\ChildrenController@listOfMeetingNotifyUnapprovel');
// Route::post('/children/listOfMeetingNotifyApprovel/', '\App\Http\Controllers\Api\ChildrenController@listOfMeetingNotifyApprovel');
Route::get('/children/detail/{child_id}', '\App\Http\Controllers\Api\ChildrenController@detail');
// Route::put('/children/updateImage/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateImage');
// Route::put('/children/updateProfile/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updateProfile');
// Route::put('/children/updatePassword/{child_id}', '\App\Http\Controllers\Api\ChildrenController@updatePassword');
Route::delete('/children/delete/{child_id}', '\App\Http\Controllers\Api\ChildrenController@delete');

// FatherRelationsController
Route::post('/father-relations/register/', '\App\Http\Controllers\Api\FatherRelationsController@register');
Route::post('/father-relations/updateHireDate/{child_id}', '\App\Http\Controllers\Api\FatherRelationsController@updateHireDate');
Route::delete('/father-relations/deleteRelationFather/{father_id}', '\App\Http\Controllers\Api\FatherRelationsController@deleteRelationFather');
Route::delete('/father-relations/deleteRelationChild/{child_id}', '\App\Http\Controllers\Api\FatherRelationsController@deleteRelationChild');

// LoginLimitsController
Route::post('/login-limits/countFailure/', '\App\Http\Controllers\Api\LoginLimitsController@countFailure');
Route::delete('/login-limits/delete/', '\App\Http\Controllers\Api\LoginLimitsController@delete');

// ContactsController
Route::post('/contacts/register/', '\App\Http\Controllers\Api\ContactsController@register');
