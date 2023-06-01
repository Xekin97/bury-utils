export function isTargetElement(
	target: Event["target"]
): target is HTMLElement {
	return !!(target as HTMLElement)?.nodeName;
}

export function isTargetInputElement(
	target: Event["target"]
): target is HTMLInputElement {
	return (target as HTMLElement)?.nodeName === "INPUT";
}
