<?php

namespace Database\Factories;

use App\Models\Father;
use Illuminate\Support\Facades\Hash;
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
            'password' => Hash::make('password'),
            'company' => $this->faker->company,
            'image' => '/assets/default/avatar.jpg',
            'profile' => $this->faker->realText(49),
            'tel' => $tel[rand(0, 2)],
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
