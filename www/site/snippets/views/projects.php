<?php $page = page('projects') ?>

<header>
  <h2><?= $page->title()->widont() ?></h2>
  <nav>
    <button id='jsPrevProject'>←</button>
    <button id='jsNextProject'>→</button>
  </nav>
</header>

<ul class='projects' id='jsProjects'>
  <?php for ($i = 0; $i < 2; $i++) : // DEBUG ?>
    <?php foreach ($page->children()->listed() as $child) : ?>
      <li class='project'>
        <a href='<?= $child->url() ?>'>
          <?php snippet('html/image', [
            'image' => $child->cover()->toFile(),
            'caption' => Html::tag('h3', [$child->title()])
          ]) ?>
        </a>
      </li>
    <?php endforeach ?>
  <?php endfor ?>
</ul>
