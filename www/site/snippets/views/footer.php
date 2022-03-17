<footer role='main'>
  <div class='flexgroup'>
    <a href='https://chevalvert.fr' target='_blank'>chevalvert.fr</a>
  </div>

  <div class='flexgroup'>
    <?php foreach($kirby->languages() as $language) : ?>
      <?php if ($language === $kirby->language()) continue ?>
      <a href='<?= $page->url($language->code()) ?>' hreflang='<?= $language->code() ?>'>
        <?= Str::lower($language->name()) ?>
      </a>
    <?php endforeach ?>

    <?php if ($legals = page('legals')) : ?>
      <a href='<?= $legals->url() ?>'><?= $legals->title() ?></a>
    <?php endif ?>

    <a href='#top' id='go-up'>&uarr;</a>
  </div>
</nav>
</footer>
