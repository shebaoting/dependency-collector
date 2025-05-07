<?php

namespace Shebaoting\DependencyCollector\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Shebaoting\DependencyCollector\Models\DependencyTag;

class DependencyTagSerializer extends AbstractSerializer
{
    protected $type = 'dependency-tags';

    /**
     * @param DependencyTag $tag
     */
    protected function getDefaultAttributes($tag)
    {
        return [
            'name'          => $tag->name,
            'slug'          => $tag->slug,
            'description'   => $tag->description,
            'color'         => $tag->color,
            'icon'          => $tag->icon,
            'createdAt'     => $this->formatDate($tag->created_at),
            'updatedAt'     => $this->formatDate($tag->updated_at),
            'itemCount'     => (int) $tag->items()->count(), // Optional: count of items with this tag
            'canEdit'       => $this->actor->can('dependency-collector.manageTags'),
        ];
    }
}
