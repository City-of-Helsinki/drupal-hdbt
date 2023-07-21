<?php

namespace Drupal\hdbt_default\Entity;

class PhasingItem extends HelfiParagraphBase {

  public function getHeadingLevel(): string {
    $headingLevel = $this->getParentEntity()
      ->get('field_phasing_item_title_level')
      ->getString();

    return "h$headingLevel";
  }

  public function getShowNumbers(): string {
    return $this->getParentEntity()
      ->get('field_show_phase_numbers')
      ->value;
  }

}
