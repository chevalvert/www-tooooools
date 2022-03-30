<?php

Kirby::plugin('toools/kirbytags', [
  'tags' => [
    // (year:)
    'year' => [
      'html' => function () {
        return date('Y');
      }
    ],

    // (button: the text of the button signal:signalName action:actionName)
    'button' => [
      'attr' => ['signal', 'action'],
      'html' => function ($tag) {
        return Html::tag('button', $tag->value, [
          'data-signal' => $tag->signal,
          'data-action' => $tag->action,
          'aria-hidden' => 'true'
        ]);
      }
    ],

    // (checkbox:signalName)
    'checkbox' => [
      'html' => function ($tag) {
        return Html::tag('input', null, [
          'data-signal' => $tag->value,
          'type' => 'checkbox',
          'autocomplete' => 'off',
          'aria-hidden' => 'true'
        ]);
      }
    ]
  ]
]);
