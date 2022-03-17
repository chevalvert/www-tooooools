<?php
  $content = [];
  foreach ($site->homePage()->marquee()->toStructure() as $index => $item) {
    $content[] = $item->text();
    $content[] = snippet('svg/swoosh-' . ($index + 1), [], true);
  }

  snippet('components/Marquee', [
    'tag' => 'h2',
    'length' => 4,
    'content' => $content
  ]);
?>
