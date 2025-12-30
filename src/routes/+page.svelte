<script lang="ts">
	import { browser } from '$app/environment';
	import { fetchRoadEvents } from '$lib/service/roadevents';
	import { fetchBusStopData } from '$lib/service/bus';

	const roadevents = fetchRoadEvents();
	const busstopdata = fetchBusStopData();
	const MapView = browser ? import('./MapView.svelte') : null;

	let { data } = $props();
</script>

<div class="relative w-full overflow-hidden">
	{#if MapView}
		{#await MapView}
			<div class="h-[80vh] w-full">Laster kart...</div>
		{:then { default: Map }}
			<Map {roadevents} />
		{/await}
	{/if}

	{#await busstopdata then busdata}
		<div
			class="absolute top-3/4 left-4 z-1000 max-w-xs -translate-y-1/2 rounded-lg bg-white p-1 shadow-lg"
		>
			<a href="https://reise.kolumbus.no/no/departures?fromId=NSR:StopPlace:26770">
				<div class="text-xs">Sokn</div>
				{#each busdata.sokn as departure}
					<div class="text-sm">
						{departure}
					</div>
				{/each}
			</a>
			{#if busdata.brukai && busdata.brukai.length > 0}
				<a href="https://reise.kolumbus.no/no/departures?fromId=NSR:StopPlace:28637">
					<hr class="my-2" />
					<div class="text-xs">Bru kai</div>
					{#each busdata.brukai as departure}
						<div class="text-sm">
							{departure}
						</div>
					{/each}
				</a>
			{/if}
		</div>
		<div class="absolute top-4 left-1/3 z-1000 rounded-lg bg-white p-1">
			{#if busdata.mortavika && busdata.mortavika.length > 0}
				<a
					href="https://www.fjord1.no/ruteoversikt/Rogaland/mortavika-arsvaagen?from=001311421668&to=001311453652"
				>
					<div class="text-xs">Mortavika</div>
					{#each busdata.mortavika || [] as departure}
						<div class="text-sm">
							{departure}
						</div>
					{/each}
				</a>
			{/if}
		</div>
		<!-- <pre>{JSON.stringify(busdata, null, 2)}</pre> -->
	{/await}
</div>

<div class="relative text-sm">
	<p>
		Kartdata fra <a href="https://www.openstreetmap.org/#map=4/65.40/17.86" class="text-blue-600"
			>OpenStreetMap</a
		>. Nedbørsradar fra <a href="https://beta.yr-maps.met.no/" class="text-blue-600">Yr</a>.
		Vegmeldinger fra
		<a
			href="https://www.vegvesen.no/fag/teknologi/apne-data/et-utvalg-apne-data/ogc-karttjenester/kartlag/"
			class="text-blue-600">Statens vegvesen</a
		>. Bussruter fra
		<a href="https://developer.entur.org/" class="text-blue-600">Entur</a>. Sausa sammen av
		<a href="https://bsky.app/profile/ahj77.bsky.social" class="text-blue-600">Åsmund</a>.
	</p>
</div>
