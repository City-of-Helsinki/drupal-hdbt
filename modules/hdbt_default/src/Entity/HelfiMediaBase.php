<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\Core\Url;
use Drupal\media\Entity\Media;
use Drupal\media\MediaInterface;

class HelfiMediaBase extends Media implements MediaInterface {

  public function getPrivacyPolicyUrl(): Url|string {
    return helfi_eu_cookie_compliance_get_privacy_policy_url();
  }

  public function getJsLibrary(): string {
    return 'hdbt/embedded-content-cookie-compliance';
  }

  protected function hasProvider(): bool{
    return \Drupal::moduleHandler()->moduleExists('oembed_providers') &&
      $this->hasField('field_media_oembed_video');
  }
}
