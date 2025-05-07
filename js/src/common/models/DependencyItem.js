import Model from 'flarum/common/Model';
import mixin from 'flarum/common/utils/mixin'; // Not strictly needed for simple models but good to know
import { getPlainContent } from 'flarum/common/utils/string';

export default class DependencyItem extends Model {
  title = Model.attribute('title');
  link = Model.attribute('link');
  description = Model.attribute('description');
  status = Model.attribute('status');
  submittedAt = Model.attribute('submittedAt', Model.transformDate);
  approvedAt = Model.attribute('approvedAt', Model.transformDate);

  user = Model.hasOne('user');
  approver = Model.hasOne('approver');
  tags = Model.hasMany('tags'); // 'tags' here must match the relationship name in DependencyItemSerializer

  canEdit = Model.attribute('canEdit');
  canApprove = Model.attribute('canApprove');

  // Helper for description preview
  shortDescription(length = 100) {
    const desc = this.description();
    if (!desc) return '';
    // A more sophisticated truncation might be needed (e.g. strip HTML if description can contain it)
    return getPlainContent(desc).substring(0, length) + (desc.length > length ? '...' : '');
  }
}
