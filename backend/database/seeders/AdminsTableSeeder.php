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
        // \App\Models\Admin::create(
        //     ['email' => config('mail.owner.address'), 'password' => Hash::make('password')]
        // );
        \App\Models\Admin::create([
            'email' => '56@zotman.jp',
            'password' => Hash::make('password')
        ]);
        \App\Models\Admin::create([
            'email' => 'chankan77@gmail.com',
            'password' => Hash::make('password')
        ]);
    }
}
