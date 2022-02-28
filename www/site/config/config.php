<?php

return array_merge(require_once 'credentials.php', [
 'languages' => true,
 'sitemap.ignore' => ['projects'],

  'panel' => [
    'css' => 'assets/css/panel.css',
    'language' => 'fr'
  ],

  'cache' => [
    'pages' => [
      'active' => true
    ]
  ],

  'thumbs' => [
    'presets' => [
      'default' => ['width' => 1920, 'quality' => 100]
    ],
    'srcset' => [
      '1920w' => 'default',
      '1600w' => ['width' => 1600, 'quality' => 100],
      '1366w' => ['width' => 1366, 'quality' => 90],
      '1024w' => ['width' => 1024, 'quality' => 90],
      '768w' => ['width' => 768, 'quality' => 80],
      '640w' => ['width' => 640, 'quality' => 80],
    ]
  ],

  'routes' => [
    [ // Sitemap
      'pattern' => ['sitemap', 'sitemap.xml', 'sitemap_index.xml'],
      'action'  => function() {
        $pages = site()->pages()->index();
        $ignore = kirby()->option('sitemap.ignore', ['error']);
        $content = snippet('html/sitemap', compact('pages', 'ignore'), true);
        return new Kirby\Cms\Response($content, 'application/xml');
      }
    ],

    [ // Keep preferred language in cookies
      'pattern' => '(fr|en)',
      'action' => function ($lang) {
        Cookie::forever('lang', $lang);
        return $this->next();
      }
    ],

    [ // Autodetect language only when no lang cookie
      'pattern' => '(:all)',
      'action' => function ($url) {
        // Do nothing if lang is explicitly set in url
        if (preg_match('/^(en|fr)/', $url)) return $this->next();

        $lang = Cookie::get('lang') ?? kirby()->detectedLanguage()->code();
        return go("$lang/$url");
      }
    ],

    [ // Quick access to the panel from any page by suffixing url with /panel
      'pattern' => ['(fr|en)/panel', '(fr|en)/(:all)/panel'],
      'action' => function ($lang, $uid = '') {
        return ($page = page($uid))
          ? go($page->panelUrl())
          : go(site()->panelUrl() . "?language=$lang");
      }
    ],

    [ // Redirect projects to home#projects
      'pattern' => '(fr|en)/projects',
      'action' => function ($lang) {
        go("$lang/#projects");
      }
    ]
  ]
]);
