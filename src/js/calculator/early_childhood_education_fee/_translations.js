/* eslint-disable no-template-curly-in-string */

const translations = {
  family_info: {
    fi: 'Perheen tiedot',
    sv: 'Uppgifter om familjen',
    en: 'Your family’s information',
  },
  household_size: {
    fi: 'Perheen koko',
    sv: 'Familjens storlek',
    en: 'Family size',
  },
  household_size_is_too_small_for_child_count: {
    fi: 'Lukumäärän pitäisi olla vähintään ${minValue}, jos samassa osoitteessa asuu aikuinen ja ${childCount} lasta.',
    sv: 'Antalet skulle vara minst ${minValue}, om en vuxen och ${childCount} barn bor på samma adress.',
    en: 'The number should be at least ${minValue} if an adult and ${childCount} children live at the same address.',
  },
  household_size_explanation: {
    fi: 'Samassa osoitteessa asuvien aikuisten ja alaikäisten lasten määrä.',
    sv: 'Antal vuxna och minderåriga barn som bor på samma adress.',
    en: 'The number of adults and minor children living at the same address.',
  },
  gross_income_per_month: {
    fi: 'Perheen bruttotulot kuukaudessa',
    sv: 'Familjens bruttoinkomster per månad',
    en: 'Family’s gross monthly income',
  },
  gross_income_per_month_explanation: {
    fi: 'Koko perheen yhteenlasketut ansio- ja pääomatulot sekä etuudet ennen verojen vähentämistä. Jos jätät kentän tyhjäksi, lasketaan arvio korkeimman maksun mukaisesti.',
    sv: 'Hela familjens sammanlagda förvärvs- och kapitalinkomster samt förmåner före skatt. Om du lämnar fältet tomt görs beräkningen enligt den högsta avgiften.',
    en: 'Your whole family’s total income from earnings, capital income and benefits before taxes. If you leave the field blank, the estimate will be calculated using the highest fee.',
  },
  child_info: {
    fi: 'Varhaiskasvatuksessa olevien lasten tiedot',
    sv: 'Uppgifter om barn som deltar i småbarnspedagogiken',
    en: 'Information of the children in early childhood education',
  },
  child_info_paragraph: {
    fi: 'Täytä tiedot kaikista perheen lapsista, jotka ovat varhaiskasvatuksessa. Täytä ensin nuorimman lapsen tiedot, sen jälkeen muut lapset ikäjärjestyksessä. Nuorimman lapsen maksu on korkein, seuraavat lapset saavat sisarusalennuksen.',
    sv: 'Fyll i uppgifterna om alla barn i familjen som deltar i småbarnspedagogik. Fyll först i uppgifterna om det yngsta barnet och sedan om de följande barnen i åldersordning. Avgiften för det yngsta barnet är högst, nästa barn får syskonrabatt.',
    en: 'Fill in information about all children in the family who are in early childhood education. First, fill in the details of the youngest child, then the other children in order of age. The fee for the youngest child is the highest, the next children receive a sibling discount.',
  },
  add_next_child: {
    fi: 'Lisää seuraavan lapsen tiedot',
    sv: 'Lägg till uppgifter om nästa barn',
    en: 'Add next child´s information',
  },
  remove_child: {
    fi: 'Poista lapsen tiedot',
    sv: 'Radera barnets uppgifter',
    en: 'Delete child´s information',
  },
  removed_child: {
    fi: 'Lapsen tiedot on nyt poistettu lomakkeelta.',
    sv: 'Uppgifterna har nu raderats från blanketten.',
    en: 'The data on the form has now been cleared.',
  },
  youngest_child_title: {
    fi: 'Nuorin lapsi',
    sv: 'Det yngsta barnet',
    en: 'Youngest child',
  },
  nth_child_title: {
    fi: 'Seuraavaksi nuorin lapsi',
    sv: 'Näst yngsta barnet',
    en: 'Next youngest child',
  },
  second_youngest_child_sibling_discount: {
    fi: 'Sisarusalennus, ${discount} % nuorimman lapsen kokoaikaisesta maksusta.',
    sv: 'Syskonrabatt, ${discount} % av heltidsavgiften för det yngsta barnet.',
    en: 'Sibling discount, ${discount} % of the full-time fee for the youngest child.',
  },
  nth_youngest_child_sibling_discount: {
    fi: 'Sisarusalennus, ${discount} % nuorimman lapsen kokoaikaisesta maksusta.',
    sv: 'Syskonrabatt, ${discount} % av heltidsavgiften för det yngsta barnet.',
    en: 'Sibling discount, ${discount} % of the full-time fee for the youngest child.',
  },
  daycare_type: {
    fi: 'Varhaiskasvatuksen muoto',
    sv: 'Form av småbarnspedagogik',
    en: 'Form of early childhood education',
  },
  daycare_type_1: {
    fi: 'Varhaiskasvatus arkipäivisin',
    sv: 'Småbarnspedagogik på vardagar',
    en: 'Early childhood education on weekdays',
  },
  daycare_type_3: {
    fi: 'Esiopetus ja varhaiskasvatus arkipäivisin',
    sv: 'Förskoleundervisning och småbarnspedagogik på vardagar',
    en: 'Pre-primary education and early childhood education on weekdays',
  },
  daycare_type_2: {
    fi: '5-vuotiaiden varhaiskasvatus arkipäivisin',
    sv: 'Småbarnspedagogik för 5-åringar på vardagar',
    en: 'Early childhood education for 5-year-olds on weekdays',
  },
  daycare_type_4: {
    fi: 'Vuorohoito (hoitoa myös iltaisin ja viikonloppuisin)',
    sv: 'Skiftesvård (även på kvällar och veckoslut)',
    en: 'Round-the-clock care (also in the evenings and at weekends)',
  },
  daycare_type_1_explanation: {
    fi: 'Varhaiskasvatusta tarjotaan kunnallisissa päiväkodeissa, ryhmäperhepäiväkodeissa sekä perhepäivähoidossa ja kolmiperhepäivähoidossa.',
    sv: 'Småbarnspedagogik ordnas vid kommunala daghem, gruppfamiljedaghem, i familjedagvård och som trefamiljsdagvård.',
    en: 'Early childhood education is provided at municipal daycare centres and group family daycare centres as well as in family daycare units and three-family daycare.',
  },
  daycare_type_1_caretime: {
    fi: 'Hoitotunnit',
    sv: 'Vårdtimmar',
    en: 'Care hours',
  },
  daycare_type_1_caretime_1: {
    fi: 'Yli 7 tuntia päivässä',
    sv: 'Över 7 timmar per dag',
    en: 'More than 7 hours per day',
  },
  daycare_type_1_caretime_2: {
    fi: '5–7 tuntia päivässä',
    sv: '5–7 timmar per dag',
    en: '5–7 hours per day',
  },
  daycare_type_1_caretime_3: {
    fi: 'Enintään 5 tuntia päivässä',
    sv: 'Högst 5 timmar per dag',
    en: 'Max. 5 hours per day',
  },
  daycare_free_days: {
    fi: 'Säännöllisiä vapaapäiviä kuukaudessa',
    sv: 'Regelbundna lediga dagar per månad ',
    en: 'Regular days off per month',
  },
  daycare_free_days_does_not_affect: {
    fi: '. Huomioithan, että vain 4–12 säännöllistä ja sovittua vapaapäivää kuukaudessa alentavat varhaiskasvatusmaksua.',
    sv: '. Observera att endast 4–12 regelbundna och överenskomna lediga dagar per månad minskar avgiften för småbarnspedagogiken.',
    en: '. Please note that only regular and scheduled 4–12 days off per month reduce the early childhood education fee.',
  },
  daycare_free_days_explanation: {
    fi: 'Säännölliset ja sovitut 4–12 vapaapäivää kuukaudessa alentavat varhaiskasvatusmaksua.',
    sv: '4–12 regelbundna och överenskomna lediga dagar per månad minskar avgiften för småbarnspedagogiken.',
    en: 'Regular and scheduled 4–12 days off per month reduce the early childhood education fee.',
  },
  daycare_type_2_explanation: {
    fi: '5-vuotiaiden varhaiskasvatus on maksutonta 4 tuntia päivässä, ja se koskee kuluvan kalenterivuoden aikana 5 vuotta täyttäviä. Maksuton varhaiskasvatus alkaa aina 1.8. ja päättyy, kun lapsella alkaa esiopetus.',
    sv: 'Småbarnspedagogiken för 5-åringar är avgiftsfri fyra timmar per dag för barn som fyller fem år under det innevarande kalenderåret. Den avgiftsfria småbarnspedagogiken börjar alltid den 1 augusti och slutar när barnet börjar i förskolan.',
    en: 'Early childhood education for 5-year-olds is free of charge for 4 hours per day and applies to children who turn 5 during the current calendar year. Free early childhood education always starts on 1 August and ends when the child starts pre-primary education.',
  },
  daycare_type_2_caretime: {
    fi: 'Hoitotunnit',
    sv: 'Vårdtimmar',
    en: 'Care hours',
  },
  daycare_type_2_caretime_1: {
    fi: 'Yli 7 tuntia päivässä',
    sv: 'Över 7 timmar per dag',
    en: 'More than 7 hours per day',
  },
  daycare_type_2_caretime_2: {
    fi: '5–7 tuntia päivässä',
    sv: '5–7 timmar per dag',
    en: '5–7 hours per day',
  },
  daycare_type_2_caretime_3: {
    fi: '4–5 tuntia päivässä',
    sv: '4–5 timmer per dag',
    en: '4–5 hours per day',
  },
  daycare_type_2_caretime_4: {
    fi: 'Enintään 4 tuntia päivässä (maksuton)',
    sv: 'Högst 4 timmar per dag (avgiftsfri)',
    en: 'Max. 4 hours per day (free of charge)',
  },
  daycare_type_3_explanation: {
    fi: '6-vuotiaiden esiopetus ja 5-vuotiaiden kaksivuotinen esiopetuskokeilu on maksutonta 4 tuntia päivässä. Valitse vaihtoehdoista, jos lapsi on esiopetuksen lisäksi varhaiskasvatuksessa.',
    sv: 'Förskoleundervisningen är avgiftsfri fyra timmar per dag för 6-åringar och för 5-åringar som deltar i försöket med tvåårig förskoleundervisning. Välj ett av alternativen om barnet utöver förskoleundervisningen också deltar i småbarnspedagogiken.',
    en: 'Pre-primary education for 6-year-olds and the trial for two-year pre-primary education for 5-year-olds are free of charge for 4 hours per day. Select the option that best describes your situation if your child attends early childhood education in addition to pre-primary education.',
  },
  daycare_type_3_caretime: {
    fi: 'Esiopetuksen ja varhaiskasvatuksen hoitotunnit yhteensä ',
    sv: 'Sammanlagda vårdtimmar inom förskoleundervisningen och småbarnspedagogiken ',
    en: 'Total time your child spends in pre-primary education and early childhood education ',
  },
  daycare_type_3_caretime_1: {
    fi: 'Yli 7 tuntia päivässä',
    sv: 'Över 7 timmar per dag',
    en: 'More than 7 hours per day',
  },
  daycare_type_3_caretime_2: {
    fi: '7–8 tuntia päivässä (enintään 8 tuntia)',
    sv: '7–8 timmar per dag (högst 8 timmar)',
    en: '7–8 hours a day (max. 8 hours)',
  },
  daycare_type_3_caretime_3: {
    fi: '5–7 tuntia päivässä',
    sv: '5–7 timmar per dag',
    en: '5–7 hours per day',
  },
  daycare_type_3_caretime_4: {
    fi: 'Enintään 5 tuntia päivässä',
    sv: 'Högst 5 timmar per dag',
    en: 'Max. 5 hours per day',
  },
  daycare_type_4_explanation: {
    fi: 'Vuorohoito tarkoittaa varhaiskasvatusta päiväkodeissa myös illalla, yöllä ja viikonloppuna huoltajan vuorotyön tai opiskelun vuoksi.',
    sv: 'Skiftesvård är småbarnspedagogik på daghem även på kvällar, nätter och veckoslut på grund av vårdnadshavarens skiftarbete eller studier.',
    en: 'Round-the-clock care is early childhood education provided at daycare centres also in the evenings, at night and at weekends because of guardian’s shift work or studies.',
  },
  daycare_type_4_caretime: {
    fi: 'Hoitotunnit',
    sv: 'Vårdtimmar',
    en: 'Care hours',
  },
  daycare_type_4_caretime_1: {
    fi: '161 tuntia tai enemmän kuukaudessa',
    sv: '161 timmar eller mer per månad',
    en: '161 hours or more per month',
  },
  daycare_type_4_caretime_2: {
    fi: '101–160 tuntia kuukaudessa',
    sv: '101–160 timmar per månad',
    en: '101–160 hours per month',
  },
  daycare_type_4_caretime_3: {
    fi: '61–100 tuntia kuukaudessa',
    sv: '61–100 timmar per månad',
    en: '61–100 hours per month',
  },
  daycare_has_preschool: {
    fi: 'Lapsi on esiopetuksessa tai 5-vuotiaiden varhaiskasvatuksessa',
    sv: 'Barnet deltar i förskoleundervisningen eller småbarnspedagogiken för 5-åringar',
    en: 'The child attends pre-primary education or early childhood education for 5-year-olds',
  },
  receipt_estimate_of_payment: {
    fi: 'Arvio asiakasmaksusta',
    sv: 'Uppskattning av klientavgiften',
    en: 'Client fee estimate',
  },
  receipt_family_estimated_payment_prefix: {
    fi: 'Perheen arvioitu asiakasmaksu on',
    sv: 'Familjens uppskattade klientavgift är',
    en: 'Your family’s estimated client fee is',
  },
  receipt_family_estimated_payment_suffix: {
    fi: 'euroa kuukaudessa.',
    sv: 'euro per månad.',
    en: 'euros per month.',
  },
  receipt_family_estimated_payment_explanation_min: {
    fi: 'Alle ${minimum_payment_euro} euron maksuja ei laskuteta. ',
    sv: 'Avgifter på under ${minimum_payment_euro} euro faktureras inte. ',
    en: 'Fees under ${minimum_payment_euro} euros will not be invoiced. ',
  },
  receipt_family_empty_income: {
    fi: 'Arvio on laskettu korkeimman maksun mukaisesti, koska et täyttänyt laskuriin perheen kuukausituloja. ',
    sv: 'Beräkningen har gjorts enligt den högsta avgiften eftersom du inte har fyllt i familjens månadsinkomst i räknaren. ',
    en: 'The estimate was calculated using the highest fee because you did not enter your family’s monthly gross income. ',
  },
  receipt_family_estimated_payment_explanation: {
    fi: 'Tämä arvio on suuntaa antava. Tarkan asiakasmaksun saat asiakasmaksupäätöksessä.',
    sv: 'Beräkningen är riktgivande. Den exakta klientavgiften får du i klientavgiftsbeslutet.',
    en: 'This estimate is indicative only. You will receive specific information on your client fee in the client fee decision.',
  },
  receipt_estimate_is_based_on: {
    fi: 'Arvio muodostuu seuraavista tiedoista:',
    sv: 'Beräkningen består av följande uppgifter:',
    en: 'The estimate consists of the following information',
  },
  receipt_subtotal_euros_per_month: {
    fi: '${value} €/kk',
    sv: '${value} €/månad',
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
  receipt_daycare_type_2_details: {
    fi: '5-vuotiaiden varhaiskasvatus on maksutonta 4 tuntia päivässä ja koskee kuluvan kalenterivuoden aikana 5 vuotta täyttäviä. Maksuton varhaiskasvatus alkaa aina 1.8. ja päättyy, kun lapsella alkaa esiopetus.',
    sv: 'Småbarnspedagogiken för 5-åringar är avgiftsfri fyra timmar per dag för barn som fyller fem år under det innevarande kalenderåret. Den avgiftsfria småbarnspedagogiken börjar alltid den 1 augusti och slutar när barnet börjar i förskolan.',
    en: 'Early childhood education for 5-year-olds is free of charge for 4 hours per day and applies to children who turn 5 during the current calendar year. Free early childhood education always starts on 1 August and ends when the child starts pre-primary education.',
  },
  receipt_daycare_type_3_details: {
    fi: '6-vuotiaiden esiopetus ja 5-vuotiaiden kaksivuotinen esiopetuskokeilu ovat maksuttomia 4 tuntia päivässä. Maksutonta esiopetusta ei ole koulun lomien aikana, jolloin 6-vuotiaasta esiopetuksessa olevasta lapsesta peritään kokopäivähoidon mukainen maksu jokaiselta läsnäolopäivältä. 5-vuotias esiopetuskokeilussa oleva lapsi saa 4 tuntia maksutonta varhaiskasvatusta päivässä myös koulun lomien aikana.',
    sv: 'Förskoleundervisningen är avgiftsfri fyra timmar per dag för 6-åringar och för 5-åringar som deltar i försöket med tvåårig förskoleundervisning. Kostnadsfri förskoleundervisning ordnas inte under skolornas lov för 6-åriga barn. Då tar staden för varje närvarodag ut en avgift som motsvarar heldagsvård. 5-åriga barn som deltar i försöket med tvåårig förskoleundervisning får avgiftsfri småbarnspedagogik fyra timmar per dag också under skolornas lov.',
    en: 'Pre-primary education for 6-year-olds and the trial for two-year pre-primary education for 5-year-olds are free of charge for 4 hours per day. Free pre-primary education is not provided during school holidays, when a full-time fee will be charged from a 6-year-old child in pre-primary education for each day of attendance. A 5-year-old child attending the trial for two-year pre-primary education will also receive 4 hours of free early childhood education during school holidays.',
  },
  receipt_daycare_type_4_details: {
    fi: 'Esiopetus ja 5-vuotiaiden varhaiskasvatus ovat maksuttomia 4 tuntia arkipäivässä, 20 tuntia viikossa. 5-vuotiaiden varhaiskasvatus koskee kuluvan kalenterivuoden aikana 5 vuotta täyttäviä. Maksuton varhaiskasvatus alkaa aina 1.8. ja päättyy, kun lapsella alkaa esiopetus. 6-vuotiaiden esiopetusta ja 5-vuotiaiden esiopetuskokeilua ei ole koulun lomien aikana, jolloin 6-vuotiaasta esiopetuksessa olevasta lapsesta peritään kokopäivähoidon mukainen maksu jokaiselta läsnäolopäivältä. 5-vuotias esiopetuskokeilussa oleva lapsi saa 4 tuntia maksutonta varhaiskasvatusta päivässä myös koulun lomien aikana.',
    sv: 'Förskoleundervisning och småbarnspedagogik för 5-åringar är avgiftsfria fyra timmar per vardag, 20 timmar per vecka. Småbarnspedagogiken för 5-åringar gäller barn som fyller fem år under det innevarande kalenderåret. Den avgiftsfria småbarnspedagogiken börjar alltid den 1 augusti och slutar när barnet börjar i förskolan. Förskoleundervisning för 6-åringar och de 5-åringar som deltar i försöket med tvåårig förskoleundervisning ordnas inte under skolornas lov. Då tar staden för varje närvarodag ut en avgift som motsvarar heldagsvård för 6-åriga barn. 5-åriga barn som deltar i försöket med tvåårig förskoleundervisning får avgiftsfri småbarnspedagogik fyra timmar per dag också under skolornas lov.',
    en: 'Pre-primary education and early childhood education for 5-year-olds are free of charge for 4 hours per working day, 20 hours per week. Early childhood education for 5-year-olds applies to children who turn 5 during the current calendar year. Free early childhood education always starts on 1 August and ends when the child starts pre-primary education. Pre-primary education for 6-year-olds and the trial for two-year pre-primary education for 5-year-olds will not be provided during school holidays, when a full-time fee will be charged from a 6-year-old child in pre-primary education for each day of attendance. A five-year-old child attending the trial for two-year pre-primary education will also receive 4 hours of free early childhood education during school holidays.',
  },
  receipt_aria_live: {
    fi: 'Varhaiskasvatusmaksun arvio on ${payment} euroa kuukaudessa, lue lisätietoja lomakkeen alta.',
    sv: 'Den uppskattade avgiften för småbarnspedagogiken är ${payment euro per månad, ytterligare information under blanketten.',
    en: 'Your estimated early childhood education fee is ${payment euros per month, read more below the form.',
  },
};

export default translations;
