<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\Core\Url;
use Drupal\media\Entity\Media;
use Drupal\media\MediaInterface;

/**
 * Base class for media entities.
 */
class HelfiMediaBase extends Media implements MediaInterface {

  /**
   * Get url.
   *
   * @return Url|string
   *   The url.
   */
  public function getPrivacyPolicyUrl(): Url|string {
    return helfi_eu_cookie_compliance_get_privacy_policy_url();
  }

  /**
   * Get js library path.
   *
   * @return string
   *   The js library path.
   */
  public function getJsLibrary(): string {
    return 'hdbt/embedded-content-cookie-compliance';
  }

  /**
   * Check if module exists.
   *
   * @return bool
   *   Module exists.
   */
  protected function hasProvider(): bool{
    return \Drupal::moduleHandler()->moduleExists('oembed_providers') &&
      $this->hasField('field_media_oembed_video');
  }

}
