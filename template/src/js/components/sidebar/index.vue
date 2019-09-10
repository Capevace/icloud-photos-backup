<template>
	<aside
		class="fixed w-1/5 flex bg-gray-100 overflow-y-scroll h-screen flex-wrap content-start top-0"
	>
		<section class="w-full mb-2">
			<h3 class="text-xs font-bold text-gray-600 pt-2 pl-2 mb-1">
				Library
			</h3>
			<ul class="w-full">
				<li
					class="text-sm flex items-center px-0.5 bg-gray-300 w-full py-0.5 cursor-default"
				>
					<figure class="w-4"></figure>
					<img
						src="assets/icon-album.png"
						class="w-4 h-min-content ml-0.5 mr-2"
					/>
					<span class="">Photos</span>
				</li>
			</ul>
		</section>

		<section class="w-full">
			<h3 class="text-xs font-bold text-gray-600 pt-2 pl-2 mb-1">
				Albums
			</h3>
			<ul
				v-for="folder in topLevelFolders"
				class="w-full overflow-x-hidden"
			>
				<folder-tree :folder="folder" root></folder-tree>
			</ul>
		</section>
	</aside>
</template>
<script type="text/javascript">
import FolderTree from './folder-tree';

export default {
	props: ['folders'],
	computed: {
		topLevelFolders() {
			if (this.$store.state.showHiddenFolders && this.folders.length > 0) {
				return this.folders[0].folders;
			}
			
			const topLevelAlbumsFolder = this.folders[0]
					.folders
					.filter(folder => folder.uuid === 'TopLevelAlbums')[0];

			return topLevelAlbumsFolder
				? topLevelAlbumsFolder.folders 
				: [];
		}
	},
	components: {
		FolderTree
	}
};
</script>
