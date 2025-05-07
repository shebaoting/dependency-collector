<?php

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

        $actor->assertCan('dependency-collector.moderate'); // Or a more specific delete permission

        $item = DependencyItem::findOrFail($itemId);
        $item->delete();
    }
}
