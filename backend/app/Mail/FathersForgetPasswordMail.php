<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FathersForgetPasswordMail extends Mailable {
    use Queueable, SerializesModels;
    private $token;

    public function __construct ($token) {
        $this->token = $token;
    }

    public function build () {
        return $this->subject('パスワードリセットを依頼しました。')->markdown('emails.fathers.forgotpassword', [
            'url' => url('/p-account/forgot-password/reset/'.$this->token),
        ]);
    }
}
