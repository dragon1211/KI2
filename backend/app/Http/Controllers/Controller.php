<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\Log;
use Image;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    /**
     * UUID 生成
     * @return string
     * @throws \Exception
     */
    public function uuidv4 () : string {
        $chars = str_split('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx');

        foreach ($chars as $i => $char) {
            if ($char === 'x') {
                $chars[$i] = dechex(random_int(0, 15));
            } elseif ($char === 'y') {
                $chars[$i] = dechex(random_int(8, 11));
            }
        }

        return implode('', $chars);
    }

    public function telsize ($value) {
        try {
            return strlen((string)$value) == 10 || strlen((string)$value) == 11;
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return false;
        }
    }

    public function imagesize ($value) {
        try {
            return strlen($value) < 10485760; // 10 MiB（メビバイト） / 10.48576 MB（メガバイト）
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return false;
        }
    }

    public function imagesizecannull ($value) {
        if ($value == 'null') $value = null;
        if (is_null($value)) return true;
        return $this->imagesize($value);
    }

    public function imagememe ($value) {
        try {
            return (
                mime_content_type($value) == 'image/jpeg' || // jpg
                mime_content_type($value) == 'image/png'  || // png
                mime_content_type($value) == 'image/gif'     // gif
            );
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return false;
        }
    }

    public function imagememecannull ($value) {
        if ($value == 'null') $value = null;
        if (is_null($value)) return true;
        return $this->imagememe($value);
    }

    public function imagememeorfile ($value) {
        try {
            $ok = true;
            foreach (json_decode($value) as $v) {
                if (substr($v, -5) == '.jpeg' || substr($v, -4) == '.jpg' || substr($v, -4) == '.png' || substr($v, -4) == '.gif') {
                    if (
                        substr($v, -5) != '.jpeg' && // jpeg
                        substr($v, -4) != '.jpg'  && // jpg
                        substr($v, -4) != '.png'  && // png
                        substr($v, -4) != '.gif'     // gif
                    ) {
                        $ok = false;
                    }
                }
                else {
                    $ok = $this->imagememe($v);
                }
            }

            return $ok;
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return false;
        }
    }

    public function imagemememulti ($value) {
        try {
            $ok = true;
            foreach (json_decode($value) as $v) {
                if (
                    mime_content_type($v) != 'image/jpeg' && // jpg
                    mime_content_type($v) != 'image/png'  && // png
                    mime_content_type($v) != 'image/gif'     // gif
                ) {
                    $ok = false;
                }
            }
            return $ok;
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return false;
        }
    }

    public function imagesizemulti ($value) {
        try {
            $ok = true;
            foreach (json_decode($value) as $v) {
                if (strlen(base64_decode($v)) > 10485760) { // 10 MiB（メビバイト） / 10.48576 MB（メガバイト）
                    $ok = false;
                }
            }
            return $ok;
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return false;
        }
    }

    public function pdfsize ($value) {
        try {
            return strlen($value) < 52428800; // 50 MiB（メビバイト） / 52.4288 MB（メガバイト）
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return false;
        }
    }

    public function pdfmeme ($value) {
        try {
            if ($value == 'null') $value = null;
            if (is_null($value)) {
                return true;
            }
            else if (substr($value, -4) != '.pdf') {
                return mime_content_type($value) == 'application/pdf';
            }
            else {
                return substr($value, -4) == '.pdf';
            }
        } catch (\Throwable $e) {
            Log::critical($e->getMessage());
            return false;
        }
    }

    public function fiximg ($filename, $quality=1) {
        $img = Image::make('/work/storage/app/private/'.$filename)->encode('jpg', $quality);
        $img->orientate();
        if ($img->width() < $img->height() && $img->width() > 400) {
            $img->resize(400, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }
        else if ($img->height() < $img->width() && $img->height() > 400) {
            $img->resize(400, null, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });
        }
        $img->save('/work/storage/app/private/'.$filename);

        return $filename;
    }
}
