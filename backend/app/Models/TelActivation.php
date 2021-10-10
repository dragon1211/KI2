<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TelActivation extends Model
{
    use HasFactory;
    protected $fillable = ['tel', 'token'];
}
