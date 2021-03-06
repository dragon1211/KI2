<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller, Session;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;
use Illuminate\Support\Facades\Log;

use App\Models\Meeting;
use App\Models\MeetingImage;
use App\Models\Child;
use App\Models\Father;
use App\Models\FatherRelation;

class FilesController extends Controller {
    public function __invoke (Request $request, $path) {
        $err = 'このファイルは存在しません。パスをご確認下さい。';
        $got = false;
        abort_if(!Storage::disk('private')->exists($path), 404, $err);
        abort_if(!session()->has('children') && !session()->has('fathers') && !session()->has('admins'), 404, $err);

        // 管理者は全部見えます。
        if (session()->has('admins')) {
            $got = true;
        }

        // 既にgotはtrueの場合、スキップ。このチェックが無いと、trueになったらも全部確認する様になります。
        if (!$got) {
            // PDFの場合
            if (substr($path, -4) == '.pdf') {
                // 子供
                if (session()->has('children')) {
                    // ミーティング
                    foreach ($rel = FatherRelation::where('child_id', (int)session()->get('children')['id'])->get() as $rel) {
                        if (null !== (Meeting::where('father_id', $rel->father_id)->where('pdf', '/files/'.$path)->first())) {
                            $got = true;
                        }
                    }
                }
                // 親
                if (!$got && session()->has('fathers')) {
                    // ミーティング
                    if (null !== (Meeting::where('father_id', (int)session()->get('fathers')['id'])->where('pdf', '/files/'.$path)->first())) {
                        $got = true;
                    }
                }

                abort_if(!$got, 404, $err);
            }
            // 画像の場合
            else {
                // ミーティング
                if (null !== ($meetimg = MeetingImage::where('image', '/files/'.$path)->first())) {
                    // 子供
                    if (session()->has('children')) {
                        foreach (FatherRelation::where('child_id', (int)session()->get('children')['id'])->get() as $rel) {
                            if (null !== (Meeting::where('id', $meetimg->meeting_id)->where('father_id', $rel->father_id)->first())) {
                                $got = true;
                            }
                        }
                    }
                    // 親
                    if (!$got && session()->has('fathers')) {
                        if (null !== (Meeting::where('id', $meetimg->meeting_id)->where('father_id', (int)session()->get('fathers')['id'])->first())) {
                            $got = true;
                        }
                    }
                }
                else {
                    if (session()->has('children')) {
                        if (null !== (Child::where('id', (int)session()->get('children')['id'])->where('image', '/files/'.$path)->first())) {
                            $got = true;
                        }
                        foreach (FatherRelation::select('father_id')->where('child_id', (int)session()->get('children')['id'])->get() as $rel) {
                            if (null !== (Father::where('id', (int)$rel->father_id)->where('image', '/files/'.$path)->first())) {
                                $got = true;
                            }
                        }
                    }
                    if (session()->has('fathers')) {
                        if (null !== (Father::where('id', (int)session()->get('fathers')['id'])->where('image', '/files/'.$path)->first())) {
                            $got = true;
                        }
                        foreach (FatherRelation::select('child_id')->where('father_id', (int)session()->get('fathers')['id'])->get() as $rel) {
                            if (null !== (Child::where('id', (int)$rel->child_id)->where('image', '/files/'.$path)->first())) {
                                $got = true;
                            }
                        }
                    }
                }

                abort_if(!$got, 404, $err);
            }
        }

        return Storage::disk('private')->response($path);
    }
}
