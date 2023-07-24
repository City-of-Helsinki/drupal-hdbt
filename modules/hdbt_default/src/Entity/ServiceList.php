<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for service_list paragraph.
 */
class ServiceList extends HelfiParagraphBase {

  /**
   * Get list of services.
   *
   * @return string|null
   *   Comma separated string of service entity ids.
   */
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
