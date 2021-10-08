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

    // No need to continue if current entity doesn't have has_hero field.
    if (
      !$entity instanceof ContentEntityInterface ||
      !$entity->hasField('field_has_hero')
    ) {
      return $build;
    }

    // @todo Support preview on entity reference fields ie. paragraphs.
    if ((bool) $entity->get('field_has_hero')->value) {
      $first_paragraph_grey = '';

      // Handle only landing page.
      if (
        $entity->getType() === 'landing_page' &&
        isset($entity->get('field_content')->first()->entity)
      ) {
        // Check if the content field first paragraph is Unit search
        // and add classes accordingly.
        $paragraph = $entity->get('field_content')->first()->entity;
        if (!empty($paragraph) && $paragraph->getType() === 'unit_search') {
          $first_paragraph_grey = 'has-first-gray-bg-block';
        }
      }

      $build['hero_block'] = [
        '#theme' => 'hero_block',
        '#title' => $this->t('Hero block'),
        '#paragraphs' => $entity->field_hero,
        '#is_revision' => $entity_version == EntityVersionMatcher::ENTITY_VERSION_REVISION,
        '#first_paragraph_grey' => $first_paragraph_grey,
        '#cache' => [
          'tags' => $entity->getCacheTags(),
        ],
      ];
    }

    return $build;
  }

}
