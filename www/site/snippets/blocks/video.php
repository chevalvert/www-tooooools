<?php

  $video = video($block->url(), [], ['data-lazyload' => 'true']);
  if (!$video) return;

  // Replace `src` by `data-src` to enable lazyloading
  $video = preg_replace('/src=\"(.*?)\"/', 'data-src="$1"', $video);
?>

<figure class='video'>
  <?= $video ?>

  <?php if ($block->caption()->isNotEmpty()) : ?>
    <figcaption><?= $block->caption()->widont() ?></figcaption>
  <?php endif ?>
</figure>
