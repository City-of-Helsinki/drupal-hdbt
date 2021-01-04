<?php

namespace Drupal\hdbt_hyphenopoly;

use Drupal\Component\Render\MarkupInterface;
use Drupal\Core\Render\Markup;
use Drupal\Core\Security\TrustedCallbackInterface;

/**
 * Provides a trusted callback to alter the elements.
 */
class CleanMarkup implements TrustedCallbackInterface {

  /**
   * {@inheritdoc}
   */
  public static function trustedCallbacks(): array {
    return ['postRender'];
  }

  /**
   * Clean element markup from obsolete tags.
   *
   * @param Markup $element
   *   Markup Element.
   *
   * @return MarkupInterface
   *   Cleansed output.
   */
  public static function postRender(Markup $element): MarkupInterface
  {
    return Markup::create(trim(strip_tags($element->__toString())));
  }

}
