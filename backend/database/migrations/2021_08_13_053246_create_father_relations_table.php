<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateFatherRelationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('father_relations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('father_id');
            $table->foreign('father_id')->references('id')->on('fathers');
            $table->unsignedBigInteger('child_id');
            $table->foreign('child_id')->references('id')->on('children');
            $table->dateTime('hire_at')->useCurrent();
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
        Schema::dropIfExists('father_relations');
    }
}
