<script lang="ts">
	import { Store } from '@tauri-apps/plugin-store';
	const store = new Store('settings');
	function set() {
		store.set('theme', 'dark');
	}
	function get() {
		store.get('theme').then((value) => {
			console.log(value);
		});
	}
	function save() {
		store.save();
	}
</script>

<main class="container h-full mx-auto flex justify-center items-center">
	<h1>Settings</h1>
	<h2>
		<a href="/">home</a>
	</h2>
	<div class="div">
		<button on:click={set}>set</button>
		<button on:click={get}>get</button>
		<button on:click={save}>save</button>
	</div>
</main>

<style lang="postcss">
	.div{
		display: grid;
		
		
	}
	a {
	}
	a:hover {
		text-decoration: underline;
	}
</style>
