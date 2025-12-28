<script lang="ts">
	import { browser } from '$app/environment';
	import { fetchRoadEvents } from '$lib/service/roadevents.js';

	const roadevents = fetchRoadEvents();
	const MapView = browser ? import('./MapView.svelte') : null;

	let { data } = $props();
</script>

{#if MapView}
	{#await MapView then { default: Map }}
		<Map {roadevents} />
	{/await}
{/if}
