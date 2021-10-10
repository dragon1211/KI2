<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LoginLimits extends Model
{
    use HasFactory;
    protected $fillable = ['user_agent', 'fail_number'];
}
