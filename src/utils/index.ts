export function isTargetElement(
	target: Event["target"]
): target is HTMLElement {
	return !!(target as HTMLElement)?.nodeName;
}

export function isTargetInputElement(
	target: Event["target"]
): target is HTMLElement {
	return (
		(target as HTMLElement)?.nodeName === "INPUT" ||
		(target as HTMLElement)?.nodeName === "TEXTAREA" ||
		(target as HTMLElement)?.contentEditable !== void 0
	);
}

export function getUrlAfterStateChange(
	url: string | URL | void | null
): string {
	if (!url) return location.href;
	if (url instanceof URL) return new URL(url).href;
	try {
		return new URL(url).href;
	} catch (e) {
		if (url.startsWith("/")) {
			return location.origin + url;
		} else {
			const pathArr = location.pathname.split("/");
			pathArr[pathArr.length - 1] = url;
			return location.origin + pathArr.join("/");
		}
	}
}

export function overrideFunction<
	O extends Record<PropertyKey, any>,
	K extends keyof O
>(obj: O, key: K, onBefore: O[K]) {
	const target = obj[key];

	if (target !== "function") return obj;

	const result = function (...args: any[]) {
		onBefore(...args);
		return target(...args);
	} as O[K];

	obj[key] = result.bind(obj);

	return obj;
}
