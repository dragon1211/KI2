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
    public function definition()
    {
        $ua = [
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) QtWebEngine/5.15.2 Chrome/87.0.4280.144 Safari/537.36', // qutebrowser
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.82 Safari/537.36', // brave
            'Mozilla/5.0 (Windows NT 10.0; rv:91.0) Gecko/20100101 Firefox/91.0', // firefox
            'Mozilla/5.0 (X11; Linux x86_64; rv:68.0) Gecko/20100101 Goanna/4.8 Firefox/68.0 PaleMoon/29.4.1' // palemoon
        ];

        return [
            'user_agent' => $ua[rand(0, 3)],
            'fail_number' => rand(0, 10),
            'created_at' => $this->faker->dateTime,
            'updated_at' => $this->faker->dateTime,
        ];
    }
}
