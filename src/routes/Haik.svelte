<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { joinRoom } from 'trystero';
	import type { Room } from 'trystero';

	const config = {
		appId: 'bruhaik-neu4h57fh3kfadgkh73fhw',
		password: 'notsecret-only-here-to-test-it-is-SPA-after-all'
	};

	const onClick = () => {
		console.log('Haik button clicked');
	};
	let room: Room;
	onMount(() => {
		room = joinRoom(config, 'main-room');
		room.onPeerJoin((peerId) => {
			console.log(`Peer joined: ${peerId}`);
		});
		room.onPeerLeave((peerId) => {
			console.log(`Peer left: ${peerId}`);
		});
	});

	onDestroy(() => {
		room.leave();
	});
</script>

<button class="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white" on:click={onClick}>
	Haik
</button>
