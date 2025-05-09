<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Illuminate\Database\Query\Expression; // --- 新增: 用于数据库表达式 ---
use Illuminate\Support\Arr;
use Illuminate\Support\Str;

class ListDependencyItemsController extends AbstractListController
{
    public $serializer = DependencyItemSerializer::class;
    public $include = ['user', 'tags', 'approver'];

    // --- 修改: 更新允许的排序字段 ---
    // 我们将主要通过自定义逻辑排序，但保留这些以备前端特定请求
    public $sortFields = ['submittedAt', 'approvedAt', 'status'];

    // --- 修改: 更新默认排序，优先考虑待审核，然后是最新提交 ---
    // 注意：这里的 $sort 只是一个默认值，如果前端请求 sort 参数，它会被覆盖。
    // 我们将在 data 方法中处理主要的排序逻辑。
    public $sort = ['status' => 'asc', 'submittedAt' => 'desc'];


    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $filters = $this->extractFilter($request);
        $sortInput = $this->extractSort($request); // 获取前端请求的排序

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        $include = $this->extractInclude($request);

        $query = DependencyItem::query();

        // 用户权限和状态过滤逻辑保持不变
        if (!$actor->hasPermission('dependency-collector.moderate')) {
            $query->where(function ($q) use ($actor) {
                $q->where('status', 'approved')
                    ->orWhere(function ($q2) use ($actor) {
                        $q2->where('user_id', $actor->id)
                            ->where('status', 'pending');
                    });
            });
        } else {
            $statusFilter = Arr::get($filters, 'status');
            if ($statusFilter && in_array($statusFilter, ['pending', 'approved', 'rejected'])) {
                $query->where('status', $statusFilter);
            }
        }

        // 标签过滤逻辑保持不变
        $tagFilterSlug = Arr::get($filters, 'tag');
        if ($tagFilterSlug) {
            $query->whereHas('tags', function ($q) use ($tagFilterSlug) {
                $q->where('dependency_collector_tags.slug', $tagFilterSlug);
            });
        }

        $totalResults = $query->count();


        // 首先移除所有已存在的 orderBy 子句，以确保我们的自定义排序是主导
        $query->getQuery()->orders = null;

        // 1. 将 'pending' 状态的条目置顶
        //    对于 MySQL: FIELD(status, 'pending', 'approved', 'rejected')
        //    对于 PostgreSQL: CASE WHEN status = 'pending' THEN 0 WHEN status = 'approved' THEN 1 ELSE 2 END
        //    对于 SQLite: CASE WHEN status = 'pending' THEN 0 WHEN status = 'approved' THEN 1 ELSE 2 END
        //    我们使用 Laravel 的 DB::raw 来兼容
        $db = $query->getConnection();
        $statusOrderClause = '';
        $driver = $db->getDriverName();

        if ($driver === 'mysql') {
            $statusOrderClause = "FIELD(status, 'pending', 'approved', 'rejected')";
        } else { // pgsql, sqlite
            $statusOrderClause = "CASE status WHEN 'pending' THEN 0 WHEN 'approved' THEN 1 ELSE 2 END";
        }
        $query->orderByRaw(new Expression($statusOrderClause));

        // 2. 如果前端请求了特定的排序，则应用它作为次要排序
        //    否则，在 'pending' 状态内部按提交时间降序，其他状态按批准时间降序
        if (!empty($sortInput)) {
            foreach ($sortInput as $frontendField => $direction) {
                if (in_array($frontendField, $this->sortFields)) {
                    $dbField = Str::snake($frontendField);
                    // 如果排序字段是 status，它已经被上面的 orderByRaw 处理了，所以跳过
                    if ($dbField === 'status') continue;
                    $query->orderBy($dbField, $direction);
                }
            }
        } else {
            // 默认的次要排序：待审核的按提交时间降序，已批准的按批准时间降序
            $query->orderBy('submitted_at', 'desc'); // 对所有状态都适用，确保最新提交的在各自状态组的顶部
            // 如果你还想在已批准的条目中按批准时间排序，可以再加一个
            // $query->orderBy('approved_at', 'desc'); // 这会作为第三排序
        }



        $query->skip($offset)->take($limit);


        $document->addPaginationLinks(
            $this->url->to('api')->route('dependency-collector.items.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $totalResults - ($offset + $limit) > 0 ? null : 0
        );

        $results = $query->get();
        $this->loadRelations($results, $include, $request);

        return $results;
    }
}
