<?php

namespace Drupal\hdbt_default\Entity;

class RemoteVideo extends HelfiMediaBase {
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
