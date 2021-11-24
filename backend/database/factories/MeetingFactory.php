<?php

namespace Database\Factories;

use App\Models\Meeting;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Meeting::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'father_id' => rand(1, 10),
            'title' => $this->faker->name,
            'text' => $this->faker->realText(49),
            'pdf' => '/assets/default/default.pdf',
            'memo' => $this->faker->realText(49),
            'is_favorite' => $this->faker->numberBetween($min=0, $max=1),
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
