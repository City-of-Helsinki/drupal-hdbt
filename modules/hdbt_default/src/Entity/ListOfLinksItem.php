<?php

namespace Drupal\hdbt_default\Entity;

class ListOfLinksItem extends HelfiParagraphBase {

  public function getDesign(): string {
    return $this->getParentEntity()
      ->get('field_list_of_links_design')
      ->getString();
  }

  public function hasTitle(): bool {
    return !$this->getParentEntity()
      ->get('field_list_of_links_title')
      ->isEmpty();
  }

}
