(self.webpackChunkdrs_data=self.webpackChunkdrs_data||[]).push([[220],{2378:(e,t,n)=>{"use strict";n.d(t,{Z:()=>r});var a=n(7294);const r=function({domain:e}){const[t,n]=(0,a.useState)(void 0);return a.createElement("img",{style:{display:t?"none":"inline-block",boxShadow:"1px 1px 4px 0px rgba(0,0,0,0.33)"},onError:function(){n(!0)},src:`https://logo.clearbit.com/${e}?s=48`})}},1220:(e,t,n)=>{"use strict";n.r(t),n.d(t,{default:()=>b});var a=n(7294),r=n(9250),s=n(4697),l=n(6054),i=n(4551),o=n(6447),c=n(6089),m=n(2116),u=n(5306),d=n(2658),g=n(1079),f=n(5295),p=n(9161),E=n(2643),Z=n(2378);const h={display:"-webkit-box",boxOrient:"vertical",lineClamp:2,overflow:"hidden",textOverflow:"ellipsis",fontSize:"16pt",flexGrow:1},y=12;function w(e){const t=new AbortController;return e((()=>t.abort())),t}const b=e=>{const{locale:t="en"}=(0,r.UO)("locale"),[b,x]=(0,a.useState)((()=>()=>"..."));(0,l.Z)((function*(e){let a;try{a=(yield n(2094)(`./locale-${t}.js`)).default}catch(e){console.error(`Failed to load requested locale ${t}`),a=(yield n.e(863).then(n.bind(n,3863))).default}x((()=>a))}),[t]);const[v,k]=(0,a.useState)(""),[C,j]=(0,a.useState)(),[S,L]=(0,a.useState)(),[I,O]=(0,a.useState)(),[$,N]=(0,a.useState)({page:0}),[q,R]=(0,a.useState)({page:0}),[A]=(0,s.Nr)(v,250),[U,M]=(0,a.useState)([]),[z,P]=(0,a.useState)([]),[T,W]=(0,a.useState)([]),[_,B]=(0,a.useState)([]),[D,F]=(0,a.useState)([]);return(0,a.useEffect)((function(){k(new URLSearchParams(document.location.search).get("q")||"")}),[]),(0,l.Z)((function*(e){const t=yield fetch("/issuers.json",w(e)),n=yield t.json();j(n)}),[]),(0,l.Z)((function*(e){const t=yield fetch("/brokers.json",w(e)),n=yield t.json();L(n)}),[]),(0,l.Z)((function*(e){const t=yield fetch("/transfer-agents.json",w(e)),n=yield t.json();O(n)}),[]),(0,a.useEffect)((function(){if(!C)return;const e=A.trim().toLowerCase(),t=""===e?Object.keys(C):Object.values(C).filter((t=>t.name.toLowerCase().includes(e)||t.ticker.toLowerCase().includes(e))).map((e=>e.id));M(t);const n=Math.ceil(t.length/y);N({page:0,pages:n})}),[A,C]),(0,a.useEffect)((function(){if(!S)return;const e=A.trim().toLowerCase(),t=""===e?Object.keys(S):Object.values(S).filter((t=>t.name.toLowerCase().includes(e))).map((e=>e.id));P(t);const n=Math.ceil(t.length/y);R({page:0,pages:n})}),[A,S]),(0,a.useEffect)((function(){if(!I)return;const e=A.trim().toLowerCase(),t=""===e?Object.keys(I):Object.values(I).filter((t=>t.name.toLowerCase().includes(e)||t.shortName.toLowerCase().includes(e))).map((e=>e.id));W(t)}),[A,I]),(0,a.useEffect)((function(){history.replaceState(null,"",`#q=${encodeURIComponent(v)}`)}),[A]),(0,a.useEffect)((function(){const e=U.slice($.page*y,($.page+1)*y);B(e)}),[U,$]),(0,a.useEffect)((function(){const e=z.slice(q.page*y,(q.page+1)*y);F(e)}),[z,q]),a.createElement(c.Z,null,a.createElement(o.Z,{direction:"column",spacing:4,className:"page"},a.createElement(d.Z,{style:{textAlign:"center"}}," ",b`This is a compilation of reference data on select brokers, issuers and transfer agents dealing with US securities.`),a.createElement(u.Z,{id:"query-input-field",label:b`Query`,placeholder:b`Search Issuers, Transfer Agents, and Brokers`,style:{width:"100%",minWidth:"20em"},value:v,onChange:function(e){k(e.target.value)}}),a.createElement(d.Z,{variant:"h4"},b`Brokers`),S?z.length?a.createElement(o.Z,{direction:"column",spacing:4},a.createElement(o.Z,{direction:"row",justifyContent:"flex-start",alignItems:"flex-start",spacing:0,sx:{flexWrap:"wrap",gap:1}},D.map((e=>{const n=S[e];return a.createElement(f.Z,{sx:{width:320,marginLeft:2,marginRight:2},key:n.id},a.createElement(E.Z,null,a.createElement(o.Z,{direction:"row",alignItems:"center",spacing:1},a.createElement(Z.Z,{domain:n.domain}),a.createElement(d.Z,{component:"div",style:h},n.name))),a.createElement(p.Z,null,a.createElement(g.Z,{href:`/${t}/brokers/${n.id}`,underline:"hover"},a.createElement(i.Z,{size:"small"},b`More details`))))}))),q.pages>1&&a.createElement(o.Z,{direction:"row",alignItems:"center",justifyContent:"center",divider:a.createElement(m.Z,{orientation:"vertical",flexItem:!0})},a.createElement(i.Z,{onClick:function(){const{page:e,pages:t}=q;e>0&&R({page:e-1,pages:t})},disabled:q.page<=0},"◀"),a.createElement(d.Z,{sx:{marginLeft:3,marginRight:3}},b`Page ${q.page+1} of ${q.pages}`),a.createElement(i.Z,{onClick:function(){const{page:e,pages:t}=q;e<t-1&&R({page:e+1,pages:t})},disabled:q.page>=q.pages-1},"▶"))):a.createElement(d.Z,null,b`No brokers match your query.`):a.createElement(d.Z,null,b`Loading...`),a.createElement(d.Z,{variant:"h4"},b`Issuers`),C?U.length?a.createElement(o.Z,{direction:"column",spacing:4},a.createElement(o.Z,{direction:"row",justifyContent:"flex-start",alignItems:"flex-start",spacing:0,sx:{flexWrap:"wrap",gap:1}},_.map((e=>{const n=C[e];return a.createElement(f.Z,{sx:{width:320,marginLeft:2,marginRight:2},key:n.id},a.createElement(E.Z,null,a.createElement(d.Z,{sx:{fontSize:14},color:"text.secondary",gutterBottom:!0},n.id),a.createElement(o.Z,{direction:"row",alignItems:"center",spacing:1},a.createElement(d.Z,{component:"div",style:h},n.name)),a.createElement(d.Z,{variant:"body2"},n.transferAgent)),n.detail&&a.createElement(p.Z,null,a.createElement(g.Z,{href:`/${t}/issuers/${n.id}`,underline:"hover"},a.createElement(i.Z,{size:"small"},b`More details`))))}))),$.pages>1&&a.createElement(o.Z,{direction:"row",alignItems:"center",justifyContent:"center",divider:a.createElement(m.Z,{orientation:"vertical",flexItem:!0})},a.createElement(i.Z,{onClick:function(){const{page:e,pages:t}=$;e>0&&N({page:e-1,pages:t})},disabled:$.page<=0},"◀"),a.createElement(d.Z,{sx:{marginLeft:3,marginRight:3}},b`Page ${$.page+1} of ${$.pages}`),a.createElement(i.Z,{onClick:function(){const{page:e,pages:t}=$;e<t-1&&N({page:e+1,pages:t})},disabled:$.page>=$.pages-1},"▶"))):a.createElement(d.Z,null,b`No issuers match your query. Note that we only publish information for a limited set of issuers.`):a.createElement(d.Z,null,b`Loading...`),a.createElement(d.Z,{variant:"h4"},b`Transfer Agents`),I?T.length?a.createElement(o.Z,{direction:"row",justifyContent:"flex-start",alignItems:"flex-start",spacing:0,sx:{flexWrap:"wrap",gap:1}},T.map((e=>{const t=I[e];return a.createElement(f.Z,{sx:{width:320,marginLeft:2,marginRight:2},key:t.id},a.createElement(E.Z,null,a.createElement(o.Z,{direction:"row",alignItems:"center",spacing:1},a.createElement(Z.Z,{domain:t.domain}),a.createElement(d.Z,{component:"div",style:h},t.shortName||t.name)),a.createElement(d.Z,{variant:"body2"},t.name)))}))):a.createElement(d.Z,null,b`No transfer agents match your query.`):a.createElement(d.Z,null,b`Loading...`),a.createElement(d.Z,{style:{textAlign:"center"}},a.createElement("a",{href:"https://clearbit.com"},b`Logos provided by Clearbit`))))}},2094:(e,t,n)=>{var a={"./locale-en.js":[3863,863],"./locale-es.js":[8305,305]};function r(e){if(!n.o(a,e))return Promise.resolve().then((()=>{var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}));var t=a[e],r=t[0];return n.e(t[1]).then((()=>n(r)))}r.keys=()=>Object.keys(a),r.id=2094,e.exports=r}}]);
//# sourceMappingURL=220-5abd3060.chunk.js.map