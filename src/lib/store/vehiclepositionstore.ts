import { readable } from 'svelte/store';
import type { VehiclePosition } from '$lib/service/vehiclepositions';
import { subscribeVehiclePositions } from '$lib/service/vehiclepositions';

export const vehiclePositions = readable<Map<string, VehiclePosition>>(new Map(), (set) => {
    const vehicleMap = new Map<string, VehiclePosition>();

    const lineNames = ['10', '34', '33', 'N89'];

    lineNames.forEach((lineName) => {
        const unsubscribe = subscribeVehiclePositions(lineName, (vps: VehiclePosition[]) => {
            vps.forEach((vp) => {
                vehicleMap.set(vp.id, vp);
            });
            set(new Map(vehicleMap));
        });

        return () => {
            // vehicleMap.clear();
            // set(new Map());
            unsubscribe();
        };
    })

});

export type { VehiclePosition };