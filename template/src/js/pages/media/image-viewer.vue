<template>
	<figure
		class="absolute inset-0 mt-10 overflow-hidden flex justify-center"
		ref="container"
	>
		<img v-if="media.type === 2" :src="imageSrc" :style="imageStyle" />
		<video v-else :src="imageSrc" autoplay controls></video>
	</figure>
</template>
<script type="text/javascript">
export default {
	props: ['media'],
	data: () => ({
		width: 0,
		height: 0,
		topOverflowAdjustment: 0,
		centerCorrection: 0
	}),
	watch: {
		media: 'calculateLayout'
	},
	computed: {
		imageSrc() {
			return `/data/media/${this.media.imagePath}`;
		},
		rotation() {
			switch (this.media.orientation) {
				case 6:
					return 90;
				case 3:
					return 180;
				case 8:
					return -90;
				default:
					return 0;
			}
		},
		imageStyle() {
			return {
				width: this.width + 'px',
				height: this.height + 'px',
				transform: `rotate(${this.rotation}deg)`,
				marginTop: (this.topOverflowAdjustment + this.centerCorrection) + 'px'
			};
		}
	},
	methods: {
		calculateLayout() {
			const containerWidth = this.$refs.container.clientWidth;
			const containerHeight = this.$refs.container.clientHeight;
			const containerAspect = containerWidth / containerHeight;

			console.log(containerAspect, this.media.aspectRatio)
			// height max
			if (containerAspect > this.media.aspectRatio) {
				this.height = containerHeight;
				this.width = containerHeight * this.media.aspectRatio;

				this.centerCorrection = 0;
			} else if (containerAspect < this.media.aspectRatio) {
				this.width = containerWidth;
				this.height = containerWidth/this.media.aspectRatio;

				this.centerCorrection = (containerHeight - this.height) / 2;
			}

			// Flip width and height if the orientation is either 90deg to left or right
			// We then add the topOverflowAdjustment to it because otherwise the image would be partly
			// behind the top nav bar.
			// This is because the rotation is done from the center point, however, the width is probably
			// wider than the height so it'll intersect with the nav bar.
			// Adding the topOverflow adjustment moves it down just enough so its under the bar.
			if (this.media.orientation === 6 || this.media.orientation === 8) {
				const width = this.width;
				this.width = this.height;
				this.height = width;

				const distanceToTop = this.height/2;
				this.topOverflowAdjustment = Math.abs((this.width/2) - distanceToTop);
			} else {
				this.topOverflowAdjustment = 0;
			}
		}
	},
	mounted() {
		this.calculateLayout();
	}
};
</script>
