!function(){"use strict";const e="GRAPHQL_MOCK_ALERT",n={pluginSwitchOn:!1,pluginMockResponseList:[{name:"",value:"",disabled:!1}],utils:{mockResponse:!0,openCompInEditor:!0}},t={blockResourceRules:[],entrypoints:[],staticResourceRules:[]},o=()=>{const e=e=>{for(const n in e)if(n.startsWith("__reactInternalInstance")||n.startsWith("__reactFiber$")||n.startsWith("__reactFiber"))return console.log("Found React Fiber instance for element:",e,"Key:",n),e[n];return console.log("No React Fiber instance found for element:",e),null},n=t=>{const o=t.parentElement;if("HTML"===t.tagName||null===o)return console.warn("Couldn't find a React instance for the element",t),null;const s=e(t);return s&&s._debugSource?s._debugSource:n(o)},t=(e,o)=>(null==e?void 0:e._debugOwner)?e._debugOwner._debugSource?e._debugOwner._debugSource:t(e._debugOwner,o):n(o);window.addEventListener("click",(n=>{if(n.stopPropagation(),n.altKey){const{target:o}=n;if(o instanceof HTMLElement){const n=(n=>{const o=e(n);return o&&o._debugSource?o._debugSource:t(o,n)})(o);if(!n)return void console.warn("Couldn't find debug source for element:",o);const{columnNumber:s,fileName:i,lineNumber:r}=n,c=`vscode://file/${i}:${r}:${s}`,u=document.createElement("iframe");u.style.display="none",u.src=c,document.body.appendChild(u),setTimeout((()=>{u.remove()}),100)}}}))};(async t=>{let o=!0;const s=!!document.getElementById("graphql-script-id");s&&o&&(window.graphQLPlugin={},window.postMessage({key:"PAGE_READY_KEY",value:!0},"*"));const i=async e=>{var s;const i=(e=>{var t,o;return Object.assign(Object.assign(Object.assign({},n),e),{pluginSwitchOn:!!e.pluginSwitchOn&&(o=null!==(t=e.lastEffectiveTimestamp)&&void 0!==t?t:Date.now(),(Date.now()-o)/36e5<12)})})(null!==(s=e.value)&&void 0!==s?s:{}),{entrypoints:r=[],blockResourceRules:c=[],staticResourceRules:u=[],mainFrameText:l}=await t(i,o);return{entrypoints:r,blockResourceRules:c,staticResourceRules:u,mainFrameText:l}};window.addEventListener("message",(async n=>{const{data:t}=n;if("GRAPHQL_MOCK_SETTING"===(null==t?void 0:t.key))try{const{entrypoints:n,blockResourceRules:r,staticResourceRules:c,mainFrameText:u}=await i(t),l=n.length>0||r.length>0||c.length>0;(n=>{n&&!window.sessionStorage.getItem(e)&&(window.sessionStorage.setItem(e,"true"),o&&console.log("🚀 Source code seeker is running in your website for the first time!"))})(l),((e,n)=>{var t,i;o&&(!s&&(null===(i=null===(t=window.graphQLPlugin)||void 0===t?void 0:t.blockObserver)||void 0===i||i.disconnect()),n&&document.write(n),e&&(document.title=`${document.title} (Source code seeker)`),o=!1)})(l,u)}catch(e){console.log(e)}}))})((async e=>((null==e?void 0:e.pluginSwitchOn)&&o(),Object.assign({},t))))}();
