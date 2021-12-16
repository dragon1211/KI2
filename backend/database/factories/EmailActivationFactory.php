<?php

namespace Database\Factories;

use App\Models\EmailActivation;
use Illuminate\Database\Eloquent\Factories\Factory;

class EmailActivationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = EmailActivation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {   
        return [
            'type' => $this->faker->numberBetween($min=0, $max=1),
            'father_id' => rand(1, 10),
            'email' => $this->faker->email,
            'token' => $this->faker->creditCardNumber,
            'ttl' => $this->faker->dateTime,
            'relation_limit' => rand(1,10),
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
