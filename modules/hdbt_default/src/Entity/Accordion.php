<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for accordion paragraph.
 */
class Accordion extends HelfiParagraphBase {

  /**
   * Get title level.
   *
   * @return string
   *   The title level.
   */
  public function getTitleLevel(): string {
    return $this->get('field_accordion_title_level')->getString();
  }

}
