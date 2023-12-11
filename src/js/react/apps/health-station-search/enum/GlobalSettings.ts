const GlobalSettings = {
  addressBaseUrl: 'https://api.hel.fi/servicemap/v2/search?municipality=helsinki&type=address&q=heteniityntie&page=1&page_size=1&language=fi&format=json',
  index: 'health_stations',
  locationsBaseUrl: 'https://api.hel.fi/servicemap/v2/administrative_division/?municipality=helsinki&type=health_station_district&unit_include=id',
  size: 10
};

export default GlobalSettings;
