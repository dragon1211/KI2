<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Father extends Authenticatable
{
    use HasFactory;
    protected $fillable = ['email', 'password', 'company', 'image', 'profile', 'tel', 'relation_limit'];
    protected $hidden = ['password'];
}
