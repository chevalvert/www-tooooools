<?php

return array_merge(require_once 'credentials.php', [
 'languages' => true,

  'cache' => [
    'pages' => [
      'active' => true
    ]
  ],

  'thumbs' => [
    'presets' => [
      'default' => ['width' => 1920, 'quality' => 100]
    ],
    'srcsets' => [
      'default' => [
        '1920w' => 'default',
        '1600w' => ['width' => 1600, 'quality' => 100],
        '1366w' => ['width' => 1366, 'quality' => 90],
        '1024w' => ['width' => 1024, 'quality' => 90],
        '768w' => ['width' => 768, 'quality' => 80],
        '640w' => ['width' => 640, 'quality' => 80],
      ]
    ]
  ],

  'routes' => [
    [ // Keep preferred language in cookies
      'pattern' => '(fr|en)',
      'action' => function ($lang) {
        Cookie::set('lang', $lang);
        return $this->next();
      }
    ],

    [ // Autodetect language only if no lang cookie
      'pattern' => '(:all)',
      'action' => function ($uid) {
        $site = site();
        $lang = Cookie::get('lang') ?? kirby()->detectedLanguage()->code();

        $uid = preg_replace('/^(en|fr)\/?/', '', $uid);
        $page = $uid === ''
          ? $site->homePage()
          : page($uid);
        return $site->visit($page, $lang);
      }
    ],

    [ // Quick access to the panel from any page by suffixing url with /panel
      'pattern' => '(:all)/panel',
      'action' => function ($uid) {
        if ($page = page($uid)) return go($page->panelUrl());
      }
    ],

    [ // Redirect /projects to /#projects
      'pattern' => '/projects',
      'action' => function () {
        go('/#projects');
      }
    ]
  ]
]);
