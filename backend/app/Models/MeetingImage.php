<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MeetingImage extends Model
{
    use HasFactory;
    protected $fillable = ['meeting_id', 'image'];
}
