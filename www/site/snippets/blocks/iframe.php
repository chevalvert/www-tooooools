<figure>
  <iframe src='<?= $block->url() ?>'></iframe>
  <?php if ($block->caption()->isNotEmpty()): ?>
  <figcaption><?= $block->caption()->widont() ?></figcaption>
  <?php endif ?>
</figure>
