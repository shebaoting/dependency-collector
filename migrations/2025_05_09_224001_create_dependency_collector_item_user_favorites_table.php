<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_item_user_favorites')) {
            $schema->create('dependency_collector_item_user_favorites', function (Blueprint $table) {
                $table->unsignedInteger('item_id');
                $table->unsignedInteger('user_id');
                $table->timestamp('favorited_at')->useCurrent(); // 记录收藏时间

                $table->primary(['item_id', 'user_id']);

                $table->foreign('item_id')
                    ->references('id')
                    ->on('dependency_collector_items')
                    ->onDelete('cascade');

                $table->foreign('user_id')
                    ->references('id')
                    ->on('users')
                    ->onDelete('cascade');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_item_user_favorites');
    },
];
