<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyItemValidator; // We'll create this

class CreateDependencyItemController extends AbstractCreateController
{
    public $serializer = DependencyItemSerializer::class;

    public $include = ['user', 'tags'];

    protected $validator;

    public function __construct(DependencyItemValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $data = Arr::get($request->getParsedBody(), 'data', []);

        $actor->assertCan('dependency-collector.submit');

        $attributes = Arr::get($data, 'attributes', []);
        $relationships = Arr::get($data, 'relationships', []);
        $tagIds = [];
        if (isset($relationships['tags']['data'])) {
            foreach ($relationships['tags']['data'] as $tagData) {
                if (isset($tagData['id'])) {
                    $tagIds[] = $tagData['id'];
                }
            }
        }
        if (empty($tagIds)) {
            // Or handle in validator: throw new ValidationException(['tags' => 'At least one tag is required.']);
        }


        $this->validator->assertValid(array_merge($attributes, ['tag_ids' => $tagIds]));


        $item = DependencyItem::build(
            Arr::get($attributes, 'title'),
            Arr::get($attributes, 'link'),
            Arr::get($attributes, 'description'),
            $actor->id
        );

        // Event for pre-save modifications if needed by other extensions
        // $this->events->dispatch(new Saving($item, $actor, $data));

        $item->save();

        if (!empty($tagIds)) {
            $item->tags()->sync($tagIds);
        }

        // Event for post-save actions
        // $this->events->dispatch(new Created($item, $actor, $data));

        return $item;
    }
}
