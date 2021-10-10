<?php

namespace Database\Factories;

use App\Models\Smss;
use Illuminate\Database\Eloquent\Factories\Factory;

class SmssFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Smss::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'send_id' => 1,
            'receive_id' => 1,
            'is_sent' => rand(0, 2),
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
