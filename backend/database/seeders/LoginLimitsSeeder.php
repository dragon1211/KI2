<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class LoginLimitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\LoginLimits::factory()->count(10)->create();
    }
}
