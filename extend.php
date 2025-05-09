<?php

/*
 * This file is part of shebaoting/dependency-collector.
 *
 *
 * Copyright (c) 2025 Shebaoting.
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Shebaoting\DependencyCollector;

use Flarum\Extend;
use Flarum\Api\Serializer\ForumSerializer; // 用于暴露权限给前端
use Flarum\Group\Group; // 用于设置默认权限
use Shebaoting\DependencyCollector\Api\Controller; // 你的 API 控制器命名空间
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Access\DependencyItemPolicy; // 你的 Policy 类

return [
    // 论坛前端设置
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')    // 注册论坛 JavaScript 文件
        ->css(__DIR__ . '/less/forum.less')   // 注册论坛 LESS/CSS 文件
        ->route('/dependencies', 'dependency-collector.forum.index'), // 注册依赖项展示页面的前端路由

    // 管理后台前端设置
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')    // 注册管理后台 JavaScript 文件
        ->css(__DIR__ . '/less/admin.less'),  // 注册管理后台 LESS/CSS 文件

    // API 路由设置
    (new Extend\Routes('api'))
        // Dependency Items
        ->get('/dependency-items', 'dependency-collector.items.index', Controller\ListDependencyItemsController::class)
        ->post('/dependency-items', 'dependency-collector.items.create', Controller\CreateDependencyItemController::class)
        ->patch('/dependency-items/{id}', 'dependency-collector.items.update', Controller\UpdateDependencyItemController::class)
        ->delete('/dependency-items/{id}', 'dependency-collector.items.delete', Controller\DeleteDependencyItemController::class)

        // Dependency Tags
        ->get('/dependency-tags', 'dependency-collector.tags.index', Controller\ListDependencyTagsController::class)
        ->post('/dependency-tags', 'dependency-collector.tags.create', Controller\CreateDependencyTagController::class)
        ->patch('/dependency-tags/{id}', 'dependency-collector.tags.update', Controller\UpdateDependencyTagController::class)
        ->delete('/dependency-tags/{id}', 'dependency-collector.tags.delete', Controller\DeleteDependencyTagController::class)

        // Toggle Favorite
        ->post('/dependency-items/{id}/favorite', 'dependency-collector.items.favorite', Controller\ToggleFavoriteController::class),

    // 国际化语言文件设置
    (new Extend\Locales(__DIR__ . '/locale')),

    // 权限策略设置
    (new Extend\Policy())
        ->modelPolicy(DependencyItem::class, DependencyItemPolicy::class), // 为 DependencyItem 模型注册权限策略

    // 视图设置 (如果你的权限有自定义的描述文本，可能会用到)
    // (new Extend\View())
    //    ->namespace('dependency-collector.admin.permissions', __DIR__ . '/views/admin/permissions'),

    // 将 canSubmit 和 canDelete 权限暴露给论坛前端
    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('canSubmitDependencyCollectorItem', function ($serializer, $model, $attributes) {
            return $serializer->getActor()->hasPermission('dependency-collector.submit');
        })
        // --- 新增 canDelete 权限暴露 ---
        // 注意：这个 canDelete 是全局的，表示用户 *通常* 能不能删除，具体到某一项能不能删由下面的 Serializer 控制
        // 如果没有全局删除权限的需求，可以不暴露这个全局权限
        ->attribute('canDeleteDependencyCollectorItem', function ($serializer, $model, $attributes) {
            return $serializer->getActor()->hasPermission('dependency-collector.delete');
        })

        ->attribute('canFavoriteDependencyCollectorItemGlobal', function ($serializer, $model, $attributes) { // 注意这里我用了 Global 后缀
            return $serializer->getActor()->hasPermission('dependency-collector.favoriteItems');
        })
];
