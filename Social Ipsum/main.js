const { RepeatGrid, Text } = require("scenegraph");
const application = require("application");

const generators = require('./src/generators');

function getFormData(form) {
	let out = {};
	for (let l of form.querySelectorAll('input[name]')) {
		let n = l.name;
		if (l.type == "checkbox") out[n] = (l.checked);
		else out[n] = l.value;
	}
	for (let l of form.querySelectorAll('select')) {
		let n = l.getAttribute('name');
		let s = l.options[l.selectedIndex];
		if (s) out[n] = l.value;
	}
	return out;
}

/**
 * Initializes the panel, attaches events.
 */
function show(event) {
	let root = document.createElement("panel");
	root.innerHTML = require('./src/panel');
	let tabs = root.querySelector('#type-selector');
	let generators = root.querySelector('#generators');
	let sets = generators.querySelectorAll('section,form');
	let submit = generators.querySelector('button[type=submit]');
	let example = generators.querySelector('#example');
	let preview = generators.querySelector('#preview');
	const getPreview = () => {
		let type = tabs.value;
		let options = getFormData(generators.querySelector(`#${type}`));
		let response = generate(type, 1, options);
		if (!response) return;
		if (response.error) {
			submit.disabled = true;
			submit.setAttribute('title', response.error);
			preview.classList.add('color-red');
			preview.querySelector('h1').style.display = 'none';
			example.innerHTML = response.error;
		} else {
			submit.setAttribute('title', "");
			submit.disabled = false;
			example.innerHTML = response;
			preview.classList.remove('color-red');
			preview.querySelector('h1').style.display = 'block';
		}
	};
	const tab = (name) => {
		for (let s of sets) s.classList.remove('active');
		let t = generators.querySelector(`#${name}`);
		if (!t) return;
		example.innerHTML = '';
		t.classList.add('active');
		if (t.id == "info") {
			submit.disabled = true;
			submit.setAttribute('title', "Select content type from dropdown above.");
			preview.style.display = 'none';
		} else {
			submit.disabled = false;
			submit.setAttribute('title', '');
			preview.style.display = 'block';
			getPreview();
		}
	};
	tabs.addEventListener('change', (evt) => {
		for (let s of sets) s.classList.remove('active');
		tab(tabs.value);
	});
	submit.addEventListener('click', (evt) => {
		let data = getFormData(generators.querySelector(`#${tabs.value}`));
		replaceSelection(tabs.value, data);
	});
	tab(tabs.value);
	for (let b of root.querySelectorAll('input[type=range]')) {
		b.addEventListener('input', (evt) => {
			let t = evt.target;
			// isn't there an Element.closest function?
			let l = t.parentElement;
			let val = Math.floor(t.value);
			let vars = l.querySelectorAll(`var`);
			for (let v of vars) v.textContent = `${val}`;
		});
	}
	generators.addEventListener('input', getPreview);
	generators.addEventListener('change', getPreview);
	event.node.appendChild(root);
}

/**
 * Cleans up after itself.
 */
function hide(event) {
	event.node.firstChild.remove();
}

/**
 * This is triggered every time the selection changes.
 *
 * It changes the class on the main panel element to display either
 * instructions or buttons.
 *
 * Actual manipulation of the selection happens in the event handlers for
 * the displayed buttons.
 */
function update(selection) {
	let m = document.querySelector('#modal');
	if (getEditable(selection)) {
		m.className = 'selection';
	} else {
		m.className = '';
	}
}

/**
 * Returns any supported types, filters out unsupported ones.
 */
function getEditable(selection) {
	let t = selection.items[0];
	if (!(t instanceof Text)) return null;
	let p = t;
	while (p.parent) {
		if (p instanceof RepeatGrid) return p;
		p = p.parent;
	}
	return t;
}

/**
 * Replaces a selection of items with a given type of randomzied content.
 *
 * Current supported options can be found in the generators module.
 */
function replaceSelection(type='moji', options) {
	const { editDocument } = require("application");
	editDocument({}, function (selection) {
		let t = selection.items[0];
		let e = getEditable(selection);
		if (!e) return;
		if (e instanceof RepeatGrid) {
			return e.attachTextDataSeries(t, generate(type, e.children.length, options));
		}
		for (let s of selection.items) {
			if (s instanceof Text) s.text = generate(type, 1, options);
		}
	});
}

/**
 * Calls out to the generators module to get n number of type text
 * generations.
 */
function generate(type, n=1, options=null) {
	const gen = ((type instanceof Function) ? type : generators[type]) ||
	            generators.ipsum;
	if (!gen) {
		return {error: 'Unknown generator.'};
	}
	let out = [];
	for (let i=0;i<=n; i++) out[i] = gen(options);
	return (n==1) ? out[0] : out;
}

module.exports = {
	panels: {
		'socialIpsum': {
			show,
			hide,
			update
		}
	}
};
