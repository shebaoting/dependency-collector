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
    this.loadingMore = false; // “加载更多”按钮的加载状态
    this.items = [];
    this.tags = app.store.all('dependency-tags') || []; // 先尝试从 store 中获取
    this.moreResults = false;
    this.currentTagFilter = m.route.param('tagSlug') || null;
    this.showingFavorites = m.route.param('filter') === 'favorites';

    // --- 修改: 仅当 store 中没有标签时才加载 ---
    if (this.tags.length === 0) {
      this.loadingTags = true; // 只有在需要从API加载时才设置为true
      this.loadTags();
    } else {
      this.loadingTags = false; // 如果store中有，则不需要加载状态
      console.log('Tags already in store, not loading from API initially.');
    }
    // --- 修改结束 ---

    this.loadResults(0); // 加载第一页依赖项
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    app.setTitle(app.translator.trans('shebaoting-dependency-collector.forum.nav_title'));
    app.setTitleCount(0);
  }

  onbeforeupdate(vnode, old) {
    super.onbeforeupdate(vnode, old);

    const newTagFilter = m.route.param('tagSlug') || null;
    const newShowingFavorites = m.route.param('filter') === 'favorites';

    if (newTagFilter !== this.currentTagFilter || newShowingFavorites !== this.showingFavorites) {
      this.currentTagFilter = newTagFilter;
      this.showingFavorites = newShowingFavorites;
      this.loadResults(0);
      return false;
    }
    return true;
  }

  view() {
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
        <div className="sideNavContainer IndexPage-main">
          <div className="IndexPage-nav sideNav dependencylist-sidenav">
            <ul className="DependencyListPage">
              <li className="item-newDiscussion App-primaryControl">
                {app.session.user && app.forum?.attribute('canSubmitDependencyCollectorItem') && (
                  <Button
                    className="Button Button--primary IndexPage-newDiscussion"
                    icon="fas fa-plus"
                    onclick={() =>
                      app.modal.show(SubmitDependencyModal, {
                        onsubmit: () => this.loadResults(0),
                      })
                    }
                  >
                    {app.translator.trans('shebaoting-dependency-collector.forum.list.submit_button')}
                  </Button>
                )}

                {app.session.user && app.forum?.attribute('canFavoriteDependencyCollectorItemGlobal') && (
                  <Button
                    className={classList('Button IndexPage-newDiscussion favorites', this.showingFavorites && 'active')}
                    icon="fas fa-star"
                    onclick={this.showMyFavorites.bind(this)}
                  >
                    {app.translator.trans('shebaoting-dependency-collector.forum.list.my_favorites_button')}
                  </Button>
                )}
              </li>
              <li className="item-nav DependencyListPage-sidebar">
                <div className="ButtonGroup Dropdown dropdown App-titleControl Dropdown--select itemCount9">
                  {this.loadingTags && !this.tags.length ? ( // 只有在加载中且tags为空时显示
                    <LoadingIndicator />
                  ) : (
                    <ul className="DependencyListTags">
                      <li
                        className={
                          'TagLink ' + (!this.currentTagFilter && !this.showingFavorites ? 'active item-allDiscussions' : 'item-allDiscussions')
                        }
                      >
                        <a
                          href={app.route('dependency-collector.forum.index')}
                          onclick={(e) => {
                            e.preventDefault();
                            if (this.currentTagFilter || this.showingFavorites) {
                              m.route.set(app.route('dependency-collector.forum.index'));
                            }
                          }}
                        >
                          <span className="TagLink-name">{app.translator.trans('shebaoting-dependency-collector.forum.list.all_tags')}</span>
                        </a>
                      </li>
                      {this.tags && this.tags.length > 0
                        ? this.tags.map((tag) => (
                            <li
                              key={tag.id()}
                              className={
                                'TagLink ' +
                                (this.currentTagFilter === tag.slug() && !this.showingFavorites
                                  ? 'active item-allDiscussions'
                                  : 'item-allDiscussions')
                              }
                            >
                              <a
                                href={app.route('dependency-collector.forum.index', { tagSlug: tag.slug() })}
                                onclick={(e) => {
                                  e.preventDefault();
                                  if (this.currentTagFilter !== tag.slug() || this.showingFavorites) {
                                    m.route.set(app.route('dependency-collector.forum.index', { tagSlug: tag.slug() }));
                                  }
                                }}
                              >
                                {tag.icon() && <i className={tag.icon() + ' TagLink-icon'}></i>}
                                <span className="TagLink-name">{tag.name()}</span>
                              </a>
                            </li>
                          ))
                        : !this.loadingTags && ( // 如果不是加载中且没有标签
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

          <div className="IndexPage-results sideNavOffset DependencyListPage">
            <div className="DependencyListPage-body">
              {this.loadingItems && this.items.length === 0 ? (
                <LoadingIndicator />
              ) : (
                <div className="DependencyList">
                  {this.items && this.items.length > 0
                    ? this.items.map((item) => <DependencyItemCard item={item} key={item.id()} onchange={() => this.loadResults(0)} />)
                    : !this.loadingItems && <p>{app.translator.trans('shebaoting-dependency-collector.forum.list.empty_text')}</p>}
                </div>
              )}
              {this.moreResults && (
                <div style="text-align: center; margin-top: 10px;">
                  <Button className="Button" onclick={this.loadMore.bind(this)} loading={this.loadingMore}>
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

  loadResults(offset = 0) {
    if (offset === 0) {
      this.loadingItems = true;
      this.items = [];
      this.moreResults = false;
      m.redraw();
    } else {
      this.loadingMore = true;
      m.redraw();
    }

    const params = {
      page: { offset },
      sort: '-approvedAt',
      include: 'user,tags,approver,favoritedByUsers',
      filter: {},
    };

    if (this.showingFavorites) {
      params.filter.isFavorite = true;
    } else if (this.currentTagFilter) {
      params.filter.tag = this.currentTagFilter;
    }

    console.log('Loading results with params:', JSON.stringify(params));

    return app.store
      .find('dependency-items', params)
      .then((results) => {
        console.log('Results loaded:', results);
        if (Array.isArray(results)) {
          if (offset === 0) {
            this.items = results;
          } else {
            this.items.push(...results);
          }
          this.moreResults = !!results.payload?.links?.next;
          console.log('More results:', this.moreResults);
        } else {
          console.error('API did not return an array for dependency-items:', results);
          if (offset === 0) this.items = [];
          this.moreResults = false;
        }
      })
      .catch((error) => {
        console.error('Error loading dependency items:', error);
        if (offset === 0) this.items = [];
        this.moreResults = false;
        app.alerts.show({ type: 'error' }, app.translator.trans('shebaoting-dependency-collector.forum.list.load_error'));
      })
      .finally(() => {
        this.loadingItems = false;
        this.loadingMore = false;
        m.redraw();
        console.log('Loading finished, redraw called.');
      });
  }

  loadTags() {
    console.log('Attempting to load tags from API because store is empty.'); // 调试日志
    this.loadingTags = true;
    m.redraw(); // 确保加载状态立即反映

    app.store
      .find('dependency-tags', { sort: 'name' })
      .then((tags) => {
        console.log('Tags loaded from API:', tags);
        // store 会自动更新 app.store.all('dependency-tags')
        // 所以我们只需要更新组件内的 this.tags 即可
        this.tags = app.store.all('dependency-tags');
        if (!Array.isArray(this.tags)) {
          // 双重检查，以防 store 返回非数组
          console.error('app.store.all("dependency-tags") did not return an array after find:', this.tags);
          this.tags = [];
        }
      })
      .catch((error) => {
        console.error('Error loading tags:', error);
        this.tags = []; // 出错时也保证 this.tags 是空数组
        app.alerts.show({ type: 'error' }, app.translator.trans('shebaoting-dependency-collector.forum.list.load_tags_error'));
      })
      .finally(() => {
        this.loadingTags = false;
        // 再次从 store 获取，确保拿到最新的数据
        const storeTags = app.store.all('dependency-tags');
        this.tags = Array.isArray(storeTags) ? storeTags : [];
        m.redraw();
        console.log('Tag loading finished. Tags in component state:', this.tags);
      });
  }

  loadMore() {
    if (this.loadingItems || this.loadingMore) return;
    console.log('Loading more items...');
    this.loadResults(this.items.length);
  }

  onremove(vnode) {
    console.log('DependencyListPage onremove');
    super.onremove(vnode);
  }

  showMyFavorites() {
    // --- 修改: 当点击 "My Favorites" 时，如果当前不是 "My Favorites"，则切换路由 ---
    // 同时也应该确保，如果当前是某个标签的筛选，也切换到 "My Favorites"
    if (!this.showingFavorites) {
      m.route.set(app.route('dependency-collector.forum.index', { filter: 'favorites' }));
    } else if (this.showingFavorites && this.currentTagFilter) {
      // 如果当前是收藏夹但同时有标签过滤 (虽然你的UI可能不允许，但逻辑上可以处理)
      // 这种情况下，可能希望清除标签过滤，只看收藏夹
      m.route.set(app.route('dependency-collector.forum.index', { filter: 'favorites' }));
    }
    // --- 修改结束 ---
  }
}
