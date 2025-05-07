import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import EditTagModal from './EditTagModal';
import ItemList from 'flarum/common/utils/ItemList';
import humanTime from 'flarum/common/utils/humanTime';

export default class DependencyCollectorSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
    this.loadingPending = true;
    this.loadingApproved = true;
    this.loadingTags = true;

    this.pendingItems = [];
    this.approvedItems = [];
    this.pluginTags = [];

    this.loadPendingItems();
    this.loadApprovedItems();
    this.loadPluginTags();
  }

  content() {
    return (
      <div className="DependencyCollectorSettingsPage">
        <div className="container">
          {this.pendingItemsSection()}
          {this.approvedItemsSection()}
          {this.pluginTagsSection()}
        </div>
      </div>
    );
  }

  pendingItemsSection() {
    return (
      <section className="PendingItemsSection">
        <h2>{app.translator.trans('shebaoting-dependency-collector.admin.page.pending_items_title')}</h2>
        {this.loadingPending ? (
          <LoadingIndicator />
        ) : this.pendingItems.length === 0 ? (
          <p>{app.translator.trans('shebaoting-dependency-collector.admin.page.no_pending_items')}</p>
        ) : (
          <table className="Table DependencyTable">
            <thead>
              <tr>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.title')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.submitted_by')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.submitted_at')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tags')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>{this.pendingItems.map((item) => this.itemRow(item, true))}</tbody>
          </table>
        )}
      </section>
    );
  }

  approvedItemsSection() {
    return (
      <section className="ApprovedItemsSection">
        <h2>{app.translator.trans('shebaoting-dependency-collector.admin.page.approved_items_title')}</h2>
        {this.loadingApproved ? (
          <LoadingIndicator />
        ) : this.approvedItems.length === 0 ? (
          <p>{app.translator.trans('shebaoting-dependency-collector.admin.page.no_approved_items')}</p>
        ) : (
          <table className="Table DependencyTable">
            <thead>
              <tr>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.title')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.approved_by')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.approved_at')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tags')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>{this.approvedItems.map((item) => this.itemRow(item, false))}</tbody>
          </table>
        )}
      </section>
    );
  }

  itemRow(item, isPending) {
    const submitter = item.user();
    const approver = item.approver();

    return (
      <tr key={item.id()}>
        <td>
          <a href={item.link()} target="_blank">
            {item.title()}
          </a>
          <br />
          <small>{item.description()}</small>
        </td>
        <td>{submitter ? submitter.username() : 'N/A'}</td>
        <td>{isPending ? humanTime(item.submittedAt()) : approver ? approver.username() : 'N/A'}</td>
        <td>
          {isPending
            ? item.tags()
              ? item
                  .tags()
                  .map((t) => t.name())
                  .join(', ')
              : ''
            : humanTime(item.approvedAt())}
        </td>
        <td>
          {isPending && (
            <Button className="Button Button--icon" icon="fas fa-edit" onclick={() => this.editItem(item, true)}>
              {app.translator.trans('core.admin.basics.edit_button')}
            </Button>
          )}
          {!isPending && (
            <Button className="Button Button--icon" icon="fas fa-edit" onclick={() => this.editItem(item, false)}>
              {app.translator.trans('core.admin.basics.edit_button')}
            </Button>
          )}
          {isPending && (
            <Button className="Button Button--icon Button--success" icon="fas fa-check" onclick={() => this.updateItemStatus(item, 'approved')}>
              {app.translator.trans('shebaoting-dependency-collector.admin.actions.approve')}
            </Button>
          )}
          {isPending && (
            <Button className="Button Button--icon Button--danger" icon="fas fa-times" onclick={() => this.updateItemStatus(item, 'rejected')}>
              {app.translator.trans('shebaoting-dependency-collector.admin.actions.reject')}
            </Button>
          )}
          <Button className="Button Button--icon Button--danger" icon="fas fa-trash" onclick={() => this.deleteItem(item, isPending)}>
            {app.translator.trans('core.admin.basics.delete_button')}
          </Button>
        </td>
      </tr>
    );
  }

  editItem(item, isPending) {
    alert('Edit functionality to be implemented. Item ID: ' + item.id());
  }

  updateItemStatus(item, status) {
    if (
      !confirm(
        app.translator.trans(
          status === 'approved' ? 'shebaoting-dependency-collector.admin.confirm.approve' : 'shebaoting-dependency-collector.admin.confirm.reject'
        ) + ` "${item.title()}"?`
      )
    )
      return;

    item
      .save({ status: status })
      .then(() => {
        this.loadPendingItems();
        this.loadApprovedItems();
        m.redraw();
      })
      .catch((e) => {
        console.error(e);
        alert('Error updating status.');
      });
  }

  deleteItem(item, isPendingList) {
    if (!confirm(app.translator.trans('shebaoting-dependency-collector.admin.confirm.delete') + ` "${item.title()}"?`)) return;

    item
      .delete()
      .then(() => {
        if (isPendingList) this.loadPendingItems();
        else this.loadApprovedItems();
        m.redraw();
      })
      .catch((e) => {
        console.error(e);
        alert('Error deleting item.');
      });
  }

  pluginTagsSection() {
    return (
      <section className="PluginTagsSection">
        <h2>{app.translator.trans('shebaoting-dependency-collector.admin.page.manage_tags_title')}</h2>
        <Button
          className="Button Button--primary"
          icon="fas fa-plus"
          onclick={() => app.modal.show(EditTagModal, { onsave: this.loadPluginTags.bind(this) })}
        >
          {app.translator.trans('shebaoting-dependency-collector.admin.actions.create_tag')}
        </Button>
        {this.loadingTags ? (
          <LoadingIndicator />
        ) : this.pluginTags.length === 0 ? (
          <p>{app.translator.trans('shebaoting-dependency-collector.admin.page.no_plugin_tags')}</p>
        ) : (
          <table className="Table PluginTagsTable">
            <thead>
              <tr>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_name')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_slug')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_color_icon')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_item_count')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {this.pluginTags.map((tag) => (
                <tr key={tag.id()}>
                  <td>{tag.name()}</td>
                  <td>{tag.slug()}</td>
                  <td>
                    {tag.color() && (
                      <span style={{ backgroundColor: tag.color(), padding: '2px 5px', color: 'white', borderRadius: '3px', marginRight: '5px' }}>
                        {tag.color()}
                      </span>
                    )}
                    {tag.icon() && <i className={tag.icon()}></i>}
                  </td>
                  <td>{tag.itemCount()}</td>
                  <td>
                    <Button
                      className="Button Button--icon"
                      icon="fas fa-edit"
                      onclick={() => app.modal.show(EditTagModal, { key: `edit-tag-${tag.id()}`, tag, onsave: this.loadPluginTags.bind(this) })}
                    />
                    <Button className="Button Button--icon Button--danger" icon="fas fa-trash" onclick={() => this.deleteTag(tag)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    );
  }

  loadPendingItems() {
    this.loadingPending = true;
    app.store.find('dependency-items', { filter: { status: 'pending' }, sort: '-submittedAt' }).then((items) => {
      this.pendingItems = items;
      this.loadingPending = false;
      m.redraw();
    });
  }

  loadApprovedItems() {
    this.loadingApproved = true;
    app.store.find('dependency-items', { filter: { status: 'approved' }, sort: '-approvedAt' }).then((items) => {
      this.approvedItems = items;
      this.loadingApproved = false;
      m.redraw();
    });
  }

  loadPluginTags() {
    this.loadingTags = true;
    app.store.find('dependency-tags', { sort: 'name' }).then((tags) => {
      this.pluginTags = tags;
      this.loadingTags = false;
      m.redraw();
    });
  }

  deleteTag(tag) {
    if (!confirm(app.translator.trans('shebaoting-dependency-collector.admin.confirm.delete_tag', { name: tag.name() }))) return;

    tag
      .delete()
      .then(() => {
        this.loadPluginTags();
        m.redraw();
      })
      .catch((e) => {
        console.error(e);
        alert('Error deleting tag.');
      });
  }
}
