<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyTagValidator;
use Illuminate\Support\Str;

class CreateDependencyTagController extends AbstractCreateController
{
    public $serializer = DependencyTagSerializer::class;
    protected $validator;

    public function __construct(DependencyTagValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        $actor->assertCan('dependency-collector.manageTags');

        if (empty($attributes['slug']) && !empty($attributes['name'])) {
            $attributes['slug'] = Str::slug($attributes['name']);
        }

        // --- 设置默认图标 ---
        $icon = Arr::get($attributes, 'icon');
        if (empty($icon)) {
            $attributes['icon'] = 'fas fa-code'; // 如果为空，设置默认值
        }
        // --- 默认图标设置结束 ---

        $this->validator->assertValid($attributes);

        $tag = DependencyTag::build(
            Arr::get($attributes, 'name'),
            Arr::get($attributes, 'slug'),
            Arr::get($attributes, 'description'),
            Arr::get($attributes, 'color'),
            Arr::get($attributes, 'icon') // 使用可能已设置了默认值的 icon
        );

        $tag->save();

        return $tag;
    }
}
