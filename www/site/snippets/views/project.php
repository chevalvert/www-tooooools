<?php
  $hasTranslation = $kirby->language()->isDefault() || $page->isTranslated()->bool();

  $keywords = $page->keywords()->split();
  array_unshift($keywords, $page->year());

  snippet('components/Marquee', [
    'length' => 4,
    'content' => $keywords
  ]);

  snippet('components/Article', [
    'content' => [
      $hasTranslation ? null : '<p><em>' . t('no-translation') . '</em></p>',
      $page->article_title()->isNotEmpty()
        ? Html::tag('h3', [$page->article_title()->widont()])
        : null,

      $page->text()->toBlocks()
    ]
  ])
?>
