<!DOCTYPE html>
<html lang='<?= $kirby->language() ?>' data-template='<?= $page->template()->name() ?>'>
<head>
  <meta charset='utf-8'>
  <meta name='viewport' content='width=device-width,initial-scale=1.0'>
  <meta http-equiv='cleartype' content='on'>
  <title><?= r($page !== $site->homePage(), ($title ?? $page->title()->html()) . ' | ') . $site->title()->html() ?></title>

  <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicons/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicons/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicons/favicon-16x16.png">
  <link rel="manifest" href="/assets/site.webmanifest">
  <link rel="mask-icon" href="/assets/favicons/safari-pinned-tab.svg" color="#000000">
  <meta name="msapplication-TileColor" content="#f0f0f0">
  <meta name="theme-color" content="#f0f0f0">

  <?php echo liveCSS('assets/builds/bundle.css') ?>

  <script>document.getElementsByTagName('html')[0].className = 'js'</script>
  <script type='text/javascript'>
    window.ENV = {
      production:
        !!~window.location.hash.indexOf('#production') ||
        (<?= json_encode(!isWebpack()) ?> && !~window.location.hash.indexOf('#dev'))
    }
  </script>
</head>
<body>
