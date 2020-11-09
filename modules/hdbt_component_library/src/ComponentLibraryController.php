<?php

namespace Drupal\hdbt_component_library;

use Drupal\Core\Controller\ControllerBase;

/**
 * Provides route response for HDBT Component library.
 */
class ComponentLibraryController extends ControllerBase {

  /**
   * Returns a response for component library page.
   *
   * @return array
   *   Renderable array.
   */
  public function componentLibrary() {
    return [
      '#theme' => 'component_library',
    ];
  }

}
