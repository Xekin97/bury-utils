import {
	getUrlAfterStateChange,
	isTargetElement,
	isTargetInputElement,
	overrideFunction,
} from "../utils";
import { EventCallback } from "./types";

// element click
export function listenClick(callback: EventCallback<HTMLElement>) {
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

// input value
export function listenInput(callback: EventCallback<string>) {
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

// script error
export function listenScriptError(callback: EventCallback<string>) {
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

// url change
export function listenUrlChange(
	callback: EventCallback<{ from: string; to: string }>
) {
	let alive = true;

	overrideFunction(history, "pushState", (data, unused, url) => {
		if (!alive) return;
		callback({
			name: "url-change",
			value: {
				from: location.href,
				to: getUrlAfterStateChange(url),
			},
			event: {
				name: "history-push-state",
				params: [data, unused, url],
			},
		});
	});

	overrideFunction(history, "replaceState", (data, unused, url) => {
		if (!alive) return;
		callback({
			name: "url-change",
			value: {
				from: location.href,
				to: getUrlAfterStateChange(url),
			},
			event: {
				name: "history-replace-state",
				params: [data, unused, url],
			},
		});
	});

	const onHashChange = (event: HashChangeEvent) => {
		callback({
			name: "url-change",
			value: {
				from: location.href,
				to: event.newURL,
			},
			event,
		});
	};

	const onPopState = (event: PopStateEvent) => {
		callback({
			name: "url-change",
			value: {
				from: location.href,
				to: event.state.route,
			},
			event,
		});
	};

	window.addEventListener("hashchange", onHashChange);
	window.addEventListener("popstate", onPopState);

	return () => {
		alive = false;
		window.removeEventListener("hashchange", onHashChange);
		window.removeEventListener("popstate", onPopState);
	};
}

// mouse move
export function listenMouse(callback: EventCallback<{ x: number; y: number }>) {
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

// network change
export function listenNetwork() {}

// web life
export function listenWebLife() {}
