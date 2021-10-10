<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MeetingImage;

class MeetingImagesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\MeetingImage::factory()->count(10)->create();
    }
}
