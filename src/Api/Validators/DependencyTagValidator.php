<?php

namespace Shebaoting\DependencyCollector\Api\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Illuminate\Support\Arr;


class DependencyTagValidator extends AbstractValidator
{
    // 移除 $model 属性声明，因为 AbstractValidator 没有定义它
    // protected $model; // 移除或注释掉这行

    // 使用一个内部属性来存储可能存在的模型实例（主要用于更新）
    protected $tagInstance = null;

    /**
     * 可选方法：允许控制器设置正在更新的模型实例
     * @param DependencyTag|null $tag
     */
    public function setInstance(?DependencyTag $tag)
    {
        $this->tagInstance = $tag;
    }

    protected function getRules()
    {
        // 确定在 unique 检查时要忽略的 ID
        $tagIdToIgnore = null;
        if ($this->tagInstance && $this->tagInstance->exists) {
            // 如果我们设置了实例（通常在更新时），则使用其实例 ID
            $tagIdToIgnore = $this->tagInstance->id;
        }
        // 注意：对于创建操作，$tagIdToIgnore 将保持为 null，这是正确的

        return [
            'name' => [
                'required',
                'string',
                'max:100',
                // 使用 Rule::unique 来构建唯一性规则，并指定要忽略的 ID
                Rule::unique((new DependencyTag)->getTable(), 'name')->ignore($tagIdToIgnore)
            ],
            'slug' => [
                'required',
                'string',
                'max:100',
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/',
                Rule::unique((new DependencyTag)->getTable(), 'slug')->ignore($tagIdToIgnore)
            ],
            'description' => ['nullable', 'string', 'max:255'],
            'color' => ['nullable', 'string', 'max:7', 'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/'],
            'icon' => ['nullable', 'string', 'max:100'],
        ];
    }
}
