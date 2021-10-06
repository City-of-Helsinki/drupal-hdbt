<?php

namespace Drupal\hdbt_content;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\Core\Language\LanguageInterface;
use Drupal\Core\Language\LanguageManagerInterface;
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
   * The language manager service.
   *
   * @var \Drupal\Core\Language\LanguageManagerInterface|null
   */
  protected $languageManager;

  /**
   * Creates a new EntityVersionMatcher instance.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity manager.
   * @param \Drupal\Core\Routing\RouteMatchInterface $route_match
   *   The currently active route match object.
   * @param \Drupal\Core\Language\LanguageManagerInterface|null $language_manager
   *   The language manager service.
   */
  public function __construct(EntityTypeManagerInterface $entity_type_manager, RouteMatchInterface $route_match, LanguageManagerInterface $language_manager) {
    $this->entityTypeManager = $entity_type_manager;
    $this->routeMatch = $route_match;
    $this->languageManager = $language_manager;
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
    $language = $this->languageManager->getCurrentLanguage(LanguageInterface::TYPE_CONTENT);

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
          $storage = $this->entityTypeManager->getStorage($entity_type);
          $revision_id = $this->routeMatch->getParameter("{$entity_type}_revision");
          if ($revision_id instanceof ContentEntityInterface) {
            $revision_id = $revision_id->getRevisionId();
          }
          $revision = $storage->loadRevision($revision_id);
          $entity = $revision->getTranslation($language->getId());
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
