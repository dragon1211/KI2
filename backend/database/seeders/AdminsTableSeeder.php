<?php

namespace Database\Seeders;
use App\Models\Admin;

use Illuminate\Database\Seeder;

class AdminsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\Admin::factory()->count(10)->create();
    }
}
