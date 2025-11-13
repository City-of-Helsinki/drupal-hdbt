import IndexFields from '../enum/IndexFields';
import SearchComponents from '../enum/SearchComponents';

export const ComponentMap = {
  [SearchComponents.TITLE]: `${IndexFields.TITLE}`,
  [SearchComponents.DISTRICTS]: `${IndexFields.FIELD_PROJECT_DISTRICT_TITLE}`,
  [SearchComponents.THEME]: `${IndexFields.FIELD_PROJECT_THEME_NAME}`,
  [SearchComponents.PHASE]: `${IndexFields.FIELD_PROJECT_PHASE_NAME}`,
  [SearchComponents.TYPE]: `${IndexFields.FIELD_PROJECT_TYPE_NAME}`,
};

export const capitalize = (s: string) => {
  if (typeof s !== 'string') {
    return '';
  }
  return s.charAt(0).toUpperCase() + s.slice(1);
};
