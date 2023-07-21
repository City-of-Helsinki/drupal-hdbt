<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\Core\Url;

class ServiceList extends HelfiParagraphBase {

  public function getServicesList(): ?string {
    if ($this->hasField('field_service_list_services')) {
      return $this->getListAsString(
        'field_service_list_services',
        'target_id'
      );
    }
    return NULL;
  }

}
