import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueRouterMultiView from 'vue-router-multi-view'

import IndexPage from './pages/index';
import AlbumPage from './pages/album';
import MediaPage from './pages/media';

import MainLayout from './components/main-layout';
import Spinner from './components/spinner';

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VueRouterMultiView);

const store = new Vuex.Store({
	state: {
		folders: null,
		albums: {},
		albumMedia: {},
		showHiddenFolders: false
	},
	mutations: {
		setFolders(state, folders) {
			state.folders = folders;
		},
		setAlbum(state, album) {
			state.albums[album.uuid] = album;
		},
		setAlbumMedia(state, { id, media }) {
			state.albumMedia = {
				...state.albumMedia,
				[id]: media
			};
		}
	},
	actions: {
		async loadAlbum({ commit, state }, id) {
			const response = await fetch(
				`/data/albums/${encodeURIComponent(id)}.json`
			);
			const media = await response.json();
			commit('setAlbumMedia', { id, media });
		},

		async loadFolders({ commit }) {
			const response = await fetch('/data/folders.json');
			const folders = await response.json();
			commit('setFolders', folders);

			const processFolder = folder => {
				folder.albums.forEach(album => commit('setAlbum', album));

				folder.folders.forEach(processFolder);
			};
		}
	}
});

const router = new VueRouter({
	routes: [
		{ path: '/', component: IndexPage, name: 'index' },
		{ path: '/album/:id', component: AlbumPage, name: 'album' },
		{ path: '/album/:id/:index', component: MediaPage, name: 'album-media' }
	]
});

Vue.component('loading-spinner', Spinner);

const vue = new Vue({
	el: '#app',
	store,
	router,
	components: {
		MainLayout
	}
});
