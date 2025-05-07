import app from 'flarum/common/app';

app.initializers.add('shebaoting/dependency-collector', () => {
  console.log('[shebaoting/dependency-collector] Hello, forum and admin!');
});
