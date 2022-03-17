<?php snippet('html/header') ?>
<?php snippet('components/Menu', ['class' => 'home-safe article-safe']) ?>

<main>
  <?php
    $cover = $page->article_cover()->toFile();
    $coverPreset = option('thumbs.presets.cover');
    $coverUrl = ($coverPreset['crop'] ?? false
      ? $cover->focusCrop($coverPreset['width'] ?? null, $coverPreset['height'] ?? null, $coverPreset)
      : $cover->thumb($coverPreset))->url();

    $coverFocusX = $cover->focusPercentageX();
    $coverFocusY = $cover->focusPercentageY();
    $coverContrast = $page->article_cover_contrast();

    snippet('components/View', [
      'view' => 'home',
      'content' => [
        Html::tag('h1', [snippet('svg/logo', [], true)]),
        Html::tag('h2', [$page->title()->widont()]),
        Html::a('#project', '↓', ['id' => 'go-down'])
      ],
      'class' => 'monochrome has-marquee',
      'style' => "
        --color: $coverContrast;
        background-color: black;
        background-image: url($coverUrl);
        background-position: $coverFocusX% $coverFocusY%;
      "
    ]);

    snippet('components/View', ['view' => 'project']);
    // ???
    // snippet('components/View', [
    //   'view' => 'projects',
    //   'class' => 'has-separator',
    //   'title' => 'Autres projets et études de cas', // TODO: dynamic
    //   'projects' => page('projects')->children()->listed()->filter(function ($project) use ($page) {
    //     return $project !== $page;
    //   })
    // ]);
    snippet('components/View', ['view' => 'contact', 'class' => 'transparent has-separator']);
    snippet('components/View', ['view' => 'footer', 'class' => 'transparent has-separator']);
  ?>
</main>

<?php snippet('components/Photoswipe') ?>
<?php snippet('html/footer') ?>
