<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MeetingEditAwareness extends Mailable {
    use Queueable, SerializesModels;
    private $child;
    private $meeting_id;

    public function __construct ($last_name, $first_name, $meeting_id) {
        $this->child = $last_name.' '.$first_name;
        $this->meeting_id = $meeting_id;
    }

    public function build () {
        return $this->subject('KIKI運営事務局からのお知らせ')->markdown('emails.fathers.meetingawareness', [
            'child' => $this->child,
            'url' => url('/p-account/meeting/detail/'.$this->meeting_id),
        ]);
    }
}
