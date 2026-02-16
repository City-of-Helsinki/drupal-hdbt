import type VehicleRemoval from '../types/VehicleRemoval';

const ResultCard = ({ item }: { item: VehicleRemoval }) => (
  <div className='hdbt-search--vehicle-removal__result-card'>
    <h3 className='hdbt-search--vehicle-removal__result-card--title hdbt-search--title'>{item.address}</h3>
    <div>
      {item.reason && <p>{item.reason}</p>}
      {item.time_range && <p>{item.time_range}</p>}
      {(item.valid_from || item.valid_to) && (
        <p>
          {item.valid_from}
          {item.valid_from && item.valid_to && ' – '}
          {item.valid_to}
        </p>
      )}
      {item.sign_type && <p>{item.sign_type}</p>}
      {item.notes && <p>{item.notes}</p>}
      {item.phone && <p>{item.phone}</p>}
      {item.additional_text && <p>{item.additional_text}</p>}
    </div>
  </div>
);

export default ResultCard;
