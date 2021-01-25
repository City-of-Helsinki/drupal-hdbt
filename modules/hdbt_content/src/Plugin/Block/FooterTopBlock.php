<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'FooterTopBlock' block.
 *
 * @Block(
 *  id = "footer_top_block",
 *  admin_label = @Translation("Footer top block"),
 * )
 */
class FooterTopBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];
    $settings = \Drupal::config('hdbt_admin_tools.site_settings');

    $build['#theme'] = 'footer_top_content';
    $build['#title'] = $settings->get('footer_settings.footer_top_title');
    $build['#content'] = [
      '#type' => 'processed_text',
      '#text' => $settings->get('footer_settings.footer_top_content.value'),
      '#format' => $settings->get('footer_settings.footer_top_content.format'),
    ];

    return $build;
  }

}
