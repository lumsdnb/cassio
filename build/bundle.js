var app=function(){"use strict";function e(){}const t=e=>e;function n(e){return e()}function i(){return Object.create(null)}function r(e){e.forEach(n)}function o(e){return"function"==typeof e}function s(e,t){return e!=e?t==t:e!==t||e&&"object"==typeof e||"function"==typeof e}let a;function c(e,t){return a||(a=document.createElement("a")),a.href=t,e===a.href}function l(e){return null==e?"":e}const u="undefined"!=typeof window;let d=u?()=>window.performance.now():()=>Date.now(),f=u?e=>requestAnimationFrame(e):e;const m=new Set;function h(e){m.forEach((t=>{t.c(e)||(m.delete(t),t.f())})),0!==m.size&&f(h)}function g(e){let t;return 0===m.size&&f(h),{promise:new Promise((n=>{m.add(t={c:e,f:n})})),abort(){m.delete(t)}}}function p(e,t){e.appendChild(t)}function b(e){if(!e)return document;const t=e.getRootNode?e.getRootNode():e.ownerDocument;return t.host?t:document}function $(e){const t=y("style");return function(e,t){p(e.head||e,t)}(b(e),t),t}function v(e,t,n){e.insertBefore(t,n||null)}function w(e){e.parentNode.removeChild(e)}function y(e){return document.createElement(e)}function k(e){return document.createElementNS("http://www.w3.org/2000/svg",e)}function x(e){return document.createTextNode(e)}function _(){return x(" ")}function C(e,t,n,i){return e.addEventListener(t,n,i),()=>e.removeEventListener(t,n,i)}function z(e,t,n){null==n?e.removeAttribute(t):e.getAttribute(t)!==n&&e.setAttribute(t,n)}function E(e,t){t=""+t,e.wholeText!==t&&(e.data=t)}const S=new Set;let A,D=0;function L(e,t,n,i,r,o,s,a=0){const c=16.666/i;let l="{\n";for(let e=0;e<=1;e+=c){const i=t+(n-t)*o(e);l+=100*e+`%{${s(i,1-i)}}\n`}const u=l+`100% {${s(n,1-n)}}\n}`,d=`__svelte_${function(e){let t=5381,n=e.length;for(;n--;)t=(t<<5)-t^e.charCodeAt(n);return t>>>0}(u)}_${a}`,f=b(e);S.add(f);const m=f.__svelte_stylesheet||(f.__svelte_stylesheet=$(e).sheet),h=f.__svelte_rules||(f.__svelte_rules={});h[d]||(h[d]=!0,m.insertRule(`@keyframes ${d} ${u}`,m.cssRules.length));const g=e.style.animation||"";return e.style.animation=`${g?`${g}, `:""}${d} ${i}ms linear ${r}ms 1 both`,D+=1,d}function F(e,t){const n=(e.style.animation||"").split(", "),i=n.filter(t?e=>e.indexOf(t)<0:e=>-1===e.indexOf("__svelte")),r=n.length-i.length;r&&(e.style.animation=i.join(", "),D-=r,D||f((()=>{D||(S.forEach((e=>{const t=e.__svelte_stylesheet;let n=t.cssRules.length;for(;n--;)t.deleteRule(n);e.__svelte_rules={}})),S.clear())})))}function N(e){A=e}function R(e,t){const n=e.$$.callbacks[t.type];n&&n.slice().forEach((e=>e.call(this,t)))}const T=[],j=[],I=[],P=[],W=Promise.resolve();let B=!1;function M(e){I.push(e)}let G=!1;const O=new Set;function K(){if(!G){G=!0;do{for(let e=0;e<T.length;e+=1){const t=T[e];N(t),Z(t.$$)}for(N(null),T.length=0;j.length;)j.pop()();for(let e=0;e<I.length;e+=1){const t=I[e];O.has(t)||(O.add(t),t())}I.length=0}while(T.length);for(;P.length;)P.pop()();B=!1,G=!1,O.clear()}}function Z(e){if(null!==e.fragment){e.update(),r(e.before_update);const t=e.dirty;e.dirty=[-1],e.fragment&&e.fragment.p(e.ctx,t),e.after_update.forEach(M)}}let q;function H(){return q||(q=Promise.resolve(),q.then((()=>{q=null}))),q}function J(e,t,n){e.dispatchEvent(function(e,t,n=!1){const i=document.createEvent("CustomEvent");return i.initCustomEvent(e,n,!1,t),i}(`${t?"intro":"outro"}${n}`))}const V=new Set;let X;function Q(e,t){e&&e.i&&(V.delete(e),e.i(t))}function U(e,t,n,i){if(e&&e.o){if(V.has(e))return;V.add(e),X.c.push((()=>{V.delete(e),i&&(n&&e.d(1),i())})),e.o(t)}}const Y={duration:0};function ee(n,i,s,a){let c=i(n,s),l=a?0:1,u=null,f=null,m=null;function h(){m&&F(n,m)}function p(e,t){const n=e.b-l;return t*=Math.abs(n),{a:l,b:e.b,d:n,duration:t,start:e.start,end:e.start+t,group:e.group}}function b(i){const{delay:o=0,duration:s=300,easing:a=t,tick:b=e,css:$}=c||Y,v={start:d()+o,b:i};i||(v.group=X,X.r+=1),u||f?f=v:($&&(h(),m=L(n,l,i,s,o,a,$)),i&&b(0,1),u=p(v,s),M((()=>J(n,i,"start"))),g((e=>{if(f&&e>f.start&&(u=p(f,s),f=null,J(n,u.b,"start"),$&&(h(),m=L(n,l,u.b,u.duration,0,a,c.css))),u)if(e>=u.end)b(l=u.b,1-l),J(n,u.b,"end"),f||(u.b?h():--u.group.r||r(u.group.c)),u=null;else if(e>=u.start){const t=e-u.start;l=u.a+u.d*a(t/u.duration),b(l,1-l)}return!(!u&&!f)})))}return{run(e){o(c)?H().then((()=>{c=c(),b(e)})):b(e)},end(){h(),u=f=null}}}function te(e){e&&e.c()}function ne(e,t,i,s){const{fragment:a,on_mount:c,on_destroy:l,after_update:u}=e.$$;a&&a.m(t,i),s||M((()=>{const t=c.map(n).filter(o);l?l.push(...t):r(t),e.$$.on_mount=[]})),u.forEach(M)}function ie(e,t){const n=e.$$;null!==n.fragment&&(r(n.on_destroy),n.fragment&&n.fragment.d(t),n.on_destroy=n.fragment=null,n.ctx=[])}function re(e,t){-1===e.$$.dirty[0]&&(T.push(e),B||(B=!0,W.then(K)),e.$$.dirty.fill(0)),e.$$.dirty[t/31|0]|=1<<t%31}function oe(t,n,o,s,a,c,l,u=[-1]){const d=A;N(t);const f=t.$$={fragment:null,ctx:null,props:c,update:e,not_equal:a,bound:i(),on_mount:[],on_destroy:[],on_disconnect:[],before_update:[],after_update:[],context:new Map(d?d.$$.context:n.context||[]),callbacks:i(),dirty:u,skip_bound:!1,root:n.target||d.$$.root};l&&l(f.root);let m=!1;if(f.ctx=o?o(t,n.props||{},((e,n,...i)=>{const r=i.length?i[0]:n;return f.ctx&&a(f.ctx[e],f.ctx[e]=r)&&(!f.skip_bound&&f.bound[e]&&f.bound[e](r),m&&re(t,e)),n})):[],f.update(),m=!0,r(f.before_update),f.fragment=!!s&&s(f.ctx),n.target){if(n.hydrate){const e=function(e){return Array.from(e.childNodes)}(n.target);f.fragment&&f.fragment.l(e),e.forEach(w)}else f.fragment&&f.fragment.c();n.intro&&Q(t.$$.fragment),ne(t,n.target,n.anchor,n.customElement),K()}N(d)}class se{$destroy(){ie(this,1),this.$destroy=e}$on(e,t){const n=this.$$.callbacks[e]||(this.$$.callbacks[e]=[]);return n.push(t),()=>{const e=n.indexOf(t);-1!==e&&n.splice(e,1)}}$set(e){var t;this.$$set&&(t=e,0!==Object.keys(t).length)&&(this.$$.skip_bound=!0,this.$$set(e),this.$$.skip_bound=!1)}}function ae(e){const t=e-1;return t*t*t+1}function ce(e,{delay:n=0,duration:i=400,easing:r=t}={}){const o=+getComputedStyle(e).opacity;return{delay:n,duration:i,easing:r,css:e=>"opacity: "+e*o}}function le(e,{delay:t=0,duration:n=400,easing:i=ae,x:r=0,y:o=0,opacity:s=0}={}){const a=getComputedStyle(e),c=+a.opacity,l="none"===a.transform?"":a.transform,u=c*(1-s);return{delay:t,duration:n,easing:i,css:(e,t)=>`\n\t\t\ttransform: ${l} translate(${(1-e)*r}px, ${(1-e)*o}px);\n\t\t\topacity: ${c-u*t}`}}function ue(e,{delay:t=0,duration:n=400,easing:i=ae}={}){const r=getComputedStyle(e),o=+r.opacity,s=parseFloat(r.height),a=parseFloat(r.paddingTop),c=parseFloat(r.paddingBottom),l=parseFloat(r.marginTop),u=parseFloat(r.marginBottom),d=parseFloat(r.borderTopWidth),f=parseFloat(r.borderBottomWidth);return{delay:t,duration:n,easing:i,css:e=>`overflow: hidden;opacity: ${Math.min(20*e,1)*o};height: ${e*s}px;padding-top: ${e*a}px;padding-bottom: ${e*c}px;margin-top: ${e*l}px;margin-bottom: ${e*u}px;border-top-width: ${e*d}px;border-bottom-width: ${e*f}px;`}}function de(t){let n,i,r,o,s,a,l,u,d,f,m,h,g,b,$;return{c(){n=y("section"),i=y("button"),i.textContent="X",r=_(),o=y("h2"),s=x(t[0]),a=_(),l=y("article"),u=y("img"),m=_(),h=y("p"),g=x(t[1]),z(i,"class","svelte-1ctvhzt"),z(o,"id","collectible-info-title"),z(u,"class","collectible-info-image"),c(u.src,d=t[2])||z(u,"src",d),z(u,"alt",f=`${t[0]} image`),z(h,"id","collectible-info-text"),z(h,"class","svelte-1ctvhzt"),z(l,"class","svelte-1ctvhzt"),z(n,"class","collectible-info svelte-1ctvhzt")},m(e,c){v(e,n,c),p(n,i),p(n,r),p(n,o),p(o,s),p(n,a),p(n,l),p(l,u),p(l,m),p(l,h),p(h,g),b||($=C(i,"click",t[3]),b=!0)},p(e,[t]){1&t&&E(s,e[0]),4&t&&!c(u.src,d=e[2])&&z(u,"src",d),1&t&&f!==(f=`${e[0]} image`)&&z(u,"alt",f),2&t&&E(g,e[1])},i:e,o:e,d(e){e&&w(n),b=!1,$()}}}function fe(e,t,n){let{itemName:i}=t,{itemDescription:r}=t,{src:o}=t;return e.$$set=e=>{"itemName"in e&&n(0,i=e.itemName),"itemDescription"in e&&n(1,r=e.itemDescription),"src"in e&&n(2,o=e.src)},[i,r,o,function(t){R.call(this,e,t)}]}class me extends se{constructor(e){super(),oe(this,e,fe,de,s,{itemName:0,itemDescription:1,src:2})}}function he(e){let t,n,i,r,o;return{c(){t=k("svg"),n=k("g"),i=k("g"),r=k("rect"),o=k("path"),z(r,"width","24"),z(r,"height","24"),z(r,"opacity","0"),z(o,"d","M17.81 13.39A8.93 8.93 0 0 0 21 7.62a1 1 0 1 0-2-.24 7.07 7.07 0 0 1-14 0 1 1 0 1 0-2 .24 8.93 8.93 0 0 0 3.18 5.77l-2.3 2.32a1 1 0 0 0 1.41 1.41l2.61-2.6a9.06 9.06 0 0 0 3.1.92V19a1 1 0 0 0 2 0v-3.56a9.06 9.06 0 0 0 3.1-.92l2.61 2.6a1 1 0 0 0 1.41-1.41z"),z(i,"data-name","eye-off-2"),z(n,"data-name","Layer 2"),z(t,"id","closed-eye-icon"),z(t,"viewBox","0 0 24 24"),z(t,"xmlns","http://www.w3.org/2000/svg")},m(e,s){v(e,t,s),p(t,n),p(n,i),p(i,r),p(i,o)},d(e){e&&w(t)}}}function ge(e){let t,n;return{c(){t=k("svg"),n=k("path"),z(n,"d","M45 61.9167C37.7561 62.0069 30.5871 60.4435 24.0385 57.3455C18.9624 54.8687 14.4042 51.4482 10.6074 47.2666C6.58575 42.9432 3.41916 37.8974 1.27501 32.3957L0.833344 31L1.29709 29.6044C3.44278 24.1075 6.60255 19.063 10.6118 14.7334C14.4073 10.5522 18.9639 7.13176 24.0385 4.65461C30.5872 1.55671 37.7561 -0.0066891 45 0.0833621C52.2439 -0.00653365 59.4128 1.55686 65.9615 4.65461C71.0377 7.13119 75.5959 10.5517 79.3926 14.7334C83.4219 19.051 86.5895 24.0984 88.725 29.6044L89.1667 31L88.7029 32.3957C81.7741 50.4324 64.3194 62.223 45 61.9167ZM45 8.9167C29.9651 8.44557 16.1654 17.1984 10.1834 31C16.1645 44.8025 29.9648 53.5557 45 53.0834C60.0346 53.5533 73.8336 44.8009 79.8166 31C73.8424 17.1917 60.0376 8.43563 45 8.9167ZM45 44.25C38.6282 44.2922 33.1164 39.8217 31.8426 33.5784C30.5688 27.335 33.8889 21.0626 39.768 18.6054C45.647 16.1481 52.4431 18.1923 55.9911 23.4851C59.539 28.7779 58.8479 35.841 54.3413 40.3457C51.8738 42.8423 48.5102 44.2481 45 44.25Z"),z(n,"fill","black"),z(t,"id","open-eye-icon"),z(t,"viewBox","0 0 90 62"),z(t,"fill","none"),z(t,"xmlns","http://www.w3.org/2000/svg")},m(e,i){v(e,t,i),p(t,n)},d(e){e&&w(t)}}}function pe(t){let n,i,r;function o(e,t){return e[0]?ge:he}let s=o(t),a=s(t);return{c(){n=y("button"),a.c(),z(n,"id","camera-toggle-button"),z(n,"class","camera-toggle-button")},m(e,o){v(e,n,o),a.m(n,null),i||(r=C(n,"click",t[1]),i=!0)},p(e,[t]){s!==(s=o(e))&&(a.d(1),a=s(e),a&&(a.c(),a.m(n,null)))},i:e,o:e,d(e){e&&w(n),a.d(),i=!1,r()}}}function be(e,t,n){let{isInAR:i=!1}=t;return e.$$set=e=>{"isInAR"in e&&n(0,i=e.isInAR)},[i,function(t){R.call(this,e,t)}]}class $e extends se{constructor(e){super(),oe(this,e,be,pe,s,{isInAR:0})}}function ve(e,t,n){const i=e.slice();return i[10]=t[n],i[12]=n,i}function we(n){let i,s,a,c,l,u,f,m,h,b=n[4],$=[];for(let e=0;e<b.length;e+=1)$[e]=ke(ve(n,b,e));return{c(){i=y("div"),s=y("p"),s.textContent="Als ich hier gelandet bin, sind mir ein paar Geschichten aus dem Rucksack\n      gefallen. Sie haben sich in verschiedenen Dimensionen versteckt.",a=_(),c=y("h2"),c.textContent="bisher gefunden:",l=_(),u=y("section");for(let e=0;e<$.length;e+=1)$[e].c();z(s,"class","intro-paragraph"),z(u,"class","collectibles")},m(e,t){v(e,i,t),p(i,s),p(i,a),p(i,c),p(i,l),p(i,u);for(let e=0;e<$.length;e+=1)$[e].m(u,null);h=!0},p(e,t){if(152&t){let n;for(b=e[4],n=0;n<b.length;n+=1){const i=ve(e,b,n);$[n]?$[n].p(i,t):($[n]=ke(i),$[n].c(),$[n].m(u,null))}for(;n<$.length;n+=1)$[n].d(1);$.length=b.length}},i(n){h||(M((()=>{m&&m.end(1),f=function(n,i,r){let s,a,c=i(n,r),l=!1,u=0;function f(){s&&F(n,s)}function m(){const{delay:i=0,duration:r=300,easing:o=t,tick:m=e,css:h}=c||Y;h&&(s=L(n,0,1,r,i,o,h,u++)),m(0,1);const p=d()+i,b=p+r;a&&a.abort(),l=!0,M((()=>J(n,!0,"start"))),a=g((e=>{if(l){if(e>=b)return m(1,0),J(n,!0,"end"),f(),l=!1;if(e>=p){const t=o((e-p)/r);m(t,1-t)}}return l}))}let h=!1;return{start(){h||(h=!0,F(n),o(c)?(c=c(),H().then(m)):m())},invalidate(){h=!1},end(){l&&(f(),l=!1)}}}(i,le,{y:-100,duration:300}),f.start()})),h=!0)},o(n){f&&f.invalidate(),m=function(n,i,s){let a,c=i(n,s),l=!0;const u=X;function f(){const{delay:i=0,duration:o=300,easing:s=t,tick:f=e,css:m}=c||Y;m&&(a=L(n,1,0,o,i,s,m));const h=d()+i,p=h+o;M((()=>J(n,!1,"start"))),g((e=>{if(l){if(e>=p)return f(0,1),J(n,!1,"end"),--u.r||r(u.c),!1;if(e>=h){const t=s((e-h)/o);f(1-t,t)}}return l}))}return u.r+=1,o(c)?H().then((()=>{c=c(),f()})):f(),{end(e){e&&c.tick&&c.tick(1,0),l&&(a&&F(n,a),l=!1)}}}(i,ue,{duration:200}),h=!1},d(e){e&&w(i),function(e,t){for(let n=0;n<e.length;n+=1)e[n]&&e[n].d(t)}($,e),e&&m&&m.end()}}}function ye(e){let t,n,i,r;return n=new me({props:{itemName:e[4][e[2]].name,itemDescription:e[4][e[2]].text,src:`./assets/item${e[2]}/title-image.png`}}),n.$on("click",e[5]),{c(){t=y("div"),te(n.$$.fragment)},m(e,i){v(e,t,i),ne(n,t,null),r=!0},p(e,t){const i={};4&t&&(i.itemName=e[4][e[2]].name),4&t&&(i.itemDescription=e[4][e[2]].text),4&t&&(i.src=`./assets/item${e[2]}/title-image.png`),n.$set(i)},i(e){r||(Q(n.$$.fragment,e),M((()=>{i||(i=ee(t,ce,{duration:100},!0)),i.run(1)})),r=!0)},o(e){U(n.$$.fragment,e),i||(i=ee(t,ce,{duration:100},!1)),i.run(0),r=!1},d(e){e&&w(t),ie(n),e&&i&&i.end()}}}function ke(e){let t,n,i,r,o,s,a=e[4][e[12]].icon+"";return{c(){t=y("button"),n=x(a),z(t,"data-id",i=e[12]+1),z(t,"class",r=l(`item${e[12]+1} collectible ${e[3][e[12]],"--found"}`)+" svelte-1jl9bhv")},m(i,r){v(i,t,r),p(t,n),o||(s=C(t,"click",e[7]),o=!0)},p(e,n){8&n&&r!==(r=l(`item${e[12]+1} collectible ${e[3][e[12]],"--found"}`)+" svelte-1jl9bhv")&&z(t,"class",r)},d(e){e&&w(t),o=!1,s()}}}function xe(e){let t,n,i,o,s,a,c,l,u;const d=[ye,we],f=[];function m(e,t){return e[0]?0:1}return o=m(e),s=f[o]=d[o](e),l=new $e({props:{isInAR:e[1]}}),l.$on("click",e[6]),{c(){t=y("header"),t.innerHTML='<h1 class="svelte-1jl9bhv">Cassiopeias Saga</h1>',n=_(),i=y("main"),s.c(),a=_(),c=y("footer"),te(l.$$.fragment),z(t,"class","banner-img svelte-1jl9bhv")},m(e,r){v(e,t,r),v(e,n,r),v(e,i,r),f[o].m(i,null),v(e,a,r),v(e,c,r),ne(l,c,null),u=!0},p(e,[t]){let n=o;o=m(e),o===n?f[o].p(e,t):(X={r:0,c:[],p:X},U(f[n],1,1,(()=>{f[n]=null})),X.r||r(X.c),X=X.p,s=f[o],s?s.p(e,t):(s=f[o]=d[o](e),s.c()),Q(s,1),s.m(i,null));const a={};2&t&&(a.isInAR=e[1]),l.$set(a)},i(e){u||(Q(s),Q(l.$$.fragment,e),u=!0)},o(e){U(s),U(l.$$.fragment,e),u=!1},d(e){e&&w(t),e&&w(n),e&&w(i),f[o].d(),e&&w(a),e&&w(c),ie(l)}}}function _e(e,t,n){let i=!1,r=!1,o=0;const s=[0,0,0,0,0,0,0,0,0,0,0],a=[0,0,0,0,0,0,0];function c(){if(document.getElementById("ar-frame"))n(1,r=!1),document.getElementById("ar-frame").remove();else{console.log("loading cam"),n(1,r=!0);var e=document.createElement("iframe");e.id="ar-frame",e.setAttribute("src","./assets/ar.html"),e.setAttribute("height","100vh"),document.querySelector("body").appendChild(e)}}const l=()=>{n(0,i=!1),window.scrollTo(0,0)};return window.addEventListener("message",(function(e){const t=e.data;if(console.log("marker "+t),"chakra"==t.slice(0,6)){const e=t.slice(-1)-1;a[e]=1,n(2,o=10),n(0,i=!0),c()}else n(3,s[t]=1,s),n(2,o=t),n(0,i=!0),c()})),[i,r,o,s,[{name:"Triangulis",text:"Triangulis  nennt sich die Welt der Dreieckspersonen. In dieser Welt wird nichts zu zweit getan, sondern alles zu dritt erledigt, so gibt es auch das ja, das nein und das, wer weiß?. Ja, selbst beim Fußball spielen drei Teams gegeneinander. Der tag hat drei Phasen, den Aufgang der ersten sonne, die Phase in der beide Sonnen zu sehen sind und die letzte Phase in der nur eine der beiden sonnen zu sehen ist. <p> Welt 1 besser bekannt als Trianga (oder Azurien) leben sehr besondere Lebewesen. Sie sind Dreiecke. Da der Planet seine Stern sehr eng umkreist, haben sich auf dieser sumpfigen Wasserwelt Lebewesen in dreieckiger Form gebildet. Sie währen nie auf den Gedanken gekommen, eine Frage nach einem Ja oder einem Nein zu stellen, viel mehr würden sie dich aus 3 verschiedenen Kontexten heraus nach der cleversten Lösung nach einem Problem fragen. </p> Die Trainguilaner betreiben uns fremden Koitus. Sie ... tedraeder etc. Schenekel in der länge verändern ... Extrem krasse lebewesen aus formen die man aus drei-ecken bilden kann. Sie Leben alle in frieden und es gibt ein gleich Gewicht zwischen den verschiedenen Lebensformen: 3 Ecke sind für die Fortpflanzung zu ständig. Die 4 Ecke, sind die Gebäudebauer und Architekten 5 ecke sind richtige Profis in der Küche und in vielen handwerklichen dingen 6 ecke sind optimal zu verteidigungszwecken gegen Asteroiden - sie können nämlich fliegen da sie sechs Flügel habenJedes Lebewesen, egal in welcher form es geboren wird, kann zurück in das Dreiecksstadium fallen, wenn es sich fortpflanzen mag.",icon:"▲"},{name:"gemeinsam",text:"manche dinge gehen besser zusammen..",icon:"G"},{name:"Kleine Stadt",text:"Die kleinste Stadt, die ich je gesehen habe, war auf Planet bla. Die Leute und ihre Häuser sind so klein, dass sie von Feinden meistens einfach übersehen werden.",icon:"🔍"},{name:"Einzeller",text:"Hallo, ich bin ein großer Einzeller. Ich bin so groß wie ihr, aber ihr seid so viele..",icon:"🦠"},{name:"uhren",text:"es scheint, als sei die Zeit stehen geblieben",icon:"🕐"},{name:"Wasserplanet",text:"Als ich auf einer meiner Wurmlochreisen mit einem Wal zusammengestossen bin, hat es mich richtig aus den Socken gehauen",icon:"🌊"},{name:"bild am toilettelhaus",text:"kaka lol",icon:"💩"},{name:"pflanze",text:"gustav",icon:"🌱"},{name:"3 Siebe",text:"du bist hier",icon:"🔮"},{name:"das grosse feuer",text:"Dieser baum hat gebrannt",icon:"🔥"},{name:"chakren",text:"text zu chakren, evtl muss da ne andere datenstruktur rein",icon:"🙏"}],l,()=>{window.scrollTo(0,0),l(),c()},function(){this.classList.contains("--found")&&(console.log("unlocked"),n(2,o=this.dataset.id-1),n(0,i=!0)),console.log(this)}]}return new class extends se{constructor(e){super(),oe(this,e,_e,xe,s,{})}}({target:document.body})}();
//# sourceMappingURL=bundle.js.map