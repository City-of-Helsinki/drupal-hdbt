<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for social_media_link paragraph.
 */
class SocialMediaLink extends HelfiParagraphBase {

  /**
   * Get icon name.
   *
   * @return string|null
   *   Name of the icon.
   */
  public function getIconName(): ?string {
    if (!$this->get('field_icon')->isEmpty()) {
      return ucfirst($this->get('field_icon')->icon);
    }
    return NULL;
  }

}
