<script lang="ts">
	import { onMount } from 'svelte';
	import { joinRoom } from 'trystero';

	const config = { appId: 'bruhaik-neu4h57fh3kfadgkh73fhw' };

	const onClick = () => {
		console.log('Haik button clicked');
	};
	onMount(() => {
		const room = joinRoom(config, 'main-room');
		console.log(room.getPeers());
		room.onPeerJoin((peerId) => {
			console.log(`Peer joined: ${peerId}`);
		});
	});
</script>

<button class="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white" on:click={onClick}>
	Haik
</button>
