<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;

class ToggleFavoriteController extends AbstractShowController
{
    public $serializer = DependencyItemSerializer::class;

    public $include = ['user', 'tags', 'approver', 'favoritedByUsers']; // 可能需要包含 favoritedByUsers 以便前端更新

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $itemId = Arr::get($request->getQueryParams(), 'id');

        $actor->assertRegistered(); // 确保用户已登录

        $item = DependencyItem::findOrFail($itemId);

        // 权限检查: 只有登录用户才能收藏
        // 你可以在 Policy 中定义一个 'favorite' 权限，如果需要更复杂的逻辑
        $actor->assertCan('favoriteItem', $item); // 我们将在 Policy 中定义这个能力

        // 切换收藏状态
        // toggle 方法会附加或分离关系，并返回一个包含已更改ID的数组
        $item->favoritedByUsers()->toggle($actor->id);

        // 重新加载模型以获取最新的关联关系，确保 isFavorited 属性正确
        $item->load('favoritedByUsers');

        return $item;
    }
}
