<?php
  if (!$image) return;

  $alt = isset($alt)
    ? Escape::html($alt)
    : Str::slug($site->title() . '_' . $image->parent()->title()) . '_' . $image->filename();

  $full = $image->thumb('default');
  // $width = $full->width();
  // $height = $full->height();
  // $empty = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 $width $height'%3E%3C/svg%3E";

  $srcset = [];
  foreach (option('thumbs.srcsets.' . ($srcsetPreset ?? 'default')) as $breakpoint => $preset) {
    $thumb = $image->thumb($preset);
    $srcset[] = $thumb->url() . ' ' . $breakpoint;
  }

  // TODO: srcset
  // TODO: lazyload
  echo Html::tag('figure', [
    Html::img($full->url(), [
      // 'data-lazyload' => true,
      // 'data-srcset' => implode(', ', $srcset),
      'alt' => $alt,
      'loading' => 'lazy',
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

