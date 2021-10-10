<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateSmssesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('smsses', function (Blueprint $table) {
            $table->id();
            $table->unsignedTinyInteger('send_id');
            $table->unsignedBigInteger('receive_id');
            $table->foreign('receive_id')->references('id')->on('children');
            $table->unsignedTinyInteger('is_sent')->default(0);
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
        Schema::dropIfExists('smsses');
    }
}
