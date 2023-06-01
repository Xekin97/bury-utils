# X-Spotter

前端埋点工具

# Description

支持无痕监听点击、输入改变

# Usage

```shell
npm install x-spotter
```

```html
<div data-x="1">click me</div>
<div data-y="2">click me</div>
<div data-x="1" data-y="2">click me</div>
```

```typescript
// main.ts
import { ClickSpotter, InputSpotter } from "x-spotter";

new ClickSpotter()
	.addRule(
		"hello",
		(target) => {
			return target.dataset.x !== void 0;
		},
		(target) => {
			return target.dataset.x;
		}
	)
	.addRule(
		"world",
		(target) => {
			return target.dataset.y !== void 0;
		},
		(target) => {
			return target.dataset.y;
		}
	)
	.addRule(
		"!",
		(target) => {
			return target.dataset.x !== void 0 && target.dataset.y !== void 0;
		},
		(target) => {
			return target.dataset.x + target.dataset.y;
		}
	)
	.onSpot((name, value) => {
		// log hello 1 while <div> with attribute "data-x" was clicked.
		// log world 2 while <div> with attribute "data-y" was clicked.
		// log ! 3 while <div> with attribute "data-x" and "data-y" was clicked.
		console.log(name, value);
	});

new InputSpotter()
	.addRule(
		"input",
		() => {
			return target.value !== void 0;
		},
		(target) => {
			return target.value;
		}
	)
	.onSpot((name, value) => {
		// input value
		console.log(name, value);
	});
```

# Advance

```typescript
import { XSpotter } from "x-spotter";

class MySpotter extends XSpotter {
	constructor() {
		super();
	}
}
```

# Design

<!-- <img width="1163" alt="image" src="https://user-images.githubusercontent.com/25792845/226158582-519e8cb3-4e92-4972-9632-f07d42f7d0ff.png"> -->

# API

- ClickSpotter
- InputSpotter
- UrlSpotter
- ExposeSpotter
- NetworkSpotter
- PerformanceSpotter
- ErrorSpotter
- ...
