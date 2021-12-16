<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FathersRegistrationMainMail extends Mailable {
    use Queueable, SerializesModels;

    public function build () {
        return $this->subject('本登録が完了しました。')->markdown('emails.fathers.registration.main', [
            'url' => url('/p-account/login'),
        ]);
    }
}
