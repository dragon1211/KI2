<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingApprovals extends Model
{
    use HasFactory;
    protected $fillable = ['child_id', 'meeting_id', 'approval_at'];
}
