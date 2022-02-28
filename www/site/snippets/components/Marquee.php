<?php
  $content = $content ?? null;
  if (!$content) return;
  $content = is_array($content) ? $content : [$content];

  $length = $length ?? 1;
  $tag = $tag ?? 'span';
  $offset = $offset ?? 0;
?>

<div class='marquee' data-offset='<?= number_format($offset, 3) ?>'>
  <div class='marquee__content'>
    <?php
      for ($i = 0; $i < $length; $i++) {
        $attributes = ['aria-hidden' => $i > 0 ? 'true' : null];
        foreach ($content as $html) echo Html::tag($tag, [$html], $attributes);
      }
    ?>
  </div>
</div>
