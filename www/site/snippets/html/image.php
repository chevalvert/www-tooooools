<?php
  if (!$image) return;

  $alt = isset($alt)
    ? Escape::html($alt)
    : Str::slug($site->title() . '_' . $image->parent()->title()) . '_' . $image->filename();

  $full = $image->thumb('default');

  $preset = $preset ?? 'default';
  $preset = option("thumbs.presets.$preset", option('thumbs.presets.default'));
  $thumb = $preset['crop'] ?? false
    ? $image->focusCrop($preset['width'] ?? null, $preset['height'] ?? null, $preset)
    : $image->thumb($preset);

  $width = $thumb->width();
  $height = $thumb->height();
  $empty = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 $width $height'%3E%3C/svg%3E";

  echo Html::tag('figure', [
    Html::img($empty, [
      'data-lazyload' => 'true',
      'data-src' => $thumb->url(),
      'alt' => $alt,
      'loading' => 'lazy',
      'width' => $width,
      'height' => $height,
      'data-width' => $full->width(),
      'data-height' => $full->height(),
      'data-zoom-src' => $full->url(),
      'style' => '
        --focus-x: ' . $image->focusPercentageX() . '%;
        --focus-y: ' .  $image->focusPercentageY() . '%;
      '
    ]),
    Html::tag('figcaption', [Str::widont($caption ?? '')]),
    Html::tag('noscript',
      Html::img($full->url(), compact('alt'))
    )
  ], ['class' => 'image']);

