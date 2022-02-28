<?php $content = $content ?? '' ?>

<article class='article'>
  <?= is_array($content) ? implode(PHP_EOL, $content) : $content ?>
</article>
