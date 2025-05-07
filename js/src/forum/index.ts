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
