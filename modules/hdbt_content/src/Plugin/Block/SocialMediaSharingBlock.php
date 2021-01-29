<?php

namespace Drupal\hdbt_content\Plugin\Block;

use Drupal\social_media\Plugin\Block\SocialSharingBlock;
use Drupal\social_media\Event\SocialMediaEvent;
use Drupal\Core\Template\Attribute;

/**
 * Provides a 'SocialMediaSharingBlock' block.
 *
 * @Block(
 *  id = "hdbt_content_social_sharing_block",
 *  admin_label = @Translation("Social Media Sharing block"),
 * )
 */
class SocialMediaSharingBlock extends SocialSharingBlock {

  /**
   * {@inheritdoc}
   */
  public function build() {

    global $base_url;

    $library = ['social_media/basic'];
    $settings = [];
    $icon_path = $base_url . '/' . drupal_get_path('module', 'social_media') . '/icons/';
    $elements = [];
    $social_medias = $this->configFactory
      ->get('social_media.settings')
      ->get('social_media');

    // Call pre_execute event before doing anything.
    $event = new SocialMediaEvent($social_medias);
    $this->eventDispatcher->dispatch('social_media.pre_execute', $event);
    $social_medias = $event->getElement();

    $social_medias = $this->sortSocialMedias($social_medias);
    foreach ($social_medias as $name => $social_media) {

      // Replace api url with different link.
      if ($name == "email" && isset($social_media['enable_forward']) && $social_media['enable_forward']) {
        $social_media['api_url'] = str_replace('mailto:', '/social-media-forward', $social_media['api_url']);
        $social_media['api_url'] .= '&destination=' . $this->currentPath->getPath();
        if (isset($social_media['show_forward']) && $social_media['show_forward'] == 1) {
          $library[] = 'core/drupal.dialog.ajax';
        }
      }

      if ($social_media['enable'] == 1 && !empty($social_media['api_url'])) {
        $elements[$name]['text'] = $social_media['text'];
        $elements[$name]['api'] = new Attribute([$social_media['api_event'] => $this->token->replace($social_media['api_url'])]);

        if (isset($social_media['library']) && !empty($social_media['library'])) {
          $library[] = $social_media['library'];
        }
        if (isset($social_media['attributes']) && !empty($social_media['attributes'])) {
          $elements[$name]['attr'] = $this->socialMediaConvertAttributes($social_media['attributes']);
        }
        if (isset($social_media['drupalSettings']) && !empty($social_media['drupalSettings'])) {
          $settings['social_media'] = $this->socialMediaConvertDrupalSettings($social_media['drupalSettings']);
        }

        if (isset($social_media['default_img']) && $social_media['default_img']) {
          $elements[$name]['img'] = $icon_path . $name . '.svg';
        }
        elseif (!empty($social_media['img'])) {
          $elements[$name]['img'] = $social_media['img'];
        }

        if (isset($social_media['enable_forward']) && $social_media['enable_forward']) {
          if (isset($social_media['show_forward']) && $social_media['show_forward'] == 1) {
            $elements[$name]['forward_dialog'] = $social_media['show_forward'];
          }

        }

      }
    }

    $build = [];

    $event = new SocialMediaEvent($elements);
    $this->eventDispatcher->dispatch('social_media.pre_render', $event);
    $elements = $event->getElement();

    $build['social_sharing_block'] = [
      '#theme' => 'social_media_links',
      '#elements' => $elements,
      '#attached' => [
        'library' => $library,
        'drupalSettings' => $settings,
      ],
      '#cache' => [
        'tags' => [
          'social_media:' . $this->currentPath->getPath(),
        ],
        'contexts' => [
          'url',
        ],
      ],
    ];

    return $build;
  }

}
