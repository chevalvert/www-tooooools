<?php
  $projects = $projects ?? page('projects')->children()->listed();
  $title = $title ?? null;
?>

<?php if ($title) echo Html::tag('h2', [$title]) ?>

<ul class='projects'>
  <?php foreach ($projects as $project) : ?>
    <li class='project'>
      <div class='project__content'>
        <a href='<?= $project->url() ?>'>
          <?php snippet('html/image', [
            'image' => $project->abstract_cover()->toFile(),
            'preset' => 'abstract'
          ]) ?>
        </a>
        <div class='project__abstract'>
          <nav>
            <button data-action='prev' <?= $projects->indexOf($project) === 0 ? 'disabled' : '' ?>>←</button>
            <button data-action='next' <?= $projects->indexOf($project) === $projects->count() - 1 ? 'disabled' : '' ?>>→</button>

            <ul class='projects__dots'>
              <?php foreach ($projects as $p) : ?>
                <li class='projects__dot <?= $p === $project ? 'is-active' : '' ?>' data-action='jump' data-index='<?= $projects->indexOf($p) ?>'>&bull;</li>
              <?php endforeach ?>
            </ul>
          </nav>

          <h3><a href='<?= $project->url() ?>'><?= $project->title()->widont() ?></a></h3>

          <header>
            <div><?= $project->year() ?></div>
            <ul>
              <?php foreach ($project->keywords()->split() as $keyword) : ?>
                <li><?= $keyword ?></li>
              <?php endforeach ?>
            </ul>
          </header>

          <div>
            <?= $project->abstract()->widont() ?>
          </div>
          <footer>
            <a href='<?= $project->url() ?>'>Lire l’étude de cas</a>
          </footer>
        </div>
      </div>
    </li>
  <?php endforeach ?>
</ul>
