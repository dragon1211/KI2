<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MeetingEditNotification extends Mailable {
    use Queueable, SerializesModels;
    private $father;
    private $meeting_id;

    public function __construct ($father, $meeting_id) {
        $this->father = $father;
        $this->meeting_id = $meeting_id;
    }

    public function build () {
        return $this->subject('【KIKI】KIKI運営事務局からのお知らせ')->text('emails.fathers.meetingedit', [
            'father' => $this->father,
            'url' => '/c-account/meeting/detail/'.$this->meeting_id,
        ]);
    }
}
