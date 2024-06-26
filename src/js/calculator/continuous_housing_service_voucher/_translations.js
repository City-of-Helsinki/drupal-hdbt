/* eslint-disable no-template-curly-in-string */

const translations = {
  net_income_per_month: {
    fi: 'Hakijan nettotulot kuukaudessa',
    sv: 'Den sökandes nettoinkomster per månad',
    en: 'Applicant’s net income per month',
  },
  net_income_per_month_explanation: {
    fi: 'Nettotulot tarkoittavat hakijan tuloja verojen vähentämisen jälkeen. Tuloihin lasketaan eläkkeet, elatusavut, elinkorot, elatustuki sekä muut jatkuvat henkilökohtaiset tulot ja pääomasta tai omaisuudesta (kuten korko-, osinko- ja vuokratulot). Eläkkeen saajan hoitotukea, asumistukea, rintamalisää tai sotavammalain mukaista elinkorkoa ei huomioida. Hakijan puolison tulot eivät vaikuta palvelusetelin arvoon.',
    sv: 'Med nettoinkomster avses den sökandes inkomster efter skatteavdrag. Inkomsterna inkluderar pensioner, underhållsbidrag, livräntor samt andra kontinuerliga personliga inkomster och inkomster från kapital eller egendom (såsom ränte-, utdelnings- och hyresintäkter). Vårdbidraget för pensionstagare, bostadsbidraget, fronttillägget eller livräntan enligt krigsskadelagen beaktas inte. Den sökandes makes inkomster påverkar inte servicesedelns värde.',
    en: 'Net income refers to applicant’s income after tax deduction. Income includes pensions, child support, annuities, child maintenance allowance and other continuing personal income and income from capital or property (such as interest, dividend and rental income). Pensioner’s care allowance, housing allowance, frontal supplement or annuity under the Act on military injuries are not taken into account. The income of the applicant’s spouse does not affect the value of the service voucher.',
  },
  service_provider_price: {
    fi: 'Palveluasumisen vuorokausihinta',
    sv: 'Dygnspris för serviceboende',
    en: 'Daily fee for service housing',
  },
  service_provider_price_explanation: {
    fi: 'Palveluntuottajan ilmoittama palvelun hinta vuorokaudessa.',
    sv: 'Priset på tjänsten som anges av serviceproducenten per dygn.',
    en: 'The daily fee for the service stated by the service provider.',
  },
  receipt_estimate_of_payment: {
    fi: 'Arvio palveluasumisen palvelusetelistä',
    sv: 'Bedömning av servicesedeln för serviceboende',
    en: 'Assessment of a service voucher for service housing',
  },
  receipt_estimated_payment_prefix: {
    fi: 'Omavastuuosuus eli sinulle maksettavaksi jäävä asiakasmaksu on',
    sv: 'Självriskandelen, det vill säga den klientavgift som återstår för dig att betala, är',
    en: 'The copayment, i.e. the client fee payable by you, is',
  },
  receipt_estimated_payment_suffix: {
    fi: 'euroa kuukaudessa.',
    sv: 'euro per månad.',
    en: 'euros per month.',
  },
  receipt_estimated_payment_explanation: {
    fi: 'Tämä arvio on suuntaa antava.  Tarkka arvo lasketaan asiakaspäätökseen.',
    sv: 'Denna bedömning är riktgivande.  Det exakta värdet beräknas i klientbeslutet.',
    en: 'This estimate is indicative only.  The exact value will be calculated for the client decision.',
  },
  receipt_estimate_is_based_on: {
    fi: 'Arvio muodostuu seuraavasti:',
    sv: 'Bedömningen görs enligt följande:',
    en: 'The estimate consists of the following:',
  },
  receipt_subtotal_full_price: {
    fi: 'Palvelusetelillä hankittavan palvelun kokonaiskustannus',
    sv: 'Total kostnad för tjänsten som köpts med servicesedeln',
    en: 'Total cost of the service to be procured with the service voucher',
  },
  receipt_subtotal_city_price: {
    fi: 'Kaupunki maksaa palvelusetelillä palveluntuottajalle ',
    sv: 'Staden betalar serviceproducenten med en servicesedel ',
    en: 'The city pays the service provider with the service voucher ',
  },
  receipt_subtotal_self_price: {
    fi: 'Sinulle maksettavaksi jäävä osuus eli omavastuu',
    sv: 'Andel som återstår för dig att betala, med andra ord självriskandelen',
    en: 'The amount payable by you, i.e. the copayment',
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
  receipt_additional_details: {
    fi: 'Lisähuomiot:',
    sv: 'Ytterligare anmärkningar:',
    en: 'Additional remarks:',
  },
  receipt_additional_details_1: {
    fi: 'Palvelusetelillä maksettavia yksityisen palveluasumisen kustannuksia ovat palveluasumisen palvelumaksu, perusmaksu ja ateriamaksu.',
    sv: 'Kostnaderna för privat serviceboende som betalas med en servicesedel är serviceavgiften för serviceboende, grundavgiften och måltidsavgiften.',
    en: 'The costs of private service housing that can be paid with a service voucher include the service fee for service housing, the base fee and the meal fee.',
  },
  receipt_additional_details_2: {
    fi: 'Omavastuuosuuden lisäksi sinulle jää maksettavaksi myös palveluasumisen vuokra, lääkkeet ja muut henkilökohtaiset kulut.',
    sv: 'Utöver självriskandelen ska du också betala hyra för serviceboende, för läkemedel och andra personliga utgifter.',
    en: 'In addition to the copayment, you will also have to pay for the service housing rent, medicines and other personal expenses.',
  },
  receipt_aria_live: {
    fi: 'Omavastuuosuus eli sinulle maksettavaksi jäävä asiakasmaksu on ${payment} euroa kuukaudessa, lue lisätietoja lomakkeen alta.',
    sv: 'Självriskandelen, det vill säga den klientavgift som du ska betala, är ${payment} euro per månad, mer information under blanketten.',
    en: 'The copayment, i.e. the client fee payable by you, is ${payment} euros per month; read more under the form.',
  },
};

export default translations;
