(self.webpackChunkdrs_data=self.webpackChunkdrs_data||[]).push([[117],{2378:(e,t,n)=>{"use strict";n.d(t,{Z:()=>a});var r=n(7294);const a=function({domain:e}){const[t,n]=(0,r.useState)(void 0);return r.createElement("img",{style:{display:t?"none":"inline-block",boxShadow:"1px 1px 4px 0px rgba(0,0,0,0.33)"},onError:function(){n(!0)},src:`https://logo.clearbit.com/${e}?s=48`})}},9117:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>f});var r=n(7294),a=n(9250),l=n(6054),o=n(6447),i=n(6089),s=n(2658),c=n(1508),d=n(7304),u=n(4721),m=n(1079),h=n(2378);const b=e=>{const{label:t,info:n,children:a}=e;return r.createElement(o.Z,{direction:"row",spacing:4},r.createElement(c.Z,{sx:{width:"12em"}},r.createElement(s.Z,{align:"right",sx:{fontWeight:"bold"}},n&&r.createElement(d.Z,{title:n},r.createElement(u.Z,{fontSize:"small",color:"primary",sx:{verticalAlign:"middle",marginRight:1}})),t)),r.createElement(c.Z,null,a))},f=e=>{const t=(0,a.s0)(),{brokerId:c}=(0,a.UO)("brokerId"),{locale:d="en"}=(0,a.UO)("locale"),[u,f]=(0,r.useState)((()=>()=>"..."));(0,l.Z)((function*(e){let t;try{t=(yield n(378)(`./locale-${d}.js`)).default}catch(e){console.error(`Failed to load requested locale ${d}`),t=(yield n.e(431).then(n.bind(n,4431))).default}f((()=>t))}),[d]);const[E,g]=(0,r.useState)();return(0,l.Z)((function*(e){if(!c.match(/^[-a-zA-Z0-9]+$/))return t("/");const n=yield fetch(`/brokers/detail/${c}.json`,function(e){const t=new AbortController;return e((()=>t.abort())),t}(e)),r=yield n.json();g(r)}),[c]),E?r.createElement(i.Z,null,r.createElement(o.Z,{direction:"column",spacing:4,marginTop:4,className:"page"},r.createElement(s.Z,{size:"small"},r.createElement(m.Z,{href:`/${d}/search`},u`Index`),"  >"),r.createElement(s.Z,{variant:"h2",component:"h1"},E.name),r.createElement(b,null,r.createElement(h.Z,{domain:(E.website.match(/https?:\/\/([^\/:#?]+)/)||[])[1]})),E.languages&&r.createElement(b,{label:u`Languages Spoken`},r.createElement(s.Z,null,E.languages)),void 0!==E.drsAvailable&&r.createElement(b,{label:u`DRS available`,info:u`Whether the broker allows you to initiate a DRS transfer directly. (Keep in mind, you can still DRS indirectly if not)`},r.createElement(s.Z,null,E.drsAvailable?u`Yes`:u`No`)),E.drsFee&&r.createElement(b,{label:u`DRS Fee`,info:u`Amount charged by the broker to initiate the DRS fee.`},r.createElement(s.Z,null,E.drsFee)),E.drsDuration&&r.createElement(b,{label:u`DRS duration (d)`,info:u`Typical timeframe, in business days, for this broker to process your DRS request. This is based on information volunteered by customers, and may change without warning.`},r.createElement(s.Z,null,E.drsDuration)))):"..."}},378:(e,t,n)=>{var r={"./locale-en.js":[4431,431]};function a(e){if(!n.o(r,e))return Promise.resolve().then((()=>{var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=r[e],a=t[0];return n.e(t[1]).then((()=>n(a)))}a.keys=()=>Object.keys(r),a.id=378,e.exports=a}}]);
//# sourceMappingURL=117-58fa2d2e.chunk.js.map