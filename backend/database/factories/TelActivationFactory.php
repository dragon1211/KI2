<?php

namespace Database\Factories;

use App\Models\TelActivation;
use Illuminate\Database\Eloquent\Factories\Factory;

class TelActivationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = TelActivation::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        $tel = [
            '070'.rand(10000000, 99999999),
            '080'.rand(10000000, 99999999),
            '090'.rand(10000000, 99999999)
        ];
        $father_id = rand(0, 10);
        if ($father_id == 0) $father_id = null;

        return [
            'type' => rand(0, 1),
            'child_id' => rand(1, 10),
            'father_id' => $father_id,
            'tel' => $tel[rand(0, 2)],
            'token' => $this->faker->creditCardNumber,
            'ttl' => $this->faker->dateTime,
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
