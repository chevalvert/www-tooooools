<?php $page = page('projects') ?>

<ul class='projects' id='jsProjects'>
  <?php foreach ($page->children()->listed() as $child) : ?>
    <li class='project'>
      <div class='project__content'>
        <a href='<?= $child->url() ?>'>
          <?php // TODO: focuscrop to 70x100 ?>
          <?php snippet('html/image', ['image' => $child->cover()->toFile()]) ?>
        </a>
        <div class='project__abstract'>
          <nav>
            <button data-action='prev'>←</button>
            <button data-action='next'>→</button>
          </nav>

          <h3><a href='<?= $child->url() ?>'><?= $child->title()->widont() ?></a></h3>

          <?php // TODO: dynamic content ?>
          <header>
            <div>2019</div>
            <div>identité visuelle générative</div>
            <div>impression et communication réseaux sociaux</div>
            <div>site internet</div>
          </header>

          <div>
            <p>La Fédération Française du Paysage est l'organisation qui représente la profession de paysagiste concepteur. Elle regroupe aujourd'hui plus de 3650 membres, soit un professionnel sur trois.</p>
            <p>Toools™ développe un outil sur-mesure pour cette identité générative axée sur la construction de paysages.</p>
          </div>
          <footer>
            <a href='<?= $child->url() ?>'>Lire l’étude de cas</a>
          </footer>
        </div>
      </div>
    </li>
  <?php endforeach ?>
</ul>
