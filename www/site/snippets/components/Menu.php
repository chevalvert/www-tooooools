<?php $class = $class ?? '' ?>

<?php /* TODO: dynamic links */  ?>
<header class='menu <?= $class ?>' role='main'>
  <a href='<?= $page->isHomePage() ? '#home' : $site->url() ?>'><?php snippet('svg/nut') ?></a>
  <div class='flexgroup'>
    <a href='#TODO[design]'>références</a>
    <a href='<?= $page->isHomePage() ? '' : $site->url() ?>#contact'>contact</a>
  </div>
</header>
