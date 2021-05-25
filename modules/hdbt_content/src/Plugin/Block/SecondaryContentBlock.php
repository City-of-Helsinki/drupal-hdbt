<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;

/**
 * Provides a 'SecondaryContentBlock' block.
 *
 * @Block(
 *  id = "secondary_content_block",
 *  admin_label = @Translation("Secondary content block"),
 * )
 */
class SecondaryContentBlock extends BlockBase {

  /**
   * {@inheritdoc}
   */
  public function build() {

    // These entity types have secondary content field.
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

    if (!$entity || !$entity->hasField('field_secondary_content')) {
      return $build;
    }

    // Build render array if current entity has secondary content field.
    return $build['secondary_content'] = [
      '#theme' => 'secondary_content_block',
      '#title' => $this->t('Secondary content block'),
      '#paragraphs' => $entity->field_secondary_content,
      '#cache' => [
        'tags' => $entity->getCacheTags(),
      ],
    ];
  }
}
