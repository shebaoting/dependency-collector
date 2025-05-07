<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_item_tag')) {
            $schema->create('dependency_collector_item_tag', function (Blueprint $table) {
                $table->unsignedInteger('item_id');
                $table->unsignedInteger('tag_id');
                $table->primary(['item_id', 'tag_id']);

                $table->foreign('item_id')->references('id')->on('dependency_collector_items')->onDelete('cascade');
                $table->foreign('tag_id')->references('id')->on('dependency_collector_tags')->onDelete('cascade');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_item_tag');
    },
];
