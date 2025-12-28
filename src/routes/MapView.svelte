<script lang="ts">
	import { Map, TileLayer, GeoJSON } from 'sveaflet';
	import type { FeatureCollection, Feature } from 'geojson';
	import type { Layer } from 'leaflet';

	let { roadevents }: { roadevents: Promise<FeatureCollection> } = $props();

	function onEachFeature(feature: Feature, layer: Layer) {
		let popupContent = ``;
		if (feature.properties?.DESCRIPTION) {
			popupContent += feature.properties.DESCRIPTION;
		}
		layer.bindPopup(popupContent);
	}
</script>

<div style="width:100%;height:80vh;">
	<Map
		options={{
			center: [59.0546216, 5.6626464],
			zoom: 10.5,
			fadeAnimation: false
		}}
	>
		<TileLayer url={'https://tile.openstreetmap.org/{z}/{x}/{y}.png'} />
		{#await roadevents then data}
			<GeoJSON json={data} options={{ onEachFeature }} />
		{/await}
	</Map>
</div>
