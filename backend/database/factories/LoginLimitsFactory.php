<?php

namespace Database\Factories;

use App\Models\LoginLimits;
use Illuminate\Database\Eloquent\Factories\Factory;

class LoginLimitsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = LoginLimits::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition () {
        return [
            'login_id' => $this->faker->email,
            'fail_number' => rand(0, 10),
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
