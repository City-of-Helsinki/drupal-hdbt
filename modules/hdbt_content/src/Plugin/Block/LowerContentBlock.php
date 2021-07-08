<?php
namespace Drupal\hdbt_content\Plugin\Block;
use Drupal\Core\Block\BlockBase;
use Drupal\Core\Cache\Cache;
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
   * Allowed entity types.
   *
   * @var string[]
   */
  protected array $allowedTypes = [
    'node',
    'tpr_unit',
    'tpr_service'
  ];
  /**
   * The current entity.
   *
   * @var bool|object
   */
  protected $entity = FALSE;
  /**
   * Set the entity as current entity.
   *
   * @param $entity
   *   Either TPR entity or node.
   * @param $entity_type
   *   Entity type to be set.
   */
  public function setEntity($entity, $entity_type) {
    if (is_numeric($entity)) {
      $entity_type_manager = \Drupal::entityTypeManager();
      $entity = $entity_type_manager->getStorage($entity_type)->load($entity);
    }
    $this->entity = $entity;
  }
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
    if (!$this->entity || !$this->entity->hasField('field_lower_content')) {
      return $build;
    }
    // Build render array if current entity has lower content field.
    return $build['lower_content'] = [
      '#theme' => 'lower_content_block',
      '#title' => $this->t('Lower content block'),
      '#paragraphs' => $this->entity->field_lower_content,
    ];
  }
  /**
   * Match current route with entity.
   */
  protected function entityMatch() {
    // Get the route parameters.
    $route_parameters = \Drupal::routeMatch()->getParameters();
    // Match the entity types with current entity type.
    foreach ($this->allowedTypes as $entity_type) {
      if (!$route_parameters->has($entity_type)) {
        continue;
      }
      $this->setEntity($route_parameters->get($entity_type), $entity_type);
      break;
    }
  }
}
