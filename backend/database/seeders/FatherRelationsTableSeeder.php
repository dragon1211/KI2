<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\FatherRelation;

class FatherRelationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        \App\Models\FatherRelation::factory()->count(10)->create();
    }
}
