<?php $class = $class ?? '' ?>

<header class='menu <?= $class ?>' role='main'>
  <a href='<?= $page->isHomePage() ? '#top' : $site->url() ?>'><?php snippet('svg/nut', ['title' => $site->title()]) ?></a>
  <div class='flexgroup'>
    <a href='<?= $page->isHomePage() ? '' : $site->url() ?>#contact'>contact</a>
  </div>
</header>
