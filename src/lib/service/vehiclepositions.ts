import { createClient } from 'graphql-ws';
import { gql } from 'graphql-request';

const client = createClient({
	url: 'wss://api.entur.io/realtime/v2/vehicles/subscriptions',
	connectionParams: {
		'ET-Client-Name': 'https://bsky.app/profile/ahj77.bsky.social'
	}
});

const Query = gql`
subscription VehiclePositions($lineName: String!) {
	vehicles(
			codespaceId: "KOL"
			lineName: $lineName
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

function mapvehicle(apiVehicle: VehicleFromAPI): VehiclePosition {
	return {
		id: apiVehicle.serviceJourney.id,
		lineName: apiVehicle.line.lineName,
		latitude: apiVehicle.location.latitude,
		longitude: apiVehicle.location.longitude,
		speed: apiVehicle.speed,
		heading: apiVehicle.heading
	};
}

export const subscribeVehiclePositions = (lineName: string, callback: (data: VehiclePosition[]) => void) => {
	let active = true;

	const unsubscribe = client.subscribe(
		{ query: Query, variables: { lineName } },
		{
			next: ({ data }) => {
				if (!active || !data)
					return;

				const vehicles = (data.vehicles ?? []) as VehicleFromAPI[];
				const vehiclePositions = vehicles.map(mapvehicle);
				callback(vehiclePositions);
			},
			error: (error) => console.error('Vehicle subscription error', error),
			complete: () => console.log('Vehicle subscription completed')
		}
	);

	return () => {
		active = false;
		unsubscribe();
	};

};

