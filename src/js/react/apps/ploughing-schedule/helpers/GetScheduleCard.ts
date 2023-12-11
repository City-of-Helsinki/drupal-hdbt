const getScheduleCard = (maintenanceClass: number, several?: boolean) => {
  if (maintenanceClass > 0) {
    const schedules: any = [];
    schedules[1] = Drupal.t('We will plough the street by 7.00, if it has snowed in the evening or during the early hours of the night. If it snows between 4.00 and 18.00, we will plough the street within three hours of the end of the snowfall. Ploughing may be delayed if it snows a lot and for an extended period.', {}, {context: 'Ploughing schedule: Class 1'});
    schedules[2] = Drupal.t('We will plough the street by 7.00, if it has snowed in the evening or during the early hours of the night. If it snows between 4.00 and 17.00, we will plough the street within four hours of the end of the snowfall. Ploughing may be delayed if it snows a lot and for an extended period.', {}, {context: 'Ploughing schedule: Class 2'});
    schedules[3] = Drupal.t('We will plough the street within three business days. Ploughing may be delayed if it snows a lot and for an extended period.', {}, {context: 'Ploughing schedule: Class 3'});
  
    const leadText: string = Drupal.t('The estimated ploughing schedules for the different parts of the street differ from each other. Below is the ploughing schedule for the longest part of the street.', {}, {context: 'Ploughing schedule: Multiple streets'});

    return {
      'title': Drupal.t('Estimated ploughing schedule', {}, {context: 'Ploughing schedule: Result title'}),
      'description': schedules[maintenanceClass],
      'lead': several ? leadText : ''
    };
  }

  return {
    'title': Drupal.t('No results', {}, {context: 'No search results'}),
    'description': Drupal.t('No results were found for the criteria you entered. Try changing your search criteria.', 
      {}, 
      {context: 'Ploughing schedule: No search results description'})
  };
};

export default getScheduleCard;
