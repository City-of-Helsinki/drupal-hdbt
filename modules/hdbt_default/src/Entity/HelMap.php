<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\Core\Url;

class HelMap extends HelfiMediaBase {
  public function getIframeTitle(): ?string {
    if ($this->hasField('field_media_hel_map')) {
      return $this->get('field_media_hel_map')->title;
    }
    return NULL;
  }

  public function getServiceUrl(): ?string {
    $map_url = $this->field_media_hel_map->uri;
    $url_parts = parse_url($map_url);
    return $url_parts['scheme'] . "://" . $url_parts['host'];
  }

}
