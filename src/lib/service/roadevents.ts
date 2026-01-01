import type { FeatureCollection } from 'geojson';

const WFSURL =
	'https://ogckart-sn1.atlas.vegvesen.no/datex_3_1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=datex_3_1%3ASituationSimple_v2&outputFormat=application%2Fjson&srsname=EPSG:4326&bbox=5.5,58.9,5.83,59.15';

const fetchRoadEventsRaw = async (): Promise<FeatureCollection> => {
	const res = await fetch(WFSURL);
	if (!res.ok) throw new Error(`WFS request failed: ${res.status} ${res.statusText}`);
	return (await res.json()) as FeatureCollection;
};


const WFS_URLDETAILED =
	'https://ogckart-sn1.atlas.vegvesen.no/datex_3_1/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=datex_3_1%3ASituation&outputFormat=application%2Fjson&srsname=EPSG:4326&bbox=5.5,59.02,5.83,59.15';

export const fetchRoadEventsDetailed = async (): Promise<FeatureCollection> => {
	const res = await fetch(WFS_URLDETAILED);
	if (!res.ok) throw new Error(`WFS request failed: ${res.status} ${res.statusText}`);
	return (await res.json()) as FeatureCollection;
};

export const fetchRoadEventsMock = async (): Promise<FeatureCollection> => {
	const res = await fetch('/mockdata/stengt_tunnel_situation2.json');
	if (!res.ok) throw new Error(`Mock data request failed: ${res.status} ${res.statusText}`);
	return (await res.json()) as FeatureCollection;
}


export const mapRoadEvents = (features: FeatureCollection) => {
	let events = [];
	for (const feature of features.features) {
		for (const record of feature.properties?.data[0].datex.situationRecord) {
			if (record.roadOrCarriagewayOrLaneManagementType?.value === "roadClosed") {
				console.log("Found closed road event");
				const location = record.locationReference.locationContainedInGroup.filter((loc: any) => loc.coordinatesForDisplay)[0];
				const event = {
					event: record.roadOrCarriagewayOrLaneManagementType.value,
					description: record.generalPublicComment[0].comment.values.value[0].value,
					coordinatesForDisplay: location.coordinatesForDisplay,
					probabilityOfOccurrence: record.probabilityOfOccurrence?.value,
					locationDescription: record.supplementaryPositionalDescription?.locationDescription.values[0].value.value
				};
				console.log(event);
				events.push(event);
			}
		}
	}
	return events;
};

export const fetchRoadEvents = async () => {
	const events = await fetchRoadEventsDetailed();
	return { events: mapRoadEvents(events), geoJson: events };
}
