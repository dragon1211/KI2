<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FathersRegistrationTemporaryMail extends Mailable {
    use Queueable, SerializesModels;
    private $token;

    public function __construct ($token) {
        $this->token = $token;
    }

    public function build () {
        return $this->subject('仮登録が完了しました。')->markdown('emails.fathers.registration.temporary', [
            'token' => $this->token
        ]);
    }
}
