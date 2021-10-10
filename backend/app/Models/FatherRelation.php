<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FatherRelation extends Model
{
    use HasFactory;
    protected $fillable = ['father_id', 'child_id', 'hire_at'];
}
