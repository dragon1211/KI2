<?php

namespace Database\Seeders;
use App\Models\Meeting;

use Illuminate\Database\Seeder;

class MeetingsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Meeting::factory()->count(10)->create();
    }
}
