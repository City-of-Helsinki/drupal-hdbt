<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\hdbt_content\EntityVersionMatcher;

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
    if (
      !$this->entity ||
      $this->entityVersion == EntityVersionMatcher::ENTITY_VERSION_REVISION
    ) {
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

    // No need to continue if current entity doesn't have has_hero field.
    if (
      !$this->entity instanceof ContentEntityInterface ||
      !$this->entity->hasField('field_has_hero')
    ) {
      return $build;
    }

    // TODO: Support preview on entity reference fields ie. paragraphs.
    if ((bool) $this->entity->get('field_has_hero')->value) {
      $first_paragraph_grey = '';

      // Handle only landing page.
      if (
        $this->entity->getType() === 'landing_page' &&
        isset($this->entity->get('field_content')->first()->entity)
      ) {
        // Check if the content field first paragraph is Unit search
        // and add classes accordingly.
        $paragraph = $this->entity->get('field_content')->first()->entity;
        if (!empty($paragraph) && $paragraph->getType() === 'unit_search') {
          $first_paragraph_grey = 'has-first-gray-bg-block';
        }
      }

      $build['hero_block'] = [
        '#theme' => 'hero_block',
        '#title' => $this->t('Hero block'),
        '#paragraphs' => $this->entity->field_hero,
        '#is_revision' => $this->entityVersion == EntityVersionMatcher::ENTITY_VERSION_REVISION,
        '#first_paragraph_grey' => $first_paragraph_grey,
        '#cache' => [
          'tags' => $this->entity->getCacheTags(),
        ],
      ];
    }

    return $build;
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
