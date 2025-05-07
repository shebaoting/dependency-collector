<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController; // 基类通常用于获取单个资源，这里用于 PATCH
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyTagValidator;
use Illuminate\Support\Str; // 用于生成 slug

class UpdateDependencyTagController extends AbstractShowController
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
        $tagId = Arr::get($request->getQueryParams(), 'id');
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        // 权限检查
        $actor->assertCan('dependency-collector.manageTags');

        $tag = DependencyTag::findOrFail($tagId);

        // 如果 slug 未提供且 name 发生变化，则根据新的 name 自动重新生成 slug
        if (isset($attributes['name']) && $attributes['name'] !== $tag->name && empty($attributes['slug'])) {
            $attributes['slug'] = Str::slug($attributes['name']);
        }

        // 在验证之前，将模型ID传递给验证器，以便在 unique 规则中忽略当前模型
        // $this->validator->setRules(['id' => $tag->id]); // 这是一个示例，具体实现取决于验证器如何接收ID
        // 或者，你可以在 DependencyTagValidator 中修改 getRules 方法，从 attributes 中获取 id (如果前端传递了)
        // 或者，更标准的方式是，unique 规则通常会自动处理 ignore(this->model->id) 的情况，如果验证器与模型绑定。
        // Flarum 的 AbstractValidator 可能需要你显式处理 ignore。
        // 对于 unique:table,column,except,idColumn
        // 我们需要在 DependencyTagValidator 的 getRules 中处理 `ignore($tagIdToIgnore)`

        // 为了使 unique 验证忽略当前记录，我们需要在验证器中获取当前标签的 ID
        // 一种方法是在验证器构造函数中注入请求，或者像下面这样传递
        $validationAttributes = $attributes;
        if (!isset($validationAttributes['id'])) { // 确保ID在验证属性中，用于unique:ignore
            $validationAttributes['id'] = $tag->id;
        }
        $this->validator->assertValid($validationAttributes);


        if (isset($attributes['name'])) {
            $tag->name = $attributes['name'];
        }
        if (isset($attributes['slug'])) {
            $tag->slug = $attributes['slug'];
        }
        if (array_key_exists('description', $attributes)) { // array_key_exists 用于允许设置为空字符串或null
            $tag->description = $attributes['description'];
        }
        if (array_key_exists('color', $attributes)) {
            $tag->color = $attributes['color'];
        }
        if (array_key_exists('icon', $attributes)) {
            $tag->icon = $attributes['icon'];
        }

        // 如果有其他需要在保存前处理的逻辑，可以在这里添加
        // 例如，触发事件：$this->events->dispatch(new Events\TagWillBeUpdated($tag, $actor, $data));

        $tag->save();

        // 例如，触发事件：$this->events->dispatch(new Events\TagWasUpdated($tag, $actor, $data));

        return $tag;
    }
}
