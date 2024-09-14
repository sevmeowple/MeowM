<script lang="ts">
    import '../app.postcss';
    import Header from '$lib/components/Header.svelte';

    // Floating UI for Popups
    import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
    import { storePopup } from '@skeletonlabs/skeleton';
    storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
</script>

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

<div class="layout-container">
    <div class="header-container">
        <Header />
    </div>
    <div class="content-container">
        <slot />
    </div>
</div>