<ul class='gallery'>
  <?php foreach ($block->images()->toFiles() as $image) : ?>
    <li><?php snippet('html/image', compact('image')) ?></li>
  <?php endforeach ?>
</ul>
