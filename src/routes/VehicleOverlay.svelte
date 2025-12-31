<script lang="ts">
	import { vehiclePositions } from '$lib/store/vehiclepositionstore';
	import type { VehiclePosition } from '$lib/store/vehiclepositionstore';
	import { Marker, DivIcon } from 'sveaflet';
</script>

{#each Array.from($vehiclePositions.entries()) as [id, v] (id)}
	<Marker latLng={[v.latitude, v.longitude]}
		><DivIcon class="relative flex h-12 w-12 items-center justify-center" iconAnchor={[24, 24]}>
			<div
				class="absolute text-4xl"
				style="top: 50%; left: 50%; transform: translate(-50%, -50%) rotate({v.heading + 180}deg)"
			>
				&#8595;
			</div>
			<div
				class="relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-white bg-black/80 p-1 text-sm text-white"
			>
				{v.lineName}
			</div>
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
