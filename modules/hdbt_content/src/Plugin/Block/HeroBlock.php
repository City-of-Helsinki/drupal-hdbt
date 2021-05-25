<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\node\NodeInterface;

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
    /** @var \Drupal\node\NodeInterface $node */
    $node = \Drupal::routeMatch()->getParameter('node');
    $build = [
      '#cache' => [
        'contexts' => [
          'route',
        ],
      ],
    ];

    if (!$node instanceof NodeInterface || !$node->hasField('field_has_hero')) {
      return $build;
    }

    $paragraph_id = FALSE;
    $first_paragraph_grey = '';

    if ((bool) $node->get('field_has_hero')->value) {
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

    $build['hero_block'] = [
      '#theme' => 'hero_block',
      '#title' => $this->t('Hero block'),
      '#paragraph_id' => $paragraph_id,
      '#first_paragraph_grey' => $first_paragraph_grey,
      '#cache' => [
        'tags' => $node->getCacheTags(),
      ],
    ];

    return $build;
  }
}
