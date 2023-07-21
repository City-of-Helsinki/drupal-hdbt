<?php

namespace Drupal\hdbt_default\Entity;

class Phasing extends HelfiParagraphBase {

  public function getHeadingLevel() {
    $headingLevel = $this->get('field_phasing_item_title_level')
      ->getString();

    return "h$headingLevel";
  }

}
