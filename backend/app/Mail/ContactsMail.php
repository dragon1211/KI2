<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ContactsMail extends Mailable {
    use Queueable, SerializesModels;
    private $message;

    public function __construct ($message) {
        $this->message = $message;
    }

    public function build () {
        return $this->subject('お問い合わせありがとうございます。')->text('emails.contacts', [
            'messages' => $this->message
        ]);
    }
}
