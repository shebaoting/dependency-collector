import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import DependencyItemCard from './DependencyItemCard';
import listItems from 'flarum/common/helpers/listItems';
import Link from 'flarum/common/components/Link'; // For tag links
import SubmitDependencyModal from './SubmitDependencyModal'; // We'll create this

export default class DependencyListPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);
    this.loading = true;
    this.items = [];
    this.tags = []; // To store available plugin tags for filtering
    this.moreResults = false;
    this.currentTagFilter = m.route.param('filter') && m.route.param('filter').tag; // Get tag from route

    this.loadResults();
    this.loadTags(); // For filter sidebar
  }

  view() {
    return (
      <div className="DependencyListPage">
        <div className="DependencyListPage-header">
          {/* Optional: Add sorting dropdown here */}
          {app.session.user &&
            app.forum.attribute('canSubmitDependencyCollectorItem') && ( // Check permission
              <Button
                className="Button Button--primary App-primaryControl"
                onclick={() => app.modal.show(SubmitDependencyModal, { onsubmit: this.loadResults.bind(this) })}
              >
                {app.translator.trans('shebaoting-dependency-collector.forum.list.submit_button')}
              </Button>
            )}
        </div>
        <div className="DependencyListPage-body">
          <div className="DependencyListPage-sidebar">
            <h3>{app.translator.trans('shebaoting-dependency-collector.forum.list.filter_by_tag')}</h3>
            <ul className="DependencyListTags">
              <li className={!this.currentTagFilter ? 'active' : ''}>
                <Link href={app.route('dependency-collector.forum.index')}>
                  {app.translator.trans('shebaoting-dependency-collector.forum.list.all_tags')}
                </Link>
              </li>
              {this.tags.map((tag) => (
                <li key={tag.id()} className={this.currentTagFilter === tag.slug() ? 'active' : ''}>
                  <Link href={app.route('dependency-collector.forum.index', { filter: { tag: tag.slug() } })}>
                    {tag.icon() && <i className={tag.icon() + ' DependencyListTag-icon'}></i>}
                    {tag.name()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="DependencyListPage-content">
            {this.loading && this.items.length === 0 ? (
              <LoadingIndicator />
            ) : (
              <div className="DependencyList">
                {this.items.map((item) => (
                  <DependencyItemCard item={item} key={item.id()} />
                ))}
              </div>
            )}

            {!this.loading && this.items.length === 0 && <p>{app.translator.trans('shebaoting-dependency-collector.forum.list.empty_text')}</p>}

            {this.moreResults && !this.loading && (
              <Button className="Button" onclick={this.loadMore.bind(this)}>
                {app.translator.trans('core.forum.discussion_list.load_more_button')}
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  loadResults(offset = 0) {
    this.loading = true;
    m.redraw(); // Inform Mithril about the change

    const params = {
      page: { offset },
      sort: '-approvedAt', // Default sort
      // include: 'user,tags,approver' // Already default in controller
    };

    if (this.currentTagFilter) {
      params.filter = { tag: this.currentTagFilter };
    }

    return app.store
      .find('dependency-items', params)
      .then((results) => {
        if (offset === 0) {
          this.items = [];
        }
        this.items.push(...results);
        this.moreResults = !!results.payload.links && !!results.payload.links.next;
      })
      .catch((error) => {
        // Handle error
        console.error(error);
      })
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }

  loadTags() {
    app.store.find('dependency-tags').then((tags) => {
      this.tags = tags;
      m.redraw();
    });
  }

  loadMore() {
    this.loadResults(this.items.length);
  }

  onremove(vnode) {
    super.onremove(vnode);
    // Clean up listeners or other resources if any
  }
}
