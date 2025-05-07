<?php

namespace Shebaoting\DependencyCollector\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use Shebaoting\DependencyCollector\Models\DependencyItem;

class DependencyItemPolicy extends AbstractPolicy
{
    /**
     * 决定谁可以编辑一个依赖项。
     * 管理员总是可以编辑。
     * 提交者只能编辑处于 'pending' 状态的依赖项。
     */
    public function edit(User $actor, DependencyItem $item)
    {
        // 管理员或版主（拥有 moderate 权限）可以编辑任何状态的条目
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }

        // 提交者只能编辑自己提交的，并且状态为 'pending' 的条目
        if ($item->status === 'pending' && $actor->id === $item->user_id && $actor->hasPermission('dependency-collector.submit')) {
            // 确保用户至少有提交权限才能编辑自己的
            return $this->allow();
        }

        return $this->deny();
    }

    /**
     * 决定谁可以批准/取消批准一个依赖项。
     * 只有拥有 moderate 权限的用户可以。
     */
    public function approve(User $actor, DependencyItem $item)
    {
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }
        return $this->deny();
    }

    public function delete(User $actor, DependencyItem $item)
    {
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }
        // 可选：允许用户删除自己未审核的提交
        if ($item->status === 'pending' && $actor->id === $item->user_id && $actor->hasPermission('dependency-collector.submit')) {
            return $this->allow();
        }
        return $this->deny();
    }
}
