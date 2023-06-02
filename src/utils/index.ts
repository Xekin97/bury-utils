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
