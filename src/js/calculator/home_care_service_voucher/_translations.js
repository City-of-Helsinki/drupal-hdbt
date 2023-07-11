
/* eslint-disable no-template-curly-in-string */

const translations = {
  household_size: {
    fi: 'Talouden koko',
    sv: 'Hushållets storlek',
    en: 'Household size',
  },
  household_size_explanation: {
    fi: 'Samassa osoitteessa asuvien perheenjäsenten määrä.',
    sv: 'Antal familjemedlemmar som bor på samma adress.',
    en: 'The number of family members living at the same address.',
  },
  gross_income_per_month: {
    fi: 'Talouden bruttotulot kuukaudessa',
    sv: 'Hushållets bruttoinkomster per månad',
    en: 'Household\'s gross income per month',
  },
  gross_income_per_month_explanation: {
    fi: 'Koko talouden yhteenlasketut ansio- ja pääomatulot ennen verojen vähentämistä. Tuloihin lasketaan palkka, eläke-, vuokra- ja korkotulot sekä eläkkeensaajan hoitotuki. Jos jätät kentän tyhjäksi, lasketaan arvio korkeimman tulorajan mukaisesti.',
    sv: 'Hela hushållets sammanlagda förvärvs- och kapitalinkomster före skatteavdrag. I inkomsterna ingår lön, pensions-, hyres och ränteinkomster samt vårdbidrag för pensionstagare. Om du lämnar fältet tomt beräknas bedömningen enligt den högsta inkomstgränsen.',
    en: 'The entire household\'s combined income from earnings and capital income before taxes. Income includes salary, wages, pension, rental and interest income as well as care allowance for pensioners. If you leave the field blank, the estimate will be calculated using the highest income threshold.',
  },
  monthly_usage: {
    fi: 'Kotihoidon tuntimäärä kuukaudessa',
    sv: 'Antal hemvårdstimmar per månad',
    en: 'Number of hours of home care per month',
  },
  monthly_usage_explanation: {
    fi: 'Löydät tuntimäärän kotihoidon palvelu- ja hoitosuunnitelmasta.',
    sv: 'Du hittar antalet timmar i hemvårdens service- och vårdplan.',
    en: 'You can find the number of hours in the home care service and care plan.',
  },
  service_provider_price: {
    fi: 'Palveluntuottajan tuntihinta',
    sv: 'Serviceproducentens timpris',
    en: 'Service provider\'s hourly rate',
  },
  service_provider_price_explanation: {
    fi: 'Valitsemasi palveluntuottajan tuntihinta kotihoidon palveluista.',
    sv: 'Timpris för den serviceproducent som du väljer för hemvård.',
    en: 'The service provider\'s hourly rate for the home care services of your choice.',
  },

  receipt_estimate_of_payment: {
    fi: 'Arvio palvelusetelillä hankitusta kotihoidosta',
    sv: 'Bedömning av den hemvård som förvärvats med servicesedeln',
    en: 'Estimate of home care acquired with a service voucher',
  },
  receipt_family_estimated_payment_prefix: {
    fi: 'Omavastuuosuus eli sinulle maksettavaksi jäävä asiakasmaksu on',
    sv: 'Självriskandelen, det vill säga den klientavgift som återstår att betala hos dig, är',
    en: 'The copayment, i.e. the client fee payable by you, is',
  },
  receipt_family_estimated_payment_suffix: {
    fi: 'euroa kuukaudessa.',
    sv: 'euro per månad.',
    en: 'euros per month.',
  },
  receipt_family_empty_income: {
    fi: 'Arvio on laskettu korkeimman maksun mukaisesti, koska et täyttänyt laskuriin talouden kuukausituloja. ',
    sv: 'Bedömningen har beräknats enligt den högsta avgiften eftersom du inte fyllde i hushållets månadsinkomster i räknaren. ',
    en: 'Since you did not enter the household\'s monthly income in the calculator, the estimate was calculated using the highest fee. ',
  },
  receipt_family_estimated_payment_explanation: {
    fi: 'Tämä arvio on suuntaa antava. Tarkka arvo lasketaan kotihoidon päätökseen.',
    sv: 'Denna bedömning är riktgivande. Det exakta värdet beräknas för beslutet om hemvård.',
    en: 'This estimate is indicative only. The exact value will be calculated for the home care decision.',
  },
  receipt_estimate_is_based_on: {
    fi: 'Arvio muodostuu seuraavasti:',
    sv: 'Bedömningen görs enligt följande:',
    en: 'The estimate consists of the following:',
  },
  receipt_subtotal_euros_per_month: {
    fi: '${value} €/kk',
    sv: '${value} euro/månad',
    en: '${value} €/month',
  },
  receipt_subtotal_euros_per_month_screenreader: {
    fi: '${value} euroa kuukaudessa',
    sv: '${value} euro per månad',
    en: '${value} euros per month',
  },
  receipt_subtotal_euros_per_hour: {
    fi: '${value} €/tunti',
    sv: '${value} euro/timme',
    en: '${value} €/hour',
  },
  receipt_subtotal_euros_per_hour_screenreader: {
    fi: '${value} euroa per tunti',
    sv: '${value} euro per timme',
    en: '${value} euros per hour',
  },
  receipt_homecare_total: {
    fi: 'Palvelusetelillä hankittavan palvelun kokonaiskustannus',
    sv: 'Total kostnad för tjänsten som köpts med servicesedeln',
    en: 'Total cost of the service to be procured with the service voucher',
  },
  receipt_city_pays_to_provider: {
    fi: 'Kaupunki maksaa palvelusetelillä palveluntuottajalle',
    sv: 'Staden betalar serviceproducenten med en servicesedel',
    en: 'The city pays the service provider with the service voucher',
  },
  receipt_voucher_value: {
    fi: 'Palvelusetelisi arvo',
    sv: 'Värde på din servicesedel',
    en: 'Your service voucher\'s value',
  },
  receipt_client_self_payment: {
    fi: 'Omavastuuosuus eli sinulle maksettavaksi jäävä asiakasmaksu',
    sv: 'Självriskandel, det vill säga den klientavgift som återstår för dig att betala ',
    en: 'The copayment, i.e. the client fee payable by you',
  },
  receipt_additional_details: {
    fi: 'Lisähuomiot:',
    sv: 'Ytterligare anmärkningar:',
    en: 'Additional remarks:',
  },
  receipt_included_homecare: {
    fi: 'Jos palvelu - ja hoitosuunnitelmassasi on myös kaupungin tuottamaa kotihoitoa, siitä laskutetaan erikseen kotihoidon asiakasmaksun mukaisesti.',
    sv: 'Om din service- och vårdplan även omfattar hemvård som tillhandahålls av staden debiteras den separat i enlighet med klientavgiften för hemvård.',
    en: 'If your service and care plan also includes home care provided by the city, it will be charged separately in accordance with the home care client fee.',
  },
  receipt_estimate_if_done_by_city: {
    fi: 'Arvio kaupungin kotihoidon asiakasmaksusta:',
    sv: 'Bedömning av klientavgiften för stadens hemvård:',
    en: 'Estimated client fee of the city\'s home care:',
  },
  receipt_when_done_by_city: {
    fi: 'Kaupungin kotihoidon tuottamana palvelu maksaisi',
    sv: 'Om staden producerade tjänsten skulle den kosta',
    en: 'Provided by the city\'s home care, the service would cost',
  },
  receipt_aria_live: {
    fi: 'Omavastuuosuus eli sinulle maksettavaksi jäävä asiakasmaksu on ${payment} euroa kuukaudessa, lue lisätietoja lomakkeen alta.',
    sv: 'Självriskandelen, det vill säga den klientavgift som du ska betala för, är ${payment} euro per månad, se mer information under blanketten.',
    en: 'The copayment, i.e. the client fee payable by you, is ${payment} euros per month; read more under the form.',
  },
};

export default translations;
