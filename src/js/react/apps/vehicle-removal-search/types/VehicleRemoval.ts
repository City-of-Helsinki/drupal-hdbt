interface VehicleRemoval {
  id: string;
  // Notice number, the same on the kartta.hel.fi notice layer.
  notice_number?: number;
  address: string;
  address_info: string;
  street_names: string[];
  postal_codes: string[];
  // Not every item has the parking zone data.
  parking_zone_names?: string[];
  reason: string;
  sign_type: string;
  notes: string;
  phone: string;
  additional_text: string;
  time_range: string;
  valid_from: number[] | number | string[] | string;
  valid_to: number[] | number | string[] | string;
  map_url: string;
}

export default VehicleRemoval;
