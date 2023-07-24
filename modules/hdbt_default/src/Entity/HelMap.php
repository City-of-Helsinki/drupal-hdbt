<?php

namespace Drupal\hdbt_default\Entity;

class HelMap extends HelfiMediaBase {
  public function getServiceUrl(): ?string {
    $map_url = $this->field_media_hel_map->uri;
    $url_parts = parse_url($map_url);
    return $url_parts['scheme'] . "://" . $url_parts['host'];
  }

  public function getMediaTitle() {
    return $this->get('field_media_hel_map')
      ->title;
  }
}
