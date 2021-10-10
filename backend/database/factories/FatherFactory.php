<?php

namespace Database\Factories;

use App\Models\Father;
use Illuminate\Database\Eloquent\Factories\Factory;

class FatherFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Father::class;

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

        return [
            'email' => $this->faker->email,
            'email_verified_at' => $this->faker->dateTime,
            'password' => $this->faker->password,
            'company' => $this->faker->company,
            'image' => $this->faker->imageUrl,
            'profile' => $this->faker->realText(49),
            'tel' => $tel[rand(0, 2)],
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
