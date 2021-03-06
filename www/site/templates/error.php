<?php snippet('html/header') ?>
<?php snippet('components/Menu') ?>

<main>
  <?php
    snippet('components/View', [
      'view' => 'home',
      'content' => [
        Html::tag('h1', [snippet('svg/logo', [], true)]),
        Html::tag('h2', $page->text())
      ]
    ]);
  ?>
</main>

<?php snippet('html/footer') ?>
