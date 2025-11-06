export const BloatingTargetGroups = [
  // Palvelukeskus
  'helsinki:aflfbat76e',
  // Youth
  'yso:p11617',
  // Families with babies
  'yso:p13050',
  // School students
  'yso:p1648',
  // Families with babies
  'yso:p20513',
  // Seniors
  'yso:p2433',
  // Children
  'yso:p4354',
  // Elementary school students (Peruskoululaiset)
  'yso:p16485',
  // Elementary school studentes (Alakoululaiset) duplicate tag
  'yso:p38259',
  // Children (age groups) a duplicate children tag?
  'yso:p4354',
  // Playgrounds
  'yso:p8105',
];

export const TargetGroups = {
  [Drupal.t('Families with babies', {}, { context: 'Event search: target group' })]: {
    ids: ['yso:p20513'],
  },
  [Drupal.t('Children', {}, { context: 'Event search: target group' })]: {
    ids: ['yso:p4354'],
  },
  [Drupal.t('Youth', {}, { context: 'Event search: target group' })]: {
    ids: ['yso:p11617'],
  },
  [Drupal.t('Adults', {}, { context: 'Event search: target group' })]: {
    negateIds: BloatingTargetGroups,
  },
  [Drupal.t('Seniors', {}, { context: 'Event search: target group' })]: {
    ids: ['yso:p2433'],
  },
  [Drupal.t('Immigrants', {}, { context: 'Event search: target group' })]: {
    ids: ['yso:p6165'],
  },
  [Drupal.t('Unemployed', {}, { context: 'Event search: target group' })]: {
    ids: [
      // "Unemployed"
      'yso:p7708',
      // "Long term unemployed"
      'yso:p7709',
    ],
  },
  [Drupal.t('Tourists', {}, { context: 'Event search: target group' })]: {
    ids: [
      // "Tourists and travellers"
      'yso:p16596',
      // "Tourist areas"
      'yso:p3451',
      // "Sights and attractions"
      'yso:p8134',
    ],
  },
};
