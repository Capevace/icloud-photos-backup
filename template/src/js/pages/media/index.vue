<template>
	<main class="w-full min-h-screen relative">
		<div v-if="loading" class="flex min-h-screen">
			<loading-spinner class="self-center"></loading-spinner>
		</div>
		<template v-else>
			<header
				class="h-10 px-2 bg-gray-100 w-full flex justify-between items-center text-gray-700"
			>
				<section>
					<button
						@click="back"
						class="rounded text-lg font-mono"
					>
						<
					</button>
				</section>
				<section class="flex flex-wrap">
					<p class="text-sm w-full text-center">{{ dateCreated }}</p>
					<p class="text-xs w-full text-center text-gray-600"
						>{{ imageIndex + 1 }} of {{ albumTotalCount }}</p
					>
				</section>
				<section>
					<button @click="showMediaJSON = !showMediaJSON">Debug</button>
				</section>
			</header>

			<image-viewer :media="media"></image-viewer>
			
			<pre class="absolute inset-0 mt-10" v-if="showMediaJSON">{{ JSON.stringify(media, null, 2) }}</pre>
		</template>
	</main>
</template>
<script type="text/javascript">
import ImageViewer from './image-viewer';

export default {
	data: () => ({
		loading: false,
		showMediaJSON: false
	}),
	computed: {
		albumId() {
			return atob(this.$route.params.id);
		},
		imageIndex() {
			return parseInt(this.$route.params.index);
		},
		albumTotalCount() {
			return this.albumId in this.$store.state.albumMedia
				? this.$store.state.albumMedia[this.albumId].length
				: 0;
		},
		media() {
			return this.albumId in this.$store.state.albumMedia
				? this.$store.state.albumMedia[this.albumId][this.imageIndex]
				: null;
		},
		dateCreated() {
			return new Date(this.media.created).toLocaleString();
		}
	},
	methods: {
		async fetchAlbum() {
			if (this.albumId in this.$store.state.albumMedia) {
				this.loading = false;
				return;
			}

			this.loading = true;
			await this.$store.dispatch('loadAlbum', this.albumId);
			this.loading = false;
		},
		back() {
			this.$router.push({
				name: 'album',
				params: { id: this.$route.params.id }
			});
		},
		onLeftKey() {
			if (this.imageIndex === 0)
				return;

			this.$router.push({
				name: 'album-media',
				params: { id: this.$route.params.id, index: this.imageIndex - 1 }
			});
		},
		onRightKey() {
			if (this.imageIndex === this.albumTotalCount - 1)
				return;

			this.$router.push({
				name: 'album-media',
				params: { id: this.$route.params.id, index: this.imageIndex + 1 }
			});
		},
		onKeyDown(e) {
			switch (e.keyCode) {
				case 37:
					e.preventDefault();
					this.onLeftKey();
					break;
				case 39:
					e.preventDefault();
					this.onRightKey();
					break;
			}
		}
	},
	created() {
		document.addEventListener('keydown', this.onKeyDown);

		// Check if we need to load the album
		this.fetchAlbum();
	},
	beforeDestroy() {
		document.removeEventListener('keydown', this.onKeyDown);
	},
	components: {
		ImageViewer
	}
};
</script>
