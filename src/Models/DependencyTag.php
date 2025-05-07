<?php

namespace Shebaoting\DependencyCollector\Models;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait; // Might not be needed if tags are always public

class DependencyTag extends AbstractModel
{
    // use ScopeVisibilityTrait; // Consider if tags need visibility scoping

    protected $table = 'dependency_collector_tags';

    protected $dates = ['created_at', 'updated_at'];

    protected $fillable = ['name', 'slug', 'description', 'color', 'icon']; // For mass assignment

    public static function build(string $name, string $slug, ?string $description = null, ?string $color = null, ?string $icon = null)
    {
        $tag = new static();
        $tag->name = $name;
        $tag->slug = $slug;
        $tag->description = $description;
        $tag->color = $color;
        $tag->icon = $icon;

        return $tag;
    }

    public function items()
    {
        return $this->belongsToMany(DependencyItem::class, 'dependency_collector_item_tag', 'tag_id', 'item_id');
    }
}
