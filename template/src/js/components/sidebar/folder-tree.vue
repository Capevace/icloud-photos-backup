<template>
	<router-link
		tag="li"
		:key="folder.uuid"
		:to="'/folder/' + stringToBase64(folder.uuid)"
		active-class="bg-gray-300"
		exact
		class="text-sm flex flex-wrap items-center px-0.5 w-full py-0.5 cursor-default"
		:class="{ 'pl-4': root === undefined }"
	>
		<div class="flex w-full flex-no-wrap items-center">
			<figure class="w-4 p-1" @click="toggleExpanded()">
				<svg
					class="w-full text-gray-600 fill-current"
					viewBox="0 0 100 100"
				>
					<polygon v-if="expanded" points="0,0 50,100 100,0" />
					<polygon v-else="expanded" points="0,100 100,50 0,0" />
				</svg>
			</figure>

			<img
				src="assets/icon-folder.png"
				class="w-4 h-min-content ml-0.5 mr-2"
			/>
			<a class="font-medium truncate flex-grow-0">{{
				folderName(folder)
			}}</a>
		</div>

		<template v-if="expanded">
			<ul
				v-for="subfolder of folder.folders"
				class="w-full overflow-x-hidden"
			>
				<folder-tree :folder="subfolder"></folder-tree>
			</ul>
			<ul class="w-full">
				<album-link 
					v-for="album in folder.albums"
					:album="album"
					:key="album.uuid"
				></album-link>
			</ul>
		</template>
	</router-link>
</template>
<script type="text/javascript">
import AlbumLink from './album-link';

export default {
	name: 'folder-tree',
	props: ['folder', 'root'],
	data: () => ({
		expanded: false
	}),
	methods: {
		stringToBase64(text) {
			return btoa(text);
		},
		toggleExpanded() {
			this.expanded = !this.expanded;
		},
		folderName(folder) {
			if (folder.uuid === 'TopLevelAlbums') return 'My Albums';

			if (folder.uuid === 'MediaTypesSmartAlbums') return 'Media Types';

			return folder.name;
		}
	},
	components: {
		AlbumLink
	}
};
</script>
