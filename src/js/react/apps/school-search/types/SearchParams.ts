type SearchParams = {
  keyword?: string;
  finnish_education?: boolean;
  grades_1_6?: boolean;
  grades_1_9?: boolean;
  grades_7_9?: boolean;
  swedish_education?: boolean;
  a1?: string[];
  a2?: string[];
  b1?: string[];
  b2?: string[];
  weighted_education?: string[];
  bilingual_education?: string[];
  page?: number;
  query?: string;
};

export default SearchParams;
