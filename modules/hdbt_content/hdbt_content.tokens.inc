<?php

/**
 * @file
 * Contains token data for HDBT content.
 */

use Drupal\Core\Render\BubbleableMetadata;
use Drupal\image\Entity\ImageStyle;
use Drupal\media\MediaInterface;

/**
 * Implements hook_token_info().
 */
function hdbt_content_token_info() {

  $info['tokens']['site']['default-og-image'] = [
    'name' => t('Default OG Image'),
    'description' => t('Default OG image is used as a default thumbnail in social networks and other services.'),
  ];

  $info['tokens']['node']['shareable-image'] = [
    'name' => t('Shareable image'),
    'description' => t('Shareable image is used as a thumbnail in social networks and other services.'),
  ];

  return $info;
}

/**
 * Implements hook_tokens().
 */
function hdbt_content_tokens(
  $type,
  $tokens,
  array $data,
  array $options,
  BubbleableMetadata $bubbleable_metadata
) {
  $replacements = [];

  foreach ($tokens as $name => $original) {
    $default_image = '';

    /** @var Drupal\Core\Extension\ThemeHandler $theme_handler */
    $theme_handler = Drupal::service('theme_handler');

    // Add default og-image as the shareable image.
    if ($theme_handler->themeExists('hdbt')) {
      $theme = $theme_handler->getTheme('hdbt');
      $default_image = "/{$theme->getPath()}/src/images/og-global.png";
    }

    // Custom token for default-og-image.
    if ($name === 'default-og-image') {
      $replacements[$original] = $default_image;
    }

    // Handle fallback image for TPR Unit.
    if ($name === 'picture' && $type === 'tpr_unit' && !empty($data[$type])) {
      /** @var \Drupal\helfi_tpr\Entity\Unit $entity */
      $entity = $data[$type];
      $replacements[$original] = $entity->getPictureUrl() ?? $default_image;
    }

    // Custom token for shareable-image.
    if ($name === 'shareable-image' && !empty($data['node'])) {
      /** @var \Drupal\node\Entity\Node $node */
      $node = $data['node'];

      $image_style = ImageStyle::load('og_image');

      $use_default = FALSE;

      if (
        $node->hasField('field_liftup_image') &&
        isset($node->field_liftup_image->entity) &&
        $node->field_liftup_image->entity instanceof MediaInterface &&
        $node->field_liftup_image->entity->hasField('field_media_image')
      ) {
        // If liftup image has an image set, use it as the shareable image.
        $image_entity = $node->field_liftup_image->entity->field_media_image;
        $image_path = $image_entity->entity->getFileUri();
        $image_uri = $image_style->buildUri($image_path);
      }
      elseif (
        $node->hasField('field_image') &&
        isset($node->field_image->entity) &&
        $node->field_image->entity instanceof MediaInterface &&
        $node->field_image->entity->hasField('field_media_image')
      ) {
        // If the node has an image, use that.
        $image_entity = $node->field_image->entity->field_media_image;
        $image_path = $image_entity->entity->getFileUri();
        $image_uri = $image_style->buildUri($image_path);
      }
      elseif (
        $node->hasField('field_organization') &&
        isset($node->field_organization) &&
        $node->field_organization->entity->hasField('field_default_image') &&
        !$node->field_organization->entity->field_default_image->isEmpty()
      ) {
        // Use the image from the taxonomy term.
        $taxonomy_term = $node->field_organization->entity;
        $image_entity = $taxonomy_term->field_default_image;
        $image_path = $image_entity->entity->getFileUri();
        $image_uri = $image_style->buildUri($image_path);
      }
      else {
        // Use the default image.
        $use_default = TRUE;

        $image_url = $default_image;
      }

      // Create derivative if necessary.
      if (!$use_default && !file_exists($image_uri)) {
        $image_style->createDerivative($image_path, $image_uri);
        $image_url = $image_style->buildUrl($image_path);
      }

      $replacements[$original] = $image_url;
    }
  }

  return $replacements;
}
