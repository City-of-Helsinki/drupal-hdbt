const RssFeedLink = () => {
  const feedBaseUrl = drupalSettings?.helfi_news_archive?.feed_base_url ?? '/news/rss';

  const getFeedUrl = () => {
    const feedUrlWithParams = window.location.search ? feedBaseUrl + window.location.search : feedBaseUrl;

    document.getElementById('news-feed-url')?.setAttribute('href', feedUrlWithParams);

    return feedUrlWithParams;
  };

  return (
    <a href={getFeedUrl()} className='link'>
      <span className='link-text'>{Drupal.t('Subscribe RSS', {}, { context: 'RSS feed subscribe link' })}</span>
    </a>
  );
};

export default RssFeedLink;
