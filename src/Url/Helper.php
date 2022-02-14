<?php

declare(strict_types = 1);

namespace Drupal\hdbt\Url;

use Drupal\Core\Url;

/**
 * Provides a helper class to deal with URLs.
 */
final class Helper {

  /**
   * Constructs a new object.
   *
   * @param \Drupal\Core\Url $url
   *   The url.
   */
  public function __construct(private Url $url) {
  }

  /**
   * Checks whether the url is external.
   *
   * @return bool
   *   TRUE if url is external.
   */
  public function isExternal() : bool {
    if (!$this->url->isExternal()) {
      return FALSE;
    }

    $host = parse_url($this->url->getUri(), PHP_URL_HOST);

    // Allow URLs with specified hosts to be non-external.
    return match($host) {
      'www.hel.fi',
      'paatokset.hel.fi',
      'avustukset.hel.fi' => FALSE,
      default => TRUE,
    };
  }

}
