// js/src/forum/components/DependencyItemCard.js
import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link'; // Link 组件在这里使用
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import humanTime from 'flarum/common/utils/humanTime';
import classList from 'flarum/common/utils/classList';
import Button from 'flarum/common/components/Button';
import EditDependencyModal from './EditDependencyModal';

export default class DependencyItemCard extends Component {
  view() {
    const item = this.attrs.item;
    const user = item.user();

    return (
      <div className={classList('DependencyItemCard', item.status() === 'pending' && 'DependencyItemCard--pending')}>
        {/* Status badge logic... */}
        {item.status() === 'pending' && app.session.user && (app.session.user.id() === item.user()?.id() || item.canApprove()) && (
          <span className="DependencyItemCard-statusBadge">
            {app.translator.trans('shebaoting-dependency-collector.forum.item.pending_approval')}
          </span>
        )}

        <div className="DependencyItemCard-header">
          {/* Title link... */}
          <h3 className="DependencyItemCard-title">
            <a href={item.link()} target="_blank" rel="noopener noreferrer">
              {item.title()}
            </a>
          </h3>
        </div>
        <div className="DependencyItemCard-body">
          {/* Description... */}
          <p className="DependencyItemCard-description">{item.shortDescription(150)}</p>
        </div>
        <div className="DependencyItemCard-footer">
          <div className="DependencyItemCard-tags">
            {item.tags() &&
              item.tags().map((tag) => (
                <Link
                  key={tag.id()}
                  className="DependencyItemCard-tag"
                  // --- 核心修改在这里 ---
                  // 将路由参数键名从 'tag' (如果之前是错误的) 改为 'tagSlug'
                  href={app.route('dependency-collector.forum.index', { tagSlug: tag.slug() })}
                  // --- 修改结束 ---
                  style={{ backgroundColor: tag.color(), color: this.getTextColorForBackground(tag.color()) }}
                >
                  {tag.icon() && <i className={tag.icon() + ' DependencyItemCard-tagIcon'}></i>}
                  {tag.name()}
                </Link>
              ))}
          </div>
          <div className="DependencyItemCard-meta">
            {/* Submitter info... */}
            {user && (
              <span className="DependencyItemCard-submitter">
                {avatar(user, { className: 'DependencyItemCard-avatar' })}
                {username(user)}
              </span>
            )}
            {/* Time... */}
            <span className="DependencyItemCard-time" title={item.submittedAt().toLocaleString()}>
              {humanTime(item.submittedAt())}
            </span>
            {/* Actions... */}
            <div className="DependencyItemCard-actions">
              {item.canEdit() && (
                <Button
                  className="Button Button--icon Button--link"
                  icon="fas fa-pencil-alt"
                  onclick={this.editItem.bind(this)}
                  aria-label={app.translator.trans('core.forum.post_controls.edit_button')}
                />
              )}
              {item.canApprove() && (
                <Button
                  className={classList('Button Button--icon Button--link', item.status() === 'approved' ? 'Button--danger' : 'Button--success')}
                  icon={item.status() === 'approved' ? 'fas fa-times' : 'fas fa-check'}
                  onclick={this.toggleApproval.bind(this)}
                  aria-label={
                    item.status() === 'approved'
                      ? app.translator.trans('shebaoting-dependency-collector.forum.item.unapprove_button')
                      : app.translator.trans('shebaoting-dependency-collector.forum.item.approve_button')
                  }
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // editItem, toggleApproval, getTextColorForBackground 方法保持不变...
  editItem() {
    app.modal.show(EditDependencyModal, { item: this.attrs.item, onsave: this.attrs.onchange });
  }

  toggleApproval() {
    const item = this.attrs.item;
    const newStatus = item.status() === 'approved' ? 'pending' : 'approved';

    item
      .save({ status: newStatus })
      .then(() => {
        if (this.attrs.onchange) this.attrs.onchange();
        m.redraw();
      })
      .catch((error) => {
        console.error('Error toggling approval status:', error);
      });
  }

  getTextColorForBackground(hexColor) {
    if (!hexColor) return 'white';
    hexColor = hexColor.replace('#', '');
    if (hexColor.length === 3) {
      hexColor = hexColor[0].repeat(2) + hexColor[1].repeat(2) + hexColor[2].repeat(2);
    }
    if (hexColor.length !== 6) {
      return 'white'; // Fallback for invalid color
    }
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
