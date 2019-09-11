<template>
	<router-link
		tag="li"
		:key="album.uuid"
		:to="'/album/' + stringToBase64(album.uuid)"
		exact-active-class="bg-gray-300"
		exact
		class="text-sm flex flex-wrap items-center px-0.5 w-full py-0.5 cursor-default"
		:class="{'pl-4': root === undefined}"
	>
		<div class="flex w-full flex-no-wrap items-center">
			<figure class="w-4 p-1 flex-shrink-0"></figure>

			<img
				src="assets/icon-album.png"
				class="w-4 h-min-content ml-0.5 mr-2 flex-shrink-0"
			/>

			<a class="font-medium truncate flex-grow-0">
				{{ album.name }}
			</a>
		</div>
	</router-link>
</template>
<script type="text/javascript">
export default {
	props: ['album', 'root'],
	methods: {
		stringToBase64(text) {
			return btoa(text);
		}
	}
}
</script>