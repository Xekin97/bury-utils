import { isTargetElement, isTargetInputElement } from "../utils";

export interface EventData<V = any> {
	name: string;
	value: V;
	event: Event;
}

export function listenClick(callback: (data: EventData<HTMLElement>) => void) {
	const onClick = (event: MouseEvent) => {
		const target = event.target;
		if (isTargetElement(target)) {
			document.addEventListener(
				"mouseup",
				() => {
					callback({
						name: "click",
						value: target,
						event,
					});
				},
				{
					once: true,
					capture: true,
				}
			);
		}
	};
	document.addEventListener("mousedown", onClick, true);
	return () => {
		document.removeEventListener("mousedown", onClick, true);
	};
}

export function listenInput(callback: (data: EventData<string>) => void) {
	const onFocus = (event: Event) => {
		const target = event.target;
		if (isTargetInputElement(target)) {
			const beforeValue = target.textContent ?? "";

			const onInputEnd = () => {
				const afterValue = target.textContent ?? "";
				if (beforeValue !== afterValue) {
					callback({
						name: "input",
						value: afterValue,
						event,
					});
				}
				window.removeEventListener("beforeunload", onInputEnd, {
					capture: true,
				});
				document.removeEventListener("blur", onInputEnd, {
					capture: true,
				});
			};

			document.addEventListener("blur", onInputEnd, {
				once: true,
				capture: true,
			});
			window.addEventListener("beforeunload", onInputEnd, {
				once: true,
				capture: true,
			});
		}
	};

	document.addEventListener("focus", onFocus, true);

	return () => {
		document.removeEventListener("focus", onFocus, true);
	};
}

export function listenScriptError(
	callback: (error: EventData<string>) => void
) {
	const onError = (event: ErrorEvent | PromiseRejectionEvent) => {
		callback({
			name: "error",
			value:
				(event as ErrorEvent).message ??
				(event as PromiseRejectionEvent).reason,
			event,
		});
	};

	window.addEventListener("error", onError, true);
	window.addEventListener("unhandledrejection", onError, true);
	return () => {
		window.removeEventListener("error", onError, true);
		window.removeEventListener("unhandledrejection", onError, true);
	};
}

export function listenUrl() {}

export function listenNetwork() {}

export function listenExpose() {}

export function listenMouse(
	callback: (data: EventData<{ x: number; y: number }>) => void
) {
	const onMove = (event: MouseEvent) => {
		callback({
			name: "mouse",
			value: {
				x: event.clientX,
				y: event.clientY,
			},
			event,
		});
	};

	document.addEventListener("mousemove", onMove, true);

	return () => {
		document.removeEventListener("mousemove", onMove, true);
	};
}

export function listenPerformance() {}
