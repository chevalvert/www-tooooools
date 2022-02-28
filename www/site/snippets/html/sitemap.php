<?= '<?xml version="1.0" encoding="UTF-8"?>' ?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
  <?php $kirby = kirby() ?>
  <?php foreach ($pages as $page): ?>
    <?php if (in_array($page->uri(), $ignore)) continue ?>
    <url>
      <loc><?= html($page->url()) ?></loc>
      <lastmod><?= $page->modified('c', 'date') ?></lastmod>
      <priority><?= number_format($page->isHomePage() ? 1 : 0.5 / $page->depth(), 1) ?></priority>
      <?php foreach ($kirby->languages() as $language) : ?>
        <xhtml:link
          rel="alternate"
          hreflang="<?= $language->code() ?>"
          href="<?= $page->urlForLanguage($language->code()) ?>"
        />
      <?php endforeach ?>
    </url>
  <?php endforeach ?>
</urlset>
