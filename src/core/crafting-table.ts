export interface Material {
	key: PropertyKey;
}

export interface CraftRule {
	mode: "consume" | "craft";
	key: PropertyKey;
	needs: BagCount;
	auto: boolean;
	order?: number;
}

export type Bag<Data extends Material> = Record<PropertyKey, Data>;

export type BagCount = Record<PropertyKey, number>;

export type Rules = Record<PropertyKey, CraftRule>;

export interface CraftingTableConfig<Data extends Material> {
	autoConsume?: boolean;
	autoCraft?: boolean;
	clearAfterConsume?: boolean;
	onCraft?: (rule: CraftRule) => void;
	onConsume?: (rule: CraftRule) => void;
	onPut?: (data: Data) => void;
	onDrop?: (needs: BagCount) => void;
	onFull?: (data: Data) => void;
	maxCount?: BagCount;
	craftData?: (rule: CraftRule) => Data;
}

export function checkRule(needs: BagCount, bag: BagCount) {
	return Object.entries(needs).every(([key, count]) => bag[key] >= count);
}

export function checkRules(rules: CraftRule[], bag: BagCount) {
	return rules.some((rule) => checkRule(rule.needs, bag));
}

export function sortOrder(a: CraftRule, b: CraftRule) {
	const orderA = a.order ?? 0;
	const orderB = b.order ?? 0;
	return orderB - orderA;
}

export class CraftingTable<Data extends Material> {
	bag: Bag<Data> = Object.create(null);

	bagCount: BagCount = Object.create(null);

	rules: Rules = Object.create(null);

	get autoRules() {
		return Object.values(this.rules).filter((item) => item.auto);
	}

	constructor(public config: CraftingTableConfig<Data> = {}) {}

	setRule(rule: CraftRule) {
		this.rules[rule.key] = rule;
	}

	plusCount(key: PropertyKey) {
		const max = this.getDataCountMax(key);
		const current = this.bagCount[key] ?? 0;
		if (current >= max || max < 1) {
			this.config.onFull?.(this.bag[key]);
			return false;
		}
		if (this.bagCount[key]) {
			this.bagCount[key]++;
		} else {
			this.bagCount[key] = 1;
		}
	}

	getDataCount(key: PropertyKey) {
		return this.bagCount[key] ?? 0;
	}

	getDataCountMax(key: PropertyKey) {
		if (!this.config.maxCount) return Infinity;
		return this.config.maxCount[key] ?? Infinity;
	}

	put(material: Data) {
		this.plusCount(material.key);
		this.bag[material.key] = material;

		this.config.onPut?.(material);

		this.auto();

		if (this.config.autoConsume) {
			this.consumeAll();
		}
		if (this.config.autoCraft) {
			this.craftAll();
		}

		return true;
	}

	drop(needs: BagCount) {
		Object.entries(needs).forEach(([key, count]) => {
			const current = this.getDataCount(key);
			const now = current - count;
			if (now <= 0) {
				delete this.bag[key];
				delete this.bagCount[key];
			} else {
				this.bagCount[key] = now;
			}
		});

		this.config.onDrop?.(needs);

		return true;
	}

	craft(rule: CraftRule, num: number = Infinity) {
		if (rule.mode !== "craft") return;
		if (!this.config.craftData) {
			throw new Error("Please configure the craftData method in Config.");
		}
		let times = 0;

		while (checkRule(rule.needs, this.bagCount) && times < num) {
			const newItem = this.config.craftData(rule);
			this.drop(rule.needs);
			this.put(newItem);
			times++;
		}

		this.config.onCraft?.(rule);
	}

	craftAll() {
		const rules = Object.values(this.rules).filter(
			(rule) => rule.mode === "craft"
		);
		if (!checkRules(rules, this.bagCount)) return;
		rules.sort(sortOrder).forEach((rule) => this.craft(rule));
		this.craftAll();
	}

	consume(rule: CraftRule, num: number = Infinity) {
		let times = 0;

		while (checkRule(rule.needs, this.bagCount) && times < num) {
			this.drop(rule.needs);
			times++;
		}

		this.config.onConsume?.(rule);
	}

	consumeAll() {
		Object.values(this.rules)
			.filter((rule) => rule.mode === "consume")
			.sort(sortOrder)
			.forEach((rule) => this.consume(rule));
	}

	auto() {
		if (!this.autoRules.length) return;
		// 先合成后消费
		this.autoRules.forEach((rule) => {
			if (rule.mode === "craft") this.craft(rule);
		});
		this.autoRules.forEach((rule) => {
			if (rule.mode === "consume") this.consume(rule);
		});
	}

	clearBag() {
		this.bag = Object.create(null);
		this.bagCount = Object.create(null);
	}
}
