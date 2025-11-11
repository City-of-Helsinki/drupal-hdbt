import PostalCodes from '../enum/PostalCodes';
import OptionType from '../types/OptionType';

export const getInitialAreaFilter = (key: string[] | string = '', options: OptionType[] = []) => options.find((option: OptionType) => option?.value === key.toString()) || null;

export const getAreaInfo = [ 
  {    
    key: 'eastern',
    label: Drupal.t('Eastern area', {}, {context: 'Search filter option: Eastern area'}),
    postalCodes: PostalCodes.eastern,
  },
  {
    key: 'central',
    label: Drupal.t('Central area', {}, {context: 'Search filter option: Central area'}),
    postalCodes: PostalCodes.central,    
  },
  { 
    key: 'southern',   
    label: Drupal.t('Southern area', {}, {context: 'Search filter option: Southern area'}),
    postalCodes: PostalCodes.southern,
  },
  { 
    key: 'southeastern',   
    label: Drupal.t('South-Eastern area', {}, {context: 'Search filter option: South-Eastern area'}),
    postalCodes: PostalCodes.southeastern,    
  },
  { 
    key: 'western',   
    label: Drupal.t('Western area', {}, {context: 'Search filter option: Western area'}),
    postalCodes: PostalCodes.western,
  },
  {
    key: 'northern',
    label: Drupal.t('Northern area', {}, {context: 'Search filter option: Northern area'}),
    postalCodes: PostalCodes.northern,
  },  
  { 
    key: 'northeast',   
    label: Drupal.t('North-Eastern area', {}, {context: 'Search filter option: North-Eastern area'}),
    postalCodes: PostalCodes.northeast,
  },
];

export default getAreaInfo;
