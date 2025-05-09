// js/src/forum/components/DependencyListPage.js

import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import DependencyItemCard from './DependencyItemCard';
// Link 导入是好的实践，即使当前没有直接使用实例
import Link from 'flarum/common/components/Link';
import SubmitDependencyModal from './SubmitDependencyModal';
import LinkButton from 'flarum/common/components/LinkButton';
import classList from 'flarum/common/utils/classList'; // 用于动态添加类
export default class DependencyListPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);
    console.log('DependencyListPage oninit'); // 调试日志

    this.loadingItems = true; // 依赖项列表的加载状态
    this.loadingTags = true; // 标签列表的加载状态
    this.loadingMore = false; // “加载更多”按钮的加载状态
    this.items = [];
    this.tags = []; // 初始化为空数组，避免渲染时出错
    this.moreResults = false;
    // 初始化 currentTagFilter，确保首次加载时使用正确的路由参数
    this.currentTagFilter = m.route.param('tagSlug') || null; // 使用 null 代替 undefined
    this.showingFavorites = m.route.param('filter') === 'favorites';
    // 在初始化时同时开始加载标签和依赖项
    this.loadTags();
    this.loadResults(0); // 加载第一页依赖项
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    app.setTitle(app.translator.trans('shebaoting-dependency-collector.forum.nav_title'));
    app.setTitleCount(0); // 清除页面标题的计数（如果有）
  }

  // 使用 onbeforeupdate 来检测路由参数的变化
  onbeforeupdate(vnode, old) {
    super.onbeforeupdate(vnode, old);

    const newTagFilter = m.route.param('tagSlug') || null; // 获取新的路由参数
    const newShowingFavorites = m.route.param('filter') === 'favorites';
    // 检查路由参数是否真的发生了变化
    if (newTagFilter !== this.currentTagFilter || newShowingFavorites !== this.showingFavorites) {
      this.currentTagFilter = newTagFilter;
      this.showingFavorites = newShowingFavorites; // 更新组件状态
      this.loadResults(0);
      return false;
    }

    // 如果路由参数没有变化，允许 Mithril 进行正常的重绘
    return true;
  }

  view() {
    // 调试日志，展示当前渲染时的状态
    console.log(
      'DependencyListPage view rendering. LoadingItems:',
      this.loadingItems,
      'LoadingTags:',
      this.loadingTags,
      'Items:',
      this.items.length,
      'Tags:',
      this.tags.length,
      'CurrentTag:',
      this.currentTagFilter
    );

    return (
      <div className="container">
        {/* 使用 sideNavContainer 保持和 Flarum 索引页类似的布局 */}
        <div className="sideNavContainer IndexPage-main">
          {/* 左侧导航栏 */}
          <div className="IndexPage-nav sideNav dependencylist-sidenav">
            <ul className="DependencyListPage">
              {/* 提交按钮区域 */}
              <li className="item-newDiscussion App-primaryControl">
                {/* 检查用户是否登录以及是否有提交权限 */}
                {app.session.user && app.forum?.attribute('canSubmitDependencyCollectorItem') && (
                  <Button
                    // 使用 Flarum 核心样式类以保持一致性
                    className="Button Button--primary IndexPage-newDiscussion"
                    icon="fas fa-plus"
                    onclick={() =>
                      app.modal.show(SubmitDependencyModal, {
                        // 传递回调，提交成功后刷新依赖项列表
                        onsubmit: () => this.loadResults(0),
                      })
                    }
                  >
                    {/* 按钮文本 */}
                    {app.translator.trans('shebaoting-dependency-collector.forum.list.submit_button')}
                  </Button>
                )}

                {app.session.user &&
                  app.forum?.attribute('canFavoriteDependencyCollectorItemGlobal') && ( // 检查全局收藏权限
                    <Button
                      className={classList('Button IndexPage-newDiscussion favorites', this.showingFavorites && 'active')} // 如果正在显示收藏，则激活
                      icon="fas fa-star"
                      onclick={this.showMyFavorites.bind(this)}
                    >
                      {app.translator.trans('shebaoting-dependency-collector.forum.list.my_favorites_button')} {/* 需要添加翻译 */}
                    </Button>
                  )}
              </li>

              {/* 标签列表导航区域 */}
              <li className="item-nav DependencyListPage-sidebar">
                {/* 标签列表标题 */}
                {/* <h3>{app.translator.trans('shebaoting-dependency-collector.forum.list.tags_heading')}</h3> */}
                <div className="ButtonGroup Dropdown dropdown App-titleControl Dropdown--select itemCount9">
                  {/* 如果标签正在加载，显示加载指示器 */}
                  {this.loadingTags ? (
                    <LoadingIndicator />
                  ) : (
                    // 使用 Flarum 核心标签导航样式
                    <ul className="DependencyListTags">
                      {/* “全部标签”链接 */}
                      <li className={'TagLink ' + (!this.currentTagFilter ? 'active item-allDiscussions' : 'item-allDiscussions')}>
                        <a
                          // 生成指向 "全部标签" 的路由 URL
                          href={app.route('dependency-collector.forum.index')}
                          onclick={(e) => {
                            e.preventDefault(); // 阻止默认的页面跳转
                            // 只有当当前过滤器不是 "全部" 时才进行路由切换
                            if (this.currentTagFilter || this.showingFavorites) {
                              m.route.set(app.route('dependency-collector.forum.index'));
                            }
                          }}
                        >
                          <span className="TagLink-name">{app.translator.trans('shebaoting-dependency-collector.forum.list.all_tags')}</span>
                        </a>
                      </li>
                      {/* 渲染具体的标签链接 */}
                      {/* 确保 this.tags 存在且有内容 */}
                      {this.tags && this.tags.length > 0
                        ? this.tags.map((tag) => (
                            <li
                              key={tag.id()}
                              className={'TagLink ' + (this.currentTagFilter === tag.slug() ? 'active item-allDiscussions' : 'item-allDiscussions')}
                            >
                              <a
                                // 生成指向特定标签过滤的路由 URL
                                href={app.route('dependency-collector.forum.index', { tagSlug: tag.slug() })}
                                onclick={(e) => {
                                  e.preventDefault(); // 阻止默认跳转
                                  // 只有当点击的不是当前已选标签时才进行路由切换
                                  if (this.currentTagFilter !== tag.slug() || this.showingFavorites) {
                                    m.route.set(app.route('dependency-collector.forum.index', { tagSlug: tag.slug() }));
                                  }
                                }}
                              >
                                {/* 如果标签有图标，则显示 */}
                                {tag.icon() && <i className={tag.icon() + ' TagLink-icon'}></i>}
                                <span className="TagLink-name">{tag.name()}</span>
                              </a>
                            </li>
                          ))
                        : // 如果标签加载完成但列表为空，显示提示信息
                          !this.loadingTags && (
                            <li className="TagLink disabled">
                              <span className="TagLink-name">{app.translator.trans('shebaoting-dependency-collector.forum.list.no_tags')}</span>
                            </li>
                          )}
                    </ul>
                  )}
                </div>
              </li>
            </ul>
          </div>

          {/* 主要内容区域，显示依赖项列表 */}
          <div className="IndexPage-results sideNavOffset DependencyListPage">
            <div className="DependencyListPage-body">
              {/* 如果是初始加载依赖项且当前没有项目，显示加载指示器 */}
              {this.loadingItems && this.items.length === 0 ? (
                <LoadingIndicator />
              ) : (
                // 依赖项列表容器
                <div className="DependencyList">
                  {/* 确保 this.items 存在且有内容 */}
                  {this.items && this.items.length > 0
                    ? // 遍历并渲染每个依赖项卡片
                      this.items.map((item) => <DependencyItemCard item={item} key={item.id()} onchange={() => this.loadResults(0)} />)
                    : // 如果依赖项加载完成但列表为空，显示空状态提示
                      !this.loadingItems && <p>{app.translator.trans('shebaoting-dependency-collector.forum.list.empty_text')}</p>}
                </div>
              )}

              {/* “加载更多”按钮 */}
              {/* 仅当有更多结果时才显示此区域 */}
              {this.moreResults && (
                <div style="text-align: center; margin-top: 10px;">
                  <Button
                    className="Button"
                    onclick={this.loadMore.bind(this)}
                    // 使用 loading 属性在加载更多时显示加载状态并禁用按钮
                    loading={this.loadingMore}
                  >
                    {app.translator.trans('core.forum.discussion_list.load_more_button')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 加载依赖项列表的方法
  loadResults(offset = 0) {
    // offset === 0 表示初始加载或过滤加载
    if (offset === 0) {
      this.loadingItems = true;
      this.items = []; // 清空列表以准备显示新的结果或加载指示器
      this.moreResults = false; // 重置是否有更多结果的状态
      m.redraw(); // 立即重绘以反映加载状态
    } else {
      // offset > 0 表示加载更多
      this.loadingMore = true;
      m.redraw(); // 立即重绘以更新“加载更多”按钮状态
    }

    // 准备 API 请求参数
    const params = {
      page: { offset },
      sort: '-approvedAt', // 按最新审核排序
      include: 'user,tags,approver,favoritedByUsers', // 请求包含关联的用户、标签和审核者信息
      filter: {}, // 确保 filter 对象存在
    };

    // 如果当前设置了标签过滤器，添加到请求参数中
    if (this.showingFavorites) {
      params.filter.isFavorite = true; // 后端会根据 actor 自动筛选
      // 当查看收藏时，通常不应用标签筛选，除非你希望支持“我收藏的某个标签下的项目”
      // 如果需要，则不清除 this.currentTagFilter，并让后端处理组合筛选
    } else if (this.currentTagFilter) {
      params.filter.tag = this.currentTagFilter;
    }

    console.log('Loading results with params:', JSON.stringify(params)); // 调试日志

    // 发起 API 请求
    return app.store
      .find('dependency-items', params)
      .then((results) => {
        console.log('Results loaded:', results); // 调试日志
        // 检查返回的是否是数组 (Flarum store.find 成功时应返回模型数组)
        if (Array.isArray(results)) {
          if (offset === 0) {
            // 如果是初始加载，直接替换列表
            this.items = results;
          } else {
            // 如果是加载更多，追加到现有列表
            this.items.push(...results);
          }
          // 检查 API 响应的 payload 中是否有下一页的链接
          // store 返回的数组会附加一个 payload 对象包含元数据和链接
          this.moreResults = !!results.payload?.links?.next;
          console.log('More results:', this.moreResults); // 调试日志
        } else {
          // 处理 API 返回格式不正确的情况
          console.error('API did not return an array for dependency-items:', results);
          if (offset === 0) this.items = []; // 如果是初始加载，清空列表
          this.moreResults = false; // 标记没有更多结果
        }
      })
      .catch((error) => {
        // 处理 API 请求错误
        console.error('Error loading dependency items:', error);
        if (offset === 0) this.items = []; // 错误发生时，如果是初始加载则清空列表
        this.moreResults = false; // 标记没有更多结果
        // 可以在这里向用户显示错误提示，例如使用 app.alerts.show
        app.alerts.show({ type: 'error' }, app.translator.trans('shebaoting-dependency-collector.forum.list.load_error'));
      })
      .finally(() => {
        // 无论请求成功或失败，都结束加载状态
        this.loadingItems = false;
        this.loadingMore = false;
        m.redraw(); // 确保最终的 UI 状态被渲染
        console.log('Loading finished, redraw called.'); // 调试日志
      });
  }

  // 加载标签列表的方法
  loadTags() {
    this.loadingTags = true;
    // 可以选择在这里重绘以显示加载状态
    // m.redraw();

    // 发起 API 请求获取所有标签，按名称排序
    app.store
      .find('dependency-tags', { sort: 'name' })
      .then((tags) => {
        console.log('Tags loaded:', tags); // 调试日志
        // 确保返回的是数组
        if (Array.isArray(tags)) {
          this.tags = tags;
        } else {
          console.error('API did not return an array for dependency-tags:', tags);
          this.tags = []; // 保证 tags 是一个空数组
        }
      })
      .catch((error) => {
        // 处理错误
        console.error('Error loading tags:', error);
        this.tags = []; // 出错时也保证 tags 是空数组
        // 可以显示错误提示
        app.alerts.show({ type: 'error' }, app.translator.trans('shebaoting-dependency-collector.forum.list.load_tags_error'));
      })
      .finally(() => {
        // 结束标签加载状态
        this.loadingTags = false;
        // 确保标签列表加载完成后 UI 能更新，即使依赖项列表还在加载
        m.redraw();
        console.log('Tag loading finished.'); // 调试日志
      });
  }

  // 加载更多依赖项的方法
  loadMore() {
    // 如果正在加载中（初始或更多），则不执行任何操作
    if (this.loadingItems || this.loadingMore) return;

    console.log('Loading more items...'); // 调试日志
    // 调用 loadResults，使用当前项目数量作为下一页的偏移量
    this.loadResults(this.items.length);
  }

  // 组件移除时的清理方法
  onremove(vnode) {
    console.log('DependencyListPage onremove'); // 调试日志
    super.onremove(vnode);
    // 如果有事件监听器或其他需要清理的资源，在此处处理
  }

  showMyFavorites() {
    if (!this.showingFavorites) {
      // 只有当当前不是收藏列表时才切换
      m.route.set(app.route('dependency-collector.forum.index', { filter: 'favorites' }));
    }
  }
}
