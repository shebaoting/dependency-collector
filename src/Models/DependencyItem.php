<?php

namespace Shebaoting\DependencyCollector\Models;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\User\User;
use Carbon\Carbon;

class DependencyItem extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = 'dependency_collector_items';

    protected $dates = ['submitted_at', 'approved_at'];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'approver_user_id' => 'integer',
    ];

    public static function build(string $title, string $link, string $description, int $userId)
    {
        $item = new static();
        $item->title = $title;
        $item->link = $link;
        $item->description = $description;
        $item->user_id = $userId;
        $item->status = 'pending'; // Default status
        $item->submitted_at = Carbon::now();

        return $item;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_user_id');
    }

    public function tags()
    {
        return $this->belongsToMany(DependencyTag::class, 'dependency_collector_item_tag', 'item_id', 'tag_id');
    }
}
