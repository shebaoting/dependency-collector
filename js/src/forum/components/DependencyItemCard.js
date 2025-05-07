import Component from 'flarum/common/Component';
import Link from 'flarum/common/components/Link';
import avatar from 'flarum/common/helpers/avatar';
import username from 'flarum/common/helpers/username';
import humanTime from 'flarum/common/utils/humanTime';
import classList from 'flarum/common/utils/classList';

export default class DependencyItemCard extends Component {
  view() {
    const item = this.attrs.item;
    const user = item.user();
    // const approver = item.approver(); // If you want to show approver

    return (
      <div className={classList('DependencyItemCard', item.status() === 'pending' && 'DependencyItemCard--pending')}>
        {item.status() === 'pending' && (
          <span className="DependencyItemCard-statusBadge">
            {app.translator.trans('shebaoting-dependency-collector.forum.item.pending_approval')}
          </span>
        )}
        <div className="DependencyItemCard-header">
          <h3 className="DependencyItemCard-title">
            <a href={item.link()} target="_blank" rel="noopener noreferrer">
              {item.title()}
            </a>
          </h3>
        </div>
        <div className="DependencyItemCard-body">
          <p className="DependencyItemCard-description">{item.shortDescription(150)}</p>
        </div>
        <div className="DependencyItemCard-footer">
          <div className="DependencyItemCard-tags">
            {item.tags() &&
              item.tags().map((tag) => (
                <Link
                  className="DependencyItemCard-tag"
                  href={app.route('dependency-collector.forum.index', { filter: { tag: tag.slug() } })}
                  style={{ backgroundColor: tag.color(), color: 'white' /* Adjust based on color contrast */ }}
                >
                  {tag.icon() && <i className={tag.icon() + ' DependencyItemCard-tagIcon'}></i>}
                  {tag.name()}
                </Link>
              ))}
          </div>
          <div className="DependencyItemCard-meta">
            {user && (
              <span className="DependencyItemCard-submitter">
                {avatar(user, { className: 'DependencyItemCard-avatar' })}
                {username(user)}
              </span>
            )}
            <span className="DependencyItemCard-time" title={item.submittedAt().toLocaleString()}>
              {humanTime(item.submittedAt())}
            </span>
            {/* Optional: Show approved at/by */}
          </div>
        </div>
      </div>
    );
  }
}
