<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\Core\StringTranslation\StringTranslationTrait;

class ParagraphRemoteVideo extends HelfiParagraphBase {

  use StringTranslationTrait;

  public function getIframeTitle(): ?string
  {
    if (!$this->isValid()) {
      return NULL;
    }

    return $this->get('field_iframe_title')->isEmpty()
      ? $this->t('Embedded video') : $this->get('field_iframe_title')->value;
  }

  private function isValid(): bool {
    if (
      !$this->hasField('field_remote_video') ||
      !$this->hasField('field_iframe_title') ||
      $this->get('field_remote_video')->isEmpty()
    ) {
      return FALSE;
    }

    return TRUE;
  }

}
