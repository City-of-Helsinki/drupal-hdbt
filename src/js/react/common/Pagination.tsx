import Icon from '@/react/common/Icon';

type PaginationProps = {
  updatePage: Function;
  currentPage: number;
  pages: number;
  totalPages: number;
};

const getPagination = (current: number, pages: number, totalPages: number) => {
  const pagesPerSide = Math.floor(pages / 2);
  let pagesLeft = pagesPerSide * 2;
  const prevPages: Array<number> = [];
  const nextPages: Array<number> = [];

  if (pagesPerSide > 0) {
    for (let i = current - 1; prevPages.length < pagesPerSide && i >= 1; i--) {
      prevPages.push(i);
      pagesLeft -= 1;
    }
    for (let i = current + 1; pagesLeft > 0 && i <= totalPages; i++) {
      nextPages.push(i);
      pagesLeft -= 1;
    }
  }

  prevPages.reverse();

  return {
    prevPages,
    nextPages,
  };
};

export const Pagination = ({ updatePage, currentPage, pages, totalPages }: PaginationProps) => {
  const { prevPages, nextPages } = getPagination(currentPage, pages, totalPages);
  const prevPageExists = currentPage > 1;
  const nextPageExists = currentPage < totalPages;
  const firstWithinRange = prevPages.includes(1) || !prevPages.length;
  const lastWithinRange = nextPages.includes(totalPages) || !nextPages.length;

  return (
    <div className='hds-pagination-container'>
      <nav
        className='hds-pagination pager'
        role='navigation'
        aria-label={Drupal.t('Pagination', {}, { context: 'Pagination aria-label' })}
        data-next={Drupal.t('Next', {}, { context: 'Pagination next page link text' })}
      >
        {prevPageExists ? (
          <a
            aria-label={`${Drupal.t('Go to previous page number', {}, { context: 'Pagination previous page link title' })} ${currentPage - 1}`}
            className='hds-button hds-pagination__button-prev'
            href={`?page=${currentPage}`}
            onClick={(e) => {
              if (prevPageExists) {
                updatePage(e, currentPage - 1);
              }
            }}
            title={`${Drupal.t('Go to previous page number', {}, { context: 'Pagination previous page link title' })} ${currentPage - 1}`}
            type='button'
            rel='prev'
            role='button'
          >
            <Icon icon="angle-left" />
            <span aria-hidden='true' className='hds-pagination__button-prev-label'>
              {Drupal.t('Previous', {}, { context: 'Pagination previous page link text' })}
            </span>
          </a>
        ) : (
          <button
            className='hds-button hds-pagination__button-prev'
            disabled
            title={Drupal.t('You are on the first page, you cannot return to the previous page.', {}, { context: 'Pagination previous page link title, first page' })}
            type='button'
          >
            <Icon icon="angle-left" />
            <span aria-hidden='true' className='hds-pagination__button-prev-label'>
              {Drupal.t('Previous', {}, { context: 'Pagination previous page link text' })}
            </span>
          </button>
        )}
        <ul className='pager__items js-pager__items hds-pagination__pages'>
          {!firstWithinRange && (
            <>
              <li>
                <a
                  href="?page=1"
                  onClick={(e) => {
                    if (prevPageExists) {
                      updatePage(e, 1);
                    }
                  }}
                  className='hds-pagination__item-link'
                >
                  1
                </a>
              </li>
              {prevPages[0] - 1 > 0 && (
                <li className='pager__item pager__item--ellipsis' role='presentation'>
                  <span className='hds-pagination__item-ellipsis'>&hellip;</span>
                </li>
              )}
            </>
          )}
          {prevPages.map((pageIndex, i) => (
            <li className='pager__item' key={i}>
              <a
                aria-label={Drupal.t('Go to page @key', { '@key': pageIndex }, { context: 'React search pager'})}
                href={`?page=${pageIndex}`}
                className='hds-pagination__item-link'
                onClick={(e) => updatePage(e, pageIndex)}
                key={pageIndex}
              >
                {pageIndex}
              </a>
            </li>
          ))}
          <li className='pager__item is-active'>
            <a
              href={`?page=${currentPage}`}
              className='hds-pagination__item-link hds-pagination__item-link--active'
            >
              {currentPage}
            </a>
          </li>
          {nextPages.map((pageIndex, i) => (
            <li className='pager__item' key={i}>
              <a
                aria-label={Drupal.t('Go to page @key', { '@key': pageIndex }, { context: 'React search pager'})}
                href={`?page=${pageIndex}`}
                className='hds-pagination__item-link'
                onClick={(e) => updatePage(e, pageIndex)}
                key={pageIndex}
              >
                {pageIndex}
              </a>
            </li>
          ))}
          {!lastWithinRange && (
            <>
              {nextPages[nextPages.length - 1] + 1 !== totalPages && (
                <li>
                  <span className='hds-pagination__item-ellipsis'>...</span>
                </li>
              )}
              <li>
                <a
                  href={`?page=${totalPages}`}
                  onClick={(e) => updatePage(e, totalPages)}
                  className='hds-pagination__item-link'
                >
                  {totalPages}
                </a>
              </li>
            </>
          )}
        </ul>
        {nextPageExists ? (
          <a
            aria-label={`${Drupal.t('Go to next page number', {}, { context: 'Pagination next page link title' })} ${currentPage + 1}`}
            className='hds-button hds-pagination__button-next'
            href={`?page=${currentPage + 2}`}
            onClick={(e) => {
              if (nextPageExists) {
                updatePage(e, currentPage + 1);
              }
            }}
            title={`${Drupal.t('Go to next page number', {}, { context: 'Pagination next page link title' })} ${currentPage + 1}`}
            type='button'
            rel='next'
            role='button'
          >
            <span aria-hidden='true' className='hds-pagination__button-next-label'>
              {Drupal.t('Next', {}, { context: 'Pagination next page link text' })}
            </span>
            <Icon icon="angle-right" />
          </a>
        ) : (
          <button
            className='hds-button hds-pagination__button-next'
            disabled
            title={Drupal.t('You are on the last page, you cannot go on to the next page.', {}, { context: 'Pagination next page link title, last page' })}
            type='button'
          >
            <span aria-hidden='true' className='hds-pagination__button-next-label'>
              {Drupal.t('Next', {}, { context: 'Pagination next page link text' })}
            </span>
            <Icon icon="angle-right" />
          </button>
        )}
      </nav>
    </div>
  );
};

export default Pagination;
