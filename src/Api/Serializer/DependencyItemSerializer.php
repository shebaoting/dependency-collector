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
            'status'       => $item->status,
            'submittedAt'  => $this->formatDate($item->submitted_at),
            'approvedAt'   => $this->formatDate($item->approved_at),
            'canEdit'      => $this->actor->can('edit', $item),
            'canApprove'   => $this->actor->can('dependency-collector.moderate'),
            // Add more attributes as needed
        ];

        if ($this->actor->can('dependency-collector.moderate') || ($this->actor->id === $item->user_id && $item->status === 'pending')) {
            // Expose more details if user can moderate or is the owner of a pending item
        }


        return $attributes;
    }

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
