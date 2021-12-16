<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EmailActivation extends Model
{
    use HasFactory;
    protected $fillable = ['type', 'father_id', 'email', 'token', 'ttl', 'relation_limit'];
    protected $attributes = ['type' => 0];
}
