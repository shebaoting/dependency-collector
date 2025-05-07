<?php

/*
 * This file is part of shebaoting/dependency-collector.
 *
 * Copyright (c) 2025 Shebaoting.
 *
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
        ->delete('/dependency-tags/{id}', 'dependency-collector.tags.delete', Controller\DeleteDependencyTagController::class),

    // 国际化语言文件设置
    (new Extend\Locales(__DIR__ . '/locale')),

    // 权限策略设置
    (new Extend\Policy())
        ->modelPolicy(DependencyItem::class, DependencyItemPolicy::class), // 为 DependencyItem 模型注册权限策略

    // 视图设置 (如果你的权限有自定义的描述文本，可能会用到)
    // (new Extend\View())
    //    ->namespace('dependency-collector.admin.permissions', __DIR__ . '/views/admin/permissions'),

    // 默认权限授予
    // (new Extend\Permissions())
    //     ->grant('dependency-collector.submit', Group::MEMBER_ID) // 默认允许“成员”用户组提交依赖项
    //     ->grant('dependency-collector.moderate', Group::MODERATOR_ID) // 默认允许“版主”审核
    //     ->grant('dependency-collector.moderate', Group::ADMINISTRATOR_ID) // 默认允许“管理员”审核
    //     ->grant('dependency-collector.manageTags', Group::ADMINISTRATOR_ID), // 默认只允许“管理员”管理插件标签

    // 将 canSubmitDependencyCollectorItem 权限暴露给论坛前端
    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('canSubmitDependencyCollectorItem', function ($serializer, $model, $attributes) {
            return $serializer->getActor()->hasPermission('dependency-collector.submit');
        }),
];
