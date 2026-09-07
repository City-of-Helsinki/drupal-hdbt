export const BloatingTargetGroups = [
  // Palvelukeskus
  'helsinki:aflfbat76e',
  // Youth
  'yso:p11617',
  // Families with babies
  'yso:p13050',
  // Families with babies
  'yso:p20513',
  // Babies
  'yso:p15937',
  // Seniors
  'yso:p2433',
  // Children
  'yso:p4354',
  // Elementary school students (Peruskoululaiset)
  'yso:p16485',
  // Elementary school studentes (Alakoululaiset) duplicate tag
  'yso:p38259',
  // Playgrounds
  'yso:p8105',
];

export const TargetGroups = {
  [Drupal.t('Babies', {}, { context: 'Event search: target group' })]: {
    ids: ['yso:p20513', 'yso:p15937'],
  },
  [Drupal.t('Children', {}, { context: 'Event search: target group' })]: {
    ids: ['yso:p4354', 'yso:p13050'],
  },
  [Drupal.t('Youth', {}, { context: 'Event search: target group' })]: { ids: ['yso:p11617'] },
  [Drupal.t('Adults', {}, { context: 'Event search: target group' })]: { negateIds: BloatingTargetGroups },
  [Drupal.t('Seniors', {}, { context: 'Event search: target group' })]: { ids: ['yso:p2433'] },
};
