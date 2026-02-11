interface VehicleRemoval {
  id: string;
  address: string;
  address_info: string;
  street_names: string[];
  reason: string;
  sign_type: string;
  notes: string;
  phone: string;
  additional_text: string;
  time_range: string;
  valid_from: string;
  valid_to: string;
}

export default VehicleRemoval;
