// js/src/admin/components/EditTagModal.js

import Modal from 'flarum/admin/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import ColorPreviewInput from 'flarum/common/components/ColorPreviewInput';
import app from 'flarum/admin/app';

export default class EditTagModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);
    this.tag = this.attrs.tag || app.store.createRecord('dependency-tags');

    this.name = Stream(this.tag.name() || '');
    this.slug = Stream(this.tag.slug() || '');
    this.description = Stream(this.tag.description() || '');
    this.color = Stream(this.tag.color() || '#cccccc');
    this.icon = Stream(this.tag.icon() || '');

    this.alertAttrs = null;
  }

  className() {
    return 'EditTagModal Modal--small';
  }

  title() {
    return this.tag.exists
      ? app.translator.trans('shebaoting-dependency-collector.admin.modal.edit_tag_title', { name: this.tag.name() })
      : app.translator.trans('shebaoting-dependency-collector.admin.modal.create_tag_title');
  }

  content() {
    // 策略：移除 content() 内部所有元素的 key 属性，
    // 依赖 Mithril 对无 key 列表的处理。
    // Modal-body 和 Form 保持无 key。
    // 所有 Form-group 也保持无 key。
    // 对于 app.translator.trans 返回的数组，如果其内部的 <a> 也没有 key，
    // 那么整个子数组就是“无 key”的，这应该是允许的。
    return (
      <div className="Modal-body">
        <div className="Form">
          <div className="Form-group">
            {' '}
            {/* NO KEY */}
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_name_label')}</label>
            <input className="FormControl" bidi={this.name} />
          </div>
          <div className="Form-group">
            {' '}
            {/* NO KEY */}
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_slug_label')}</label>
            <input className="FormControl" bidi={this.slug} />
          </div>
          <div className="Form-group">
            {' '}
            {/* NO KEY */}
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_description_label')}</label>
            <textarea className="FormControl" bidi={this.description} rows="3"></textarea>
          </div>
          <div className="Form-group">
            {' '}
            {/* NO KEY */}
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_color_label')}</label>
            <ColorPreviewInput className="FormControl" bidi={this.color} />
          </div>
          <div className="Form-group">
            {' '}
            {/* NO KEY */}
            <label>{app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_icon_label')}</label>
            <input className="FormControl" bidi={this.icon} placeholder="fas fa-code" />
            <small>
              {' '}
              {/* NO KEY on small, and no key on inner <a> */}
              {app.translator.trans('shebaoting-dependency-collector.admin.modal.tag_icon_help', {
                link: (
                  <a href="https://fontawesome.com/icons" tabindex="-1" target="_blank">
                    Font Awesome
                  </a>
                ),
              })}
            </small>
          </div>
          <div className="Form-group">
            {' '}
            {/* NO KEY */}
            <Button type="submit" className="Button Button--primary" loading={this.loading} aria-label={app.translator.trans('core.lib.save_button')}>
              {app.translator.trans('core.lib.save_button')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  onsubmit(e) {
    e.preventDefault();
    this.loading = true;
    this.alertAttrs = null;

    this.tag
      .save({
        name: this.name(),
        slug: this.slug(),
        description: this.description(),
        color: this.color(),
        icon: this.icon(),
      })
      .then(() => {
        if (this.attrs.onsave) this.attrs.onsave();
        this.hide();
      })
      .catch((error) => {
        if (error.alert) {
          this.alertAttrs = error.alert;
        } else {
          console.error(error);
        }
      })
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }
}
