<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for hel_map paragraph.
 */
class HelMap extends HelfiMediaBase {

  /**
   * Get service provider url.
   *
   * @return string|null
   *   Url of the service provider.
   */
  public function getServiceUrl(): ?string {
    $map_url = $this->field_media_hel_map->uri;
    $url_parts = parse_url($map_url);
    return $url_parts['scheme'] . "://" . $url_parts['host'];
  }

  /**
   * Get the title of map.
   *
   * @return string|null
   *   The title of the map.
   */
  public function getMediaTitle(): ?string {
    return $this->get('field_media_hel_map')
      ->title;
  }

}
