<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for unit_search paragraph.
 */
class UnitSearch extends HelfiParagraphBase
{

  /**
   * Get unit lists.
   *
   * @return string|null
   *   Comma separated list of unit ids.
   */
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
