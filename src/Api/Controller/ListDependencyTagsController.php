<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Illuminate\Support\Arr;

class ListDependencyTagsController extends AbstractListController
{
    // 指定序列化器
    public $serializer = DependencyTagSerializer::class;

    // 可选的默认包含的关联关系
    // public $include = [];

    // 可选的排序字段
    public $sortFields = ['name', 'createdAt', 'itemCount']; // itemCount 需要在 serializer 中计算或通过 withCount 加载

    // 默认排序
    public $sort = ['name' => 'asc'];

    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);

        // 任何人都可以查看标签列表，因此通常不需要特定的权限检查来列出它们
        // 如果有需要，可以在这里添加，例如： $actor->assertCan('viewDependencyTags');

        $filters = $this->extractFilter($request);
        $sort = $this->extractSort($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        // $include = $this->extractInclude($request); // 如果有 $include 定义

        $query = DependencyTag::query();

        // 可以在此处添加基于 $filters 的查询逻辑，例如按名称搜索
        // $search = Arr::get($filters, 'q');
        // if ($search) {
        //     $query->where('name', 'like', "%{$search}%");
        // }

        // 如果需要显示 itemCount，确保它被正确加载或计算
        // 例如，如果 DependencyTagSerializer 中的 itemCount 是通过 items()->count() 计算的，
        // 并且你希望能够按它排序，你可能需要使用 withCount('items')
        if (isset($sort['itemCount'])) {
            $query->withCount('items'); // 这样就会有一个 items_count 列可供排序
            // 注意：如果 $sortFields 中定义了 'itemCount'，实际排序时应使用 'items_count'
            if ($sortKey = array_search('itemCount', $this->sortFields, true)) {
                // 更新排序键，以匹配 withCount 生成的列名
                if (isset($sort['itemCount'])) {
                    $sort['items_count'] = $sort['itemCount'];
                    unset($sort['itemCount']);
                }
            }
        }


        $totalResults = $query->count();

        $query->skip($offset)->take($limit);

        foreach ((array) $sort as $field => $order) {
            // 确保对 itemCount 排序时使用正确的列名
            if ($field === 'itemCount' && $query->getQuery()->columns && in_array('items_count', array_column($query->getQuery()->columns, 'name'))) {
                $query->orderBy('items_count', $order);
            } elseif (in_array($field, $this->sortFields)) {
                $query->orderBy($field, $order);
            }
        }


        $document->addPaginationLinks(
            $this->url->to('api')->route('dependency-collector.tags.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $totalResults - ($offset + $limit) > 0 ? null : 0
        );

        $results = $query->get();

        // $this->loadRelations($results, $include, $request); // 如果有 $include 定义

        return $results;
    }
}
