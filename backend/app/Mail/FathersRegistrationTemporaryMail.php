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
        return $this->subject('【KIKI】会員登録のご案内')->text('emails.fathers.registration.temporary', [
            'url' => '/p-account/register/'.$this->token,
        ]);
    }
}
