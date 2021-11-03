<?php if ($video = video($block->url())): ?>
<figure class='video'>
  <?= $video ?>
  <?php if ($block->caption()->isNotEmpty()): ?>
  <figcaption><?= $block->caption()->widont() ?></figcaption>
  <?php endif ?>
</figure>
<?php endif ?>
