/* eslint-disable no-template-curly-in-string */

const translations = {
  household_size: {
    fi: 'Perheen koko',
    sv: 'Familjens storlek',
    en: 'Family size',
  },
  household_size_explanation: {
    fi: 'Samassa osoitteessa asuvien aikuisten ja alaikäisten lasten määrä.',
    sv: 'Antal vuxna och minderåriga som bor på samma adress.',
    en: 'The number of adults and minor children living at the same address.',
  },
  gross_income_per_month: {
    fi: 'Perheen bruttotulot kuukaudessa',
    sv: 'Familjens bruttoinkomster per månad',
    en: 'Family\'s gross income per month',
  },
  gross_income_per_month_explanation: {
    fi: 'Koko perheen yhteenlasketut ansio- ja pääomatulot sekä etuudet ennen verojen vähentämistä. Jos jätät kentän tyhjäksi, lasketaan arvio korkeimman maksun mukaisesti.',
    sv: 'Hela familjens sammanlagda förvärvs- och kapitalinkomster samt förmåner före skatteavdrag. Om du lämnar fältet tomt beräknas bedömningen enligt den högsta avgiften.',
    en: 'The whole family\'s total income from earnings, capital income and benefits before taxes. If you leave the field blank, the estimate will be calculated using the highest fee.',
  },
  monthly_usage: {
    fi: 'Palvelutunteja kuukaudessa',
    sv: 'Servicetimmar per månad',
    en: 'Hours of services per month',
  },
  monthly_usage_explanation: {
    fi: 'Löydät tuntimäärän kotipalvelun päätöksestä.',
    sv: 'Du hittar antalet timmar i hemservicens beslut.',
    en: 'You can find the number of hours in the home service decision.',
  },
  receipt_estimate_of_payment: {
    fi: 'Arvio lapsiperheiden kotipalvelun asiakasmaksusta',
    sv: 'Bedömning av klientavgiften för hemservicen för barnfamiljer',
    en: 'Estimate of the client fee for home services for families with children',
  },
  receipt_estimated_payment_prefix: {
    fi: 'Arvioitu asiakasmaksu on',
    sv: 'Den beräknade klientavgiften är',
    en: 'Your estimated client fee is',
  },
  receipt_estimated_payment_suffix: {
    fi: 'euroa kuukaudessa.',
    sv: 'euro per månad.',
    en: 'euros per month.',
  },
  receipt_estimated_payment_explanation: {
    fi: 'Tämä arvio on suuntaa antava. Tarkan asiakasmaksun saat kotipalvelun päätöksessä.',
    sv: 'Denna bedömning är riktgivande. Du får den exakta klientavgiften i hemservicens beslut.',
    en: 'This estimate is indicative only. Your exact client fee will be stated in the home service decision.',
  },
  receipt_additional_details: {
    fi: 'Lisähuomiot:',
    sv: 'Ytterligare anmärkningar:',
    en: 'Additional remarks:',
  },
  receipt_additional_detail: {
    fi: 'Lapsiperheiden kotipalvelusta laskutetaan käytetyn palvelun perusteella tuntihinnan mukaan.',
    sv: 'Hemservice för barnfamiljer faktureras utifrån den servicemängd som används baserat på timpriset.',
    en: 'The home services for families with children will be charged on the basis of the services used based on the hourly rate.',
  },
  receipt_aria_live: {
    fi: 'Arvioitu asiakasmaksu on ${payment} euroa kuukaudessa, lue lisätietoja lomakkeen alta.',
    sv: 'Den beräknade klientavgiften är ${payment} euro per månad, mer information under blanketten.',
    en: 'The estimated client fee is ${payment} euros per month; read more under the form.',
  },
};

export default translations;
