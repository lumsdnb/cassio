
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.1' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/App.svelte generated by Svelte v3.42.1 */

    const { console: console_1 } = globals;
    const file = "src/App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[4] = list[i];
    	child_ctx[6] = i;
    	return child_ctx;
    }

    // (114:4) {#each itemText as items, i }
    function create_each_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "❉";
    			attr_dev(button, "data-id", /*i*/ ctx[6] + 1);
    			attr_dev(button, "class", `item${/*i*/ ctx[6] + 1} collectible ${/*i*/ ctx[6] < 3 ? "--found" : ""}`);
    			add_location(button, file, 115, 4, 3287);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", testFn, false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(114:4) {#each itemText as items, i }",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let div0;
    	let h1;
    	let t1;
    	let main;
    	let p0;
    	let t3;
    	let h20;
    	let t5;
    	let section0;
    	let t6;
    	let section1;
    	let h21;
    	let t8;
    	let div1;
    	let t10;
    	let article;
    	let img;
    	let img_src_value;
    	let t11;
    	let p1;
    	let t13;
    	let button0;
    	let t15;
    	let footer;
    	let button1;
    	let svg0;
    	let path0;
    	let t16;
    	let svg1;
    	let g1;
    	let g0;
    	let rect;
    	let path1;
    	let mounted;
    	let dispose;
    	let each_value = /*itemText*/ ctx[1];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Cassiopeias Saga";
    			t1 = space();
    			main = element("main");
    			p0 = element("p");
    			p0.textContent = "Als ich hier gelandet bin, sind mir ein paar Geschichten aus dem Rucksack\n        gefallen. Sie haben sich in verschiedenen Dimensionen versteckt.";
    			t3 = space();
    			h20 = element("h2");
    			h20.textContent = "bisher gefunden:";
    			t5 = space();
    			section0 = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			section1 = element("section");
    			h21 = element("h2");
    			h21.textContent = "item x";
    			t8 = space();
    			div1 = element("div");
    			div1.textContent = "yo";
    			t10 = space();
    			article = element("article");
    			img = element("img");
    			t11 = space();
    			p1 = element("p");
    			p1.textContent = "hier kommt der text vom item rein";
    			t13 = space();
    			button0 = element("button");
    			button0.textContent = "ok";
    			t15 = space();
    			footer = element("footer");
    			button1 = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t16 = space();
    			svg1 = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path1 = svg_element("path");
    			add_location(h1, file, 102, 2, 2932);
    			attr_dev(div0, "class", "banner-img");
    			add_location(div0, file, 101, 0, 2905);
    			attr_dev(p0, "class", "intro-paragraph");
    			add_location(p0, file, 107, 6, 2980);
    			add_location(h20, file, 111, 6, 3180);
    			attr_dev(section0, "class", "collectibles");
    			add_location(section0, file, 112, 6, 3212);
    			add_location(main, file, 105, 0, 2966);
    			attr_dev(h21, "id", "collectible-info-title");
    			add_location(h21, file, 132, 6, 4230);
    			attr_dev(div1, "class", "circle");
    			add_location(div1, file, 133, 6, 4280);
    			attr_dev(img, "class", "collectible-info-image");
    			if (!src_url_equal(img.src, img_src_value = "https://source.unsplash.com/random/200×200")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "imag");
    			add_location(img, file, 135, 8, 4333);
    			attr_dev(p1, "id", "collectible-info-text");
    			add_location(p1, file, 140, 8, 4478);
    			attr_dev(button0, "onclick", "hideInfo()");
    			add_location(button0, file, 141, 8, 4554);
    			add_location(article, file, 134, 6, 4315);
    			attr_dev(section1, "id", "collectible-info");
    			attr_dev(section1, "class", "--hidden");
    			add_location(section1, file, 131, 4, 4175);
    			attr_dev(path0, "d", "M45 61.9167C37.7561 62.0069 30.5871 60.4435 24.0385 57.3455C18.9624 54.8687 14.4042 51.4482 10.6074 47.2666C6.58575 42.9432 3.41916 37.8974 1.27501 32.3957L0.833344 31L1.29709 29.6044C3.44278 24.1075 6.60255 19.063 10.6118 14.7334C14.4073 10.5522 18.9639 7.13176 24.0385 4.65461C30.5872 1.55671 37.7561 -0.0066891 45 0.0833621C52.2439 -0.00653365 59.4128 1.55686 65.9615 4.65461C71.0377 7.13119 75.5959 10.5517 79.3926 14.7334C83.4219 19.051 86.5895 24.0984 88.725 29.6044L89.1667 31L88.7029 32.3957C81.7741 50.4324 64.3194 62.223 45 61.9167ZM45 8.9167C29.9651 8.44557 16.1654 17.1984 10.1834 31C16.1645 44.8025 29.9648 53.5557 45 53.0834C60.0346 53.5533 73.8336 44.8009 79.8166 31C73.8424 17.1917 60.0376 8.43563 45 8.9167ZM45 44.25C38.6282 44.2922 33.1164 39.8217 31.8426 33.5784C30.5688 27.335 33.8889 21.0626 39.768 18.6054C45.647 16.1481 52.4431 18.1923 55.9911 23.4851C59.539 28.7779 58.8479 35.841 54.3413 40.3457C51.8738 42.8423 48.5102 44.2481 45 44.25Z");
    			attr_dev(path0, "fill", "black");
    			add_location(path0, file, 159, 10, 4996);
    			attr_dev(svg0, "id", "open-eye-icon");
    			attr_dev(svg0, "class", "--hidden");
    			attr_dev(svg0, "width", "90");
    			attr_dev(svg0, "height", "90");
    			attr_dev(svg0, "viewBox", "0 0 90 62");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file, 150, 8, 4775);
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file, 173, 14, 6292);
    			attr_dev(path1, "d", "M17.81 13.39A8.93 8.93 0 0 0 21 7.62a1 1 0 1 0-2-.24 7.07 7.07 0 0 1-14 0 1 1 0 1 0-2 .24 8.93 8.93 0 0 0 3.18 5.77l-2.3 2.32a1 1 0 0 0 1.41 1.41l2.61-2.6a9.06 9.06 0 0 0 3.1.92V19a1 1 0 0 0 2 0v-3.56a9.06 9.06 0 0 0 3.1-.92l2.61 2.6a1 1 0 0 0 1.41-1.41z");
    			add_location(path1, file, 174, 14, 6350);
    			attr_dev(g0, "data-name", "eye-off-2");
    			add_location(g0, file, 172, 12, 6252);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file, 171, 10, 6216);
    			attr_dev(svg1, "id", "closed-eye-icon");
    			attr_dev(svg1, "width", "90");
    			attr_dev(svg1, "height", "90");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file, 164, 8, 6042);
    			attr_dev(button1, "id", "camera-toggle-button");
    			attr_dev(button1, "class", "camera-toggle-button");
    			add_location(button1, file, 145, 6, 4646);
    			add_location(footer, file, 144, 4, 4631);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, p0);
    			append_dev(main, t3);
    			append_dev(main, h20);
    			append_dev(main, t5);
    			append_dev(main, section0);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section0, null);
    			}

    			insert_dev(target, t6, anchor);
    			insert_dev(target, section1, anchor);
    			append_dev(section1, h21);
    			append_dev(section1, t8);
    			append_dev(section1, div1);
    			append_dev(section1, t10);
    			append_dev(section1, article);
    			append_dev(article, img);
    			append_dev(article, t11);
    			append_dev(article, p1);
    			append_dev(article, t13);
    			append_dev(article, button0);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, button1);
    			append_dev(button1, svg0);
    			append_dev(svg0, path0);
    			append_dev(button1, t16);
    			append_dev(button1, svg1);
    			append_dev(svg1, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path1);

    			if (!mounted) {
    				dispose = listen_dev(button1, "click", /*handleAddScene*/ ctx[0], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*testFn*/ 0) {
    				each_value = /*itemText*/ ctx[1];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section0, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(section1);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(footer);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function addScene() {
    	console.log('loading cam');

    	if (!document.querySelector('.camera-scene')) {
    		//if not in vr mode, start cam etc
    		var scene = document.createElement('iframe');

    		scene.classList.add('camera-scene');
    		scene.setAttribute('src', '/assets/ar.html');
    		scene.setAttribute('height', '100vh');
    		document.querySelector('body').appendChild(scene);

    		// toggle camera button
    		document.getElementById('open-eye-icon').classList.remove('--hidden');

    		document.getElementById('closed-eye-icon').classList.add('--hidden');
    	} else {
    		document.querySelector('.camera-scene').remove();

    		// toggle camera button
    		document.getElementById('open-eye-icon').classList.add('--hidden');

    		document.getElementById('closed-eye-icon').classList.remove('--hidden');
    	}
    }

    function testFn() {
    	if (this.classList.contains("--found")) {
    		console.log("unlocked");
    	}

    	console.log(this);
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	function loadItemInfo(e) {
    		const infoPanel = document.getElementById('collectible-info');
    		const infoPanelText = document.getElementById('collectible-info-text');
    		const infoPanelTitle = document.getElementById('collectible-info-title');

    		//get dom node
    		console.log(e.target.classList);

    		//check if item was found
    		if (e.target.classList.contains('--found')) {
    			//if yes, load content of triggered collectible into panel
    			console.log('has been found already');

    			infoPanelTitle.innerHTML = itemText[e.target.dataset.id - 1].name;
    			infoPanelText.innerHTML = itemText[e.target.dataset.id - 1].text; // here

    			//and then show it to user
    			infoPanel.classList.remove('--hidden');
    		}

    		console.log('click');
    	}

    	

    	const hideInfo = () => {
    		document.getElementById('collectible-info').classList.add('--hidden');
    	};

    	const handleAddScene = () => {
    		document.getElementById('open-eye-icon').classList.remove('--hidden');
    		document.getElementById('closed-eye-icon').classList.remove('--hidden');
    		hideInfo();
    		addScene();
    	};

    	const itemText = [
    		{
    			name: 'triangulis',
    			text: 'die geschichte von item eins'
    		},
    		{
    			name: 'itemzwo',
    			text: 'die geschichte von itemzwei'
    		},
    		{
    			name: 'item333',
    			text: 'nummer 3 auch am start'
    		},
    		{ name: 'vier', text: 'item 4 ist hier' },
    		{
    			name: 'fuenf',
    			text: 'item 5 ist hier so und macht so text'
    		},
    		{
    			name: '66',
    			text: 'item 6 ist hier so und macht so text'
    		},
    		{
    			name: '77777',
    			text: 'item 7 ist hier so und macht so text'
    		},
    		{ name: 'acht', text: 'achtsam und so' },
    		{
    			name: 'neun',
    			text: 'neun ist ne gute zahl'
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		addScene,
    		loadItemInfo,
    		hideInfo,
    		handleAddScene,
    		itemText,
    		testFn
    	});

    	return [handleAddScene, itemText];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
