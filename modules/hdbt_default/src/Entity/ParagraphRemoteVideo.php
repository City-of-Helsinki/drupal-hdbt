<?php

namespace Drupal\hdbt_default\Entity;

use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Bundle class for remote_video paragraph.
 */
class ParagraphRemoteVideo extends HelfiParagraphBase {

  use StringTranslationTrait;

  /**
   * Get title of video.
   *
   * @return string|null
   *   Title of the video.
   */
  public function getIframeTitle(): ?string {
    if (!$this->isValid()) {
      return NULL;
    }

    return $this->get('field_iframe_title')->isEmpty()
      ? $this->t('Embedded video') : $this->get('field_iframe_title')->value;
  }

  /**
   * Is valid.
   *
   * @return bool
   *   Is valid.
   */
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
