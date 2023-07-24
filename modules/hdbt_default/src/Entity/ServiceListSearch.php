<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for service_list_search paragraph.
 */
class ServiceListSearch extends HelfiParagraphBase {

  /**
   * Get services list for search.
   *
   * @return string|null
   *   Concatenated list of service list ids and target ids.
   */
  public function getServicesListSearch(): ?string {
    $ids = '';
    $service_ids = '';

    if ($this->hasField('field_service_list_services')) {
      $ids = $this->getListAsString(
        'field_service_list_services',
        'target_id'
      );
    }
    if ($this->hasField('field_service_list_service_ids')) {
      $service_ids = $this->getListAsString(
        'field_service_list_service_ids',
        'value'
      );
    }

    return "$ids|$service_ids";
  }

}
