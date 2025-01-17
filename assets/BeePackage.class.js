import { ComponentBase } from "./ComponentBase.class.js";
import { BeeItem } from "./BeeItem.class.js";

export class BeePackage extends ComponentBase {
	constructor(json={}) {
		super();

		this.json = {
			name: 'My Package',
			desc: 'This is a package.',
			icon: null,
			items: [],
			...json
		}

		if (json.items instanceof Array) {
			this.json.items = json.items.map(x => { return new BeeItem(x); })
		}

		this._template = `
			<section>
				<input data-return="name" placeholder="Package Name"><br>
				<input data-return="desc" placeholder="Package Description"><br>
			</section>
			<section>
				<button data-click="add-item">Add Item</button>
				<section id="section-items">
				</section>
			</section>
		`;

		this._htmlTag = 'DIV'

		this._templateProperties = {
			'name':			(x) => { this.json.name = x.value; },
			'desc':			(x) => { this.json.desc = x.value; },
		};

		this._templateClickActions = {
			'add-item':		() => { this.createItemComponent(); }
		};

		this._templateReplacements = {
			'name': this.json.name,
			'desc': this.json.desc
		};

		if (Object.keys(json).length > 0) {
			console.warn('Loading saves hasn\'t been implemented yet. This should never be triggered. WTF?');
			alert('Your package was restored from your last session. Currently, uploaded files cannot be saved/restored.');
		}
	}

	createItemComponent() {
		let el = new BeeItem();
		this.json.items.push( el );
		this._html.querySelector('#section-items').appendChild( el.html() );
	}

	html() {
		// Run the ComponentBase code
		const el = super.html();
		const itemContainer = el.querySelector('#section-items')

		this.json.items.forEach(x => {
			itemContainer.appendChild(x.html())
		})

		return el
	}

	serialize() {
		return {
			...this.json,
			items: this.json.items.map(x => { return x.serialize(); })
		}
	}

	compress() {
		return LZString.compressToUTF16(JSON.stringify(this.serialize()))
	}

	async export() {
		var zip = new JSZip()
		var info = `// Generated by ComponentBase.BeePackage.export
"ID" "${this.id}"
"Name" "${this.json.name}"
"Desc" "${this.json.desc}"
`
		function addToInfo(x) { info += x; }
		async function createFile(name, content) { await zip.file(name, content); }

		for (var item = 0; item < this.json.items.length; item++) {
			await this.json.items[item].export(addToInfo, createFile);
		}

		createFile('info.txt',info);

		return zip.generateAsync({type:"blob"})
	}
}