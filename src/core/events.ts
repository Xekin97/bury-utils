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

export function listenInput(callback: (event: EventData<string>) => void) {
	const onFocus = (event: Event) => {
		const target = event.target;
		if (isTargetInputElement(target)) {
			const beforeValue = target.value;

			const onInputEnd = () => {
				const afterValue = target.value;
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
	callback: (error: ErrorEvent | PromiseRejectionEvent) => void
) {
	const onError = () => {};

	window.addEventListener("error", callback, true);
	window.addEventListener("unhandledrejection", callback, true);
	return () => {
		window.removeEventListener("error", callback, true);
		window.removeEventListener("unhandledrejection", callback, true);
	};
}

export function listenUrl() {}

export function listenNetword() {}

export function listenExpose() {}

export function listenMouse() {}

export function listenPerformance() {}
