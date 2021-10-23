<?php

namespace Database\Factories;

use App\Models\Child;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

class ChildFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Child::class;

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
            'identity' => $this->faker->text(20),
            'email' => $this->faker->email,
            'tel' => $tel[rand(0, 2)],
            'password' => Hash::make('password'),
            'last_name' => $this->faker->lastName,
            'first_name' => $this->faker->firstName,
            'image' => "/assets/img/avatar/avatar-sample02@2x.png",
            'company' => $this->faker->company,
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
