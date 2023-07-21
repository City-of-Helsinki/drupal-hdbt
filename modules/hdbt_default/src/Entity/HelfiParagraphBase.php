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

}
