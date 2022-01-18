<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChildrenTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('children', function (Blueprint $table) {
            $table->id();
            $table->string('identity', 20);
            $table->string('email', 72)->unique();
            $table->string('tel', 11)->unique();
            $table->string('password', 255);
            $table->string('remember_token', 255)->nullable();
            $table->string('last_name', 100);
            $table->string('first_name', 100);
            $table->string('image', 100)->nullable();
            $table->string('company', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('children');
    }
}
