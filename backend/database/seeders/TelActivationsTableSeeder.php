<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TelActivation;

class TelActivationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\TelActivation::factory()->count(10)->create();
    }
}
