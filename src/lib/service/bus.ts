import { GraphQLClient, gql } from 'graphql-request';

const GRAPHQL_URL = 'https://api.entur.io/journey-planner/v3/graphql';

const SOKN = 'NSR:StopPlace:26770';
const BRUKAI = 'NSR:StopPlace:28637';
const MORTAVIKA = 'NSR:StopPlace:58653';

const gqlClient = new GraphQLClient(GRAPHQL_URL, {
	headers: () => ({})
});

const Query = gql`
	{
		stopPlaces(ids: ["NSR:StopPlace:26770", "NSR:StopPlace:28637", "NSR:StopPlace:58653"]) {
			id
			name
			latitude
			longitude
			situations {
				id
				affects {
					... on AffectedStopPlace {
						stopConditions
					}
					... on AffectedLine {
						line {
							id
							publicCode
							name
							transportMode
							transportSubmode
							description
							url
							bikesAllowed
							flexibleLineType
							situations {
								id
								affects {
									__typename
								}
								reportType
								situationNumber
								severity
								priority
								creationTime
								versionedAtTime
								version
								participant
							}
						}
					}
				}
				reportType
				situationNumber
				severity
				priority
				creationTime
				versionedAtTime
				version
				participant
				reportAuthority {
					id
					name
					url
					timezone
					lang
					phone
					fareUrl
					lines {
						id
						publicCode
						name
						transportMode
						transportSubmode
						description
						url
						bikesAllowed
						flexibleLineType
					}
					situations {
						id
						affects {
							... on AffectedStopPlace {
								stopConditions
							}
							... on AffectedLine {
								line {
									id
									publicCode
								}
							}
							... on AffectedServiceJourney {
								operatingDay
							}
							... on AffectedStopPlaceOnLine {
								stopConditions
							}
							... on AffectedStopPlaceOnServiceJourney {
								operatingDay
								stopConditions
							}
							... on AffectedUnknown {
								description
							}
						}
						reportType
						situationNumber
						severity
						priority
						creationTime
						versionedAtTime
						version
						participant
						summary {
							value
							language
						}
						description {
							value
							language
						}
						advice {
							value
							language
						}
						infoLinks {
							uri
							label
						}
						validityPeriod {
							startTime
							endTime
						}
						reportAuthority {
							id
							name
							url
							timezone
							lang
							phone
							fareUrl
						}
					}
				}
			}
			description
			estimatedCalls(timeRange: 10800, numberOfDepartures: 5, whiteListedModes: [bus, water]) {
				aimedDepartureTime
				expectedDepartureTime
				realtime
				realtimeState
				destinationDisplay {
					frontText
				}
				serviceJourney {
					journeyPattern {
						line {
							id
							name
							transportMode
						}
					}
				}
				cancellation
			}
		}
	}
`;

export const fetchBusStopData = async () => {
	const data = await gqlClient.request(Query, {});

	const sokn_data = data.stopPlaces.find((stop: any) => stop.id === SOKN);
	const brukai_data = data.stopPlaces.find((stop: any) => stop.id === BRUKAI);
	const mortavika_data = data.stopPlaces.find((stop: any) => stop.id === MORTAVIKA);

	function callLine(call: any) {
		const expectedDepartureTime = new Date(call.expectedDepartureTime);
		const aimedDepartureTime = new Date(call.aimedDepartureTime);
		const cancellation = call.cancellation ? ' (Cancelled)' : '';
		const displayname =
			call.serviceJourney.journeyPattern.line.name + ' ' + call.destinationDisplay.frontText;
		const timeStr = expectedDepartureTime.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
		return `${timeStr} ${displayname}${cancellation}`;
	}

	function callLineMortavika(call: any) {
		const expectedDepartureTime = new Date(call.expectedDepartureTime);
		const timeStr = expectedDepartureTime.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false
		});
		const displayname = call.destinationDisplay.frontText;
		const cancellation = call.cancellation ? ' (Cancelled)' : '';
		return `${timeStr} ${displayname}${cancellation}`;
	}

	// Apply callLine to each estimated call
	const sokn_rows = sokn_data.estimatedCalls.map(callLine);
	const brukai_rows = brukai_data.estimatedCalls.map(callLine);
	const mortavika_rows = mortavika_data.estimatedCalls.slice(0, 2).map(callLineMortavika);

	return { sokn: sokn_rows, brukai: brukai_rows, mortavika: mortavika_rows, data };
};
