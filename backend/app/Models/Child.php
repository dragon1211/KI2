<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Child extends Authenticatable
{
    use HasFactory;
    protected $fillable = ['father_id', 'title', 'text', 'memo', 'pdf'];
    protected $hidden = ['password'];
}
