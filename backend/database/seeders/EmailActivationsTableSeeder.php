<?php

namespace Database\Seeders;
use App\Models\EmailActivations;

use Illuminate\Database\Seeder;

class EmailActivationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\EmailActivation::factory()->count(10)->create();
    }
}
