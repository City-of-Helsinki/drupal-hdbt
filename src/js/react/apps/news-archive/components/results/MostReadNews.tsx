import parse from 'html-react-parser';

const MostReadNews = () => {
  const mostReadBlocks = (document.querySelector('noscript.most-read-news') as HTMLElement)?.innerText;

  if (!mostReadBlocks) {
    return null;
  }

  return <div className='layout-sidebar-second'>{parse(mostReadBlocks.trim())}</div>;
};

export default MostReadNews;
