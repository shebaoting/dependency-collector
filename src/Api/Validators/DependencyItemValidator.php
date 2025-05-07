<?php

namespace Shebaoting\DependencyCollector\Api\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Illuminate\Support\Arr; // Arr::get 可能仍然有用，但不是针对 $this->attributes

class DependencyItemValidator extends AbstractValidator
{
    /**
     * @var DependencyItem|null
     */
    protected $item;

    /**
     * @param DependencyItem $item
     */
    public function setItem(DependencyItem $item)
    {
        $this->item = $item;
    }

    protected function getRules()
    {
        // 判断是更新还是创建，基于 $this->item 是否已设置且存在
        $isUpdate = ($this->item && $this->item->exists);

        $rules = [
            'title' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'link' => [$isUpdate ? 'sometimes' : 'required', 'url', 'max:255'],
            'description' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:5000'],
            // 'tag_ids' 规则:
            // - 'sometimes': 表示只有当 tag_ids 字段在输入数据中存在时，后续规则才会应用。
            // - 'array': 值必须是数组。
            // - 对于创建 ($isUpdate 为 false):
            //    - 'required': tag_ids 字段必须存在。 (如果前端总是提交空数组，可以考虑去掉，依赖 min:1)
            //    - 'min:1': 数组至少要有一个元素。
            // - 对于更新 ($isUpdate 为 true):
            //    - 'nullable': 允许 tag_ids 为 null (或者前端可以不提交该字段，由 sometimes 控制)。
            //      如果前端提交空数组 []，它会被 'array' 规则接受，并且因为没有 'min:1'，所以是有效的（表示移除所有标签）。
            'tag_ids' => [
                'sometimes',
                'array',
                $isUpdate ? 'nullable' : 'required', // 创建时必须，更新时可空
            ],
            'tag_ids.*' => [
                'integer',
                Rule::exists((new DependencyTag)->getTable(), 'id')
            ],
            'status' => [
                'sometimes',
                Rule::in(['pending', 'approved', 'rejected'])
            ]
        ];

        if (!$isUpdate) {
            // 确保创建时 tag_ids 至少有一个元素
            // 如果 'tag_ids' => ['required', 'array', 'min:1'] 这样写更简洁
            // 这里我们附加 min:1 到已有的 'sometimes', 'array', 'required' 规则上
            // 需要确保 'tag_ids' 键本身是存在的，'required' 确保了这一点。
            $rules['tag_ids'][] = 'min:1';
        }


        return $rules;
    }

    protected function getMessages()
    {
        return [
            'tag_ids.required' => 'At least one plugin tag is required.',
            'tag_ids.min' => 'At least one plugin tag is required.',
            'tag_ids.*.exists' => 'One or more selected plugin tags are invalid.'
        ];
    }
}
