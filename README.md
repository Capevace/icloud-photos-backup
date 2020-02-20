<div align="center">
	<a href="https://mateffy.me/icloud-photos-backup">
		<img src="icloud.png" width="200px">
	</a>
	<h1>iCloud Photos Backup</h1>
	<p>
		<b>A command-line utility and Node library to parse and backup your Apple Photos collection with a way to browse it.</b>
	</p>
	<br>
	<br>
	<br>
</div>

[![NPM Version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Downloads Stats][npm-downloads]][npm-url]

## Features
-   Export your Apple Photos library to disk
-	Works with and without using iCloud
-   Export Albums, Folders, Moments, Faces, etc.
-   Create a static web app to browse through the pictures and albums
-   Use it as a CLI or library, which makes it easy to automate backups
-   Database is accessed read-only, it will never corrupt the file

## Motivation
When I recently rebuilt my in-house NAS, I realized that I wanted a way to backup my iCloud Photos library to remove a forever-lasting dependency on Apple. While there are some tools on the market that let you extract photos from your library, these are mostly only useable manually, don't have all the features I wanted, only export the pictures and videos from your library without any organizing and cost a lot of money. This library solves most of these issues, while being free and open-source!

## Backing up iCloud Photos libraries
By default, iCloud Photos libraries (`.photoslibrary`) are stored in the `~/Pictures` directory.

There's usually two ways to backup your library to a NAS:
1. Setting the directory that your `.photoslibrary` file should be stored in to somewhere on your NAS (via Photos.app's settings and a file share)
2. Copying the pictures out of your `.photoslibrary` file and onto your NAS

Both approaches have pros and cons.

Storing your `.photoslibrary` file directly on the NAS has the advantage that there's not much you'll need to do. You can make backups of that file via NAS software to always have a working copy of your library. However, having all your media stored in a `.photoslibrary` file makes them hard to access on Windows or Linux devices. Additionally, since more latency is intoduced into loading the pictures and videos, Photos.app's processing tasks (analysing faces, places etc.) will take way longer than if the main library file were to reside on your computer.

Copying all your pictures and videos out of your `.photoslibrary` makes them available to you in an easy to use and standardized way (via filesystem). But copying out all your media out of your library can be a tedious task, if you want to keep folder and album structures. Also, all the analyzed data (faces, places etc.) is gone and not usable with this approach, as you're only saving the raw data.

This tool takes both approaches and sort of merges them together! If you want, you can still store your `.photoslibrary` file on your NAS. The library only needs its path to work. That means you can simply keep using Photos.app like you used to.
Instead, the tool will go through your photos library and parse out all your folders, albums and other metadata such as faces and places to then generate a small _static_ web app in which you can view your pictures. You can choose to also have either the default Photos.app file structure (e.g. `/2019/08/21/2019-08-21-XXXXX/IMGXXXX.jpg`) or a more filesystem explorer friendly one by strucuring them in folders named after your albums and folders (e.g. `/Summer 2019/Trip to Sweden/IMGXXXX.jpg`).

If you don't actively use iCloud this library also enables you to share certain albums on the web! You can choose which albums to include in the generated web app, enabling you to share the app with your friends and family. I'm planning on making this a lot easier in the future too but I want to build the basics first. :)

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

### Beware: your Photos.app may be set to optimize storage if you're using iCloud
In order to be able to save disk space, Photos.app has a mode in which you can 'optimize storage' by not having every picture saved on
your device. __This may lead to pictures and videos missing in your generated backup!__

You'll need to go to the Photos.app's iCloud settings (Top left: _Photos > Settings > iCloud_), and set

### Using the CLI

For now, the CLI only supports the `build` command. This command will export your photos to the output folder and also generate a simple web app that let's you browse through the albums and pictures.

#### `build` command

```sh
$ icloud-photos-backup build /path/to/Photos\ Library.photosLibrary -o /path/to/output
```

Options:
-	`--output, -o` Set the output folder (default: "output")
-	`--progress, -p` Show a progress bar (default: true)
-	`--noThumbnails` Skip generating thumbnails (default: false)
-	`--album, -a` Specify an album to export (default: all albums and folders)

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
- 	Add support for a "all pictures" view
-	Add support for exporting detailed metadata, like picture's cached location names
- 	Generate thumbnails for videos

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
