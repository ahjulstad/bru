<script lang="ts">
	import { onMount } from 'svelte';
	import { TileLayer } from 'sveaflet';

	let { timestamp = $bindable() } = $props();

	let images: string[] = $state([]);
	let imagelength = $state(0);
	let timestamps: string[] = $state([]);
	let aFrame = $state(0);
	let bFrame = $state(1);
	let showb = $state(false);
	let counter = $state(0);

	$effect(() => {
		timestamp = timestamps[aFrame];
	});

	onMount(async () => {
		// Get list of animation map images
		const overview = await fetch('https://beta.yr-maps.met.no/api/precipitation-nowcast/').then(
			(res) => res.json()
		);
		images = overview.times.map((element: any) => element.tiles.webp);
		timestamps = overview.times.map((element: any) =>
			new Date(Date.parse(element.time)).toLocaleString(undefined, {
				hour: '2-digit',
				minute: '2-digit',
				hour12: false
			})
		);
		imagelength = images.length;
	});

	$effect(() => {
		if (imagelength === 0) return;

		const id = setInterval(() => {
			counter += 1;
			showb = !showb;
			if (counter >= 10) {
				clearInterval(id);
			}
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

{#if imagelength > 2}
	<TileLayer
		url={images[aFrame]}
		opacity={showb ? 0 : 1}
		options={{
			className: 'radar-layer',
			maxNativeZoom: 6
		}}
	/>
	{#if counter >= 1}
		<TileLayer
			url={images[bFrame]}
			opacity={showb ? 1 : 0}
			options={{
				className: 'radar-layer',
				maxNativeZoom: 6
			}}
		/>
	{/if}
{/if}

<style>
	:global(.radar-layer),
	:global(.radar-layer img) {
		mix-blend-mode: screen;
		image-rendering: pixelated;
		/* -webkit-backface-visibility: hidden;
		backface-visibility: hidden; */
	}
</style>
