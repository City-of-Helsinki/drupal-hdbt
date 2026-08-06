<?php

declare(strict_types=1);

namespace Drupal\hdbt;

/**
 * Provides language-specific global URLs used across all instances.
 */
final class GlobalUrls {

  /**
   * Returns a flat array of global URLs for the given language.
   *
   * @param string $langcode
   *   The language code (fi, sv, or en).
   *
   * @return array<string, string>
   *   Keyed URL strings.
   */
  public static function get(string $langcode): array {
    if ($langcode === 'fi') {
      return [
        'events_link_url' => 'https://tapahtumat.hel.fi/fi/',
        'decisions_link_url' => 'https://paatokset.hel.fi/fi/asia',
        'jobs_link_url' => 'https://www.hel.fi/fi/avoimet-tyopaikat',
        'contact_link_url' => 'https://www.hel.fi/fi/paatoksenteko/ota-yhteytta-helsingin-kaupunkiin',
        'helsinki_near_you_link_url' => 'https://www.hel.fi/fi/helsinki-lahellasi',
        'helfi_search_form_url' => 'https://www.hel.fi/haku',
        'helfi_ai_search_form_url' => 'https://helfi-etusivu.docker.so/fi/search/new',
        'error_page_home_link' => 'https://www.hel.fi/fi',
        'error_page_feedback_link' => 'https://palautteet.hel.fi/fi/',
      ];
    }
    if ($langcode === 'sv') {
      return [
        'events_link_url' => 'https://tapahtumat.hel.fi/sv',
        'decisions_link_url' => 'https://paatokset.hel.fi/sv/arende',
        'jobs_link_url' => 'https://www.hel.fi/sv/lediga-jobb',
        'contact_link_url' => 'https://www.hel.fi/sv/beslutsfattande/kontakta-helsingfors-stad',
        'helsinki_near_you_link_url' => 'https://www.hel.fi/sv/helsingfors-nara-dig',
        'helfi_search_form_url' => 'https://www.hel.fi/sok',
        'helfi_ai_search_form_url' => 'https://helfi-etusivu.docker.so/sv/search/new',
        'error_page_home_link' => 'https://www.hel.fi/sv',
        'error_page_feedback_link' => 'https://palautteet.hel.fi/sv/',
      ];
    }
    return [
      'events_link_url' => 'https://tapahtumat.hel.fi/en',
      'decisions_link_url' => 'https://paatokset.hel.fi/en/case',
      'jobs_link_url' => 'https://www.hel.fi/en/open-jobs',
      'contact_link_url' => 'https://www.hel.fi/en/decision-making/contact-the-city-of-helsinki',
      'helsinki_near_you_link_url' => 'https://www.hel.fi/en/helsinki-near-you',
      'helfi_search_form_url' => 'https://www.hel.fi/search',
      'helfi_ai_search_form_url' => 'https://helfi-etusivu.docker.so/en/search/new',
      'error_page_home_link' => 'https://www.hel.fi/en',
      'error_page_feedback_link' => 'https://palautteet.hel.fi/en/',
    ];
  }

}
