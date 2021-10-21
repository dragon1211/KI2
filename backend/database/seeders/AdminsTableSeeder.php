<?php

namespace Database\Seeders;
use App\Models\Admin;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

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
        \App\Models\Admin::create(['email' => 'chankan77@gmail.com', 'password' => Hash::make('password')]);
    }
}
