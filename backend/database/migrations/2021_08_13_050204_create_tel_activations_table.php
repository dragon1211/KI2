<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTelActivationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tel_activations', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('type');
            $table->unsignedBigInteger('child_id')->nullable();
            $table->foreign('child_id')->references('id')->on('children')->onDelete('cascade');
            $table->string('tel', 11)->unique();
            $table->string('token', 100);
            $table->dateTime('ttl');
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
        Schema::dropIfExists('tel_activations');
    }
}
