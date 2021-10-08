<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\hdbt_content\EntityVersionMatcher;

/**
 * Provides a 'SidebarContentBlock' block.
 *
 * @todo When update helper module is in use, create upgrade path for this block.
 *
 * @Block(
 *  id = "sidebar_content_block",
 *  admin_label = @Translation("Sidebar content block"),
 * )
 */
class SidebarContentBlock extends BlockBase {

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
    $build = [];

    // Get current entity and entity version.
    $entity_matcher = \Drupal::service('hdbt_content.entity_version_matcher')->getType();

    /** @var \Drupal\Core\Entity\ContentEntityInterface $entity */
    $entity = $entity_matcher['entity'];
    $entity_version = $entity_matcher['entity_version'];

    // Handle only if sidebar content exists.
    if (
      !$entity instanceof ContentEntityInterface ||
      !$entity->hasField('field_sidebar_content')
    ) {
      return $build;
    }

    // Build render array if current entity has sidebar content field.
    return $build['sidebar_content'] = [
      '#theme' => 'sidebar_content_block',
      '#is_revision' => $entity_version == EntityVersionMatcher::ENTITY_VERSION_REVISION,
      '#title' => $this->t('Sidebar content block'),
      '#paragraphs' => $entity->field_sidebar_content,
      '#cache' => [
        'tags' => $entity->getCacheTags(),
      ],
    ];
  }

}
