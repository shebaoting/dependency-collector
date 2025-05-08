### 文件路径: `composer.json`

```json
{
    "name": "shebaoting/dependency-collector",
    "description": "Collects and displays information about Flarum extensions and their dependencies",
    "keywords": [
        "flarum"
    ],
    "type": "flarum-extension",
    "license": "MIT",
    "require": {
        "flarum/core": "^1.2.0"
    },
    "authors": [
        {
            "name": "Shebaoting",
            "email": "th9th@th9th.com",
            "role": "Developer"
        }
    ],
    "autoload": {
        "psr-4": {
            "Shebaoting\\DependencyCollector\\": "src/"
        }
    },
    "extra": {
        "flarum-extension": {
            "title": "Dependency Collector",
            "category": "",
            "icon": {
                "name": "",
                "color": "",
                "backgroundColor": ""
            }
        },
        "flarum-cli": {
            "modules": {
                "admin": true,
                "forum": true,
                "js": true,
                "jsCommon": true,
                "css": true,
                "locale": true,
                "gitConf": true,
                "githubActions": true,
                "prettier": true,
                "typescript": true,
                "bundlewatch": false,
                "backendTesting": true,
                "editorConfig": true,
                "styleci": true
            }
        }
    },
    "minimum-stability": "dev",
    "prefer-stable": true,
    "autoload-dev": {
        "psr-4": {
            "Shebaoting\\DependencyCollector\\Tests\\": "tests/"
        }
    },
    "scripts": {
        "test": [
            "@test:unit",
            "@test:integration"
        ],
        "test:unit": "phpunit -c tests/phpunit.unit.xml",
        "test:integration": "phpunit -c tests/phpunit.integration.xml",
        "test:setup": "@php tests/integration/setup.php"
    },
    "scripts-descriptions": {
        "test": "Runs all tests.",
        "test:unit": "Runs all unit tests.",
        "test:integration": "Runs all integration tests.",
        "test:setup": "Sets up a database for use with integration tests. Execute this only once."
    },
    "require-dev": {
        "flarum/testing": "^1.0.0"
    }
}
```

### 文件路径: `extend.php`

```php
<?php

/*
 * This file is part of shebaoting/dependency-collector.
 *
 * Copyright (c) 2025 Shebaoting.
 *
 * For the full copyright and license information, please view the LICENSE.md
 * file that was distributed with this source code.
 */

namespace Shebaoting\DependencyCollector;

use Flarum\Extend;
use Flarum\Api\Serializer\ForumSerializer; // 用于暴露权限给前端
use Flarum\Group\Group; // 用于设置默认权限
use Shebaoting\DependencyCollector\Api\Controller; // 你的 API 控制器命名空间
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Access\DependencyItemPolicy; // 你的 Policy 类

return [
    // 论坛前端设置
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')    // 注册论坛 JavaScript 文件
        ->css(__DIR__ . '/less/forum.less')   // 注册论坛 LESS/CSS 文件
        ->route('/dependencies', 'dependency-collector.forum.index'), // 注册依赖项展示页面的前端路由

    // 管理后台前端设置
    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js')    // 注册管理后台 JavaScript 文件
        ->css(__DIR__ . '/less/admin.less'),  // 注册管理后台 LESS/CSS 文件

    // API 路由设置
    (new Extend\Routes('api'))
        // Dependency Items
        ->get('/dependency-items', 'dependency-collector.items.index', Controller\ListDependencyItemsController::class)
        ->post('/dependency-items', 'dependency-collector.items.create', Controller\CreateDependencyItemController::class)
        ->patch('/dependency-items/{id}', 'dependency-collector.items.update', Controller\UpdateDependencyItemController::class)
        ->delete('/dependency-items/{id}', 'dependency-collector.items.delete', Controller\DeleteDependencyItemController::class)

        // Dependency Tags
        ->get('/dependency-tags', 'dependency-collector.tags.index', Controller\ListDependencyTagsController::class)
        ->post('/dependency-tags', 'dependency-collector.tags.create', Controller\CreateDependencyTagController::class)
        ->patch('/dependency-tags/{id}', 'dependency-collector.tags.update', Controller\UpdateDependencyTagController::class)
        ->delete('/dependency-tags/{id}', 'dependency-collector.tags.delete', Controller\DeleteDependencyTagController::class),

    // 国际化语言文件设置
    (new Extend\Locales(__DIR__ . '/locale')),

    // 权限策略设置
    (new Extend\Policy())
        ->modelPolicy(DependencyItem::class, DependencyItemPolicy::class), // 为 DependencyItem 模型注册权限策略

    // 视图设置 (如果你的权限有自定义的描述文本，可能会用到)
    // (new Extend\View())
    //    ->namespace('dependency-collector.admin.permissions', __DIR__ . '/views/admin/permissions'),

    // 默认权限授予
    // (new Extend\Permissions())
    //     ->grant('dependency-collector.submit', Group::MEMBER_ID) // 默认允许“成员”用户组提交依赖项
    //     ->grant('dependency-collector.moderate', Group::MODERATOR_ID) // 默认允许“版主”审核
    //     ->grant('dependency-collector.moderate', Group::ADMINISTRATOR_ID) // 默认允许“管理员”审核
    //     ->grant('dependency-collector.manageTags', Group::ADMINISTRATOR_ID), // 默认只允许“管理员”管理插件标签

    // 将 canSubmitDependencyCollectorItem 权限暴露给论坛前端
    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('canSubmitDependencyCollectorItem', function ($serializer, $model, $attributes) {
            return $serializer->getActor()->hasPermission('dependency-collector.submit');
        }),
];
```

### 文件路径: `js\admin.ts`

```typescript
export * from './src/common';
export * from './src/admin';
```

### 文件路径: `js\forum.ts`

```typescript
export * from './src/common';
export * from './src/forum';
```

### 文件路径: `js\package.json`

```json
{
    "name": "@shebaoting/dependency-collector",
    "private": true,
    "version": "0.0.0",
    "devDependencies": {
        "flarum-webpack-config": "^2.0.0",
        "webpack": "^5.65.0",
        "webpack-cli": "^4.9.1",
        "prettier": "^2.5.1",
        "@flarum/prettier-config": "^1.0.0",
        "flarum-tsconfig": "^1.0.2",
        "typescript": "^4.5.4",
        "typescript-coverage-report": "^0.6.1"
    },
    "scripts": {
        "dev": "webpack --mode development --watch",
        "build": "webpack --mode production",
        "analyze": "cross-env ANALYZER=true yarn run build",
        "format": "prettier --write src",
        "format-check": "prettier --check src",
        "clean-typings": "npx rimraf dist-typings && mkdir dist-typings",
        "build-typings": "yarn run clean-typings && ([ -e src/@types ] && cp -r src/@types dist-typings/@types || true) && tsc && yarn run post-build-typings",
        "post-build-typings": "find dist-typings -type f -name '*.d.ts' -print0 | xargs -0 sed -i 's,../src/@types,@types,g'",
        "check-typings": "tsc --noEmit --emitDeclarationOnly false",
        "check-typings-coverage": "typescript-coverage-report"
    },
    "prettier": "@flarum/prettier-config",
    "packageManager": "yarn@1.22.22+sha512.a6b2f7906b721bba3d67d4aff083df04dad64c399707841b7acf00f6b133b7ac24255f2652fa22ae3534329dc6180534e98d17432037ff6fd140556e2bb3137e"
}
```

### 文件路径: `js\src\admin\index.ts`

```typescript
import app from 'flarum/admin/app';
import DependencyCollectorSettingsPage from './components/DependencyCollectorSettingsPage'; // We will create this
import DependencyItem from '../common/models/DependencyItem'; // If needed in admin
import DependencyTag from '../common/models/DependencyTag'; // If needed in admin

app.initializers.add('shebaoting-dependency-collector-admin', () => {
  app.store.models['dependency-items'] = DependencyItem;
  app.store.models['dependency-tags'] = DependencyTag;

  // Register your extension page
  app.extensionData
    .for('shebaoting-dependency-collector')
    .registerPage(DependencyCollectorSettingsPage)
    .registerPermission(
      {
        icon: 'fas fa-pencil-alt', // Example icon
        label: app.translator.trans('shebaoting-dependency-collector.admin.permissions.submit_label'),
        permission: 'dependency-collector.submit',
      },
      'start' // Permission group: start, moderate, etc.
    )
    .registerPermission(
      {
        icon: 'fas fa-check-double',
        label: app.translator.trans('shebaoting-dependency-collector.admin.permissions.moderate_label'),
        permission: 'dependency-collector.moderate',
        allowGuest: false, // Example: Don't allow guests
      },
      'moderate'
    )
    .registerPermission(
      {
        icon: 'fas fa-tags',
        label: app.translator.trans('shebaoting-dependency-collector.admin.permissions.manage_tags_label'),
        permission: 'dependency-collector.manageTags',
      },
      'moderate' // Or a new group like 'manage'
    );
  // Add more permissions as needed
});
```

### 文件路径: `js\src\admin\components\DependencyCollectorSettingsPage.js`

```javascript
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
```

### 文件路径: `js\src\admin\components\EditTagModal.js`

```javascript
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
```

### 文件路径: `js\src\common\index.ts`

```typescript
import app from 'flarum/common/app';

app.initializers.add('shebaoting/dependency-collector', () => {
  console.log('[shebaoting/dependency-collector] Hello, forum and admin!');
});
```

### 文件路径: `js\src\common\models\DependencyItem.js`

```javascript
// js/src/common/models/DependencyItem.js
import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin';
import { getPlainContent } from 'flarum/common/utils/string';

export default class DependencyItem extends Model {
  title = Model.attribute('title');
  link = Model.attribute('link');
  description = Model.attribute('description');
  status = Model.attribute('status'); // 确保 status 属性存在
  submittedAt = Model.attribute('submittedAt', Model.transformDate);
  approvedAt = Model.attribute('approvedAt', Model.transformDate);

  user = Model.hasOne('user');
  approver = Model.hasOne('approver');
  tags = Model.hasMany('tags');

  canEdit = Model.attribute('canEdit'); // 确保 canEdit 属性存在
  canApprove = Model.attribute('canApprove'); // 确保 canApprove 属性存在

  shortDescription(length = 100) {
    const desc = this.description();
    if (!desc) return '';
    return getPlainContent(desc).substring(0, length) + (desc.length > length ? '...' : '');
  }
}
```

### 文件路径: `js\src\common\models\DependencyTag.js`

```javascript
import Model from 'flarum/common/Model';

export default class DependencyTag extends Model {
  name = Model.attribute('name');
  slug = Model.attribute('slug');
  description = Model.attribute('description');
  color = Model.attribute('color');
  icon = Model.attribute('icon');
  createdAt = Model.attribute('createdAt', Model.transformDate);
  updatedAt = Model.attribute('updatedAt', Model.transformDate);
  itemCount = Model.attribute('itemCount');

  canEdit = Model.attribute('canEdit');
}
```

### 文件路径: `js\src\forum\index.ts`

```typescript
import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import IndexPage from 'flarum/forum/components/IndexPage';
import LinkButton from 'flarum/common/components/LinkButton';

import DependencyItem from '../common/models/DependencyItem';
import DependencyTag from '../common/models/DependencyTag';
import DependencyListPage from './components/DependencyListPage';

// 确保 app 对象在全局可用 (Flarum 通常会处理这个)
// declare global {
//   const app: any;
// }

app.initializers.add('shebaoting/dependency-collector', () => {
  console.log('[shebaoting/dependency-collector] Initializing forum extension.');

  // 1. 注册前端模型
  // 'dependency-items' 必须与 DependencyItemSerializer.php 中定义的 $type 匹配
  app.store.models['dependency-items'] = DependencyItem;
  // 'dependency-tags' 必须与 DependencyTagSerializer.php 中定义的 $type 匹配
  app.store.models['dependency-tags'] = DependencyTag;

  // 2. 注册前端路由
  // 'dependency-collector.forum.index' 是你在后端 extend.php 中为前端路由定义的名称
  // '/dependencies' 是该路由的路径
  app.routes['dependency-collector.forum.index'] = {
    path: '/dependencies',
    component: DependencyListPage,
  };

  // 3. 在论坛侧边栏添加导航链接
  extend(IndexPage.prototype, 'navItems', (items) => {
    items.add(
      'dependency-collector', // 唯一的 key
      LinkButton.component(
        {
          href: app.route('dependency-collector.forum.index'),
          icon: 'fas fa-cubes',
        },
        app.translator.trans('shebaoting-dependency-collector.forum.nav_title')
      ),
      85 // 调整优先级
    );
  });
  // 4. (可选但推荐) 将后端权限暴露给前端
  // 这个值应该通过 ForumSerializer 在后端添加到 app.forum.attributes 中
  // 在 extend.php 中:
  // (new Extend\ApiSerializer(Flarum\Api\Serializer\ForumSerializer::class))
  //     ->attribute('canSubmitDependencyCollectorItem', function ($serializer) {
  //         return $serializer->getActor()->hasPermission('dependency-collector.submit');
  //     }),
  //
  // 如果你已经在后端这样做了，那么下面的代码就不再需要了，
  // 你可以直接在你的组件中使用 app.forum.attribute('canSubmitDependencyCollectorItem')
  //
  // 为了演示，如果你想强制前端知道这个属性（即使后端没发送），可以这样做，但不推荐用于实际权限检查：
  // if (app.forum) { // 确保 app.forum 对象存在
  //   app.forum.data.attributes.canSubmitDependencyCollectorItem = true; // 示例：假设所有用户都能提交
  // }
  // 正确的做法是依赖后端通过 ForumSerializer 发送的 'canSubmitDependencyCollectorItem' 属性。
  // 在你的组件中，你应该检查 app.forum.attribute('canSubmitDependencyCollectorItem')
});
```

### 文件路径: `js\src\forum\components\DependencyItemCard.js`

```javascript
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
```

### 文件路径: `js\src\forum\components\DependencyListPage.js`

```javascript
// js/src/forum/components/DependencyListPage.js

import Page from 'flarum/common/components/Page';
import Button from 'flarum/common/components/Button';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import DependencyItemCard from './DependencyItemCard';
// Link 导入是好的实践，即使当前没有直接使用实例
import Link from 'flarum/common/components/Link';
import SubmitDependencyModal from './SubmitDependencyModal';

export default class DependencyListPage extends Page {
  oninit(vnode) {
    super.oninit(vnode);
    console.log('DependencyListPage oninit'); // 调试日志

    this.loadingItems = true; // 依赖项列表的加载状态
    this.loadingTags = true; // 标签列表的加载状态
    this.loadingMore = false; // “加载更多”按钮的加载状态
    this.items = [];
    this.tags = []; // 初始化为空数组，避免渲染时出错
    this.moreResults = false;
    // 初始化 currentTagFilter，确保首次加载时使用正确的路由参数
    this.currentTagFilter = m.route.param('tagSlug') || null; // 使用 null 代替 undefined

    // 在初始化时同时开始加载标签和依赖项
    this.loadTags();
    this.loadResults(0); // 加载第一页依赖项
  }

  oncreate(vnode) {
    super.oncreate(vnode);
    app.setTitle(app.translator.trans('shebaoting-dependency-collector.forum.nav_title'));
    app.setTitleCount(0); // 清除页面标题的计数（如果有）
  }

  // 使用 onbeforeupdate 来检测路由参数的变化
  onbeforeupdate(vnode, old) {
    super.onbeforeupdate(vnode, old);

    const newTagFilter = m.route.param('tagSlug') || null; // 获取新的路由参数

    // 检查路由参数是否真的发生了变化
    if (newTagFilter !== this.currentTagFilter) {
      console.log('Tag filter changed from', this.currentTagFilter, 'to', newTagFilter); // 调试日志
      this.currentTagFilter = newTagFilter; // 更新组件内部的状态以匹配路由
      this.loadResults(0); // 仅重新加载依赖项列表的第一页
      // 返回 false 可以阻止 Mithril 的默认重绘，因为 loadResults 会在其 finally 块中调用 m.redraw()
      // 这可以避免潜在的重复渲染或状态不一致。
      return false;
    }

    // 如果路由参数没有变化，允许 Mithril 进行正常的重绘
    return true;
  }

  view() {
    // 调试日志，展示当前渲染时的状态
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
        {/* 使用 sideNavContainer 保持和 Flarum 索引页类似的布局 */}
        <div className="sideNavContainer">
          {/* 左侧导航栏 */}
          <div className="IndexPage-nav sideNav">
            <ul className="DependencyListPage">
              {/* 提交按钮区域 */}
              <li className="item-newDiscussion App-primaryControl">
                {/* 检查用户是否登录以及是否有提交权限 */}
                {app.session.user && app.forum?.attribute('canSubmitDependencyCollectorItem') && (
                  <Button
                    // 使用 Flarum 核心样式类以保持一致性
                    className="Button Button--primary IndexPage-newDiscussion"
                    icon="fas fa-plus"
                    onclick={() =>
                      app.modal.show(SubmitDependencyModal, {
                        // 传递回调，提交成功后刷新依赖项列表
                        onsubmit: () => this.loadResults(0),
                      })
                    }
                  >
                    {/* 按钮文本 */}
                    {app.translator.trans('shebaoting-dependency-collector.forum.list.submit_button')}
                  </Button>
                )}
              </li>

              {/* 标签列表导航区域 */}
              <li className="item-nav DependencyListPage-sidebar">
                {/* 标签列表标题 */}
                {/* <h3>{app.translator.trans('shebaoting-dependency-collector.forum.list.tags_heading')}</h3> */}
                <div className="ButtonGroup Dropdown dropdown App-titleControl Dropdown--select itemCount9">
                  {/* 如果标签正在加载，显示加载指示器 */}
                  {this.loadingTags ? (
                    <LoadingIndicator />
                  ) : (
                    // 使用 Flarum 核心标签导航样式
                    <ul className="DependencyListTags">
                      {/* “全部标签”链接 */}
                      <li className={'TagLink ' + (!this.currentTagFilter ? 'active item-allDiscussions' : 'item-allDiscussions')}>
                        <a
                          // 生成指向 "全部标签" 的路由 URL
                          href={app.route('dependency-collector.forum.index')}
                          onclick={(e) => {
                            e.preventDefault(); // 阻止默认的页面跳转
                            // 只有当当前过滤器不是 "全部" 时才进行路由切换
                            if (this.currentTagFilter) {
                              m.route.set(app.route('dependency-collector.forum.index'));
                            }
                          }}
                        >
                          <span className="TagLink-name">{app.translator.trans('shebaoting-dependency-collector.forum.list.all_tags')}</span>
                        </a>
                      </li>
                      {/* 渲染具体的标签链接 */}
                      {/* 确保 this.tags 存在且有内容 */}
                      {this.tags && this.tags.length > 0
                        ? this.tags.map((tag) => (
                            <li
                              key={tag.id()}
                              className={'TagLink ' + (this.currentTagFilter === tag.slug() ? 'active item-allDiscussions' : 'item-allDiscussions')}
                            >
                              <a
                                // 生成指向特定标签过滤的路由 URL
                                href={app.route('dependency-collector.forum.index', { tagSlug: tag.slug() })}
                                onclick={(e) => {
                                  e.preventDefault(); // 阻止默认跳转
                                  // 只有当点击的不是当前已选标签时才进行路由切换
                                  if (this.currentTagFilter !== tag.slug()) {
                                    m.route.set(app.route('dependency-collector.forum.index', { tagSlug: tag.slug() }));
                                  }
                                }}
                              >
                                {/* 如果标签有图标，则显示 */}
                                {tag.icon() && <i className={tag.icon() + ' TagLink-icon'}></i>}
                                <span className="TagLink-name">{tag.name()}</span>
                              </a>
                            </li>
                          ))
                        : // 如果标签加载完成但列表为空，显示提示信息
                          !this.loadingTags && (
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

          {/* 主要内容区域，显示依赖项列表 */}
          <div className="IndexPage-results sideNavOffset DependencyListPage">
            <div className="DependencyListPage-body">
              {/* 如果是初始加载依赖项且当前没有项目，显示加载指示器 */}
              {this.loadingItems && this.items.length === 0 ? (
                <LoadingIndicator />
              ) : (
                // 依赖项列表容器
                <div className="DependencyList">
                  {/* 确保 this.items 存在且有内容 */}
                  {this.items && this.items.length > 0
                    ? // 遍历并渲染每个依赖项卡片
                      this.items.map((item) => <DependencyItemCard item={item} key={item.id()} onchange={() => this.loadResults(0)} />)
                    : // 如果依赖项加载完成但列表为空，显示空状态提示
                      !this.loadingItems && <p>{app.translator.trans('shebaoting-dependency-collector.forum.list.empty_text')}</p>}
                </div>
              )}

              {/* “加载更多”按钮 */}
              {/* 仅当有更多结果时才显示此区域 */}
              {this.moreResults && (
                <div style="text-align: center; margin-top: 10px;">
                  <Button
                    className="Button"
                    onclick={this.loadMore.bind(this)}
                    // 使用 loading 属性在加载更多时显示加载状态并禁用按钮
                    loading={this.loadingMore}
                  >
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

  // 加载依赖项列表的方法
  loadResults(offset = 0) {
    // offset === 0 表示初始加载或过滤加载
    if (offset === 0) {
      this.loadingItems = true;
      this.items = []; // 清空列表以准备显示新的结果或加载指示器
      this.moreResults = false; // 重置是否有更多结果的状态
      m.redraw(); // 立即重绘以反映加载状态
    } else {
      // offset > 0 表示加载更多
      this.loadingMore = true;
      m.redraw(); // 立即重绘以更新“加载更多”按钮状态
    }

    // 准备 API 请求参数
    const params = {
      page: { offset },
      sort: '-approvedAt', // 按最新审核排序
      include: 'user,tags,approver', // 请求包含关联的用户、标签和审核者信息
      filter: {}, // 确保 filter 对象存在
    };

    // 如果当前设置了标签过滤器，添加到请求参数中
    if (this.currentTagFilter) {
      params.filter.tag = this.currentTagFilter;
    }

    console.log('Loading results with params:', JSON.stringify(params)); // 调试日志

    // 发起 API 请求
    return app.store
      .find('dependency-items', params)
      .then((results) => {
        console.log('Results loaded:', results); // 调试日志
        // 检查返回的是否是数组 (Flarum store.find 成功时应返回模型数组)
        if (Array.isArray(results)) {
          if (offset === 0) {
            // 如果是初始加载，直接替换列表
            this.items = results;
          } else {
            // 如果是加载更多，追加到现有列表
            this.items.push(...results);
          }
          // 检查 API 响应的 payload 中是否有下一页的链接
          // store 返回的数组会附加一个 payload 对象包含元数据和链接
          this.moreResults = !!results.payload?.links?.next;
          console.log('More results:', this.moreResults); // 调试日志
        } else {
          // 处理 API 返回格式不正确的情况
          console.error('API did not return an array for dependency-items:', results);
          if (offset === 0) this.items = []; // 如果是初始加载，清空列表
          this.moreResults = false; // 标记没有更多结果
        }
      })
      .catch((error) => {
        // 处理 API 请求错误
        console.error('Error loading dependency items:', error);
        if (offset === 0) this.items = []; // 错误发生时，如果是初始加载则清空列表
        this.moreResults = false; // 标记没有更多结果
        // 可以在这里向用户显示错误提示，例如使用 app.alerts.show
        app.alerts.show({ type: 'error' }, app.translator.trans('shebaoting-dependency-collector.forum.list.load_error'));
      })
      .finally(() => {
        // 无论请求成功或失败，都结束加载状态
        this.loadingItems = false;
        this.loadingMore = false;
        m.redraw(); // 确保最终的 UI 状态被渲染
        console.log('Loading finished, redraw called.'); // 调试日志
      });
  }

  // 加载标签列表的方法
  loadTags() {
    this.loadingTags = true;
    // 可以选择在这里重绘以显示加载状态
    // m.redraw();

    // 发起 API 请求获取所有标签，按名称排序
    app.store
      .find('dependency-tags', { sort: 'name' })
      .then((tags) => {
        console.log('Tags loaded:', tags); // 调试日志
        // 确保返回的是数组
        if (Array.isArray(tags)) {
          this.tags = tags;
        } else {
          console.error('API did not return an array for dependency-tags:', tags);
          this.tags = []; // 保证 tags 是一个空数组
        }
      })
      .catch((error) => {
        // 处理错误
        console.error('Error loading tags:', error);
        this.tags = []; // 出错时也保证 tags 是空数组
        // 可以显示错误提示
        app.alerts.show({ type: 'error' }, app.translator.trans('shebaoting-dependency-collector.forum.list.load_tags_error'));
      })
      .finally(() => {
        // 结束标签加载状态
        this.loadingTags = false;
        // 确保标签列表加载完成后 UI 能更新，即使依赖项列表还在加载
        m.redraw();
        console.log('Tag loading finished.'); // 调试日志
      });
  }

  // 加载更多依赖项的方法
  loadMore() {
    // 如果正在加载中（初始或更多），则不执行任何操作
    if (this.loadingItems || this.loadingMore) return;

    console.log('Loading more items...'); // 调试日志
    // 调用 loadResults，使用当前项目数量作为下一页的偏移量
    this.loadResults(this.items.length);
  }

  // 组件移除时的清理方法
  onremove(vnode) {
    console.log('DependencyListPage onremove'); // 调试日志
    super.onremove(vnode);
    // 如果有事件监听器或其他需要清理的资源，在此处处理
  }
}
```

### 文件路径: `js\src\forum\components\EditDependencyModal.js`

```javascript
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
            {/* <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.title_label')}</label> */}
            <input className="FormControl" bidi={this.title} />
          </div>
          <div className="Form-group">
            {/* <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.link_label')}</label> */}
            <input type="url" className="FormControl" bidi={this.link} />
          </div>
          <div className="Form-group">
            {/* <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.description_label')}</label> */}
            <textarea className="FormControl" bidi={this.description} rows="5"></textarea>
          </div>
          <div className="Form-group">
            {/* <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_label')}</label> */}
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
```

### 文件路径: `js\src\forum\components\SubmitDependencyModal.js`

```javascript
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
            {/* <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.title_label')}</label> */}
            <input
              className="FormControl"
              bidi={this.title}
              placeholder={app.translator.trans('shebaoting-dependency-collector.forum.modal.title_placeholder')}
            />
          </div>
          <div className="Form-group">
            {/* <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.link_label')}</label> */}
            <input type="url" className="FormControl" bidi={this.link} placeholder="https://example.com" />
          </div>
          <div className="Form-group">
            {/* <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.description_label')}</label> */}
            <textarea
              className="FormControl"
              bidi={this.description}
              rows="5"
              placeholder={app.translator.trans('shebaoting-dependency-collector.forum.modal.description_placeholder')}
            ></textarea>
          </div>
          <div className="Form-group">
            {/* <label>{app.translator.trans('shebaoting-dependency-collector.forum.modal.tags_label')}</label> */}
            {this.loadingTags ? (
              <p>{app.translator.trans('core.lib.loading_indicator_text')}</p>
            ) : (
              // --- 修改开始: 渲染平铺的标签 ---
              <div className="TagSelector">
                {this.availableTagsList.length > 0 ? (
                  this.availableTagsList.map((tag) => {
                    const isSelected = this.selectedTagIds().includes(tag.id());
                    return (
                      <span
                        className={classList('colored text-contrast--dark', isSelected && 'active')}
                        icon={tag.icon()}
                        style={
                          isSelected
                            ? { backgroundColor: '#d1f0da', borderColor: tag.color() || '#ddd', color: '#669974' || 'inherit' }
                            : { backgroundColor: tag.color() || '#4D698E', color: 'white' }
                        }
                        onclick={() => this.toggleTag(tag.id())}
                      >
                        {tag.name()}
                      </span>
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
```

### 文件路径: `less\admin.less`

```text
.DependencyCollectorSettingsPage {
    .container > section {
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #eee;
        &:last-child {
            border-bottom: none;
        }
    }
    .DependencyTable, .PluginTagsTable {
        th, td {
            vertical-align: middle;
        }
        small {
            display: block;
            color: #777;
            font-size: 0.9em;
        }
        .Button--icon {
            margin-right: 5px;
        }
    }
    .PluginTagsSection {
      .Page-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
    }
    .PluginTagsTable {
        width: 100%;
        // --- 新增：固定表格布局算法 ---
        table-layout: fixed;
        // --- 新增结束 ---

        th, td {
            vertical-align: middle;
            text-align: center;
            // --- 新增：防止内容溢出，尤其是在固定布局下 ---
            overflow: hidden;       // 隐藏溢出内容
            text-overflow: ellipsis; // 用省略号表示被隐藏的文本
            white-space: nowrap;    // 防止文本换行（如果需要换行则移除此行）
            // --- 新增结束 ---
        }

        // 保持或调整列宽设置，确保总和接近 100%
        th:nth-child(1), td:nth-child(1) { /* Name */ width: 25%; text-align: left; }
        th:nth-child(2), td:nth-child(2) { /* Slug */ width: 25%; text-align: left; }
        th:nth-child(3), td:nth-child(3) { /* Color */ width: 15%; }
        th:nth-child(4), td:nth-child(4) { /* Icon */ width: 10%; }
        th:nth-child(5), td:nth-child(5) { /* Item Count */ width: 10%; }
        th:nth-child(6), td:nth-child(6) { /* Actions */ width: 15%; text-align: right;}


        td {
            &:nth-child(1), &:nth-child(2), &:nth-child(3), &:nth-child(4) {
                 cursor: pointer;
            }

            .FormControl--inline {
                display: block; // 改为 block 或 inline-block 配合 100% 宽度
                // --- 修改：让输入框充满单元格宽度 ---
                width: 100%;
                // --- 新增：确保 padding 和 border 包含在宽度内 ---
                box-sizing: border-box;
                // --- 修改结束 ---
                padding: 2px 6px;
                height: auto;
                line-height: inherit;
                font-size: inherit;
                // 移除 min-width，因为它可能导致列被撑开
                // min-width: 80px;
                text-align: left;
            }
        }
        tr.saving td {
           opacity: 0.5;
           pointer-events: none;
        }
    }
}

.EditTagModal {
    // Styles if needed
}
```

### 文件路径: `less\forum.less`

```text
.DependencyListPage {
  margin-top: 30px;

  .DependencyListPage-sidebar {
    width: 200px; // Adjust as needed
    margin-right: 20px;

    h3 {
      font-size: 1.1em;
      margin-bottom: 10px;
    }

    .DependencyListTags {
      list-style: none;
      padding-left: 0;
      display: flex;
      flex-wrap: wrap;
      li {
        background-color: #e0f4e6;
        margin: 5px;
        box-sizing: border-box;
        &.active a {
          font-weight: bold;
          color: @primary-color;
        }

        a {
          text-decoration: none;
          color: @text-color;

          &:hover {
            color: @primary-color;
          }
        }
      }

      .DependencyListTag-icon {
        margin-right: 5px;
      }

      .item-allDiscussions {
        display: inline-block;
        margin-bottom: 0;
        text-align: center;
        vertical-align: middle;
        cursor: pointer;
        white-space: nowrap;
        line-height: 20px;
        padding: 8px 13px;
        border-radius: 4px;
        -webkit-user-select: none;
        user-select: none;
        color: var(--button-color);
        background: var(--button-bg);
        border: 0;
        margin-right: 5px;
      }
    }
  }

  .DependencyListPage-content {
    flex-grow: 1;
  }

.DependencyList {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
}

.DependencyItemCard {
  border-radius: 4px;
  padding: 15px;
  background-color: var(--hero-bg);
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &--pending {
    opacity: 0.7;
    border-left: 3px solid @alert-color;
    ; // Example for pending
  }

  .DependencyItemCard-statusBadge {
    background-color: @alert-color;
    ;
    color: white;
    padding: 2px 6px;
    font-size: 0.8em;
    border-radius: 3px;
    float: right; // Or position as needed
    margin-bottom: 5px;
  }

  .DependencyItemCard-header {
    margin-bottom: 10px;

    .DependencyItemCard-title {
      margin: 0;
      a {
      font-size: 1.2em;
      font-weight: bold;
      color: @heading-color;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
    }
  }

  .DependencyItemCard-body {
    margin-bottom: 10px;
    flex-grow: 1;

    .DependencyItemCard-description {
      font-size: 0.9em;
      color: @text-color;
      line-height: 1.4;
    }
  }

  .DependencyItemCard-footer {
    font-size: 0.85em;
    color: #777;

    .DependencyItemCard-tags {
      margin-bottom: 8px;

      .DependencyItemCard-tag {
        display: inline-block;
        padding: 3px 8px;
        margin-right: 5px;
        margin-bottom: 5px;
        border-radius: 3px;
        font-size: 0.9em;
        text-decoration: none;

        &:hover {
          opacity: 0.8;
        }
      }

      .DependencyItemCard-tagIcon {
        margin-right: 3px;
      }
    }

    .DependencyItemCard-meta {
      display: flex;
      align-items: center;

      .DependencyItemCard-submitter {
        display: flex;
        align-items: center;
        margin-right: 10px;

        .DependencyItemCard-avatar {
          width: 20px;
          height: 20px;
          margin-right: 5px;
        }
      }
    }
  }
}

.SubmitDependencyModal {
  .TagSelector {
    display: flex;
    flex-wrap: wrap; // 允许标签换行
    gap: 8px; // 标签之间的间距

    span {
      // 默认样式 (未选中)
      background-color: transparent;
      color: #555; // 默认文字颜色
      font-size: 12px;
      padding: 5px 10px;
      line-height: 12px;
      transition: background-color 0.2s, color 0.2s, border-color 0.2s; // 平滑过渡
      border-radius: 3px;
      &:hover {
        background-color: #f5f5f5;
        border-color: #ccc;
      }

      &.active {
        // 选中时的样式 - 优先使用标签自定义颜色
        // JS中通过 style 属性设置了 backgroundColor 和 color
        border-color: transparent; // 选中时可以隐藏边框或使用背景色作为边框
        font-weight: bold;

        // 如果标签没有自定义颜色，这里的样式会被 JS 中的 style 覆盖
        // 但可以作为备用或调整其他属性
        // background-color: @primary-color;
        // color: white;
      }

      .Button-icon {
        margin-right: 5px;
      }
    }
  }
}
```

### 文件路径: `locale\en.yml`

```yaml
shebaoting-dependency-collector:
  forum:
    nav_title: Dependencies
    list:
      submit_button: Submit Dependency
      filter_by_tag: Filter by Tag
      all_tags: All
      empty_text: No dependencies found.
    item:
      pending_approval: Pending Approval
    modal:
      submit_title: Submit New Dependency
      title_label: Title
      title_placeholder: e.g., Awesome Library
      link_label: Link
      description_label: Description
      description_placeholder: A short summary of what this dependency does.
      tags_label: Plugin Tags
      tags_help: Select at least one relevant tag.
      submit_button: Submit
  admin:
    nav:
      title: Dependency Collector
      description: Manage submitted dependencies and plugin tags.
    page:
      pending_items_title: Pending Dependencies for Review
      no_pending_items: There are no dependencies awaiting review.
      approved_items_title: Approved Dependencies
      no_approved_items: There are no approved dependencies yet.
      manage_tags_title: Manage Plugin Tags
      no_plugin_tags: No plugin tags have been created yet.
    table:
      title: Title
      submitted_by: Submitted By
      submitted_at: Submitted At
      approved_by: Approved By
      approved_at: Approved At
      tags: Tags
      tag_name: Name
      tag_slug: Slug
      tag_color_icon: Color & Icon
      tag_item_count: Items
      actions: Actions
      tag_color: Color      # 新增或修改
      tag_icon: Icon       # 新增
    actions:
      create_tag: Create Tag
      approve: Approve
      reject: Reject
    confirm:
      approve: Approve dependency
      reject: Reject dependency
      delete: Delete dependency
      delete_tag: Delete tag "{name}"? This will remove it from all associated dependencies.
    modal:
      edit_tag_title: Edit Tag - {name}
      create_tag_title: Create New Tag
      tag_name_label: Name
      tag_slug_label: Slug
      tag_description_label: Description (Optional)
      tag_color_label: Color (e.g., #FF0000)
      tag_icon_label: Icon (e.g., fas fa-code)
      tag_icon_help: Find icons on <a>Font Awesome</a>.
    permissions:
      submit_label: Submit dependencies
      moderate_label: Moderate dependencies (approve, reject, edit, delete)
      manage_tags_label: Manage plugin tags
```

### 文件路径: `locale\zh.yml`

```yaml
shebaoting-dependency-collector:
  forum:
    nav_title: 依赖项中心 # 论坛导航栏链接文本
    list:
      submit_button: 提交依赖项 # 依赖项列表页的“提交”按钮
      filter_by_tag: 按标签筛选 # 筛选区域标题
      all_tags: 全部标签 # “全部标签”筛选选项
      empty_text: 暂无依赖项。 # 列表为空时的提示文本
    item:
      pending_approval: 审核中 # 依赖项卡片上“待审核”状态的徽章
    modal:
      submit_title: 提交新的依赖项 # 提交依赖项弹窗的标题
      title_label: 标题 # 标题输入框的标签
      title_placeholder: 例如：很棒的库 # 标题输入框的占位符
      link_label: 链接 # 链接输入框的标签
      link_placeholder: https://example.com # 链接输入框的占位符
      description_label: 简介 # 简介文本区域的标签
      description_placeholder: 关于此依赖项功能的简短描述。 # 简介文本区域的占位符
      tags_label: 插件标签 # 插件标签选择区域的标签
      tags_help: 请至少选择一个相关的标签 # 插件标签选择的帮助文本
      submit_button: 提交 # 弹窗中的提交按钮

  admin:
    nav:
      title: 依赖收集器 # 后台导航栏中插件的名称
      description: 管理已提交的依赖项和插件自定义标签。 # 后台插件页面的描述
    page:
      pending_items_title: 待审核的依赖项 # “待审核列表”区域的标题
      no_pending_items: 当前没有等待审核的依赖项。 # “待审核列表”为空时的提示
      approved_items_title: 已批准的依赖项 # “已批准列表”区域的标题
      no_approved_items: 目前还没有已批准的依赖项。 # “已批准列表”为空时的提示
      manage_tags_title: 管理插件标签 # “管理插件标签”区域的标题
      no_plugin_tags: 尚未创建任何插件标签。 # “插件标签列表”为空时的提示
    table:
      title: 标题
      submitted_by: 提交者
      submitted_at: 提交于
      approved_by: 审核者
      approved_at: 审核于
      tags: 标签
      tag_name: 标签名称
      tag_slug: 标签标识符 (Slug)
      tag_color_icon: 颜色与图标
      tag_item_count: 条目数
      actions: 操作
      tag_color: 颜色      # 新增或修改
      tag_icon: 图标       # 新增
    actions:
      create_tag: 创建标签 # “创建标签”按钮文本
      approve: 批准 # “批准”按钮文本
      reject: 拒绝 # “拒绝”按钮文本
      delete_button: 删除
    confirm:
      approve: 确定要批准依赖项 # 批准确认提示
      reject: 确定要拒绝依赖项 # 拒绝确认提示
      delete: 确定要删除依赖项 # 删除依赖项确认提示
      delete_tag: 您确定要删除标签 "{name}" 吗？这将从所有关联的依赖项中移除此标签。 # 删除标签确认提示，{name} 是占位符
    modal:
      edit_tag_title: 编辑标签 - {name} # 编辑标签弹窗标题
      create_tag_title: 创建新标签 # 创建标签弹窗标题
      tag_name_label: 名称
      tag_slug_label: 标识符 (Slug)
      tag_description_label: 描述 (可选)
      tag_color_label: 颜色 (例如：#FF0000)
      tag_icon_label: 图标 (例如：fas fa-code)
      tag_icon_help: 在 <a>Font Awesome</a> 上查找图标。 # 图标帮助文本，<a> 是用于链接的特殊标记
    permissions: # 后台权限设置页面的权限描述
      submit_label: 提交依赖项
      moderate_label: 管理依赖项 (批准、拒绝、编辑、删除)
      manage_tags_label: 管理插件标签
```

### 文件路径: `migrations\2025_05_07_183040_create_dependency_collector_items_table.php`

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_items')) {
            $schema->create('dependency_collector_items', function (Blueprint $table) {
                $table->increments('id');
                $table->string('title');
                $table->string('link');
                $table->text('description');
                $table->unsignedInteger('user_id');
                $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
                $table->timestamp('submitted_at')->useCurrent();
                $table->timestamp('approved_at')->nullable();
                $table->unsignedInteger('approver_user_id')->nullable();

                $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
                $table->foreign('approver_user_id')->references('id')->on('users')->onDelete('set null');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_items');
    },
];
```

### 文件路径: `migrations\2025_05_07_183115_create_dependency_collector_tags_table.php`

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_tags')) {
            $schema->create('dependency_collector_tags', function (Blueprint $table) {
                $table->increments('id');
                $table->string('name')->unique();
                $table->string('slug')->unique();
                $table->text('description')->nullable();
                $table->string('color', 7)->nullable(); // e.g., #RRGGBB
                $table->string('icon')->nullable();    // e.g., fas fa-code
                $table->timestamps();
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_tags');
    },
];
```

### 文件路径: `migrations\2025_05_07_183145_create_dependency_collector_item_tag_table.php`

```php
<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Schema\Builder;

return [
    'up' => function (Builder $schema) {
        if (!$schema->hasTable('dependency_collector_item_tag')) {
            $schema->create('dependency_collector_item_tag', function (Blueprint $table) {
                $table->unsignedInteger('item_id');
                $table->unsignedInteger('tag_id');
                $table->primary(['item_id', 'tag_id']);

                $table->foreign('item_id')->references('id')->on('dependency_collector_items')->onDelete('cascade');
                $table->foreign('tag_id')->references('id')->on('dependency_collector_tags')->onDelete('cascade');
            });
        }
    },
    'down' => function (Builder $schema) {
        $schema->dropIfExists('dependency_collector_item_tag');
    },
];
```

### 文件路径: `src\Access\DependencyItemPolicy.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Access;

use Flarum\User\Access\AbstractPolicy;
use Flarum\User\User;
use Shebaoting\DependencyCollector\Models\DependencyItem;

class DependencyItemPolicy extends AbstractPolicy
{
    /**
     * 决定谁可以编辑一个依赖项。
     * 管理员总是可以编辑。
     * 提交者只能编辑处于 'pending' 状态的依赖项。
     */
    public function edit(User $actor, DependencyItem $item)
    {
        // 管理员或版主（拥有 moderate 权限）可以编辑任何状态的条目
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }

        // 提交者只能编辑自己提交的，并且状态为 'pending' 的条目
        if ($item->status === 'pending' && $actor->id === $item->user_id && $actor->hasPermission('dependency-collector.submit')) {
            // 确保用户至少有提交权限才能编辑自己的
            return $this->allow();
        }

        return $this->deny();
    }

    /**
     * 决定谁可以批准/取消批准一个依赖项。
     * 只有拥有 moderate 权限的用户可以。
     */
    public function approve(User $actor, DependencyItem $item)
    {
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }
        return $this->deny();
    }

    public function delete(User $actor, DependencyItem $item)
    {
        if ($actor->hasPermission('dependency-collector.moderate')) {
            return $this->allow();
        }
        // 可选：允许用户删除自己未审核的提交
        if ($item->status === 'pending' && $actor->id === $item->user_id && $actor->hasPermission('dependency-collector.submit')) {
            return $this->allow();
        }
        return $this->deny();
    }
}
```

### 文件路径: `src\Api\Controller\CreateDependencyItemController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyItemValidator; // We'll create this

class CreateDependencyItemController extends AbstractCreateController
{
    public $serializer = DependencyItemSerializer::class;

    public $include = ['user', 'tags'];

    protected $validator;

    public function __construct(DependencyItemValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $data = Arr::get($request->getParsedBody(), 'data', []);

        $actor->assertCan('dependency-collector.submit');

        $attributes = Arr::get($data, 'attributes', []);
        $relationships = Arr::get($data, 'relationships', []);
        $tagIds = [];
        if (isset($relationships['tags']['data'])) {
            foreach ($relationships['tags']['data'] as $tagData) {
                if (isset($tagData['id'])) {
                    $tagIds[] = $tagData['id'];
                }
            }
        }
        if (empty($tagIds)) {
            // Or handle in validator: throw new ValidationException(['tags' => 'At least one tag is required.']);
        }


        $this->validator->assertValid(array_merge($attributes, ['tag_ids' => $tagIds]));


        $item = DependencyItem::build(
            Arr::get($attributes, 'title'),
            Arr::get($attributes, 'link'),
            Arr::get($attributes, 'description'),
            $actor->id
        );

        // Event for pre-save modifications if needed by other extensions
        // $this->events->dispatch(new Saving($item, $actor, $data));

        $item->save();

        if (!empty($tagIds)) {
            $item->tags()->sync($tagIds);
        }

        // Event for post-save actions
        // $this->events->dispatch(new Created($item, $actor, $data));

        return $item;
    }
}
```

### 文件路径: `src\Api\Controller\CreateDependencyTagController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractCreateController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyTagValidator;
use Illuminate\Support\Str;

class CreateDependencyTagController extends AbstractCreateController
{
    public $serializer = DependencyTagSerializer::class;
    protected $validator;

    public function __construct(DependencyTagValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        $actor->assertCan('dependency-collector.manageTags');

        if (empty($attributes['slug']) && !empty($attributes['name'])) {
            $attributes['slug'] = Str::slug($attributes['name']);
        }

        // --- 设置默认图标 ---
        $icon = Arr::get($attributes, 'icon');
        if (empty($icon)) {
            $attributes['icon'] = 'fas fa-code'; // 如果为空，设置默认值
        }
        // --- 默认图标设置结束 ---

        $this->validator->assertValid($attributes);

        $tag = DependencyTag::build(
            Arr::get($attributes, 'name'),
            Arr::get($attributes, 'slug'),
            Arr::get($attributes, 'description'),
            Arr::get($attributes, 'color'),
            Arr::get($attributes, 'icon') // 使用可能已设置了默认值的 icon
        );

        $tag->save();

        return $tag;
    }
}
```

### 文件路径: `src\Api\Controller\DeleteDependencyItemController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Shebaoting\DependencyCollector\Models\DependencyItem;

class DeleteDependencyItemController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $itemId = Arr::get($request->getQueryParams(), 'id');

        $actor->assertCan('dependency-collector.moderate'); // Or a more specific delete permission

        $item = DependencyItem::findOrFail($itemId);
        $item->delete();
    }
}
```

### 文件路径: `src\Api\Controller\DeleteDependencyTagController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractDeleteController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Shebaoting\DependencyCollector\Models\DependencyTag;

class DeleteDependencyTagController extends AbstractDeleteController
{
    protected function delete(ServerRequestInterface $request)
    {
        $actor = RequestUtil::getActor($request);
        $tagId = Arr::get($request->getQueryParams(), 'id');

        // 权限检查
        $actor->assertCan('dependency-collector.manageTags');

        $tag = DependencyTag::findOrFail($tagId);

        // 在删除标签之前，解除它与所有依赖项的关联
        // 这样做是为了避免因外键约束而出错，并且是“软”删除关联关系
        // 如果直接删除标签，并且 `dependency_collector_item_tag` 表中设置了 onDelete('cascade')，
        // 那么关联记录会自动删除。这里我们明确解除关联。
        $tag->items()->detach(); // 解除所有关联的依赖项

        // 如果有其他需要在删除前处理的逻辑，可以在这里添加
        // 例如，触发事件：$this->events->dispatch(new Events\TagWillBeDeleted($tag, $actor));

        $tag->delete();

        // 例如，触发事件：$this->events->dispatch(new Events\TagWasDeleted($tag, $actor));
    }
}
```

### 文件路径: `src\Api\Controller\ListDependencyItemsController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Illuminate\Support\Arr;
use Illuminate\Support\Str; // 用于驼峰转蛇形

class ListDependencyItemsController extends AbstractListController
{
    /**
     * {@inheritdoc}
     * 指定用于此控制器的序列化器。
     */
    public $serializer = DependencyItemSerializer::class;

    /**
     * {@inheritdoc}
     * 默认情况下要包含的关联关系。
     * 例如：['user', 'tags', 'approver']
     */
    public $include = ['user', 'tags', 'approver'];

    /**
     * {@inheritdoc}
     * 允许客户端进行排序的字段列表。
     * 这些字段名应该是前端API请求中使用的驼峰式名称。
     */
    public $sortFields = ['submittedAt', 'approvedAt'];

    /**
     * {@inheritdoc}
     * 默认的排序规则。
     * 键名应该是前端API请求中使用的驼峰式名称。
     * 值可以是 'asc' 或 'desc'。
     * 或者，可以使用 Flarum 的约定，例如 '-approvedAt' 表示按 approvedAt 降序。
     * extractSort 方法会处理前缀 '-'。
     */
    public $sort = ['approvedAt' => 'desc']; // 默认按批准时间降序

    /**
     * @var UrlGenerator
     */
    protected $url;

    /**
     * @param UrlGenerator $url
     */
    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    /**
     * {@inheritdoc}
     */
    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request); // 获取当前操作的用户
        $filters = $this->extractFilter($request); // 提取请求中的过滤参数

        // 从请求中提取排序参数 (例如 ?sort=approvedAt 或 ?sort=-submittedAt)
        // extractSort 会根据 $this->sortFields 验证这些参数
        // 返回值是一个关联数组，键是前端使用的字段名 (如 'approvedAt')，值是排序方向 ('asc' 或 'desc')
        $sortInput = $this->extractSort($request);

        // 如果请求中没有提供排序参数，则使用控制器定义的默认排序
        if (empty($sortInput)) {
            $sortInput = $this->sort;
        }

        // 将前端使用的排序字段名 (驼峰式) 转换为数据库实际使用的列名 (蛇形)
        $dbSort = [];
        foreach ($sortInput as $frontendField => $direction) {
            // 确保只转换在 $this->sortFields 中定义的、允许排序的字段
            if (in_array($frontendField, $this->sortFields)) {
                $dbSort[Str::snake($frontendField)] = $direction;
            }
        }

        $limit = $this->extractLimit($request); // 提取分页大小限制
        $offset = $this->extractOffset($request); // 提取分页偏移量
        $include = $this->extractInclude($request); // 提取请求中明确要求包含的关联关系

        // 初始化查询构造器
        $query = DependencyItem::query();

        // 根据用户权限和状态进行过滤
        if (!$actor->hasPermission('dependency-collector.moderate')) {
            // 普通用户只能看到已批准的依赖项，或者他们自己提交的待审核依赖项
            $query->where(function ($q) use ($actor) {
                $q->where('status', 'approved')
                    ->orWhere(function ($q2) use ($actor) {
                        $q2->where('user_id', $actor->id)
                            ->where('status', 'pending');
                    });
            });
        } else {
            // 管理员/版主可以看到所有状态的依赖项，除非有明确的状态过滤
            $statusFilter = Arr::get($filters, 'status');
            if ($statusFilter && in_array($statusFilter, ['pending', 'approved', 'rejected'])) {
                $query->where('status', $statusFilter);
            }
        }

        // 根据插件标签 (slug) 进行过滤
        $tagFilterSlug = Arr::get($filters, 'tag'); // 假设前端通过 ?filter[tag]=tag-slug 的方式传递
        if ($tagFilterSlug) {
            $query->whereHas('tags', function ($q) use ($tagFilterSlug) {
                // 假设 DependencyTag 模型中 'slug' 列存储了标签的 slug
                $q->where('dependency_collector_tags.slug', $tagFilterSlug);
            });
        }

        // 获取过滤和权限控制后的总结果数，用于分页
        $totalResults = $query->count();

        // 应用分页
        $query->skip($offset)->take($limit);

        // 应用排序 (使用转换后的数据库列名)
        foreach ($dbSort as $dbField => $order) {
            $query->orderBy($dbField, $order);
        }

        // 为响应文档添加分页链接
        $document->addPaginationLinks(
            $this->url->to('api')->route('dependency-collector.items.index'), // 当前列表 API 路由的 URL
            $request->getQueryParams(), // 当前请求的查询参数，用于构建分页链接
            $offset,
            $limit,
            $totalResults - ($offset + $limit) > 0 ? null : 0 // 如果还有更多结果，则 $remaining 不为0
        );

        // 执行查询并获取结果集合
        $results = $query->get();

        // 加载请求中指定的关联关系 (例如 'user', 'tags')
        // $this->loadRelations 会处理 $include 参数，并高效加载数据
        $this->loadRelations($results, $include, $request);

        return $results; // 返回结果给序列化器进行处理
    }
}
```

### 文件路径: `src\Api\Controller\ListDependencyTagsController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractListController;
use Flarum\Http\RequestUtil;
use Flarum\Http\UrlGenerator;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Illuminate\Support\Arr;

class ListDependencyTagsController extends AbstractListController
{
    // 指定序列化器
    public $serializer = DependencyTagSerializer::class;

    // 可选的默认包含的关联关系
    // public $include = [];

    // 可选的排序字段
    public $sortFields = ['name', 'createdAt', 'itemCount']; // itemCount 需要在 serializer 中计算或通过 withCount 加载

    // 默认排序
    public $sort = ['name' => 'asc'];

    protected $url;

    public function __construct(UrlGenerator $url)
    {
        $this->url = $url;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);

        // 任何人都可以查看标签列表，因此通常不需要特定的权限检查来列出它们
        // 如果有需要，可以在这里添加，例如： $actor->assertCan('viewDependencyTags');

        $filters = $this->extractFilter($request);
        $sort = $this->extractSort($request);

        $limit = $this->extractLimit($request);
        $offset = $this->extractOffset($request);
        // $include = $this->extractInclude($request); // 如果有 $include 定义

        $query = DependencyTag::query();

        // 可以在此处添加基于 $filters 的查询逻辑，例如按名称搜索
        // $search = Arr::get($filters, 'q');
        // if ($search) {
        //     $query->where('name', 'like', "%{$search}%");
        // }

        // 如果需要显示 itemCount，确保它被正确加载或计算
        // 例如，如果 DependencyTagSerializer 中的 itemCount 是通过 items()->count() 计算的，
        // 并且你希望能够按它排序，你可能需要使用 withCount('items')
        if (isset($sort['itemCount'])) {
            $query->withCount('items'); // 这样就会有一个 items_count 列可供排序
            // 注意：如果 $sortFields 中定义了 'itemCount'，实际排序时应使用 'items_count'
            if ($sortKey = array_search('itemCount', $this->sortFields, true)) {
                // 更新排序键，以匹配 withCount 生成的列名
                if (isset($sort['itemCount'])) {
                    $sort['items_count'] = $sort['itemCount'];
                    unset($sort['itemCount']);
                }
            }
        }


        $totalResults = $query->count();

        $query->skip($offset)->take($limit);

        foreach ((array) $sort as $field => $order) {
            // 确保对 itemCount 排序时使用正确的列名
            if ($field === 'itemCount' && $query->getQuery()->columns && in_array('items_count', array_column($query->getQuery()->columns, 'name'))) {
                $query->orderBy('items_count', $order);
            } elseif (in_array($field, $this->sortFields)) {
                $query->orderBy($field, $order);
            }
        }


        $document->addPaginationLinks(
            $this->url->to('api')->route('dependency-collector.tags.index'),
            $request->getQueryParams(),
            $offset,
            $limit,
            $totalResults - ($offset + $limit) > 0 ? null : 0
        );

        $results = $query->get();

        // $this->loadRelations($results, $include, $request); // 如果有 $include 定义

        return $results;
    }
}
```

### 文件路径: `src\Api\Controller\UpdateDependencyItemController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyItemSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyItemValidator;
use Carbon\Carbon;
use Flarum\Foundation\ValidationException; // 用于抛出验证错误

class UpdateDependencyItemController extends AbstractShowController
{
    public $serializer = DependencyItemSerializer::class;
    public $include = ['user', 'tags', 'approver'];
    protected $validator;

    public function __construct(DependencyItemValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $itemId = Arr::get($request->getQueryParams(), 'id');
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        $item = DependencyItem::findOrFail($itemId);

        // --- 权限检查: 使用 Policy ---
        // 检查用户是否有编辑权限
        $actor->assertCan('edit', $item);
        // --- 权限检查结束 ---

        // 准备验证数据
        $validationAttributes = $attributes;
        // 将模型实例传递给验证器，以便它可以忽略 unique 规则中的当前项（如果需要）
        $this->validator->setItem($item); // 假设验证器有 setItem 方法
        $this->validator->assertValid($validationAttributes);

        $isDirty = false; // 标记是否有更改

        // --- 更新属性 ---
        if (isset($attributes['title']) && $attributes['title'] !== $item->title) {
            $item->title = $attributes['title'];
            $isDirty = true;
        }
        if (isset($attributes['link']) && $attributes['link'] !== $item->link) {
            $item->link = $attributes['link'];
            $isDirty = true;
        }
        if (isset($attributes['description']) && $attributes['description'] !== $item->description) {
            $item->description = $attributes['description'];
            $isDirty = true;
        }
        // --- 属性更新结束 ---

        // --- 处理状态变更 (仅当 status 属性被传递时) ---
        if (isset($attributes['status'])) {
            $newStatus = $attributes['status'];
            // 检查用户是否有权更改状态 (批准/取消批准)
            if ($newStatus !== $item->status) {
                $actor->assertCan('approve', $item); // 检查是否有批准权限

                if (in_array($newStatus, ['approved', 'pending', 'rejected'])) {
                    if ($newStatus === 'approved' && $item->status !== 'approved') {
                        $item->approved_at = Carbon::now();
                        $item->approver_user_id = $actor->id;
                    } elseif ($newStatus !== 'approved') {
                        // 如果状态变为非 approved，清除批准信息
                        $item->approved_at = null;
                        $item->approver_user_id = null;
                    }
                    $item->status = $newStatus;
                    $isDirty = true;
                } else {
                    // 如果传递的状态值无效
                    throw new ValidationException(['status' => 'Invalid status value provided.']);
                }
            }
        }
        // --- 状态变更处理结束 ---

        // --- 处理标签更新 ---
        $relationships = Arr::get($data, 'relationships', []);
        if (isset($relationships['tags']['data'])) {
            $newTagIds = [];
            foreach ($relationships['tags']['data'] as $tagData) {
                if (isset($tagData['id'])) {
                    $newTagIds[] = $tagData['id'];
                }
            }

            // 在同步之前获取当前的标签ID，用于比较是否有变化
            $currentTagIds = $item->tags()->pluck('id')->all();
            // 对两个数组进行排序，以便准确比较
            sort($currentTagIds);
            sort($newTagIds);

            if ($currentTagIds !== $newTagIds) {
                // 验证标签ID是否存在等 (可以在 Validator 中完成)
                // 确保至少有一个标签，如果这是业务规则
                if (empty($newTagIds) && $item->status === 'approved') { // 例如：已批准的项必须有标签
                    // throw new ValidationException(['tags' => 'An approved item must have at least one tag.']);
                }
                $item->tags()->sync($newTagIds);
                $isDirty = true;
            }
        }
        // --- 标签更新处理结束 ---

        // 只有在实际发生更改时才保存
        if ($isDirty) {
            // 如果需要触发事件
            // $this->events->dispatch(new Events\ItemWillBeUpdated($item, $actor, $data));
            $item->save();
            // $this->events->dispatch(new Events\ItemWasUpdated($item, $actor, $data));
        }


        // 控制器最终会加载关联关系并使用序列化器返回更新后的模型
        return $item;
    }
}
```

### 文件路径: `src\Api\Controller\UpdateDependencyTagController.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Controller;

use Flarum\Api\Controller\AbstractShowController;
use Flarum\Http\RequestUtil;
use Illuminate\Support\Arr;
use Psr\Http\Message\ServerRequestInterface;
use Tobscure\JsonApi\Document;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Api\Serializer\DependencyTagSerializer;
use Shebaoting\DependencyCollector\Api\Validators\DependencyTagValidator;
// use Illuminate\Support\Str; // 不再需要

class UpdateDependencyTagController extends AbstractShowController
{
    public $serializer = DependencyTagSerializer::class;
    protected $validator;

    public function __construct(DependencyTagValidator $validator)
    {
        $this->validator = $validator;
    }

    protected function data(ServerRequestInterface $request, Document $document)
    {
        $actor = RequestUtil::getActor($request);
        $tagId = Arr::get($request->getQueryParams(), 'id');
        $data = Arr::get($request->getParsedBody(), 'data', []);
        $attributes = Arr::get($data, 'attributes', []);

        $actor->assertCan('dependency-collector.manageTags');

        $tag = DependencyTag::findOrFail($tagId);

        // 移除自动生成 slug 的逻辑

        $validationAttributes = $attributes;
        if (!isset($validationAttributes['id'])) {
            $validationAttributes['id'] = $tag->id;
        }
        $this->validator->assertValid($validationAttributes);

        $isDirty = false;
        if (isset($attributes['name']) && $attributes['name'] !== $tag->name) {
            $tag->name = $attributes['name'];
            $isDirty = true;
        }
        if (isset($attributes['slug']) && $attributes['slug'] !== $tag->slug) {
            $tag->slug = $attributes['slug'];
            $isDirty = true;
        }
        if (array_key_exists('description', $attributes) && $attributes['description'] !== $tag->description) {
            $tag->description = $attributes['description'];
            $isDirty = true;
        }
        if (array_key_exists('color', $attributes) && $attributes['color'] !== $tag->color) {
            $tag->color = $attributes['color'];
            $isDirty = true;
        }
        // --- 修改图标更新逻辑以包含默认值 ---
        if (array_key_exists('icon', $attributes)) { // 检查请求中是否包含 'icon'
            $newIcon = $attributes['icon'];
            // 如果提供的值为空字符串或 null，则使用默认图标；否则使用提供的值
            $finalIcon = empty($newIcon) ? 'fas fa-code' : $newIcon;
            if ($finalIcon !== $tag->icon) {
                $tag->icon = $finalIcon;
                $isDirty = true;
            }
        }
        // --- 图标更新逻辑结束 ---

        if ($isDirty) {
            $tag->save();
        }

        return $tag;
    }
}
```

### 文件路径: `src\Api\Serializer\DependencyItemSerializer.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Flarum\Api\Serializer\BasicUserSerializer;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Tobscure\JsonApi\Relationship;
use Tobscure\JsonApi\Resource as JsonApiResource;


class DependencyItemSerializer extends AbstractSerializer
{
    protected $type = 'dependency-items';

    /**
     * @param DependencyItem $item
     */
    protected function getDefaultAttributes($item)
    {
        $attributes = [
            'title'        => $item->title,
            'link'         => $item->link,
            'description'  => $item->description,
            'status'       => $item->status, // 确保 status 始终被序列化
            'submittedAt'  => $this->formatDate($item->submitted_at),
            'approvedAt'   => $this->formatDate($item->approved_at),
            'canEdit'      => $this->actor->can('edit', $item), // 使用 Policy 检查
            'canApprove'   => $this->actor->can('approve', $item), // 使用 Policy 检查
        ];

        // 注意：之前的 moderate 检查被合并到了 canApprove/canEdit 中，
        // status 属性现在总是包含的，前端可以根据 status 和 canEdit/canApprove 来决定显示什么。

        return $attributes;
    }

    // user(), approver(), tags() 方法保持不变
    protected function user($item): ?Relationship
    {
        return $this->hasOne($item, BasicUserSerializer::class);
    }

    protected function approver($item): ?Relationship
    {
        return $this->hasOne($item, BasicUserSerializer::class);
    }

    protected function tags($item): Relationship
    {
        return $this->hasMany($item, DependencyTagSerializer::class);
    }
}
```

### 文件路径: `src\Api\Serializer\DependencyTagSerializer.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Serializer;

use Flarum\Api\Serializer\AbstractSerializer;
use Shebaoting\DependencyCollector\Models\DependencyTag;

class DependencyTagSerializer extends AbstractSerializer
{
    protected $type = 'dependency-tags';

    /**
     * @param DependencyTag $tag
     */
    protected function getDefaultAttributes($tag)
    {
        return [
            'name'          => $tag->name,
            'slug'          => $tag->slug,
            'description'   => $tag->description,
            'color'         => $tag->color,
            'icon'          => $tag->icon,
            'createdAt'     => $this->formatDate($tag->created_at),
            'updatedAt'     => $this->formatDate($tag->updated_at),
            'itemCount'     => (int) $tag->items()->count(), // Optional: count of items with this tag
            'canEdit'       => $this->actor->can('dependency-collector.manageTags'),
        ];
    }
}
```

### 文件路径: `src\Api\Validators\DependencyItemValidator.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;
use Shebaoting\DependencyCollector\Models\DependencyTag;
use Shebaoting\DependencyCollector\Models\DependencyItem;
use Illuminate\Support\Arr; // Arr::get 可能仍然有用，但不是针对 $this->attributes

class DependencyItemValidator extends AbstractValidator
{
    /**
     * @var DependencyItem|null
     */
    protected $item;

    /**
     * @param DependencyItem $item
     */
    public function setItem(DependencyItem $item)
    {
        $this->item = $item;
    }

    protected function getRules()
    {
        // 判断是更新还是创建，基于 $this->item 是否已设置且存在
        $isUpdate = ($this->item && $this->item->exists);

        $rules = [
            'title' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:255'],
            'link' => [$isUpdate ? 'sometimes' : 'required', 'url', 'max:255'],
            'description' => [$isUpdate ? 'sometimes' : 'required', 'string', 'max:5000'],
            // 'tag_ids' 规则:
            // - 'sometimes': 表示只有当 tag_ids 字段在输入数据中存在时，后续规则才会应用。
            // - 'array': 值必须是数组。
            // - 对于创建 ($isUpdate 为 false):
            //    - 'required': tag_ids 字段必须存在。 (如果前端总是提交空数组，可以考虑去掉，依赖 min:1)
            //    - 'min:1': 数组至少要有一个元素。
            // - 对于更新 ($isUpdate 为 true):
            //    - 'nullable': 允许 tag_ids 为 null (或者前端可以不提交该字段，由 sometimes 控制)。
            //      如果前端提交空数组 []，它会被 'array' 规则接受，并且因为没有 'min:1'，所以是有效的（表示移除所有标签）。
            'tag_ids' => [
                'sometimes',
                'array',
                $isUpdate ? 'nullable' : 'required', // 创建时必须，更新时可空
            ],
            'tag_ids.*' => [
                'integer',
                Rule::exists((new DependencyTag)->getTable(), 'id')
            ],
            'status' => [
                'sometimes',
                Rule::in(['pending', 'approved', 'rejected'])
            ]
        ];

        if (!$isUpdate) {
            // 确保创建时 tag_ids 至少有一个元素
            // 如果 'tag_ids' => ['required', 'array', 'min:1'] 这样写更简洁
            // 这里我们附加 min:1 到已有的 'sometimes', 'array', 'required' 规则上
            // 需要确保 'tag_ids' 键本身是存在的，'required' 确保了这一点。
            $rules['tag_ids'][] = 'min:1';
        }


        return $rules;
    }

    protected function getMessages()
    {
        return [
            'tag_ids.required' => 'At least one plugin tag is required.',
            'tag_ids.min' => 'At least one plugin tag is required.',
            'tag_ids.*.exists' => 'One or more selected plugin tags are invalid.'
        ];
    }
}
```

### 文件路径: `src\Api\Validators\DependencyTagValidator.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Api\Validators;

use Flarum\Foundation\AbstractValidator;
use Illuminate\Validation\Rule;
use Shebaoting\DependencyCollector\Models\DependencyTag;

/**
 * DependencyTagValidator 类。
 * 用于验证创建和更新 DependencyTag 时的数据。
 * 继承自 Flarum 的 AbstractValidator，可以利用其提供的功能。
 */
class DependencyTagValidator extends AbstractValidator
{
    /**
     * 获取适用于创建或更新 DependencyTag 的验证规则。
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|string|array<string|\Illuminate\Contracts\Validation\Rule>>
     * 返回一个包含验证规则的关联数组。
     * 键是属性名 (例如 'name', 'slug')。
     * 值可以是字符串形式的规则 (例如 'required|string|max:100')，
     * 也可以是包含多个规则字符串或 Rule 对象的数组。
     */
    protected function getRules(): array
    {
        // 尝试从 AbstractValidator 的 $model 属性获取当前正在操作的模型实例。
        // 这个属性通常在处理更新请求时由 Flarum 核心或相关控制器设置。
        // 如果是创建操作 ($this->model 不存在或为 null)，则 $modelToIgnore 为 null。
        // Rule::unique(...)->ignore(null) 不会添加忽略条件，这是创建时所需的行为。
        // 如果是更新操作 ($this->model 是当前标签实例)，ignore() 会使用该实例的主键来排除自身。
        $modelToIgnore = $this->model ?? null;

        return [
            // 规则 for 'name' 字段
            'name' => [
                'sometimes', // 表示只有当 'name' 字段在输入数据中存在时，才应用后续规则
                'required',  // 如果存在，则该字段不能为空
                'string',    // 值必须是字符串类型
                'max:100',   // 字符串最大长度为 100 个字符
                // 使用 Rule::unique 来确保名称在数据库表中是唯一的
                Rule::unique((new DependencyTag)->getTable(), 'name') // 指定表名和列名
                    ->ignore($modelToIgnore), // 在更新时忽略当前模型实例，防止误判为重复
            ],
            // 规则 for 'slug' 字段
            'slug' => [
                'sometimes', // 仅当 'slug' 存在时验证
                'required',  // 如果存在，则不能为空
                'string',    // 必须是字符串
                'max:100',   // 最大长度 100
                'regex:/^[a-z0-9]+(?:-[a-z0-9]+)*$/', // 验证 slug 格式 (小写字母, 数字, 连字符)
                // 确保 slug 也是唯一的，同样忽略当前模型
                Rule::unique((new DependencyTag)->getTable(), 'slug')
                    ->ignore($modelToIgnore),
            ],
            // 规则 for 'description' 字段
            'description' => [
                'sometimes', // 仅当 'description' 存在时验证
                'nullable',  // 允许值为 null
                'string',    // 必须是字符串
                'max:255',   // 最大长度 255
            ],
            // 规则 for 'color' 字段
            'color' => [
                'sometimes', // 仅当 'color' 存在时验证
                'nullable',  // 允许值为 null
                'string',    // 必须是字符串
                'max:7',     // 最大长度 7 (如 #RRGGBB)
                'regex:/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/', // 验证 16 进制颜色格式
            ],
            // 规则 for 'icon' 字段
            'icon' => [
                'sometimes', // 仅当 'icon' 存在时验证
                'nullable',  // 允许值为 null
                'string',    // 必须是字符串
                'max:100',   // 最大长度 100 (FontAwesome 图标类名)
            ],
        ];
    }

    // 你可以根据需要重写 getMessages() 方法来自定义错误消息
    protected function getMessages()
    {
        return [
            'name.required' => '标签名称不能为空。',
            'name.unique' => '该标签名称已被使用。',
            'slug.unique' => '该标签标识符已被使用。',
            'slug.regex' => '标签标识符只能包含小写字母、数字和连字符。',
            'color.regex' => '颜色必须是有效的十六进制代码 (例如 #FF0000)。',
        ];
    }
}
```

### 文件路径: `src\Models\DependencyItem.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Models;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait;
use Flarum\User\User;
use Carbon\Carbon;

class DependencyItem extends AbstractModel
{
    use ScopeVisibilityTrait;

    protected $table = 'dependency_collector_items';

    protected $dates = ['submitted_at', 'approved_at'];

    protected $casts = [
        'id' => 'integer',
        'user_id' => 'integer',
        'approver_user_id' => 'integer',
    ];

    public static function build(string $title, string $link, string $description, int $userId)
    {
        $item = new static();
        $item->title = $title;
        $item->link = $link;
        $item->description = $description;
        $item->user_id = $userId;
        $item->status = 'pending'; // Default status
        $item->submitted_at = Carbon::now();

        return $item;
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_user_id');
    }

    public function tags()
    {
        return $this->belongsToMany(DependencyTag::class, 'dependency_collector_item_tag', 'item_id', 'tag_id');
    }
}
```

### 文件路径: `src\Models\DependencyTag.php`

```php
<?php

namespace Shebaoting\DependencyCollector\Models;

use Flarum\Database\AbstractModel;
use Flarum\Database\ScopeVisibilityTrait; // Might not be needed if tags are always public

class DependencyTag extends AbstractModel
{
    // use ScopeVisibilityTrait; // Consider if tags need visibility scoping

    protected $table = 'dependency_collector_tags';

    protected $dates = ['created_at', 'updated_at'];

    protected $fillable = ['name', 'slug', 'description', 'color', 'icon']; // For mass assignment

    public static function build(string $name, string $slug, ?string $description = null, ?string $color = null, ?string $icon = null)
    {
        $tag = new static();
        $tag->name = $name;
        $tag->slug = $slug;
        $tag->description = $description;
        $tag->color = $color;
        $tag->icon = $icon;

        return $tag;
    }

    public function items()
    {
        return $this->belongsToMany(DependencyItem::class, 'dependency_collector_item_tag', 'tag_id', 'item_id');
    }
}
```

