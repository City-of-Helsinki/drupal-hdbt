<?php

namespace Drupal\hdbt_component_library;

use Drupal\Core\Cache\Cache;
use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Extension\ThemeHandler;
use GuzzleHttp\Exception\RequestException;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides route response for HDBT Component library.
 */
class ComponentLibraryController extends ControllerBase {

  /**
   * The theme handler.
   *
   * @var \Drupal\Core\Extension\ThemeHandler
   */
  protected ThemeHandler $themeHandler;

  /**
   * The cache.
   *
   * @var \Drupal\Core\Cache\CacheBackendInterface
   */
  protected CacheBackendInterface $cache;

  /**
   * Constructs a Component library controller.
   *
   * @param \Drupal\Core\Extension\ThemeHandler $themeHandler
   *   The theme handler.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   The cache backend.
   */
  public function __construct(ThemeHandler $themeHandler, CacheBackendInterface $cache_backend) {
    $this->themeHandler = $themeHandler;
    $this->cache = $cache_backend;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('theme_handler'),
      $container->get('cache.default')
    );
  }

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
    $cached = $this->cache->get('hdbt_component_library_icons_json');
    if ($cached) {
      return $cached->data;
    }

    try {
      $theme_path = $this->themeHandler->getTheme($this->themeHandler->getDefault())->getPath();
      $file_path = 'dist/icons.json';
      $json = file_get_contents(realpath("$theme_path/$file_path"));

      if (!empty($json)) {
        $data = json_decode($json, TRUE);
        $this->cache->set('hdbt_component_library_icons_json', $data, Cache::PERMANENT);
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
