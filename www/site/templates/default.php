<?php snippet('html/header') ?>
<?php snippet('components/Menu') ?>

<main>
  <?php snippet('components/View', ['view' => $page->intendedTemplate()->name()]) ?>
</main>

<?php snippet('html/footer') ?>
