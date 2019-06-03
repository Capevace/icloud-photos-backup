<h1 align="center">iCloud Photos Backup</h1>

<h6 align="center">A command-line utility and JS library to parse and backup your iCloud Photos collection with a way to browse it.</h6>

<p align="center">
[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]
</p>

## Features

-   Export your iCloud Photos library to disk
-   Export Albums, Folders, Moments, Faces, etc.
-   Create a static web app to browse through the pictures and albums
-   Use it as a CLI or library, which makes it easy to automate backups
-   Database is accessed read-only, it will never corrupt the file

## Motivation

When I recently rebuilt my in-house NAS, I realized that I wanted a way to backup my iCloud Photos library to remove a forever-lasting dependency on Apple. While there are some tools on the market that let you extract photos from your library, these are mostly only useable manually, don't have all the features I wanted, only export the pictures and videos from you library without any organizing and cost a lot of money. This library solves most of these issues, while being free and open-source!

## Installation

### As a CLI

```sh
npm install -g icloud-photos-browser
```

### As a library

```sh
npm install --save icloud-photos-browser
```

## Usage

This software can either be used as a CLI or as a normal Node library.

_For more examples and usage, please refer to the [Docs][docs]._

### Using the CLI

For now, the CLI only supports the `build` command. This command will export your photos to the output folder and also generate a simple web app that let's you browse through the albums and pictures.

#### `build` command

```sh
$ icloud-photos-backup build /path/to/Photos\ Library.photosLibrary -o /path/to/output
```

Options:
-	`--output, -o` Set the output folder (default: "output")
-	`--progress, -p` Show a progress bar (default: true)
-	`--thumbnails, -t` Generate thumbnails (default: false)

### Using the library

```js
const { PhotosLibrary } = require('icloud-photos-backup');

const library = new PhotosLibrary('/path/to/library.photosLibrary');

// Get all the Folder objects in the database, see the docs for more information on how to use them
const folders = await library.getFolders(argv.album);
```

## Release History

-   0.0.1
    -   Added basic functionality

## Roadmap

-   Add support for more types of collections like Faces, Moments etc.

## Authors

Lukas Mateffy – [@Capevace](https://twitter.com/capevace) – [mateffy.me](https://mateffy.me)

Distributed under the MIT license. See `LICENSE` for more information.

## Contributing

1. Fork it (<https://github.com/capevace/icloud-photos-browser/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

[npm-image]: https://img.shields.io/npm/v/icloud-photos-browser.svg?style=flat-square
[npm-url]: https://npmjs.org/package/icloud-photos-browser
[npm-downloads]: https://img.shields.io/npm/dm/icloud-photos-browser.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
[docs]: https://capevace.github.io/icloud-photos-backup
