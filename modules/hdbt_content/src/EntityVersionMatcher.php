<?php

namespace Drupal\hdbt_content;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Routing\RouteMatchInterface;

/**
 * Match routes with entity versions (full, revision, preview).
 *
 * @package Drupal\hdbt_content
 */
class EntityVersionMatcher {

  /**
   * Entity version constant for canonical.
   */
  const ENTITY_VERSION_CANONICAL = 'canonical';

  /**
   * Entity version constant for revision.
   */
  const ENTITY_VERSION_REVISION = 'revision';

  /**
   * Entity version constant for preview.
   */
  const ENTITY_VERSION_PREVIEW = 'preview';

  /**
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected EntityTypeManagerInterface $entityTypeManager;

  /**
   * The currently active route match object.
   *
   * @var \Drupal\Core\Routing\RouteMatchInterface
   */
  protected RouteMatchInterface $routeMatch;

  /**
   * Creates a new EntityVersionMatcher instance.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity manager.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The currently active route match object.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, RouteMatchInterface $route_match) {
    $this->entityTypeManager = $entity_type_manager;
    $this->routeMatch = $route_match;
  }

  /**
   * Gets the current page main entity type.
   *
   * @return string|mixed
   *   Returns entity type or false.
   */
  protected function getCurrentEntityType() {
    $types = array_keys($this->entityTypeManager->getDefinitions());
    $params = $this->routeMatch->getParameters()->all();
    foreach ($types as $type) {
      if (!empty($params[$type])) {
        return $type;
      }
    }
    // Special case for node preview.
    if (!empty($this->routeMatch->getRawParameter('node_preview'))) {
      return 'node';
    }
    return FALSE;
  }

  /**
   * Determine whether the current entity is viewed as full entity,
   * entity preview or entity revision.
   *
   * @return array
   *   Returns array with entity version and entity object.
   */
  public function getType() {
    $entity_version = static::ENTITY_VERSION_CANONICAL;
    $entity = FALSE;

    if ($entity_type = $this->getCurrentEntityType()) {
      switch ($this->routeMatch->getRouteName()) {
        // Canonical.
        case "entity.{$entity_type}.canonical":
          $entity_version = static::ENTITY_VERSION_CANONICAL;
          $entity = $this->routeMatch->getParameter($entity_type);
          break;

        // Revision.
        case "entity.{$entity_type}.revision":
          $entity_version = static::ENTITY_VERSION_REVISION;
          $revision_id = $this->routeMatch->getParameter("{$entity_type}_revision");
          if ($revision_id instanceof ContentEntityInterface) {
            $revision_id = $revision_id->getRevisionId();
          }
          $entity = $this->entityTypeManager->getStorage($entity_type)->loadRevision($revision_id);
          break;

        // Preview.
        case "entity.{$entity_type}.preview":
          $entity_version = static::ENTITY_VERSION_PREVIEW;
          $entity = $this->routeMatch->getParameter("{$entity_type}_preview");
          break;
      }
    }
    return [
      'entity_version' => $entity_version,
      'entity' => $entity
    ];
  }

}
