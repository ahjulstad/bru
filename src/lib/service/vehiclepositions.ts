import { createClient } from 'graphql-ws';
import { gql } from 'graphql-request';

const client = createClient({
	url: 'wss://api.entur.io/realtime/v2/vehicles/subscriptions',
	connectionParams: {
		'ET-Client-Name': 'https://bsky.app/profile/ahj77.bsky.social'
	}
});

const Query = gql`
subscription {
	vehicles(
			codespaceId: "KOL"
			lineName: "10"
			boundingBox: { minLat: 58.97, minLon: 5.39, maxLat: 59.16, maxLon: 6.07 }
	) {
		line {
					lineName
					publicCode
					lineRef
			}
			location {
					latitude
					longitude
			}
			serviceJourney {
					id
			}
			speed
			heading    
		}
}
`;

interface VehicleFromAPI {
	line: {
		lineName: string;
		publicCode: string;
		lineRef: string;
	};
	location: {
		latitude: number;
		longitude: number;
	};
	serviceJourney: {
		id: string;
	};
	speed: number;
	heading: number;
}

export interface VehiclePosition {
	id: string;
	lineName: string;
	latitude: number;
	longitude: number;
	speed: number;
	heading: number;
}

export const subscribeVehiclePositions = (callback: (data: VehiclePosition) => void) => {
	(async () => {
		console.log('Subscribing');
		const subscription = client.iterate({ query: Query });
		let counter = 0;
		for await (const event of subscription) {
			console.log('Received event:', event);
			if (!event.data)
				continue;
			for (const vehicle of event.data.vehicles as VehicleFromAPI[]) {
				const vp: VehiclePosition = {
					id: vehicle.serviceJourney.id,
					lineName: vehicle.line.lineName,
					latitude: vehicle.location.latitude,
					longitude: vehicle.location.longitude,
					speed: vehicle.speed,
					heading: vehicle.heading
				};
				callback(vp);
			}
			counter++;
			if (counter > 1000)
				break;
		}
	})();
}
