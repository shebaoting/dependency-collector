<?php

namespace Shebaoting\DependencyCollector\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use Shebaoting\DependencyCollector\Models\DependencyItem;

class DependencyItemPolicy extends AbstractPolicy
{
    public function edit(User $actor, DependencyItem $item)
    {
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }

        // Optional: Allow user to edit their own PENDING submission
        // if ($item->status === 'pending' && $actor->id === $item->user_id && $actor->hasPermission('dependency-collector.editOwnPending')) {
        //     return $this->allow();
        // }

        return $this->deny();
    }

    // Add other abilities like 'approve', 'reject', 'delete' if you want granular control
    // Otherwise, 'dependency-collector.moderate' can cover these in the controllers.
}
