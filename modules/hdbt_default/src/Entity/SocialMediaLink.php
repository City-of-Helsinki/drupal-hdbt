<?php

namespace Drupal\hdbt_default\Entity;

class SocialMediaLink extends HelfiParagraphBase {

  public function getIconName(): ?string {
    if (!$this->get('field_icon')->isEmpty()) {
      return ucfirst($this->get('field_icon')->icon);
    }
    return NULL;
  }

}
