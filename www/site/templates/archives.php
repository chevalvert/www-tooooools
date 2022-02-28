<?php snippet('html/header') ?>
<?php snippet('components/Menu', ['class' => 'article-safe']) ?>

<main>
  <?php
    snippet('components/View', ['view' => 'archives']);
    snippet('components/View', ['view' => 'projects', 'class' => 'has-separator']);
    snippet('components/View', ['view' => 'footer', 'class' => 'has-separator']);
  ?>
</main>

<?php snippet('components/Photoswipe') ?>
<?php snippet('html/footer') ?>
