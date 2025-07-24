interface Roadwork {
  id: string;
  title: string;
  description?: string;
  url?: string;
  location?: string;
  schedule?: string;
  startDate?: string;
  endDate?: string;
  distance?: number;
  coordinates?: {
    lat: number;
    lon: number;
  };
}

export default Roadwork;
