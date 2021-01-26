<?php

namespace Drupal\hdbt_component_library;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Controller\ControllerBase;
use GuzzleHttp\Exception\RequestException;

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
    $build = [];

    $icons = $this->getIcons();
    $build['#icons'] = $icons;
    $build['#theme'] = 'component_library';

    return $build;
  }

  /**
   * Get icons from JSON file.
   */
  protected function getIcons() {
    $cached = \Drupal::cache()->get('hdbt_component_library_icons_json');
    if ($cached) {
      return $cached->data;
    }

    try {
      $theme_handler = \Drupal::service('theme_handler');
      $theme_path = $theme_handler->getTheme($theme_handler->getDefault())->getPath();
      $file_path = 'dist/icons.json';
      $json = file_get_contents(realpath("$theme_path/$file_path"));

      if (!empty($json)) {
        $data = json_decode($json, TRUE);
        \Drupal::cache()->set('hdbt_component_library_icons_json', $data, Cache::PERMANENT);
        return $data;
      }
      return FALSE;
    }
    catch (RequestException $error) {
      watchdog_exception('hdbt_component_library', $error);
      return FALSE;
    }
  }

}
