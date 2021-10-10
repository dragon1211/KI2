<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class MeetingApprovalsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\MeetingApprovals::factory()->count(10)->create();
    }
}
