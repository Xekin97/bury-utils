export type EventType =
	| "click"
	| "error"
	| "expose"
	| "input"
	| "mouse"
	| "network"
	| "url"
	| "life";

export type EventCallback<V = any> = (data: EventData<V>) => void;

export interface EventData<V = any> {
	name: string;
	value: V;
	event:
		| Event
		| {
				name: string;
				params: any[];
		  };
}

export type NetworkType =
	| "bluetooth"
	| "cellular"
	| "ethernet"
	| "none"
	| "wifi"
	| "wimax"
	| "other"
	| "unknown";

export type NetworkEffectiveType = "slow-2g" | "2g" | "3g" | "4g" | undefined;
export interface NetworkData {
	isOnline: boolean;
	offlineAt: number | undefined;
	onlineAt: number | undefined;
	downlink: number | undefined;
	downlinkMax: number | undefined;
	effectiveType: NetworkEffectiveType;
	rtt: number | undefined;
	saveData: boolean | undefined;
	type: NetworkType;
}

export interface LifeData {
	initDate: Date;
	currentDate: Date;
}
