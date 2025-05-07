// js/src/admin/components/DependencyCollectorSettingsPage.js

import ExtensionPage from 'flarum/admin/components/ExtensionPage';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import EditTagModal from './EditTagModal';
import { alert } from 'flarum/common/utils/Alert';
import withAttr from 'flarum/common/utils/withAttr';

export default class DependencyCollectorSettingsPage extends ExtensionPage {
  oninit(vnode) {
    super.oninit(vnode);
    this.loadingTags = true;
    this.pluginTags = [];
    this.loadPluginTags();
    this.editingTagId = null;
    this.editingField = null;
    this.editValue = '';
    this.savingTagId = null;
  }

  content() {
    return (
      <div className="DependencyCollectorSettingsPage">
        <div className="container">{this.pluginTagsSection()}</div>
      </div>
    );
  }

  pluginTagsSection() {
    return (
      <section className="PluginTagsSection">
        <div className="Page-header">
          <h2>{app.translator.trans('shebaoting-dependency-collector.admin.page.manage_tags_title')}</h2>
          <Button
            className="Button Button--primary"
            icon="fas fa-plus"
            onclick={() => app.modal.show(EditTagModal, { key: 'new-tag', onsave: this.loadPluginTags.bind(this) })}
          >
            {app.translator.trans('shebaoting-dependency-collector.admin.actions.create_tag')}
          </Button>
        </div>
        {this.loadingTags ? (
          <LoadingIndicator />
        ) : this.pluginTags.length === 0 ? (
          <p>{app.translator.trans('shebaoting-dependency-collector.admin.page.no_plugin_tags')}</p>
        ) : (
          <table className="Table PluginTagsTable">
            <thead>
              <tr>
                {/* --- 修改表头 --- */}
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_name')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_slug')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_color')}</th> {/* 修改 */}
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_icon')}</th> {/* 新增 */}
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.tag_item_count')}</th>
                <th>{app.translator.trans('shebaoting-dependency-collector.admin.table.actions')}</th>
                {/* --- 表头修改结束 --- */}
              </tr>
            </thead>
            <tbody>
              {this.pluginTags.map((tag) => (
                <tr key={tag.id()} className={this.savingTagId === tag.id() ? 'saving' : ''}>
                  {/* 名称 - 可编辑 */}
                  <td onclick={() => this.startEditing(tag, 'name')}>
                    {this.isEditing(tag, 'name') ? this.renderInput(tag, 'name', 'text') : tag.name()}
                  </td>
                  {/* Slug - 可编辑 */}
                  <td onclick={() => this.startEditing(tag, 'slug')}>
                    {this.isEditing(tag, 'slug') ? this.renderInput(tag, 'slug', 'text') : tag.slug()}
                  </td>
                  {/* --- 颜色列 --- */}
                  <td onclick={() => this.startEditing(tag, 'color')}>
                    {
                      this.isEditing(tag, 'color') ? (
                        this.renderInput(tag, 'color', 'text', '#RRGGBB') // 使用 renderInput 辅助方法
                      ) : tag.color() ? (
                        <span
                          style={{
                            backgroundColor: tag.color(),
                            padding: '2px 5px',
                            color: this.getTextColorForBackground(tag.color()),
                            borderRadius: '3px',
                            cursor: 'pointer',
                          }}
                        >
                          {tag.color()}
                        </span>
                      ) : (
                        <span style="cursor: pointer; color: #aaa;">(none)</span>
                      ) // 提供无颜色时的点击区域
                    }
                  </td>
                  {/* --- 图标列 --- */}
                  <td onclick={() => this.startEditing(tag, 'icon')}>
                    {this.isEditing(tag, 'icon') ? (
                      this.renderInput(tag, 'icon', 'text', 'fas fa-tag') // 使用 renderInput 辅助方法
                    ) : tag.icon() ? (
                      <i className={tag.icon()} style="cursor: pointer;"></i>
                    ) : (
                      <span style="cursor: pointer; color: #aaa;">(none)</span>
                    )}
                  </td>
                  {/* --- 列拆分结束 --- */}
                  {/* 条目数 - 不可编辑 */}
                  <td>{tag.itemCount() !== undefined ? tag.itemCount() : 'N/A'}</td>
                  {/* 操作 - 只保留删除 */}
                  <td>
                    <Button
                      className="Button Button--icon Button--danger"
                      icon="fas fa-trash"
                      onclick={() => this.deleteTag(tag)}
                      aria-label={app.translator.trans('shebaoting-dependency-collector.admin.actions.delete_button')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    );
  }

  // --- 新增：渲染内联输入框的辅助方法 ---
  renderInput(tag, field, type = 'text', placeholder = '') {
    return (
      <input
        className="FormControl FormControl--inline"
        type={type}
        value={this.editValue}
        placeholder={placeholder}
        oninput={withAttr('value', (val) => (this.editValue = val))}
        onblur={(e) => this.saveEdit(tag, field, e.target.value)}
        onkeydown={(e) => this.handleKeyDown(e, tag, field, e.target.value)}
        onupdate={(vnode) => this.focusInput(vnode)}
      />
    );
  }

  // isEditing 方法保持不变
  isEditing(tag, field) {
    return this.editingTagId === tag.id() && this.editingField === field;
  }

  // startEditing 方法保持不变
  startEditing(tag, field) {
    if (this.savingTagId) return;
    this.editingTagId = tag.id();
    this.editingField = field;
    this.editValue = tag[field]() || '';
    m.redraw();
  }

  // focusInput 方法保持不变
  focusInput(vnode) {
    if (vnode.dom && typeof vnode.dom.focus === 'function') {
      setTimeout(() => vnode.dom.focus(), 0);
    }
  }

  // handleKeyDown 方法保持不变
  handleKeyDown(event, tag, field, value) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.saveEdit(tag, field, value);
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
    event.redraw = false;
  }

  // saveEdit 方法保持不变
  saveEdit(tag, field, value) {
    if (this.savingTagId === tag.id()) {
      console.log('Save already in progress for tag:', tag.id());
      return;
    }

    if (value === (tag[field]() || '')) {
      this.cancelEdit();
      return;
    }

    this.savingTagId = tag.id();
    m.redraw();

    const attributesToSave = { [field]: value };
    console.log('Data being passed to tag.save():', attributesToSave);

    tag
      .save(attributesToSave)
      .then(() => {
        console.log('Tag saved successfully.');
        this.cancelEdit();
      })
      .catch((error) => {
        console.error(`Error saving tag ${tag.id()} field ${field}:`, error);
        let errorDetail = app.translator.trans('core.lib.error.generic_message');
        if (error.response?.errors?.length > 0) {
          const fieldError = error.response.errors.find((e) => e.source?.pointer === `/data/attributes/${field}`);
          errorDetail = fieldError?.detail || error.response.errors[0].detail || errorDetail;
        }
        alert.component({ type: 'error' }, errorDetail);

        this.savingTagId = null;
        m.redraw();
      });
  }

  // cancelEdit 方法保持不变
  cancelEdit() {
    this.editingTagId = null;
    this.editingField = null;
    this.editValue = '';
    this.savingTagId = null;
    m.redraw();
  }

  // loadPluginTags 方法保持不变
  loadPluginTags() {
    this.loadingTags = true;
    // 确保请求包含 itemCount (如果后端支持 sort=itemCount 或 include=itemCount)
    // 否则依赖 serializer 计算
    app.store
      .find('dependency-tags', { sort: 'name' })
      .then((tags) => {
        this.pluginTags = tags;
        this.loadingTags = false;
        m.redraw();
      })
      .catch(() => {
        this.loadingTags = false;
        m.redraw();
      });
  }

  // deleteTag 方法保持不变
  deleteTag(tag) {
    if (this.savingTagId === tag.id()) return;
    if (!confirm(app.translator.trans('shebaoting-dependency-collector.admin.confirm.delete_tag', { name: tag.name() }))) return;

    tag
      .delete()
      .then(() => {
        this.pluginTags = this.pluginTags.filter((t) => t.id() !== tag.id());
        m.redraw();
      })
      .catch((e) => {
        console.error(e);
        alert.component({ type: 'error' }, 'Error deleting tag.');
      });
  }

  // getTextColorForBackground 方法保持不变
  getTextColorForBackground(hexColor) {
    if (!hexColor) return 'white';
    hexColor = hexColor.replace('#', '');
    if (hexColor.length === 3) {
      hexColor = hexColor[0].repeat(2) + hexColor[1].repeat(2) + hexColor[2].repeat(2);
    }
    if (hexColor.length !== 6) {
      return 'white';
    }
    const r = parseInt(hexColor.substr(0, 2), 16);
    const g = parseInt(hexColor.substr(2, 2), 16);
    const b = parseInt(hexColor.substr(4, 2), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}
