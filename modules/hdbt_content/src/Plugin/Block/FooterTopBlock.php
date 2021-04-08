<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Config\Config;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a 'FooterTopBlock' block.
 *
 * @Block(
 *  id = "footer_top_block",
 *  admin_label = @Translation("Footer top block"),
 * )
 */
class FooterTopBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * Contains the hdbt_admin_tools.site_settings configuration object.
   *
   * @var \Drupal\Core\Config\Config
   */
  protected Config $adminToolsConfig;

  /**
   * Constructs a new FooterTopBlock.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin ID for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\Core\Config\Config $admin_tools_config
   *   Admin tools configuration.
   */
  public function __construct(array $configuration, $plugin_id, $plugin_definition, Config $admin_tools_config) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->adminToolsConfig = $admin_tools_config;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('config.factory')->get('hdbt_admin_tools.site_settings')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];

    $build['#theme'] = 'footer_top_content';
    $build['#title'] = $this->adminToolsConfig->get('footer_settings.footer_top_title');
    $build['#content'] = [
      '#type' => 'processed_text',
      '#text' => $this->adminToolsConfig->get('footer_settings.footer_top_content.value'),
      '#format' => $this->adminToolsConfig->get('footer_settings.footer_top_content.format'),
    ];

    return $build;
  }

}
