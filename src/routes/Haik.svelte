<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { joinRoom } from 'trystero/mqtt';
	import type { Room } from 'trystero';

	const config = {
		appId: 'bruhaik-neu4h57fh3kfadgkh73fhw',
		relayUrls: [
			'wss://test-user:NotSecret123@ace46297521543609059a27b884d914b.s1.eu.hivemq.cloud:8884/mqtt'
		],
		password: 'notsecret-only-here-to-test-it-is-SPA-after-all'
	};

	let room: Room;
	let sendHaik: ((data?: any) => void) | undefined;

	const onClick = () => {
		if (sendHaik) {
			sendHaik({});
			console.log('Haik action sent');
		} else {
			console.log('Haik not ready yet');
		}
	};

	onMount(() => {
		room = joinRoom(config, 'main-room');
		room.onPeerJoin((peerId) => {
			console.log(`Peer joined: ${peerId}`);
		});
		room.onPeerLeave((peerId) => {
			console.log(`Peer left: ${peerId}`);
		});

		const [send, getHaik] = room.makeAction('haik');
		sendHaik = send;
		getHaik(() => {
			console.log('Haik action received from another peer!');
		});
	});

	onDestroy(() => {
		room.leave();
	});
</script>

<button class="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white" on:click={onClick}>
	Haik
</button>
