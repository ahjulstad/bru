<script lang="ts">
	import { vehiclePositions } from '$lib/store/vehiclepositionstore';
	import type { VehiclePosition } from '$lib/store/vehiclepositionstore';
	import { Marker, DivIcon } from 'sveaflet';
</script>

{#each Array.from($vehiclePositions.entries()) as [id, v] (id)}
	<Marker latLng={[v.latitude, v.longitude]}
		><DivIcon
			class="flex h-7 w-7 items-center justify-center rounded-full border-white bg-black p-1 text-sm text-white"
		>
			{v.lineName}
		</DivIcon></Marker
	>
{/each}

<style>
	:global(.leaflet-div-icon) {
		background: transparent;
		border: none;
		padding: 0;
	}
</style>
