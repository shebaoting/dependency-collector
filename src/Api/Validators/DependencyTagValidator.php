<?php

namespace Shebaoting\DependencyCollector\Api\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;
use Shebaoting\DependencyCollector\Models\DependencyTag;

/**
 * DependencyTagValidator 类。
 * 用于验证创建和更新 DependencyTag 时的数据。
 * 继承自 Flarum 的 AbstractValidator，可以利用其提供的功能。
 */
class DependencyTagValidator extends AbstractValidator
{
    /**
     * 获取适用于创建或更新 DependencyTag 的验证规则。
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|string|array<string|\Illuminate\Contracts\Validation\Rule>>
     * 返回一个包含验证规则的关联数组。
     * 键是属性名 (例如 'name', 'slug')。
     * 值可以是字符串形式的规则 (例如 'required|string|max:100')，
     * 也可以是包含多个规则字符串或 Rule 对象的数组。
     */
    protected function getRules(): array
    {
        // 尝试从 AbstractValidator 的 $model 属性获取当前正在操作的模型实例。
        // 这个属性通常在处理更新请求时由 Flarum 核心或相关控制器设置。
        // 如果是创建操作 ($this->model 不存在或为 null)，则 $modelToIgnore 为 null。
        // Rule::unique(...)->ignore(null) 不会添加忽略条件，这是创建时所需的行为。
        // 如果是更新操作 ($this->model 是当前标签实例)，ignore() 会使用该实例的主键来排除自身。
        $modelToIgnore = $this->model ?? null;

        return [
            // 规则 for 'name' 字段
            'name' => [
                'sometimes', // 表示只有当 'name' 字段在输入数据中存在时，才应用后续规则
                'required',  // 如果存在，则该字段不能为空
                'string',    // 值必须是字符串类型
                'max:100',   // 字符串最大长度为 100 个字符
                // 使用 Rule::unique 来确保名称在数据库表中是唯一的
                Rule::unique((new DependencyTag)->getTable(), 'name') // 指定表名和列名
                    ->ignore($modelToIgnore), // 在更新时忽略当前模型实例，防止误判为重复
            ],
            // 规则 for 'slug' 字段
            'slug' => [
                'sometimes', // 仅当 'slug' 存在时验证
                'required',  // 如果存在，则不能为空
                'string',    // 必须是字符串
                'max:100',   // 最大长度 100
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', // 验证 slug 格式 (小写字母, 数字, 连字符)
                // 确保 slug 也是唯一的，同样忽略当前模型
                Rule::unique((new DependencyTag)->getTable(), 'slug')
                    ->ignore($modelToIgnore),
            ],
            // 规则 for 'description' 字段
            'description' => [
                'sometimes', // 仅当 'description' 存在时验证
                'nullable',  // 允许值为 null
                'string',    // 必须是字符串
                'max:255',   // 最大长度 255
            ],
            // 规则 for 'color' 字段
            'color' => [
                'sometimes', // 仅当 'color' 存在时验证
                'nullable',  // 允许值为 null
                'string',    // 必须是字符串
                'max:7',     // 最大长度 7 (如 #RRGGBB)
                'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', // 验证 16 进制颜色格式
            ],
            // 规则 for 'icon' 字段
            'icon' => [
                'sometimes', // 仅当 'icon' 存在时验证
                'nullable',  // 允许值为 null
                'string',    // 必须是字符串
                'max:100',   // 最大长度 100 (FontAwesome 图标类名)
            ],
        ];
    }

    // 你可以根据需要重写 getMessages() 方法来自定义错误消息
    protected function getMessages()
    {
        return [
            'name.required' => '标签名称不能为空。',
            'name.unique' => '该标签名称已被使用。',
            'slug.unique' => '该标签标识符已被使用。',
            'slug.regex' => '标签标识符只能包含小写字母、数字和连字符。',
            'color.regex' => '颜色必须是有效的十六进制代码 (例如 #FF0000)。',
        ];
    }
}
