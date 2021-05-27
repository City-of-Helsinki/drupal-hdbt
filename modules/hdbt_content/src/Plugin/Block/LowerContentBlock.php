<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'LowerContentBlock' block.
 *
 * @Block(
 *  id = "lower_content_block",
 *  admin_label = @Translation("Lower content block"),
 * )
 */
class LowerContentBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    // These entity types have lower content field.
    $entity_types = [
      'node',
      'tpr_unit',
      'tpr_service'
    ];

    // Get the route parameters.
    $route_parameters = \Drupal::routeMatch()->getParameters();
    $entity = FALSE;
    $build = [
      '#cache' => [
        'contexts' => [
          'route',
        ],
      ],
    ];

    // Match the entity types with current entity type.
    foreach ($entity_types as $entity_type) {
      if (!$route_parameters->has($entity_type)) {
        continue;
      }
      $entity = $route_parameters->get($entity_type);
      break;
    }

    if (!$entity || !$entity->hasField('field_lower_content')) {
      return $build;
    }

    // Build render array if current entity has lower content field.
    return $build['lower_content'] = [
      '#theme' => 'lower_content_block',
      '#title' => $this->t('Lower content block'),
      '#paragraphs' => $entity->field_lower_content,
      '#cache' => [
        'tags' => $entity->getCacheTags(),
      ],
    ];
  }
}
