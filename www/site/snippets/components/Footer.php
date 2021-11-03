<?php /* TODO: dynamic links */  ?>
<footer role='main'>
  <a href='https://chevalvert.fr' target='_blank'>chevalvert.fr</a>
  <div class='flexgroup'>
    <?php foreach($kirby->languages() as $language) : ?>
      <?php if ($language === $kirby->language()) continue ?>
      <a href='<?= $language->url() ?>' hreflang='<?= $language->code() ?>'>
        <?= Str::lower($language->name()) ?>
      </a>
    <?php endforeach ?>
    <a href='#' target='_blank'>mentions légales</a>
  </div>
</nav>
</footer>
