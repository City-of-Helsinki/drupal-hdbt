<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Baseclass for list_of_links paragraph.
 */
class ListOfLinksItem extends HelfiParagraphBase {

  /**
   * Get the design.
   *
   * @return string
   *   Design.
   */
  public function getDesign(): string {
    return $this->getParentEntity()
      ->get('field_list_of_links_design')
      ->getString();
  }

  /**
   * Has the title.
   *
   * @return bool
   *   Has title.
   */
  public function hasTitle(): bool {
    return !$this->getParentEntity()
      ->get('field_list_of_links_title')
      ->isEmpty();
  }

}
