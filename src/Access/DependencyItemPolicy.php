<?php
// src/Access/DependencyItemPolicy.php

namespace Shebaoting\DependencyCollector\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use Shebaoting\DependencyCollector\Models\DependencyItem;

class DependencyItemPolicy extends AbstractPolicy
{
    // edit 和 approve 方法保持不变...
    // edit 方法应该也检查 moderate 权限
    public function edit(User $actor, DependencyItem $item)
    {
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }
        if ($item->status === 'pending' && $actor->id === $item->user_id && $actor->hasPermission('dependency-collector.submit')) {
            return $this->allow();
        }
        return $this->deny();
    }

    // approve 方法应该也检查 moderate 权限
    public function approve(User $actor, DependencyItem $item)
    {
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }
        return $this->deny();
    }


    /**
     * 决定谁可以删除一个依赖项。
     * 管理员/版主（有 moderate 权限）可以。
     * 提交者可以删除自己提交的、处于 'pending' 状态的条目。
     */
    public function delete(User $actor, DependencyItem $item)
    {
        // --- 修改：只检查 moderate 权限 ---
        // 拥有 moderate 权限的用户可以删除
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }
        // --- 修改结束 ---

        // 提交者可以删除自己未审核的提交 (确保用户有提交权限作为基础)
        if ($item->status === 'pending' && $actor->id === $item->user_id && $actor->hasPermission('dependency-collector.submit')) {
            return $this->allow();
        }

        return $this->deny();
    }
}
