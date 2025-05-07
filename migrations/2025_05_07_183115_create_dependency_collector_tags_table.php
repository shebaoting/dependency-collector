<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_tags')) {
            $schema->create('dependency_collector_tags', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name')->unique();
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('color', 7)->nullable(); // e.g., #RRGGBB
                $table->string('icon')->nullable();    // e.g., fas fa-code
                $table->timestamps();
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_tags');
    },
];
