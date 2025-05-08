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
  canDelete = Model.attribute('canDelete'); // 确保存储从后端接收的 canDelete 权限
  shortDescription(length = 100) {
    const desc = this.description();
    if (!desc) return '';
    return getPlainContent(desc).substring(0, length) + (desc.length > length ? '...' : '');
  }
}
