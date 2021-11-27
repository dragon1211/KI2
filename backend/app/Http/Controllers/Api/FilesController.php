<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

use App\Models\Meeting;
use App\Models\MeetingImage;
use App\Models\Child;
use App\Models\Father;
use App\Models\FatherRelations;

class FilesController extends Controller {
    public function __invoke (Request $request, $path) {
        $err = 'このファイルは存在しません。パスをご確認下さい。';
        abort_if(!Storage::disk('private')->exists($path), 404, $err);
        abort_if(!session()->has('children') && !session()->has('fathers') && !session()->has('admins'), 404, $err);

        if (substr($path, -4) == '.pdf') {
            if (session()->has('children')) {
                abort_if(null === ($rel = FatherRelations::where('child_id', (int)session()->get('children')['id'])->first()), 404, $err);
                abort_if(null === (Meeting::where('father_id', $rel->father_id)->where('pdf', '/files/'.$path)->first()), 404, $err);
            }
            else if (session()->has('fathers')) {
                abort_if(null === (Meeting::where('father_id', (int)session()->get('fathers')['id'])->where('pdf', '/files/'.$path)->first()), 404, $err);
            }
        }
        else {
            if (null !== ($meetimg = MeetingImage::where('image', '/files/'.$path)->first())) {
                if (session()->has('children')) {
                    abort_if(null === ($rel = FatherRelations::where('child_id', (int)session()->get('children')['id'])->first()), 404, $err);
                    abort_if(null === (Meeting::where('id', $meetimg->meeting_id)->where('father_id', $rel->father_id)->first()), 404, $err);
                }
                if (session()->has('fathers')) {
                    abort_if(null === (Meeting::where('id', $meetimg->meeting_id)->where('father_id', (int)session()->get('fathers')['id'])->first()), 404, $err);
                }
            }
            else {
                if (session()->has('children')) {
                    abort_if(null === (Child::where('id', (int)session()->get('children')['id'])->where('image', '/files/'.$path)->first()), 404, $err);
                }
                else if (session()->has('fathers')) {
                    abort_if(null === (Father::where('id', (int)session()->get('fathers')['id'])->where('image', '/files/'.$path)->first()), 404, $err);
                }
            }
        }

        return Storage::disk('private')->response($path);
    }
}