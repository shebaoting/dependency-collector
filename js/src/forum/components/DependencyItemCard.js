// js/src/forum/components/DependencyItemCard.js
import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
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
                  href={app.route('dependency-collector.forum.index', { tagSlug: tag.slug() })}
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
            {/* --- Actions: 添加删除按钮 --- */}
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

              {item.canDelete() && (
                <Button
                  className="Button Button--icon Button--link Button--danger" // 使用危险样式
                  icon="fas fa-trash-alt" // 删除图标
                  onclick={this.deleteItem.bind(this)} // 绑定删除方法
                  aria-label={app.translator.trans('shebaoting-dependency-collector.forum.item.delete_button_label')} // Aria 标签
                />
              )}

              {app.session.user &&
                item.canFavorite() && ( // 仅登录用户且有权限时显示
                  <Button
                    className={classList('Button Button--icon Button--link', item.isFavorited() && 'Button--favorited')} // 可以添加一个 .Button--favorited 类来改变样式
                    icon={item.isFavorited() ? 'fas fa-star' : 'far fa-star'} // 实心/空心星星
                    onclick={this.toggleFavorite.bind(this)}
                    aria-label={
                      item.isFavorited()
                        ? app.translator.trans('shebaoting-dependency-collector.forum.item.unfavorite_button_label') // 需要添加翻译
                        : app.translator.trans('shebaoting-dependency-collector.forum.item.favorite_button_label') // 需要添加翻译
                    }
                  />
                )}
            </div>
            {/* --- Action 结束 --- */}
          </div>
        </div>
      </div>
    );
  }

  editItem() {
    // 编辑逻辑保持不变
    app.modal.show(EditDependencyModal, { item: this.attrs.item, onsave: this.attrs.onchange });
  }

  toggleApproval() {
    // 批准/取消批准逻辑保持不变
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

  deleteItem() {
    const item = this.attrs.item;

    // --- 修改: 使用原生 confirm 替代 Flarum Modal ---
    // 显示原生 JavaScript 确认对话框
    const confirmed = window.confirm(
      // 从 locale 文件获取确认文本
      app.translator.trans('shebaoting-dependency-collector.forum.item.delete_confirmation_text')
    );

    // 只有当用户点击 "确定" 时 (confirmed 为 true)，才执行删除操作
    if (confirmed) {
      // 显示加载状态或禁用按钮可以在这里添加，但对于原生 confirm 比较困难，暂时省略
      // this.loading = true; // 如果有加载状态管理
      // m.redraw();

      item
        .delete()
        .then(() => {
          // 如果父组件提供了 onchange 回调 (例如列表页刷新), 调用它
          if (this.attrs.onchange) {
            this.attrs.onchange();
          }
          // 通常删除后需要重绘界面
          // 注意：如果 onchange 已经触发了列表页的重载，这里的 redraw 可能不需要
          // 但保留通常是安全的
          m.redraw();
        })
        .catch((error) => {
          console.error('Error deleting item:', error);
          // 显示错误提示
          app.alerts.show({ type: 'error' }, app.translator.trans('core.lib.error.generic_message'));
        })
        .finally(() => {
          // 结束加载状态（如果添加了）
          // this.loading = false;
          // m.redraw();
        });
    }
    // --- 修改结束 ---
  }

  getTextColorForBackground(hexColor) {
    // 此方法保持不变
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

  toggleFavorite() {
    const item = this.attrs.item;
    const wasFavorited = item.isFavorited();

    // 乐观更新UI
    item.pushData({
      attributes: { isFavorited: !wasFavorited },
      // 如果API返回完整的item，relationships 可能不需要在这里更新
    });
    m.redraw(); // 可能不需要，因为 save 也会触发重绘

    // 发起 API 请求
    app
      .request({
        method: 'POST',
        url: `${app.forum.attribute('apiUrl')}/dependency-items/${item.id()}/favorite`,
      })
      .then((response) => {
        // API 应该返回更新后的 item，store 会自动处理
        app.store.pushPayload(response);
        // 如果父组件有 onchange，可以调用
        if (this.attrs.onchange) {
          this.attrs.onchange();
        }
      })
      .catch((error) => {
        // API 请求失败，回滚乐观更新
        item.pushData({
          attributes: { isFavorited: wasFavorited },
        });
        m.redraw();
        // 显示错误提示
        app.alerts.show({ type: 'error' }, app.translator.trans('core.lib.error.generic_message'));
        throw error; // 重新抛出错误，以便上层可以捕获（如果需要）
      });
  }
}
