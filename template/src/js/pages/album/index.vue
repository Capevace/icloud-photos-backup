<template>
	<main class="w-full min-h-screen flex">
		<template v-if="loading">
			<loading-spinner class="self-center"></loading-spinner>
		</template>
		<template v-else>
			<media-grid :media="allMedia" @media-click="onMediaClick"></media-grid>
		</template>
	</main>
</template>
<script type="text/javascript">
import MediaGrid from './media-grid';

export default {
	data: () => ({
		loading: true
	}),
	created() {
		this.fetchAlbum();
	},
	computed: {
		id() {
			return atob(this.$route.params.id);
		},
		allMedia() {
			return this.$store.state.albumMedia[this.id];
		}
	},
	watch: {
		'$route': 'fetchAlbum'
	},
	methods: {
		async fetchAlbum() {
			if (this.id in this.$store.state.albumMedia) {
				this.loading = false;
				return;
			}

			this.loading = true;
			await this.$store.dispatch('loadAlbum', this.id);
			this.loading = false;
		},
		onMediaClick(image) {
			this.$router.push({
				name: 'album-media',
				params: { id: this.$route.params.id, index: image.index }
			});
		}
	},
	components: {
		MediaGrid
	}
};
</script>
