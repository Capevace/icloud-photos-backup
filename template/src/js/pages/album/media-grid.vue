<template>
	<section class="w-full p-5">
		<div id="pig" class="" ref="pig"></div>
	</section>
</template>
<script type="text/javascript">
import Pig from '../../pig';

export default {
	props: ['media'],
	watch: {
		media() {
			this.renderPig();
		},
	},
	methods: {
		renderPig() {
			this.pig = null;
			this.$refs.pig.innerHTML = '';

			this.pig = new Pig(this.media, {
				onImageClick: (e, image) => {
					this.$emit('media-click', image);
				},
				urlForSize: (imagePath, size) => '/data/thumbnails/' + imagePath
			}).enable();
		}
	},
	mounted() {
		this.renderPig();
	},
	beforeDestroy() {
		this.pig = null;
		this.$refs.pig.innerHTML = '';
	}
};
</script>
