<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\Core\Url;
use Drupal\media\Entity\Media;
use Drupal\media\MediaInterface;

class HelfiMediaBase extends Media implements MediaInterface {

  public function getPrivacyPolicyUrl(): Url|string {
    return helfi_eu_cookie_compliance_get_privacy_policy_url();
  }

  public function getIframeTitle(): ?string {
    if (!$this->hasProvider()) {
      return NULL;
    }
    return $this->get('field_media_oembed_video')
      ->iframe_title;
  }

  public function getJsLibrary(): string {
    return 'hdbt/embedded-content-cookie-compliance';
  }

  public function getServiceUrl(): ?string {
    if (!$this->hasProvider()) {
      return NULL;
    }
    $url_resolver = \Drupal::service('media.oembed.url_resolver');
    $video_url = $this->get('field_media_oembed_video')->value;
    $provider = $url_resolver->getProviderByUrl($video_url);
    return rtrim($provider->getUrl(), '/');
  }

  protected function hasProvider(): bool{
    return \Drupal::moduleHandler()->moduleExists('oembed_providers') &&
      $this->hasField('field_media_oembed_video');
  }

}
