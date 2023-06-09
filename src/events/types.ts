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
