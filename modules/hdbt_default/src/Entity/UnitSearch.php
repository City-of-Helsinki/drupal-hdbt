<?php

namespace Drupal\hdbt_default\Entity;


class UnitSearch extends HelfiParagraphBase
{
  public function getUnitsList(): ?string {
    if ($this->hasField('field_unit_search_units')) {
      return $this->getListAsString(
        'field_unit_search_units',
        'target_id'
      );
    }
    return NULL;
  }

}
