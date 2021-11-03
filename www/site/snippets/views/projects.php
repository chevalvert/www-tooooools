<?php $page = page('projects') ?>

<header>
  <h2><?= $page->title()->widont() ?></h2>
  <nav>
    <button id='jsPrevProject'>←</button>
    <button id='jsNextProject'>→</button>
  </nav>
</header>

<ul class='projects' id='jsProjects'>
  <?php for ($i = 0; $i < 10; $i++) : // DEBUG ?>
    <?php foreach ($page->children()->listed() as $child) : ?>
      <li class='project'>
        <a href='<?= $child->url() ?>'>
          <figure>
            <?php /* TODO: lazyload, thumbnail and focus (using snippets/html/image) */ ?>
            <img src='<?= $child->cover()->toFile()->url() ?>'>
            <figcaption>
              <h3 class='project__title'><?= $child->title()->widont() ?></h3>
            </figcaption>
          </figure>
        </a>
      </li>
    <?php endforeach ?>
  <?php endfor ?>
</ul>
