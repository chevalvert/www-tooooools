<?php snippet('html/header') ?>
<?php snippet('components/Menu', ['class' => 'always-shown']) ?>

<main>
  <?php
    snippet('components/View', [
      'view' => 'home',
      'content' => [
        Html::tag('h1', [snippet('svg/logo', [], true)]),
        Html::tag('h2', $site->subtitle()),
        Html::a('#intro', '↓', ['id' => 'go-down'])
      ]
    ]);

    foreach ($site->introduction_items()->toStructure() as $fragment) {
      snippet('components/View', [
        'view' => 'intro',
        'style' => '--primary: ' . $fragment->color()->toHex(),
        'content' => [
          Html::tag('div', [$fragment->text()->widont()]),
          // TODO: dynamic svg
          snippet('svg/illustration-arrow', [], true)
        ]
      ]);
    }

    // TODO[next]
    snippet('components/View', ['view' => 'playground']);

    snippet('components/View', ['view' => 'projects']);
    snippet('components/View', ['view' => 'contact']);

    snippet('components/View', [
      'view' => 'outro',
      'content' => snippet('components/Footer', [], true)
    ])
  ?>
</main>

<?php snippet('html/footer') ?>
