<?php

namespace Database\Factories;

use App\Models\MeetingImage;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingImageFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MeetingImage::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'meeting_id' => 1,
            'image' => "/assets/img/avatar/avatar-sample02@2x.png",
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
