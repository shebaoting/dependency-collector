<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyTagValidator;
// use Illuminate\Support\Str; // 不再需要

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

        $actor->assertCan('dependency-collector.manageTags');

        $tag = DependencyTag::findOrFail($tagId);

        // 移除自动生成 slug 的逻辑

        $validationAttributes = $attributes;
        if (!isset($validationAttributes['id'])) {
            $validationAttributes['id'] = $tag->id;
        }
        $this->validator->assertValid($validationAttributes);

        $isDirty = false;
        if (isset($attributes['name']) && $attributes['name'] !== $tag->name) {
            $tag->name = $attributes['name'];
            $isDirty = true;
        }
        if (isset($attributes['slug']) && $attributes['slug'] !== $tag->slug) {
            $tag->slug = $attributes['slug'];
            $isDirty = true;
        }
        if (array_key_exists('description', $attributes) && $attributes['description'] !== $tag->description) {
            $tag->description = $attributes['description'];
            $isDirty = true;
        }
        if (array_key_exists('color', $attributes) && $attributes['color'] !== $tag->color) {
            $tag->color = $attributes['color'];
            $isDirty = true;
        }
        // --- 修改图标更新逻辑以包含默认值 ---
        if (array_key_exists('icon', $attributes)) { // 检查请求中是否包含 'icon'
            $newIcon = $attributes['icon'];
            // 如果提供的值为空字符串或 null，则使用默认图标；否则使用提供的值
            $finalIcon = empty($newIcon) ? 'fas fa-code' : $newIcon;
            if ($finalIcon !== $tag->icon) {
                $tag->icon = $finalIcon;
                $isDirty = true;
            }
        }
        // --- 图标更新逻辑结束 ---

        if ($isDirty) {
            $tag->save();
        }

        return $tag;
    }
}
