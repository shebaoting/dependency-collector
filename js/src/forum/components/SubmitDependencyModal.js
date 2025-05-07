import Modal from 'flarum/common/components/Modal';
import Button from 'flarum/common/components/Button';
import Stream from 'flarum/common/utils/Stream';
// Select 组件不再需要
// import Select from 'flarum/common/components/Select';
import classList from 'flarum/common/utils/classList'; // 用于动态添加 CSS 类

export default class SubmitDependencyModal extends Modal {
  oninit(vnode) {
    super.oninit(vnode);

    this.title = Stream('');
    this.link = Stream('');
    this.description = Stream('');
    this.selectedTagIds = Stream([]); // 仍然存储选中标签的 ID 数组

    this.availableTagsList = []; // 修改：存储标签对象的数组
    this.loadingTags = true;

    app.store
      .find('dependency-tags')
      .then((tags) => {
        // 修改：直接存储标签对象数组
        this.availableTagsList = Array.isArray(tags) ? tags : [];
        this.loadingTags = false;
        m.redraw();
      })
      .catch((error) => {
        console.error('Error loading tags for submit modal:', error);
        this.loadingTags = false;
        m.redraw();
      });
  }

  className() {
    return 'SubmitDependencyModal Modal--small';
  }

  title() {
    return app.translator.trans('shebaoting-dependency-collector.forum.modal.submit_title');
  }

  content() {
    return (
      <div className="Modal-body">
        <div className="Form Form--centered">
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.title_label')}</label>
            <input
              className="FormControl"
              bidi={this.title}
              placeholder={app.translator.trans('shebaoting-dependency-collector.forum.modal.title_placeholder')}
            />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.link_label')}</label>
            <input type="url" className="FormControl" bidi={this.link} placeholder="https://example.com" />
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.description_label')}</label>
            <textarea
              className="FormControl"
              bidi={this.description}
              rows="5"
              placeholder={app.translator.trans('shebaoting-dependency-collector.forum.modal.description_placeholder')}
            ></textarea>
          </div>
          <div className="Form-group">
            <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_label')}</label>
            {this.loadingTags ? (
              <p>{app.translator.trans('core.lib.loading_indicator_text')}</p>
            ) : (
              // --- 修改开始: 渲染平铺的标签 ---
              <div className="TagSelector">
                {this.availableTagsList.length > 0 ? (
                  this.availableTagsList.map((tag) => {
                    const isSelected = this.selectedTagIds().includes(tag.id());
                    return (
                      <Button
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
                  <p>{app.translator.trans('shebaoting-dependency-collector.forum.modal.no_tags_available')}</p> // 新增一个翻译条目
                )}
              </div>
              // --- 修改结束 ---
            )}
            <small>{app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_help')}</small>
          </div>
          <div className="Form-group">
            <Button type="submit" className="Button Button--primary Button--block" loading={this.loading} disabled={!this.isValid()}>
              {app.translator.trans('shebaoting-dependency-collector.forum.modal.submit_button')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // --- 新增方法：切换标签选中状态 ---
  toggleTag(tagId) {
    const currentSelected = [...this.selectedTagIds()]; // 创建副本以避免直接修改 Stream 的内部数组
    const index = currentSelected.indexOf(tagId);

    if (index > -1) {
      currentSelected.splice(index, 1); // 如果已选中，则移除
    } else {
      currentSelected.push(tagId); // 如果未选中，则添加
    }
    this.selectedTagIds(currentSelected);
  }
  // --- 新增方法结束 ---

  isValid() {
    const selectedTags = this.selectedTagIds();
    return this.title() && this.link() && this.description() && Array.isArray(selectedTags) && selectedTags.length > 0;
  }

  onsubmit(e) {
    e.preventDefault();
    this.loading = true;

    const currentSelectedTagIds = this.selectedTagIds() || [];

    if (!Array.isArray(currentSelectedTagIds)) {
      console.error('SubmitDependencyModal onsubmit: currentSelectedTagIds is NOT an array before map. Halting submission logic.');
      this.loading = false;
      m.redraw();
      return;
    }

    const relationships = {
      tags: currentSelectedTagIds
        .map((id) => {
          const tag = app.store.getById('dependency-tags', id);
          if (!tag) {
            console.warn(`Tag with ID ${id} not found in store.`);
          }
          return tag;
        })
        .filter((tag) => tag),
    };

    app.store
      .createRecord('dependency-items')
      .save({
        title: this.title(),
        link: this.link(),
        description: this.description(),
        relationships: relationships,
      })
      .then(() => {
        if (this.attrs.onsubmit) this.attrs.onsubmit();
        this.hide();
      })
      .catch((error) => {
        console.error('Error submitting dependency:', error);
        this.alertAttrs = error.alert;
      })
      .finally(() => {
        this.loading = false;
        m.redraw();
      });
  }
}
