interface FilterSettings {
  coordinates?: {
    lat: number;
    lon: number;
  };
  distance?: number;
  langcode?: string;
  address?: string;
}

export default FilterSettings;
