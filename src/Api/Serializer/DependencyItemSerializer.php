<?php

namespace Shebaoting\DependencyCollector\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Tobscure\JsonApi\Relationship;


class DependencyItemSerializer extends AbstractSerializer
{
    protected $type = 'dependency-items';
    protected $allowedIncludes = [
        'user',
        'approver',
        'tags',
        'favoritedByUsers'
    ];
    /**
     * @param DependencyItem $item
     */
    protected function getDefaultAttributes($item)
    {
        $attributes = [
            'title'        => $item->title,
            'link'         => $item->link,
            'description'  => $item->description,
            'status'       => $item->status, // 确保 status 始终被序列化
            'submittedAt'  => $this->formatDate($item->submitted_at),
            'approvedAt'   => $this->formatDate($item->approved_at),
            'canEdit'      => $this->actor->can('edit', $item), // 使用 Policy 检查
            'canApprove'   => $this->actor->can('approve', $item), // 使用 Policy 检查
            'canDelete'    => $this->actor->can('delete', $item), // 使用 Policy 检查删除权限
            'isFavorited'  => $this->actor->isGuest() ? false : ($item->relationLoaded('favoritedByUsers') ? $item->favoritedByUsers->contains($this->actor->id) : $item->favoritedByUsers()->where('users.id', $this->actor->id)->exists()), // 修改: 优化isFavorited的获取
            'canFavorite'  => $this->actor->can('favoriteItem', $item),
        ];

        // 注意：之前的 moderate 检查被合并到了 canApprove/canEdit 中，
        // status 属性现在总是包含的，前端可以根据 status 和 canEdit/canApprove 来决定显示什么。
        if (isset($item->is_favorited)) {
            $attributes['isFavorited'] = (bool) $item->is_favorited;
        }
        return $attributes;
    }

    // user(), approver(), tags() 方法保持不变
    protected function user($item): ?Relationship
    {
        return $this->hasOne($item, BasicUserSerializer::class);
    }

    protected function approver($item): ?Relationship
    {
        return $this->hasOne($item, BasicUserSerializer::class);
    }

    protected function tags($item): Relationship
    {
        return $this->hasMany($item, DependencyTagSerializer::class);
    }

    protected function favoritedByUsers($item): ?Relationship
    {
        return $this->hasMany($item, BasicUserSerializer::class);
    }
}
