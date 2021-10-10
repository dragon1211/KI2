<?php

namespace Database\Seeders;
use App\Models\Father;

use Illuminate\Database\Seeder;

class FathersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Father::factory()->count(10)->create();
    }
}
