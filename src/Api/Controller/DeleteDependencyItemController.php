<?php
// src/Api/Controller/DeleteDependencyItemController.php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Shebaoting\DependencyCollector\Models\DependencyItem;

class DeleteDependencyItemController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $itemId = Arr::get($request->getQueryParams(), 'id');

        $item = DependencyItem::findOrFail($itemId); // 先找到 item

        // 使用 Policy 来检查删除权限
        $actor->assertCan('delete', $item);

        $item->delete();

        // 如果需要，可以在删除后触发事件
        // $this->events->dispatch(new Events\ItemWasDeleted($item, $actor));
    }
}
