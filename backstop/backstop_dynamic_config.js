/* eslint-disable no-console */
const processArgs = process.argv.slice(2);
const envPath = '../../../../.env';
require('dotenv').config({ path: envPath }); // Get environment from instance .env file
const backstop = require('backstopjs');

const TYPE = {
  FULL: 'full',
  FAST: 'fast'
};

const COMMAND = {
  REFERENCE: 'reference',
  TEST: 'test',
  APPROVE: 'approve',
};

function getConfig(hostname, protocol, type) {
  const removeDefault = [
    '.header',
    '.breadcrumb__container',
    '.block--react-and-share',
    '.footer',
    '.sliding-popup-bottom',
    'iframe',
  ];

  // All of our breakpoints
  let viewports = [
    {
      'label': 'Breakpoint_XS',
      'width': 320,
      'height': 450
    },
    {
      'label': 'Breakpoint_S',
      'width': 576,
      'height': 630
    },
    {
      'label': 'Breakpoint_M',
      'width': 768,
      'height': 920
    },
    {
      'label': 'Breakpoint_L',
      'width': 992,
      'height': 650
    },
    {
      'label': 'Breakpoint_XL',
      'width': 1024,
      'height': 580
    },
    {
      'label': 'Breakpoint_XXL',
      'width': 2560,
      'height': 1440
    }
  ];
  let expandComponents = true; // Get all the components on page

  // For faster checks, check only mobile and generic desktop sizes
  if (type === TYPE.FAST) {
    viewports = [
      {
        'label': 'Mobile',
        'width': 320,
        'height': 450
      },
      {
        'label': 'Desktop',
        'width': 1900,
        'height': 970
      }
    ];
    expandComponents = false; // Take only the first component into account with fast mode
  }

  return {
    filter: processArgs[2] ?? null, // Add filter for label string here if you want to debug a single component, like the events component.
    docker: true,
    config: {
      'id': type,
      'viewports': viewports,
      'dockerCommandTemplate': 'docker run --rm --network=stonehenge-network -i --user $(id -u):$(id -g) --mount type=bind,source="{cwd}",target=/src backstopjs/backstopjs:{version} {backstopCommand} {args}',
      'scenarios': [
        // Layout landing
        {
          'label': 'DC: Landing page - hero',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-landing-page/dc-landing-page-hero-image-on-the-right`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: layout landing - no-hero',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-landing-page/dc-landing-page-no-hero`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Landing page - hero - without image, align left',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-landing-page/dc-landing-page-hero-without-image-align-left`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Landing page - hero - image on the left',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-landing-page/dc-landing-page-hero-image-on-the-left`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Landing page - hero - image on the bottom',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-landing-page/dc-landing-page-hero-image-on-the-bottom`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Landing page - hero - diagonal',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-landing-page/dc-landing-page-hero-diagonal`,
          'removeSelectors': removeDefault
        },
        // Standard page
        {
          'label': 'DC: Standard page - hero - subnav - sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-standard-page/dc-standard-page-hero-subnav-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Standard page - hero - no-subnav - sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-standard-page/dc-standard-page-hero-no-subnav-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Standard page - hero - no-subnav - no-sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-standard-page/dc-standard-page-hero-no-subnav-no-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Standard page - no-hero - subnav - sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-standard-page/dc-standard-page-no-hero-subnav-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Standard page - no-hero - subnav - no-sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-standard-page/dc-standard-page-no-hero-subnav-no-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Standard page - no-hero - no-subnav - sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-standard-page/dc-standard-page-no-hero-no-subnav-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Standard page - no-hero - no-subnav - no-sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-standard-page/dc-standard-page-no-hero-no-subnav-no-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Standard page - hero - subnav - no-sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-standard-page/dc-standard-page-hero-no-subnav-no-sidebar`,
          'removeSelectors': removeDefault
        },
        // TPR Unit
        {
          'label': 'DC: TPR Unit - subnav',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-tpr-unit/dc-tpr-unit-subnav`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: TPR Unit - no-subnav',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-tpr-unit/dc-tpr-unit-no-subnav`,
          'removeSelectors': removeDefault
        },
        // TPR Service
        {
          'label': 'DC: TPR Service - subnav - sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-tpr-service/dc-tpr-service-subnav-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: TPR Service - subnav - no-sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-tpr-service/dc-tpr-service-subnav-no-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: TPR Service - no-subnav - sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-tpr-service/dc-tpr-service-no-subnav-sidebar`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: TPR Service - no-subnav - no-sidebar',
          'url': `${protocol}://${hostname}/en/dc-layouts/dc-tpr-service/dc-tpr-service-no-subnav-no-sidebar`,
          'removeSelectors': removeDefault
        },

        // Colors
        {
          'label': 'DC: Suomenlinna',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-suomenlinna`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Copper',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-copper`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Gold',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-gold`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Coat of Arms',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-coat-of-arms`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Tram',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-tram`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Silver',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-silver`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Engel',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-engel`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Summer',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-summer`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Bus',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-bus`,
          'removeSelectors': removeDefault
        },
        {
          'label': 'DC: Metro',
          'url': `${protocol}://${hostname}/en/dc-colors/dc-metro`,
          'removeSelectors': removeDefault
        },

        // Components
        {
          'label': 'DC: Accordion',
          'url': `${protocol}://${hostname}/en/dc-components/dc-accordion`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--accordion'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Announcements',
          'url': `${protocol}://${hostname}/en/dc-components/dc-announcements`,
          'removeSelectors': removeDefault,
          'selectors': [
            '#block-hdbt-subtheme-announcements'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Banner',
          'url': `${protocol}://${hostname}/en/dc-components/dc-banner`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--banner'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Calculator',
          'url': `${protocol}://${hostname}/en/dc-components/dc-calculator`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--helfi-calculator'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Chart',
          'url': `${protocol}://${hostname}/en/dc-components/dc-chart`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--chart'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Columns',
          'url': `${protocol}://${hostname}/en/dc-components/dc-columns`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--columns'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Contact card listing',
          'url': `${protocol}://${hostname}/en/dc-components/dc-contact-card-listing`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--contact-card-listing'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Content cards',
          'url': `${protocol}://${hostname}/en/dc-components/dc-content-cards`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--content-cards'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Event list',
          'url': `${protocol}://${hostname}/en/dc-components/dc-event-list`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--event-list'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Image',
          'url': `${protocol}://${hostname}/en/dc-components/dc-image`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--image'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Liftup with image',
          'url': `${protocol}://${hostname}/en/dc-components/dc-liftup-with-image`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--liftup-with-image'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: List of links',
          'url': `${protocol}://${hostname}/en/dc-components/dc-list-of-links`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--list-of-links'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Map',
          'url': `${protocol}://${hostname}/en/dc-components/dc-map`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--map'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: News list',
          'url': `${protocol}://${hostname}/en/dc-components/dc-news-list`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--news-list'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Phasing',
          'url': `${protocol}://${hostname}/en/dc-components/dc-phasing`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.components'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Popular services',
          'url': `${protocol}://${hostname}/en/dc-components/dc-popular-services`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--popular-services'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Remote video',
          'url': `${protocol}://${hostname}/en/dc-components/dc-remote-video`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--remote-video'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Service list',
          'url': `${protocol}://${hostname}/en/dc-components/dc-service-list`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--service-list'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Sidebar text',
          'url': `${protocol}://${hostname}/en/dc-components/dc-sidebar-text`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.sidebar-text'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Text',
          'url': `${protocol}://${hostname}/en/dc-components/dc-text`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.components'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Target group links',
          'url': `${protocol}://${hostname}/en/dc-components/dc-target-group-links`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--target-group-links'
          ],
          'selectorExpansion': expandComponents,
        },
        {
          'label': 'DC: Unit search',
          'url': `${protocol}://${hostname}/en/dc-components/dc-unit-search`,
          'removeSelectors': removeDefault,
          'selectors': [
            '.component--unit-search'
          ],
          'selectorExpansion': expandComponents,
        },
      ],
      'mergeImgHack': true,
      'onBeforeScript': 'onBefore.js',
      'paths': {
        'bitmaps_reference': `backstop/${type}/bitmaps_reference`,
        'bitmaps_test': `backstop/${type}/bitmaps_test`,
        'engine_scripts': 'backstop/',
        'html_report': `backstop/${type}/html_report`,
        'ci_report': `backstop/${type}/ci_report`
      },
      'report': ['browser'],
      'engine': 'playwright',
      'engineOptions': {
        'browser': 'chromium',
      },
      'asyncCaptureLimit': 10,
      'asyncCompareLimit': 100,
      'debug': false,
      'debugWindow': false,
      'hostname': `${hostname}`,
    }
  };
}

if (!process.env.DRUPAL_HOSTNAME || !process.env.COMPOSE_PROJECT_NAME) {
  process.exitCode = 1;
  console.error(`📕 Environment not found, are you sure the instance .env file can be found in ${envPath}?`);
}

const hostname = `${process.env.COMPOSE_PROJECT_NAME}:8080`;
const protocol = 'http';
const drupalHostname = process.env.DRUPAL_HOSTNAME;
const type = (processArgs.includes(TYPE.FAST)) ? TYPE.FAST : TYPE.FULL;
let command;

if (processArgs.includes(COMMAND.REFERENCE)) {
  command = COMMAND.REFERENCE;
} else if (processArgs.includes(COMMAND.TEST)) {
  command = COMMAND.TEST;
} else if (processArgs.includes(COMMAND.APPROVE)) {
  command = COMMAND.APPROVE;
} else {
  throw new Error('Missing a known command');
}

const reportUrl = `https://${drupalHostname}/themes/contrib/hdbt/backstop/${type}/html_report/index.html`;

backstop(command, getConfig(hostname, protocol, type))
  .then(() => {
    console.log(`The ${command} command was successful! Check the report here: ${reportUrl}`);
  }).catch((e) => {
  process.exitCode = 255;
  console.error('\n\n📕 ', e, `\n\nCheck the report:\n🖼️  ${reportUrl}`);
});
