import type { FeatureCollection } from 'geojson';
// import { query } from '$app/server';
// import pMemoize from 'p-memoize';

const WFSURL =
    'https://ogckart-sn1.atlas.vegvesen.no/datex_3_1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=datex_3_1%3ASituationSimple_v2&outputFormat=application%2Fjson&srsname=EPSG:4326&bbox=5.5,58.9,5.83,59.15';

const fetchRoadEventsRaw = async (): Promise<FeatureCollection> => {
    const res = await fetch(WFSURL);
    if (!res.ok) throw new Error(`WFS request failed: ${res.status} ${res.statusText}`);
    return (await res.json()) as FeatureCollection;
};

// const fetchRoadEventsMemo = pMemoize(fetchRoadEventsRaw, {
//     maxAge: 60 * 1000 // 1 minute
// });

// export const fetchRoadEvents = query<FeatureCollection>(async () => {
//     return fetchRoadEventsMemo();
// });
export const fetchRoadEvents = fetchRoadEventsRaw;
