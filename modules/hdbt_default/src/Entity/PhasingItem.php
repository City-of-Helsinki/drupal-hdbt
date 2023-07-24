<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for phasing_item paragraph.
 */
class PhasingItem extends HelfiParagraphBase {

  /**
   * Get the heading level, for examle h4.
   *
   * @return string
   *   Heading level.
   */
  public function getHeadingLevel(): string {
    $headingLevel = $this->getParentEntity()
      ->get('field_phasing_item_title_level')
      ->getString();

    return "h$headingLevel";
  }

  /**
   * The number of current phasing item.
   *
   * @return string
   *   Number of item.
   */
  public function getShowNumbers(): string {
    return $this->getParentEntity()
      ->get('field_show_phase_numbers')
      ->value;
  }

}
