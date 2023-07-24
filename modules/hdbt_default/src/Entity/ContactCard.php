<?php

namespace Drupal\hdbt_default\Entity;

use Symfony\Contracts\Translation\TranslatorTrait;

/**
 * Bundle class for contact_card paragraph.
 */
class ContactCard extends HelfiParagraphBase {

  use TranslatorTrait;

  /**
   * Get the contact image.
   *
   * @return array
   *   The contact image.
   */
  public function getContactImage(): array {
    $image = $this->get('field_contact_image')[0];
    if (
      $image &&
      $this->hasField('field_contact_image_photographer') &&
      $this->hasField('field_contact_image')
    ) {
      $photographer = $this->get('field_contact_image_photographer')->value;
      $alt = $this->t('@alt @photographer_text: @photographer', [
        '@alt' => $this->get('field_contact_image')->alt,
        '@photographer_text' => $this->t('Photographer'),
        '@photographer' => $photographer,
      ]);

      $image->alt = $alt;
    }
    return $image->view();
  }

  /**
   * Get the heading level.
   *
   * @return string|null
   *   Level of heading.
   */
  public function getHeadingLevel(): ?string {
    $parent = $this->getParentEntity();
    if (
      $parent->hasField('field_title') &&
      !$parent->get('field_title')->isEmpty()
    ) {
      return 'h3';
    }
    return NULL;
  }

}
