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
use Illuminate\Support\Str; // 用于生成 slug

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

        // 权限检查
        $actor->assertCan('dependency-collector.manageTags');

        // 如果 slug 未提供，则根据 name 自动生成
        if (empty($attributes['slug']) && !empty($attributes['name'])) {
            $attributes['slug'] = Str::slug($attributes['name']);
        }

        // 验证数据
        $this->validator->assertValid($attributes);

        $tag = DependencyTag::build(
            Arr::get($attributes, 'name'),
            Arr::get($attributes, 'slug'),
            Arr::get($attributes, 'description'),
            Arr::get($attributes, 'color'),
            Arr::get($attributes, 'icon')
        );

        // 如果有其他需要在保存前处理的逻辑，可以在这里添加
        // 例如，触发事件：$this->events->dispatch(new Events\TagWillBeCreated($tag, $actor, $data));

        $tag->save();

        // 例如，触发事件：$this->events->dispatch(new Events\TagWasCreated($tag, $actor, $data));

        return $tag;
    }
}
