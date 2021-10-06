<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\hdbt_content\EntityVersionMatcher;

/**
 * Provides a 'SidebarContentBlock' block.
 *
 * TODO: When update helper module is in use, create upgrade path for this block.
 *
 * @Block(
 *  id = "sidebar_content_block",
 *  admin_label = @Translation("Sidebar content block"),
 * )
 */
class SidebarContentBlock extends BlockBase {

  /**
   * The current entity.
   *
   * @var bool|object
   */
  protected $entity = FALSE;

  /**
   * The current entity version.
   *
   * @var bool|object
   */
  protected $entityVersion = FALSE;

  /**
   * {@inheritdoc}
   */
  public function getCacheTags() {
    $this->entityMatch();
    if (!$this->entity) {
      return parent::getCacheTags();
    }
    return Cache::mergeTags(parent::getCacheTags(), $this->entity->getCacheTags());
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
    $this->entityMatch();

    // Handle only if sidebar content exists.
    if (
      !$this->entity instanceof ContentEntityInterface ||
      !$this->entity->hasField('field_sidebar_content')
    ) {
      return $build;
    }

    // Build render array if current entity has sidebar content field.
    return $build['sidebar_content'] = [
      '#theme' => 'sidebar_content_block',
      '#is_revision' => $this->entityVersion == EntityVersionMatcher::ENTITY_VERSION_REVISION,
      '#title' => $this->t('Sidebar content block'),
      '#paragraphs' => $this->entity->field_sidebar_content,
      '#cache' => [
        'tags' => $this->entity->getCacheTags(),
      ],
    ];
  }

  /**
   * Get current entity and entity version (canonical, revision or preview).
   */
  protected function entityMatch() {
    /** @var \Drupal\Core\Entity\ContentEntityInterface $entity */
    $entity_matcher = \Drupal::service('hdbt_content.entity_version_matcher')->getType();
    $this->entity = $entity_matcher['entity'];
    $this->entityVersion = $entity_matcher['entity_version'];
  }

}
