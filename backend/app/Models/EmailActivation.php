<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailActivation extends Model
{
    use HasFactory;
    protected $fillable = ['email', 'token', 'ttl'];
    protected $attributes = ['type' => 0];
}
