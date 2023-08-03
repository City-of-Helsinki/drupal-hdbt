import { IconRss } from 'hds-react';
import { useAtomValue } from 'jotai';
import { urlAtom } from '../store';

const RssFeedLink = () => {
  const params = useAtomValue(urlAtom);
  const feedBaseUrl = drupalSettings?.helfi_news_archive?.feed_base_url ?? '/news/rss';

  const getFeedUrl = () => {
    const feedUrlWithParams = window.location.search ? feedBaseUrl + window.location.search : feedBaseUrl;

    document.getElementById('news-feed-url')?.setAttribute('href', feedUrlWithParams);

    return feedUrlWithParams;
  };

  const choices = params.topic?.length || params.neighbourhoods?.length || params.groups?.length;

  return (
    <a href={getFeedUrl()} className='news-archive__rss-link'>
      <IconRss aria-hidden />
      <span>
        {choices ? 
          Drupal.t('Subscribe to RSS feed of news based on your choices', {}, {context: 'News RSS feed subscribe link'}) :
          Drupal.t('Subscribe to all news as RSS feed', {}, {context: 'News RSS feed subscribe link'})
        }
      </span>
    </a>
  );
};

export default RssFeedLink;
