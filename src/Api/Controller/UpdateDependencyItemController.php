<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyItemValidator;
use Carbon\Carbon;
use Flarum\Foundation\ValidationException; // 用于抛出验证错误

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

        // --- 权限检查: 使用 Policy ---
        // 检查用户是否有编辑权限
        $actor->assertCan('edit', $item);
        // --- 权限检查结束 ---

        // 准备验证数据
        $validationAttributes = $attributes;
        // 将模型实例传递给验证器，以便它可以忽略 unique 规则中的当前项（如果需要）
        $this->validator->setItem($item); // 假设验证器有 setItem 方法
        $this->validator->assertValid($validationAttributes);

        $isDirty = false; // 标记是否有更改

        // --- 更新属性 ---
        if (isset($attributes['title']) && $attributes['title'] !== $item->title) {
            $item->title = $attributes['title'];
            $isDirty = true;
        }
        if (isset($attributes['link']) && $attributes['link'] !== $item->link) {
            $item->link = $attributes['link'];
            $isDirty = true;
        }
        if (isset($attributes['description']) && $attributes['description'] !== $item->description) {
            $item->description = $attributes['description'];
            $isDirty = true;
        }
        // --- 属性更新结束 ---

        // --- 处理状态变更 (仅当 status 属性被传递时) ---
        if (isset($attributes['status'])) {
            $newStatus = $attributes['status'];
            // 检查用户是否有权更改状态 (批准/取消批准)
            if ($newStatus !== $item->status) {
                $actor->assertCan('approve', $item); // 检查是否有批准权限

                if (in_array($newStatus, ['approved', 'pending', 'rejected'])) {
                    if ($newStatus === 'approved' && $item->status !== 'approved') {
                        $item->approved_at = Carbon::now();
                        $item->approver_user_id = $actor->id;
                    } elseif ($newStatus !== 'approved') {
                        // 如果状态变为非 approved，清除批准信息
                        $item->approved_at = null;
                        $item->approver_user_id = null;
                    }
                    $item->status = $newStatus;
                    $isDirty = true;
                } else {
                    // 如果传递的状态值无效
                    throw new ValidationException(['status' => 'Invalid status value provided.']);
                }
            }
        }
        // --- 状态变更处理结束 ---

        // --- 处理标签更新 ---
        $relationships = Arr::get($data, 'relationships', []);
        if (isset($relationships['tags']['data'])) {
            $newTagIds = [];
            foreach ($relationships['tags']['data'] as $tagData) {
                if (isset($tagData['id'])) {
                    $newTagIds[] = $tagData['id'];
                }
            }

            // 在同步之前获取当前的标签ID，用于比较是否有变化
            $currentTagIds = $item->tags()->pluck('id')->all();
            // 对两个数组进行排序，以便准确比较
            sort($currentTagIds);
            sort($newTagIds);

            if ($currentTagIds !== $newTagIds) {
                // 验证标签ID是否存在等 (可以在 Validator 中完成)
                // 确保至少有一个标签，如果这是业务规则
                if (empty($newTagIds) && $item->status === 'approved') { // 例如：已批准的项必须有标签
                    // throw new ValidationException(['tags' => 'An approved item must have at least one tag.']);
                }
                $item->tags()->sync($newTagIds);
                $isDirty = true;
            }
        }
        // --- 标签更新处理结束 ---

        // 只有在实际发生更改时才保存
        if ($isDirty) {
            // 如果需要触发事件
            // $this->events->dispatch(new Events\ItemWillBeUpdated($item, $actor, $data));
            $item->save();
            // $this->events->dispatch(new Events\ItemWasUpdated($item, $actor, $data));
        }


        // 控制器最终会加载关联关系并使用序列化器返回更新后的模型
        return $item;
    }
}
