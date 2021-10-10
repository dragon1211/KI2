<?php

namespace Database\Seeders;
use App\Models\Child;

use Illuminate\Database\Seeder;

class ChildrenTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Child::factory()->count(10)->create();
    }
}
