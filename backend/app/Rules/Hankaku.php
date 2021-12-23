<?php

namespace App\Rules;

use Illuminate\Contracts\Validation\Rule;

class Hankaku implements Rule {
    public function __construct () {
        //
    }

    public function passes ($attribute, $value) {
        return preg_match('/^[a-zA-Z0-9]+$/', $value);
    }

    public function message () {
        return trans('validation.alpha_num');
    }
}
