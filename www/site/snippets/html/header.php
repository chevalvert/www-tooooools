<!DOCTYPE html>
<html lang='<?= $kirby->language() ?>' data-template='<?= $page->template()->name() ?>'>
<head>
  <?php
    $title = $page->isHomePage()
      ? $site->title()->html()
      : $page->title()->html() . ' — ' . $site->title()->html();
    $theme = $page->color()->isNotEmpty() ? $page->color()->toHex() : 'var(--lightgray)';
  ?>

  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width,initial-scale=1.0'>
  <meta http-equiv='cleartype' content='on'>
  <meta name='theme-color' content='<?= $theme ?>'>

  <title><?= $title ?></title>
  <meta name='description' content='<?= $site->description()->text() ?>'>
  <meta name='keywords' content='<?= preg_replace('/,\s/', ',', $site->keywords()->text()) ?>'>

  <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png">
  <link rel="manifest" href="/assets/site.webmanifest">
  <link rel="mask-icon" href="/assets/favicons/safari-pinned-tab.svg" color="#000000">
  <meta name="msapplication-TileColor" content="<?= $theme ?>">
  <meta name="theme-color" content="<?= $theme ?>">

  <meta property='og:url' content='<?= $site->url() ?>'>
  <meta property='og:type' content='website'>
  <meta property='og:title' content='<?= $title ?>'>
  <meta property='og:description' content='<?= $site->description()->text() ?>'>
  <meta property='og:site_name' content='<?= $site->title() ?>'>
  <meta property='og:locale' content='<?= $kirby->language() ?>'>

  <meta name='twitter:card' content='summary'>
  <meta name='twitter:url' content='<?= $site->url() ?>'>
  <meta name='twitter:title' content='<?= $title ?>'>
  <meta name='twitter:description' content='<?= $site->description()->text() ?>'>

  <?php snippet('html/header.cover') ?>

  <?php foreach($kirby->languages() as $language) : ?>
    <?php if ($language === $kirby->language()) continue ?>
    <link rel='alternate' hreflang='<?= $language->code() ?>' href='<?= $page->url($language->code()) ?>' />
  <?php endforeach ?>

  <?php echo liveCSS('assets/builds/bundle.css') ?>

  <style type='text/css'>
    :root {
      --theme: <?= $theme ?>;
    }
  </style>

  <script>document.getElementsByTagName('html')[0].className = 'js'</script>
  <script type='text/javascript'>
    window.ENV = {
      production:
        !!~window.location.hash.indexOf('#production') ||
        (<?= json_encode(!isWebpack()) ?> && !~window.location.hash.indexOf('#dev'))
    }
  </script>
</head>
<body id='top'>
