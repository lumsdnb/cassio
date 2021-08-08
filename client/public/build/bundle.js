
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
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root.host) {
            return root;
        }
        return document;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
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

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
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

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
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
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
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

    /* src\InfoPanel.svelte generated by Svelte v3.42.1 */

    const file$1 = "src\\InfoPanel.svelte";

    function create_fragment$1(ctx) {
    	let section;
    	let button;
    	let t1;
    	let h2;
    	let t2;
    	let t3;
    	let t4;
    	let div;
    	let t6;
    	let article;
    	let img;
    	let img_src_value;
    	let t7;
    	let p;
    	let t8;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			section = element("section");
    			button = element("button");
    			button.textContent = "X";
    			t1 = space();
    			h2 = element("h2");
    			t2 = text("item ");
    			t3 = text(/*itemName*/ ctx[0]);
    			t4 = space();
    			div = element("div");
    			div.textContent = "yo";
    			t6 = space();
    			article = element("article");
    			img = element("img");
    			t7 = space();
    			p = element("p");
    			t8 = text(/*itemDescription*/ ctx[1]);
    			attr_dev(button, "class", "svelte-pff5uu");
    			add_location(button, file$1, 5, 2, 117);
    			attr_dev(h2, "id", "collectible-info-title");
    			add_location(h2, file$1, 6, 4, 150);
    			attr_dev(div, "class", "circle");
    			add_location(div, file$1, 7, 4, 208);
    			attr_dev(img, "class", "collectible-info-image");
    			if (!src_url_equal(img.src, img_src_value = "https://source.unsplash.com/random/200×200")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "imag");
    			add_location(img, file$1, 9, 6, 259);
    			attr_dev(p, "id", "collectible-info-text");
    			add_location(p, file$1, 14, 6, 399);
    			add_location(article, file$1, 8, 4, 242);
    			attr_dev(section, "class", "collectible-info svelte-pff5uu");
    			add_location(section, file$1, 4, 0, 78);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, button);
    			append_dev(section, t1);
    			append_dev(section, h2);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(section, t4);
    			append_dev(section, div);
    			append_dev(section, t6);
    			append_dev(section, article);
    			append_dev(article, img);
    			append_dev(article, t7);
    			append_dev(article, p);
    			append_dev(p, t8);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*itemName*/ 1) set_data_dev(t3, /*itemName*/ ctx[0]);
    			if (dirty & /*itemDescription*/ 2) set_data_dev(t8, /*itemDescription*/ ctx[1]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('InfoPanel', slots, []);
    	let { itemName } = $$props;
    	let { itemDescription } = $$props;
    	const writable_props = ['itemName', 'itemDescription'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<InfoPanel> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('itemName' in $$props) $$invalidate(0, itemName = $$props.itemName);
    		if ('itemDescription' in $$props) $$invalidate(1, itemDescription = $$props.itemDescription);
    	};

    	$$self.$capture_state = () => ({ itemName, itemDescription });

    	$$self.$inject_state = $$props => {
    		if ('itemName' in $$props) $$invalidate(0, itemName = $$props.itemName);
    		if ('itemDescription' in $$props) $$invalidate(1, itemDescription = $$props.itemDescription);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [itemName, itemDescription, click_handler];
    }

    class InfoPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, { itemName: 0, itemDescription: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "InfoPanel",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*itemName*/ ctx[0] === undefined && !('itemName' in props)) {
    			console.warn("<InfoPanel> was created without expected prop 'itemName'");
    		}

    		if (/*itemDescription*/ ctx[1] === undefined && !('itemDescription' in props)) {
    			console.warn("<InfoPanel> was created without expected prop 'itemDescription'");
    		}
    	}

    	get itemName() {
    		throw new Error("<InfoPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemName(value) {
    		throw new Error("<InfoPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemDescription() {
    		throw new Error("<InfoPanel>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemDescription(value) {
    		throw new Error("<InfoPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.1 */

    const { console: console_1 } = globals;
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[9] = list[i];
    	child_ctx[11] = i;
    	return child_ctx;
    }

    // (126:4) {:else}
    function create_else_block(ctx) {
    	let p;
    	let t1;
    	let h2;
    	let t3;
    	let section;
    	let each_value = /*itemText*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			p.textContent = "Als ich hier gelandet bin, sind mir ein paar Geschichten aus dem Rucksack\r\n    gefallen. Sie haben sich in verschiedenen Dimensionen versteckt.";
    			t1 = space();
    			h2 = element("h2");
    			h2.textContent = "bisher gefunden:";
    			t3 = space();
    			section = element("section");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(p, "class", "intro-paragraph");
    			add_location(p, file, 126, 2, 3990);
    			add_location(h2, file, 131, 2, 4180);
    			attr_dev(section, "class", "collectibles");
    			add_location(section, file, 132, 2, 4209);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, section, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(section, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*testFn*/ 32) {
    				each_value = /*itemText*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(section, null);
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
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(126:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (118:2) {#if showInfoPanel}
    function create_if_block(ctx) {
    	let div;
    	let infopanel;
    	let div_transition;
    	let current;

    	infopanel = new InfoPanel({
    			props: {
    				itemName: /*itemText*/ ctx[4][/*currentSelectedItem*/ ctx[1]].name,
    				itemDescription: /*itemText*/ ctx[4][/*currentSelectedItem*/ ctx[1]].text
    			},
    			$$inline: true
    		});

    	infopanel.$on("click", /*hideInfo*/ ctx[2]);

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(infopanel.$$.fragment);
    			attr_dev(div, "class", "overlay");
    			add_location(div, file, 118, 4, 3730);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(infopanel, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const infopanel_changes = {};
    			if (dirty & /*currentSelectedItem*/ 2) infopanel_changes.itemName = /*itemText*/ ctx[4][/*currentSelectedItem*/ ctx[1]].name;
    			if (dirty & /*currentSelectedItem*/ 2) infopanel_changes.itemDescription = /*itemText*/ ctx[4][/*currentSelectedItem*/ ctx[1]].text;
    			infopanel.$set(infopanel_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(infopanel.$$.fragment, local);

    			add_render_callback(() => {
    				if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, true);
    				div_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(infopanel.$$.fragment, local);
    			if (!div_transition) div_transition = create_bidirectional_transition(div, fade, { duration: 200 }, false);
    			div_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(infopanel);
    			if (detaching && div_transition) div_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(118:2) {#if showInfoPanel}",
    		ctx
    	});

    	return block;
    }

    // (134:4) {#each itemText as items, i}
    function create_each_block(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "❉";
    			attr_dev(button, "data-id", /*i*/ ctx[11] + 1);
    			attr_dev(button, "class", "" + (null_to_empty(`item${/*i*/ ctx[11] + 1} collectible ${/*i*/ ctx[11] < 3 ? '--found' : ''}`) + " svelte-2ytn7z"));
    			add_location(button, file, 134, 6, 4281);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*testFn*/ ctx[5], false, false, false);
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
    		source: "(134:4) {#each itemText as items, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let header;
    	let h1;
    	let t1;
    	let main;
    	let current_block_type_index;
    	let if_block;
    	let t2;
    	let footer;
    	let button;
    	let svg0;
    	let path0;
    	let t3;
    	let svg1;
    	let g1;
    	let g0;
    	let rect;
    	let path1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*showInfoPanel*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			header = element("header");
    			h1 = element("h1");
    			h1.textContent = "Cassiopeias Saga";
    			t1 = space();
    			main = element("main");
    			if_block.c();
    			t2 = space();
    			footer = element("footer");
    			button = element("button");
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			t3 = space();
    			svg1 = svg_element("svg");
    			g1 = svg_element("g");
    			g0 = svg_element("g");
    			rect = svg_element("rect");
    			path1 = svg_element("path");
    			attr_dev(h1, "class", "svelte-2ytn7z");
    			add_location(h1, file, 113, 2, 3655);
    			attr_dev(header, "class", "banner-img svelte-2ytn7z");
    			add_location(header, file, 112, 0, 3624);
    			add_location(main, file, 116, 0, 3695);
    			attr_dev(path0, "d", "M45 61.9167C37.7561 62.0069 30.5871 60.4435 24.0385 57.3455C18.9624 54.8687 14.4042 51.4482 10.6074 47.2666C6.58575 42.9432 3.41916 37.8974 1.27501 32.3957L0.833344 31L1.29709 29.6044C3.44278 24.1075 6.60255 19.063 10.6118 14.7334C14.4073 10.5522 18.9639 7.13176 24.0385 4.65461C30.5872 1.55671 37.7561 -0.0066891 45 0.0833621C52.2439 -0.00653365 59.4128 1.55686 65.9615 4.65461C71.0377 7.13119 75.5959 10.5517 79.3926 14.7334C83.4219 19.051 86.5895 24.0984 88.725 29.6044L89.1667 31L88.7029 32.3957C81.7741 50.4324 64.3194 62.223 45 61.9167ZM45 8.9167C29.9651 8.44557 16.1654 17.1984 10.1834 31C16.1645 44.8025 29.9648 53.5557 45 53.0834C60.0346 53.5533 73.8336 44.8009 79.8166 31C73.8424 17.1917 60.0376 8.43563 45 8.9167ZM45 44.25C38.6282 44.2922 33.1164 39.8217 31.8426 33.5784C30.5688 27.335 33.8889 21.0626 39.768 18.6054C45.647 16.1481 52.4431 18.1923 55.9911 23.4851C59.539 28.7779 58.8479 35.841 54.3413 40.3457C51.8738 42.8423 48.5102 44.2481 45 44.25Z");
    			attr_dev(path0, "fill", "black");
    			add_location(path0, file, 170, 6, 5545);
    			attr_dev(svg0, "id", "open-eye-icon");
    			attr_dev(svg0, "class", "--hidden");
    			attr_dev(svg0, "width", "90");
    			attr_dev(svg0, "height", "90");
    			attr_dev(svg0, "viewBox", "0 0 90 62");
    			attr_dev(svg0, "fill", "none");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file, 161, 2, 5351);
    			attr_dev(rect, "width", "24");
    			attr_dev(rect, "height", "24");
    			attr_dev(rect, "opacity", "0");
    			add_location(rect, file, 184, 10, 6799);
    			attr_dev(path1, "d", "M17.81 13.39A8.93 8.93 0 0 0 21 7.62a1 1 0 1 0-2-.24 7.07 7.07 0 0 1-14 0 1 1 0 1 0-2 .24 8.93 8.93 0 0 0 3.18 5.77l-2.3 2.32a1 1 0 0 0 1.41 1.41l2.61-2.6a9.06 9.06 0 0 0 3.1.92V19a1 1 0 0 0 2 0v-3.56a9.06 9.06 0 0 0 3.1-.92l2.61 2.6a1 1 0 0 0 1.41-1.41z");
    			add_location(path1, file, 185, 10, 6854);
    			attr_dev(g0, "data-name", "eye-off-2");
    			add_location(g0, file, 183, 8, 6762);
    			attr_dev(g1, "data-name", "Layer 2");
    			add_location(g1, file, 182, 6, 6729);
    			attr_dev(svg1, "id", "closed-eye-icon");
    			attr_dev(svg1, "width", "90");
    			attr_dev(svg1, "height", "90");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file, 175, 4, 6576);
    			attr_dev(button, "id", "camera-toggle-button");
    			attr_dev(button, "class", "camera-toggle-button");
    			add_location(button, file, 155, 2, 5233);
    			add_location(footer, file, 154, 0, 5221);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, h1);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, main, anchor);
    			if_blocks[current_block_type_index].m(main, null);
    			insert_dev(target, t2, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, button);
    			append_dev(button, svg0);
    			append_dev(svg0, path0);
    			append_dev(button, t3);
    			append_dev(button, svg1);
    			append_dev(svg1, g1);
    			append_dev(g1, g0);
    			append_dev(g0, rect);
    			append_dev(g0, path1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*handleAddScene*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(main, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(main);
    			if_blocks[current_block_type_index].d();
    			if (detaching) detach_dev(t2);
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

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let showInfoPanel = false;
    	let showCameraScene = false;
    	let currentSelectedItem = 0;

    	function addScene() {
    		// adds arjs iframe to scene or removes it if button is pressed again
    		console.log('loading cam');

    		if (!document.querySelector('.camera-scene')) {
    			//if not in vr mode, start cam etc
    			showCameraScene = true;

    			var scene = document.createElement('iframe');
    			scene.classList.add('camera-scene');
    			scene.setAttribute('src', '/assets/ar.html');
    			scene.setAttribute('height', '100vh');
    			document.querySelector('body').appendChild(scene);

    			// toggle camera button
    			document.getElementById('open-eye-icon').classList.remove('--hidden');

    			document.getElementById('closed-eye-icon').classList.add('--hidden');
    		} else {
    			// otherwise hide it
    			showCameraScene = false;

    			document.querySelector('.camera-scene').remove();

    			// toggle camera button
    			document.getElementById('open-eye-icon').classList.add('--hidden');

    			document.getElementById('closed-eye-icon').classList.remove('--hidden');
    		}
    	}

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
    		$$invalidate(0, showInfoPanel = false);
    	};

    	const handleAddScene = () => {
    		$$invalidate(0, showInfoPanel = false);
    		document.getElementById('open-eye-icon').classList.remove('--hidden');
    		document.getElementById('closed-eye-icon').classList.remove('--hidden');
    		hideInfo();
    		addScene();
    	};

    	const itemText = [
    		{
    			name: 'triangulis',
    			text: 'die geschichte von item eins. Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, iure! Quibusdam possimus repellat placeat ad explicabo a nisi. At exercitationem rerum pariatur nemo, a similique nobis delectus soluta, magnam autem suscipit beatae recusandae quibusdam quam sapiente perferendis quod maxime omnis!'
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

    	function testFn() {
    		if (this.classList.contains('--found')) {
    			console.log('unlocked');
    			$$invalidate(1, currentSelectedItem = this.dataset.id - 1);
    			$$invalidate(0, showInfoPanel = true);
    		}

    		console.log(this);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		fade,
    		InfoPanel,
    		showInfoPanel,
    		showCameraScene,
    		currentSelectedItem,
    		addScene,
    		loadItemInfo,
    		hideInfo,
    		handleAddScene,
    		itemText,
    		testFn
    	});

    	$$self.$inject_state = $$props => {
    		if ('showInfoPanel' in $$props) $$invalidate(0, showInfoPanel = $$props.showInfoPanel);
    		if ('showCameraScene' in $$props) showCameraScene = $$props.showCameraScene;
    		if ('currentSelectedItem' in $$props) $$invalidate(1, currentSelectedItem = $$props.currentSelectedItem);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [showInfoPanel, currentSelectedItem, hideInfo, handleAddScene, itemText, testFn];
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
