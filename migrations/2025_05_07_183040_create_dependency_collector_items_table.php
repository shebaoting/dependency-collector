<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_items')) {
            $schema->create('dependency_collector_items', function (Blueprint $table) {
                $table->increments('id');
                $table->string('title');
                $table->string('link');
                $table->text('description');
                $table->unsignedInteger('user_id');
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->timestamp('submitted_at')->useCurrent();
                $table->timestamp('approved_at')->nullable();
                $table->unsignedInteger('approver_user_id')->nullable();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('approver_user_id')->references('id')->on('users')->onDelete('set null');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_items');
    },
];
