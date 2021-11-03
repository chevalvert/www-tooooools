# www-tooooools [<img src="https://github.com/chevalvert.png?size=100" align="right">](http://chevalvert.fr/)
_https://tooooools.com_

<br>

## Development

### Installation

```console
$ git clone https://github.com/chevalvert/www-tooooools
$ cd www-tooooools
$ yarn install
$ composer install
```

### Usage

```console
$ yarn start # start kirby-webpack devserver
$ yarn build # build and bundle src/ into www/assets/
$ composer update getkirby/cms
```

### Deployment

Deployment is done automatically via a [Github action](.github/workflows/main.yml). Simply create a new release by running:
```console
$ yarn version
```
<sup>**Important:** some directories are not under version control (`www/kirby`, `www/plugins/*`, see [`.gitignore`](.gitignore)).<br>Deployment for those directories should be done manually.</sup>

## Credits

Built with [**kirby-webpack**](https://github.com/brocessing/kirby-webpack).

## License

[MIT](https://tldrlegal.com/license/mit-license).
