<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\hdbt_content\EntityVersionMatcher;
use Drupal\helfi_tpr\Entity\Service;
use Drupal\helfi_tpr\Entity\Unit;

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
  public function getCacheTags() {
    $matcher = \Drupal::service('hdbt_content.entity_version_matcher')->getType();

    if (
      !$matcher['entity'] ||
      $matcher['entity_version'] == EntityVersionMatcher::ENTITY_VERSION_REVISION
    ) {
      return parent::getCacheTags();
    }
    return Cache::mergeTags(parent::getCacheTags(), $matcher['entity']->getCacheTags());
  }

  /**
   * {@inheritDoc}
   */
  public function getCacheContexts() {
    return Cache::mergeContexts(parent::getCacheContexts(), ['route']);
  }

  /**
   * {@inheritdoc}
   */
  public function build() {
    $build['lower_content'] = [
      '#theme' => 'lower_content_block',
      '#title' => $this->t('Lower content block'),
    ];

    // Get current entity and entity version.
    $entity_matcher = \Drupal::service('hdbt_content.entity_version_matcher')->getType();

    /** @var \Drupal\Core\Entity\ContentEntityInterface $entity */
    $entity = $entity_matcher['entity'];
    $entity_version = $entity_matcher['entity_version'];

    // Pass the Unit entity render array to templates if one exists.
    if ($entity instanceof Unit) {
      $view_builder = \Drupal::entityTypeManager()->getViewBuilder('tpr_unit');
      $build['lower_content']['#computed'] = $view_builder->view($entity);
      $build['lower_content']['#computed']['#theme'] = 'tpr_unit_lower_content';
    }

    // Pass the Service entity render array to templates if one exists.
    if ($entity instanceof Service) {
      $view_builder = \Drupal::entityTypeManager()->getViewBuilder('tpr_service');
      $build['lower_content']['#computed'] = $view_builder->view($entity);
      $build['lower_content']['#computed']['#theme'] = 'tpr_service_lower_content';
    }

    // Add the lower content paragraphs to render array.
    if (
      $entity instanceof ContentEntityInterface &&
      $entity->hasField('field_lower_content')
    ) {
      $build['lower_content'] = $build['lower_content'] + [
        '#is_revision' => $entity_version == EntityVersionMatcher::ENTITY_VERSION_REVISION,
        '#paragraphs' => $entity->field_lower_content,
        '#cache' => [
          'tags' => $entity->getCacheTags(),
        ],
      ];
    }

    return $build;
  }

}
