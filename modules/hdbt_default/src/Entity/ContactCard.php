<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\file\Plugin\Field\FieldType\FileItem;
use Drupal\image\Plugin\Field\FieldType\ImageItem;
use Symfony\Contracts\Translation\TranslatorTrait;

class ContactCard extends HelfiParagraphBase {

  use TranslatorTrait;

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
