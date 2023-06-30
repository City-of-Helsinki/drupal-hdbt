const MostReadNews = () => {
  const mostReadBlocks = (document.querySelector('noscript.most-read-news') as HTMLElement)?.innerText;

  if (!mostReadBlocks) {
    return null;
  }

  return <div className='layout-sidebar-second' dangerouslySetInnerHTML={{ __html: mostReadBlocks.trim() }} />;
};

export default MostReadNews;
