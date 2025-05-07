<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Illuminate\Support\Arr;
use Illuminate\Support\Str; // 用于驼峰转蛇形

class ListDependencyItemsController extends AbstractListController
{
    /**
     * {@inheritdoc}
     * 指定用于此控制器的序列化器。
     */
    public $serializer = DependencyItemSerializer::class;

    /**
     * {@inheritdoc}
     * 默认情况下要包含的关联关系。
     * 例如：['user', 'tags', 'approver']
     */
    public $include = ['user', 'tags', 'approver'];

    /**
     * {@inheritdoc}
     * 允许客户端进行排序的字段列表。
     * 这些字段名应该是前端API请求中使用的驼峰式名称。
     */
    public $sortFields = ['submittedAt', 'approvedAt'];

    /**
     * {@inheritdoc}
     * 默认的排序规则。
     * 键名应该是前端API请求中使用的驼峰式名称。
     * 值可以是 'asc' 或 'desc'。
     * 或者，可以使用 Flarum 的约定，例如 '-approvedAt' 表示按 approvedAt 降序。
     * extractSort 方法会处理前缀 '-'。
     */
    public $sort = ['approvedAt' => 'desc']; // 默认按批准时间降序

    /**
     * @var UrlGenerator
     */
    protected $url;

    /**
     * @param UrlGenerator $url
     */
    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request); // 获取当前操作的用户
        $filters = $this->extractFilter($request); // 提取请求中的过滤参数

        // 从请求中提取排序参数 (例如 ?sort=approvedAt 或 ?sort=-submittedAt)
        // extractSort 会根据 $this->sortFields 验证这些参数
        // 返回值是一个关联数组，键是前端使用的字段名 (如 'approvedAt')，值是排序方向 ('asc' 或 'desc')
        $sortInput = $this->extractSort($request);

        // 如果请求中没有提供排序参数，则使用控制器定义的默认排序
        if (empty($sortInput)) {
            $sortInput = $this->sort;
        }

        // 将前端使用的排序字段名 (驼峰式) 转换为数据库实际使用的列名 (蛇形)
        $dbSort = [];
        foreach ($sortInput as $frontendField => $direction) {
            // 确保只转换在 $this->sortFields 中定义的、允许排序的字段
            if (in_array($frontendField, $this->sortFields)) {
                $dbSort[Str::snake($frontendField)] = $direction;
            }
        }

        $limit = $this->extractLimit($request); // 提取分页大小限制
        $offset = $this->extractOffset($request); // 提取分页偏移量
        $include = $this->extractInclude($request); // 提取请求中明确要求包含的关联关系

        // 初始化查询构造器
        $query = DependencyItem::query();

        // 根据用户权限和状态进行过滤
        if (!$actor->hasPermission('dependency-collector.moderate')) {
            // 普通用户只能看到已批准的依赖项，或者他们自己提交的待审核依赖项
            $query->where(function ($q) use ($actor) {
                $q->where('status', 'approved')
                    ->orWhere(function ($q2) use ($actor) {
                        $q2->where('user_id', $actor->id)
                            ->where('status', 'pending');
                    });
            });
        } else {
            // 管理员/版主可以看到所有状态的依赖项，除非有明确的状态过滤
            $statusFilter = Arr::get($filters, 'status');
            if ($statusFilter && in_array($statusFilter, ['pending', 'approved', 'rejected'])) {
                $query->where('status', $statusFilter);
            }
        }

        // 根据插件标签 (slug) 进行过滤
        $tagFilterSlug = Arr::get($filters, 'tag'); // 假设前端通过 ?filter[tag]=tag-slug 的方式传递
        if ($tagFilterSlug) {
            $query->whereHas('tags', function ($q) use ($tagFilterSlug) {
                // 假设 DependencyTag 模型中 'slug' 列存储了标签的 slug
                $q->where('dependency_collector_tags.slug', $tagFilterSlug);
            });
        }

        // 获取过滤和权限控制后的总结果数，用于分页
        $totalResults = $query->count();

        // 应用分页
        $query->skip($offset)->take($limit);

        // 应用排序 (使用转换后的数据库列名)
        foreach ($dbSort as $dbField => $order) {
            $query->orderBy($dbField, $order);
        }

        // 为响应文档添加分页链接
        $document->addPaginationLinks(
            $this->url->to('api')->route('dependency-collector.items.index'), // 当前列表 API 路由的 URL
            $request->getQueryParams(), // 当前请求的查询参数，用于构建分页链接
            $offset,
            $limit,
            $totalResults - ($offset + $limit) > 0 ? null : 0 // 如果还有更多结果，则 $remaining 不为0
        );

        // 执行查询并获取结果集合
        $results = $query->get();

        // 加载请求中指定的关联关系 (例如 'user', 'tags')
        // $this->loadRelations 会处理 $include 参数，并高效加载数据
        $this->loadRelations($results, $include, $request);

        return $results; // 返回结果给序列化器进行处理
    }
}
