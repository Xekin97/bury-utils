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

export type EventCallback<V = any> = (data: EventData<V>) => void;
export interface EventMap {
	click: EventCallback<HTMLElement>;
	input: EventCallback<string>;
	scriptErrpr: EventCallback<string>;
	url: EventCallback<{ from: string; to: string }>;
	mouse: EventCallback<{ x: number; y: number }>;
	network: EventCallback<NetworkData>;
}

export type EventType = keyof EventMap;

export type SpotEvent<T> = (callback: EventCallback<T>) => () => void;

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
