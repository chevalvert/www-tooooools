<?php $class = $class ?? '' ?>

<header class='menu <?= $class ?>' role='main'>
  <a href='<?= $page->isHomePage() ? '#home' : $site->url() ?>'><?php snippet('svg/nut') ?></a>
  <div class='flexgroup'>
    <?php if ($archives = page('archives')) : ?>
      <a href='<?= $archives->url() ?>'><?= $archives->title() ?></a>
    <?php endif ?>
    <a href='<?= $page->isHomePage() ? '' : $site->url() ?>#contact'>contact</a>
  </div>
</header>
