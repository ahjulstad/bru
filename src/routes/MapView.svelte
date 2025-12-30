<script lang="ts">
	import { Map, TileLayer, GeoJSON } from 'sveaflet';
	import type { FeatureCollection, Feature } from 'geojson';
	import type { Layer } from 'leaflet';
	import RainOverlay from './RainOverlay.svelte';
	import VehicleOverlay from './VehicleOverlay.svelte';

	let { roadevents }: { roadevents: Promise<FeatureCollection> } = $props();

	let timestamp = $state('');

	function onEachFeature(feature: Feature, layer: Layer) {
		let popupContent = ``;
		if (feature.properties?.DESCRIPTION) {
			popupContent += feature.properties.DESCRIPTION;
		}
		layer.bindPopup(popupContent);
	}
</script>

<div>
	<div class="h-[80vh] w-full bg-gray-200">
		<Map
			options={{
				center: [59.0546216, 5.6626464],
				zoom: 10.9,
				fadeAnimation: false
			}}
		>
			<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
			<VehicleOverlay />
			<RainOverlay bind:timestamp />
			{#await roadevents then data}
				<GeoJSON json={data} options={{ onEachFeature }} />
			{/await}
		</Map>
	</div>
	<div class="absolute bottom-5 left-4 z-800">{timestamp}</div>
</div>
