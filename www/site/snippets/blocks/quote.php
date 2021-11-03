<blockquote>
  <div class='blockquote__content'><?= $block->text()->widont() ?></div>
  <?php if ($block->citation()->isNotEmpty()): ?>
  <footer>
    <?= $block->citation()->widont() ?>
  </footer>
  <?php endif ?>
</blockquote>
