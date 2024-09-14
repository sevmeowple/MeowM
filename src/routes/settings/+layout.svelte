<script lang="ts">
	export let text: string = 'Home';
</script>

<div class="layout-container">
	<div class="header-container">
		<a href="/" class="text-blue-500 hover:underline">{text}</a>
	</div>
	<div class="content-container">
		<slot />
	</div>
</div>

<style>
	.layout-container {
		display: flex;
		flex-direction: column;
		height: 100vh;
		overflow: hidden;
	}

	.header-container {
		flex-shrink: 0;
	}

	.content-container {
		flex-grow: 1;
		overflow-y: auto;
	}
</style>
