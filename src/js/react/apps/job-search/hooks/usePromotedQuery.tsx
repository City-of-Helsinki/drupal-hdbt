import Global from '../enum/Global';
import IndexFields from '../enum/IndexFields';
import URLParams from '../types/URLParams';
import useQueryString from './useQueryString';

const usePromotedQuery = (promoted: number[], urlParams: URLParams): string => {
  const { size } = Global;
  const page = Number.isNaN(Number(urlParams.page)) ? 1 : Number(urlParams.page);
  const baseQuery = useQueryString(urlParams, promoted);
  const promotedQuery = JSON.parse(baseQuery);
  
  const promotedClause = {
    terms: {
      [IndexFields.NID]: promoted
    }
  };

  delete(promotedQuery.query.bool.must[0].bool.must_not);
  promotedQuery.query.bool.must.push(promotedClause);
  promotedQuery.size = size;
  promotedQuery.from = size * (page - 1);

  const ndJsonHeader = '{}';

  return `${ndJsonHeader  }\n${  JSON.stringify(promotedQuery)  }\n${  ndJsonHeader  }\n${  baseQuery  }\n`;
};

export default usePromotedQuery;
