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
});
