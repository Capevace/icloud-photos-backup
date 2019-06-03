<template>
	<div class="flex min-h-screen">
		<template v-if="!$store.state.folders">
			<loading-spinner class="self-center"></loading-spinner>
		</template>
		<template v-else>
			<sidebar :folders="$store.state.folders"></sidebar>

			<router-view class="ml-1/5 w-full" />
		</template>
	</div>
</template>
<script type="text/javascript">
import Sidebar from './sidebar';
import album from '../pages/album';

export default {
	created() {
		this.$store.dispatch('loadFolders');
	},
	components: {
		Sidebar,
		album
	}
};
</script>
