<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\paragraphs\Entity\Paragraph;
use Drupal\paragraphs\ParagraphInterface;

class HelfiParagraphBase extends Paragraph implements ParagraphInterface {

  /**
   * @return string
   */
  public function getThemePath() {
    /** @var \Drupal\Core\File\FileUrlGeneratorInterface $service */
    $service = \Drupal::service('file_url_generator');

    // Add theme path to as variable.
    $theme = \Drupal::service('theme_handler')->getTheme('hdbt');
    return $service->generate($theme->getPath())
      ->toString(TRUE)->getGeneratedUrl();
  }

  public function getSearchParentParagraph(): string|int|null {
    return $this->id();
  }

  /**
   * Turn list fields to comma separated strings, used by service lists.
   *
   * @param $field_name
   *   Name of the field.
   * @param $type
   *   'target_id' for entity reference fields, 'value' for string or number.

   * @return string
   *   Comma separated string of list items.
   */
  protected function getListAsString($field_name, $type): string {
    return implode(',', array_map(function ($service) use ($type) {
      return $service[$type];
    }, $this->get($field_name)->getValue()));
  }

}
