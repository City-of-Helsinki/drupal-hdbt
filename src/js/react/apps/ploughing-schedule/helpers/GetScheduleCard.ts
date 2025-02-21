import parse from 'html-react-parser';

const getScheduleCard = (maintenanceClass: number, several?: boolean) => {
  if (maintenanceClass > 0) {
    const schedules: any = [];
    schedules[1] = Drupal.t('We will start to clear snow when there is three centimetres of snow.<br>We will clear the street of snow within four hours. If snow has fallen in the evening or late into the night (19.00–3.00), we will clear the street by seven in the morning.<br>If it snows heavily and for a long time, clearing may be delayed.', {}, {context: 'Ploughing schedule: Class 1'});
    schedules[2] = Drupal.t('We will start to clear snow when there is three centimetres of snow.<br>We will clear the street of snow within four hours. If snow has fallen in the evening or late into the night (19.00–3.00), we will clear the street by seven in the morning.<br>If it snows heavily and for a long time, clearing may be delayed.', {}, {context: 'Ploughing schedule: Class 2'});
    schedules[3] = Drupal.t('We will start to clear snow when there is five centimetres of snow.<br>We will clear the street of snow within 12 hours. If snow has fallen in the evening or during the night (19.00–7.00), we will clear the street by seven the next evening.<br>If it snows heavily and for a long time, clearing may be delayed.', {}, {context: 'Ploughing schedule: Class 3'});
    const leadText: string = Drupal.t('The estimated ploughing schedules for the different parts of the street differ from each other. Below is the ploughing schedule for the longest part of the street.', {}, {context: 'Ploughing schedule: Multiple streets'});

    return {
      'title': Drupal.t('Estimated ploughing schedule', {}, {context: 'Ploughing schedule: Result title'}),
      'description': parse(schedules[maintenanceClass]),
      'lead': several ? leadText : ''
    };
  }

  return {
    'title': Drupal.t('No results', {}, { context: 'No search results' }),
    'description': Drupal.t('No results were found for the criteria you entered. Try changing your search criteria.', {}, { context: 'React search: no search results' })
  };
};

export default getScheduleCard;
