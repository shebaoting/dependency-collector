<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Shebaoting\DependencyCollector\Models\DependencyTag;

class DeleteDependencyTagController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $tagId = Arr::get($request->getQueryParams(), 'id');

        // 权限检查
        $actor->assertCan('dependency-collector.manageTags');

        $tag = DependencyTag::findOrFail($tagId);

        // 在删除标签之前，解除它与所有依赖项的关联
        // 这样做是为了避免因外键约束而出错，并且是“软”删除关联关系
        // 如果直接删除标签，并且 `dependency_collector_item_tag` 表中设置了 onDelete('cascade')，
        // 那么关联记录会自动删除。这里我们明确解除关联。
        $tag->items()->detach(); // 解除所有关联的依赖项

        // 如果有其他需要在删除前处理的逻辑，可以在这里添加
        // 例如，触发事件：$this->events->dispatch(new Events\TagWillBeDeleted($tag, $actor));

        $tag->delete();

        // 例如，触发事件：$this->events->dispatch(new Events\TagWasDeleted($tag, $actor));
    }
}
