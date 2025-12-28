export const ssr = false;

import { fetchRoadEvents } from "$lib/service/roadevents";

export async function load({ setHeaders }) {
    // setHeaders({
    //     'Cache-Control': 'max-age=60'  // Browser caches for 60 seconds
    // });
    // const roadevents = fetchRoadEvents();
    // return { roadevents };
}
