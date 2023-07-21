<?php

namespace Drupal\hdbt_default\Entity;

class ServiceListSearch extends HelfiParagraphBase {

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
