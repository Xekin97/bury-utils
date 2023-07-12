/**
 * 功能设计
 *
 * 基于合成台实现的埋点触发工具
 *
 * 基础埋点执行
 * 1. 注册事件（统一入口、出口数据格式）
 * 2. 注册合成台基础规则（埋点触发规则）
 * 3. 事件中收集信息，将信息推入合成台
 * 4. 合成台触发消费事件，触发埋点
 * 4. 卸载埋点，卸载事件
 *
 * 组合埋点执行
 * 1. 注册事件（统一入口、出口数据格式）
 * 2. 注册合成台基础规则以及合成规则（埋点触发规则）
 * 3. 事件中收集信息，将信息推入合成台
 * 4. 合成台自动合成组合信息并消费，触发埋点
 * 4. 卸载埋点，卸载事件
 *
 */

import {
	listenClick,
	listenInput,
	listenMouse,
	listenNetwork,
	listenScriptError,
	listenUrlChange,
} from "../events/auto";
import { EventMap, SpotEvent } from "../events/types";
import { CraftingTable } from "./crafting-table";

export class XSpotter {
	eventDisposers: (() => void)[] = [];

	table = new CraftingTable();

	constructor() {}

	addEvent<T>(
		eventName: T,
		callback: T extends keyof EventMap ? EventMap[T] : any
	) {
		switch (eventName) {
			case "click": {
				this.eventDisposers.push(listenClick(callback as EventMap["click"]));
			}
			case "input": {
				this.eventDisposers.push(listenInput(callback as EventMap["input"]));
			}
			case "mouse": {
				this.eventDisposers.push(listenMouse(callback as EventMap["mouse"]));
			}
			case "scriptError": {
				this.eventDisposers.push(
					listenScriptError(callback as EventMap["scriptErrpr"])
				);
			}
			case "network": {
				this.eventDisposers.push(
					listenNetwork(callback as EventMap["network"])
				);
			}
			case "url": {
				this.eventDisposers.push(listenUrlChange(callback as EventMap["url"]));
			}
		}
	}

	addCustomEvent<T>(event: SpotEvent<T>) {}

	init() {}

	dispose() {
		this.eventDisposers.forEach((fn) => fn());
		this.eventDisposers.length = 0;
	}
}
