<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for phasing paragraph.
 */
class Phasing extends HelfiParagraphBase {

  /**
   * Get heading level for title.
   *
   * @return string
   *   heading level.
   */
  public function getHeadingLevel() {
    $headingLevel = $this->get('field_phasing_item_title_level')
      ->getString();

    return "h$headingLevel";
  }

}
