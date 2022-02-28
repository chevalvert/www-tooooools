<?php snippet('html/header') ?>
<?php snippet('components/Menu') ?>

<main>
  <?php
    snippet('components/View', [
      'view' => 'home',
      'content' => [
        Html::tag('h1', [snippet('svg/logo', [], true)]),
        Html::tag('h2', $page->subtitle()),
        Html::a('#intro', '↓', ['id' => 'go-down'])
      ]
    ]);

    foreach ($page->introduction()->toStructure() as $index => $fragment) {
      $content = [
        // TODO: $fragment->illustration
        Html::tag('div', null, ['class' => 'fake-svg']),
        Html::tag('div', [
          Html::tag('h2', [$fragment->title()->widont()]),
          $fragment->text()->widont()
        ])
      ];

      snippet('components/View', [
        'view' => 'intro',
        'class' => $index === 0 ? 'has-separator' : '',
        'content' => ($index % 2 === 0) ? array_reverse($content) : $content
      ]);
    }

    // TODO[next]
    snippet('components/View', ['view' => 'playground']);

    snippet('components/View', ['view' => 'keywords', 'class' => 'has-separator']);
    snippet('components/View', ['view' => 'projects', 'class' => 'has-separator']);
    snippet('components/View', ['view' => 'contact', 'class' => 'has-separator']);
    snippet('components/View', ['view' => 'footer', 'class' => 'has-separator']);
  ?>
</main>

<?php snippet('html/footer') ?>
