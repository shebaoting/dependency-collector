// js/src/forum/components/DependencyListPage.js

import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import DependencyItemCard from './DependencyItemCard';
// listItems 不再需要，因为我们手动构建列表
// import listItems from 'flarum/common/helpers/listItems';
import Link from 'flarum/common/components/Link';
import SubmitDependencyModal from './SubmitDependencyModal';
// 不再需要引入 IndexPage 来获取 sidebarItems
// import IndexPage from 'flarum/forum/components/IndexPage';

export default class DependencyListPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);
    console.log('DependencyListPage oninit'); // 调试日志
    this.loading = true;
    this.items = [];
    this.tags = [];
    this.moreResults = false;
    this.currentTagFilter = m.route.param('tagSlug'); // 直接从路由参数获取

    this.loadResults();
    this.loadTags();
  }

  // 添加 oncreate 生命周期方法，用于设置页面标题
  oncreate(vnode) {
    super.oncreate(vnode);
    app.setTitle(app.translator.trans('shebaoting-dependency-collector.forum.nav_title'));
    app.setTitleCount(0); // 清除通知计数（如果适用）
  }

  view() {
    console.log('DependencyListPage view rendering. Loading:', this.loading, 'Items:', this.items.length, 'Tags:', this.tags.length); // 调试日志
    return (
      <div className="container">
        {/* 不再需要调用 IndexPage.prototype.sidebarItems */}
        {/* {IndexPage.prototype.sidebarItems().render()} */}

        {/* 使用类似 IndexPage 的容器结构 */}
        <div className="sideNavContainer">
          <div className="IndexPage-nav sideNav">
            <ul className="DependencyListPage">
              <li className="item-newDiscussion App-primaryControl">
                {app.session.user && app.forum?.attribute('canSubmitDependencyCollectorItem') && (
                  <Button
                    className="Button Button--primary"
                    icon="fas fa-plus"
                    onclick={() =>
                      app.modal.show(SubmitDependencyModal, {
                        // 传递一个回调，以便在成功提交后刷新列表
                        onsubmit: () => this.loadResults(0),
                      })
                    }
                  >
                    {app.translator.trans('shebaoting-dependency-collector.forum.list.submit_button')}
                  </Button>
                )}
              </li>
              <li className="item-nav DependencyListPage-sidebar">
                <div className="ButtonGroup Dropdown dropdown App-titleControl Dropdown--select itemCount9">
                  {/* 渲染标签列表 */}
                  <ul className=" DependencyListTags">
                    <li className={!this.currentTagFilter ? 'active item-allDiscussions' : 'item-allDiscussions'}>
                      <a
                        href="#"
                        onclick={(e) => {
                          e.preventDefault();
                          m.route.set(app.route('dependency-collector.forum.index'));
                        }}
                      >
                        {app.translator.trans('shebaoting-dependency-collector.forum.list.all_tags')}
                      </a>
                    </li>
                    {this.tags &&
                      this.tags.map(
                        (
                          tag // 添加 this.tags 检查
                        ) => (
                          <li key={tag.id()} className={this.currentTagFilter === tag.slug() ? 'active item-allDiscussions' : 'item-allDiscussions'}>
                            {/* 使用 onclick 和 m.route.set */}
                            <a
                              href="#"
                              onclick={(e) => {
                                e.preventDefault();
                                m.route.set(app.route('dependency-collector.forum.index', { tagSlug: tag.slug() }));
                              }}
                            >
                              {tag.icon() && <i className={tag.icon() + ' DependencyListTag-icon'}></i>}
                              {tag.name()}
                            </a>
                          </li>
                        )
                      )}
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <div className="IndexPage-results DependencyListPage">
            {/* 主要内容区域 */}
            <div className="DependencyListPage-body">
              {/* 加载指示器 */}
              {this.loading && this.items.length === 0 ? (
                <LoadingIndicator />
              ) : (
                <div className="DependencyList">
                  {/* 渲染依赖项卡片 */}
                  {this.items &&
                    this.items.map(
                      (
                        item // 添加 this.items 检查
                      ) => (
                        <DependencyItemCard item={item} key={item.id()} onchange={() => this.loadResults(0)} /> // 传递 onchange
                      )
                    )}
                </div>
              )}

              {/* 无结果提示 */}
              {!this.loading && this.items.length === 0 && <p>{app.translator.trans('shebaoting-dependency-collector.forum.list.empty_text')}</p>}

              {/* 加载更多按钮 */}
              {this.moreResults && !this.loading && (
                <div style="text-align: center; margin-top: 10px;">
                  <Button className="Button" onclick={this.loadMore.bind(this)} disabled={this.loadingMore}>
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

  // --- loadResults 方法保持基本不变，但确保参数正确 ---
  loadResults(offset = 0) {
    if (offset > 0) {
      this.loadingMore = true;
    } else {
      this.loading = true;
      this.items = []; // 清空项目以显示加载指示器
    }
    m.redraw();

    const params = {
      page: { offset },
      sort: '-approvedAt',
      include: 'user,tags,approver', // 确保请求包含所需关系
    };

    // 使用最新的路由参数来过滤
    const currentTag = m.route.param('tagSlug');
    if (currentTag) {
      params.filter = { tag: currentTag };
      this.currentTagFilter = currentTag; // 更新内部状态
    } else {
      this.currentTagFilter = null; // 清除内部状态
    }

    console.log('Loading results with params:', params); // 调试日志

    return app.store
      .find('dependency-items', params)
      .then((results) => {
        console.log('Results loaded:', results); // 调试日志
        if (Array.isArray(results)) {
          if (offset === 0) {
            this.items = results;
          } else {
            this.items.push(...results);
          }
          // 检查是否有下一页链接，并确保 results.payload 存在
          this.moreResults = !!results.payload?.links?.next;
          console.log('More results:', this.moreResults); // 调试日志
        } else {
          console.error('API did not return an array for dependency-items:', results);
          this.items = offset === 0 ? [] : this.items;
          this.moreResults = false;
        }
      })
      .catch((error) => {
        console.error('Error loading dependency items:', error);
        this.items = offset === 0 ? [] : this.items;
        this.moreResults = false;
      })
      .finally(() => {
        this.loading = false;
        this.loadingMore = false;
        // 确保在 finally 中调用 redraw
        m.redraw();
        console.log('Loading finished, redraw called.'); // 调试日志
      });
  }

  // --- loadTags 方法保持不变 ---
  loadTags() {
    app.store
      .find('dependency-tags', { sort: 'name' })
      .then((tags) => {
        if (Array.isArray(tags)) {
          this.tags = tags;
        } else {
          console.error('API did not return an array for dependency-tags:', tags);
          this.tags = [];
        }
        // 移除这里的 redraw，让 loadResults 的 finally 处理
        // m.redraw();
      })
      .catch((error) => {
        console.error('Error loading tags:', error);
        this.tags = [];
        // 移除这里的 redraw
        // m.redraw();
      });
  }

  // --- loadMore 方法保持不变 ---
  loadMore() {
    if (this.loadingMore || this.loading) return; // 增加 this.loading 检查
    this.loadResults(this.items.length);
  }

  // --- 移除 onbeforeupdate 方法 ---
  // onbeforeupdate(vnode, old) { ... }

  // --- onremove 方法保持不变 ---
  onremove(vnode) {
    console.log('DependencyListPage onremove'); // 调试日志
    super.onremove(vnode);
    // Clean up listeners or other resources if any
  }
}
