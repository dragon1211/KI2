<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class SmssSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Smss::factory()->count(10)->create();
    }
}
