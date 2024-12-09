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
    fi: 'Koko talouden yhteenlasketut ansio- ja pääomatulot ennen verojen vähentämistä. Tuloihin lasketaan palkka, eläke-, vuokra- ja korkotulot sekä eläkkeensaajan hoitotuki. Jos jätät kentän tyhjäksi, lasketaan arvio korkeimman maksun mukaisesti.',
    sv: 'Hela hushållets sammanlagda förvärvs- och kapitalinkomster före skatteavdrag. I inkomsterna ingår lön, pensions-, hyres och ränteinkomster samt vårdbidrag för pensionstagare. Om du lämnar fältet tomt beräknas bedömningen enligt den högsta avgiften.',
    en: 'The entire household\'s combined income from earnings and capital income before taxes. Income includes salary, wages, pension, rental and interest income as well as care allowance for pensioners. If you leave the field blank, the estimate will be calculated using the highest fee.',
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
  living_at_home_heading: {
    fi: 'Kotona asumista tukevat palvelut',
    sv: 'Tjänster som stöder hemmaboende',
    en: 'Services to support living at home',
  },
  living_at_home_paragraph: {
    fi: 'Voit laskea mukaan kotona asumista tukevia palveluja. Tukipalvelut ovat maksullisia.',
    sv: 'Du kan inkludera tjänster som stöder hemmaboende. Stödtjänsterna är avgiftsbelagda.',
    en: 'You can include services supporting living at home. The support services are subject to a fee.',
  },
  safetyphone_heading: {
    fi: 'Turvapuhelin ja turvaranneke',
    sv: 'Trygghetstelefon och säkerhetsarmband',
    en: 'Safety phone and bracelet',
  },
  safetyphone_paragraph: {
    fi: 'Turvapuhelinpalveluun kuuluu turvapuhelin ja turvaranneke, joilla saat tarvittaessa apua ympäri vuorokauden. Turvapuhelinpalvelun maksut riippuvat talouden tuloista.',
    sv: 'I trygghetstelefontjänsten ingår en trygghetstelefon och ett säkerhetsarmband genom vilka du vid behov får hjälp dygnet runt. Avgifterna för säkerhetstelefontjänsten beror på hushållets inkomster.',
    en: 'The safety phone service includes a safety phone and a safety bracelet to call for help around the clock. The charges for the safety phone service depend on the income of the household.',
  },
  safetyphone: {
    fi: 'Laske arvioon turvapuhelin ja turvaranneke',
    sv: 'Inkludera en trygghetstelefon och ett säkerhetsarmband i bedömningen',
    en: 'Include the safety phone and safety bracelet in the estimate',
  },
  safetyphone_emergency_visit_explanation: {
    fi: 'Huomiothan, että turvapalveluiden hälytyskäynti maksaa 23,25 € tai 46,50 € kerta tulorajoistasi riippuen. Kuukausittain laskutamme enintään 5 hälytyskäyntiä, eli tulorajoistasi riippuen enintään 116,25 € tai 232,50 € kuukaudessa.',
    sv: 'Observera, att ett larmbesök från trygghetstjänsten kostar 23,25 € eller 46,50 € per gång, beroende på dina inkomstgränser. Vi fakturerar högst 5 larmbesök per månad. Det vill säga, beroende på dina inkomstgränser, max 116,25 € eller 232,50 € per månad.',
    en: 'Please note that an emergency visit from the safety services costs EUR 23.25 or EUR 46.50 per visit, depending on your income limits. Each month, you will be billed for a maximum of five emergency visits, totalling no more than EUR 116.25 or EUR 232.50, depending on your income limits.',
  },
  yes_calculate: {
    fi: 'Kyllä, laske arvioon.',
    sv: 'Ja, inkludera i bedömningen.',
    en: 'Yes, include them in the estimate.',
  },
  no: {
    fi: 'Ei',
    sv: 'Nej',
    en: 'No',
  },
  shopping_service_heading: {
    fi: 'Kauppapalvelu',
    sv: 'Butiksservice:',
    en: 'Grocery delivery service',
  },
  shopping_service_paragraph: {
    fi: 'Kauppapalvelussa tilaamasi ruokaostokset toimitetaan kotiovellesi. Kauppapalvelun hintaan kuuluu yksi ruokaostosten keräily ja toimitus viikossa.',
    sv: 'Butiksservicen levererar de livsmedelsinköp som du beställer till din dörr. I priset för butiksservicen ingår samling och leverans av livsmedelsinköp en gång i veckan.',
    en: 'The grocery delivery service delivers the groceries that you order through the service to your door. The price of the grocery delivery service includes the collection and delivery of the groceries once a week.',
  },
  shopping_service: {
    fi: 'Laske arvioon kauppapalvelu',
    sv: 'Inkludera butiksservicen i bedömningen',
    en: 'Include the grocery delivery service in the estimate',
  },
  shopping_service_per_week_explanation: {
    fi: 'Yksi toimitus viikossa maksaa ${first_per_week_price} euroa.',
    sv: 'En leverans per vecka kostar ${first_per_week_price} euro.',
    en: 'One delivery per week costs ${first_per_week_price} euros.',
  },
  meal_service_heading: {
    fi: 'Ateriapalvelu',
    sv: 'Måltidstjänst',
    en: 'Meal service',
  },
  meal_service_paragraph: {
    fi: 'Ateriapalvelussa kotiisi kuljetetaan valmiita lounasaterioita, jotka voit itse lämmittää. Ateriapalvelun hintaan kuuluu lounasaterian hinta ja kuljetusmaksu.',
    sv: 'I måltidstjänsten levereras färdiga lunchmåltider hem till dig, som du själv kan värma upp. I priset för måltidstjänsten ingår priset för lunchmåltiderna och leveransavgiften.',
    en: 'The meal service transports to your home ready-made lunch meals, which you can heat up yourself. The price of the meal service includes the price of a lunch meal and a delivery fee.',
  },
  meal_service: {
    fi: 'Laske arvioon ateriapalvelu',
    sv: 'Inkludera måltidstjänsten i bedömningen',
    en: 'Include the meal service in the estimate',
  },
  meal_service_per_week: {
    fi: 'Aterioiden määrä viikossa',
    sv: 'Antal måltider per vecka',
    en: 'Number of meals per week',
  },
  meal_service_per_week_explanation: {
    fi: 'Voit tilata ateriapalvelun hinnaston mukaisia lounasaterioita enintään 7 ateriaa viikossa.',
    sv: 'Du kan beställa högst sju måltider per vecka enligt måltidstjänstens prislista.',
    en: 'You can order up to 7 lunch meals according to the meal service price list per week.',
  },
  receipt_estimate_of_payment: {
    fi: 'Arvio kotihoidon asiakasmaksusta',
    sv: 'Bedömning av klientavgiften för hemvård',
    en: 'Estimated home care client fee',
  },
  receipt_family_estimated_payment_prefix: {
    fi: 'Arvioitu asiakasmaksu on yhteensä',
    sv: 'Den beräknade klientavgiften är totalt',
    en: 'The total estimated client fee is',
  },
  receipt_family_estimated_payment_suffix: {
    fi: 'euroa kuukaudessa.',
    sv: 'euro per månad.',
    en: 'euros per month.',
  },
  receipt_family_estimated_payment_explanation_min: {
    fi: 'Alle ${minimum_payment_euro} euron maksuja ei laskuteta. ',
    sv: 'Inga avgifter under ${minimum_payment_euro} euro debiteras. ',
    en: 'Fees of less than ${minimum_payment_euro} euros will not be charged. ',
  },
  receipt_family_empty_income: {
    fi: 'Arvio on laskettu korkeimman maksun mukaisesti, koska et täyttänyt laskuriin talouden kuukausituloja. ',
    sv: 'Bedömningen har beräknats enligt den högsta avgiften, eftersom du inte fyllde i hushållets månadsinkomster i räknaren. ',
    en: 'Since you did not enter the household\'s monthly income in the calculator, the estimate was calculated using the highest fee. ',
  },
  receipt_family_estimated_payment_explanation: {
    fi: 'Tämä arvio on suuntaa antava. Tarkka arvo lasketaan kotihoidon päätökseen.',
    sv: 'Denna bedömning är riktgivande. Det exakta värdet beräknas för beslutet om hemvård.',
    en: 'This estimate is indicative only. The exact value will be calculated for the home care decision.',
  },
  receipt_estimate_is_based_on: {
    fi: 'Arvio muodostuu seuraavista tiedoista:',
    sv: 'Bedömningen görs enligt följande uppgifter:',
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
  receipt_additional_details: {
    fi: 'Lisähuomiot:',
    sv: 'Ytterligare anmärkningar:',
    en: 'Additional remarks:',
  },
  receipt_homecare_payment: {
    fi: 'Kotihoidon asiakasmaksu',
    sv: 'Klientavgift för hemvården',
    en: 'Home care client fee',
  },
  receipt_homecare_payment_two_or_more: {
    fi: 'Jos molemmat puolisot ovat jatkuvan ja säännöllisen kotihoidon kuukausimaksuasiakkaita, maksu jakautuu kummallekin palvelu- ja hoitosuunnitelman mukaisesti.',
    sv: 'Om båda makarna betalar en månatlig avgift för kontinuerlig och regelbunden hemvård, fördelas avgiften mellan dem i enlighet med service- och vårdplanen.',
    en: 'If both spouses are clients of continuous and regular home care with a monthly fee, the fee is divided between them in accordance with their service and care plans.',
  },
  receipt_shopping_service_math_single: {
    fi: '1 kauppatoimitus viikossa, kuukausihintaan on laskettu 4 toimitusta.',
    sv: '1 butiksleverans per vecka, 4 leveranser ingår i månadspriset.',
    en: '1 grocery delivery per week; the monthly fee includes 4 deliveries.',
  },
  receipt_shopping_service_explanation: {
    fi: 'Kunkin viikon toimitus maksaa ${first_per_week} euroa.',
    sv: 'Leveransen varje vecka kostar ${first_per_week} euro.',
    en: 'The delivery each week costs ${first_per_week} euros.',
  },
  receipt_aria_live: {
    fi: 'Kotihoidon asiakasmaksun arvio on ${payment} euroa kuukaudessa, lue lisätietoja lomakkeen alta.',
    sv: 'Den beräknade klientavgiften för hemvården är ${payment} euro per månad, mer information under blanketten.',
    en: 'The estimated home care client fee is ${payment} euros per month; read more under the form.',
  },
  receipt_meal_service_count_single: {
    fi: '1 lounasateria viikossa, kuukausihintaan on laskettu 4 ateriaa.',
    sv: '1 butiksleverans per vecka, 4 leveranser ingår i månadspriset.',
    en: '1 lunch meal per week; the monthly fee includes 4 meals.',
  },
  receipt_meal_service_count_multiple: {
    fi: '${meals_per_week} lounasateriaa viikossa, kuukausihintaan on laskettu ${meals_per_month} ateriaa.',
    sv: '${meals_per_week} lunchmåltider per vecka, i månadspriset ingår ${meals_per_month} måltider.',
    en: '${meals_per_week} lunch meals per week; the monthly fee includes ${meals_per_month} meals.',
  },
  receipt_meal_service_price: {
    fi: 'Yksittäisen lounasaterian hinta on ${meal_service_price} euroa. Lämpimän aterian lisäksi voit tilata maksullisen jälkiruuan. Voit tilata ateriapalvelun hinnaston mukaisia lounasaterioita enintään 7 ateriaa viikossa, muut ateriat ovat omakustanteisia.',
    sv: 'Priset på en lunchmåltid är ${meal_service_price} euro. Förutom en varm måltid kan du också beställa en avgiftsbelagd efterrätt. Du kan beställa högst sju måltider per vecka enligt måltidstjänstens prislista, de övriga måltiderna på egen bekostnad.',
    en: 'The price of a single lunch meal is ${meal_service_price} euros. In addition to a hot meal, you can order a dessert for a fee. You can order up to 7 lunch meals according to the meal service price list per week; any additional meals are at your own expense.',
  },
  receipt_meal_service_1_delivery_price: {
    fi: 'Ateriat toimitetaan kotiin 1–2 kertaa viikossa. Kuljetuksia on yksi, kun tilattuja aterioita on 1–3, ja kuljetuksia on kaksi, kun aterioita on 4 tai enemmän. Hintaan on laskettu yksi kuljetusmaksu viikossa eli 4 kuljetusta kuukaudessa. Kukin kuljetus maksaa ${meal_service_delivery_price} euroa.',
    sv: 'Måltiderna levereras hem 1–2 gånger per vecka. Det görs en leverans för 1–3 beställda måltider, och två leveranser för 4 eller fler måltider. I priset ingår en leveransavgift per vecka, med andra ord 4 leveranser per månad. Varje leverans kostar ${meal_service_delivery_price} euro.',
    en: 'The meals will be delivered to your home once or twice a week: once a week if you order 1–3 meals, twice a week if you order 4 or more meals. The price includes one delivery fee per week, i.e. 4 deliveries per month. Each delivery costs ${meal_service_delivery_price} euros.',
  },
  receipt_meal_service_2_delivery_price: {
    fi: 'Ateriat toimitetaan kotiin 1–2 kertaa viikossa. Kuljetuksia on yksi, kun tilattuja aterioita on 1–3, ja kuljetuksia on kaksi, kun aterioita on 4 tai enemmän. Hintaan on laskettu kaksi kuljetusmaksua viikossa eli 8 kuljetusta kuukaudessa. Kukin kuljetus maksaa ${meal_service_delivery_price} euroa.',
    sv: 'Måltiderna levereras hem 1–2 gånger per vecka. Det görs en leverans för 1–3 beställda måltider, och två leveranser för 4 eller fler måltider. I priset ingår två leveransavgifter per vecka, med andra ord 8 leveranser per månad. Varje leverans kostar ${meal_service_delivery_price} euro.',
    en: 'The meals will be delivered to your home once or twice a week: once a week if you order 1–3 meals, twice a week if you order 4 or more meals. The price includes two delivery fees per week, i.e. 8 deliveries per month. Each delivery costs ${meal_service_delivery_price} euros.',
  },
  receipt_meal_service_menumat_notice: {
    fi: 'Ateriapalvelun sijaan voit tilata kotiisi pakastimen ja uunin yhdistelmän eli Menumat-ateria-automaatin. Menumat-palvelussa aterian hinta on ${menumat_price} euroa ja palvelumaksu on ${menumat_device_price} euroa vuorokaudessa. Aterian lisäksi voit tilata maksullisen jälkiruoan.',
    sv: 'I stället för måltidstjänsten kan du beställa en kombination av en frys och en ugn, med andra ord en Menumat-måltidsautomat. I Menumat-servicen kostar en måltid ${menumat_price} euro och serviceavgiften är ${menumat_device_price} euro per dag. Förutom en måltid kan du också beställa en avgiftsbelagd efterrätt.',
    en: 'Instead of the meal service, you can order a Menumat meal device, which is a combination of a freezer and an oven, to your home. In the Menumat service, the price per meal is ${menumat_price} euros, and the service fee is ${menumat_device_price} euros per day. In addition to the meal, you can order a dessert for a fee.',
  },
};

export default translations;
