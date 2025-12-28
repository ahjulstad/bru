<script lang="ts">
	import { Map, TileLayer, GeoJSON } from 'sveaflet';
	import type { FeatureCollection, Feature } from 'geojson';
	import type { Layer } from 'leaflet';
	import { onMount } from 'svelte';

	let { roadevents }: { roadevents: Promise<FeatureCollection> } = $props();

	function onEachFeature(feature: Feature, layer: Layer) {
		let popupContent = ``;
		if (feature.properties?.DESCRIPTION) {
			popupContent += feature.properties.DESCRIPTION;
		}
		layer.bindPopup(popupContent);
	}

	let images: string[] = $state([]);
	let imagelength = $state(0);
	let aFrame = $state(0);
	let bFrame = $state(1);
	let showb = $state(false);

	onMount(async () => {
		// Get list of animation map images
		const overview = await fetch('https://beta.yr-maps.met.no/api/precipitation-nowcast/').then(
			(res) => res.json()
		);
		images = overview.times.map((element: any) => element.tiles.webp);
		imagelength = images.length;
	});

	$effect(() => {
		if (imagelength === 0) return;

		const id = setInterval(() => {
			// Toggle which layer is visible - crossfade effect
			showb = !showb;

			// Update the hidden layer AFTER the transition starts
			// so the visible layer doesn't jump to a new image
			setTimeout(() => {
				if (showb) {
					aFrame = (bFrame + 1) % imagelength;
				} else {
					bFrame = (aFrame + 1) % imagelength;
				}
			}, 300);
		}, 800);

		return () => clearInterval(id);
	});
</script>

<div style="width:100%;height:80vh;">
	<Map
		options={{
			center: [59.0546216, 5.6626464],
			zoom: 9.3,
			fadeAnimation: false
		}}
	>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
		{#if imagelength > 0}
			<TileLayer
				url={images[aFrame]}
				opacity={showb ? 0 : 1}
				options={{
					className: 'radar-layer',
					maxNativeZoom: 6
				}}
			/>
			<TileLayer
				url={images[bFrame]}
				opacity={showb ? 1 : 0}
				options={{
					className: 'radar-layer',
					maxNativeZoom: 6
				}}
			/>
		{/if}
		{#await roadevents then data}
			<GeoJSON json={data} options={{ onEachFeature }} />
		{/await}
	</Map>
</div>

<style>
	:global(.radar-layer),
	:global(.radar-layer img) {
		mix-blend-mode: screen;
		transition: opacity 0.3s ease-in-out !important;
	}
</style>
