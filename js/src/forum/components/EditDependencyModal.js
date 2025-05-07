// js/src/forum/components/EditDependencyModal.js

import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
import classList from 'flarum/common/utils/classList';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';

export default class EditDependencyModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.item = this.attrs.item; // 获取要编辑的 item

    this.title = Stream(this.item.title());
    this.link = Stream(this.item.link());
    this.description = Stream(this.item.description());
    // 初始化选中的标签 ID 列表
    this.selectedTagIds = Stream(this.item.tags() ? this.item.tags().map((tag) => tag.id()) : []);

    this.availableTagsList = [];
    this.loadingTags = true;
    this.loadAvailableTags();

    this.alertAttrs = null; // 用于显示错误
  }

  className() {
    return 'EditDependencyModal Modal--small'; // 可以给编辑弹窗不同的类名
  }

  title() {
    // 可以为编辑弹窗设置一个不同的标题
    return app.translator.trans('shebaoting-dependency-collector.forum.modal.edit_title', { title: this.item.title() }); // 需要添加翻译
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form Form--centered">
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.title_label')}</label>
            <input className="FormControl" bidi={this.title} />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.link_label')}</label>
            <input type="url" className="FormControl" bidi={this.link} />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.description_label')}</label>
            <textarea className="FormControl" bidi={this.description} rows="5"></textarea>
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_label')}</label>
            {this.loadingTags ? (
              <LoadingIndicator />
            ) : (
              <div className="TagSelector">
                {this.availableTagsList.length > 0 ? (
                  this.availableTagsList.map((tag) => {
                    const isSelected = this.selectedTagIds().includes(tag.id());
                    return (
                      <Button
                        key={tag.id()} // 添加 key
                        className={classList('Button Button--tag', isSelected && 'active')}
                        icon={tag.icon()}
                        style={
                          isSelected
                            ? { backgroundColor: tag.color() || '#4D698E', color: 'white' }
                            : { borderColor: tag.color() || '#ddd', color: tag.color() || 'inherit' }
                        }
                        onclick={() => this.toggleTag(tag.id())}
                      >
                        {tag.name()}
                      </Button>
                    );
                  })
                ) : (
                  <p>{/* 可能需要一个“无可用标签”的提示 */}</p>
                )}
              </div>
            )}
            <small>{app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_help')}</small>
          </div>
          <div className="Form-group">
            <Button
              type="submit"
              className="Button Button--primary Button--block"
              loading={this.loading}
              disabled={!this.isDirty() || !this.isValid()}
            >
              {app.translator.trans('core.lib.save_changes_button')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  loadAvailableTags() {
    app.store
      .find('dependency-tags')
      .then((tags) => {
        this.availableTagsList = tags;
        this.loadingTags = false;
        m.redraw();
      })
      .catch((error) => {
        console.error('Error loading tags for edit modal:', error);
        this.loadingTags = false;
        m.redraw();
      });
  }

  toggleTag(tagId) {
    const currentSelected = [...this.selectedTagIds()];
    const index = currentSelected.indexOf(tagId);
    if (index > -1) {
      currentSelected.splice(index, 1);
    } else {
      currentSelected.push(tagId);
    }
    this.selectedTagIds(currentSelected);
  }

  // 检查表单是否有效（例如，标签不能为空）
  isValid() {
    const selectedTags = this.selectedTagIds();
    return this.title() && this.link() && this.description() && Array.isArray(selectedTags) && selectedTags.length > 0;
  }

  // 检查是否有任何更改
  isDirty() {
    const currentTagIds = this.item.tags() ? this.item.tags().map((tag) => tag.id()) : [];
    const selectedTagIds = this.selectedTagIds();
    // 比较数组需要排序
    const tagsChanged = JSON.stringify([...currentTagIds].sort()) !== JSON.stringify([...selectedTagIds].sort());

    return this.title() !== this.item.title() || this.link() !== this.item.link() || this.description() !== this.item.description() || tagsChanged;
  }

  onsubmit(e) {
    e.preventDefault();
    if (!this.isDirty()) {
      this.hide(); // 如果没有更改，直接关闭
      return;
    }
    this.loading = true;
    this.alertAttrs = null; // 清除之前的错误

    const relationships = {
      tags: this.selectedTagIds()
        .map((id) => app.store.getById('dependency-tags', id))
        .filter((tag) => tag),
    };

    this.item
      .save({
        title: this.title(),
        link: this.link(),
        description: this.description(),
        relationships: relationships,
      })
      .then(() => {
        if (this.attrs.onsave) this.attrs.onsave(); // 如果父组件提供了回调
        this.hide(); // 保存成功后关闭
      })
      .catch((error) => {
        console.error('Error updating dependency:', error);
        this.alertAttrs = error.alert; // 显示 API 返回的错误
      })
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }
}
