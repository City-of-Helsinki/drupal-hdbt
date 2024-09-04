/* eslint-disable no-template-curly-in-string */

const translations = {
  heading_employer: {
    fi: 'Työnantajan tiedot',
    sv: 'Arbetsgivarens uppgifter',
    en: 'Employer information',
  },
  heading_employee: {
    fi: 'Työsuhteen tiedot',
    sv: 'Arbetstagarens uppgifter',
    en: 'Employee details',
  },
  label_company_type: {
    fi: 'Työnantajan muoto',
    sv: 'Arbetsgivarens form',
    en: 'Type of employer',
  },
  label_company_type_business: {
    fi: 'Työnantaja on yritys',
    sv: 'Arbetsgivaren är ett företag',
    en: 'The employer is a company',
  },
  label_company_type_association: {
    fi: 'Työnantaja on yhteisö',
    sv: 'Arbetsgivaren är en organisation',
    en: 'The employer is an organization',
  },
  label_association_has_business_activities: {
    fi: 'Yhteisö harjoittaa taloudellista toimintaa',
    sv: 'Organisationen bedriver ekonomisk verksamhet',
    en: 'The organization engages in economic activity',
  },
  helper_text_association_has_business_activities: {
    fi: 'Taloudellinen toiminta tarkoittaa palveluiden ja tuotteiden myyntiä, joka on jatkuvaa, ansiotarkoituksessa ja kilpailuolosuhteissa tapahtuvaa. Kaikkien kolmen edellytyksen tulee täyttyä samanaikaisesti.',
    sv: 'Ekonomisk verksamhet innebär försäljning av tjänster och produkter som är kontinuerlig, vinstdrivande och sker under konkurrensförhållanden. Alla tre villkoren måste uppfyllas samtidigt.',
    en: 'Economic activity refers to the sale of services and products that is continuous, profitable and occurs under competitive conditions. All three criteria must be met at the same time.',
  },
  label_monthly_pay: {
    fi: 'Työntekijän tuleva bruttopalkka',
    sv: 'Arbetstagarens framtida bruttolön',
    en: 'Future gross salary of the employee',
  },
  helper_text_monthly_pay: {
    fi: 'Euroa kuukaudessa. Arvioi bruttopalkan suuruus työsuhteeseen, johon Helsinki-lisää haetaan.',
    sv: 'Euro per månad. Uppskatta bruttolönen för den anställning som Helsingforstillägget ansöks om.',
    en: 'Euros per month. Estimate the gross salary for the employment for which the Helsinki benefit is being applied.',
  },
  label_vacation_money: {
    fi: 'Lomaraha',
    sv: 'Semesterpenning',
    en: 'Holiday pay',
  },
  helper_text_vacation_money: {
    fi: 'Euroa kuukaudessa. Jos jätät kentän tyhjäksi, niin lomaraha jätetään huomioimatta laskelmassa.',
    sv: 'Euro per månad. Om du lämnar fältet tomt kommer semesterpenningen inte att beaktas i beräkningen.',
    en: 'Euros per month. If you leave this field empty, the holiday pay will not be included in the calculation.',
  },
  heading_pay_subsidy_information: {
    fi: 'Muut työsuhteeseen haettavat tai myönnetyt tuet',
    sv: 'Andra stöd för anställningen som ansöks om eller beviljats',
    en: 'Other subsidies applied for or granted for the employment',
  },
  text_pay_subsidy_information: {
    fi: 'Helsinki-lisän lisäksi työsuhteeseen voidaan myöntää muita tukia kattamaan palkkaamisesta aiheutuvia kustannuksia.',
    sv: 'Förutom Helsingforstillägget kan andra stöd beviljas för att täcka kostnaderna för anställningen.',
    en: 'In addition to the Helsinki benefit, other subsidies may be granted to cover the costs of employment.',
  },
  label_pay_subsidy_granted: {
    fi: 'Työsuhteeseen myönnetyt tai haetut muut tuet, kuten palkkatuki',
    sv: 'Andra stöd som beviljats eller ansökts om för anställningen',
    en: 'Other subsidies applied for or granted for the employment',
  },
  label_pay_subsidy_false: {
    fi: 'Työsuhteeseen ei ole myönnetty tai haettu muuta tukea',
    sv: 'Inget annat stöd har beviljats eller ansökts om',
    en: 'No other subsidy has been granted or applied',
  },
  label_pay_subsidy_true: {
    fi: 'Palkkatuki tai 55 vuotta täyttäneiden työllistämistuki',
    sv: 'Lönesubvention eller anställningsstöd för personer över 55 år',
    en: 'Pay subsidy or employment subsidy for ages 55 and above',
  },
  label_pay_subsidy_percentage: {
    fi: 'Palkkatuen prosentti tai myöntämisperuste',
    sv: 'Lönesubvention procent eller beviljningsgrund',
    en: 'Wage subsidy percentage or basis for granting',
  },
  label_pay_subsidy_percentage_1: {
    fi: 'Tuki kattaa ${value} % palkkauskustannuksista (tuen perusteena ammatillisen osaamisen parantaminen)',
    sv: '${value} % av anställningskostnaderna (stödet baseras på förbättring av yrkeskompetensen)',
    en: '${value} % of employment costs (subsidy based on improving professional skills)',
  },
  label_pay_subsidy_percentage_2: {
    fi: 'Tuki kattaa ${value} % palkkauskustannuksista (tuen perusteena alentunut työkyky tai 55 vuotta täyttäneiden työllistämistuki)',
    sv: '${value} % av anställningskostnaderna (stödet baseras på nedsatt arbetsförmåga eller anställningsstöd för personer över 55 år)',
    en: '${value} % of employment costs (subsidy based on disability or illness that reduces work capacity or employment subsidy for ages 55 and above)',
  },
  helper_text_pay_subsidy_percentage: {
    fi: 'Valitse sopivin vaihtoehto joko tuen prosentin tai tukea haettavan perusteen mukaan.',
    sv: 'Välj det mest lämpliga alternativet baserat på antingen stödbeloppets procent eller grunden för att ansöka om stödet.',
    en: 'Select the most suitable option based on either the subsidy percentage or the reason for applying for the subsidy.',
  },
  total_title: {
    fi: 'Arvio Helsinki-lisästä',
    sv: 'Uppskattning av Helsingforstillägget',
    en: 'Estimate of the Helsinki benefit',
  },
  total_prefix: {
    fi: 'Työnantajalle arvoitu Helsinki-lisä',
    sv: 'Beräknat Helsingforstillägget för arbetsgivaren',
    en: 'Estimated Helsinki benefit for the employer',
  },
  total_suffix: {
    fi: 'euroa kuukaudessa',
    sv: 'euro per månad',
    en: 'euros per month',
  },
  total_explanation: {
    fi: 'Arvio tuen määrästä on suuntaa antava eikä se takaa lopullista tuen määrää. Helsinki-lisää myönnetään työsuhteen ajaksi, kuitenkin enintään 12 kuukaudeksi. Tuen myöntäminen edellyttää, että työllistettävälle on myönnetty Helsinki-lisä-kortti, palkkatukea tai 55 vuotta täyttäneiden työllistämistukea.',
    sv: 'Uppskattningen av stödets belopp är vägledande och garanterar inte det slutliga beloppet. Helsingforstilläggetet beviljas för anställningstiden, dock högst 12 månader. För att stödet ska beviljas krävs att den anställde har beviljats ett Helsingforstilläggskort, lönebidrag eller anställningsstöd för personer över 55 år.',
    en: 'The estimate of the financial support amount is indicative and does not guarantee the final amount of the support. The Helsinki benefit is granted for the duration of the employment, maximum of 12 months. Granting the support requires that the employee has been issued the Helsinki benefit card, pay subsidy, or employment subsidy for ages 55 and above.',
  },
  breakdown_title: {
    fi: 'Arvio muodostuu seuraavista tiedoista:',
    sv: 'Uppskattningen baseras på följande uppgifter:',
    en: 'The estimate is based on the following information:',
  },
  subtotal_title: {
    fi: 'Työsuhde',
    sv: 'Anställning',
    en: 'Employment relationship',
  },
  subtotal_details_1: {
    fi: 'Työllistettävän bruttopalkka: ${value} euroa kuukaudessa.',
    sv: 'Bruttolön: ${value} euro per månad.',
    en: 'Gross salary: ${value} euros per month.',
  },
  subtotal_details_2: {
    fi: 'Lomaraha: ${value} euroa kuukaudessa.',
    sv: 'Semesterpenning: ${value} euro per månad.',
    en: 'Holiday pay: ${value} euros per month.',
  },
  subtotal_details_3: {
    fi: 'Sivukulut: ${value} euroa bruttopalkasta. Arviossa on käytetty keskimääräistä arviota sivukuluista.',
    sv: 'Bikostnader: ${value} euro av bruttolönen. En genomsnittlig uppskattning av bikostnaderna har använts i beräkningen.',
    en: 'Additional costs: ${value} euros per month. The calculation result uses an average estimate of additional costs.',
  },
  subtotal_details_4: {
    fi: 'Työsuhteeseen on myönnetty palkkatuki, joka kattaa ${value} % palkkakustannuksista.',
    sv: 'Lönesubventionen som beviljats för anställningen täcker ${value} % av lönekostnaderna.',
    en: 'The pay subsidy granted for the employment covers ${value} % of the salary costs.',
  },
  additional_details_title:{
    fi: 'Lisähuomiot',
    sv: 'Ytterligare anmärkningar',
    en: 'Additional information',
  },
  additional_details_text_1: {
    fi: 'Oppisopimuksissa Helsinki-lisää voidaan myöntää koko oppisopimuksen ajaksi.',
    sv: 'För lärlingsavtal kan Helsingforstillägget beviljas för hela lärlingstiden.',
    en: 'For apprenticeships, the Helsinki benefit can be granted for the entire duration of the apprenticeship.',
  },
  additional_details_text_2: {
    fi: 'Laskuri ei tue tapausta, jossa palkkatuen määrä on 100 prosenttia työntekijän palkkakustannuksista 65 prosentin työajalla.',
    sv: 'Beräknaren stöder inte fall där lönesubventionen är 100 procent av anställningskostnaderna vid 65 procents arbetstid.',
    en: 'The calculator does not support cases where the pay subsidy amount is 100 percent of the employee\'s salary costs with 65 percent working time.',
  },
  error_calculation_title:{
    fi: 'Laskenta epäonnistui.',
    sv: 'Uppskattningen misslyckades.',
    en: 'Calculation failed.',
  },
  error_calculation_message:{
    fi: 'Ole hyvä ja tarkista syöttämäsi tiedot.',
    sv: 'Var god och kontrollera de uppgifter du angett.',
    en: 'Please check the information you have entered.',
  }
};

export default translations;
  
/*
key: {
  fi: "",
  sv: "",
  en: "",
},
*/