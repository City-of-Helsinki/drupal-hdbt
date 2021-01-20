<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'HeaderTopButtonsBlock' block.
 *
 * @Block(
 *  id = "header_top_buttons_block",
 *  admin_label = @Translation("Header Top buttons block"),
 * )
 */
class HeaderTopButtonsBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build = [];

    $build['#button_title'] = t('Placeholder');
    $build['#theme'] = 'header_top_button';

    return $build;
  }

}
