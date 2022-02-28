<?php
  $content = [];
  foreach ($site->homePage()->marquee()->toStructure() as $item) {
    $content[] = $item->text();
  }

  snippet('components/Marquee', [
    'tag' => 'h2',
    'length' => 4,
    'content' => $content
  ]);
?>
