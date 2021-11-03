<?php snippet('html/header') ?>
<?php snippet('components/Menu', ['class' => 'safe']) ?>

<main>
  <?php
    $cover = $page->cover()->toFile();
    $coverUrl = $cover->url();
    $coverFocusX = $cover->focusPercentageX();
    $coverFocusY = $cover->focusPercentageY();

    snippet('components/View', [
      'view' => 'home',
      'content' => [
        Html::tag('h1', [snippet('svg/logo', [], true)]),
        Html::tag('h2', [$page->title()->widont()]),
        Html::a('#project', '↓', ['id' => 'go-down'])
      ],
      'class' => 'monochrome',
      // TODO: resize image, use srcset etc ?
      'style' => "
        --color: white;
        background-color: black;
        background-image: url($coverUrl);
        background-position: $coverFocusX% $coverFocusY%;
      "
    ]);
    snippet('components/View', ['view' => 'project']);
  ?>
</main>

<?php snippet('components/Photoswipe') ?>
<?php snippet('html/footer') ?>
