<script lang="ts">
	import { browser } from '$app/environment';
	import { fetchRoadEvents } from '$lib/service/roadevents';
	import { fetchBusStopData } from '$lib/service/bus';

	const roadevents = fetchRoadEvents();
	const busstopdata = fetchBusStopData();
	const MapView = browser ? import('./MapView.svelte') : null;

	let { data } = $props();
</script>

<div class="relative h-96 w-full">
	{#if MapView}
		{#await MapView then { default: Map }}
			<Map {roadevents} />
		{/await}
	{/if}

	{#await busstopdata then busdata}
		<div
			class="absolute top-3/4 left-4 z-1000 max-w-xs -translate-y-1/2 rounded-lg bg-white p-4 shadow-lg"
		>
			<div class="text-xs">Sokn</div>
			{#each busdata.sokn || [] as departure}
				<div class="text-sm">
					{departure}
				</div>
			{/each}
			{#if busdata.brukai && busdata.brukai.length > 0}
				<hr class="my-2" />
				<div class="text-xs">Bru kai</div>
				{#each busdata.brukai || [] as departure}
					<div class="text-sm">
						{departure}
					</div>
				{/each}
			{/if}
		</div>
		<div class="absolute top-4 left-1/3 z-1000 rounded-lg bg-white p-2">
			{#if busdata.mortavika && busdata.mortavika.length > 0}
				<div class="text-xs">Mortavika</div>
				{#each busdata.mortavika || [] as departure}
					<div class="text-sm">
						{departure}
					</div>
				{/each}
			{/if}
		</div>
		<!-- <pre>{JSON.stringify(busdata, null, 2)}</pre> -->
	{/await}
</div>
