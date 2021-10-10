<?php

namespace Database\Factories;

use App\Models\MeetingApprovals;
use Illuminate\Database\Eloquent\Factories\Factory;

class MeetingApprovalsFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = MeetingApprovals::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'child_id' => 1,
            'meeting_id' => 1,
            'approval_at' => $this->faker->dateTime,
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
