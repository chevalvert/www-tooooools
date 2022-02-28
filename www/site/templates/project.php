<?php snippet('html/header') ?>
<?php snippet('components/Menu', ['class' => 'home-safe article-safe']) ?>

<main>
  <?php
    $cover = $page->cover()->toFile();
    $coverUrl = $cover->url();
    $coverFocusX = $cover->focusPercentageX();
    $coverFocusY = $cover->focusPercentageY();
    $coverContrast = $page->coverContrast();

    snippet('components/View', [
      'view' => 'home',
      'content' => [
        Html::tag('h1', [snippet('svg/logo', [], true)]),
        Html::tag('h2', [$page->title()->widont()]),
        Html::a('#project-info', '↓', ['id' => 'go-down'])
      ],
      'class' => 'monochrome',
      // TODO: resize image, use srcset etc ?
      'style' => "
        --color: $coverContrast;
        background-color: black;
        background-image: url($coverUrl);
        background-position: $coverFocusX% $coverFocusY%;
      "
    ]);
    snippet('components/View', ['view' => 'project-info']); // ???
    snippet('components/View', ['view' => 'project-content', 'class' => 'has-separator']);
    snippet('components/View', ['view' => 'footer']);
  ?>
</main>

<?php snippet('components/Photoswipe') ?>
<?php snippet('html/footer') ?>
