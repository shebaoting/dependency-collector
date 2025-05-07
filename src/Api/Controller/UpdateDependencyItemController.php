<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController; // Use Show as base for PATCH
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyItemValidator;
use Carbon\Carbon;

class UpdateDependencyItemController extends AbstractShowController
{
    public $serializer = DependencyItemSerializer::class;

    public $include = ['user', 'tags', 'approver'];

    protected $validator;

    public function __construct(DependencyItemValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $itemId = Arr::get($request->getQueryParams(), 'id');
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        $item = DependencyItem::findOrFail($itemId);

        // Check permissions
        if ($actor->id === $item->user_id && $item->status === 'pending' && $actor->can('editOwnPending', $item)) {
            // Allow user to edit their own pending submission (limited fields)
            // This is an optional feature, if implemented, create 'editOwnPending' permission
        } elseif ($actor->can('dependency-collector.moderate')) {
            // Admin/Moderator can edit more
        } else {
            $actor->assertPermission(false); // Deny access
        }

        $this->validator->assertValid(array_merge($attributes, ['is_update' => true]));

        if (isset($attributes['title'])) {
            $item->title = $attributes['title'];
        }
        if (isset($attributes['link'])) {
            $item->link = $attributes['link'];
        }
        if (isset($attributes['description'])) {
            $item->description = $attributes['description'];
        }

        // Admin/Moderator specific updates
        if ($actor->can('dependency-collector.moderate')) {
            if (isset($attributes['status']) && in_array($attributes['status'], ['approved', 'rejected', 'pending'])) {
                if ($item->status !== 'approved' && $attributes['status'] === 'approved') {
                    $item->approved_at = Carbon::now();
                    $item->approver_user_id = $actor->id;
                } elseif ($attributes['status'] !== 'approved') {
                    $item->approved_at = null;
                    $item->approver_user_id = null;
                }
                $item->status = $attributes['status'];
            }
        }

        // Handle tags update
        $relationships = Arr::get($data, 'relationships', []);
        if (isset($relationships['tags']['data'])) {
            $tagIds = [];
            foreach ($relationships['tags']['data'] as $tagData) {
                if (isset($tagData['id'])) {
                    $tagIds[] = $tagData['id'];
                }
            }
            // Ensure at least one tag if admin is editing
            if ($actor->can('dependency-collector.moderate') && empty($tagIds)) {
                // throw new ValidationException(['tags' => 'At least one tag is required for approved items.']);
            }
            $item->tags()->sync($tagIds);
        }


        $item->save();

        return $item;
    }
}
