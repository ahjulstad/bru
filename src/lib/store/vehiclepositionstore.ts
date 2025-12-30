import { readable } from 'svelte/store';
import type { VehiclePosition } from '$lib/service/vehiclepositions';
import { subscribeVehiclePositions } from '$lib/service/vehiclepositions';

export const vehiclePositions = readable<Map<string, VehiclePosition>>(new Map(), (set) => {
    const vehicleMap = new Map<string, VehiclePosition>();

    subscribeVehiclePositions((vp) => {
        vehicleMap.set(vp.id, vp);
        set(new Map(vehicleMap));
    })

});

export type { VehiclePosition };