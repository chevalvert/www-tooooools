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
          Html::tag('h2', [preg_replace('/<br\/?>/', '<span class="desktop-br"></span>', $fragment->title()->widont())]),
          $fragment->text()->widont()
        ])
      ];

      snippet('components/View', [
        'view' => 'intro',
        'class' => $index === 0 ? 'has-separator' : '',
        'content' => ($index % 2 === 0) ? array_reverse($content) : $content
      ]);
    }

    snippet('components/View', ['view' => 'playground', 'class' => 'transparent']);
    snippet('components/View', ['view' => 'keywords']);
    snippet('components/View', [
      'view' => 'projects',
      'class' => 'transparent',
      'title' => $page->projects_title()->widont()
    ]);
    snippet('components/View', ['view' => 'contact', 'class' => 'transparent has-separator']);
    snippet('components/View', ['view' => 'footer', 'class' => 'transparent has-separator']);
  ?>
</main>

<?= js('assets/builds/common.js') ?>
<?= js('assets/builds/home.js') ?>
<?php snippet('html/footer') ?>
