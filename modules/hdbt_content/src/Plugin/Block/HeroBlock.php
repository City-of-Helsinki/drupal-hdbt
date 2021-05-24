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

    if (!empty($node) && $node->hasField('field_has_hero')) {
      $paragraph_id = FALSE;
      $first_paragraph_grey = '';

      if (boolval($node->get('field_has_hero')->getString())) {
        $paragraph_id = $node->field_hero->target_id;
      }

      // Handle only landing page.
      if ($node->getType() === 'landing_page') {
        // Check if the content field first paragraph is Unit search
        // and add classes accordingly.
        $paragraph = $node->get('field_content')->first()->entity;
        if (!empty($paragraph) && $paragraph->getType() === 'unit_search') {
          $first_paragraph_grey = 'has-first-gray-bg-block';
        }
      }

      $build = [
        '#theme' => 'hero_block',
        '#title' => $this->t('Hero block'),
        '#paragraph_id' => $paragraph_id,
        '#first_paragraph_grey' => $first_paragraph_grey,
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
