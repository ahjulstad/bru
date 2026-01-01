import { readable } from 'svelte/store';
import { fetchBusStopData, type BusData } from '$lib/service/bus';

export const busDataStore = readable<BusData | null>(null, (set) => {
    let stopped = false;

    const tick = async () => {
        try {
            const data = await fetchBusStopData();
            if (!stopped) set(data);
        } catch (err) {
            console.error('bus poll failed', err);
        }
    };

    tick();
    const id = setInterval(tick, 30_000);

    return () => {
        stopped = true;
        clearInterval(id);
    };
});