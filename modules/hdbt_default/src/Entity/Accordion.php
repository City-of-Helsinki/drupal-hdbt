<?php

namespace Drupal\hdbt_default\Entity;

class Accordion extends HelfiParagraphBase {
  public function getTitleLevel(): string {
    return $this->get('field_accordion_title_level')->getString();
  }
}
