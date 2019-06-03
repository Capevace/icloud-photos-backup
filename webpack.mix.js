const mix = require('laravel-mix');
const tailwindcss = require('tailwindcss');

mix.sass('template/src/scss/index.scss', 'template/dist')
	.options({
		processCssUrls: false,
		postCss: [tailwindcss('./tailwind.config.js')]
	})
	.copyDirectory('template/src/assets', 'template/dist/assets')
	.copy('template/src/index.html', 'template/dist/index.html')
	.js('template/src/js/index.js', 'template/dist')
	.webpackConfig({
		resolve: {
			alias: {
				// '@components': path.resolve(__dirname, 'app/js/components'),
				// '@socket': path.resolve(__dirname, 'app/js/socket'),
				// '@vue': path.resolve(__dirname, 'app/js/vue'),
				// '@pages': path.resolve(__dirname, 'app/js/pages'),
				// '@helpers': path.resolve(__dirname, 'app/js/helpers'),
				// '@config': path.resolve(__dirname, 'app/js/config')
			}
		}
	});
