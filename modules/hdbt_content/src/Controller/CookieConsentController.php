<?php

namespace Drupal\hdbt_content\Controller;

use Drupal\Core\Config\ConfigFactoryInterface;
use Drupal\Core\Controller\ControllerBase;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Defines CookieConsentController class.
 */
class CookieConsentController extends ControllerBase {

  /**
   * The configuration factory.
   *
   * @var \Drupal\Core\Config\ConfigFactoryInterface
   */
  protected $configFactory;

  /**
   * {@inheritdoc}
   */
  public function __construct(ConfigFactoryInterface $config_factory) {
    $this->configFactory = $config_factory;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('config.factory'),
    );
  }

  /**
   * Display the markup.
   *
   * @return array
   *   Return markup array.
   */
  public function content() {
    $settings = $this->configFactory->get('hdbt_admin_tools.cookie_consent_intro');
    $content = [];

    $content['#theme'] = 'cookie_consent_intro';
    $content['#title'] = $settings->get('cc.title');
    $content['#content'] = [
      '#type' => 'processed_text',
      '#text' => $settings->get('cc.content.value'),
      '#format' => $settings->get('cc.content.format'),
    ];

    return $content;
  }
}
