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
