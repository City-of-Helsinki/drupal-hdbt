<?php

namespace Drupal\hdbt_default\Entity;

/**
 * Bundle class for accordion_item paragraph.
 */
class AccordionItem extends HelfiParagraphBase {

  /**
   * Does parent paragraph have a heading.
   *
   * @return bool
   *   Parent paragraph has a heading.
   */
  public function hasTitle(): bool {
    return !$this->getParentEntity()
      ->get('field_accordion_title')
      ->isEmpty();
  }

  /**
   * Check if accordion paragraph has a title and set item heading level
   * based on that. If not, use level given by editor.
   *
   * @return string
   */
  public function getTitleHeadingLevel(): int {
    if (!$this->hasTitle()) {
      return $this->getTitleLevel();
    }

    $title_level = $this->getTitleLevel();
    $heading_level = (int) $this->getParentEntity()
      ->get('field_accordion_heading_level')
      ->getString();

    // Remove inaccessible skipping between title level and item level.
    // For example:
    // title h3, item h6 --> fixed item h4,
    // title h2, item h3 --> item h3,
    // title h3, item h3 --> item h3,
    // title h5, item h3 --> item h3.
    return ($title_level+1) < $heading_level ? ($title_level+1) : $heading_level;
  }

  /**
   * Get the title level.
   *
   * @return int
   *   The title level.
   */
  protected function getTitleLevel(): int {
    return (int) $this->getParentEntity()
      ->get('field_accordion_title_level')
      ->getString();
  }

}
