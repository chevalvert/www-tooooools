<?php snippet('html/header') ?>
<?php snippet('components/Menu', ['class' => 'article-safe']) ?>

<main>
  <?php
    snippet('components/View', [
      'view' => 'home',
      'class' => 'compact',
      'content' => [
        Html::tag('h1', [snippet('svg/logo', [], true)])
      ]
    ]);

    snippet('components/View', [
      'class' => 'has-separator',
      'content' => [
        snippet('components/Article', [
          'content' => [
            Html::tag('h2', [$page->title()->widont()]),
            $page->text()->toBlocks()
          ]
        ], true)
      ],
    ]);

    snippet('components/View', ['view' => 'footer', 'class' => 'has-separator']);
  ?>
</main>

<?php snippet('components/Photoswipe') ?>
<?php snippet('html/footer') ?>
