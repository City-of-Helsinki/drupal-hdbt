<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'HeroBlock' block.
 *
 * @Block(
 *  id = "hero_block",
 *  admin_label = @Translation("Hero block"),
 * )
 */
class HeroBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {
    $node = \Drupal::routeMatch()->getParameter('node');
    $build = [];

    if (!empty($node)) {
      $paragraph_id = $node->field_hero->target_id;

      $build = [
        '#theme' => 'hero_block',
        '#title' => $this->t('Hero block'),
        '#paragraph_id' => $paragraph_id,
        '#cache' => [
          'tags' => [
            'node:' . $node->id,
          ],
          'contexts' => [
            'route',
          ],
        ],
      ];
    }

    return $build;
  }
}
