<?php

namespace Shebaoting\DependencyCollector\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Tobscure\JsonApi\Relationship;
use Tobscure\JsonApi\Resource as JsonApiResource;


class DependencyItemSerializer extends AbstractSerializer
{
    protected $type = 'dependency-items';

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
        ];

        // 注意：之前的 moderate 检查被合并到了 canApprove/canEdit 中，
        // status 属性现在总是包含的，前端可以根据 status 和 canEdit/canApprove 来决定显示什么。

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
}
