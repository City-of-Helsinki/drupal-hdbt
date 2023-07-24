<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for remote_video media.
 */
class RemoteVideo extends HelfiMediaBase {

  /**
   * Get the video service provider url.
   *
   * @return string|null
   *   Url of video service provider.
   */
  public function getServiceUrl(): ?string {
    if (!$this->hasProvider()) {
      return NULL;
    }
    $url_resolver = \Drupal::service('media.oembed.url_resolver');
    $video_url = $this->get('field_media_oembed_video')->value;
    $provider = $url_resolver->getProviderByUrl($video_url);
    return rtrim($provider->getUrl(), '/');
  }

  public function getMediaTitle() {
    return $this->get('field_media_oembed_video')
      ->iframe_title;
  }

}
