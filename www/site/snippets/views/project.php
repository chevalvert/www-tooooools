<article>
  <?php if ($kirby->language() == 'en') : ?>
  <p><em><?= t('no-translation') ?></em></p>
  <?php endif ?>

  <?php if ($page->subtitle()->isNotEmpty()) : ?>
    <h3><?= $page->subtitle()->widont() ?></h3>
  <?php endif ?>

  <?= $page->text()->toBlocks() ?>
</article>

<?php snippet('components/Footer') ?>
