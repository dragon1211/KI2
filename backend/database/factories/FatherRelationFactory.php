<?php

namespace Database\Factories;

use App\Models\FatherRelation;
use Illuminate\Database\Eloquent\Factories\Factory;

class FatherRelationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = FatherRelation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'father_id' => 1,
            'child_id' => 1,
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
