<?php
  $cover = $page->cover()->exists() && $page->cover()->isNotEmpty()
    ? $page->cover()->toFile()
    : $site->cover()->toFile();
?>

<?php if ($facebookCover = $cover->focusCrop(1200, 630)) : ?>
  <meta property='og:image' content='<?= $facebookCover->url() ?>' >
  <meta property='og:image:width' content='<?= $facebookCover->width() ?>'>
  <meta property='og:image:height' content='<?= $facebookCover->height() ?>'>
<?php endif ?>

<?php if ($twitterCover = $cover->focusCrop(280, 150)) : ?>
  <meta property='twitter:image' content='<?= $twitterCover->height() ?>'>
<?php endif ?>
