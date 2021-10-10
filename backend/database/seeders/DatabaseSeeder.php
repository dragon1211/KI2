<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        $this->call
        (AdminsTableSeeder::class);
        $this->call
        (FathersTableSeeder::class);
        $this->call
        (EmailActivationsTableSeeder::class);
        $this->call
        (ChildrenTableSeeder::class);
        $this->call
        (TelActivationsTableSeeder::class);
        $this->call
        (FatherRelationsTableSeeder::class);
        $this->call
        (MeetingsTableSeeder::class);
        $this->call
        (MeetingImagesTableSeeder::class);
        $this->call
        (MeetingApprovalsSeeder::class);
        $this->call
        (LoginLimitsSeeder::class);
        $this->call
        (ContactsSeeder::class);
        $this->call
        (SmssSeeder::class);
    }
}
