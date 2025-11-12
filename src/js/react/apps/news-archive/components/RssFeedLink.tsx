import { useAtomValue } from 'jotai';
import { urlAtom } from '../store';

const RssFeedLink = () => {
  const params = useAtomValue(urlAtom);
  const feedBaseUrl =
    drupalSettings?.helfi_news_archive?.feed_base_url ?? '/news/rss';

  const getFeedUrl = () => {
    const feedUrlWithParams = window.location.search
      ? feedBaseUrl + window.location.search
      : feedBaseUrl;

    document
      .getElementById('news-feed-url')
      ?.setAttribute('href', feedUrlWithParams);

    return feedUrlWithParams;
  };

  const choices =
    params.topic?.length ||
    params.neighbourhoods?.length ||
    params.groups?.length;

  return (
    <div className='news-archive__rss-link__container'>
      <a
        href={getFeedUrl()}
        className='news-archive__rss-link'
        data-hds-variant='supplementary'
        data-hds-component='button'
        data-hds-icon-start='rss'
      >
        {choices
          ? Drupal.t(
              'Subscribe to RSS feed of news based on your choices',
              {},
              { context: 'News RSS feed subscribe link' },
            )
          : Drupal.t(
              'Subscribe to all news as RSS feed',
              {},
              { context: 'News RSS feed subscribe link' },
            )}
      </a>
    </div>
  );
};

export default RssFeedLink;
