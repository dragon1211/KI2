<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class FathersApprovalAgainMail extends Mailable {
    use Queueable, SerializesModels;
    private $father;
    private $meeting_id;

    public function __construct ($father, $meeting_id) {
        $this->father = $father;
        $this->meeting_id = $meeting_id;
    }

    public function build () {
        return $this->subject('KIKI運営事務局からのお知らせ')->markdown('emails.fathers.approvalagain', [
            'father' => $this->father,
            'url' => url('/c-account/meeting/detail/'.$this->meeting_id),
        ]);
    }
}
