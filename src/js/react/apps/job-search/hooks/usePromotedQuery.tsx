import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import type URLParams from '../types/URLParams';

const usePromotedQuery = (baseQuery: string, urlParams: URLParams): string => {
  const { size } = Global;
  const page = Number.isNaN(Number(urlParams.page)) ? 1 : Number(urlParams.page);
  const promotedQuery = JSON.parse(baseQuery);

  const promotedClause = {
    term: {
      [IndexFields.PROMOTED]: true,
    },
  };

  delete promotedQuery.query.bool.must[0].bool.must_not;
  promotedQuery.query.bool.must.push(promotedClause);
  promotedQuery.size = size;
  promotedQuery.from = size * (page - 1);

  const ndJsonHeader = '{}';

  return `${ndJsonHeader}\n${JSON.stringify(promotedQuery)}\n${ndJsonHeader}\n${baseQuery}\n`;
};

export default usePromotedQuery;
