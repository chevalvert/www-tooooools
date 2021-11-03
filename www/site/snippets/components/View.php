<?php
  $id = $id ?? $view ?? '';
  $view = $view ?? 'default';
  $class = $class ?? '';
  $style = $style ?? '';

  // string|array
  $content = $content ?? snippet("views/$view", [], true);
  if (!$content) return;
?>

<section
  <?= Html::attr('id', $id) ?>
  <?= Html::attr('style', $style) ?>
  class='view <?= $class ?>'
  data-view='<?= $view ?>'
>
  <div class='view__content'>
    <?= is_array($content) ? implode(PHP_EOL, $content) : $content ?>
  </div>
</section>
