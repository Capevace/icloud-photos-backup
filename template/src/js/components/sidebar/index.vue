<template>
	<aside
		class="fixed w-1/5 flex bg-gray-100 overflow-y-scroll h-screen flex-wrap content-between top-0"
	>
		<div class="w-full">
			<!-- <section class="w-full mb-2">
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
			</section> -->

			<section class="w-full">
				<h3 class="text-xs font-bold text-gray-600 pt-2 pl-2 mb-1">
					Albums
				</h3>
				<ul
					v-for="folder in topLevel.folders"
					class="w-full overflow-x-hidden"
				>
					<folder-tree :folder="folder" root></folder-tree>
				</ul>
				<ul
					class="w-full overflow-x-hidden"
				>
					<album-link 
						v-for="album in topLevel.albums"
						:album="album"
						:key="album.uuid"
						root
					></album-link>
				</ul>
			</section>
		</div>
		<!-- <section class="flex p-2">
			<router-link
					to="/settings"
					exact-active-class="bg-gray-300"
					exact
					class="text-sm text-gray-600 rounded px-1"
				>
				Settings
			</router-link>
		</section> -->
	</aside>
</template>
<script type="text/javascript">
import FolderTree from './folder-tree';
import AlbumLink from './album-link';

export default {
	props: ['folders'],
	computed: {
		topLevel() {
			if (this.folders.length === 0) return { folders: [], albums: [] };

			// If the showHiddenFolders flag is set then we simply show ALL the folders.
			// We also want to show all the folders if only selected albums were exported. We can detect
			// if this is the case, if the first folder isnt the "LibraryFolder".
			if (this.$store.state.showHiddenFolders || this.folders[0].uuid !== 'LibraryFolder') {
				return {
					folders: this.folders,
					albums: []
				};
			}

			const topLevelAlbumsFolder = this.folders[0]
				.folders
				.filter(folder => folder.uuid === 'TopLevelAlbums')[0];

			return {
				folders: topLevelAlbumsFolder
					? topLevelAlbumsFolder.folders 
					: [],
				albums: topLevelAlbumsFolder
					? topLevelAlbumsFolder.albums 
					: []
			}
		}
	},
	components: {
		FolderTree,
		AlbumLink
	}
};
</script>
