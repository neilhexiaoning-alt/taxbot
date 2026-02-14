import{f as ci,u as di,A as v,b as l,t as ye,l as tt,c as ui,s as gi,a as vi,d as Re,g as it,G as fi,j as pi,e as st,i as at,h as lt,E as hi,k as ae,m as I,n as ot,o as qe,p as Ge,q as mi,r as rt,v as We,w as Qe}from"./chunks/markdown-2HYSs03f.js";const ct=e=>(n,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(e,n)}):customElements.define(e,n)};const yi={attribute:!0,type:String,converter:di,reflect:!1,hasChanged:ci},bi=(e=yi,n,t)=>{const{kind:i,metadata:s}=t;let a=globalThis.litPropertyMetadata.get(s);if(a===void 0&&globalThis.litPropertyMetadata.set(s,a=new Map),i==="setter"&&((e=Object.create(e)).wrapped=!0),a.set(t.name,e),i==="accessor"){const{name:o}=t;return{set(r){const d=n.get.call(this);n.set.call(this,r),this.requestUpdate(o,d,e,!0,r)},init(r){return r!==void 0&&this.C(o,void 0,e,r),r}}}if(i==="setter"){const{name:o}=t;return function(r){const d=this[o];n.call(this,r),this.requestUpdate(o,d,e,!0,r)}}throw Error("Unsupported decorator location: "+i)};function we(e){return(n,t)=>typeof t=="object"?bi(e,n,t):((i,s,a)=>{const o=s.hasOwnProperty(a);return s.constructor.createProperty(a,i),o?Object.getOwnPropertyDescriptor(s,a):void 0})(e,n,t)}function m(e){return we({...e,state:!0,attribute:!1})}async function E(e,n){if(!(!e.client||!e.connected)&&!e.channelsLoading){e.channelsLoading=!0,e.channelsError=null;try{const t=await e.client.request("channels.status",{probe:n,timeoutMs:8e3});e.channelsSnapshot=t,e.channelsLastSuccess=Date.now()}catch(t){e.channelsError=String(t)}finally{e.channelsLoading=!1}}}async function $i(e,n){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const t=await e.client.request("web.login.start",{force:n,timeoutMs:3e4});e.whatsappLoginMessage=t.message??null,e.whatsappLoginQrDataUrl=t.qrDataUrl??null,e.whatsappLoginConnected=null}catch(t){e.whatsappLoginMessage=String(t),e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function wi(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{const n=await e.client.request("web.login.wait",{timeoutMs:12e4});e.whatsappLoginMessage=n.message??null,e.whatsappLoginConnected=n.connected??null,n.connected&&(e.whatsappLoginQrDataUrl=null)}catch(n){e.whatsappLoginMessage=String(n),e.whatsappLoginConnected=null}finally{e.whatsappBusy=!1}}}async function Si(e){if(!(!e.client||!e.connected||e.whatsappBusy)){e.whatsappBusy=!0;try{await e.client.request("channels.logout",{channel:"whatsapp"}),e.whatsappLoginMessage="Logged out.",e.whatsappLoginQrDataUrl=null,e.whatsappLoginConnected=null}catch(n){e.whatsappLoginMessage=String(n)}finally{e.whatsappBusy=!1}}}function G(e){return typeof structuredClone=="function"?structuredClone(e):JSON.parse(JSON.stringify(e))}function Q(e){return`${JSON.stringify(e,null,2).trimEnd()}
`}function dt(e,n,t){if(n.length===0)return;let i=e;for(let a=0;a<n.length-1;a+=1){const o=n[a],r=n[a+1];if(typeof o=="number"){if(!Array.isArray(i))return;i[o]==null&&(i[o]=typeof r=="number"?[]:{}),i=i[o]}else{if(typeof i!="object"||i==null)return;const d=i;d[o]==null&&(d[o]=typeof r=="number"?[]:{}),i=d[o]}}const s=n[n.length-1];if(typeof s=="number"){Array.isArray(i)&&(i[s]=t);return}typeof i=="object"&&i!=null&&(i[s]=t)}function ut(e,n){if(n.length===0)return;let t=e;for(let s=0;s<n.length-1;s+=1){const a=n[s];if(typeof a=="number"){if(!Array.isArray(t))return;t=t[a]}else{if(typeof t!="object"||t==null)return;t=t[a]}if(t==null)return}const i=n[n.length-1];if(typeof i=="number"){Array.isArray(t)&&t.splice(i,1);return}typeof t=="object"&&t!=null&&delete t[i]}async function R(e){if(!(!e.client||!e.connected)){e.configLoading=!0,e.lastError=null;try{const n=await e.client.request("config.get",{});ki(e,n)}catch(n){e.lastError=String(n)}finally{e.configLoading=!1}}}async function gt(e){if(!(!e.client||!e.connected)&&!e.configSchemaLoading){e.configSchemaLoading=!0;try{const n=await e.client.request("config.schema",{});xi(e,n)}catch(n){e.lastError=String(n)}finally{e.configSchemaLoading=!1}}}function xi(e,n){e.configSchema=n.schema??null,e.configUiHints=n.uiHints??{},e.configSchemaVersion=n.version??null}function ki(e,n){e.configSnapshot=n;const t=typeof n.raw=="string"?n.raw:n.config&&typeof n.config=="object"?Q(n.config):e.configRaw;!e.configFormDirty||e.configFormMode==="raw"?e.configRaw=t:e.configForm?e.configRaw=Q(e.configForm):e.configRaw=t,e.configValid=typeof n.valid=="boolean"?n.valid:null,e.configIssues=Array.isArray(n.issues)?n.issues:[],e.configFormDirty||(e.configForm=G(n.config??{}),e.configFormOriginal=G(n.config??{}),e.configRawOriginal=t)}async function he(e){if(!(!e.client||!e.connected)){e.configSaving=!0,e.lastError=null;try{const n=e.configFormMode==="form"&&e.configForm?Q(e.configForm):e.configRaw,t=e.configSnapshot?.hash;if(!t){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.set",{raw:n,baseHash:t}),e.configFormDirty=!1,await R(e)}catch(n){e.lastError=String(n)}finally{e.configSaving=!1}}}async function Ai(e){if(!(!e.client||!e.connected)){e.configApplying=!0,e.lastError=null;try{const n=e.configFormMode==="form"&&e.configForm?Q(e.configForm):e.configRaw,t=e.configSnapshot?.hash;if(!t){e.lastError="Config hash missing; reload and retry.";return}await e.client.request("config.apply",{raw:n,baseHash:t,sessionKey:e.applySessionKey}),e.configFormDirty=!1,await R(e)}catch(n){e.lastError=String(n)}finally{e.configApplying=!1}}}async function Ci(e){if(!(!e.client||!e.connected)){e.updateRunning=!0,e.lastError=null;try{await e.client.request("update.run",{sessionKey:e.applySessionKey})}catch(n){e.lastError=String(n)}finally{e.updateRunning=!1}}}function F(e,n,t){const i=G(e.configForm??e.configSnapshot?.config??{});dt(i,n,t),e.configForm=i,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Q(i))}function N(e,n){const t=G(e.configForm??e.configSnapshot?.config??{});ut(t,n),e.configForm=t,e.configFormDirty=!0,e.configFormMode==="form"&&(e.configRaw=Q(t))}function Li(e){const{values:n,original:t}=e;return n.name!==t.name||n.displayName!==t.displayName||n.about!==t.about||n.picture!==t.picture||n.banner!==t.banner||n.website!==t.website||n.nip05!==t.nip05||n.lud16!==t.lud16}function _i(e){const{state:n,callbacks:t,accountId:i}=e,s=Li(n),a=(r,d,f={})=>{const{type:y="text",placeholder:g,maxLength:c,help:u}=f,b=n.values[r]??"",$=n.fieldErrors[r],w=`nostr-profile-${r}`;return y==="textarea"?l`
        <div class="form-field" style="margin-bottom: 12px;">
          <label for="${w}" style="display: block; margin-bottom: 4px; font-weight: 500;">
            ${d}
          </label>
          <textarea
            id="${w}"
            .value=${b}
            placeholder=${g??""}
            maxlength=${c??2e3}
            rows="3"
            style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px; resize: vertical; font-family: inherit;"
            @input=${S=>{const x=S.target;t.onFieldChange(r,x.value)}}
            ?disabled=${n.saving}
          ></textarea>
          ${u?l`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${u}</div>`:v}
          ${$?l`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${$}</div>`:v}
        </div>
      `:l`
      <div class="form-field" style="margin-bottom: 12px;">
        <label for="${w}" style="display: block; margin-bottom: 4px; font-weight: 500;">
          ${d}
        </label>
        <input
          id="${w}"
          type=${y}
          .value=${b}
          placeholder=${g??""}
          maxlength=${c??256}
          style="width: 100%; padding: 8px; border: 1px solid var(--border-color); border-radius: 4px;"
          @input=${S=>{const x=S.target;t.onFieldChange(r,x.value)}}
          ?disabled=${n.saving}
        />
        ${u?l`<div style="font-size: 12px; color: var(--text-muted); margin-top: 2px;">${u}</div>`:v}
        ${$?l`<div style="font-size: 12px; color: var(--danger-color); margin-top: 2px;">${$}</div>`:v}
      </div>
    `},o=()=>{const r=n.values.picture;return r?l`
      <div style="margin-bottom: 12px;">
        <img
          src=${r}
          alt="Profile picture preview"
          style="max-width: 80px; max-height: 80px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
          @error=${d=>{const f=d.target;f.style.display="none"}}
          @load=${d=>{const f=d.target;f.style.display="block"}}
        />
      </div>
    `:v};return l`
    <div class="nostr-profile-form" style="padding: 16px; background: var(--bg-secondary); border-radius: 8px; margin-top: 12px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
        <div style="font-weight: 600; font-size: 16px;">Edit Profile</div>
        <div style="font-size: 12px; color: var(--text-muted);">Account: ${i}</div>
      </div>

      ${n.error?l`<div class="callout danger" style="margin-bottom: 12px;">${n.error}</div>`:v}

      ${n.success?l`<div class="callout success" style="margin-bottom: 12px;">${n.success}</div>`:v}

      ${o()}

      ${a("name","Username",{placeholder:"satoshi",maxLength:256,help:"Short username (e.g., satoshi)"})}

      ${a("displayName","Display Name",{placeholder:"Satoshi Nakamoto",maxLength:256,help:"Your full display name"})}

      ${a("about","Bio",{type:"textarea",placeholder:"Tell people about yourself...",maxLength:2e3,help:"A brief bio or description"})}

      ${a("picture","Avatar URL",{type:"url",placeholder:"https://example.com/avatar.jpg",help:"HTTPS URL to your profile picture"})}

      ${n.showAdvanced?l`
            <div style="border-top: 1px solid var(--border-color); padding-top: 12px; margin-top: 12px;">
              <div style="font-weight: 500; margin-bottom: 12px; color: var(--text-muted);">Advanced</div>

              ${a("banner","Banner URL",{type:"url",placeholder:"https://example.com/banner.jpg",help:"HTTPS URL to a banner image"})}

              ${a("website","Website",{type:"url",placeholder:"https://example.com",help:"Your personal website"})}

              ${a("nip05","NIP-05 Identifier",{placeholder:"you@example.com",help:"Verifiable identifier (e.g., you@domain.com)"})}

              ${a("lud16","Lightning Address",{placeholder:"you@getalby.com",help:"Lightning address for tips (LUD-16)"})}
            </div>
          `:v}

      <div style="display: flex; gap: 8px; margin-top: 16px; flex-wrap: wrap;">
        <button
          class="btn primary"
          @click=${t.onSave}
          ?disabled=${n.saving||!s}
        >
          ${n.saving?"Saving...":"Save & Publish"}
        </button>

        <button
          class="btn"
          @click=${t.onImport}
          ?disabled=${n.importing||n.saving}
        >
          ${n.importing?"Importing...":"Import from Relays"}
        </button>

        <button
          class="btn"
          @click=${t.onToggleAdvanced}
        >
          ${n.showAdvanced?"Hide Advanced":"Show Advanced"}
        </button>

        <button
          class="btn"
          @click=${t.onCancel}
          ?disabled=${n.saving}
        >
          Cancel
        </button>
      </div>

      ${s?l`
              <div style="font-size: 12px; color: var(--warning-color); margin-top: 8px">
                You have unsaved changes
              </div>
            `:v}
    </div>
  `}function Ii(e){const n={name:e?.name??"",displayName:e?.displayName??"",about:e?.about??"",picture:e?.picture??"",banner:e?.banner??"",website:e?.website??"",nip05:e?.nip05??"",lud16:e?.lud16??""};return{values:n,original:{...n},saving:!1,importing:!1,error:null,success:null,fieldErrors:{},showAdvanced:!!(e?.banner||e?.website||e?.nip05||e?.lud16)}}async function Mi(e,n){await $i(e,n),await E(e,!0)}async function Ei(e){await wi(e),await E(e,!0)}async function Fi(e){await Si(e),await E(e,!0)}async function Ti(e){await he(e),await R(e),await E(e,!0)}async function Ri(e){await R(e),await E(e,!0)}function Pi(e){if(!Array.isArray(e))return{};const n={};for(const t of e){if(typeof t!="string")continue;const[i,...s]=t.split(":");if(!i||s.length===0)continue;const a=i.trim(),o=s.join(":").trim();a&&o&&(n[a]=o)}return n}function vt(e){return(e.channelsSnapshot?.channelAccounts?.nostr??[])[0]?.accountId??e.nostrProfileAccountId??"default"}function ft(e,n=""){return`/api/channels/nostr/${encodeURIComponent(e)}/profile${n}`}function Bi(e,n,t){e.nostrProfileAccountId=n,e.nostrProfileFormState=Ii(t??void 0)}function Ni(e){e.nostrProfileFormState=null,e.nostrProfileAccountId=null}function Di(e,n,t){const i=e.nostrProfileFormState;i&&(e.nostrProfileFormState={...i,values:{...i.values,[n]:t},fieldErrors:{...i.fieldErrors,[n]:""}})}function Ki(e){const n=e.nostrProfileFormState;n&&(e.nostrProfileFormState={...n,showAdvanced:!n.showAdvanced})}async function Oi(e){const n=e.nostrProfileFormState;if(!n||n.saving)return;const t=vt(e);e.nostrProfileFormState={...n,saving:!0,error:null,success:null,fieldErrors:{}};try{const i=await fetch(ft(t),{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(n.values)}),s=await i.json().catch(()=>null);if(!i.ok||s?.ok===!1||!s){const a=s?.error??`Profile update failed (${i.status})`;e.nostrProfileFormState={...n,saving:!1,error:a,success:null,fieldErrors:Pi(s?.details)};return}if(!s.persisted){e.nostrProfileFormState={...n,saving:!1,error:"Profile publish failed on all relays.",success:null};return}e.nostrProfileFormState={...n,saving:!1,error:null,success:"Profile published to relays.",fieldErrors:{},original:{...n.values}},await E(e,!0)}catch(i){e.nostrProfileFormState={...n,saving:!1,error:`Profile update failed: ${String(i)}`,success:null}}}async function Ui(e){const n=e.nostrProfileFormState;if(!n||n.importing)return;const t=vt(e);e.nostrProfileFormState={...n,importing:!0,error:null,success:null};try{const i=await fetch(ft(t,"/import"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({autoMerge:!0})}),s=await i.json().catch(()=>null);if(!i.ok||s?.ok===!1||!s){const d=s?.error??`Profile import failed (${i.status})`;e.nostrProfileFormState={...n,importing:!1,error:d,success:null};return}const a=s.merged??s.imported??null,o=a?{...n.values,...a}:n.values,r=!!(o.banner||o.website||o.nip05||o.lud16);e.nostrProfileFormState={...n,importing:!1,values:o,error:null,success:s.saved?"Profile imported from relays. Review and publish.":"Profile imported. Review and publish.",showAdvanced:r},s.saved&&await E(e,!0)}catch(i){e.nostrProfileFormState={...n,importing:!1,error:`Profile import failed: ${String(i)}`,success:null}}}function pt(e){const n=(e??"").trim();if(!n)return null;const t=n.split(":").filter(Boolean);if(t.length<3||t[0]!=="agent")return null;const i=t[1]?.trim(),s=t.slice(2).join(":");return!i||!s?null:{agentId:i,rest:s}}const Je=450;function re(e,n=!1){e.chatScrollFrame&&cancelAnimationFrame(e.chatScrollFrame),e.chatScrollTimeout!=null&&(clearTimeout(e.chatScrollTimeout),e.chatScrollTimeout=null);const t=()=>{const i=e.querySelector(".chat-thread");if(i){const s=getComputedStyle(i).overflowY;if(s==="auto"||s==="scroll"||i.scrollHeight-i.clientHeight>1)return i}return document.scrollingElement??document.documentElement};e.updateComplete.then(()=>{e.chatScrollFrame=requestAnimationFrame(()=>{e.chatScrollFrame=null;const i=t();if(!i)return;const s=i.scrollHeight-i.scrollTop-i.clientHeight,a=n&&!e.chatHasAutoScrolled;if(!(a||e.chatUserNearBottom||s<Je)){e.chatNewMessagesBelow=!0;return}a&&(e.chatHasAutoScrolled=!0),i.scrollTop=i.scrollHeight,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1;const r=a?150:120;e.chatScrollTimeout=window.setTimeout(()=>{e.chatScrollTimeout=null;const d=t();if(!d)return;const f=d.scrollHeight-d.scrollTop-d.clientHeight;(a||e.chatUserNearBottom||f<Je)&&(d.scrollTop=d.scrollHeight,e.chatUserNearBottom=!0)},r)})})}function ht(e,n=!1){e.logsScrollFrame&&cancelAnimationFrame(e.logsScrollFrame),e.updateComplete.then(()=>{e.logsScrollFrame=requestAnimationFrame(()=>{e.logsScrollFrame=null;const t=e.querySelector(".log-stream");if(!t)return;const i=t.scrollHeight-t.scrollTop-t.clientHeight;(n||i<80)&&(t.scrollTop=t.scrollHeight)})})}function ji(e,n){const t=n.currentTarget;if(!t)return;const i=t.scrollHeight-t.scrollTop-t.clientHeight;e.chatUserNearBottom=i<Je,e.chatUserNearBottom&&(e.chatNewMessagesBelow=!1)}function Hi(e,n){const t=n.currentTarget;if(!t)return;const i=t.scrollHeight-t.scrollTop-t.clientHeight;e.logsAtBottom=i<80}function kn(e){e.chatHasAutoScrolled=!1,e.chatUserNearBottom=!0,e.chatNewMessagesBelow=!1}function zi(e,n){if(e.length===0)return;const t=new Blob([`${e.join(`
`)}
`],{type:"text/plain"}),i=URL.createObjectURL(t),s=document.createElement("a"),a=new Date().toISOString().slice(0,19).replace(/[:T]/g,"-");s.href=i,s.download=`openclaw-logs-${n}-${a}.log`,s.click(),URL.revokeObjectURL(i)}function Vi(e){if(typeof ResizeObserver>"u")return;const n=e.querySelector(".topbar");if(!n)return;const t=()=>{const{height:i}=n.getBoundingClientRect();e.style.setProperty("--topbar-height",`${i}px`)};t(),e.topbarObserver=new ResizeObserver(()=>t()),e.topbarObserver.observe(n)}async function Se(e){if(!(!e.client||!e.connected)&&!e.debugLoading){e.debugLoading=!0;try{const[n,t,i,s]=await Promise.all([e.client.request("status",{}),e.client.request("health",{}),e.client.request("models.list",{}),e.client.request("last-heartbeat",{})]);e.debugStatus=n,e.debugHealth=t;const a=i;e.debugModels=Array.isArray(a?.models)?a?.models:[],e.debugHeartbeat=s}catch(n){e.debugCallError=String(n)}finally{e.debugLoading=!1}}}async function qi(e){if(!(!e.client||!e.connected)){e.debugCallError=null,e.debugCallResult=null;try{const n=e.debugCallParams.trim()?JSON.parse(e.debugCallParams):{},t=await e.client.request(e.debugCallMethod.trim(),n);e.debugCallResult=JSON.stringify(t,null,2)}catch(n){e.debugCallError=String(n)}}}const Gi=2e3,Wi=new Set(["trace","debug","info","warn","error","fatal"]);function Qi(e){if(typeof e!="string")return null;const n=e.trim();if(!n.startsWith("{")||!n.endsWith("}"))return null;try{const t=JSON.parse(n);return!t||typeof t!="object"?null:t}catch{return null}}function Ji(e){if(typeof e!="string")return null;const n=e.toLowerCase();return Wi.has(n)?n:null}function Yi(e){if(!e.trim())return{raw:e,message:e};try{const n=JSON.parse(e),t=n&&typeof n._meta=="object"&&n._meta!==null?n._meta:null,i=typeof n.time=="string"?n.time:typeof t?.date=="string"?t?.date:null,s=Ji(t?.logLevelName??t?.level),a=typeof n[0]=="string"?n[0]:typeof t?.name=="string"?t?.name:null,o=Qi(a);let r=null;o&&(typeof o.subsystem=="string"?r=o.subsystem:typeof o.module=="string"&&(r=o.module)),!r&&a&&a.length<120&&(r=a);let d=null;return typeof n[1]=="string"?d=n[1]:!o&&typeof n[0]=="string"?d=n[0]:typeof n.message=="string"&&(d=n.message),{raw:e,time:i,level:s,subsystem:r,message:d??e,meta:t??void 0}}catch{return{raw:e,message:e}}}async function ln(e,n){if(!(!e.client||!e.connected)&&!(e.logsLoading&&!n?.quiet)){n?.quiet||(e.logsLoading=!0),e.logsError=null;try{const i=await e.client.request("logs.tail",{cursor:n?.reset?void 0:e.logsCursor??void 0,limit:e.logsLimit,maxBytes:e.logsMaxBytes}),a=(Array.isArray(i.lines)?i.lines.filter(r=>typeof r=="string"):[]).map(Yi),o=!!(n?.reset||i.reset||e.logsCursor==null);e.logsEntries=o?a:[...e.logsEntries,...a].slice(-Gi),typeof i.cursor=="number"&&(e.logsCursor=i.cursor),typeof i.file=="string"&&(e.logsFile=i.file),e.logsTruncated=!!i.truncated,e.logsLastFetchAt=Date.now()}catch(t){e.logsError=String(t)}finally{n?.quiet||(e.logsLoading=!1)}}}async function xe(e,n){if(!(!e.client||!e.connected)&&!e.nodesLoading){e.nodesLoading=!0,n?.quiet||(e.lastError=null);try{const t=await e.client.request("node.list",{});e.nodes=Array.isArray(t.nodes)?t.nodes:[]}catch(t){n?.quiet||(e.lastError=String(t))}finally{e.nodesLoading=!1}}}function Xi(e){e.nodesPollInterval==null&&(e.nodesPollInterval=window.setInterval(()=>{xe(e,{quiet:!0})},5e3))}function Zi(e){e.nodesPollInterval!=null&&(clearInterval(e.nodesPollInterval),e.nodesPollInterval=null)}function on(e){e.logsPollInterval==null&&(e.logsPollInterval=window.setInterval(()=>{e.tab==="logs"&&ln(e,{quiet:!0})},2e3))}function rn(e){e.logsPollInterval!=null&&(clearInterval(e.logsPollInterval),e.logsPollInterval=null)}function cn(e){e.debugPollInterval==null&&(e.debugPollInterval=window.setInterval(()=>{e.tab==="debug"&&Se(e)},3e3))}function dn(e){e.debugPollInterval!=null&&(clearInterval(e.debugPollInterval),e.debugPollInterval=null)}async function mt(e,n){if(!(!e.client||!e.connected||e.agentIdentityLoading)&&!e.agentIdentityById[n]){e.agentIdentityLoading=!0,e.agentIdentityError=null;try{const t=await e.client.request("agent.identity.get",{agentId:n});t&&(e.agentIdentityById={...e.agentIdentityById,[n]:t})}catch(t){e.agentIdentityError=String(t)}finally{e.agentIdentityLoading=!1}}}async function yt(e,n){if(!e.client||!e.connected||e.agentIdentityLoading)return;const t=n.filter(i=>!e.agentIdentityById[i]);if(t.length!==0){e.agentIdentityLoading=!0,e.agentIdentityError=null;try{for(const i of t){const s=await e.client.request("agent.identity.get",{agentId:i});s&&(e.agentIdentityById={...e.agentIdentityById,[i]:s})}}catch(i){e.agentIdentityError=String(i)}finally{e.agentIdentityLoading=!1}}}async function me(e,n){if(!(!e.client||!e.connected)&&!e.agentSkillsLoading){e.agentSkillsLoading=!0,e.agentSkillsError=null;try{const t=await e.client.request("skills.status",{agentId:n});t&&(e.agentSkillsReport=t,e.agentSkillsAgentId=n)}catch(t){e.agentSkillsError=String(t)}finally{e.agentSkillsLoading=!1}}}async function un(e){if(!(!e.client||!e.connected)&&!e.agentsLoading){e.agentsLoading=!0,e.agentsError=null;try{const n=await e.client.request("agents.list",{});if(n){e.agentsList=n;const t=e.agentsSelectedId,i=n.agents.some(s=>s.id===t);(!t||!i)&&(e.agentsSelectedId=n.defaultId??n.agents[0]?.id??null)}}catch(n){e.agentsError=String(n)}finally{e.agentsLoading=!1}}}async function ce(e){if(!(!e.client||!e.connected))try{const n=await e.client.request("cron.status",{});e.cronStatus=n}catch(n){e.cronError=String(n)}}async function ke(e){if(!(!e.client||!e.connected)&&!e.cronLoading){e.cronLoading=!0,e.cronError=null;try{const n=await e.client.request("cron.list",{includeDisabled:!0});e.cronJobs=Array.isArray(n.jobs)?n.jobs:[]}catch(n){e.cronError=String(n)}finally{e.cronLoading=!1}}}function es(e){if(e.scheduleKind==="at"){const t=Date.parse(e.scheduleAt);if(!Number.isFinite(t))throw new Error("Invalid run time.");return{kind:"at",atMs:t}}if(e.scheduleKind==="every"){const t=ye(e.everyAmount,0);if(t<=0)throw new Error("Invalid interval amount.");const i=e.everyUnit;return{kind:"every",everyMs:t*(i==="minutes"?6e4:i==="hours"?36e5:864e5)}}const n=e.cronExpr.trim();if(!n)throw new Error("Cron expression required.");return{kind:"cron",expr:n,tz:e.cronTz.trim()||void 0}}function ns(e){if(e.payloadKind==="systemEvent"){const s=e.payloadText.trim();if(!s)throw new Error("System event text required.");return{kind:"systemEvent",text:s}}const n=e.payloadText.trim();if(!n)throw new Error("Agent message required.");const t={kind:"agentTurn",message:n};e.deliver&&(t.deliver=!0),e.channel&&(t.channel=e.channel),e.to.trim()&&(t.to=e.to.trim());const i=ye(e.timeoutSeconds,0);return i>0&&(t.timeoutSeconds=i),t}async function ts(e){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{const n=es(e.cronForm),t=ns(e.cronForm),i=e.cronForm.agentId.trim(),s={name:e.cronForm.name.trim(),description:e.cronForm.description.trim()||void 0,agentId:i||void 0,enabled:e.cronForm.enabled,schedule:n,sessionTarget:e.cronForm.sessionTarget,wakeMode:e.cronForm.wakeMode,payload:t,isolation:e.cronForm.postToMainPrefix.trim()&&e.cronForm.sessionTarget==="isolated"?{postToMainPrefix:e.cronForm.postToMainPrefix.trim()}:void 0};if(!s.name)throw new Error("Name required.");await e.client.request("cron.add",s),e.cronForm={...e.cronForm,name:"",description:"",payloadText:""},await ke(e),await ce(e)}catch(n){e.cronError=String(n)}finally{e.cronBusy=!1}}}async function is(e,n,t){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.update",{id:n.id,patch:{enabled:t}}),await ke(e),await ce(e)}catch(i){e.cronError=String(i)}finally{e.cronBusy=!1}}}async function ss(e,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.run",{id:n.id,mode:"force"}),await bt(e,n.id)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function as(e,n){if(!(!e.client||!e.connected||e.cronBusy)){e.cronBusy=!0,e.cronError=null;try{await e.client.request("cron.remove",{id:n.id}),e.cronRunsJobId===n.id&&(e.cronRunsJobId=null,e.cronRuns=[]),await ke(e),await ce(e)}catch(t){e.cronError=String(t)}finally{e.cronBusy=!1}}}async function bt(e,n){if(!(!e.client||!e.connected))try{const t=await e.client.request("cron.runs",{id:n,limit:50});e.cronRunsJobId=n,e.cronRuns=Array.isArray(t.entries)?t.entries:[]}catch(t){e.cronError=String(t)}}async function z(e,n){if(!(!e.client||!e.connected)&&!e.devicesLoading){e.devicesLoading=!0,n?.quiet||(e.devicesError=null);try{const t=await e.client.request("device.pair.list",{});e.devicesList={pending:Array.isArray(t?.pending)?t.pending:[],paired:Array.isArray(t?.paired)?t.paired:[]}}catch(t){n?.quiet||(e.devicesError=String(t))}finally{e.devicesLoading=!1}}}async function ls(e,n){if(!(!e.client||!e.connected))try{await e.client.request("device.pair.approve",{requestId:n}),await z(e)}catch(t){e.devicesError=String(t)}}async function os(e,n){if(!(!e.client||!e.connected||!window.confirm("Reject this device pairing request?")))try{await e.client.request("device.pair.reject",{requestId:n}),await z(e)}catch(i){e.devicesError=String(i)}}async function rs(e,n){if(!(!e.client||!e.connected))try{const t=await e.client.request("device.token.rotate",n);if(t?.token){const i=await tt(),s=t.role??n.role;(t.deviceId===i.deviceId||n.deviceId===i.deviceId)&&gi({deviceId:i.deviceId,role:s,token:t.token,scopes:t.scopes??n.scopes??[]}),window.prompt("New device token (copy and store securely):",t.token)}await z(e)}catch(t){e.devicesError=String(t)}}async function cs(e,n){if(!(!e.client||!e.connected||!window.confirm(`Revoke token for ${n.deviceId} (${n.role})?`)))try{await e.client.request("device.token.revoke",n);const i=await tt();n.deviceId===i.deviceId&&ui({deviceId:i.deviceId,role:n.role}),await z(e)}catch(i){e.devicesError=String(i)}}function ds(e){if(!e||e.kind==="gateway")return{method:"exec.approvals.get",params:{}};const n=e.nodeId.trim();return n?{method:"exec.approvals.node.get",params:{nodeId:n}}:null}function us(e,n){if(!e||e.kind==="gateway")return{method:"exec.approvals.set",params:n};const t=e.nodeId.trim();return t?{method:"exec.approvals.node.set",params:{...n,nodeId:t}}:null}async function gn(e,n){if(!(!e.client||!e.connected)&&!e.execApprovalsLoading){e.execApprovalsLoading=!0,e.lastError=null;try{const t=ds(n);if(!t){e.lastError="Select a node before loading exec approvals.";return}const i=await e.client.request(t.method,t.params);gs(e,i)}catch(t){e.lastError=String(t)}finally{e.execApprovalsLoading=!1}}}function gs(e,n){e.execApprovalsSnapshot=n,e.execApprovalsDirty||(e.execApprovalsForm=G(n.file??{}))}async function vs(e,n){if(!(!e.client||!e.connected)){e.execApprovalsSaving=!0,e.lastError=null;try{const t=e.execApprovalsSnapshot?.hash;if(!t){e.lastError="Exec approvals hash missing; reload and retry.";return}const i=e.execApprovalsForm??e.execApprovalsSnapshot?.file??{},s=us(n,{file:i,baseHash:t});if(!s){e.lastError="Select a node before saving exec approvals.";return}await e.client.request(s.method,s.params),e.execApprovalsDirty=!1,await gn(e,n)}catch(t){e.lastError=String(t)}finally{e.execApprovalsSaving=!1}}}function fs(e,n,t){const i=G(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});dt(i,n,t),e.execApprovalsForm=i,e.execApprovalsDirty=!0}function ps(e,n){const t=G(e.execApprovalsForm??e.execApprovalsSnapshot?.file??{});ut(t,n),e.execApprovalsForm=t,e.execApprovalsDirty=!0}async function vn(e){if(!(!e.client||!e.connected)&&!e.presenceLoading){e.presenceLoading=!0,e.presenceError=null,e.presenceStatus=null;try{const n=await e.client.request("system-presence",{});Array.isArray(n)?(e.presenceEntries=n,e.presenceStatus=n.length===0?"No instances yet.":null):(e.presenceEntries=[],e.presenceStatus="No presence payload.")}catch(n){e.presenceError=String(n)}finally{e.presenceLoading=!1}}}async function W(e,n){if(!(!e.client||!e.connected)&&!e.sessionsLoading){e.sessionsLoading=!0,e.sessionsError=null;try{const t=n?.includeGlobal??e.sessionsIncludeGlobal,i=n?.includeUnknown??e.sessionsIncludeUnknown,s=n?.activeMinutes??ye(e.sessionsFilterActive,0),a=n?.limit??ye(e.sessionsFilterLimit,0),o={includeGlobal:t,includeUnknown:i};s>0&&(o.activeMinutes=s),a>0&&(o.limit=a);const r=await e.client.request("sessions.list",o);r&&(e.sessionsResult=r)}catch(t){e.sessionsError=String(t)}finally{e.sessionsLoading=!1}}}async function hs(e,n,t){if(!e.client||!e.connected)return;const i={key:n};"label"in t&&(i.label=t.label),"thinkingLevel"in t&&(i.thinkingLevel=t.thinkingLevel),"verboseLevel"in t&&(i.verboseLevel=t.verboseLevel),"reasoningLevel"in t&&(i.reasoningLevel=t.reasoningLevel);try{await e.client.request("sessions.patch",i),await W(e)}catch(s){e.sessionsError=String(s)}}async function ms(e,n){if(!(!e.client||!e.connected||e.sessionsLoading||!window.confirm(`Delete session "${n}"?

Deletes the session entry and archives its transcript.`))){e.sessionsLoading=!0,e.sessionsError=null;try{await e.client.request("sessions.delete",{key:n,deleteTranscript:!0}),await W(e)}catch(i){e.sessionsError=String(i)}finally{e.sessionsLoading=!1}}}function J(e,n,t){if(!n.trim())return;const i={...e.skillMessages};t?i[n]=t:delete i[n],e.skillMessages=i}function Ae(e){return e instanceof Error?e.message:String(e)}async function de(e,n){if(n?.clearMessages&&Object.keys(e.skillMessages).length>0&&(e.skillMessages={}),!(!e.client||!e.connected)&&!e.skillsLoading){e.skillsLoading=!0,e.skillsError=null;try{const t=await e.client.request("skills.status",{});t&&(e.skillsReport=t)}catch(t){e.skillsError=Ae(t)}finally{e.skillsLoading=!1}}}function ys(e,n,t){e.skillEdits={...e.skillEdits,[n]:t}}async function bs(e,n,t){if(!(!e.client||!e.connected)){e.skillsBusyKey=n,e.skillsError=null;try{await e.client.request("skills.update",{skillKey:n,enabled:t}),await de(e),J(e,n,{kind:"success",message:t?"Skill enabled":"Skill disabled"})}catch(i){const s=Ae(i);e.skillsError=s,J(e,n,{kind:"error",message:s})}finally{e.skillsBusyKey=null}}}async function $s(e,n){if(!(!e.client||!e.connected)){e.skillsBusyKey=n,e.skillsError=null;try{const t=e.skillEdits[n]??"";await e.client.request("skills.update",{skillKey:n,apiKey:t}),await de(e),J(e,n,{kind:"success",message:"API key saved"})}catch(t){const i=Ae(t);e.skillsError=i,J(e,n,{kind:"error",message:i})}finally{e.skillsBusyKey=null}}}async function ws(e,n,t,i){if(!(!e.client||!e.connected)){e.skillsBusyKey=n,e.skillsError=null;try{const s=await e.client.request("skills.install",{name:t,installId:i,timeoutMs:12e4});await de(e),J(e,n,{kind:"success",message:s?.message??"Installed"})}catch(s){const a=Ae(s);e.skillsError=a,J(e,n,{kind:"error",message:a})}finally{e.skillsBusyKey=null}}}const Ss=[{label:"Chat",tabs:["chat"]},{label:"Control",tabs:["overview","channels","instances","sessions","cron"]},{label:"Agent",tabs:["agents","skills","nodes"]},{label:"Settings",tabs:["config","debug","logs"]}],$t={agents:"/agents",overview:"/overview",channels:"/channels",instances:"/instances",sessions:"/sessions",cron:"/cron",skills:"/skills",nodes:"/nodes",chat:"/chat",taxchat:"/taxchat",config:"/config",debug:"/debug",logs:"/logs"},wt=new Map(Object.entries($t).map(([e,n])=>[n,e]));function Ce(e){if(!e)return"";let n=e.trim();return n.startsWith("/")||(n=`/${n}`),n==="/"?"":(n.endsWith("/")&&(n=n.slice(0,-1)),n)}function le(e){if(!e)return"/";let n=e.trim();return n.startsWith("/")||(n=`/${n}`),n.length>1&&n.endsWith("/")&&(n=n.slice(0,-1)),n}function fn(e,n=""){const t=Ce(n),i=$t[e];return t?`${t}${i}`:i}function St(e,n=""){const t=Ce(n);let i=e||"/";t&&(i===t?i="/":i.startsWith(`${t}/`)&&(i=i.slice(t.length)));let s=le(i).toLowerCase();return s.endsWith("/index.html")&&(s="/"),s==="/"?"chat":wt.get(s)??null}function xs(e){let n=le(e);if(n.endsWith("/index.html")&&(n=le(n.slice(0,-11))),n==="/")return"";const t=n.split("/").filter(Boolean);if(t.length===0)return"";for(let i=0;i<t.length;i++){const s=`/${t.slice(i).join("/")}`.toLowerCase();if(wt.has(s)){const a=t.slice(0,i);return a.length?`/${a.join("/")}`:""}}return`/${t.join("/")}`}function ks(e){switch(e){case"agents":return"folder";case"chat":return"messageSquare";case"taxchat":return"messageSquare";case"overview":return"barChart";case"channels":return"link";case"instances":return"radio";case"sessions":return"fileText";case"cron":return"loader";case"skills":return"zap";case"nodes":return"monitor";case"config":return"settings";case"debug":return"bug";case"logs":return"scrollText";default:return"folder"}}function Ye(e){switch(e){case"agents":return"Agents";case"overview":return"Overview";case"taxchat":return"TaxChat";case"channels":return"Channels";case"instances":return"Instances";case"sessions":return"Sessions";case"cron":return"Cron Jobs";case"skills":return"Skills";case"nodes":return"Nodes";case"chat":return"Chat";case"config":return"Config";case"debug":return"Debug";case"logs":return"Logs";default:return"Control"}}function As(e){switch(e){case"agents":return"Manage agent workspaces, tools, and identities.";case"overview":return"Gateway status, entry points, and a fast health read.";case"taxchat":return"Simplified tax chat interface with session history.";case"channels":return"Manage channels and settings.";case"instances":return"Presence beacons from connected clients and nodes.";case"sessions":return"Inspect active sessions and adjust per-session defaults.";case"cron":return"Schedule wakeups and recurring agent runs.";case"skills":return"Manage skill availability and API key injection.";case"nodes":return"Paired devices, capabilities, and command exposure.";case"chat":return"Direct gateway chat session for quick interventions.";case"config":return"Edit ~/.openclaw/openclaw.json safely.";case"debug":return"Gateway snapshots, events, and manual RPC calls.";case"logs":return"Live tail of the gateway file logs.";default:return""}}const xt="openclaw.control.settings.v1";function Cs(){const n={gatewayUrl:`${location.protocol==="https:"?"wss":"ws"}://${location.host}`,token:"",sessionKey:"main",lastActiveSessionKey:"main",theme:"system",chatFocusMode:!1,chatShowThinking:!0,splitRatio:.6,navCollapsed:!1,navGroupsCollapsed:{}};try{const t=localStorage.getItem(xt);if(!t)return n;const i=JSON.parse(t);return{gatewayUrl:typeof i.gatewayUrl=="string"&&i.gatewayUrl.trim()?i.gatewayUrl.trim():n.gatewayUrl,token:typeof i.token=="string"?i.token:n.token,sessionKey:typeof i.sessionKey=="string"&&i.sessionKey.trim()?i.sessionKey.trim():n.sessionKey,lastActiveSessionKey:typeof i.lastActiveSessionKey=="string"&&i.lastActiveSessionKey.trim()?i.lastActiveSessionKey.trim():typeof i.sessionKey=="string"&&i.sessionKey.trim()||n.lastActiveSessionKey,theme:i.theme==="light"||i.theme==="dark"||i.theme==="system"?i.theme:n.theme,chatFocusMode:typeof i.chatFocusMode=="boolean"?i.chatFocusMode:n.chatFocusMode,chatShowThinking:typeof i.chatShowThinking=="boolean"?i.chatShowThinking:n.chatShowThinking,splitRatio:typeof i.splitRatio=="number"&&i.splitRatio>=.4&&i.splitRatio<=.7?i.splitRatio:n.splitRatio,navCollapsed:typeof i.navCollapsed=="boolean"?i.navCollapsed:n.navCollapsed,navGroupsCollapsed:typeof i.navGroupsCollapsed=="object"&&i.navGroupsCollapsed!==null?i.navGroupsCollapsed:n.navGroupsCollapsed}}catch{return n}}function Ls(e){localStorage.setItem(xt,JSON.stringify(e))}function _s(){return typeof window>"u"||typeof window.matchMedia!="function"||window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}function pn(e){return e==="system"?_s():e}const ge=e=>Number.isNaN(e)?.5:e<=0?0:e>=1?1:e,Is=()=>typeof window>"u"||typeof window.matchMedia!="function"?!1:window.matchMedia("(prefers-reduced-motion: reduce)").matches??!1,ve=e=>{e.classList.remove("theme-transition"),e.style.removeProperty("--theme-switch-x"),e.style.removeProperty("--theme-switch-y")},Ms=({nextTheme:e,applyTheme:n,context:t,currentTheme:i})=>{if(i===e)return;const s=globalThis.document??null;if(!s){n();return}const a=s.documentElement,o=s,r=Is();if(!!o.startViewTransition&&!r){let f=.5,y=.5;if(t?.pointerClientX!==void 0&&t?.pointerClientY!==void 0&&typeof window<"u")f=ge(t.pointerClientX/window.innerWidth),y=ge(t.pointerClientY/window.innerHeight);else if(t?.element){const g=t.element.getBoundingClientRect();g.width>0&&g.height>0&&typeof window<"u"&&(f=ge((g.left+g.width/2)/window.innerWidth),y=ge((g.top+g.height/2)/window.innerHeight))}a.style.setProperty("--theme-switch-x",`${f*100}%`),a.style.setProperty("--theme-switch-y",`${y*100}%`),a.classList.add("theme-transition");try{const g=o.startViewTransition?.(()=>{n()});g?.finished?g.finished.finally(()=>ve(a)):ve(a)}catch{ve(a),n()}return}n(),ve(a)};function H(e,n){const t={...n,lastActiveSessionKey:n.lastActiveSessionKey?.trim()||n.sessionKey.trim()||"main"};e.settings=t,Ls(t),n.theme!==e.theme&&(e.theme=n.theme,Le(e,pn(n.theme))),e.applySessionKey=e.settings.lastActiveSessionKey}function kt(e,n){const t=n.trim();t&&e.settings.lastActiveSessionKey!==t&&H(e,{...e.settings,lastActiveSessionKey:t})}function Es(e){if(!window.location.search)return;const n=new URLSearchParams(window.location.search),t=n.get("token"),i=n.get("password"),s=n.get("session"),a=n.get("gatewayUrl");let o=!1;if(t!=null){const d=t.trim();d&&d!==e.settings.token&&H(e,{...e.settings,token:d}),n.delete("token"),o=!0}if(i!=null){const d=i.trim();d&&(e.password=d),n.delete("password"),o=!0}if(s!=null){const d=s.trim();d&&(e.sessionKey=d,H(e,{...e.settings,sessionKey:d,lastActiveSessionKey:d}))}if(a!=null){const d=a.trim();d&&d!==e.settings.gatewayUrl&&(e.pendingGatewayUrl=d),n.delete("gatewayUrl"),o=!0}if(!o)return;const r=new URL(window.location.href);r.search=n.toString(),window.history.replaceState({},"",r.toString())}function Fs(e,n){e.tab!==n&&(e.tab=n),n==="chat"&&(e.chatHasAutoScrolled=!1),n==="logs"?on(e):rn(e),n==="debug"?cn(e):dn(e),hn(e),Ct(e,n,!1)}function Ts(e,n,t){Ms({nextTheme:n,applyTheme:()=>{e.theme=n,H(e,{...e.settings,theme:n}),Le(e,pn(n))},context:t,currentTheme:e.theme})}async function hn(e){if(e.tab==="overview"&&await Lt(e),e.tab==="channels"&&await Us(e),e.tab==="instances"&&await vn(e),e.tab==="sessions"&&await W(e),e.tab==="cron"&&await be(e),e.tab==="skills"&&await de(e),e.tab==="agents"){await un(e),await R(e);const n=e.agentsList?.agents?.map(i=>i.id)??[];n.length>0&&yt(e,n);const t=e.agentsSelectedId??e.agentsList?.defaultId??e.agentsList?.agents?.[0]?.id;t&&(mt(e,t),e.agentsPanel==="skills"&&me(e,t),e.agentsPanel==="channels"&&E(e,!1),e.agentsPanel==="cron"&&be(e))}e.tab==="nodes"&&(await xe(e),await z(e),await R(e),await gn(e)),e.tab==="chat"&&(await Rt(e),re(e,!e.chatHasAutoScrolled)),e.tab==="config"&&(await gt(e),await R(e)),e.tab==="debug"&&(await Se(e),e.eventLog=e.eventLogBuffer),e.tab==="logs"&&(e.logsAtBottom=!0,await ln(e,{reset:!0}),ht(e,!0))}function Rs(){if(typeof window>"u")return"";const e=window.__OPENCLAW_CONTROL_UI_BASE_PATH__;return typeof e=="string"&&e.trim()?Ce(e):xs(window.location.pathname)}function Ps(e){e.theme=e.settings.theme??"system",Le(e,pn(e.theme))}function Le(e,n){if(e.themeResolved=n,typeof document>"u")return;const t=document.documentElement;t.dataset.theme=n,t.style.colorScheme=n}function Bs(e){if(typeof window>"u"||typeof window.matchMedia!="function")return;if(e.themeMedia=window.matchMedia("(prefers-color-scheme: dark)"),e.themeMediaHandler=t=>{e.theme==="system"&&Le(e,t.matches?"dark":"light")},typeof e.themeMedia.addEventListener=="function"){e.themeMedia.addEventListener("change",e.themeMediaHandler);return}e.themeMedia.addListener(e.themeMediaHandler)}function Ns(e){if(!e.themeMedia||!e.themeMediaHandler)return;if(typeof e.themeMedia.removeEventListener=="function"){e.themeMedia.removeEventListener("change",e.themeMediaHandler);return}e.themeMedia.removeListener(e.themeMediaHandler),e.themeMedia=null,e.themeMediaHandler=null}function Ds(e,n){if(typeof window>"u")return;const t=St(window.location.pathname,e.basePath)??"chat";At(e,t),Ct(e,t,n)}function Ks(e){if(typeof window>"u")return;const n=St(window.location.pathname,e.basePath);if(!n)return;const i=new URL(window.location.href).searchParams.get("session")?.trim();i&&(e.sessionKey=i,H(e,{...e.settings,sessionKey:i,lastActiveSessionKey:i})),At(e,n)}function At(e,n){e.tab!==n&&(e.tab=n),n==="chat"&&(e.chatHasAutoScrolled=!1),n==="logs"?on(e):rn(e),n==="debug"?cn(e):dn(e),e.connected&&hn(e)}function Ct(e,n,t){if(typeof window>"u")return;const i=le(fn(n,e.basePath)),s=le(window.location.pathname),a=new URL(window.location.href);n==="chat"&&e.sessionKey?a.searchParams.set("session",e.sessionKey):a.searchParams.delete("session"),s!==i&&(a.pathname=i),t?window.history.replaceState({},"",a.toString()):window.history.pushState({},"",a.toString())}function Os(e,n,t){if(typeof window>"u")return;const i=new URL(window.location.href);i.searchParams.set("session",n),window.history.replaceState({},"",i.toString())}async function Lt(e){await Promise.all([E(e,!1),vn(e),W(e),ce(e),Se(e)])}async function Us(e){await Promise.all([E(e,!0),gt(e),R(e)])}async function be(e){await Promise.all([E(e,!1),ce(e),ke(e)])}const An=50,js=80,Hs=12e4;function zs(e){if(!e||typeof e!="object")return null;const n=e;if(typeof n.text=="string")return n.text;const t=n.content;if(!Array.isArray(t))return null;const i=t.map(s=>{if(!s||typeof s!="object")return null;const a=s;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(s=>!!s);return i.length===0?null:i.join(`
`)}function Cn(e){if(e==null)return null;if(typeof e=="number"||typeof e=="boolean")return String(e);const n=zs(e);let t;if(typeof e=="string")t=e;else if(n)t=n;else try{t=JSON.stringify(e,null,2)}catch{t=String(e)}const i=vi(t,Hs);return i.truncated?`${i.text}

… truncated (${i.total} chars, showing first ${i.text.length}).`:i.text}function Vs(e){const n=[];return n.push({type:"toolcall",name:e.name,arguments:e.args??{}}),e.output&&n.push({type:"toolresult",name:e.name,text:e.output}),{role:"assistant",toolCallId:e.toolCallId,runId:e.runId,content:n,timestamp:e.startedAt}}function qs(e){if(e.toolStreamOrder.length<=An)return;const n=e.toolStreamOrder.length-An,t=e.toolStreamOrder.splice(0,n);for(const i of t)e.toolStreamById.delete(i)}function Gs(e){e.chatToolMessages=e.toolStreamOrder.map(n=>e.toolStreamById.get(n)?.message).filter(n=>!!n)}function Xe(e){e.toolStreamSyncTimer!=null&&(clearTimeout(e.toolStreamSyncTimer),e.toolStreamSyncTimer=null),Gs(e)}function Ws(e,n=!1){if(n){Xe(e);return}e.toolStreamSyncTimer==null&&(e.toolStreamSyncTimer=window.setTimeout(()=>Xe(e),js))}function _e(e){e.toolStreamById.clear(),e.toolStreamOrder=[],e.chatToolMessages=[],Xe(e)}const Qs=5e3;function Js(e,n){const t=n.data??{},i=typeof t.phase=="string"?t.phase:"";e.compactionClearTimer!=null&&(window.clearTimeout(e.compactionClearTimer),e.compactionClearTimer=null),i==="start"?e.compactionStatus={active:!0,startedAt:Date.now(),completedAt:null}:i==="end"&&(e.compactionStatus={active:!1,startedAt:e.compactionStatus?.startedAt??null,completedAt:Date.now()},e.compactionClearTimer=window.setTimeout(()=>{e.compactionStatus=null,e.compactionClearTimer=null},Qs))}function Ys(e,n){if(!n)return;if(n.stream==="compaction"){Js(e,n);return}if(n.stream!=="tool")return;const t=typeof n.sessionKey=="string"?n.sessionKey:void 0;if(t&&t!==e.sessionKey||!t&&e.chatRunId&&n.runId!==e.chatRunId||e.chatRunId&&n.runId!==e.chatRunId||!e.chatRunId)return;const i=n.data??{},s=typeof i.toolCallId=="string"?i.toolCallId:"";if(!s)return;const a=typeof i.name=="string"?i.name:"tool",o=typeof i.phase=="string"?i.phase:"",r=o==="start"?i.args:void 0,d=o==="update"?Cn(i.partialResult):o==="result"?Cn(i.result):void 0,f=Date.now();let y=e.toolStreamById.get(s);y?(y.name=a,r!==void 0&&(y.args=r),d!==void 0&&(y.output=d),y.updatedAt=f):(y={toolCallId:s,runId:n.runId,sessionKey:t,name:a,args:r,output:d,startedAt:typeof n.ts=="number"?n.ts:f,updatedAt:f,message:{}},e.toolStreamById.set(s,y),e.toolStreamOrder.push(s)),y.message=Vs(y),qs(e),Ws(e,o==="result")}const Xs=/^\[([^\]]+)\]\s*/,Zs=["WebChat","WhatsApp","Telegram","Signal","Slack","Discord","iMessage","Teams","Matrix","Zalo","Zalo Personal","BlueBubbles"],Pe=new WeakMap,Be=new WeakMap;function ea(e){return/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z\b/.test(e)||/\d{4}-\d{2}-\d{2} \d{2}:\d{2}\b/.test(e)?!0:Zs.some(n=>e.startsWith(`${n} `))}function Ne(e){const n=e.match(Xs);if(!n)return e;const t=n[1]??"";return ea(t)?e.slice(n[0].length):e}function Ze(e){const n=e,t=typeof n.role=="string"?n.role:"",i=n.content;if(typeof i=="string")return t==="assistant"?Re(i):Ne(i);if(Array.isArray(i)){const s=i.map(a=>{const o=a;return o.type==="text"&&typeof o.text=="string"?o.text:null}).filter(a=>typeof a=="string");if(s.length>0){const a=s.join(`
`);return t==="assistant"?Re(a):Ne(a)}}return typeof n.text=="string"?t==="assistant"?Re(n.text):Ne(n.text):null}function _t(e){if(!e||typeof e!="object")return Ze(e);const n=e;if(Pe.has(n))return Pe.get(n)??null;const t=Ze(e);return Pe.set(n,t),t}function Ln(e){const t=e.content,i=[];if(Array.isArray(t))for(const r of t){const d=r;if(d.type==="thinking"&&typeof d.thinking=="string"){const f=d.thinking.trim();f&&i.push(f)}}if(i.length>0)return i.join(`
`);const s=ta(e);if(!s)return null;const o=[...s.matchAll(/<\s*think(?:ing)?\s*>([\s\S]*?)<\s*\/\s*think(?:ing)?\s*>/gi)].map(r=>(r[1]??"").trim()).filter(Boolean);return o.length>0?o.join(`
`):null}function na(e){if(!e||typeof e!="object")return Ln(e);const n=e;if(Be.has(n))return Be.get(n)??null;const t=Ln(e);return Be.set(n,t),t}function ta(e){const n=e,t=n.content;if(typeof t=="string")return t;if(Array.isArray(t)){const i=t.map(s=>{const a=s;return a.type==="text"&&typeof a.text=="string"?a.text:null}).filter(s=>typeof s=="string");if(i.length>0)return i.join(`
`)}return typeof n.text=="string"?n.text:null}function ia(e){const n=e.trim();if(!n)return"";const t=n.split(/\r?\n/).map(i=>i.trim()).filter(Boolean).map(i=>`_${i}_`);return t.length?["_Reasoning:_",...t].join(`
`):""}async function U(e){if(!(!e.client||!e.connected)){e.chatLoading=!0,e.lastError=null;try{const n=await e.client.request("chat.history",{sessionKey:e.sessionKey,limit:200});e.chatMessages=Array.isArray(n.messages)?n.messages:[],e.chatThinkingLevel=n.thinkingLevel??null}catch(n){e.lastError=String(n)}finally{e.chatLoading=!1}}}function sa(e){const n=/^data:([^;]+);base64,(.+)$/.exec(e);return n?{mimeType:n[1],content:n[2]}:null}async function aa(e,n,t){if(!e.client||!e.connected)return null;const i=n.trim(),s=t&&t.length>0;if(!i&&!s)return null;const a=Date.now(),o=[];if(i&&o.push({type:"text",text:i}),s)for(const f of t)o.push({type:"image",source:{type:"base64",media_type:f.mimeType,data:f.dataUrl}});e.chatMessages=[...e.chatMessages,{role:"user",content:o,timestamp:a}],e.chatSending=!0,e.lastError=null;const r=it();e.chatRunId=r,e.chatStream="",e.chatStreamStartedAt=a;const d=s?t.map(f=>{const y=sa(f.dataUrl);return y?{type:"image",mimeType:y.mimeType,content:y.content}:null}).filter(f=>f!==null):void 0;try{return await e.client.request("chat.send",{sessionKey:e.sessionKey,message:i,deliver:!1,idempotencyKey:r,attachments:d}),r}catch(f){const y=String(f);return e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,e.lastError=y,e.chatMessages=[...e.chatMessages,{role:"assistant",content:[{type:"text",text:"Error: "+y}],timestamp:Date.now()}],null}finally{e.chatSending=!1}}async function la(e){if(!e.client||!e.connected)return!1;const n=e.chatRunId;try{return await e.client.request("chat.abort",n?{sessionKey:e.sessionKey,runId:n}:{sessionKey:e.sessionKey}),!0}catch(t){return e.lastError=String(t),!1}}function oa(e,n){if(!n||n.sessionKey!==e.sessionKey)return null;if(n.runId&&e.chatRunId&&n.runId!==e.chatRunId)return n.state==="final"?"final":null;if(n.state==="delta"){const t=Ze(n.message);if(typeof t=="string"){const i=e.chatStream??"";(!i||t.length>=i.length)&&(e.chatStream=t)}}else n.state==="final"||n.state==="aborted"?(e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null):n.state==="error"&&(e.chatStream=null,e.chatRunId=null,e.chatStreamStartedAt=null,e.lastError=n.errorMessage??"chat error");return n.state}const It=120;function Mt(e){return e.chatSending||!!e.chatRunId}function ra(e){const n=e.trim();if(!n)return!1;const t=n.toLowerCase();return t==="/stop"?!0:t==="stop"||t==="esc"||t==="abort"||t==="wait"||t==="exit"}function ca(e){const n=e.trim();if(!n)return!1;const t=n.toLowerCase();return t==="/new"||t==="/reset"?!0:t.startsWith("/new ")||t.startsWith("/reset ")}async function Et(e){e.connected&&(e.chatMessage="",await la(e))}function da(e,n,t,i){const s=n.trim(),a=!!(t&&t.length>0);!s&&!a||(e.chatQueue=[...e.chatQueue,{id:it(),text:s,createdAt:Date.now(),attachments:a?t?.map(o=>({...o})):void 0,refreshSessions:i}])}async function Ft(e,n,t){_e(e);const i=await aa(e,n,t?.attachments),s=!!i;return!s&&t?.previousDraft!=null&&(e.chatMessage=t.previousDraft),!s&&t?.previousAttachments&&(e.chatAttachments=t.previousAttachments),s&&kt(e,e.sessionKey),s&&t?.restoreDraft&&t.previousDraft?.trim()&&(e.chatMessage=t.previousDraft),s&&t?.restoreAttachments&&t.previousAttachments?.length&&(e.chatAttachments=t.previousAttachments),re(e),s&&!e.chatRunId&&Tt(e),s&&t?.refreshSessions&&i&&e.refreshSessionsAfterChat.add(i),s}async function Tt(e){if(!e.connected||Mt(e))return;const[n,...t]=e.chatQueue;if(!n)return;e.chatQueue=t,await Ft(e,n.text,{attachments:n.attachments,refreshSessions:n.refreshSessions})||(e.chatQueue=[n,...e.chatQueue])}function ua(e,n){e.chatQueue=e.chatQueue.filter(t=>t.id!==n)}async function ga(e,n,t){if(!e.connected)return;const i=e.chatMessage,s=(n??e.chatMessage).trim(),a=e.chatAttachments??[],o=n==null?a:[],r=o.length>0;if(!s&&!r)return;if(ra(s)){await Et(e);return}const d=ca(s);if(n==null&&(e.chatMessage="",e.chatAttachments=[]),Mt(e)){da(e,s,o,d);return}await Ft(e,s,{previousDraft:n==null?i:void 0,restoreDraft:!!(n&&t?.restoreDraft),attachments:r?o:void 0,previousAttachments:n==null?a:void 0,restoreAttachments:!!(n&&t?.restoreDraft),refreshSessions:d})}async function Rt(e){await Promise.all([U(e),W(e,{activeMinutes:It}),Z(e)]),re(e)}const va=Tt;function fa(e){const n=pt(e.sessionKey);return n?.agentId?n.agentId:e.hello?.snapshot?.sessionDefaults?.defaultAgentId?.trim()||"main"}function pa(e,n){const t=Ce(e),i=encodeURIComponent(n);return t?`${t}/avatar/${i}?meta=1`:`/avatar/${i}?meta=1`}async function Z(e){if(!e.connected){e.chatAvatarUrl=null;return}const n=fa(e);if(!n){e.chatAvatarUrl=null;return}e.chatAvatarUrl=null;const t=pa(e.basePath,n);try{const i=await fetch(t,{method:"GET"});if(!i.ok){e.chatAvatarUrl=null;return}const s=await i.json(),a=typeof s.avatarUrl=="string"?s.avatarUrl.trim():"";e.chatAvatarUrl=a||null}catch{e.chatAvatarUrl=null}}const ha={trace:!0,debug:!0,info:!0,warn:!0,error:!0,fatal:!0},ma={name:"",description:"",agentId:"",enabled:!0,scheduleKind:"every",scheduleAt:"",everyAmount:"30",everyUnit:"minutes",cronExpr:"0 7 * * *",cronTz:"",sessionTarget:"main",wakeMode:"next-heartbeat",payloadKind:"systemEvent",payloadText:"",deliver:!1,channel:"last",to:"",timeoutSeconds:"",postToMainPrefix:""},ya=50,ba=200,$a="Assistant";function _n(e,n){if(typeof e!="string")return;const t=e.trim();if(t)return t.length<=n?t:t.slice(0,n)}function en(e){const n=_n(e?.name,ya)??$a,t=_n(e?.avatar??void 0,ba)??null;return{agentId:typeof e?.agentId=="string"&&e.agentId.trim()?e.agentId.trim():null,name:n,avatar:t}}function wa(){return en(typeof window>"u"?{}:{name:window.__OPENCLAW_ASSISTANT_NAME__,avatar:window.__OPENCLAW_ASSISTANT_AVATAR__})}async function Pt(e,n){if(!e.client||!e.connected)return;const t=e.sessionKey.trim(),i=t?{sessionKey:t}:{};try{const s=await e.client.request("agent.identity.get",i);if(!s)return;const a=en(s);e.assistantName=a.name,e.assistantAvatar=a.avatar,e.assistantAgentId=a.agentId??null}catch{}}function nn(e){return typeof e=="object"&&e!==null}function Sa(e){if(!nn(e))return null;const n=typeof e.id=="string"?e.id.trim():"",t=e.request;if(!n||!nn(t))return null;const i=typeof t.command=="string"?t.command.trim():"";if(!i)return null;const s=typeof e.createdAtMs=="number"?e.createdAtMs:0,a=typeof e.expiresAtMs=="number"?e.expiresAtMs:0;return!s||!a?null:{id:n,request:{command:i,cwd:typeof t.cwd=="string"?t.cwd:null,host:typeof t.host=="string"?t.host:null,security:typeof t.security=="string"?t.security:null,ask:typeof t.ask=="string"?t.ask:null,agentId:typeof t.agentId=="string"?t.agentId:null,resolvedPath:typeof t.resolvedPath=="string"?t.resolvedPath:null,sessionKey:typeof t.sessionKey=="string"?t.sessionKey:null},createdAtMs:s,expiresAtMs:a}}function xa(e){if(!nn(e))return null;const n=typeof e.id=="string"?e.id.trim():"";return n?{id:n,decision:typeof e.decision=="string"?e.decision:null,resolvedBy:typeof e.resolvedBy=="string"?e.resolvedBy:null,ts:typeof e.ts=="number"?e.ts:null}:null}function Bt(e){const n=Date.now();return e.filter(t=>t.expiresAtMs>n)}function ka(e,n){const t=Bt(e).filter(i=>i.id!==n.id);return t.push(n),t}function In(e,n){return Bt(e).filter(t=>t.id!==n)}function De(e,n){const t=(e??"").trim(),i=n.mainSessionKey?.trim();if(!i)return t;if(!t)return i;const s=n.mainKey?.trim()||"main",a=n.defaultAgentId?.trim();return t==="main"||t===s||a&&(t===`agent:${a}:main`||t===`agent:${a}:${s}`)?i:t}function Aa(e,n){if(!n?.mainSessionKey)return;const t=De(e.sessionKey,n),i=De(e.settings.sessionKey,n),s=De(e.settings.lastActiveSessionKey,n),a=t||i||e.sessionKey,o={...e.settings,sessionKey:i||a,lastActiveSessionKey:s||a},r=o.sessionKey!==e.settings.sessionKey||o.lastActiveSessionKey!==e.settings.lastActiveSessionKey;a!==e.sessionKey&&(e.sessionKey=a),r&&H(e,o)}function Nt(e){e.lastError=null,e.hello=null,e.connected=!1,e.execApprovalQueue=[],e.execApprovalError=null,e.client?.stop(),e.client=new fi({url:e.settings.gatewayUrl,token:e.settings.token.trim()?e.settings.token:void 0,password:e.password.trim()?e.password:void 0,clientName:"openclaw-control-ui",mode:"webchat",onHello:n=>{e.connected=!0,e.lastError=null,e.hello=n,_a(e,n),e.chatRunId=null,e.chatStream=null,e.chatStreamStartedAt=null,_e(e),Pt(e),un(e),xe(e,{quiet:!0}),z(e,{quiet:!0}),hn(e)},onClose:({code:n,reason:t})=>{e.connected=!1,n!==1012&&(e.lastError=`disconnected (${n}): ${t||"no reason"}`)},onEvent:n=>Ca(e,n),onGap:({expected:n,received:t})=>{e.lastError=`event gap detected (expected seq ${n}, got ${t}); refresh recommended`}}),e.client.start()}function Ca(e,n){try{La(e,n)}catch(t){console.error("[gateway] handleGatewayEvent error:",n.event,t)}}function La(e,n){if(e.eventLogBuffer=[{ts:Date.now(),event:n.event,payload:n.payload},...e.eventLogBuffer].slice(0,250),e.tab==="debug"&&(e.eventLog=e.eventLogBuffer),n.event==="agent"){if(e.onboarding)return;Ys(e,n.payload);return}if(n.event==="chat"){const t=n.payload;t?.sessionKey&&kt(e,t.sessionKey);const i=oa(e,t);if(i==="final"||i==="error"||i==="aborted"){_e(e),va(e);const s=t?.runId;s&&e.refreshSessionsAfterChat.has(s)&&(e.refreshSessionsAfterChat.delete(s),i==="final"&&W(e,{activeMinutes:It}))}i==="final"&&U(e);return}if(n.event==="presence"){const t=n.payload;t?.presence&&Array.isArray(t.presence)&&(e.presenceEntries=t.presence,e.presenceError=null,e.presenceStatus=null);return}if(n.event==="cron"&&e.tab==="cron"&&be(e),(n.event==="device.pair.requested"||n.event==="device.pair.resolved")&&z(e,{quiet:!0}),n.event==="exec.approval.requested"){const t=Sa(n.payload);if(t){e.execApprovalQueue=ka(e.execApprovalQueue,t),e.execApprovalError=null;const i=Math.max(0,t.expiresAtMs-Date.now()+500);window.setTimeout(()=>{e.execApprovalQueue=In(e.execApprovalQueue,t.id)},i)}return}if(n.event==="exec.approval.resolved"){const t=xa(n.payload);t&&(e.execApprovalQueue=In(e.execApprovalQueue,t.id))}}function _a(e,n){const t=n.snapshot;t?.presence&&Array.isArray(t.presence)&&(e.presenceEntries=t.presence),t?.health&&(e.debugHealth=t.health),t?.sessionDefaults&&Aa(e,t.sessionDefaults)}function Ia(e){e.basePath=Rs(),Es(e),Ds(e,!0),Ps(e),Bs(e),window.addEventListener("popstate",e.popStateHandler),Nt(e),Xi(e),e.tab==="logs"&&on(e),e.tab==="debug"&&cn(e)}function Ma(e){Vi(e)}function Ea(e){window.removeEventListener("popstate",e.popStateHandler),Zi(e),rn(e),dn(e),Ns(e),e.topbarObserver?.disconnect(),e.topbarObserver=null}function Fa(e,n){if(e.tab==="chat"&&(n.has("chatMessages")||n.has("chatToolMessages")||n.has("chatStream")||n.has("chatLoading")||n.has("tab"))){const t=n.has("tab"),i=n.has("chatLoading")&&n.get("chatLoading")===!0&&!e.chatLoading;re(e,t||i||!e.chatHasAutoScrolled)}e.tab==="logs"&&(n.has("logsEntries")||n.has("logsAutoFollow")||n.has("tab"))&&e.logsAutoFollow&&e.logsAtBottom&&ht(e,n.has("tab")||n.has("logsAutoFollow"))}const{I:Ta}=pi,Mn=e=>e,Ra=e=>e.strings===void 0,En=()=>document.createComment(""),X=(e,n,t)=>{const i=e._$AA.parentNode,s=n===void 0?e._$AB:n._$AA;if(t===void 0){const a=i.insertBefore(En(),s),o=i.insertBefore(En(),s);t=new Ta(a,o,e,e.options)}else{const a=t._$AB.nextSibling,o=t._$AM,r=o!==e;if(r){let d;t._$AQ?.(e),t._$AM=e,t._$AP!==void 0&&(d=e._$AU)!==o._$AU&&t._$AP(d)}if(a!==s||r){let d=t._$AA;for(;d!==a;){const f=Mn(d).nextSibling;Mn(i).insertBefore(d,s),d=f}}}return t},V=(e,n,t=e)=>(e._$AI(n,t),e),Pa={},Ba=(e,n=Pa)=>e._$AH=n,Na=e=>e._$AH,Ke=e=>{e._$AR(),e._$AA.remove()};const Fn=(e,n,t)=>{const i=new Map;for(let s=n;s<=t;s++)i.set(e[s],s);return i},Dt=st(class extends at{constructor(e){if(super(e),e.type!==lt.CHILD)throw Error("repeat() can only be used in text expressions")}dt(e,n,t){let i;t===void 0?t=n:n!==void 0&&(i=n);const s=[],a=[];let o=0;for(const r of e)s[o]=i?i(r,o):o,a[o]=t(r,o),o++;return{values:a,keys:s}}render(e,n,t){return this.dt(e,n,t).values}update(e,[n,t,i]){const s=Na(e),{values:a,keys:o}=this.dt(n,t,i);if(!Array.isArray(s))return this.ut=o,a;const r=this.ut??=[],d=[];let f,y,g=0,c=s.length-1,u=0,b=a.length-1;for(;g<=c&&u<=b;)if(s[g]===null)g++;else if(s[c]===null)c--;else if(r[g]===o[u])d[u]=V(s[g],a[u]),g++,u++;else if(r[c]===o[b])d[b]=V(s[c],a[b]),c--,b--;else if(r[g]===o[b])d[b]=V(s[g],a[b]),X(e,d[b+1],s[g]),g++,b--;else if(r[c]===o[u])d[u]=V(s[c],a[u]),X(e,s[g],s[c]),c--,u++;else if(f===void 0&&(f=Fn(o,u,b),y=Fn(r,g,c)),f.has(r[g]))if(f.has(r[c])){const $=y.get(o[u]),w=$!==void 0?s[$]:null;if(w===null){const S=X(e,s[g]);V(S,a[u]),d[u]=S}else d[u]=V(w,a[u]),X(e,s[g],w),s[$]=null;u++}else Ke(s[c]),c--;else Ke(s[g]),g++;for(;u<=b;){const $=X(e,d[b+1]);V($,a[u]),d[u++]=$}for(;g<=c;){const $=s[g++];$!==null&&Ke($)}return this.ut=o,Ba(e,d),hi}}),M={messageSquare:l`
    <svg viewBox="0 0 24 24">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  `,barChart:l`
    <svg viewBox="0 0 24 24">
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  `,link:l`
    <svg viewBox="0 0 24 24">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  `,radio:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="2" />
      <path
        d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"
      />
    </svg>
  `,fileText:l`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <line x1="10" x2="8" y1="9" y2="9" />
    </svg>
  `,zap:l`
    <svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
  `,monitor:l`
    <svg viewBox="0 0 24 24">
      <rect width="20" height="14" x="2" y="3" rx="2" />
      <line x1="8" x2="16" y1="21" y2="21" />
      <line x1="12" x2="12" y1="17" y2="21" />
    </svg>
  `,settings:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"
      />
      <circle cx="12" cy="12" r="3" />
    </svg>
  `,bug:l`
    <svg viewBox="0 0 24 24">
      <path d="m8 2 1.88 1.88" />
      <path d="M14.12 3.88 16 2" />
      <path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1" />
      <path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6" />
      <path d="M12 20v-9" />
      <path d="M6.53 9C4.6 8.8 3 7.1 3 5" />
      <path d="M6 13H2" />
      <path d="M3 21c0-2.1 1.7-3.9 3.8-4" />
      <path d="M20.97 5c0 2.1-1.6 3.8-3.5 4" />
      <path d="M22 13h-4" />
      <path d="M17.2 17c2.1.1 3.8 1.9 3.8 4" />
    </svg>
  `,scrollText:l`
    <svg viewBox="0 0 24 24">
      <path d="M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4" />
      <path d="M19 17V5a2 2 0 0 0-2-2H4" />
      <path d="M15 8h-5" />
      <path d="M15 12h-5" />
    </svg>
  `,folder:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"
      />
    </svg>
  `,menu:l`
    <svg viewBox="0 0 24 24">
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  `,x:l`
    <svg viewBox="0 0 24 24">
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  `,check:l`
    <svg viewBox="0 0 24 24"><path d="M20 6 9 17l-5-5" /></svg>
  `,arrowDown:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 5v14" />
      <path d="m19 12-7 7-7-7" />
    </svg>
  `,copy:l`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
      <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
    </svg>
  `,search:l`
    <svg viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  `,brain:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
      <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
      <path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4" />
      <path d="M17.599 6.5a3 3 0 0 0 .399-1.375" />
      <path d="M6.003 5.125A3 3 0 0 0 6.401 6.5" />
      <path d="M3.477 10.896a4 4 0 0 1 .585-.396" />
      <path d="M19.938 10.5a4 4 0 0 1 .585.396" />
      <path d="M6 18a4 4 0 0 1-1.967-.516" />
      <path d="M19.967 17.484A4 4 0 0 1 18 18" />
    </svg>
  `,book:l`
    <svg viewBox="0 0 24 24">
      <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
    </svg>
  `,loader:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 2v4" />
      <path d="m16.2 7.8 2.9-2.9" />
      <path d="M18 12h4" />
      <path d="m16.2 16.2 2.9 2.9" />
      <path d="M12 18v4" />
      <path d="m4.9 19.1 2.9-2.9" />
      <path d="M2 12h4" />
      <path d="m4.9 4.9 2.9 2.9" />
    </svg>
  `,wrench:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      />
    </svg>
  `,fileCode:l`
    <svg viewBox="0 0 24 24">
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <path d="m10 13-2 2 2 2" />
      <path d="m14 17 2-2-2-2" />
    </svg>
  `,edit:l`
    <svg viewBox="0 0 24 24">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  `,penLine:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  `,paperclip:l`
    <svg viewBox="0 0 24 24">
      <path
        d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"
      />
    </svg>
  `,globe:l`
    <svg viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  `,image:l`
    <svg viewBox="0 0 24 24">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <circle cx="9" cy="9" r="2" />
      <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
    </svg>
  `,smartphone:l`
    <svg viewBox="0 0 24 24">
      <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
      <path d="M12 18h.01" />
    </svg>
  `,plug:l`
    <svg viewBox="0 0 24 24">
      <path d="M12 22v-5" />
      <path d="M9 8V2" />
      <path d="M15 8V2" />
      <path d="M18 8v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4V8Z" />
    </svg>
  `,circle:l`
    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" /></svg>
  `,puzzle:l`
    <svg viewBox="0 0 24 24">
      <path
        d="M19.439 7.85c-.049.322.059.648.289.878l1.568 1.568c.47.47.706 1.087.706 1.704s-.235 1.233-.706 1.704l-1.611 1.611a.98.98 0 0 1-.837.276c-.47-.07-.802-.48-.968-.925a2.501 2.501 0 1 0-3.214 3.214c.446.166.855.497.925.968a.979.979 0 0 1-.276.837l-1.61 1.61a2.404 2.404 0 0 1-1.705.707 2.402 2.402 0 0 1-1.704-.706l-1.568-1.568a1.026 1.026 0 0 0-.877-.29c-.493.074-.84.504-1.02.968a2.5 2.5 0 1 1-3.237-3.237c.464-.18.894-.527.967-1.02a1.026 1.026 0 0 0-.289-.877l-1.568-1.568A2.402 2.402 0 0 1 1.998 12c0-.617.236-1.234.706-1.704L4.23 8.77c.24-.24.581-.353.917-.303.515.076.874.54 1.02 1.02a2.5 2.5 0 1 0 3.237-3.237c-.48-.146-.944-.505-1.02-1.02a.98.98 0 0 1 .303-.917l1.526-1.526A2.402 2.402 0 0 1 11.998 2c.617 0 1.234.236 1.704.706l1.568 1.568c.23.23.556.338.877.29.493-.074.84-.504 1.02-.968a2.5 2.5 0 1 1 3.236 3.236c-.464.18-.894.527-.967 1.02Z"
      />
    </svg>
  `};function Da(e,n){const t=fn(n,e.basePath);return l`
    <a
      href=${t}
      class="nav-item ${e.tab===n?"active":""}"
      @click=${i=>{i.defaultPrevented||i.button!==0||i.metaKey||i.ctrlKey||i.shiftKey||i.altKey||(i.preventDefault(),e.setTab(n))}}
      title=${Ye(n)}
    >
      <span class="nav-item__icon" aria-hidden="true">${M[ks(n)]}</span>
      <span class="nav-item__text">${Ye(n)}</span>
    </a>
  `}function Ka(e){const n=Oa(e.hello,e.sessionsResult),t=Ua(e.sessionKey,e.sessionsResult,n),i=e.onboarding,s=e.onboarding,a=e.onboarding?!1:e.settings.chatShowThinking,o=e.onboarding?!0:e.settings.chatFocusMode,r=l`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"></path>
      <path d="M21 3v5h-5"></path>
    </svg>
  `,d=l`
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M4 7V4h3"></path>
      <path d="M20 7V4h-3"></path>
      <path d="M4 17v3h3"></path>
      <path d="M20 17v3h-3"></path>
      <circle cx="12" cy="12" r="3"></circle>
    </svg>
  `;return l`
    <div class="chat-controls">
      <label class="field chat-controls__session">
        <select
          .value=${e.sessionKey}
          ?disabled=${!e.connected}
          @change=${f=>{const y=f.target.value;e.sessionKey=y,e.chatMessage="",e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:y,lastActiveSessionKey:y}),e.loadAssistantIdentity(),Os(e,y),U(e)}}
        >
          ${Dt(t,f=>f.key,f=>l`<option value=${f.key}>
                ${f.displayName??f.key}
              </option>`)}
        </select>
      </label>
      <button
        class="btn btn--sm btn--icon"
        ?disabled=${e.chatLoading||!e.connected}
        @click=${()=>{e.resetToolStream(),Rt(e)}}
        title="Refresh chat data"
      >
        ${r}
      </button>
      <span class="chat-controls__separator">|</span>
      <button
        class="btn btn--sm btn--icon ${a?"active":""}"
        ?disabled=${i}
        @click=${()=>{i||e.applySettings({...e.settings,chatShowThinking:!e.settings.chatShowThinking})}}
        aria-pressed=${a}
        title=${i?"Disabled during onboarding":"Toggle assistant thinking/working output"}
      >
        ${M.brain}
      </button>
      <button
        class="btn btn--sm btn--icon ${o?"active":""}"
        ?disabled=${s}
        @click=${()=>{s||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})}}
        aria-pressed=${o}
        title=${s?"Disabled during onboarding":"Toggle focus mode (hide sidebar + page header)"}
      >
        ${d}
      </button>
      <a
        class="btn btn--sm"
        href="/taxchat.html"
        target="_blank"
        rel="noreferrer"
        title="Open TaxChat in new window"
        style="margin-left:8px"
      >
        TaxChat Help
      </a>
    </div>
  `}function Oa(e,n){const t=e?.snapshot,i=t?.sessionDefaults?.mainSessionKey?.trim();if(i)return i;const s=t?.sessionDefaults?.mainKey?.trim();return s||(n?.sessions?.some(a=>a.key==="main")?"main":null)}function Oe(e,n){const t=n?.label?.trim();if(t)return`${t} (${e})`;const i=n?.displayName?.trim();return i||e}function Ua(e,n,t){const i=new Set,s=[],a=t&&n?.sessions?.find(r=>r.key===t),o=n?.sessions?.find(r=>r.key===e);if(t&&(i.add(t),s.push({key:t,displayName:Oe(t,a)})),i.has(e)||(i.add(e),s.push({key:e,displayName:Oe(e,o)})),n?.sessions)for(const r of n.sessions)i.has(r.key)||(i.add(r.key),s.push({key:r.key,displayName:Oe(r.key,r)}));return s}const ja=["system","light","dark"];function Ha(e){const n=Math.max(0,ja.indexOf(e.theme)),t=i=>s=>{const o={element:s.currentTarget};(s.clientX||s.clientY)&&(o.pointerClientX=s.clientX,o.pointerClientY=s.clientY),e.setTheme(i,o)};return l`
    <div class="theme-toggle" style="--theme-index: ${n};">
      <div class="theme-toggle__track" role="group" aria-label="Theme">
        <span class="theme-toggle__indicator"></span>
        <button
          class="theme-toggle__button ${e.theme==="system"?"active":""}"
          @click=${t("system")}
          aria-pressed=${e.theme==="system"}
          aria-label="System theme"
          title="System"
        >
          ${qa()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="light"?"active":""}"
          @click=${t("light")}
          aria-pressed=${e.theme==="light"}
          aria-label="Light theme"
          title="Light"
        >
          ${za()}
        </button>
        <button
          class="theme-toggle__button ${e.theme==="dark"?"active":""}"
          @click=${t("dark")}
          aria-pressed=${e.theme==="dark"}
          aria-label="Dark theme"
          title="Dark"
        >
          ${Va()}
        </button>
      </div>
    </div>
  `}function za(){return l`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4"></circle>
      <path d="M12 2v2"></path>
      <path d="M12 20v2"></path>
      <path d="m4.93 4.93 1.41 1.41"></path>
      <path d="m17.66 17.66 1.41 1.41"></path>
      <path d="M2 12h2"></path>
      <path d="M20 12h2"></path>
      <path d="m6.34 17.66-1.41 1.41"></path>
      <path d="m19.07 4.93-1.41 1.41"></path>
    </svg>
  `}function Va(){return l`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"
      ></path>
    </svg>
  `}function qa(){return l`
    <svg class="theme-icon" viewBox="0 0 24 24" aria-hidden="true">
      <rect width="20" height="14" x="2" y="3" rx="2"></rect>
      <line x1="8" x2="16" y1="21" y2="21"></line>
      <line x1="12" x2="12" y1="17" y2="21"></line>
    </svg>
  `}function Kt(e,n){if(!e)return e;const i=e.files.some(s=>s.name===n.name)?e.files.map(s=>s.name===n.name?n:s):[...e.files,n];return{...e,files:i}}async function Ue(e,n){if(!(!e.client||!e.connected||e.agentFilesLoading)){e.agentFilesLoading=!0,e.agentFilesError=null;try{const t=await e.client.request("agents.files.list",{agentId:n});t&&(e.agentFilesList=t,e.agentFileActive&&!t.files.some(i=>i.name===e.agentFileActive)&&(e.agentFileActive=null))}catch(t){e.agentFilesError=String(t)}finally{e.agentFilesLoading=!1}}}async function Ga(e,n,t){if(!(!e.client||!e.connected||e.agentFilesLoading)&&!Object.hasOwn(e.agentFileContents,t)){e.agentFilesLoading=!0,e.agentFilesError=null;try{const i=await e.client.request("agents.files.get",{agentId:n,name:t});if(i?.file){const s=i.file.content??"";e.agentFilesList=Kt(e.agentFilesList,i.file),e.agentFileContents={...e.agentFileContents,[t]:s},Object.hasOwn(e.agentFileDrafts,t)||(e.agentFileDrafts={...e.agentFileDrafts,[t]:s})}}catch(i){e.agentFilesError=String(i)}finally{e.agentFilesLoading=!1}}}async function Wa(e,n,t,i){if(!(!e.client||!e.connected||e.agentFileSaving)){e.agentFileSaving=!0,e.agentFilesError=null;try{const s=await e.client.request("agents.files.set",{agentId:n,name:t,content:i});s?.file&&(e.agentFilesList=Kt(e.agentFilesList,s.file),e.agentFileContents={...e.agentFileContents,[t]:i},e.agentFileDrafts={...e.agentFileDrafts,[t]:i})}catch(s){e.agentFilesError=String(s)}finally{e.agentFileSaving=!1}}}const Qa={bash:"exec","apply-patch":"apply_patch"},Ja={"group:memory":["memory_search","memory_get"],"group:web":["web_search","web_fetch"],"group:fs":["read","write","edit","apply_patch"],"group:runtime":["exec","process"],"group:sessions":["sessions_list","sessions_history","sessions_send","sessions_spawn","session_status"],"group:ui":["browser","canvas"],"group:automation":["cron","gateway"],"group:messaging":["message"],"group:nodes":["nodes"],"group:openclaw":["browser","canvas","nodes","cron","message","gateway","agents_list","sessions_list","sessions_history","sessions_send","sessions_spawn","session_status","memory_search","memory_get","web_search","web_fetch","image"]},Ya={minimal:{allow:["session_status"]},coding:{allow:["group:fs","group:runtime","group:sessions","group:memory","image"]},messaging:{allow:["group:messaging","sessions_list","sessions_history","sessions_send","session_status"]},full:{}};function P(e){const n=e.trim().toLowerCase();return Qa[n]??n}function Xa(e){return e?e.map(P).filter(Boolean):[]}function Za(e){const n=Xa(e),t=[];for(const i of n){const s=Ja[i];if(s){t.push(...s);continue}t.push(i)}return Array.from(new Set(t))}function el(e){if(!e)return;const n=Ya[e];if(n&&!(!n.allow&&!n.deny))return{allow:n.allow?[...n.allow]:void 0,deny:n.deny?[...n.deny]:void 0}}function nl(e){const n=e.host??"unknown",t=e.ip?`(${e.ip})`:"",i=e.mode??"",s=e.version??"";return`${n} ${t} ${i} ${s}`.trim()}function tl(e){const n=e.ts??null;return n?I(n):"n/a"}function mn(e){return e?`${ae(e)} (${I(e)})`:"n/a"}function il(e){if(e.totalTokens==null)return"n/a";const n=e.totalTokens??0,t=e.contextTokens??0;return t?`${n} / ${t}`:String(n)}function sl(e){if(e==null)return"";try{return JSON.stringify(e,null,2)}catch{return String(e)}}function Ot(e){const n=e.state??{},t=n.nextRunAtMs?ae(n.nextRunAtMs):"n/a",i=n.lastRunAtMs?ae(n.lastRunAtMs):"n/a";return`${n.lastStatus??"n/a"} · next ${t} · last ${i}`}function Ut(e){const n=e.schedule;return n.kind==="at"?`At ${ae(n.atMs)}`:n.kind==="every"?`Every ${ot(n.everyMs)}`:`Cron ${n.expr}${n.tz?` (${n.tz})`:""}`}function jt(e){const n=e.payload;return n.kind==="systemEvent"?`System: ${n.text}`:`Agent: ${n.message}`}const Tn=[{id:"fs",label:"Files",tools:[{id:"read",label:"read",description:"Read file contents"},{id:"write",label:"write",description:"Create or overwrite files"},{id:"edit",label:"edit",description:"Make precise edits"},{id:"apply_patch",label:"apply_patch",description:"Patch files (OpenAI)"}]},{id:"runtime",label:"Runtime",tools:[{id:"exec",label:"exec",description:"Run shell commands"},{id:"process",label:"process",description:"Manage background processes"}]},{id:"web",label:"Web",tools:[{id:"web_search",label:"web_search",description:"Search the web"},{id:"web_fetch",label:"web_fetch",description:"Fetch web content"}]},{id:"memory",label:"Memory",tools:[{id:"memory_search",label:"memory_search",description:"Semantic search"},{id:"memory_get",label:"memory_get",description:"Read memory files"}]},{id:"sessions",label:"Sessions",tools:[{id:"sessions_list",label:"sessions_list",description:"List sessions"},{id:"sessions_history",label:"sessions_history",description:"Session history"},{id:"sessions_send",label:"sessions_send",description:"Send to session"},{id:"sessions_spawn",label:"sessions_spawn",description:"Spawn sub-agent"},{id:"session_status",label:"session_status",description:"Session status"}]},{id:"ui",label:"UI",tools:[{id:"browser",label:"browser",description:"Control web browser"},{id:"canvas",label:"canvas",description:"Control canvases"}]},{id:"messaging",label:"Messaging",tools:[{id:"message",label:"message",description:"Send messages"}]},{id:"automation",label:"Automation",tools:[{id:"cron",label:"cron",description:"Schedule tasks"},{id:"gateway",label:"gateway",description:"Gateway control"}]},{id:"nodes",label:"Nodes",tools:[{id:"nodes",label:"nodes",description:"Nodes + devices"}]},{id:"agents",label:"Agents",tools:[{id:"agents_list",label:"agents_list",description:"List agents"}]},{id:"media",label:"Media",tools:[{id:"image",label:"image",description:"Image understanding"}]}],al=[{id:"minimal",label:"Minimal"},{id:"coding",label:"Coding"},{id:"messaging",label:"Messaging"},{id:"full",label:"Full"}];function tn(e){return e.name?.trim()||e.identity?.name?.trim()||e.id}function fe(e){const n=e.trim();if(!n||n.length>16)return!1;let t=!1;for(let i=0;i<n.length;i+=1)if(n.charCodeAt(i)>127){t=!0;break}return!(!t||n.includes("://")||n.includes("/")||n.includes("."))}function Ie(e,n){const t=n?.emoji?.trim();if(t&&fe(t))return t;const i=e.identity?.emoji?.trim();if(i&&fe(i))return i;const s=n?.avatar?.trim();if(s&&fe(s))return s;const a=e.identity?.avatar?.trim();return a&&fe(a)?a:""}function Ht(e,n){return n&&e===n?"default":null}function ll(e){if(e==null||!Number.isFinite(e))return"-";if(e<1024)return`${e} B`;const n=["KB","MB","GB","TB"];let t=e/1024,i=0;for(;t>=1024&&i<n.length-1;)t/=1024,i+=1;return`${t.toFixed(t<10?1:0)} ${n[i]}`}function Me(e,n){const t=e;return{entry:(t?.agents?.list??[]).find(a=>a?.id===n),defaults:t?.agents?.defaults,globalTools:t?.tools}}function zt(e,n,t,i,s){const a=Me(n,e.id),r=(t&&t.agentId===e.id?t.workspace:null)||a.entry?.workspace||a.defaults?.workspace||"default",d=a.entry?.model?ne(a.entry?.model):ne(a.defaults?.model),f=s?.name?.trim()||e.identity?.name?.trim()||e.name?.trim()||a.entry?.name||e.id,y=Ie(e,s)||"-",g=Array.isArray(a.entry?.skills)?a.entry?.skills:null,c=g?.length??null;return{workspace:r,model:d,identityName:f,identityEmoji:y,skillsLabel:g?`${c} selected`:"all skills",isDefault:!!(i&&e.id===i)}}function ne(e){if(!e)return"-";if(typeof e=="string")return e.trim()||"-";if(typeof e=="object"&&e){const n=e,t=n.primary?.trim();if(t){const i=Array.isArray(n.fallbacks)?n.fallbacks.length:0;return i>0?`${t} (+${i} fallback)`:t}}return"-"}function Rn(e){const n=e.match(/^(.+) \(\+\d+ fallback\)$/);return n?n[1]:e}function Pn(e){if(!e)return null;if(typeof e=="string")return e.trim()||null;if(typeof e=="object"&&e){const n=e;return(typeof n.primary=="string"?n.primary:typeof n.model=="string"?n.model:typeof n.id=="string"?n.id:typeof n.value=="string"?n.value:null)?.trim()||null}return null}function ol(e){if(!e||typeof e=="string")return null;if(typeof e=="object"&&e){const n=e,t=Array.isArray(n.fallbacks)?n.fallbacks:Array.isArray(n.fallback)?n.fallback:null;return t?t.filter(i=>typeof i=="string"):null}return null}function rl(e){return e.split(",").map(n=>n.trim()).filter(Boolean)}function cl(e){const t=e?.agents?.defaults?.models;if(!t||typeof t!="object")return[];const i=[];for(const[s,a]of Object.entries(t)){const o=s.trim();if(!o)continue;const r=a&&typeof a=="object"&&"alias"in a&&typeof a.alias=="string"?a.alias?.trim():void 0,d=r&&r!==o?`${r} (${o})`:o;i.push({value:o,label:d})}return i}function dl(e,n){const t=cl(e),i=n?t.some(s=>s.value===n):!1;return n&&!i&&t.unshift({value:n,label:`Current (${n})`}),t.length===0?l`
      <option value="" disabled>No configured models</option>
    `:t.map(s=>l`<option value=${s.value}>${s.label}</option>`)}function ul(e){const n=P(e);if(!n)return{kind:"exact",value:""};if(n==="*")return{kind:"all"};if(!n.includes("*"))return{kind:"exact",value:n};const t=n.replace(/[.*+?^${}()|[\\]\\]/g,"\\$&");return{kind:"regex",value:new RegExp(`^${t.replaceAll("\\*",".*")}$`)}}function sn(e){return Array.isArray(e)?Za(e).map(ul).filter(n=>n.kind!=="exact"||n.value.length>0):[]}function te(e,n){for(const t of n)if(t.kind==="all"||t.kind==="exact"&&e===t.value||t.kind==="regex"&&t.value.test(e))return!0;return!1}function gl(e,n){if(!n)return!0;const t=P(e),i=sn(n.deny);if(te(t,i))return!1;const s=sn(n.allow);return!!(s.length===0||te(t,s)||t==="apply_patch"&&te("exec",s))}function Bn(e,n){if(!Array.isArray(n)||n.length===0)return!1;const t=P(e),i=sn(n);return!!(te(t,i)||t==="apply_patch"&&te("exec",i))}function vl(e){const n=e.agentsList?.agents??[],t=e.agentsList?.defaultId??null,i=e.selectedAgentId??t??n[0]?.id??null,s=i?n.find(a=>a.id===i)??null:null;return l`
    <div class="agents-layout">
      <section class="card agents-sidebar">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Agents</div>
            <div class="card-sub">${n.length} configured.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
        </div>
        ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}
        <div class="agent-list" style="margin-top: 12px;">
          ${n.length===0?l`
                  <div class="muted">No agents found.</div>
                `:n.map(a=>{const o=Ht(a.id,t),r=Ie(a,e.agentIdentityById[a.id]??null);return l`
                    <button
                      type="button"
                      class="agent-row ${i===a.id?"active":""}"
                      @click=${()=>e.onSelectAgent(a.id)}
                    >
                      <div class="agent-avatar">
                        ${r||tn(a).slice(0,1)}
                      </div>
                      <div class="agent-info">
                        <div class="agent-title">${tn(a)}</div>
                        <div class="agent-sub mono">${a.id}</div>
                      </div>
                      ${o?l`<span class="agent-pill">${o}</span>`:v}
                    </button>
                  `})}
        </div>
      </section>
      <section class="agents-main">
        ${s?l`
              ${fl(s,t,e.agentIdentityById[s.id]??null)}
              ${pl(e.activePanel,a=>e.onSelectPanel(a))}
              ${e.activePanel==="overview"?hl({agent:s,defaultId:t,configForm:e.configForm,agentFilesList:e.agentFilesList,agentIdentity:e.agentIdentityById[s.id]??null,agentIdentityError:e.agentIdentityError,agentIdentityLoading:e.agentIdentityLoading,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave,onModelChange:e.onModelChange,onModelFallbacksChange:e.onModelFallbacksChange}):v}
              ${e.activePanel==="files"?Cl({agentId:s.id,agentFilesList:e.agentFilesList,agentFilesLoading:e.agentFilesLoading,agentFilesError:e.agentFilesError,agentFileActive:e.agentFileActive,agentFileContents:e.agentFileContents,agentFileDrafts:e.agentFileDrafts,agentFileSaving:e.agentFileSaving,onLoadFiles:e.onLoadFiles,onSelectFile:e.onSelectFile,onFileDraftChange:e.onFileDraftChange,onFileReset:e.onFileReset,onFileSave:e.onFileSave}):v}
              ${e.activePanel==="tools"?_l({agentId:s.id,configForm:e.configForm,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,onProfileChange:e.onToolsProfileChange,onOverridesChange:e.onToolsOverridesChange,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):v}
              ${e.activePanel==="skills"?Ml({agentId:s.id,report:e.agentSkillsReport,loading:e.agentSkillsLoading,error:e.agentSkillsError,activeAgentId:e.agentSkillsAgentId,configForm:e.configForm,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configDirty,filter:e.skillsFilter,onFilterChange:e.onSkillsFilterChange,onRefresh:e.onSkillsRefresh,onToggle:e.onAgentSkillToggle,onClear:e.onAgentSkillsClear,onDisableAll:e.onAgentSkillsDisableAll,onConfigReload:e.onConfigReload,onConfigSave:e.onConfigSave}):v}
              ${e.activePanel==="channels"?kl({agent:s,defaultId:t,configForm:e.configForm,agentFilesList:e.agentFilesList,agentIdentity:e.agentIdentityById[s.id]??null,snapshot:e.channelsSnapshot,loading:e.channelsLoading,error:e.channelsError,lastSuccess:e.channelsLastSuccess,onRefresh:e.onChannelsRefresh}):v}
              ${e.activePanel==="cron"?Al({agent:s,defaultId:t,configForm:e.configForm,agentFilesList:e.agentFilesList,agentIdentity:e.agentIdentityById[s.id]??null,jobs:e.cronJobs,status:e.cronStatus,loading:e.cronLoading,error:e.cronError,onRefresh:e.onCronRefresh}):v}
            `:l`
                <div class="card">
                  <div class="card-title">Select an agent</div>
                  <div class="card-sub">Pick an agent to inspect its workspace and tools.</div>
                </div>
              `}
      </section>
    </div>
  `}function fl(e,n,t){const i=Ht(e.id,n),s=tn(e),a=e.identity?.theme?.trim()||"Agent workspace and routing.",o=Ie(e,t);return l`
    <section class="card agent-header">
      <div class="agent-header-main">
        <div class="agent-avatar agent-avatar--lg">
          ${o||s.slice(0,1)}
        </div>
        <div>
          <div class="card-title">${s}</div>
          <div class="card-sub">${a}</div>
        </div>
      </div>
      <div class="agent-header-meta">
        <div class="mono">${e.id}</div>
        ${i?l`<span class="agent-pill">${i}</span>`:v}
      </div>
    </section>
  `}function pl(e,n){return l`
    <div class="agent-tabs">
      ${[{id:"overview",label:"Overview"},{id:"files",label:"Files"},{id:"tools",label:"Tools"},{id:"skills",label:"Skills"},{id:"channels",label:"Channels"},{id:"cron",label:"Cron Jobs"}].map(i=>l`
          <button
            class="agent-tab ${e===i.id?"active":""}"
            type="button"
            @click=${()=>n(i.id)}
          >
            ${i.label}
          </button>
        `)}
    </div>
  `}function hl(e){const{agent:n,configForm:t,agentFilesList:i,agentIdentity:s,agentIdentityLoading:a,agentIdentityError:o,configLoading:r,configSaving:d,configDirty:f,onConfigReload:y,onConfigSave:g,onModelChange:c,onModelFallbacksChange:u}=e,b=Me(t,n.id),w=(i&&i.agentId===n.id?i.workspace:null)||b.entry?.workspace||b.defaults?.workspace||"default",S=b.entry?.model?ne(b.entry?.model):ne(b.defaults?.model),x=ne(b.defaults?.model),A=Pn(b.entry?.model)||(S!=="-"?Rn(S):null),L=Pn(b.defaults?.model)||(x!=="-"?Rn(x):null),C=A??L??null,k=ol(b.entry?.model),_=k?k.join(", "):"",ue=s?.name?.trim()||n.identity?.name?.trim()||n.name?.trim()||b.entry?.name||"-",li=Ie(n,s)||"-",Sn=Array.isArray(b.entry?.skills)?b.entry?.skills:null,oi=Sn?.length??null,xn=a?"Loading…":o?"Unavailable":"",ri=!!(e.defaultId&&n.id===e.defaultId);return l`
    <section class="card">
      <div class="card-title">Overview</div>
      <div class="card-sub">Workspace paths and identity metadata.</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div class="mono">${w}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${S}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Name</div>
          <div>${ue}</div>
          ${xn?l`<div class="agent-kv-sub muted">${xn}</div>`:v}
        </div>
        <div class="agent-kv">
          <div class="label">Default</div>
          <div>${ri?"yes":"no"}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Emoji</div>
          <div>${li}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${Sn?`${oi} selected`:"all skills"}</div>
        </div>
      </div>

      <div class="agent-model-select" style="margin-top: 20px;">
        <div class="label">Model Selection</div>
        <div class="row" style="gap: 12px; flex-wrap: wrap;">
          <label class="field" style="min-width: 260px; flex: 1;">
            <span>Primary model</span>
            <select
              .value=${C??""}
              ?disabled=${!t||r||d}
              @change=${Te=>c(n.id,Te.target.value||null)}
            >
              <option value="">
                ${L?`Inherit default (${L})`:"Inherit default"}
              </option>
              ${dl(t,C??void 0)}
            </select>
          </label>
          <label class="field" style="min-width: 260px; flex: 1;">
            <span>Fallbacks (comma-separated)</span>
            <input
              .value=${_}
              ?disabled=${!t||r||d}
              placeholder="provider/model, provider/model"
              @input=${Te=>u(n.id,rl(Te.target.value))}
            />
          </label>
        </div>
        <div class="row" style="justify-content: flex-end; gap: 8px;">
          <button
            class="btn btn--sm"
            ?disabled=${r}
            @click=${y}
          >
            Reload Config
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${d||!f}
            @click=${g}
          >
            ${d?"Saving…":"Save"}
          </button>
        </div>
      </div>
    </section>
  `}function Vt(e,n){return l`
    <section class="card">
      <div class="card-title">Agent Context</div>
      <div class="card-sub">${n}</div>
      <div class="agents-overview-grid" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Workspace</div>
          <div class="mono">${e.workspace}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Primary Model</div>
          <div class="mono">${e.model}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Name</div>
          <div>${e.identityName}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Identity Emoji</div>
          <div>${e.identityEmoji}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Skills Filter</div>
          <div>${e.skillsLabel}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Default</div>
          <div>${e.isDefault?"yes":"no"}</div>
        </div>
      </div>
    </section>
  `}function ml(e,n){const t=e.channelMeta?.find(i=>i.id===n);return t?.label?t.label:e.channelLabels?.[n]??n}function yl(e){if(!e)return[];const n=new Set;for(const s of e.channelOrder??[])n.add(s);for(const s of e.channelMeta??[])n.add(s.id);for(const s of Object.keys(e.channelAccounts??{}))n.add(s);const t=[],i=e.channelOrder?.length?e.channelOrder:Array.from(n);for(const s of i)n.has(s)&&(t.push(s),n.delete(s));for(const s of n)t.push(s);return t.map(s=>({id:s,label:ml(e,s),accounts:e.channelAccounts?.[s]??[]}))}const bl=["groupPolicy","streamMode","dmPolicy"];function $l(e,n){if(!e)return null;const i=(e.channels??{})[n];if(i&&typeof i=="object")return i;const s=e[n];return s&&typeof s=="object"?s:null}function wl(e){if(e==null)return"n/a";if(typeof e=="string"||typeof e=="number"||typeof e=="boolean")return String(e);try{return JSON.stringify(e)}catch{return"n/a"}}function Sl(e,n){const t=$l(e,n);return t?bl.flatMap(i=>i in t?[{label:i,value:wl(t[i])}]:[]):[]}function xl(e){let n=0,t=0,i=0;for(const s of e){const a=s.probe&&typeof s.probe=="object"&&"ok"in s.probe?!!s.probe.ok:!1;(s.connected===!0||s.running===!0||a)&&(n+=1),s.configured&&(t+=1),s.enabled&&(i+=1)}return{total:e.length,connected:n,configured:t,enabled:i}}function kl(e){const n=zt(e.agent,e.configForm,e.agentFilesList,e.defaultId,e.agentIdentity),t=yl(e.snapshot),i=e.lastSuccess?I(e.lastSuccess):"never";return l`
    <section class="grid grid-cols-2">
      ${Vt(n,"Workspace, identity, and model configuration.")}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Channels</div>
            <div class="card-sub">Gateway-wide channel status snapshot.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="muted" style="margin-top: 8px;">
          Last refresh: ${i}
        </div>
        ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}
        ${e.snapshot?v:l`
                <div class="callout info" style="margin-top: 12px">Load channels to see live status.</div>
              `}
        ${t.length===0?l`
                <div class="muted" style="margin-top: 16px">No channels found.</div>
              `:l`
              <div class="list" style="margin-top: 16px;">
                ${t.map(s=>{const a=xl(s.accounts),o=a.total?`${a.connected}/${a.total} connected`:"no accounts",r=a.configured?`${a.configured} configured`:"not configured",d=a.total?`${a.enabled} enabled`:"disabled",f=Sl(e.configForm,s.id);return l`
                    <div class="list-item">
                      <div class="list-main">
                        <div class="list-title">${s.label}</div>
                        <div class="list-sub mono">${s.id}</div>
                      </div>
                      <div class="list-meta">
                        <div>${o}</div>
                        <div>${r}</div>
                        <div>${d}</div>
                        ${f.length>0?f.map(y=>l`<div>${y.label}: ${y.value}</div>`):v}
                      </div>
                    </div>
                  `})}
              </div>
            `}
      </section>
    </section>
  `}function Al(e){const n=zt(e.agent,e.configForm,e.agentFilesList,e.defaultId,e.agentIdentity),t=e.jobs.filter(i=>i.agentId===e.agent.id);return l`
    <section class="grid grid-cols-2">
      ${Vt(n,"Workspace and scheduling targets.")}
      <section class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Scheduler</div>
            <div class="card-sub">Gateway cron status.</div>
          </div>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Enabled</div>
            <div class="stat-value">
              ${e.status?e.status.enabled?"Yes":"No":"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Jobs</div>
            <div class="stat-value">${e.status?.jobs??"n/a"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Next wake</div>
            <div class="stat-value">${mn(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}
      </section>
    </section>
    <section class="card">
      <div class="card-title">Agent Cron Jobs</div>
      <div class="card-sub">Scheduled jobs targeting this agent.</div>
      ${t.length===0?l`
              <div class="muted" style="margin-top: 16px">No jobs assigned.</div>
            `:l`
              <div class="list" style="margin-top: 16px;">
                ${t.map(i=>l`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${i.name}</div>
                      ${i.description?l`<div class="list-sub">${i.description}</div>`:v}
                      <div class="chip-row" style="margin-top: 6px;">
                        <span class="chip">${Ut(i)}</span>
                        <span class="chip ${i.enabled?"chip-ok":"chip-warn"}">
                          ${i.enabled?"enabled":"disabled"}
                        </span>
                        <span class="chip">${i.sessionTarget}</span>
                      </div>
                    </div>
                    <div class="list-meta">
                      <div class="mono">${Ot(i)}</div>
                      <div class="muted">${jt(i)}</div>
                    </div>
                  </div>
                `)}
              </div>
            `}
    </section>
  `}function Cl(e){const n=e.agentFilesList?.agentId===e.agentId?e.agentFilesList:null,t=n?.files??[],i=e.agentFileActive??null,s=i?t.find(d=>d.name===i)??null:null,a=i?e.agentFileContents[i]??"":"",o=i?e.agentFileDrafts[i]??a:"",r=i?o!==a:!1;return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Core Files</div>
          <div class="card-sub">Bootstrap persona, identity, and tool guidance.</div>
        </div>
        <button
          class="btn btn--sm"
          ?disabled=${e.agentFilesLoading}
          @click=${()=>e.onLoadFiles(e.agentId)}
        >
          ${e.agentFilesLoading?"Loading…":"Refresh"}
        </button>
      </div>
      ${n?l`<div class="muted mono" style="margin-top: 8px;">Workspace: ${n.workspace}</div>`:v}
      ${e.agentFilesError?l`<div class="callout danger" style="margin-top: 12px;">${e.agentFilesError}</div>`:v}
      ${n?l`
              <div class="agent-files-grid" style="margin-top: 16px;">
                <div class="agent-files-list">
                  ${t.length===0?l`
                          <div class="muted">No files found.</div>
                        `:t.map(d=>Ll(d,i,()=>e.onSelectFile(d.name)))}
                </div>
                <div class="agent-files-editor">
                  ${s?l`
                          <div class="agent-file-header">
                            <div>
                              <div class="agent-file-title mono">${s.name}</div>
                              <div class="agent-file-sub mono">${s.path}</div>
                            </div>
                            <div class="agent-file-actions">
                              <button
                                class="btn btn--sm"
                                ?disabled=${!r}
                                @click=${()=>e.onFileReset(s.name)}
                              >
                                Reset
                              </button>
                              <button
                                class="btn btn--sm primary"
                                ?disabled=${e.agentFileSaving||!r}
                                @click=${()=>e.onFileSave(s.name)}
                              >
                                ${e.agentFileSaving?"Saving…":"Save"}
                              </button>
                            </div>
                          </div>
                          ${s.missing?l`
                                  <div class="callout info" style="margin-top: 10px">
                                    This file is missing. Saving will create it in the agent workspace.
                                  </div>
                                `:v}
                          <label class="field" style="margin-top: 12px;">
                            <span>Content</span>
                            <textarea
                              .value=${o}
                              @input=${d=>e.onFileDraftChange(s.name,d.target.value)}
                            ></textarea>
                          </label>
                        `:l`
                          <div class="muted">Select a file to edit.</div>
                        `}
                </div>
              </div>
            `:l`
              <div class="callout info" style="margin-top: 12px">
                Load the agent workspace files to edit core instructions.
              </div>
            `}
    </section>
  `}function Ll(e,n,t){const i=e.missing?"Missing":`${ll(e.size)} · ${I(e.updatedAtMs??null)}`;return l`
    <button
      type="button"
      class="agent-file-row ${n===e.name?"active":""}"
      @click=${t}
    >
      <div>
        <div class="agent-file-name mono">${e.name}</div>
        <div class="agent-file-meta">${i}</div>
      </div>
      ${e.missing?l`
              <span class="agent-pill warn">missing</span>
            `:v}
    </button>
  `}function _l(e){const n=Me(e.configForm,e.agentId),t=n.entry?.tools??{},i=n.globalTools??{},s=t.profile??i.profile??"full",a=t.profile?"agent override":i.profile?"global default":"default",o=Array.isArray(t.allow)&&t.allow.length>0,r=Array.isArray(i.allow)&&i.allow.length>0,d=!!e.configForm&&!e.configLoading&&!e.configSaving&&!o,f=o?[]:Array.isArray(t.alsoAllow)?t.alsoAllow:[],y=o?[]:Array.isArray(t.deny)?t.deny:[],g=o?{allow:t.allow??[],deny:t.deny??[]}:el(s)??void 0,c=Tn.flatMap(S=>S.tools.map(x=>x.id)),u=S=>{const x=gl(S,g),A=Bn(S,f),L=Bn(S,y);return{allowed:(x||A)&&!L,baseAllowed:x,denied:L}},b=c.filter(S=>u(S).allowed).length,$=(S,x)=>{const A=new Set(f.map(_=>P(_)).filter(_=>_.length>0)),L=new Set(y.map(_=>P(_)).filter(_=>_.length>0)),C=u(S).baseAllowed,k=P(S);x?(L.delete(k),C||A.add(k)):(A.delete(k),L.add(k)),e.onOverridesChange(e.agentId,[...A],[...L])},w=S=>{const x=new Set(f.map(L=>P(L)).filter(L=>L.length>0)),A=new Set(y.map(L=>P(L)).filter(L=>L.length>0));for(const L of c){const C=u(L).baseAllowed,k=P(L);S?(A.delete(k),C||x.add(k)):(x.delete(k),A.add(k))}e.onOverridesChange(e.agentId,[...x],[...A])};return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Tool Access</div>
          <div class="card-sub">
            Profile + per-tool overrides for this agent.
            <span class="mono">${b}/${c.length}</span> enabled.
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <button
            class="btn btn--sm"
            ?disabled=${!d}
            @click=${()=>w(!0)}
          >
            Enable All
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${!d}
            @click=${()=>w(!1)}
          >
            Disable All
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            Reload Config
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?"Saving…":"Save"}
          </button>
        </div>
      </div>

      ${e.configForm?v:l`
              <div class="callout info" style="margin-top: 12px">
                Load the gateway config to adjust tool profiles.
              </div>
            `}
      ${o?l`
              <div class="callout info" style="margin-top: 12px">
                This agent is using an explicit allowlist in config. Tool overrides are managed in the Config tab.
              </div>
            `:v}
      ${r?l`
              <div class="callout info" style="margin-top: 12px">
                Global tools.allow is set. Agent overrides cannot enable tools that are globally blocked.
              </div>
            `:v}

      <div class="agent-tools-meta" style="margin-top: 16px;">
        <div class="agent-kv">
          <div class="label">Profile</div>
          <div class="mono">${s}</div>
        </div>
        <div class="agent-kv">
          <div class="label">Source</div>
          <div>${a}</div>
        </div>
        ${e.configDirty?l`
                <div class="agent-kv">
                  <div class="label">Status</div>
                  <div class="mono">unsaved</div>
                </div>
              `:v}
      </div>

      <div class="agent-tools-presets" style="margin-top: 16px;">
        <div class="label">Quick Presets</div>
        <div class="agent-tools-buttons">
          ${al.map(S=>l`
              <button
                class="btn btn--sm ${s===S.id?"active":""}"
                ?disabled=${!d}
                @click=${()=>e.onProfileChange(e.agentId,S.id,!0)}
              >
                ${S.label}
              </button>
            `)}
          <button
            class="btn btn--sm"
            ?disabled=${!d}
            @click=${()=>e.onProfileChange(e.agentId,null,!1)}
          >
            Inherit
          </button>
        </div>
      </div>

      <div class="agent-tools-grid" style="margin-top: 20px;">
        ${Tn.map(S=>l`
            <div class="agent-tools-section">
              <div class="agent-tools-header">${S.label}</div>
              <div class="agent-tools-list">
                ${S.tools.map(x=>{const{allowed:A}=u(x.id);return l`
                    <div class="agent-tool-row">
                      <div>
                        <div class="agent-tool-title mono">${x.label}</div>
                        <div class="agent-tool-sub">${x.description}</div>
                      </div>
                      <label class="cfg-toggle">
                        <input
                          type="checkbox"
                          .checked=${A}
                          ?disabled=${!d}
                          @change=${L=>$(x.id,L.target.checked)}
                        />
                        <span class="cfg-toggle__track"></span>
                      </label>
                    </div>
                  `})}
              </div>
            </div>
          `)}
      </div>
    </section>
  `}const je=[{id:"workspace",label:"Workspace Skills",sources:["openclaw-workspace"]},{id:"built-in",label:"Built-in Skills",sources:["openclaw-bundled"]},{id:"installed",label:"Installed Skills",sources:["openclaw-managed"]},{id:"extra",label:"Extra Skills",sources:["openclaw-extra"]}];function Il(e){const n=new Map;for(const s of je)n.set(s.id,{id:s.id,label:s.label,skills:[]});const t={id:"other",label:"Other Skills",skills:[]};for(const s of e){const a=je.find(o=>o.sources.includes(s.source));a?n.get(a.id)?.skills.push(s):t.skills.push(s)}const i=je.map(s=>n.get(s.id)).filter(s=>!!(s&&s.skills.length>0));return t.skills.length>0&&i.push(t),i}function Ml(e){const n=!!e.configForm&&!e.configLoading&&!e.configSaving,t=Me(e.configForm,e.agentId),i=Array.isArray(t.entry?.skills)?t.entry?.skills:void 0,s=new Set((i??[]).map(u=>u.trim()).filter(Boolean)),a=i!==void 0,o=!!(e.report&&e.activeAgentId===e.agentId),r=o?e.report?.skills??[]:[],d=e.filter.trim().toLowerCase(),f=d?r.filter(u=>[u.name,u.description,u.source].join(" ").toLowerCase().includes(d)):r,y=Il(f),g=a?r.filter(u=>s.has(u.name)).length:r.length,c=r.length;return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">
            Per-agent skill allowlist and workspace skills.
            ${c>0?l`<span class="mono">${g}/${c}</span>`:v}
          </div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn btn--sm" ?disabled=${!n} @click=${()=>e.onClear(e.agentId)}>
            Use All
          </button>
          <button class="btn btn--sm" ?disabled=${!n} @click=${()=>e.onDisableAll(e.agentId)}>
            Disable All
          </button>
          <button
            class="btn btn--sm"
            ?disabled=${e.configLoading}
            @click=${e.onConfigReload}
          >
            Reload Config
          </button>
          <button class="btn btn--sm" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
          <button
            class="btn btn--sm primary"
            ?disabled=${e.configSaving||!e.configDirty}
            @click=${e.onConfigSave}
          >
            ${e.configSaving?"Saving…":"Save"}
          </button>
        </div>
      </div>

      ${e.configForm?v:l`
              <div class="callout info" style="margin-top: 12px">
                Load the gateway config to set per-agent skills.
              </div>
            `}
      ${a?l`
              <div class="callout info" style="margin-top: 12px">This agent uses a custom skill allowlist.</div>
            `:l`
              <div class="callout info" style="margin-top: 12px">
                All skills are enabled. Disabling any skill will create a per-agent allowlist.
              </div>
            `}
      ${!o&&!e.loading?l`
              <div class="callout info" style="margin-top: 12px">
                Load skills for this agent to view workspace-specific entries.
              </div>
            `:v}
      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${u=>e.onFilterChange(u.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${f.length} shown</div>
      </div>

      ${f.length===0?l`
              <div class="muted" style="margin-top: 16px">No skills found.</div>
            `:l`
              <div class="agent-skills-groups" style="margin-top: 16px;">
                ${y.map(u=>El(u,{agentId:e.agentId,allowSet:s,usingAllowlist:a,editable:n,onToggle:e.onToggle}))}
              </div>
            `}
    </section>
  `}function El(e,n){const t=e.id==="workspace"||e.id==="built-in";return l`
    <details class="agent-skills-group" ?open=${!t}>
      <summary class="agent-skills-header">
        <span>${e.label}</span>
        <span class="muted">${e.skills.length}</span>
      </summary>
      <div class="list skills-grid">
        ${e.skills.map(i=>Fl(i,{agentId:n.agentId,allowSet:n.allowSet,usingAllowlist:n.usingAllowlist,editable:n.editable,onToggle:n.onToggle}))}
      </div>
    </details>
  `}function Fl(e,n){const t=n.usingAllowlist?n.allowSet.has(e.name):!0,i=[...e.missing.bins.map(a=>`bin:${a}`),...e.missing.env.map(a=>`env:${a}`),...e.missing.config.map(a=>`config:${a}`),...e.missing.os.map(a=>`os:${a}`)],s=[];return e.disabled&&s.push("disabled"),e.blockedByAllowlist&&s.push("blocked by allowlist"),l`
    <div class="list-item agent-skill-row">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${e.description}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?l`
                  <span class="chip chip-warn">disabled</span>
                `:v}
        </div>
        ${i.length>0?l`<div class="muted" style="margin-top: 6px;">Missing: ${i.join(", ")}</div>`:v}
        ${s.length>0?l`<div class="muted" style="margin-top: 6px;">Reason: ${s.join(", ")}</div>`:v}
      </div>
      <div class="list-meta">
        <label class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${t}
            ?disabled=${!n.editable}
            @change=${a=>n.onToggle(n.agentId,e.name,a.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </label>
      </div>
    </div>
  `}function B(e){if(e)return Array.isArray(e.type)?e.type.filter(t=>t!=="null")[0]??e.type[0]:e.type}function qt(e){if(!e)return"";if(e.default!==void 0)return e.default;switch(B(e)){case"object":return{};case"array":return[];case"boolean":return!1;case"number":case"integer":return 0;case"string":return"";default:return""}}function Ee(e){return e.filter(n=>typeof n=="string").join(".")}function T(e,n){const t=Ee(e),i=n[t];if(i)return i;const s=t.split(".");for(const[a,o]of Object.entries(n)){if(!a.includes("*"))continue;const r=a.split(".");if(r.length!==s.length)continue;let d=!0;for(let f=0;f<s.length;f+=1)if(r[f]!=="*"&&r[f]!==s[f]){d=!1;break}if(d)return o}}function K(e){return e.replace(/_/g," ").replace(/([a-z0-9])([A-Z])/g,"$1 $2").replace(/\s+/g," ").replace(/^./,n=>n.toUpperCase())}function Tl(e){const n=Ee(e).toLowerCase();return n.includes("token")||n.includes("password")||n.includes("secret")||n.includes("apikey")||n.endsWith("key")}const Rl=new Set(["title","description","default","nullable"]);function Pl(e){return Object.keys(e??{}).filter(t=>!Rl.has(t)).length===0}function Bl(e){if(e===void 0)return"";try{return JSON.stringify(e,null,2)??""}catch{return""}}const oe={chevronDown:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  `,plus:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="12" y1="5" x2="12" y2="19"></line>
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,minus:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <line x1="5" y1="12" x2="19" y2="12"></line>
    </svg>
  `,trash:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="3 6 5 6 21 6"></polyline>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
    </svg>
  `,edit:l`
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
    </svg>
  `};function D(e){const{schema:n,value:t,path:i,hints:s,unsupported:a,disabled:o,onPatch:r}=e,d=e.showLabel??!0,f=B(n),y=T(i,s),g=y?.label??n.title??K(String(i.at(-1))),c=y?.help??n.description,u=Ee(i);if(a.has(u))return l`<div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${g}</div>
      <div class="cfg-field__error">Unsupported schema node. Use Raw mode.</div>
    </div>`;if(n.anyOf||n.oneOf){const $=(n.anyOf??n.oneOf??[]).filter(C=>!(C.type==="null"||Array.isArray(C.type)&&C.type.includes("null")));if($.length===1)return D({...e,schema:$[0]});const w=C=>{if(C.const!==void 0)return C.const;if(C.enum&&C.enum.length===1)return C.enum[0]},S=$.map(w),x=S.every(C=>C!==void 0);if(x&&S.length>0&&S.length<=5){const C=t??n.default;return l`
        <div class="cfg-field">
          ${d?l`<label class="cfg-field__label">${g}</label>`:v}
          ${c?l`<div class="cfg-field__help">${c}</div>`:v}
          <div class="cfg-segmented">
            ${S.map(k=>l`
              <button
                type="button"
                class="cfg-segmented__btn ${k===C||String(k)===String(C)?"active":""}"
                ?disabled=${o}
                @click=${()=>r(i,k)}
              >
                ${String(k)}
              </button>
            `)}
          </div>
        </div>
      `}if(x&&S.length>5)return Dn({...e,options:S,value:t??n.default});const A=new Set($.map(C=>B(C)).filter(Boolean)),L=new Set([...A].map(C=>C==="integer"?"number":C));if([...L].every(C=>["string","number","boolean"].includes(C))){const C=L.has("string"),k=L.has("number");if(L.has("boolean")&&L.size===1)return D({...e,schema:{...n,type:"boolean",anyOf:void 0,oneOf:void 0}});if(C||k)return Nn({...e,inputType:k&&!C?"number":"text"})}}if(n.enum){const b=n.enum;if(b.length<=5){const $=t??n.default;return l`
        <div class="cfg-field">
          ${d?l`<label class="cfg-field__label">${g}</label>`:v}
          ${c?l`<div class="cfg-field__help">${c}</div>`:v}
          <div class="cfg-segmented">
            ${b.map(w=>l`
              <button
                type="button"
                class="cfg-segmented__btn ${w===$||String(w)===String($)?"active":""}"
                ?disabled=${o}
                @click=${()=>r(i,w)}
              >
                ${String(w)}
              </button>
            `)}
          </div>
        </div>
      `}return Dn({...e,options:b,value:t??n.default})}if(f==="object")return Dl(e);if(f==="array")return Kl(e);if(f==="boolean"){const b=typeof t=="boolean"?t:typeof n.default=="boolean"?n.default:!1;return l`
      <label class="cfg-toggle-row ${o?"disabled":""}">
        <div class="cfg-toggle-row__content">
          <span class="cfg-toggle-row__label">${g}</span>
          ${c?l`<span class="cfg-toggle-row__help">${c}</span>`:v}
        </div>
        <div class="cfg-toggle">
          <input
            type="checkbox"
            .checked=${b}
            ?disabled=${o}
            @change=${$=>r(i,$.target.checked)}
          />
          <span class="cfg-toggle__track"></span>
        </div>
      </label>
    `}return f==="number"||f==="integer"?Nl(e):f==="string"?Nn({...e,inputType:"text"}):l`
    <div class="cfg-field cfg-field--error">
      <div class="cfg-field__label">${g}</div>
      <div class="cfg-field__error">Unsupported type: ${f}. Use Raw mode.</div>
    </div>
  `}function Nn(e){const{schema:n,value:t,path:i,hints:s,disabled:a,onPatch:o,inputType:r}=e,d=e.showLabel??!0,f=T(i,s),y=f?.label??n.title??K(String(i.at(-1))),g=f?.help??n.description,c=f?.sensitive??Tl(i),u=f?.placeholder??(c?"••••":n.default!==void 0?`Default: ${String(n.default)}`:""),b=t??"";return l`
    <div class="cfg-field">
      ${d?l`<label class="cfg-field__label">${y}</label>`:v}
      ${g?l`<div class="cfg-field__help">${g}</div>`:v}
      <div class="cfg-input-wrap">
        <input
          type=${c?"password":r}
          class="cfg-input"
          placeholder=${u}
          .value=${b==null?"":String(b)}
          ?disabled=${a}
          @input=${$=>{const w=$.target.value;if(r==="number"){if(w.trim()===""){o(i,void 0);return}const S=Number(w);o(i,Number.isNaN(S)?w:S);return}o(i,w)}}
          @change=${$=>{if(r==="number")return;const w=$.target.value;o(i,w.trim())}}
        />
        ${n.default!==void 0?l`
          <button
            type="button"
            class="cfg-input__reset"
            title="Reset to default"
            ?disabled=${a}
            @click=${()=>o(i,n.default)}
          >↺</button>
        `:v}
      </div>
    </div>
  `}function Nl(e){const{schema:n,value:t,path:i,hints:s,disabled:a,onPatch:o}=e,r=e.showLabel??!0,d=T(i,s),f=d?.label??n.title??K(String(i.at(-1))),y=d?.help??n.description,g=t??n.default??"",c=typeof g=="number"?g:0;return l`
    <div class="cfg-field">
      ${r?l`<label class="cfg-field__label">${f}</label>`:v}
      ${y?l`<div class="cfg-field__help">${y}</div>`:v}
      <div class="cfg-number">
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(i,c-1)}
        >−</button>
        <input
          type="number"
          class="cfg-number__input"
          .value=${g==null?"":String(g)}
          ?disabled=${a}
          @input=${u=>{const b=u.target.value,$=b===""?void 0:Number(b);o(i,$)}}
        />
        <button
          type="button"
          class="cfg-number__btn"
          ?disabled=${a}
          @click=${()=>o(i,c+1)}
        >+</button>
      </div>
    </div>
  `}function Dn(e){const{schema:n,value:t,path:i,hints:s,disabled:a,options:o,onPatch:r}=e,d=e.showLabel??!0,f=T(i,s),y=f?.label??n.title??K(String(i.at(-1))),g=f?.help??n.description,c=t??n.default,u=o.findIndex($=>$===c||String($)===String(c)),b="__unset__";return l`
    <div class="cfg-field">
      ${d?l`<label class="cfg-field__label">${y}</label>`:v}
      ${g?l`<div class="cfg-field__help">${g}</div>`:v}
      <select
        class="cfg-select"
        ?disabled=${a}
        .value=${u>=0?String(u):b}
        @change=${$=>{const w=$.target.value;r(i,w===b?void 0:o[Number(w)])}}
      >
        <option value=${b}>Select...</option>
        ${o.map(($,w)=>l`
          <option value=${String(w)}>${String($)}</option>
        `)}
      </select>
    </div>
  `}function Dl(e){const{schema:n,value:t,path:i,hints:s,unsupported:a,disabled:o,onPatch:r}=e,d=T(i,s),f=d?.label??n.title??K(String(i.at(-1))),y=d?.help??n.description,g=t??n.default,c=g&&typeof g=="object"&&!Array.isArray(g)?g:{},u=n.properties??{},$=Object.entries(u).toSorted((A,L)=>{const C=T([...i,A[0]],s)?.order??0,k=T([...i,L[0]],s)?.order??0;return C!==k?C-k:A[0].localeCompare(L[0])}),w=new Set(Object.keys(u)),S=n.additionalProperties,x=!!S&&typeof S=="object";return i.length===1?l`
      <div class="cfg-fields">
        ${$.map(([A,L])=>D({schema:L,value:c[A],path:[...i,A],hints:s,unsupported:a,disabled:o,onPatch:r}))}
        ${x?Kn({schema:S,value:c,path:i,hints:s,unsupported:a,disabled:o,reservedKeys:w,onPatch:r}):v}
      </div>
    `:l`
    <details class="cfg-object" open>
      <summary class="cfg-object__header">
        <span class="cfg-object__title">${f}</span>
        <span class="cfg-object__chevron">${oe.chevronDown}</span>
      </summary>
      ${y?l`<div class="cfg-object__help">${y}</div>`:v}
      <div class="cfg-object__content">
        ${$.map(([A,L])=>D({schema:L,value:c[A],path:[...i,A],hints:s,unsupported:a,disabled:o,onPatch:r}))}
        ${x?Kn({schema:S,value:c,path:i,hints:s,unsupported:a,disabled:o,reservedKeys:w,onPatch:r}):v}
      </div>
    </details>
  `}function Kl(e){const{schema:n,value:t,path:i,hints:s,unsupported:a,disabled:o,onPatch:r}=e,d=e.showLabel??!0,f=T(i,s),y=f?.label??n.title??K(String(i.at(-1))),g=f?.help??n.description,c=Array.isArray(n.items)?n.items[0]:n.items;if(!c)return l`
      <div class="cfg-field cfg-field--error">
        <div class="cfg-field__label">${y}</div>
        <div class="cfg-field__error">Unsupported array schema. Use Raw mode.</div>
      </div>
    `;const u=Array.isArray(t)?t:Array.isArray(n.default)?n.default:[];return l`
    <div class="cfg-array">
      <div class="cfg-array__header">
        ${d?l`<span class="cfg-array__label">${y}</span>`:v}
        <span class="cfg-array__count">${u.length} item${u.length!==1?"s":""}</span>
        <button
          type="button"
          class="cfg-array__add"
          ?disabled=${o}
          @click=${()=>{const b=[...u,qt(c)];r(i,b)}}
        >
          <span class="cfg-array__add-icon">${oe.plus}</span>
          Add
        </button>
      </div>
      ${g?l`<div class="cfg-array__help">${g}</div>`:v}

      ${u.length===0?l`
              <div class="cfg-array__empty">No items yet. Click "Add" to create one.</div>
            `:l`
        <div class="cfg-array__items">
          ${u.map((b,$)=>l`
            <div class="cfg-array__item">
              <div class="cfg-array__item-header">
                <span class="cfg-array__item-index">#${$+1}</span>
                <button
                  type="button"
                  class="cfg-array__item-remove"
                  title="Remove item"
                  ?disabled=${o}
                  @click=${()=>{const w=[...u];w.splice($,1),r(i,w)}}
                >
                  ${oe.trash}
                </button>
              </div>
              <div class="cfg-array__item-content">
                ${D({schema:c,value:b,path:[...i,$],hints:s,unsupported:a,disabled:o,showLabel:!1,onPatch:r})}
              </div>
            </div>
          `)}
        </div>
      `}
    </div>
  `}function Kn(e){const{schema:n,value:t,path:i,hints:s,unsupported:a,disabled:o,reservedKeys:r,onPatch:d}=e,f=Pl(n),y=Object.entries(t??{}).filter(([g])=>!r.has(g));return l`
    <div class="cfg-map">
      <div class="cfg-map__header">
        <span class="cfg-map__label">Custom entries</span>
        <button
          type="button"
          class="cfg-map__add"
          ?disabled=${o}
          @click=${()=>{const g={...t};let c=1,u=`custom-${c}`;for(;u in g;)c+=1,u=`custom-${c}`;g[u]=f?{}:qt(n),d(i,g)}}
        >
          <span class="cfg-map__add-icon">${oe.plus}</span>
          Add Entry
        </button>
      </div>

      ${y.length===0?l`
              <div class="cfg-map__empty">No custom entries.</div>
            `:l`
        <div class="cfg-map__items">
          ${y.map(([g,c])=>{const u=[...i,g],b=Bl(c);return l`
              <div class="cfg-map__item">
                <div class="cfg-map__item-key">
                  <input
                    type="text"
                    class="cfg-input cfg-input--sm"
                    placeholder="Key"
                    .value=${g}
                    ?disabled=${o}
                    @change=${$=>{const w=$.target.value.trim();if(!w||w===g)return;const S={...t};w in S||(S[w]=S[g],delete S[g],d(i,S))}}
                  />
                </div>
                <div class="cfg-map__item-value">
                  ${f?l`
                        <textarea
                          class="cfg-textarea cfg-textarea--sm"
                          placeholder="JSON value"
                          rows="2"
                          .value=${b}
                          ?disabled=${o}
                          @change=${$=>{const w=$.target,S=w.value.trim();if(!S){d(u,void 0);return}try{d(u,JSON.parse(S))}catch{w.value=b}}}
                        ></textarea>
                      `:D({schema:n,value:c,path:u,hints:s,unsupported:a,disabled:o,showLabel:!1,onPatch:d})}
                </div>
                <button
                  type="button"
                  class="cfg-map__item-remove"
                  title="Remove entry"
                  ?disabled=${o}
                  @click=${()=>{const $={...t};delete $[g],d(i,$)}}
                >
                  ${oe.trash}
                </button>
              </div>
            `})}
        </div>
      `}
    </div>
  `}const On={env:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,default:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},yn={env:{label:"Environment Variables",description:"Environment variables passed to the gateway process"},update:{label:"Updates",description:"Auto-update settings and release channel"},agents:{label:"Agents",description:"Agent configurations, models, and identities"},auth:{label:"Authentication",description:"API keys and authentication profiles"},channels:{label:"Channels",description:"Messaging channels (Telegram, Discord, Slack, etc.)"},messages:{label:"Messages",description:"Message handling and routing settings"},commands:{label:"Commands",description:"Custom slash commands"},hooks:{label:"Hooks",description:"Webhooks and event hooks"},skills:{label:"Skills",description:"Skill packs and capabilities"},tools:{label:"Tools",description:"Tool configurations (browser, search, etc.)"},gateway:{label:"Gateway",description:"Gateway server settings (port, auth, binding)"},wizard:{label:"Setup Wizard",description:"Setup wizard state and history"},meta:{label:"Metadata",description:"Gateway metadata and version information"},logging:{label:"Logging",description:"Log levels and output configuration"},browser:{label:"Browser",description:"Browser automation settings"},ui:{label:"UI",description:"User interface preferences"},models:{label:"Models",description:"AI model configurations and providers"},bindings:{label:"Bindings",description:"Key bindings and shortcuts"},broadcast:{label:"Broadcast",description:"Broadcast and notification settings"},audio:{label:"Audio",description:"Audio input/output settings"},session:{label:"Session",description:"Session management and persistence"},cron:{label:"Cron",description:"Scheduled tasks and automation"},web:{label:"Web",description:"Web server and API settings"},discovery:{label:"Discovery",description:"Service discovery and networking"},canvasHost:{label:"Canvas Host",description:"Canvas rendering and display"},talk:{label:"Talk",description:"Voice and speech settings"},plugins:{label:"Plugins",description:"Plugin management and extensions"}};function Un(e){return On[e]??On.default}function Ol(e,n,t){if(!t)return!0;const i=t.toLowerCase(),s=yn[e];return e.toLowerCase().includes(i)||s&&(s.label.toLowerCase().includes(i)||s.description.toLowerCase().includes(i))?!0:ee(n,i)}function ee(e,n){if(e.title?.toLowerCase().includes(n)||e.description?.toLowerCase().includes(n)||e.enum?.some(i=>String(i).toLowerCase().includes(n)))return!0;if(e.properties){for(const[i,s]of Object.entries(e.properties))if(i.toLowerCase().includes(n)||ee(s,n))return!0}if(e.items){const i=Array.isArray(e.items)?e.items:[e.items];for(const s of i)if(s&&ee(s,n))return!0}if(e.additionalProperties&&typeof e.additionalProperties=="object"&&ee(e.additionalProperties,n))return!0;const t=e.anyOf??e.oneOf??e.allOf;if(t){for(const i of t)if(i&&ee(i,n))return!0}return!1}function Ul(e){if(!e.schema)return l`
      <div class="muted">Schema unavailable.</div>
    `;const n=e.schema,t=e.value??{};if(B(n)!=="object"||!n.properties)return l`
      <div class="callout danger">Unsupported schema. Use Raw.</div>
    `;const i=new Set(e.unsupportedPaths??[]),s=n.properties,a=e.searchQuery??"",o=e.activeSection,r=e.activeSubsection??null,f=Object.entries(s).toSorted((g,c)=>{const u=T([g[0]],e.uiHints)?.order??50,b=T([c[0]],e.uiHints)?.order??50;return u!==b?u-b:g[0].localeCompare(c[0])}).filter(([g,c])=>!(o&&g!==o||a&&!Ol(g,c,a)));let y=null;if(o&&r&&f.length===1){const g=f[0]?.[1];g&&B(g)==="object"&&g.properties&&g.properties[r]&&(y={sectionKey:o,subsectionKey:r,schema:g.properties[r]})}return f.length===0?l`
      <div class="config-empty">
        <div class="config-empty__icon">${M.search}</div>
        <div class="config-empty__text">
          ${a?`No settings match "${a}"`:"No settings in this section"}
        </div>
      </div>
    `:l`
    <div class="config-form config-form--modern">
      ${y?(()=>{const{sectionKey:g,subsectionKey:c,schema:u}=y,b=T([g,c],e.uiHints),$=b?.label??u.title??K(c),w=b?.help??u.description??"",S=t[g],x=S&&typeof S=="object"?S[c]:void 0,A=`config-section-${g}-${c}`;return l`
              <section class="config-section-card" id=${A}>
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Un(g)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${$}</h3>
                    ${w?l`<p class="config-section-card__desc">${w}</p>`:v}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${D({schema:u,value:x,path:[g,c],hints:e.uiHints,unsupported:i,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})():f.map(([g,c])=>{const u=yn[g]??{label:g.charAt(0).toUpperCase()+g.slice(1),description:c.description??""};return l`
              <section class="config-section-card" id="config-section-${g}">
                <div class="config-section-card__header">
                  <span class="config-section-card__icon">${Un(g)}</span>
                  <div class="config-section-card__titles">
                    <h3 class="config-section-card__title">${u.label}</h3>
                    ${u.description?l`<p class="config-section-card__desc">${u.description}</p>`:v}
                  </div>
                </div>
                <div class="config-section-card__content">
                  ${D({schema:c,value:t[g],path:[g],hints:e.uiHints,unsupported:i,disabled:e.disabled??!1,showLabel:!1,onPatch:e.onPatch})}
                </div>
              </section>
            `})}
    </div>
  `}const jl=new Set(["title","description","default","nullable"]);function Hl(e){return Object.keys(e??{}).filter(t=>!jl.has(t)).length===0}function Gt(e){const n=e.filter(s=>s!=null),t=n.length!==e.length,i=[];for(const s of n)i.some(a=>Object.is(a,s))||i.push(s);return{enumValues:i,nullable:t}}function Wt(e){return!e||typeof e!="object"?{schema:null,unsupportedPaths:["<root>"]}:ie(e,[])}function ie(e,n){const t=new Set,i={...e},s=Ee(n)||"<root>";if(e.anyOf||e.oneOf||e.allOf){const r=zl(e,n);return r||{schema:e,unsupportedPaths:[s]}}const a=Array.isArray(e.type)&&e.type.includes("null"),o=B(e)??(e.properties||e.additionalProperties?"object":void 0);if(i.type=o??e.type,i.nullable=a||e.nullable,i.enum){const{enumValues:r,nullable:d}=Gt(i.enum);i.enum=r,d&&(i.nullable=!0),r.length===0&&t.add(s)}if(o==="object"){const r=e.properties??{},d={};for(const[f,y]of Object.entries(r)){const g=ie(y,[...n,f]);g.schema&&(d[f]=g.schema);for(const c of g.unsupportedPaths)t.add(c)}if(i.properties=d,e.additionalProperties===!0)t.add(s);else if(e.additionalProperties===!1)i.additionalProperties=!1;else if(e.additionalProperties&&typeof e.additionalProperties=="object"&&!Hl(e.additionalProperties)){const f=ie(e.additionalProperties,[...n,"*"]);i.additionalProperties=f.schema??e.additionalProperties,f.unsupportedPaths.length>0&&t.add(s)}}else if(o==="array"){const r=Array.isArray(e.items)?e.items[0]:e.items;if(!r)t.add(s);else{const d=ie(r,[...n,"*"]);i.items=d.schema??r,d.unsupportedPaths.length>0&&t.add(s)}}else o!=="string"&&o!=="number"&&o!=="integer"&&o!=="boolean"&&!i.enum&&t.add(s);return{schema:i,unsupportedPaths:Array.from(t)}}function zl(e,n){if(e.allOf)return null;const t=e.anyOf??e.oneOf;if(!t)return null;const i=[],s=[];let a=!1;for(const r of t){if(!r||typeof r!="object")return null;if(Array.isArray(r.enum)){const{enumValues:d,nullable:f}=Gt(r.enum);i.push(...d),f&&(a=!0);continue}if("const"in r){if(r.const==null){a=!0;continue}i.push(r.const);continue}if(B(r)==="null"){a=!0;continue}s.push(r)}if(i.length>0&&s.length===0){const r=[];for(const d of i)r.some(f=>Object.is(f,d))||r.push(d);return{schema:{...e,enum:r,nullable:a,anyOf:void 0,oneOf:void 0,allOf:void 0},unsupportedPaths:[]}}if(s.length===1){const r=ie(s[0],n);return r.schema&&(r.schema.nullable=a||r.schema.nullable),r}const o=new Set(["string","number","integer","boolean"]);return s.length>0&&i.length===0&&s.every(r=>r.type&&o.has(String(r.type)))?{schema:{...e,nullable:a},unsupportedPaths:[]}:null}function Vl(e,n){let t=e;for(const i of n){if(!t)return null;const s=B(t);if(s==="object"){const a=t.properties??{};if(typeof i=="string"&&a[i]){t=a[i];continue}const o=t.additionalProperties;if(typeof i=="string"&&o&&typeof o=="object"){t=o;continue}return null}if(s==="array"){if(typeof i!="number")return null;t=(Array.isArray(t.items)?t.items[0]:t.items)??null;continue}return null}return t}function ql(e,n){const i=(e.channels??{})[n],s=e[n];return(i&&typeof i=="object"?i:null)??(s&&typeof s=="object"?s:null)??{}}const Gl=["groupPolicy","streamMode","dmPolicy"];function Wl(e){if(e==null)return"n/a";if(typeof e=="string"||typeof e=="number"||typeof e=="boolean")return String(e);try{return JSON.stringify(e)}catch{return"n/a"}}function Ql(e){const n=Gl.flatMap(t=>t in e?[[t,e[t]]]:[]);return n.length===0?null:l`
    <div class="status-list" style="margin-top: 12px;">
      ${n.map(([t,i])=>l`
          <div>
            <span class="label">${t}</span>
            <span>${Wl(i)}</span>
          </div>
        `)}
    </div>
  `}function Jl(e){const n=Wt(e.schema),t=n.schema;if(!t)return l`
      <div class="callout danger">Schema unavailable. Use Raw.</div>
    `;const i=Vl(t,["channels",e.channelId]);if(!i)return l`
      <div class="callout danger">Channel config schema unavailable.</div>
    `;const s=e.configValue??{},a=ql(s,e.channelId);return l`
    <div class="config-form">
      ${D({schema:i,value:a,path:["channels",e.channelId],hints:e.uiHints,unsupported:new Set(n.unsupportedPaths),disabled:e.disabled,showLabel:!1,onPatch:e.onPatch})}
    </div>
    ${Ql(a)}
  `}function O(e){const{channelId:n,props:t}=e,i=t.configSaving||t.configSchemaLoading;return l`
    <div style="margin-top: 16px;">
      ${t.configSchemaLoading?l`
              <div class="muted">Loading config schema…</div>
            `:Jl({channelId:n,configValue:t.configForm,schema:t.configSchema,uiHints:t.configUiHints,disabled:i,onPatch:t.onConfigPatch})}
      <div class="row" style="margin-top: 12px;">
        <button
          class="btn primary"
          ?disabled=${i||!t.configFormDirty}
          @click=${()=>t.onConfigSave()}
        >
          ${t.configSaving?"Saving…":"Save"}
        </button>
        <button
          class="btn"
          ?disabled=${i}
          @click=${()=>t.onConfigReload()}
        >
          Reload
        </button>
      </div>
    </div>
  `}function Yl(e){const{props:n,discord:t,accountCountLabel:i}=e;return l`
    <div class="card">
      <div class="card-title">Discord</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${i}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${t?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${t?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${t?.lastStartAt?I(t.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${t?.lastProbeAt?I(t.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${t?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${t.lastError}
          </div>`:v}

      ${t?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${t.probe.ok?"ok":"failed"} ·
            ${t.probe.status??""} ${t.probe.error??""}
          </div>`:v}

      ${O({channelId:"discord",props:n})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>n.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Xl(e){const{props:n,googleChat:t,accountCountLabel:i}=e;return l`
    <div class="card">
      <div class="card-title">Google Chat</div>
      <div class="card-sub">Chat API webhook status and channel configuration.</div>
      ${i}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${t?t.configured?"Yes":"No":"n/a"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${t?t.running?"Yes":"No":"n/a"}</span>
        </div>
        <div>
          <span class="label">Credential</span>
          <span>${t?.credentialSource??"n/a"}</span>
        </div>
        <div>
          <span class="label">Audience</span>
          <span>
            ${t?.audienceType?`${t.audienceType}${t.audience?` · ${t.audience}`:""}`:"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${t?.lastStartAt?I(t.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${t?.lastProbeAt?I(t.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${t?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${t.lastError}
          </div>`:v}

      ${t?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${t.probe.ok?"ok":"failed"} ·
            ${t.probe.status??""} ${t.probe.error??""}
          </div>`:v}

      ${O({channelId:"googlechat",props:n})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>n.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function Zl(e){const{props:n,imessage:t,accountCountLabel:i}=e;return l`
    <div class="card">
      <div class="card-title">iMessage</div>
      <div class="card-sub">macOS bridge status and channel configuration.</div>
      ${i}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${t?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${t?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${t?.lastStartAt?I(t.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${t?.lastProbeAt?I(t.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${t?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${t.lastError}
          </div>`:v}

      ${t?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${t.probe.ok?"ok":"failed"} ·
            ${t.probe.error??""}
          </div>`:v}

      ${O({channelId:"imessage",props:n})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>n.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function jn(e){return e?e.length<=20?e:`${e.slice(0,8)}...${e.slice(-8)}`:"n/a"}function eo(e){const{props:n,nostr:t,nostrAccounts:i,accountCountLabel:s,profileFormState:a,profileFormCallbacks:o,onEditProfile:r}=e,d=i[0],f=t?.configured??d?.configured??!1,y=t?.running??d?.running??!1,g=t?.publicKey??d?.publicKey,c=t?.lastStartAt??d?.lastStartAt??null,u=t?.lastError??d?.lastError??null,b=i.length>1,$=a!=null,w=x=>{const A=x.publicKey,L=x.profile,C=L?.displayName??L?.name??x.name??x.accountId;return l`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">${C}</div>
          <div class="account-card-id">${x.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${x.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${x.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Public Key</span>
            <span class="monospace" title="${A??""}">${jn(A)}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${x.lastInboundAt?I(x.lastInboundAt):"n/a"}</span>
          </div>
          ${x.lastError?l`
                <div class="account-card-error">${x.lastError}</div>
              `:v}
        </div>
      </div>
    `},S=()=>{if($&&o)return _i({state:a,callbacks:o,accountId:i[0]?.accountId??"default"});const x=d?.profile??t?.profile,{name:A,displayName:L,about:C,picture:k,nip05:_}=x??{},ue=A||L||C||k||_;return l`
      <div style="margin-top: 16px; padding: 12px; background: var(--bg-secondary); border-radius: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <div style="font-weight: 500;">Profile</div>
          ${f?l`
                <button
                  class="btn btn-sm"
                  @click=${r}
                  style="font-size: 12px; padding: 4px 8px;"
                >
                  Edit Profile
                </button>
              `:v}
        </div>
        ${ue?l`
              <div class="status-list">
                ${k?l`
                      <div style="margin-bottom: 8px;">
                        <img
                          src=${k}
                          alt="Profile picture"
                          style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--border-color);"
                          @error=${wn=>{wn.target.style.display="none"}}
                        />
                      </div>
                    `:v}
                ${A?l`<div><span class="label">Name</span><span>${A}</span></div>`:v}
                ${L?l`<div><span class="label">Display Name</span><span>${L}</span></div>`:v}
                ${C?l`<div><span class="label">About</span><span style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${C}</span></div>`:v}
                ${_?l`<div><span class="label">NIP-05</span><span>${_}</span></div>`:v}
              </div>
            `:l`
                <div style="color: var(--text-muted); font-size: 13px">
                  No profile set. Click "Edit Profile" to add your name, bio, and avatar.
                </div>
              `}
      </div>
    `};return l`
    <div class="card">
      <div class="card-title">Nostr</div>
      <div class="card-sub">Decentralized DMs via Nostr relays (NIP-04).</div>
      ${s}

      ${b?l`
            <div class="account-card-list">
              ${i.map(x=>w(x))}
            </div>
          `:l`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${f?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${y?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Public Key</span>
                <span class="monospace" title="${g??""}"
                  >${jn(g)}</span
                >
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${c?I(c):"n/a"}</span>
              </div>
            </div>
          `}

      ${u?l`<div class="callout danger" style="margin-top: 12px;">${u}</div>`:v}

      ${S()}

      ${O({channelId:"nostr",props:n})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>n.onRefresh(!1)}>Refresh</button>
      </div>
    </div>
  `}function no(e){if(!e&&e!==0)return"n/a";const n=Math.round(e/1e3);if(n<60)return`${n}s`;const t=Math.round(n/60);return t<60?`${t}m`:`${Math.round(t/60)}h`}function to(e,n){const t=n.snapshot,i=t?.channels;if(!t||!i)return!1;const s=i[e],a=typeof s?.configured=="boolean"&&s.configured,o=typeof s?.running=="boolean"&&s.running,r=typeof s?.connected=="boolean"&&s.connected,f=(t.channelAccounts?.[e]??[]).some(y=>y.configured||y.running||y.connected);return a||o||r||f}function io(e,n){return n?.[e]?.length??0}function Qt(e,n){const t=io(e,n);return t<2?v:l`<div class="account-count">Accounts (${t})</div>`}function so(e){const{props:n,signal:t,accountCountLabel:i}=e;return l`
    <div class="card">
      <div class="card-title">Signal</div>
      <div class="card-sub">signal-cli status and channel configuration.</div>
      ${i}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${t?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${t?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Base URL</span>
          <span>${t?.baseUrl??"n/a"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${t?.lastStartAt?I(t.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${t?.lastProbeAt?I(t.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${t?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${t.lastError}
          </div>`:v}

      ${t?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${t.probe.ok?"ok":"failed"} ·
            ${t.probe.status??""} ${t.probe.error??""}
          </div>`:v}

      ${O({channelId:"signal",props:n})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>n.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function ao(e){const{props:n,slack:t,accountCountLabel:i}=e;return l`
    <div class="card">
      <div class="card-title">Slack</div>
      <div class="card-sub">Socket mode status and channel configuration.</div>
      ${i}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${t?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${t?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last start</span>
          <span>${t?.lastStartAt?I(t.lastStartAt):"n/a"}</span>
        </div>
        <div>
          <span class="label">Last probe</span>
          <span>${t?.lastProbeAt?I(t.lastProbeAt):"n/a"}</span>
        </div>
      </div>

      ${t?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${t.lastError}
          </div>`:v}

      ${t?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${t.probe.ok?"ok":"failed"} ·
            ${t.probe.status??""} ${t.probe.error??""}
          </div>`:v}

      ${O({channelId:"slack",props:n})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>n.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function lo(e){const{props:n,telegram:t,telegramAccounts:i,accountCountLabel:s}=e,a=i.length>1,o=r=>{const f=r.probe?.bot?.username,y=r.name||r.accountId;return l`
      <div class="account-card">
        <div class="account-card-header">
          <div class="account-card-title">
            ${f?`@${f}`:y}
          </div>
          <div class="account-card-id">${r.accountId}</div>
        </div>
        <div class="status-list account-card-status">
          <div>
            <span class="label">Running</span>
            <span>${r.running?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Configured</span>
            <span>${r.configured?"Yes":"No"}</span>
          </div>
          <div>
            <span class="label">Last inbound</span>
            <span>${r.lastInboundAt?I(r.lastInboundAt):"n/a"}</span>
          </div>
          ${r.lastError?l`
                <div class="account-card-error">
                  ${r.lastError}
                </div>
              `:v}
        </div>
      </div>
    `};return l`
    <div class="card">
      <div class="card-title">Telegram</div>
      <div class="card-sub">Bot status and channel configuration.</div>
      ${s}

      ${a?l`
            <div class="account-card-list">
              ${i.map(r=>o(r))}
            </div>
          `:l`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${t?.configured?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${t?.running?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Mode</span>
                <span>${t?.mode??"n/a"}</span>
              </div>
              <div>
                <span class="label">Last start</span>
                <span>${t?.lastStartAt?I(t.lastStartAt):"n/a"}</span>
              </div>
              <div>
                <span class="label">Last probe</span>
                <span>${t?.lastProbeAt?I(t.lastProbeAt):"n/a"}</span>
              </div>
            </div>
          `}

      ${t?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${t.lastError}
          </div>`:v}

      ${t?.probe?l`<div class="callout" style="margin-top: 12px;">
            Probe ${t.probe.ok?"ok":"failed"} ·
            ${t.probe.status??""} ${t.probe.error??""}
          </div>`:v}

      ${O({channelId:"telegram",props:n})}

      <div class="row" style="margin-top: 12px;">
        <button class="btn" @click=${()=>n.onRefresh(!0)}>
          Probe
        </button>
      </div>
    </div>
  `}function oo(e){const{props:n,whatsapp:t,accountCountLabel:i}=e;return l`
    <div class="card">
      <div class="card-title">WhatsApp</div>
      <div class="card-sub">Link WhatsApp Web and monitor connection health.</div>
      ${i}

      <div class="status-list" style="margin-top: 16px;">
        <div>
          <span class="label">Configured</span>
          <span>${t?.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Linked</span>
          <span>${t?.linked?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Running</span>
          <span>${t?.running?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${t?.connected?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Last connect</span>
          <span>
            ${t?.lastConnectedAt?I(t.lastConnectedAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Last message</span>
          <span>
            ${t?.lastMessageAt?I(t.lastMessageAt):"n/a"}
          </span>
        </div>
        <div>
          <span class="label">Auth age</span>
          <span>
            ${t?.authAgeMs!=null?no(t.authAgeMs):"n/a"}
          </span>
        </div>
      </div>

      ${t?.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${t.lastError}
          </div>`:v}

      ${n.whatsappMessage?l`<div class="callout" style="margin-top: 12px;">
            ${n.whatsappMessage}
          </div>`:v}

      ${n.whatsappQrDataUrl?l`<div class="qr-wrap">
            <img src=${n.whatsappQrDataUrl} alt="WhatsApp QR" />
          </div>`:v}

      <div class="row" style="margin-top: 14px; flex-wrap: wrap;">
        <button
          class="btn primary"
          ?disabled=${n.whatsappBusy}
          @click=${()=>n.onWhatsAppStart(!1)}
        >
          ${n.whatsappBusy?"Working…":"Show QR"}
        </button>
        <button
          class="btn"
          ?disabled=${n.whatsappBusy}
          @click=${()=>n.onWhatsAppStart(!0)}
        >
          Relink
        </button>
        <button
          class="btn"
          ?disabled=${n.whatsappBusy}
          @click=${()=>n.onWhatsAppWait()}
        >
          Wait for scan
        </button>
        <button
          class="btn danger"
          ?disabled=${n.whatsappBusy}
          @click=${()=>n.onWhatsAppLogout()}
        >
          Logout
        </button>
        <button class="btn" @click=${()=>n.onRefresh(!0)}>
          Refresh
        </button>
      </div>

      ${O({channelId:"whatsapp",props:n})}
    </div>
  `}function ro(e){const n=e.snapshot?.channels,t=n?.whatsapp??void 0,i=n?.telegram??void 0,s=n?.discord??null;n?.googlechat;const a=n?.slack??null,o=n?.signal??null,r=n?.imessage??null,d=n?.nostr??null,y=co(e.snapshot).map((g,c)=>({key:g,enabled:to(g,e),order:c})).toSorted((g,c)=>g.enabled!==c.enabled?g.enabled?-1:1:g.order-c.order);return l`
    <section class="grid grid-cols-2">
      ${y.map(g=>uo(g.key,e,{whatsapp:t,telegram:i,discord:s,slack:a,signal:o,imessage:r,nostr:d,channelAccounts:e.snapshot?.channelAccounts??null}))}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Channel health</div>
          <div class="card-sub">Channel status snapshots from the gateway.</div>
        </div>
        <div class="muted">${e.lastSuccessAt?I(e.lastSuccessAt):"n/a"}</div>
      </div>
      ${e.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:v}
      <pre class="code-block" style="margin-top: 12px;">
${e.snapshot?JSON.stringify(e.snapshot,null,2):"No snapshot yet."}
      </pre>
    </section>
  `}function co(e){return e?.channelMeta?.length?e.channelMeta.map(n=>n.id):e?.channelOrder?.length?e.channelOrder:["whatsapp","telegram","discord","googlechat","slack","signal","imessage","nostr"]}function uo(e,n,t){const i=Qt(e,t.channelAccounts);switch(e){case"whatsapp":return oo({props:n,whatsapp:t.whatsapp,accountCountLabel:i});case"telegram":return lo({props:n,telegram:t.telegram,telegramAccounts:t.channelAccounts?.telegram??[],accountCountLabel:i});case"discord":return Yl({props:n,discord:t.discord,accountCountLabel:i});case"googlechat":return Xl({props:n,accountCountLabel:i});case"slack":return ao({props:n,slack:t.slack,accountCountLabel:i});case"signal":return so({props:n,signal:t.signal,accountCountLabel:i});case"imessage":return Zl({props:n,imessage:t.imessage,accountCountLabel:i});case"nostr":{const s=t.channelAccounts?.nostr??[],a=s[0],o=a?.accountId??"default",r=a?.profile??null,d=n.nostrProfileAccountId===o?n.nostrProfileFormState:null,f=d?{onFieldChange:n.onNostrProfileFieldChange,onSave:n.onNostrProfileSave,onImport:n.onNostrProfileImport,onCancel:n.onNostrProfileCancel,onToggleAdvanced:n.onNostrProfileToggleAdvanced}:null;return eo({props:n,nostr:t.nostr,nostrAccounts:s,accountCountLabel:i,profileFormState:d,profileFormCallbacks:f,onEditProfile:()=>n.onNostrProfileEdit(o,r)})}default:return go(e,n,t.channelAccounts??{})}}function go(e,n,t){const i=fo(n.snapshot,e),s=n.snapshot?.channels?.[e],a=typeof s?.configured=="boolean"?s.configured:void 0,o=typeof s?.running=="boolean"?s.running:void 0,r=typeof s?.connected=="boolean"?s.connected:void 0,d=typeof s?.lastError=="string"?s.lastError:void 0,f=t[e]??[],y=Qt(e,t);return l`
    <div class="card">
      <div class="card-title">${i}</div>
      <div class="card-sub">Channel status and configuration.</div>
      ${y}

      ${f.length>0?l`
            <div class="account-card-list">
              ${f.map(g=>yo(g))}
            </div>
          `:l`
            <div class="status-list" style="margin-top: 16px;">
              <div>
                <span class="label">Configured</span>
                <span>${a==null?"n/a":a?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Running</span>
                <span>${o==null?"n/a":o?"Yes":"No"}</span>
              </div>
              <div>
                <span class="label">Connected</span>
                <span>${r==null?"n/a":r?"Yes":"No"}</span>
              </div>
            </div>
          `}

      ${d?l`<div class="callout danger" style="margin-top: 12px;">
            ${d}
          </div>`:v}

      ${O({channelId:e,props:n})}
    </div>
  `}function vo(e){return e?.channelMeta?.length?Object.fromEntries(e.channelMeta.map(n=>[n.id,n])):{}}function fo(e,n){return vo(e)[n]?.label??e?.channelLabels?.[n]??n}const po=600*1e3;function Jt(e){return e.lastInboundAt?Date.now()-e.lastInboundAt<po:!1}function ho(e){return e.running?"Yes":Jt(e)?"Active":"No"}function mo(e){return e.connected===!0?"Yes":e.connected===!1?"No":Jt(e)?"Active":"n/a"}function yo(e){const n=ho(e),t=mo(e);return l`
    <div class="account-card">
      <div class="account-card-header">
        <div class="account-card-title">${e.name||e.accountId}</div>
        <div class="account-card-id">${e.accountId}</div>
      </div>
      <div class="status-list account-card-status">
        <div>
          <span class="label">Running</span>
          <span>${n}</span>
        </div>
        <div>
          <span class="label">Configured</span>
          <span>${e.configured?"Yes":"No"}</span>
        </div>
        <div>
          <span class="label">Connected</span>
          <span>${t}</span>
        </div>
        <div>
          <span class="label">Last inbound</span>
          <span>${e.lastInboundAt?I(e.lastInboundAt):"n/a"}</span>
        </div>
        ${e.lastError?l`
              <div class="account-card-error">
                ${e.lastError}
              </div>
            `:v}
      </div>
    </div>
  `}const se=(e,n)=>{const t=e._$AN;if(t===void 0)return!1;for(const i of t)i._$AO?.(n,!1),se(i,n);return!0},$e=e=>{let n,t;do{if((n=e._$AM)===void 0)break;t=n._$AN,t.delete(e),e=n}while(t?.size===0)},Yt=e=>{for(let n;n=e._$AM;e=n){let t=n._$AN;if(t===void 0)n._$AN=t=new Set;else if(t.has(e))break;t.add(e),wo(n)}};function bo(e){this._$AN!==void 0?($e(this),this._$AM=e,Yt(this)):this._$AM=e}function $o(e,n=!1,t=0){const i=this._$AH,s=this._$AN;if(s!==void 0&&s.size!==0)if(n)if(Array.isArray(i))for(let a=t;a<i.length;a++)se(i[a],!1),$e(i[a]);else i!=null&&(se(i,!1),$e(i));else se(this,e)}const wo=e=>{e.type==lt.CHILD&&(e._$AP??=$o,e._$AQ??=bo)};class So extends at{constructor(){super(...arguments),this._$AN=void 0}_$AT(n,t,i){super._$AT(n,t,i),Yt(this),this.isConnected=n._$AU}_$AO(n,t=!0){n!==this.isConnected&&(this.isConnected=n,n?this.reconnected?.():this.disconnected?.()),t&&(se(this,n),$e(this))}setValue(n){if(Ra(this._$Ct))this._$Ct._$AI(n,this);else{const t=[...this._$Ct._$AH];t[this._$Ci]=n,this._$Ct._$AI(t,this,0)}}disconnected(){}reconnected(){}}const He=new WeakMap,xo=st(class extends So{render(e){return v}update(e,[n]){const t=n!==this.G;return t&&this.G!==void 0&&this.rt(void 0),(t||this.lt!==this.ct)&&(this.G=n,this.ht=e.options?.host,this.rt(this.ct=e.element)),v}rt(e){if(this.isConnected||(e=void 0),typeof this.G=="function"){const n=this.ht??globalThis;let t=He.get(n);t===void 0&&(t=new WeakMap,He.set(n,t)),t.get(this.G)!==void 0&&this.G.call(this.ht,void 0),t.set(this.G,e),e!==void 0&&this.G.call(this.ht,e)}else this.G.value=e}get lt(){return typeof this.G=="function"?He.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}}),ko=1500,Ao=2e3,Xt="Copy as markdown",Co="Copied",Lo="Copy failed";async function _o(e){if(!e)return!1;try{return await navigator.clipboard.writeText(e),!0}catch{return!1}}function pe(e,n){e.title=n,e.setAttribute("aria-label",n)}function Io(e){const n=e.label??Xt;return l`
    <button
      class="chat-copy-btn"
      type="button"
      title=${n}
      aria-label=${n}
      @click=${async t=>{const i=t.currentTarget;if(!i||i.dataset.copying==="1")return;i.dataset.copying="1",i.setAttribute("aria-busy","true"),i.disabled=!0;const s=await _o(e.text());if(i.isConnected){if(delete i.dataset.copying,i.removeAttribute("aria-busy"),i.disabled=!1,!s){i.dataset.error="1",pe(i,Lo),window.setTimeout(()=>{i.isConnected&&(delete i.dataset.error,pe(i,n))},Ao);return}i.dataset.copied="1",pe(i,Co),window.setTimeout(()=>{i.isConnected&&(delete i.dataset.copied,pe(i,n))},ko)}}}
    >
      <span class="chat-copy-btn__icon" aria-hidden="true">
        <span class="chat-copy-btn__icon-copy">${M.copy}</span>
        <span class="chat-copy-btn__icon-check">${M.check}</span>
      </span>
    </button>
  `}function Mo(e){return Io({text:()=>e,label:Xt})}function Zt(e){const n=e;let t=typeof n.role=="string"?n.role:"unknown";const i=typeof n.toolCallId=="string"||typeof n.tool_call_id=="string",s=n.content,a=Array.isArray(s)?s:null,o=Array.isArray(a)&&a.some(g=>{const c=g,u=(typeof c.type=="string"?c.type:"").toLowerCase();return u==="toolresult"||u==="tool_result"}),r=typeof n.toolName=="string"||typeof n.tool_name=="string";(i||o||r)&&(t="toolResult");let d=[];typeof n.content=="string"?d=[{type:"text",text:n.content}]:Array.isArray(n.content)?d=n.content.map(g=>({type:g.type||"text",text:g.text,name:g.name,args:g.args||g.arguments})):typeof n.text=="string"&&(d=[{type:"text",text:n.text}]);const f=typeof n.timestamp=="number"?n.timestamp:Date.now(),y=typeof n.id=="string"?n.id:void 0;return{role:t,content:d,timestamp:f,id:y}}function bn(e){const n=e.toLowerCase();return e==="user"||e==="User"?e:e==="assistant"?"assistant":e==="system"?"system":n==="toolresult"||n==="tool_result"||n==="tool"||n==="function"?"tool":e}function ei(e){const n=e,t=typeof n.role=="string"?n.role.toLowerCase():"";return t==="toolresult"||t==="tool_result"}const Eo={icon:"puzzle",detailKeys:["command","path","url","targetUrl","targetId","ref","element","node","nodeId","id","requestId","to","channelId","guildId","userId","name","query","pattern","messageId"]},Fo={bash:{icon:"wrench",title:"Bash",detailKeys:["command"]},process:{icon:"wrench",title:"Process",detailKeys:["sessionId"]},read:{icon:"fileText",title:"Read",detailKeys:["path"]},write:{icon:"edit",title:"Write",detailKeys:["path"]},edit:{icon:"penLine",title:"Edit",detailKeys:["path"]},attach:{icon:"paperclip",title:"Attach",detailKeys:["path","url","fileName"]},browser:{icon:"globe",title:"Browser",actions:{status:{label:"status"},start:{label:"start"},stop:{label:"stop"},tabs:{label:"tabs"},open:{label:"open",detailKeys:["targetUrl"]},focus:{label:"focus",detailKeys:["targetId"]},close:{label:"close",detailKeys:["targetId"]},snapshot:{label:"snapshot",detailKeys:["targetUrl","targetId","ref","element","format"]},screenshot:{label:"screenshot",detailKeys:["targetUrl","targetId","ref","element"]},navigate:{label:"navigate",detailKeys:["targetUrl","targetId"]},console:{label:"console",detailKeys:["level","targetId"]},pdf:{label:"pdf",detailKeys:["targetId"]},upload:{label:"upload",detailKeys:["paths","ref","inputRef","element","targetId"]},dialog:{label:"dialog",detailKeys:["accept","promptText","targetId"]},act:{label:"act",detailKeys:["request.kind","request.ref","request.selector","request.text","request.value"]}}},canvas:{icon:"image",title:"Canvas",actions:{present:{label:"present",detailKeys:["target","node","nodeId"]},hide:{label:"hide",detailKeys:["node","nodeId"]},navigate:{label:"navigate",detailKeys:["url","node","nodeId"]},eval:{label:"eval",detailKeys:["javaScript","node","nodeId"]},snapshot:{label:"snapshot",detailKeys:["format","node","nodeId"]},a2ui_push:{label:"A2UI push",detailKeys:["jsonlPath","node","nodeId"]},a2ui_reset:{label:"A2UI reset",detailKeys:["node","nodeId"]}}},nodes:{icon:"smartphone",title:"Nodes",actions:{status:{label:"status"},describe:{label:"describe",detailKeys:["node","nodeId"]},pending:{label:"pending"},approve:{label:"approve",detailKeys:["requestId"]},reject:{label:"reject",detailKeys:["requestId"]},notify:{label:"notify",detailKeys:["node","nodeId","title","body"]},camera_snap:{label:"camera snap",detailKeys:["node","nodeId","facing","deviceId"]},camera_list:{label:"camera list",detailKeys:["node","nodeId"]},camera_clip:{label:"camera clip",detailKeys:["node","nodeId","facing","duration","durationMs"]},screen_record:{label:"screen record",detailKeys:["node","nodeId","duration","durationMs","fps","screenIndex"]}}},cron:{icon:"loader",title:"Cron",actions:{status:{label:"status"},list:{label:"list"},add:{label:"add",detailKeys:["job.name","job.id","job.schedule","job.cron"]},update:{label:"update",detailKeys:["id"]},remove:{label:"remove",detailKeys:["id"]},run:{label:"run",detailKeys:["id"]},runs:{label:"runs",detailKeys:["id"]},wake:{label:"wake",detailKeys:["text","mode"]}}},gateway:{icon:"plug",title:"Gateway",actions:{restart:{label:"restart",detailKeys:["reason","delayMs"]},"config.get":{label:"config get"},"config.schema":{label:"config schema"},"config.apply":{label:"config apply",detailKeys:["restartDelayMs"]},"update.run":{label:"update run",detailKeys:["restartDelayMs"]}}},whatsapp_login:{icon:"circle",title:"WhatsApp Login",actions:{start:{label:"start"},wait:{label:"wait"}}},discord:{icon:"messageSquare",title:"Discord",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sticker:{label:"sticker",detailKeys:["to","stickerIds"]},poll:{label:"poll",detailKeys:["question","to"]},permissions:{label:"permissions",detailKeys:["channelId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},threadCreate:{label:"thread create",detailKeys:["channelId","name"]},threadList:{label:"thread list",detailKeys:["guildId","channelId"]},threadReply:{label:"thread reply",detailKeys:["channelId","content"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},searchMessages:{label:"search",detailKeys:["guildId","content"]},memberInfo:{label:"member",detailKeys:["guildId","userId"]},roleInfo:{label:"roles",detailKeys:["guildId"]},emojiList:{label:"emoji list",detailKeys:["guildId"]},roleAdd:{label:"role add",detailKeys:["guildId","userId","roleId"]},roleRemove:{label:"role remove",detailKeys:["guildId","userId","roleId"]},channelInfo:{label:"channel",detailKeys:["channelId"]},channelList:{label:"channels",detailKeys:["guildId"]},voiceStatus:{label:"voice",detailKeys:["guildId","userId"]},eventList:{label:"events",detailKeys:["guildId"]},eventCreate:{label:"event create",detailKeys:["guildId","name"]},timeout:{label:"timeout",detailKeys:["guildId","userId"]},kick:{label:"kick",detailKeys:["guildId","userId"]},ban:{label:"ban",detailKeys:["guildId","userId"]}}},slack:{icon:"messageSquare",title:"Slack",actions:{react:{label:"react",detailKeys:["channelId","messageId","emoji"]},reactions:{label:"reactions",detailKeys:["channelId","messageId"]},sendMessage:{label:"send",detailKeys:["to","content"]},editMessage:{label:"edit",detailKeys:["channelId","messageId"]},deleteMessage:{label:"delete",detailKeys:["channelId","messageId"]},readMessages:{label:"read messages",detailKeys:["channelId","limit"]},pinMessage:{label:"pin",detailKeys:["channelId","messageId"]},unpinMessage:{label:"unpin",detailKeys:["channelId","messageId"]},listPins:{label:"list pins",detailKeys:["channelId"]},memberInfo:{label:"member",detailKeys:["userId"]},emojiList:{label:"emoji list"}}}},To={fallback:Eo,tools:Fo},ni=To,Hn=ni.fallback??{icon:"puzzle"},Ro=ni.tools??{};function Po(e){return(e??"tool").trim()}function Bo(e){const n=e.replace(/_/g," ").trim();return n?n.split(/\s+/).map(t=>t.length<=2&&t.toUpperCase()===t?t:`${t.at(0)?.toUpperCase()??""}${t.slice(1)}`).join(" "):"Tool"}function No(e){const n=e?.trim();if(n)return n.replace(/_/g," ")}function ti(e){if(e!=null){if(typeof e=="string"){const n=e.trim();if(!n)return;const t=n.split(/\r?\n/)[0]?.trim()??"";return t?t.length>160?`${t.slice(0,157)}…`:t:void 0}if(typeof e=="number"||typeof e=="boolean")return String(e);if(Array.isArray(e)){const n=e.map(i=>ti(i)).filter(i=>!!i);if(n.length===0)return;const t=n.slice(0,3).join(", ");return n.length>3?`${t}…`:t}}}function Do(e,n){if(!e||typeof e!="object")return;let t=e;for(const i of n.split(".")){if(!i||!t||typeof t!="object")return;t=t[i]}return t}function Ko(e,n){for(const t of n){const i=Do(e,t),s=ti(i);if(s)return s}}function Oo(e){if(!e||typeof e!="object")return;const n=e,t=typeof n.path=="string"?n.path:void 0;if(!t)return;const i=typeof n.offset=="number"?n.offset:void 0,s=typeof n.limit=="number"?n.limit:void 0;return i!==void 0&&s!==void 0?`${t}:${i}-${i+s}`:t}function Uo(e){if(!e||typeof e!="object")return;const n=e;return typeof n.path=="string"?n.path:void 0}function jo(e,n){if(!(!e||!n))return e.actions?.[n]??void 0}function Ho(e){const n=Po(e.name),t=n.toLowerCase(),i=Ro[t],s=i?.icon??Hn.icon??"puzzle",a=i?.title??Bo(n),o=i?.label??n,r=e.args&&typeof e.args=="object"?e.args.action:void 0,d=typeof r=="string"?r.trim():void 0,f=jo(i,d),y=No(f?.label??d);let g;t==="read"&&(g=Oo(e.args)),!g&&(t==="write"||t==="edit"||t==="attach")&&(g=Uo(e.args));const c=f?.detailKeys??i?.detailKeys??Hn.detailKeys??[];return!g&&c.length>0&&(g=Ko(e.args,c)),!g&&e.meta&&(g=e.meta),g&&(g=Vo(g)),{name:n,icon:s,title:a,label:o,verb:y,detail:g}}function zo(e){const n=[];if(e.verb&&n.push(e.verb),e.detail&&n.push(e.detail),n.length!==0)return n.join(" · ")}function Vo(e){return e&&e.replace(/\/Users\/[^/]+/g,"~").replace(/\/home\/[^/]+/g,"~")}const qo=80,Go=2,zn=100;function Wo(e){const n=e.trim();if(n.startsWith("{")||n.startsWith("["))try{const t=JSON.parse(n);return"```json\n"+JSON.stringify(t,null,2)+"\n```"}catch{}return e}function Qo(e){const n=e.split(`
`),t=n.slice(0,Go),i=t.join(`
`);return i.length>zn?i.slice(0,zn)+"…":t.length<n.length?i+"…":i}function Jo(e){const n=e,t=Yo(n.content),i=[];for(const s of t){const a=(typeof s.type=="string"?s.type:"").toLowerCase();(["toolcall","tool_call","tooluse","tool_use"].includes(a)||typeof s.name=="string"&&s.arguments!=null)&&i.push({kind:"call",name:s.name??"tool",args:Xo(s.arguments??s.args)})}for(const s of t){const a=(typeof s.type=="string"?s.type:"").toLowerCase();if(a!=="toolresult"&&a!=="tool_result")continue;const o=Zo(s),r=typeof s.name=="string"?s.name:"tool";i.push({kind:"result",name:r,text:o})}if(ei(e)&&!i.some(s=>s.kind==="result")){const s=typeof n.toolName=="string"&&n.toolName||typeof n.tool_name=="string"&&n.tool_name||"tool",a=_t(e)??void 0;i.push({kind:"result",name:s,text:a})}return i}function Vn(e,n){const t=Ho({name:e.name,args:e.args}),i=zo(t),s=!!e.text?.trim(),a=!!n,o=a?()=>{if(s){n(Wo(e.text));return}const g=`## ${t.label}

${i?`**Command:** \`${i}\`

`:""}*No output — tool completed successfully.*`;n(g)}:void 0,r=s&&(e.text?.length??0)<=qo,d=s&&!r,f=s&&r,y=!s;return l`
    <div
      class="chat-tool-card ${a?"chat-tool-card--clickable":""}"
      @click=${o}
      role=${a?"button":v}
      tabindex=${a?"0":v}
      @keydown=${a?g=>{g.key!=="Enter"&&g.key!==" "||(g.preventDefault(),o?.())}:v}
    >
      <div class="chat-tool-card__header">
        <div class="chat-tool-card__title">
          <span class="chat-tool-card__icon">${M[t.icon]}</span>
          <span>${t.label}</span>
        </div>
        ${a?l`<span class="chat-tool-card__action">${s?"View":""} ${M.check}</span>`:v}
        ${y&&!a?l`<span class="chat-tool-card__status">${M.check}</span>`:v}
      </div>
      ${i?l`<div class="chat-tool-card__detail">${i}</div>`:v}
      ${y?l`
              <div class="chat-tool-card__status-text muted">Completed</div>
            `:v}
      ${d?l`<div class="chat-tool-card__preview mono">${Qo(e.text)}</div>`:v}
      ${f?l`<div class="chat-tool-card__inline mono">${e.text}</div>`:v}
    </div>
  `}function Yo(e){return Array.isArray(e)?e.filter(Boolean):[]}function Xo(e){if(typeof e!="string")return e;const n=e.trim();if(!n||!n.startsWith("{")&&!n.startsWith("["))return e;try{return JSON.parse(n)}catch{return e}}function Zo(e){if(typeof e.text=="string")return e.text;if(typeof e.content=="string")return e.content}function er(e){const t=e.content,i=[];if(Array.isArray(t))for(const s of t){if(typeof s!="object"||s===null)continue;const a=s;if(a.type==="image"){const o=a.source;if(o?.type==="base64"&&typeof o.data=="string"){const r=o.data,d=o.media_type||"image/png",f=r.startsWith("data:")?r:`data:${d};base64,${r}`;i.push({url:f})}else typeof a.url=="string"&&i.push({url:a.url})}else if(a.type==="image_url"){const o=a.image_url;typeof o?.url=="string"&&i.push({url:o.url})}}return i}function nr(e){return l`
    <div class="chat-group assistant">
      ${$n("assistant",e)}
      <div class="chat-group-messages">
        <div class="chat-bubble chat-reading-indicator" aria-hidden="true">
          <span class="chat-reading-indicator__dots">
            <span></span><span></span><span></span>
          </span>
        </div>
      </div>
    </div>
  `}function tr(e,n,t,i){const s=new Date(n).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"}),a=i?.name??"Assistant";return l`
    <div class="chat-group assistant">
      ${$n("assistant",i)}
      <div class="chat-group-messages">
        ${ii({role:"assistant",content:[{type:"text",text:e}],timestamp:n},{isStreaming:!0,showReasoning:!1},t)}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${a}</span>
          <span class="chat-group-timestamp">${s}</span>
        </div>
      </div>
    </div>
  `}function ir(e,n){const t=bn(e.role),i=n.assistantName??"Assistant",s=t==="user"?"You":t==="assistant"?i:t,a=t==="user"?"user":t==="assistant"?"assistant":"other",o=new Date(e.timestamp).toLocaleTimeString([],{hour:"numeric",minute:"2-digit"});return l`
    <div class="chat-group ${a}">
      ${$n(e.role,{name:i,avatar:n.assistantAvatar??null})}
      <div class="chat-group-messages">
        ${e.messages.map((r,d)=>ii(r.message,{isStreaming:e.isStreaming&&d===e.messages.length-1,showReasoning:n.showReasoning},n.onOpenSidebar))}
        <div class="chat-group-footer">
          <span class="chat-sender-name">${s}</span>
          <span class="chat-group-timestamp">${o}</span>
        </div>
      </div>
    </div>
  `}function $n(e,n){const t=bn(e),i=n?.name?.trim()||"Assistant",s=n?.avatar?.trim()||"",a=t==="user"?"U":t==="assistant"?i.charAt(0).toUpperCase()||"A":t==="tool"?"⚙":"?",o=t==="user"?"user":t==="assistant"?"assistant":t==="tool"?"tool":"other";return s&&t==="assistant"?sr(s)?l`<img
        class="chat-avatar ${o}"
        src="${s}"
        alt="${i}"
      />`:l`<div class="chat-avatar ${o}">${s}</div>`:l`<div class="chat-avatar ${o}">${a}</div>`}function sr(e){return/^https?:\/\//i.test(e)||/^data:image\//i.test(e)||e.startsWith("/")}function ar(e){return e.length===0?v:l`
    <div class="chat-message-images">
      ${e.map(n=>l`
          <img
            src=${n.url}
            alt=${n.alt??"Attached image"}
            class="chat-message-image"
            @click=${()=>window.open(n.url,"_blank")}
          />
        `)}
    </div>
  `}function ii(e,n,t){const i=e,s=typeof i.role=="string"?i.role:"unknown",a=ei(e)||s.toLowerCase()==="toolresult"||s.toLowerCase()==="tool_result"||typeof i.toolCallId=="string"||typeof i.tool_call_id=="string",o=Jo(e),r=o.length>0,d=er(e),f=d.length>0,y=_t(e),g=n.showReasoning&&s==="assistant"?na(e):null,c=y?.trim()?y:null,u=g?ia(g):null,b=c,$=s==="assistant"&&!!b?.trim(),w=["chat-bubble",$?"has-copy":"",n.isStreaming?"streaming":"","fade-in"].filter(Boolean).join(" ");return!b&&r&&a?l`${o.map(S=>Vn(S,t))}`:!b&&!r&&!f?v:l`
    <div class="${w}">
      ${$?Mo(b):v}
      ${ar(d)}
      ${u?l`<div class="chat-thinking">${qe(Ge(u))}</div>`:v}
      ${b?l`<div class="chat-text">${qe(Ge(b))}</div>`:v}
      ${o.map(S=>Vn(S,t))}
    </div>
  `}function lr(e){return l`
    <div class="sidebar-panel">
      <div class="sidebar-header">
        <div class="sidebar-title">Tool Output</div>
        <button @click=${e.onClose} class="btn" title="Close sidebar">
          ${M.x}
        </button>
      </div>
      <div class="sidebar-content">
        ${e.error?l`
              <div class="callout danger">${e.error}</div>
              <button @click=${e.onViewRawText} class="btn" style="margin-top: 12px;">
                View Raw Text
              </button>
            `:e.content?l`<div class="sidebar-markdown">${qe(Ge(e.content))}</div>`:l`
                  <div class="muted">No content available</div>
                `}
      </div>
    </div>
  `}var or=Object.defineProperty,rr=Object.getOwnPropertyDescriptor,Fe=(e,n,t,i)=>{for(var s=i>1?void 0:i?rr(n,t):n,a=e.length-1,o;a>=0;a--)(o=e[a])&&(s=(i?o(n,t,s):o(s))||s);return i&&s&&or(n,t,s),s};let Y=class extends rt{constructor(){super(...arguments),this.splitRatio=.6,this.minRatio=.4,this.maxRatio=.7,this.isDragging=!1,this.startX=0,this.startRatio=0,this.handleMouseDown=e=>{this.isDragging=!0,this.startX=e.clientX,this.startRatio=this.splitRatio,this.classList.add("dragging"),document.addEventListener("mousemove",this.handleMouseMove),document.addEventListener("mouseup",this.handleMouseUp),e.preventDefault()},this.handleMouseMove=e=>{if(!this.isDragging)return;const n=this.parentElement;if(!n)return;const t=n.getBoundingClientRect().width,s=(e.clientX-this.startX)/t;let a=this.startRatio+s;a=Math.max(this.minRatio,Math.min(this.maxRatio,a)),this.dispatchEvent(new CustomEvent("resize",{detail:{splitRatio:a},bubbles:!0,composed:!0}))},this.handleMouseUp=()=>{this.isDragging=!1,this.classList.remove("dragging"),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}}render(){return v}connectedCallback(){super.connectedCallback(),this.addEventListener("mousedown",this.handleMouseDown)}disconnectedCallback(){super.disconnectedCallback(),this.removeEventListener("mousedown",this.handleMouseDown),document.removeEventListener("mousemove",this.handleMouseMove),document.removeEventListener("mouseup",this.handleMouseUp)}};Y.styles=mi`
    :host {
      width: 4px;
      cursor: col-resize;
      background: var(--border, #333);
      transition: background 150ms ease-out;
      flex-shrink: 0;
      position: relative;
    }
    :host::before {
      content: "";
      position: absolute;
      top: 0;
      left: -4px;
      right: -4px;
      bottom: 0;
    }
    :host(:hover) {
      background: var(--accent, #007bff);
    }
    :host(.dragging) {
      background: var(--accent, #007bff);
    }
  `;Fe([we({type:Number})],Y.prototype,"splitRatio",2);Fe([we({type:Number})],Y.prototype,"minRatio",2);Fe([we({type:Number})],Y.prototype,"maxRatio",2);Y=Fe([ct("resizable-divider")],Y);const cr=5e3;function qn(e){e.style.height="auto",e.style.height=`${e.scrollHeight}px`}function dr(e){return e?e.active?l`
      <div class="callout info compaction-indicator compaction-indicator--active">
        ${M.loader} Compacting context...
      </div>
    `:e.completedAt&&Date.now()-e.completedAt<cr?l`
        <div class="callout success compaction-indicator compaction-indicator--complete">
          ${M.check} Context compacted
        </div>
      `:v:v}function ur(){return`att-${Date.now()}-${Math.random().toString(36).slice(2,9)}`}function gr(e,n){const t=e.clipboardData?.items;if(!t||!n.onAttachmentsChange)return;const i=[];for(let s=0;s<t.length;s++){const a=t[s];a.type.startsWith("image/")&&i.push(a)}if(i.length!==0){e.preventDefault();for(const s of i){const a=s.getAsFile();if(!a)continue;const o=new FileReader;o.addEventListener("load",()=>{const r=o.result,d={id:ur(),dataUrl:r,mimeType:a.type},f=n.attachments??[];n.onAttachmentsChange?.([...f,d])}),o.readAsDataURL(a)}}}function vr(e){const n=e.attachments??[];return n.length===0?v:l`
    <div class="chat-attachments">
      ${n.map(t=>l`
          <div class="chat-attachment">
            <img
              src=${t.dataUrl}
              alt="Attachment preview"
              class="chat-attachment__img"
            />
            <button
              class="chat-attachment__remove"
              type="button"
              aria-label="Remove attachment"
              @click=${()=>{const i=(e.attachments??[]).filter(s=>s.id!==t.id);e.onAttachmentsChange?.(i)}}
            >
              ${M.x}
            </button>
          </div>
        `)}
    </div>
  `}function si(e){const n=e.connected,t=e.sending||e.stream!==null,i=!!(e.canAbort&&e.onAbort),a=e.sessions?.sessions?.find(u=>u.key===e.sessionKey)?.reasoningLevel??"off",o=e.showThinking&&a!=="off",r={name:e.assistantName,avatar:e.assistantAvatar??e.assistantAvatarUrl??null},d=(e.attachments?.length??0)>0,f=e.connected?d?"Add a message or paste more images...":"Message (↩ to send, Shift+↩ for line breaks, paste images)":"Connect to the gateway to start chatting…",y=e.splitRatio??.6,g=!!(e.sidebarOpen&&e.onCloseSidebar),c=l`
    <div
      class="chat-thread"
      role="log"
      aria-live="polite"
      @scroll=${e.onChatScroll}
    >
      ${e.loading?l`
              <div class="muted">Loading chat…</div>
            `:v}
      ${Dt(pr(e),u=>u.key,u=>u.kind==="reading-indicator"?nr(r):u.kind==="stream"?tr(u.text,u.startedAt,e.onOpenSidebar,r):u.kind==="group"?ir(u,{onOpenSidebar:e.onOpenSidebar,showReasoning:o,assistantName:e.assistantName,assistantAvatar:r.avatar}):v)}
    </div>
  `;return l`
    <section class="card chat">
      ${e.disabledReason?l`<div class="callout">${e.disabledReason}</div>`:v}

      ${e.error?l`<div class="callout danger">${e.error}</div>`:v}

      ${dr(e.compactionStatus)}

      ${e.focusMode?l`
            <button
              class="chat-focus-exit"
              type="button"
              @click=${e.onToggleFocusMode}
              aria-label="Exit focus mode"
              title="Exit focus mode"
            >
              ${M.x}
            </button>
          `:v}

      <div
        class="chat-split-container ${g?"chat-split-container--open":""}"
      >
        <div
          class="chat-main"
          style="flex: ${g?`0 0 ${y*100}%`:"1 1 100%"}"
        >
          ${c}
        </div>

        ${g?l`
              <resizable-divider
                .splitRatio=${y}
                @resize=${u=>e.onSplitRatioChange?.(u.detail.splitRatio)}
              ></resizable-divider>
              <div class="chat-sidebar">
                ${lr({content:e.sidebarContent??null,error:e.sidebarError??null,onClose:e.onCloseSidebar,onViewRawText:()=>{!e.sidebarContent||!e.onOpenSidebar||e.onOpenSidebar(`\`\`\`
${e.sidebarContent}
\`\`\``)}})}
              </div>
            `:v}
      </div>

      ${e.queue.length?l`
            <div class="chat-queue" role="status" aria-live="polite">
              <div class="chat-queue__title">Queued (${e.queue.length})</div>
              <div class="chat-queue__list">
                ${e.queue.map(u=>l`
                    <div class="chat-queue__item">
                      <div class="chat-queue__text">
                        ${u.text||(u.attachments?.length?`Image (${u.attachments.length})`:"")}
                      </div>
                      <button
                        class="btn chat-queue__remove"
                        type="button"
                        aria-label="Remove queued message"
                        @click=${()=>e.onQueueRemove(u.id)}
                      >
                        ${M.x}
                      </button>
                    </div>
                  `)}
              </div>
            </div>
          `:v}

      ${e.showNewMessages?l`
            <button
              class="chat-new-messages"
              type="button"
              @click=${e.onScrollToBottom}
            >
              New messages ${M.arrowDown}
            </button>
          `:v}

      <div class="chat-compose">
        ${vr(e)}
        <div class="chat-compose__row">
          <label class="field chat-compose__field">
            <span>Message</span>
            <textarea
              ${xo(u=>u&&qn(u))}
              .value=${e.draft}
              ?disabled=${!e.connected}
              @keydown=${u=>{u.key==="Enter"&&(u.isComposing||u.keyCode===229||u.shiftKey||e.connected&&(u.preventDefault(),n&&e.onSend()))}}
              @input=${u=>{const b=u.target;qn(b),e.onDraftChange(b.value)}}
              @paste=${u=>gr(u,e)}
              placeholder=${f}
            ></textarea>
          </label>
          <div class="chat-compose__actions">
            <button
              class="btn"
              ?disabled=${!e.connected||!i&&e.sending}
              @click=${i?e.onAbort:e.onNewSession}
            >
              ${i?"Stop":"New session"}
            </button>
            <button
              class="btn primary"
              ?disabled=${!e.connected}
              @click=${e.onSend}
            >
              ${t?"Queue":"Send"}<kbd class="btn-kbd">↵</kbd>
            </button>
          </div>
        </div>
      </div>
    </section>
  `}const Gn=200;function fr(e){const n=[];let t=null;for(const i of e){if(i.kind!=="message"){t&&(n.push(t),t=null),n.push(i);continue}const s=Zt(i.message),a=bn(s.role),o=s.timestamp||Date.now();!t||t.role!==a?(t&&n.push(t),t={kind:"group",key:`group:${a}:${i.key}`,role:a,messages:[{message:i.message,key:i.key}],timestamp:o,isStreaming:!1}):t.messages.push({message:i.message,key:i.key})}return t&&n.push(t),n}function pr(e){const n=[],t=Array.isArray(e.messages)?e.messages:[],i=Array.isArray(e.toolMessages)?e.toolMessages:[],s=Math.max(0,t.length-Gn);s>0&&n.push({kind:"message",key:"chat:history:notice",message:{role:"system",content:`Showing last ${Gn} messages (${s} hidden).`,timestamp:Date.now()}});for(let a=s;a<t.length;a++){const o=t[a],r=Zt(o);!e.showThinking&&r.role.toLowerCase()==="toolresult"||n.push({kind:"message",key:Wn(o,a),message:o})}if(e.showThinking)for(let a=0;a<i.length;a++)n.push({kind:"message",key:Wn(i[a],a+t.length),message:i[a]});if(e.stream!==null){const a=`stream:${e.sessionKey}:${e.streamStartedAt??"live"}`;e.stream.trim().length>0?n.push({kind:"stream",key:a,text:e.stream,startedAt:e.streamStartedAt??Date.now()}):n.push({kind:"reading-indicator",key:a})}return fr(n)}function Wn(e,n){const t=e,i=typeof t.toolCallId=="string"?t.toolCallId:"";if(i)return`tool:${i}`;const s=typeof t.id=="string"?t.id:"";if(s)return`msg:${s}`;const a=typeof t.messageId=="string"?t.messageId:"";if(a)return`msg:${a}`;const o=typeof t.timestamp=="number"?t.timestamp:null,r=typeof t.role=="string"?t.role:"unknown";return o!=null?`msg:${r}:${o}:${n}`:`msg:${r}:${n}`}function hr(e){const n=si(e);return l`
    <div class="taxchat-container">
      ${n}
    </div>
  `}const an={all:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="7" height="7"></rect>
      <rect x="14" y="3" width="7" height="7"></rect>
      <rect x="14" y="14" width="7" height="7"></rect>
      <rect x="3" y="14" width="7" height="7"></rect>
    </svg>
  `,env:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="3"></circle>
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
      ></path>
    </svg>
  `,update:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
      <polyline points="7 10 12 15 17 10"></polyline>
      <line x1="12" y1="15" x2="12" y2="3"></line>
    </svg>
  `,agents:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M12 2a2 2 0 0 1 2 2c0 .74-.4 1.39-1 1.73V7h1a7 7 0 0 1 7 7h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v1a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-1H2a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1a7 7 0 0 1 7-7h1V5.73c-.6-.34-1-.99-1-1.73a2 2 0 0 1 2-2z"
      ></path>
      <circle cx="8" cy="14" r="1"></circle>
      <circle cx="16" cy="14" r="1"></circle>
    </svg>
  `,auth:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  `,channels:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
    </svg>
  `,messages:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
      <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
  `,commands:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  `,hooks:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
    </svg>
  `,skills:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon
        points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
      ></polygon>
    </svg>
  `,tools:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
      ></path>
    </svg>
  `,gateway:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,wizard:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M15 4V2"></path>
      <path d="M15 16v-2"></path>
      <path d="M8 9h2"></path>
      <path d="M20 9h2"></path>
      <path d="M17.8 11.8 19 13"></path>
      <path d="M15 9h0"></path>
      <path d="M17.8 6.2 19 5"></path>
      <path d="m3 21 9-9"></path>
      <path d="M12.2 6.2 11 5"></path>
    </svg>
  `,meta:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `,logging:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
      <line x1="16" y1="13" x2="8" y2="13"></line>
      <line x1="16" y1="17" x2="8" y2="17"></line>
      <polyline points="10 9 9 9 8 9"></polyline>
    </svg>
  `,browser:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <circle cx="12" cy="12" r="4"></circle>
      <line x1="21.17" y1="8" x2="12" y2="8"></line>
      <line x1="3.95" y1="6.06" x2="8.54" y2="14"></line>
      <line x1="10.88" y1="21.94" x2="15.46" y2="14"></line>
    </svg>
  `,ui:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <line x1="3" y1="9" x2="21" y2="9"></line>
      <line x1="9" y1="21" x2="9" y2="9"></line>
    </svg>
  `,models:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path
        d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
      ></path>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
      <line x1="12" y1="22.08" x2="12" y2="12"></line>
    </svg>
  `,bindings:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
      <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
      <line x1="6" y1="6" x2="6.01" y2="6"></line>
      <line x1="6" y1="18" x2="6.01" y2="18"></line>
    </svg>
  `,broadcast:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4.9 19.1C1 15.2 1 8.8 4.9 4.9"></path>
      <path d="M7.8 16.2c-2.3-2.3-2.3-6.1 0-8.5"></path>
      <circle cx="12" cy="12" r="2"></circle>
      <path d="M16.2 7.8c2.3 2.3 2.3 6.1 0 8.5"></path>
      <path d="M19.1 4.9C23 8.8 23 15.1 19.1 19"></path>
    </svg>
  `,audio:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M9 18V5l12-2v13"></path>
      <circle cx="6" cy="18" r="3"></circle>
      <circle cx="18" cy="16" r="3"></circle>
    </svg>
  `,session:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
      <circle cx="9" cy="7" r="4"></circle>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
    </svg>
  `,cron:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    </svg>
  `,web:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"></circle>
      <line x1="2" y1="12" x2="22" y2="12"></line>
      <path
        d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      ></path>
    </svg>
  `,discovery:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8"></circle>
      <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
    </svg>
  `,canvasHost:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
    </svg>
  `,talk:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
      <line x1="12" y1="19" x2="12" y2="23"></line>
      <line x1="8" y1="23" x2="16" y2="23"></line>
    </svg>
  `,plugins:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2v6"></path>
      <path d="m4.93 10.93 4.24 4.24"></path>
      <path d="M2 12h6"></path>
      <path d="m4.93 13.07 4.24-4.24"></path>
      <path d="M12 22v-6"></path>
      <path d="m19.07 13.07-4.24-4.24"></path>
      <path d="M22 12h-6"></path>
      <path d="m19.07 10.93-4.24 4.24"></path>
    </svg>
  `,default:l`
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
      <polyline points="14 2 14 8 20 8"></polyline>
    </svg>
  `},Qn=[{key:"env",label:"Environment"},{key:"update",label:"Updates"},{key:"agents",label:"Agents"},{key:"auth",label:"Authentication"},{key:"channels",label:"Channels"},{key:"messages",label:"Messages"},{key:"commands",label:"Commands"},{key:"hooks",label:"Hooks"},{key:"skills",label:"Skills"},{key:"tools",label:"Tools"},{key:"gateway",label:"Gateway"},{key:"wizard",label:"Setup Wizard"}],Jn="__all__";function Yn(e){return an[e]??an.default}function mr(e,n){const t=yn[e];return t||{label:n?.title??K(e),description:n?.description??""}}function yr(e){const{key:n,schema:t,uiHints:i}=e;if(!t||B(t)!=="object"||!t.properties)return[];const s=Object.entries(t.properties).map(([a,o])=>{const r=T([n,a],i),d=r?.label??o.title??K(a),f=r?.help??o.description??"",y=r?.order??50;return{key:a,label:d,description:f,order:y}});return s.sort((a,o)=>a.order!==o.order?a.order-o.order:a.key.localeCompare(o.key)),s}function br(e,n){if(!e||!n)return[];const t=[];function i(s,a,o){if(s===a)return;if(typeof s!=typeof a){t.push({path:o,from:s,to:a});return}if(typeof s!="object"||s===null||a===null){s!==a&&t.push({path:o,from:s,to:a});return}if(Array.isArray(s)&&Array.isArray(a)){JSON.stringify(s)!==JSON.stringify(a)&&t.push({path:o,from:s,to:a});return}const r=s,d=a,f=new Set([...Object.keys(r),...Object.keys(d)]);for(const y of f)i(r[y],d[y],o?`${o}.${y}`:y)}return i(e,n,""),t}function Xn(e,n=40){let t;try{t=JSON.stringify(e)??String(e)}catch{t=String(e)}return t.length<=n?t:t.slice(0,n-3)+"..."}function $r(e){const n=e.valid==null?"unknown":e.valid?"valid":"invalid",t=Wt(e.schema),i=t.schema?t.unsupportedPaths.length>0:!1,s=t.schema?.properties??{},a=Qn.filter(k=>k.key in s),o=new Set(Qn.map(k=>k.key)),r=Object.keys(s).filter(k=>!o.has(k)).map(k=>({key:k,label:k.charAt(0).toUpperCase()+k.slice(1)})),d=[...a,...r],f=e.activeSection&&t.schema&&B(t.schema)==="object"?t.schema.properties?.[e.activeSection]:void 0,y=e.activeSection?mr(e.activeSection,f):null,g=e.activeSection?yr({key:e.activeSection,schema:f,uiHints:e.uiHints}):[],c=e.formMode==="form"&&!!e.activeSection&&g.length>0,u=e.activeSubsection===Jn,b=e.searchQuery||u?null:e.activeSubsection??g[0]?.key??null,$=e.formMode==="form"?br(e.originalValue,e.formValue):[],w=e.formMode==="raw"&&e.raw!==e.originalRaw,S=e.formMode==="form"?$.length>0:w,x=!!e.formValue&&!e.loading&&!!t.schema,A=e.connected&&!e.saving&&S&&(e.formMode==="raw"?!0:x),L=e.connected&&!e.applying&&!e.updating&&S&&(e.formMode==="raw"?!0:x),C=e.connected&&!e.applying&&!e.updating;return l`
    <div class="config-layout">
      <!-- Sidebar -->
      <aside class="config-sidebar">
        <div class="config-sidebar__header">
          <div class="config-sidebar__title">Settings</div>
          <span
            class="pill pill--sm ${n==="valid"?"pill--ok":n==="invalid"?"pill--danger":""}"
            >${n}</span
          >
        </div>

        <!-- Search -->
        <div class="config-search">
          <svg
            class="config-search__icon"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            class="config-search__input"
            placeholder="Search settings..."
            .value=${e.searchQuery}
            @input=${k=>e.onSearchChange(k.target.value)}
          />
          ${e.searchQuery?l`
                <button
                  class="config-search__clear"
                  @click=${()=>e.onSearchChange("")}
                >
                  ×
                </button>
              `:v}
        </div>

        <!-- Section nav -->
        <nav class="config-nav">
          <button
            class="config-nav__item ${e.activeSection===null?"active":""}"
            @click=${()=>e.onSectionChange(null)}
          >
            <span class="config-nav__icon">${an.all}</span>
            <span class="config-nav__label">All Settings</span>
          </button>
          ${d.map(k=>l`
              <button
                class="config-nav__item ${e.activeSection===k.key?"active":""}"
                @click=${()=>e.onSectionChange(k.key)}
              >
                <span class="config-nav__icon"
                  >${Yn(k.key)}</span
                >
                <span class="config-nav__label">${k.label}</span>
              </button>
            `)}
        </nav>

        <!-- Mode toggle at bottom -->
        <div class="config-sidebar__footer">
          <div class="config-mode-toggle">
            <button
              class="config-mode-toggle__btn ${e.formMode==="form"?"active":""}"
              ?disabled=${e.schemaLoading||!e.schema}
              @click=${()=>e.onFormModeChange("form")}
            >
              Form
            </button>
            <button
              class="config-mode-toggle__btn ${e.formMode==="raw"?"active":""}"
              @click=${()=>e.onFormModeChange("raw")}
            >
              Raw
            </button>
          </div>
        </div>
      </aside>

      <!-- Main content -->
      <main class="config-main">
        <!-- Action bar -->
        <div class="config-actions">
          <div class="config-actions__left">
            ${S?l`
                  <span class="config-changes-badge"
                    >${e.formMode==="raw"?"Unsaved changes":`${$.length} unsaved change${$.length!==1?"s":""}`}</span
                  >
                `:l`
                    <span class="config-status muted">No changes</span>
                  `}
          </div>
          <div class="config-actions__right">
            <button
              class="btn btn--sm"
              ?disabled=${e.loading}
              @click=${e.onReload}
            >
              ${e.loading?"Loading…":"Reload"}
            </button>
            <button
              class="btn btn--sm primary"
              ?disabled=${!A}
              @click=${e.onSave}
            >
              ${e.saving?"Saving…":"Save"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!L}
              @click=${e.onApply}
            >
              ${e.applying?"Applying…":"Apply"}
            </button>
            <button
              class="btn btn--sm"
              ?disabled=${!C}
              @click=${e.onUpdate}
            >
              ${e.updating?"Updating…":"Update"}
            </button>
          </div>
        </div>

        <!-- Diff panel (form mode only - raw mode doesn't have granular diff) -->
        ${S&&e.formMode==="form"?l`
              <details class="config-diff">
                <summary class="config-diff__summary">
                  <span
                    >View ${$.length} pending
                    change${$.length!==1?"s":""}</span
                  >
                  <svg
                    class="config-diff__chevron"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <polyline points="6 9 12 15 18 9"></polyline>
                  </svg>
                </summary>
                <div class="config-diff__content">
                  ${$.map(k=>l`
                      <div class="config-diff__item">
                        <div class="config-diff__path">${k.path}</div>
                        <div class="config-diff__values">
                          <span class="config-diff__from"
                            >${Xn(k.from)}</span
                          >
                          <span class="config-diff__arrow">→</span>
                          <span class="config-diff__to"
                            >${Xn(k.to)}</span
                          >
                        </div>
                      </div>
                    `)}
                </div>
              </details>
            `:v}
        ${y&&e.formMode==="form"?l`
              <div class="config-section-hero">
                <div class="config-section-hero__icon">
                  ${Yn(e.activeSection??"")}
                </div>
                <div class="config-section-hero__text">
                  <div class="config-section-hero__title">
                    ${y.label}
                  </div>
                  ${y.description?l`<div class="config-section-hero__desc">
                        ${y.description}
                      </div>`:v}
                </div>
              </div>
            `:v}
        ${c?l`
              <div class="config-subnav">
                <button
                  class="config-subnav__item ${b===null?"active":""}"
                  @click=${()=>e.onSubsectionChange(Jn)}
                >
                  All
                </button>
                ${g.map(k=>l`
                    <button
                      class="config-subnav__item ${b===k.key?"active":""}"
                      title=${k.description||k.label}
                      @click=${()=>e.onSubsectionChange(k.key)}
                    >
                      ${k.label}
                    </button>
                  `)}
              </div>
            `:v}

        <!-- Form content -->
        <div class="config-content">
          ${e.formMode==="form"?l`
                ${e.schemaLoading?l`
                        <div class="config-loading">
                          <div class="config-loading__spinner"></div>
                          <span>Loading schema…</span>
                        </div>
                      `:Ul({schema:t.schema,uiHints:e.uiHints,value:e.formValue,disabled:e.loading||!e.formValue,unsupportedPaths:t.unsupportedPaths,onPatch:e.onFormPatch,searchQuery:e.searchQuery,activeSection:e.activeSection,activeSubsection:b})}
                ${i?l`
                        <div class="callout danger" style="margin-top: 12px">
                          Form view can't safely edit some fields. Use Raw to avoid losing config entries.
                        </div>
                      `:v}
              `:l`
                <label class="field config-raw-field">
                  <span>Raw JSON5</span>
                  <textarea
                    .value=${e.raw}
                    @input=${k=>e.onRawChange(k.target.value)}
                  ></textarea>
                </label>
              `}
        </div>

        ${e.issues.length>0?l`<div class="callout danger" style="margin-top: 12px;">
              <pre class="code-block">
${JSON.stringify(e.issues,null,2)}</pre
              >
            </div>`:v}
      </main>
    </div>
  `}function wr(e){const n=["last",...e.channels.filter(Boolean)],t=e.form.channel?.trim();t&&!n.includes(t)&&n.push(t);const i=new Set;return n.filter(s=>i.has(s)?!1:(i.add(s),!0))}function Sr(e,n){if(n==="last")return"last";const t=e.channelMeta?.find(i=>i.id===n);return t?.label?t.label:e.channelLabels?.[n]??n}function xr(e){const n=wr(e);return l`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">Scheduler</div>
        <div class="card-sub">Gateway-owned cron scheduler status.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Enabled</div>
            <div class="stat-value">
              ${e.status?e.status.enabled?"Yes":"No":"n/a"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Jobs</div>
            <div class="stat-value">${e.status?.jobs??"n/a"}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Next wake</div>
            <div class="stat-value">${mn(e.status?.nextWakeAtMs??null)}</div>
          </div>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
          ${e.error?l`<span class="muted">${e.error}</span>`:v}
        </div>
      </div>

      <div class="card">
        <div class="card-title">New Job</div>
        <div class="card-sub">Create a scheduled wakeup or agent run.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Name</span>
            <input
              .value=${e.form.name}
              @input=${t=>e.onFormChange({name:t.target.value})}
            />
          </label>
          <label class="field">
            <span>Description</span>
            <input
              .value=${e.form.description}
              @input=${t=>e.onFormChange({description:t.target.value})}
            />
          </label>
          <label class="field">
            <span>Agent ID</span>
            <input
              .value=${e.form.agentId}
              @input=${t=>e.onFormChange({agentId:t.target.value})}
              placeholder="default"
            />
          </label>
          <label class="field checkbox">
            <span>Enabled</span>
            <input
              type="checkbox"
              .checked=${e.form.enabled}
              @change=${t=>e.onFormChange({enabled:t.target.checked})}
            />
          </label>
          <label class="field">
            <span>Schedule</span>
            <select
              .value=${e.form.scheduleKind}
              @change=${t=>e.onFormChange({scheduleKind:t.target.value})}
            >
              <option value="every">Every</option>
              <option value="at">At</option>
              <option value="cron">Cron</option>
            </select>
          </label>
        </div>
        ${kr(e)}
        <div class="form-grid" style="margin-top: 12px;">
          <label class="field">
            <span>Session</span>
            <select
              .value=${e.form.sessionTarget}
              @change=${t=>e.onFormChange({sessionTarget:t.target.value})}
            >
              <option value="main">Main</option>
              <option value="isolated">Isolated</option>
            </select>
          </label>
          <label class="field">
            <span>Wake mode</span>
            <select
              .value=${e.form.wakeMode}
              @change=${t=>e.onFormChange({wakeMode:t.target.value})}
            >
              <option value="next-heartbeat">Next heartbeat</option>
              <option value="now">Now</option>
            </select>
          </label>
          <label class="field">
            <span>Payload</span>
            <select
              .value=${e.form.payloadKind}
              @change=${t=>e.onFormChange({payloadKind:t.target.value})}
            >
              <option value="systemEvent">System event</option>
              <option value="agentTurn">Agent turn</option>
            </select>
          </label>
        </div>
        <label class="field" style="margin-top: 12px;">
          <span>${e.form.payloadKind==="systemEvent"?"System text":"Agent message"}</span>
          <textarea
            .value=${e.form.payloadText}
            @input=${t=>e.onFormChange({payloadText:t.target.value})}
            rows="4"
          ></textarea>
        </label>
	          ${e.form.payloadKind==="agentTurn"?l`
	              <div class="form-grid" style="margin-top: 12px;">
                <label class="field checkbox">
                  <span>Deliver</span>
                  <input
                    type="checkbox"
                    .checked=${e.form.deliver}
                    @change=${t=>e.onFormChange({deliver:t.target.checked})}
                  />
	                </label>
	                <label class="field">
	                  <span>Channel</span>
	                  <select
	                    .value=${e.form.channel||"last"}
	                    @change=${t=>e.onFormChange({channel:t.target.value})}
	                  >
	                    ${n.map(t=>l`<option value=${t}>
                            ${Sr(e,t)}
                          </option>`)}
                  </select>
                </label>
                <label class="field">
                  <span>To</span>
                  <input
                    .value=${e.form.to}
                    @input=${t=>e.onFormChange({to:t.target.value})}
                    placeholder="+1555… or chat id"
                  />
                </label>
                <label class="field">
                  <span>Timeout (seconds)</span>
                  <input
                    .value=${e.form.timeoutSeconds}
                    @input=${t=>e.onFormChange({timeoutSeconds:t.target.value})}
                  />
                </label>
                ${e.form.sessionTarget==="isolated"?l`
                      <label class="field">
                        <span>Post to main prefix</span>
                        <input
                          .value=${e.form.postToMainPrefix}
                          @input=${t=>e.onFormChange({postToMainPrefix:t.target.value})}
                        />
                      </label>
                    `:v}
              </div>
            `:v}
        <div class="row" style="margin-top: 14px;">
          <button class="btn primary" ?disabled=${e.busy} @click=${e.onAdd}>
            ${e.busy?"Saving…":"Add job"}
          </button>
        </div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Jobs</div>
      <div class="card-sub">All scheduled jobs stored in the gateway.</div>
      ${e.jobs.length===0?l`
              <div class="muted" style="margin-top: 12px">No jobs yet.</div>
            `:l`
            <div class="list" style="margin-top: 12px;">
              ${e.jobs.map(t=>Ar(t,e))}
            </div>
          `}
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Run history</div>
      <div class="card-sub">Latest runs for ${e.runsJobId??"(select a job)"}.</div>
      ${e.runsJobId==null?l`
              <div class="muted" style="margin-top: 12px">Select a job to inspect run history.</div>
            `:e.runs.length===0?l`
                <div class="muted" style="margin-top: 12px">No runs yet.</div>
              `:l`
              <div class="list" style="margin-top: 12px;">
                ${e.runs.map(t=>Cr(t))}
              </div>
            `}
    </section>
  `}function kr(e){const n=e.form;return n.scheduleKind==="at"?l`
      <label class="field" style="margin-top: 12px;">
        <span>Run at</span>
        <input
          type="datetime-local"
          .value=${n.scheduleAt}
          @input=${t=>e.onFormChange({scheduleAt:t.target.value})}
        />
      </label>
    `:n.scheduleKind==="every"?l`
      <div class="form-grid" style="margin-top: 12px;">
        <label class="field">
          <span>Every</span>
          <input
            .value=${n.everyAmount}
            @input=${t=>e.onFormChange({everyAmount:t.target.value})}
          />
        </label>
        <label class="field">
          <span>Unit</span>
          <select
            .value=${n.everyUnit}
            @change=${t=>e.onFormChange({everyUnit:t.target.value})}
          >
            <option value="minutes">Minutes</option>
            <option value="hours">Hours</option>
            <option value="days">Days</option>
          </select>
        </label>
      </div>
    `:l`
    <div class="form-grid" style="margin-top: 12px;">
      <label class="field">
        <span>Expression</span>
        <input
          .value=${n.cronExpr}
          @input=${t=>e.onFormChange({cronExpr:t.target.value})}
        />
      </label>
      <label class="field">
        <span>Timezone (optional)</span>
        <input
          .value=${n.cronTz}
          @input=${t=>e.onFormChange({cronTz:t.target.value})}
        />
      </label>
    </div>
  `}function Ar(e,n){const i=`list-item list-item-clickable${n.runsJobId===e.id?" list-item-selected":""}`;return l`
    <div class=${i} @click=${()=>n.onLoadRuns(e.id)}>
      <div class="list-main">
        <div class="list-title">${e.name}</div>
        <div class="list-sub">${Ut(e)}</div>
        <div class="muted">${jt(e)}</div>
        ${e.agentId?l`<div class="muted">Agent: ${e.agentId}</div>`:v}
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.enabled?"enabled":"disabled"}</span>
          <span class="chip">${e.sessionTarget}</span>
          <span class="chip">${e.wakeMode}</span>
        </div>
      </div>
      <div class="list-meta">
        <div>${Ot(e)}</div>
        <div class="row" style="justify-content: flex-end; margin-top: 8px;">
          <button
            class="btn"
            ?disabled=${n.busy}
            @click=${s=>{s.stopPropagation(),n.onToggle(e,!e.enabled)}}
          >
            ${e.enabled?"Disable":"Enable"}
          </button>
          <button
            class="btn"
            ?disabled=${n.busy}
            @click=${s=>{s.stopPropagation(),n.onRun(e)}}
          >
            Run
          </button>
          <button
            class="btn"
            ?disabled=${n.busy}
            @click=${s=>{s.stopPropagation(),n.onLoadRuns(e.id)}}
          >
            Runs
          </button>
          <button
            class="btn danger"
            ?disabled=${n.busy}
            @click=${s=>{s.stopPropagation(),n.onRemove(e)}}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  `}function Cr(e){return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.status}</div>
        <div class="list-sub">${e.summary??""}</div>
      </div>
      <div class="list-meta">
        <div>${ae(e.ts)}</div>
        <div class="muted">${e.durationMs??0}ms</div>
        ${e.error?l`<div class="muted">${e.error}</div>`:v}
      </div>
    </div>
  `}function Lr(e){const t=(e.status&&typeof e.status=="object"?e.status.securityAudit:null)?.summary??null,i=t?.critical??0,s=t?.warn??0,a=t?.info??0,o=i>0?"danger":s>0?"warn":"success",r=i>0?`${i} critical`:s>0?`${s} warnings`:"No critical issues";return l`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="row" style="justify-content: space-between;">
          <div>
            <div class="card-title">Snapshots</div>
            <div class="card-sub">Status, health, and heartbeat data.</div>
          </div>
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Refreshing…":"Refresh"}
          </button>
        </div>
        <div class="stack" style="margin-top: 12px;">
          <div>
            <div class="muted">Status</div>
            ${t?l`<div class="callout ${o}" style="margin-top: 8px;">
                  Security audit: ${r}${a>0?` · ${a} info`:""}. Run
                  <span class="mono">openclaw security audit --deep</span> for details.
                </div>`:v}
            <pre class="code-block">${JSON.stringify(e.status??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Health</div>
            <pre class="code-block">${JSON.stringify(e.health??{},null,2)}</pre>
          </div>
          <div>
            <div class="muted">Last heartbeat</div>
            <pre class="code-block">${JSON.stringify(e.heartbeat??{},null,2)}</pre>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Manual RPC</div>
        <div class="card-sub">Send a raw gateway method with JSON params.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>Method</span>
            <input
              .value=${e.callMethod}
              @input=${d=>e.onCallMethodChange(d.target.value)}
              placeholder="system-presence"
            />
          </label>
          <label class="field">
            <span>Params (JSON)</span>
            <textarea
              .value=${e.callParams}
              @input=${d=>e.onCallParamsChange(d.target.value)}
              rows="6"
            ></textarea>
          </label>
        </div>
        <div class="row" style="margin-top: 12px;">
          <button class="btn primary" @click=${e.onCall}>Call</button>
        </div>
        ${e.callError?l`<div class="callout danger" style="margin-top: 12px;">
              ${e.callError}
            </div>`:v}
        ${e.callResult?l`<pre class="code-block" style="margin-top: 12px;">${e.callResult}</pre>`:v}
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Models</div>
      <div class="card-sub">Catalog from models.list.</div>
      <pre class="code-block" style="margin-top: 12px;">${JSON.stringify(e.models??[],null,2)}</pre>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Event Log</div>
      <div class="card-sub">Latest gateway events.</div>
      ${e.eventLog.length===0?l`
              <div class="muted" style="margin-top: 12px">No events yet.</div>
            `:l`
            <div class="list" style="margin-top: 12px;">
              ${e.eventLog.map(d=>l`
                  <div class="list-item">
                    <div class="list-main">
                      <div class="list-title">${d.event}</div>
                      <div class="list-sub">${new Date(d.ts).toLocaleTimeString()}</div>
                    </div>
                    <div class="list-meta">
                      <pre class="code-block">${sl(d.payload)}</pre>
                    </div>
                  </div>
                `)}
            </div>
          `}
    </section>
  `}function _r(e){const n=Math.max(0,e),t=Math.floor(n/1e3);if(t<60)return`${t}s`;const i=Math.floor(t/60);return i<60?`${i}m`:`${Math.floor(i/60)}h`}function q(e,n){return n?l`<div class="exec-approval-meta-row"><span>${e}</span><span>${n}</span></div>`:v}function Ir(e){const n=e.execApprovalQueue[0];if(!n)return v;const t=n.request,i=n.expiresAtMs-Date.now(),s=i>0?`expires in ${_r(i)}`:"expired",a=e.execApprovalQueue.length;return l`
    <div class="exec-approval-overlay" role="dialog" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Exec approval needed</div>
            <div class="exec-approval-sub">${s}</div>
          </div>
          ${a>1?l`<div class="exec-approval-queue">${a} pending</div>`:v}
        </div>
        <div class="exec-approval-command mono">${t.command}</div>
        <div class="exec-approval-meta">
          ${q("Host",t.host)}
          ${q("Agent",t.agentId)}
          ${q("Session",t.sessionKey)}
          ${q("CWD",t.cwd)}
          ${q("Resolved",t.resolvedPath)}
          ${q("Security",t.security)}
          ${q("Ask",t.ask)}
        </div>
        ${e.execApprovalError?l`<div class="exec-approval-error">${e.execApprovalError}</div>`:v}
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("allow-once")}
          >
            Allow once
          </button>
          <button
            class="btn"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("allow-always")}
          >
            Always allow
          </button>
          <button
            class="btn danger"
            ?disabled=${e.execApprovalBusy}
            @click=${()=>e.handleExecApprovalDecision("deny")}
          >
            Deny
          </button>
        </div>
      </div>
    </div>
  `}function Mr(e){const{pendingGatewayUrl:n}=e;return n?l`
    <div class="exec-approval-overlay" role="dialog" aria-modal="true" aria-live="polite">
      <div class="exec-approval-card">
        <div class="exec-approval-header">
          <div>
            <div class="exec-approval-title">Change Gateway URL</div>
            <div class="exec-approval-sub">This will reconnect to a different gateway server</div>
          </div>
        </div>
        <div class="exec-approval-command mono">${n}</div>
        <div class="callout danger" style="margin-top: 12px;">
          Only confirm if you trust this URL. Malicious URLs can compromise your system.
        </div>
        <div class="exec-approval-actions">
          <button
            class="btn primary"
            @click=${()=>e.handleGatewayUrlConfirm()}
          >
            Confirm
          </button>
          <button
            class="btn"
            @click=${()=>e.handleGatewayUrlCancel()}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  `:v}function Er(e){return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Connected Instances</div>
          <div class="card-sub">Presence beacons from the gateway and clients.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>
      ${e.lastError?l`<div class="callout danger" style="margin-top: 12px;">
            ${e.lastError}
          </div>`:v}
      ${e.statusMessage?l`<div class="callout" style="margin-top: 12px;">
            ${e.statusMessage}
          </div>`:v}
      <div class="list" style="margin-top: 16px;">
        ${e.entries.length===0?l`
                <div class="muted">No instances reported yet.</div>
              `:e.entries.map(n=>Fr(n))}
      </div>
    </section>
  `}function Fr(e){const n=e.lastInputSeconds!=null?`${e.lastInputSeconds}s ago`:"n/a",t=e.mode??"unknown",i=Array.isArray(e.roles)?e.roles.filter(Boolean):[],s=Array.isArray(e.scopes)?e.scopes.filter(Boolean):[],a=s.length>0?s.length>3?`${s.length} scopes`:`scopes: ${s.join(", ")}`:null;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${e.host??"unknown host"}</div>
        <div class="list-sub">${nl(e)}</div>
        <div class="chip-row">
          <span class="chip">${t}</span>
          ${i.map(o=>l`<span class="chip">${o}</span>`)}
          ${a?l`<span class="chip">${a}</span>`:v}
          ${e.platform?l`<span class="chip">${e.platform}</span>`:v}
          ${e.deviceFamily?l`<span class="chip">${e.deviceFamily}</span>`:v}
          ${e.modelIdentifier?l`<span class="chip">${e.modelIdentifier}</span>`:v}
          ${e.version?l`<span class="chip">${e.version}</span>`:v}
        </div>
      </div>
      <div class="list-meta">
        <div>${tl(e)}</div>
        <div class="muted">Last input ${n}</div>
        <div class="muted">Reason ${e.reason??""}</div>
      </div>
    </div>
  `}const Zn=["trace","debug","info","warn","error","fatal"];function Tr(e){if(!e)return"";const n=new Date(e);return Number.isNaN(n.getTime())?e:n.toLocaleTimeString()}function Rr(e,n){return n?[e.message,e.subsystem,e.raw].filter(Boolean).join(" ").toLowerCase().includes(n):!0}function Pr(e){const n=e.filterText.trim().toLowerCase(),t=Zn.some(a=>!e.levelFilters[a]),i=e.entries.filter(a=>a.level&&!e.levelFilters[a.level]?!1:Rr(a,n)),s=n||t?"filtered":"visible";return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Logs</div>
          <div class="card-sub">Gateway file logs (JSONL).</div>
        </div>
        <div class="row" style="gap: 8px;">
          <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
            ${e.loading?"Loading…":"Refresh"}
          </button>
          <button
            class="btn"
            ?disabled=${i.length===0}
            @click=${()=>e.onExport(i.map(a=>a.raw),s)}
          >
            Export ${s}
          </button>
        </div>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="min-width: 220px;">
          <span>Filter</span>
          <input
            .value=${e.filterText}
            @input=${a=>e.onFilterTextChange(a.target.value)}
            placeholder="Search logs"
          />
        </label>
        <label class="field checkbox">
          <span>Auto-follow</span>
          <input
            type="checkbox"
            .checked=${e.autoFollow}
            @change=${a=>e.onToggleAutoFollow(a.target.checked)}
          />
        </label>
      </div>

      <div class="chip-row" style="margin-top: 12px;">
        ${Zn.map(a=>l`
            <label class="chip log-chip ${a}">
              <input
                type="checkbox"
                .checked=${e.levelFilters[a]}
                @change=${o=>e.onLevelToggle(a,o.target.checked)}
              />
              <span>${a}</span>
            </label>
          `)}
      </div>

      ${e.file?l`<div class="muted" style="margin-top: 10px;">File: ${e.file}</div>`:v}
      ${e.truncated?l`
              <div class="callout" style="margin-top: 10px">Log output truncated; showing latest chunk.</div>
            `:v}
      ${e.error?l`<div class="callout danger" style="margin-top: 10px;">${e.error}</div>`:v}

      <div class="log-stream" style="margin-top: 12px;" @scroll=${e.onScroll}>
        ${i.length===0?l`
                <div class="muted" style="padding: 12px">No log entries.</div>
              `:i.map(a=>l`
                <div class="log-row">
                  <div class="log-time mono">${Tr(a.time)}</div>
                  <div class="log-level ${a.level??""}">${a.level??""}</div>
                  <div class="log-subsystem mono">${a.subsystem??""}</div>
                  <div class="log-message mono">${a.message??a.raw}</div>
                </div>
              `)}
      </div>
    </section>
  `}function Br(e){const n=jr(e),t=Wr(e);return l`
    ${Jr(t)}
    ${Qr(n)}
    ${Nr(e)}
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Nodes</div>
          <div class="card-sub">Paired devices and live links.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>
      <div class="list" style="margin-top: 16px;">
        ${e.nodes.length===0?l`
                <div class="muted">No nodes found.</div>
              `:e.nodes.map(i=>lc(i))}
      </div>
    </section>
  `}function Nr(e){const n=e.devicesList??{pending:[],paired:[]},t=Array.isArray(n.pending)?n.pending:[],i=Array.isArray(n.paired)?n.paired:[];return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Devices</div>
          <div class="card-sub">Pairing requests + role tokens.</div>
        </div>
        <button class="btn" ?disabled=${e.devicesLoading} @click=${e.onDevicesRefresh}>
          ${e.devicesLoading?"Loading…":"Refresh"}
        </button>
      </div>
      ${e.devicesError?l`<div class="callout danger" style="margin-top: 12px;">${e.devicesError}</div>`:v}
      <div class="list" style="margin-top: 16px;">
        ${t.length>0?l`
              <div class="muted" style="margin-bottom: 8px;">Pending</div>
              ${t.map(s=>Dr(s,e))}
            `:v}
        ${i.length>0?l`
              <div class="muted" style="margin-top: 12px; margin-bottom: 8px;">Paired</div>
              ${i.map(s=>Kr(s,e))}
            `:v}
        ${t.length===0&&i.length===0?l`
                <div class="muted">No paired devices.</div>
              `:v}
      </div>
    </section>
  `}function Dr(e,n){const t=e.displayName?.trim()||e.deviceId,i=typeof e.ts=="number"?I(e.ts):"n/a",s=e.role?.trim()?`role: ${e.role}`:"role: -",a=e.isRepair?" · repair":"",o=e.remoteIp?` · ${e.remoteIp}`:"";return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t}</div>
        <div class="list-sub">${e.deviceId}${o}</div>
        <div class="muted" style="margin-top: 6px;">
          ${s} · requested ${i}${a}
        </div>
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; gap: 8px; flex-wrap: wrap;">
          <button class="btn btn--sm primary" @click=${()=>n.onDeviceApprove(e.requestId)}>
            Approve
          </button>
          <button class="btn btn--sm" @click=${()=>n.onDeviceReject(e.requestId)}>
            Reject
          </button>
        </div>
      </div>
    </div>
  `}function Kr(e,n){const t=e.displayName?.trim()||e.deviceId,i=e.remoteIp?` · ${e.remoteIp}`:"",s=`roles: ${We(e.roles)}`,a=`scopes: ${We(e.scopes)}`,o=Array.isArray(e.tokens)?e.tokens:[];return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${t}</div>
        <div class="list-sub">${e.deviceId}${i}</div>
        <div class="muted" style="margin-top: 6px;">${s} · ${a}</div>
        ${o.length===0?l`
                <div class="muted" style="margin-top: 6px">Tokens: none</div>
              `:l`
              <div class="muted" style="margin-top: 10px;">Tokens</div>
              <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 6px;">
                ${o.map(r=>Or(e.deviceId,r,n))}
              </div>
            `}
      </div>
    </div>
  `}function Or(e,n,t){const i=n.revokedAtMs?"revoked":"active",s=`scopes: ${We(n.scopes)}`,a=I(n.rotatedAtMs??n.createdAtMs??n.lastUsedAtMs??null);return l`
    <div class="row" style="justify-content: space-between; gap: 8px;">
      <div class="list-sub">${n.role} · ${i} · ${s} · ${a}</div>
      <div class="row" style="justify-content: flex-end; gap: 6px; flex-wrap: wrap;">
        <button
          class="btn btn--sm"
          @click=${()=>t.onDeviceRotate(e,n.role,n.scopes)}
        >
          Rotate
        </button>
        ${n.revokedAtMs?v:l`
              <button
                class="btn btn--sm danger"
                @click=${()=>t.onDeviceRevoke(e,n.role)}
              >
                Revoke
              </button>
            `}
      </div>
    </div>
  `}const j="__defaults__",et=[{value:"deny",label:"Deny"},{value:"allowlist",label:"Allowlist"},{value:"full",label:"Full"}],Ur=[{value:"off",label:"Off"},{value:"on-miss",label:"On miss"},{value:"always",label:"Always"}];function jr(e){const n=e.configForm,t=ic(e.nodes),{defaultBinding:i,agents:s}=ac(n),a=!!n,o=e.configSaving||e.configFormMode==="raw";return{ready:a,disabled:o,configDirty:e.configDirty,configLoading:e.configLoading,configSaving:e.configSaving,defaultBinding:i,agents:s,nodes:t,onBindDefault:e.onBindDefault,onBindAgent:e.onBindAgent,onSave:e.onSaveBindings,onLoadConfig:e.onLoadConfig,formMode:e.configFormMode}}function nt(e){return e==="allowlist"||e==="full"||e==="deny"?e:"deny"}function Hr(e){return e==="always"||e==="off"||e==="on-miss"?e:"on-miss"}function zr(e){const n=e?.defaults??{};return{security:nt(n.security),ask:Hr(n.ask),askFallback:nt(n.askFallback??"deny"),autoAllowSkills:!!(n.autoAllowSkills??!1)}}function Vr(e){const n=e?.agents??{},t=Array.isArray(n.list)?n.list:[],i=[];return t.forEach(s=>{if(!s||typeof s!="object")return;const a=s,o=typeof a.id=="string"?a.id.trim():"";if(!o)return;const r=typeof a.name=="string"?a.name.trim():void 0,d=a.default===!0;i.push({id:o,name:r||void 0,isDefault:d})}),i}function qr(e,n){const t=Vr(e),i=Object.keys(n?.agents??{}),s=new Map;t.forEach(o=>s.set(o.id,o)),i.forEach(o=>{s.has(o)||s.set(o,{id:o})});const a=Array.from(s.values());return a.length===0&&a.push({id:"main",isDefault:!0}),a.sort((o,r)=>{if(o.isDefault&&!r.isDefault)return-1;if(!o.isDefault&&r.isDefault)return 1;const d=o.name?.trim()?o.name:o.id,f=r.name?.trim()?r.name:r.id;return d.localeCompare(f)}),a}function Gr(e,n){return e===j?j:e&&n.some(t=>t.id===e)?e:j}function Wr(e){const n=e.execApprovalsForm??e.execApprovalsSnapshot?.file??null,t=!!n,i=zr(n),s=qr(e.configForm,n),a=sc(e.nodes),o=e.execApprovalsTarget;let r=o==="node"&&e.execApprovalsTargetNodeId?e.execApprovalsTargetNodeId:null;o==="node"&&r&&!a.some(g=>g.id===r)&&(r=null);const d=Gr(e.execApprovalsSelectedAgent,s),f=d!==j?(n?.agents??{})[d]??null:null,y=Array.isArray(f?.allowlist)?f.allowlist??[]:[];return{ready:t,disabled:e.execApprovalsSaving||e.execApprovalsLoading,dirty:e.execApprovalsDirty,loading:e.execApprovalsLoading,saving:e.execApprovalsSaving,form:n,defaults:i,selectedScope:d,selectedAgent:f,agents:s,allowlist:y,target:o,targetNodeId:r,targetNodes:a,onSelectScope:e.onExecApprovalsSelectAgent,onSelectTarget:e.onExecApprovalsTargetChange,onPatch:e.onExecApprovalsPatch,onRemove:e.onExecApprovalsRemove,onLoad:e.onLoadExecApprovals,onSave:e.onSaveExecApprovals}}function Qr(e){const n=e.nodes.length>0,t=e.defaultBinding??"";return l`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec node binding</div>
          <div class="card-sub">
            Pin agents to a specific node when using <span class="mono">exec host=node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.configDirty}
          @click=${e.onSave}
        >
          ${e.configSaving?"Saving…":"Save"}
        </button>
      </div>

      ${e.formMode==="raw"?l`
              <div class="callout warn" style="margin-top: 12px">
                Switch the Config tab to <strong>Form</strong> mode to edit bindings here.
              </div>
            `:v}

      ${e.ready?l`
            <div class="list" style="margin-top: 16px;">
              <div class="list-item">
                <div class="list-main">
                  <div class="list-title">Default binding</div>
                  <div class="list-sub">Used when agents do not override a node binding.</div>
                </div>
                <div class="list-meta">
                  <label class="field">
                    <span>Node</span>
                    <select
                      ?disabled=${e.disabled||!n}
                      @change=${i=>{const a=i.target.value.trim();e.onBindDefault(a||null)}}
                    >
                      <option value="" ?selected=${t===""}>Any node</option>
                      ${e.nodes.map(i=>l`<option
                            value=${i.id}
                            ?selected=${t===i.id}
                          >
                            ${i.label}
                          </option>`)}
                    </select>
                  </label>
                  ${n?v:l`
                          <div class="muted">No nodes with system.run available.</div>
                        `}
                </div>
              </div>

              ${e.agents.length===0?l`
                      <div class="muted">No agents found.</div>
                    `:e.agents.map(i=>tc(i,e))}
            </div>
          `:l`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load config to edit bindings.</div>
            <button class="btn" ?disabled=${e.configLoading} @click=${e.onLoadConfig}>
              ${e.configLoading?"Loading…":"Load config"}
            </button>
          </div>`}
    </section>
  `}function Jr(e){const n=e.ready,t=e.target!=="node"||!!e.targetNodeId;return l`
    <section class="card">
      <div class="row" style="justify-content: space-between; align-items: center;">
        <div>
          <div class="card-title">Exec approvals</div>
          <div class="card-sub">
            Allowlist and approval policy for <span class="mono">exec host=gateway/node</span>.
          </div>
        </div>
        <button
          class="btn"
          ?disabled=${e.disabled||!e.dirty||!t}
          @click=${e.onSave}
        >
          ${e.saving?"Saving…":"Save"}
        </button>
      </div>

      ${Yr(e)}

      ${n?l`
            ${Xr(e)}
            ${Zr(e)}
            ${e.selectedScope===j?v:ec(e)}
          `:l`<div class="row" style="margin-top: 12px; gap: 12px;">
            <div class="muted">Load exec approvals to edit allowlists.</div>
            <button class="btn" ?disabled=${e.loading||!t} @click=${e.onLoad}>
              ${e.loading?"Loading…":"Load approvals"}
            </button>
          </div>`}
    </section>
  `}function Yr(e){const n=e.targetNodes.length>0,t=e.targetNodeId??"";return l`
    <div class="list" style="margin-top: 12px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Target</div>
          <div class="list-sub">
            Gateway edits local approvals; node edits the selected node.
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Host</span>
            <select
              ?disabled=${e.disabled}
              @change=${i=>{if(i.target.value==="node"){const o=e.targetNodes[0]?.id??null;e.onSelectTarget("node",t||o)}else e.onSelectTarget("gateway",null)}}
            >
              <option value="gateway" ?selected=${e.target==="gateway"}>Gateway</option>
              <option value="node" ?selected=${e.target==="node"}>Node</option>
            </select>
          </label>
          ${e.target==="node"?l`
                <label class="field">
                  <span>Node</span>
                  <select
                    ?disabled=${e.disabled||!n}
                    @change=${i=>{const a=i.target.value.trim();e.onSelectTarget("node",a||null)}}
                  >
                    <option value="" ?selected=${t===""}>Select node</option>
                    ${e.targetNodes.map(i=>l`<option
                          value=${i.id}
                          ?selected=${t===i.id}
                        >
                          ${i.label}
                        </option>`)}
                  </select>
                </label>
              `:v}
        </div>
      </div>
      ${e.target==="node"&&!n?l`
              <div class="muted">No nodes advertise exec approvals yet.</div>
            `:v}
    </div>
  `}function Xr(e){return l`
    <div class="row" style="margin-top: 12px; gap: 8px; flex-wrap: wrap;">
      <span class="label">Scope</span>
      <div class="row" style="gap: 8px; flex-wrap: wrap;">
        <button
          class="btn btn--sm ${e.selectedScope===j?"active":""}"
          @click=${()=>e.onSelectScope(j)}
        >
          Defaults
        </button>
        ${e.agents.map(n=>{const t=n.name?.trim()?`${n.name} (${n.id})`:n.id;return l`
            <button
              class="btn btn--sm ${e.selectedScope===n.id?"active":""}"
              @click=${()=>e.onSelectScope(n.id)}
            >
              ${t}
            </button>
          `})}
      </div>
    </div>
  `}function Zr(e){const n=e.selectedScope===j,t=e.defaults,i=e.selectedAgent??{},s=n?["defaults"]:["agents",e.selectedScope],a=typeof i.security=="string"?i.security:void 0,o=typeof i.ask=="string"?i.ask:void 0,r=typeof i.askFallback=="string"?i.askFallback:void 0,d=n?t.security:a??"__default__",f=n?t.ask:o??"__default__",y=n?t.askFallback:r??"__default__",g=typeof i.autoAllowSkills=="boolean"?i.autoAllowSkills:void 0,c=g??t.autoAllowSkills,u=g==null;return l`
    <div class="list" style="margin-top: 16px;">
      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Security</div>
          <div class="list-sub">
            ${n?"Default security mode.":`Default: ${t.security}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const w=b.target.value;!n&&w==="__default__"?e.onRemove([...s,"security"]):e.onPatch([...s,"security"],w)}}
            >
              ${n?v:l`<option value="__default__" ?selected=${d==="__default__"}>
                    Use default (${t.security})
                  </option>`}
              ${et.map(b=>l`<option
                    value=${b.value}
                    ?selected=${d===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask</div>
          <div class="list-sub">
            ${n?"Default prompt policy.":`Default: ${t.ask}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Mode</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const w=b.target.value;!n&&w==="__default__"?e.onRemove([...s,"ask"]):e.onPatch([...s,"ask"],w)}}
            >
              ${n?v:l`<option value="__default__" ?selected=${f==="__default__"}>
                    Use default (${t.ask})
                  </option>`}
              ${Ur.map(b=>l`<option
                    value=${b.value}
                    ?selected=${f===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Ask fallback</div>
          <div class="list-sub">
            ${n?"Applied when the UI prompt is unavailable.":`Default: ${t.askFallback}.`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Fallback</span>
            <select
              ?disabled=${e.disabled}
              @change=${b=>{const w=b.target.value;!n&&w==="__default__"?e.onRemove([...s,"askFallback"]):e.onPatch([...s,"askFallback"],w)}}
            >
              ${n?v:l`<option value="__default__" ?selected=${y==="__default__"}>
                    Use default (${t.askFallback})
                  </option>`}
              ${et.map(b=>l`<option
                    value=${b.value}
                    ?selected=${y===b.value}
                  >
                    ${b.label}
                  </option>`)}
            </select>
          </label>
        </div>
      </div>

      <div class="list-item">
        <div class="list-main">
          <div class="list-title">Auto-allow skill CLIs</div>
          <div class="list-sub">
            ${n?"Allow skill executables listed by the Gateway.":u?`Using default (${t.autoAllowSkills?"on":"off"}).`:`Override (${c?"on":"off"}).`}
          </div>
        </div>
        <div class="list-meta">
          <label class="field">
            <span>Enabled</span>
            <input
              type="checkbox"
              ?disabled=${e.disabled}
              .checked=${c}
              @change=${b=>{const $=b.target;e.onPatch([...s,"autoAllowSkills"],$.checked)}}
            />
          </label>
          ${!n&&!u?l`<button
                class="btn btn--sm"
                ?disabled=${e.disabled}
                @click=${()=>e.onRemove([...s,"autoAllowSkills"])}
              >
                Use default
              </button>`:v}
        </div>
      </div>
    </div>
  `}function ec(e){const n=["agents",e.selectedScope,"allowlist"],t=e.allowlist;return l`
    <div class="row" style="margin-top: 18px; justify-content: space-between;">
      <div>
        <div class="card-title">Allowlist</div>
        <div class="card-sub">Case-insensitive glob patterns.</div>
      </div>
      <button
        class="btn btn--sm"
        ?disabled=${e.disabled}
        @click=${()=>{const i=[...t,{pattern:""}];e.onPatch(n,i)}}
      >
        Add pattern
      </button>
    </div>
    <div class="list" style="margin-top: 12px;">
      ${t.length===0?l`
              <div class="muted">No allowlist entries yet.</div>
            `:t.map((i,s)=>nc(e,i,s))}
    </div>
  `}function nc(e,n,t){const i=n.lastUsedAt?I(n.lastUsedAt):"never",s=n.lastUsedCommand?Qe(n.lastUsedCommand,120):null,a=n.lastResolvedPath?Qe(n.lastResolvedPath,120):null;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${n.pattern?.trim()?n.pattern:"New pattern"}</div>
        <div class="list-sub">Last used: ${i}</div>
        ${s?l`<div class="list-sub mono">${s}</div>`:v}
        ${a?l`<div class="list-sub mono">${a}</div>`:v}
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Pattern</span>
          <input
            type="text"
            .value=${n.pattern??""}
            ?disabled=${e.disabled}
            @input=${o=>{const r=o.target;e.onPatch(["agents",e.selectedScope,"allowlist",t,"pattern"],r.value)}}
          />
        </label>
        <button
          class="btn btn--sm danger"
          ?disabled=${e.disabled}
          @click=${()=>{if(e.allowlist.length<=1){e.onRemove(["agents",e.selectedScope,"allowlist"]);return}e.onRemove(["agents",e.selectedScope,"allowlist",t])}}
        >
          Remove
        </button>
      </div>
    </div>
  `}function tc(e,n){const t=e.binding??"__default__",i=e.name?.trim()?`${e.name} (${e.id})`:e.id,s=n.nodes.length>0;return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${i}</div>
        <div class="list-sub">
          ${e.isDefault?"default agent":"agent"} ·
          ${t==="__default__"?`uses default (${n.defaultBinding??"any"})`:`override: ${e.binding}`}
        </div>
      </div>
      <div class="list-meta">
        <label class="field">
          <span>Binding</span>
          <select
            ?disabled=${n.disabled||!s}
            @change=${a=>{const r=a.target.value.trim();n.onBindAgent(e.index,r==="__default__"?null:r)}}
          >
            <option value="__default__" ?selected=${t==="__default__"}>
              Use default
            </option>
            ${n.nodes.map(a=>l`<option
                  value=${a.id}
                  ?selected=${t===a.id}
                >
                  ${a.label}
                </option>`)}
          </select>
        </label>
      </div>
    </div>
  `}function ic(e){const n=[];for(const t of e){if(!(Array.isArray(t.commands)?t.commands:[]).some(r=>String(r)==="system.run"))continue;const a=typeof t.nodeId=="string"?t.nodeId.trim():"";if(!a)continue;const o=typeof t.displayName=="string"&&t.displayName.trim()?t.displayName.trim():a;n.push({id:a,label:o===a?a:`${o} · ${a}`})}return n.sort((t,i)=>t.label.localeCompare(i.label)),n}function sc(e){const n=[];for(const t of e){if(!(Array.isArray(t.commands)?t.commands:[]).some(r=>String(r)==="system.execApprovals.get"||String(r)==="system.execApprovals.set"))continue;const a=typeof t.nodeId=="string"?t.nodeId.trim():"";if(!a)continue;const o=typeof t.displayName=="string"&&t.displayName.trim()?t.displayName.trim():a;n.push({id:a,label:o===a?a:`${o} · ${a}`})}return n.sort((t,i)=>t.label.localeCompare(i.label)),n}function ac(e){const n={id:"main",name:void 0,index:0,isDefault:!0,binding:null};if(!e||typeof e!="object")return{defaultBinding:null,agents:[n]};const i=(e.tools??{}).exec??{},s=typeof i.node=="string"&&i.node.trim()?i.node.trim():null,a=e.agents??{},o=Array.isArray(a.list)?a.list:[];if(o.length===0)return{defaultBinding:s,agents:[n]};const r=[];return o.forEach((d,f)=>{if(!d||typeof d!="object")return;const y=d,g=typeof y.id=="string"?y.id.trim():"";if(!g)return;const c=typeof y.name=="string"?y.name.trim():void 0,u=y.default===!0,$=(y.tools??{}).exec??{},w=typeof $.node=="string"&&$.node.trim()?$.node.trim():null;r.push({id:g,name:c||void 0,index:f,isDefault:u,binding:w})}),r.length===0&&r.push(n),{defaultBinding:s,agents:r}}function lc(e){const n=!!e.connected,t=!!e.paired,i=typeof e.displayName=="string"&&e.displayName.trim()||(typeof e.nodeId=="string"?e.nodeId:"unknown"),s=Array.isArray(e.caps)?e.caps:[],a=Array.isArray(e.commands)?e.commands:[];return l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">${i}</div>
        <div class="list-sub">
          ${typeof e.nodeId=="string"?e.nodeId:""}
          ${typeof e.remoteIp=="string"?` · ${e.remoteIp}`:""}
          ${typeof e.version=="string"?` · ${e.version}`:""}
        </div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${t?"paired":"unpaired"}</span>
          <span class="chip ${n?"chip-ok":"chip-warn"}">
            ${n?"connected":"offline"}
          </span>
          ${s.slice(0,12).map(o=>l`<span class="chip">${String(o)}</span>`)}
          ${a.slice(0,8).map(o=>l`<span class="chip">${String(o)}</span>`)}
        </div>
      </div>
    </div>
  `}function oc(e){const n=e.hello?.snapshot,t=n?.uptimeMs?ot(n.uptimeMs):"n/a",i=n?.policy?.tickIntervalMs?`${n.policy.tickIntervalMs}ms`:"n/a",s=(()=>{if(e.connected||!e.lastError)return null;const o=e.lastError.toLowerCase();if(!(o.includes("unauthorized")||o.includes("connect failed")))return null;const d=!!e.settings.token.trim(),f=!!e.password.trim();return!d&&!f?l`
        <div class="muted" style="margin-top: 8px">
          This gateway requires auth. Add a token or password, then click Connect.
          <div style="margin-top: 6px">
            <span class="mono">openclaw dashboard --no-open</span> → tokenized URL<br />
            <span class="mono">openclaw doctor --generate-gateway-token</span> → set token
          </div>
          <div style="margin-top: 6px">
            <a
              class="session-link"
              href="https://docs.openclaw.ai/web/dashboard"
              target="_blank"
              rel="noreferrer"
              title="Control UI auth docs (opens in new tab)"
              >Docs: Control UI auth</a
            >
          </div>
        </div>
      `:l`
      <div class="muted" style="margin-top: 8px">
        Auth failed. Re-copy a tokenized URL with
        <span class="mono">openclaw dashboard --no-open</span>, or update the token, then click Connect.
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/dashboard"
            target="_blank"
            rel="noreferrer"
            title="Control UI auth docs (opens in new tab)"
            >Docs: Control UI auth</a
          >
        </div>
      </div>
    `})(),a=(()=>{if(e.connected||!e.lastError||(typeof window<"u"?window.isSecureContext:!0))return null;const r=e.lastError.toLowerCase();return!r.includes("secure context")&&!r.includes("device identity required")?null:l`
      <div class="muted" style="margin-top: 8px">
        This page is HTTP, so the browser blocks device identity. Use HTTPS (Tailscale Serve) or open
        <span class="mono">http://127.0.0.1:18789</span> on the gateway host.
        <div style="margin-top: 6px">
          If you must stay on HTTP, set
          <span class="mono">gateway.controlUi.allowInsecureAuth: true</span> (token-only).
        </div>
        <div style="margin-top: 6px">
          <a
            class="session-link"
            href="https://docs.openclaw.ai/gateway/tailscale"
            target="_blank"
            rel="noreferrer"
            title="Tailscale Serve docs (opens in new tab)"
            >Docs: Tailscale Serve</a
          >
          <span class="muted"> · </span>
          <a
            class="session-link"
            href="https://docs.openclaw.ai/web/control-ui#insecure-http"
            target="_blank"
            rel="noreferrer"
            title="Insecure HTTP docs (opens in new tab)"
            >Docs: Insecure HTTP</a
          >
        </div>
      </div>
    `})();return l`
    <section class="grid grid-cols-2">
      <div class="card">
        <div class="card-title">Gateway Access</div>
        <div class="card-sub">Where the dashboard connects and how it authenticates.</div>
        <div class="form-grid" style="margin-top: 16px;">
          <label class="field">
            <span>WebSocket URL</span>
            <input
              .value=${e.settings.gatewayUrl}
              @input=${o=>{const r=o.target.value;e.onSettingsChange({...e.settings,gatewayUrl:r})}}
              placeholder="ws://100.x.y.z:18789"
            />
          </label>
          <label class="field">
            <span>Gateway Token</span>
            <input
              .value=${e.settings.token}
              @input=${o=>{const r=o.target.value;e.onSettingsChange({...e.settings,token:r})}}
              placeholder="OPENCLAW_GATEWAY_TOKEN"
            />
          </label>
          <label class="field">
            <span>Password (not stored)</span>
            <input
              type="password"
              .value=${e.password}
              @input=${o=>{const r=o.target.value;e.onPasswordChange(r)}}
              placeholder="system or shared password"
            />
          </label>
          <label class="field">
            <span>Default Session Key</span>
            <input
              .value=${e.settings.sessionKey}
              @input=${o=>{const r=o.target.value;e.onSessionKeyChange(r)}}
            />
          </label>
        </div>
        <div class="row" style="margin-top: 14px;">
          <button class="btn" @click=${()=>e.onConnect()}>Connect</button>
          <button class="btn" @click=${()=>e.onRefresh()}>Refresh</button>
          <button class="btn" @click=${()=>e.onOpenTaxChat()}>Open TaxChat</button>
          <span class="muted">Click Connect to apply connection changes.</span>
        </div>
      </div>

      <div class="card">
        <div class="card-title">Snapshot</div>
        <div class="card-sub">Latest gateway handshake information.</div>
        <div class="stat-grid" style="margin-top: 16px;">
          <div class="stat">
            <div class="stat-label">Status</div>
            <div class="stat-value ${e.connected?"ok":"warn"}">
              ${e.connected?"Connected":"Disconnected"}
            </div>
          </div>
          <div class="stat">
            <div class="stat-label">Uptime</div>
            <div class="stat-value">${t}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Tick Interval</div>
            <div class="stat-value">${i}</div>
          </div>
          <div class="stat">
            <div class="stat-label">Last Channels Refresh</div>
            <div class="stat-value">
              ${e.lastChannelsRefresh?I(e.lastChannelsRefresh):"n/a"}
            </div>
          </div>
        </div>
        ${e.lastError?l`<div class="callout danger" style="margin-top: 14px;">
              <div>${e.lastError}</div>
              ${s??""}
              ${a??""}
            </div>`:l`
                  <div class="callout" style="margin-top: 14px">
                  Use Channels to link WhatsApp, Telegram, Discord, Signal, or iMessage.
                  <div style="margin-top:6px">
                    <a
                      class="session-link"
                      href="https://docs.openclaw.ai/web/webchat"
                      target="_blank"
                      rel="noreferrer"
                      title="Docs: WebChat (opens in new tab)"
                      >Docs: WebChat</a
                    >
                  </div>
                </div>
              `}
      </div>
    </section>

    <section class="grid grid-cols-3" style="margin-top: 18px;">
      <div class="card stat-card">
        <div class="stat-label">Instances</div>
        <div class="stat-value">${e.presenceCount}</div>
        <div class="muted">Presence beacons in the last 5 minutes.</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Sessions</div>
        <div class="stat-value">${e.sessionsCount??"n/a"}</div>
        <div class="muted">Recent session keys tracked by the gateway.</div>
      </div>
      <div class="card stat-card">
        <div class="stat-label">Cron</div>
        <div class="stat-value">
          ${e.cronEnabled==null?"n/a":e.cronEnabled?"Enabled":"Disabled"}
        </div>
        <div class="muted">Next wake ${mn(e.cronNext)}</div>
      </div>
    </section>

    <section class="card" style="margin-top: 18px;">
      <div class="card-title">Notes</div>
      <div class="card-sub">Quick reminders for remote control setups.</div>
      <div class="note-grid" style="margin-top: 14px;">
        <div>
          <div class="note-title">Tailscale serve</div>
          <div class="muted">
            Prefer serve mode to keep the gateway on loopback with tailnet auth.
          </div>
        </div>
        <div>
          <div class="note-title">Session hygiene</div>
          <div class="muted">Use /new or sessions.patch to reset context.</div>
        </div>
        <div>
          <div class="note-title">Cron reminders</div>
          <div class="muted">Use isolated sessions for recurring runs.</div>
        </div>
      </div>
    </section>
  `}const rc=["","off","minimal","low","medium","high"],cc=["","off","on"],dc=[{value:"",label:"inherit"},{value:"off",label:"off (explicit)"},{value:"on",label:"on"}],uc=["","off","on","stream"];function gc(e){if(!e)return"";const n=e.trim().toLowerCase();return n==="z.ai"||n==="z-ai"?"zai":n}function ai(e){return gc(e)==="zai"}function vc(e){return ai(e)?cc:rc}function fc(e,n){return!n||!e||e==="off"?e:"on"}function pc(e,n){return e?n&&e==="on"?"low":e:null}function hc(e){const n=e.result?.sessions??[];return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Sessions</div>
          <div class="card-sub">Active session keys and per-session overrides.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field">
          <span>Active within (minutes)</span>
          <input
            .value=${e.activeMinutes}
            @input=${t=>e.onFiltersChange({activeMinutes:t.target.value,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field">
          <span>Limit</span>
          <input
            .value=${e.limit}
            @input=${t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:t.target.value,includeGlobal:e.includeGlobal,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include global</span>
          <input
            type="checkbox"
            .checked=${e.includeGlobal}
            @change=${t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:t.target.checked,includeUnknown:e.includeUnknown})}
          />
        </label>
        <label class="field checkbox">
          <span>Include unknown</span>
          <input
            type="checkbox"
            .checked=${e.includeUnknown}
            @change=${t=>e.onFiltersChange({activeMinutes:e.activeMinutes,limit:e.limit,includeGlobal:e.includeGlobal,includeUnknown:t.target.checked})}
          />
        </label>
      </div>

      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}

      <div class="muted" style="margin-top: 12px;">
        ${e.result?`Store: ${e.result.path}`:""}
      </div>

      <div class="table" style="margin-top: 16px;">
        <div class="table-head">
          <div>Key</div>
          <div>Label</div>
          <div>Kind</div>
          <div>Updated</div>
          <div>Tokens</div>
          <div>Thinking</div>
          <div>Verbose</div>
          <div>Reasoning</div>
          <div>Actions</div>
        </div>
        ${n.length===0?l`
                <div class="muted">No sessions found.</div>
              `:n.map(t=>mc(t,e.basePath,e.onPatch,e.onDelete,e.loading))}
      </div>
    </section>
  `}function mc(e,n,t,i,s){const a=e.updatedAt?I(e.updatedAt):"n/a",o=e.thinkingLevel??"",r=ai(e.modelProvider),d=fc(o,r),f=vc(e.modelProvider),y=e.verboseLevel??"",g=e.reasoningLevel??"",c=e.displayName??e.key,u=e.kind!=="global",b=u?`${fn("chat",n)}?session=${encodeURIComponent(e.key)}`:null;return l`
    <div class="table-row">
      <div class="mono">${u?l`<a href=${b} class="session-link">${c}</a>`:c}</div>
      <div>
        <input
          .value=${e.label??""}
          ?disabled=${s}
          placeholder="(optional)"
          @change=${$=>{const w=$.target.value.trim();t(e.key,{label:w||null})}}
        />
      </div>
      <div>${e.kind}</div>
      <div>${a}</div>
      <div>${il(e)}</div>
      <div>
        <select
          .value=${d}
          ?disabled=${s}
          @change=${$=>{const w=$.target.value;t(e.key,{thinkingLevel:pc(w,r)})}}
        >
          ${f.map($=>l`<option value=${$}>${$||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${y}
          ?disabled=${s}
          @change=${$=>{const w=$.target.value;t(e.key,{verboseLevel:w||null})}}
        >
          ${dc.map($=>l`<option value=${$.value}>${$.label}</option>`)}
        </select>
      </div>
      <div>
        <select
          .value=${g}
          ?disabled=${s}
          @change=${$=>{const w=$.target.value;t(e.key,{reasoningLevel:w||null})}}
        >
          ${uc.map($=>l`<option value=${$}>${$||"inherit"}</option>`)}
        </select>
      </div>
      <div>
        <button class="btn danger" ?disabled=${s} @click=${()=>i(e.key)}>
          Delete
        </button>
      </div>
    </div>
  `}const ze=[{id:"workspace",label:"Workspace Skills",sources:["openclaw-workspace"]},{id:"built-in",label:"Built-in Skills",sources:["openclaw-bundled"]},{id:"installed",label:"Installed Skills",sources:["openclaw-managed"]},{id:"extra",label:"Extra Skills",sources:["openclaw-extra"]}];function yc(e){const n=new Map;for(const s of ze)n.set(s.id,{id:s.id,label:s.label,skills:[]});const t={id:"other",label:"Other Skills",skills:[]};for(const s of e){const a=ze.find(o=>o.sources.includes(s.source));a?n.get(a.id)?.skills.push(s):t.skills.push(s)}const i=ze.map(s=>n.get(s.id)).filter(s=>!!(s&&s.skills.length>0));return t.skills.length>0&&i.push(t),i}function bc(e){const n=e.report?.skills??[],t=e.filter.trim().toLowerCase(),i=t?n.filter(a=>[a.name,a.description,a.source].join(" ").toLowerCase().includes(t)):n,s=yc(i);return l`
    <section class="card">
      <div class="row" style="justify-content: space-between;">
        <div>
          <div class="card-title">Skills</div>
          <div class="card-sub">Bundled, managed, and workspace skills.</div>
        </div>
        <button class="btn" ?disabled=${e.loading} @click=${e.onRefresh}>
          ${e.loading?"Loading…":"Refresh"}
        </button>
      </div>

      <div class="filters" style="margin-top: 14px;">
        <label class="field" style="flex: 1;">
          <span>Filter</span>
          <input
            .value=${e.filter}
            @input=${a=>e.onFilterChange(a.target.value)}
            placeholder="Search skills"
          />
        </label>
        <div class="muted">${i.length} shown</div>
      </div>

      ${e.error?l`<div class="callout danger" style="margin-top: 12px;">${e.error}</div>`:v}

      ${i.length===0?l`
              <div class="muted" style="margin-top: 16px">No skills found.</div>
            `:l`
            <div class="agent-skills-groups" style="margin-top: 16px;">
              ${s.map(a=>{const o=a.id==="workspace"||a.id==="built-in";return l`
                  <details class="agent-skills-group" ?open=${!o}>
                    <summary class="agent-skills-header">
                      <span>${a.label}</span>
                      <span class="muted">${a.skills.length}</span>
                    </summary>
                    <div class="list skills-grid">
                      ${a.skills.map(r=>$c(r,e))}
                    </div>
                  </details>
                `})}
            </div>
          `}
    </section>
  `}function $c(e,n){const t=n.busyKey===e.skillKey,i=n.edits[e.skillKey]??"",s=n.messages[e.skillKey]??null,a=e.install.length>0&&e.missing.bins.length>0,o=[...e.missing.bins.map(d=>`bin:${d}`),...e.missing.env.map(d=>`env:${d}`),...e.missing.config.map(d=>`config:${d}`),...e.missing.os.map(d=>`os:${d}`)],r=[];return e.disabled&&r.push("disabled"),e.blockedByAllowlist&&r.push("blocked by allowlist"),l`
    <div class="list-item">
      <div class="list-main">
        <div class="list-title">
          ${e.emoji?`${e.emoji} `:""}${e.name}
        </div>
        <div class="list-sub">${Qe(e.description,140)}</div>
        <div class="chip-row" style="margin-top: 6px;">
          <span class="chip">${e.source}</span>
          <span class="chip ${e.eligible?"chip-ok":"chip-warn"}">
            ${e.eligible?"eligible":"blocked"}
          </span>
          ${e.disabled?l`
                  <span class="chip chip-warn">disabled</span>
                `:v}
        </div>
        ${o.length>0?l`
              <div class="muted" style="margin-top: 6px;">
                Missing: ${o.join(", ")}
              </div>
            `:v}
        ${r.length>0?l`
              <div class="muted" style="margin-top: 6px;">
                Reason: ${r.join(", ")}
              </div>
            `:v}
      </div>
      <div class="list-meta">
        <div class="row" style="justify-content: flex-end; flex-wrap: wrap;">
          <button
            class="btn"
            ?disabled=${t}
            @click=${()=>n.onToggle(e.skillKey,e.disabled)}
          >
            ${e.disabled?"Enable":"Disable"}
          </button>
          ${a?l`<button
                class="btn"
                ?disabled=${t}
                @click=${()=>n.onInstall(e.skillKey,e.name,e.install[0].id)}
              >
                ${t?"Installing…":e.install[0].label}
              </button>`:v}
        </div>
        ${s?l`<div
              class="muted"
              style="margin-top: 8px; color: ${s.kind==="error"?"var(--danger-color, #d14343)":"var(--success-color, #0a7f5a)"};"
            >
              ${s.message}
            </div>`:v}
        ${e.primaryEnv?l`
              <div class="field" style="margin-top: 10px;">
                <span>API key</span>
                <input
                  type="password"
                  .value=${i}
                  @input=${d=>n.onEdit(e.skillKey,d.target.value)}
                />
              </div>
              <button
                class="btn primary"
                style="margin-top: 8px;"
                ?disabled=${t}
                @click=${()=>n.onSaveKey(e.skillKey)}
              >
                Save key
              </button>
            `:v}
      </div>
    </div>
  `}const wc=/^data:/i,Sc=/^https?:\/\//i;function xc(e){const n=e.agentsList?.agents??[],i=pt(e.sessionKey)?.agentId??e.agentsList?.defaultId??"main",a=n.find(r=>r.id===i)?.identity,o=a?.avatarUrl??a?.avatar;if(o)return wc.test(o)||Sc.test(o)?o:a?.avatarUrl}function kc(e){const n=e.presenceEntries.length,t=e.sessionsResult?.count??null,i=e.cronStatus?.nextWakeAtMs??null,s=e.connected?null:"Disconnected from gateway.",a=e.tab==="chat"||e.tab==="taxchat",o=a&&(e.settings.chatFocusMode||e.onboarding),r=e.onboarding?!1:e.settings.chatShowThinking,d=xc(e),f=e.chatAvatarUrl??d??null,y=e.configForm??e.configSnapshot?.config,g=e.agentsSelectedId??e.agentsList?.defaultId??e.agentsList?.agents?.[0]?.id??null;return l`
    <div class="shell ${a?"shell--chat":""} ${o?"shell--chat-focus":""} ${e.settings.navCollapsed?"shell--nav-collapsed":""} ${e.onboarding?"shell--onboarding":""}">
      <header class="topbar">
        <div class="topbar-left">
          <button
            class="nav-collapse-toggle"
            @click=${()=>e.applySettings({...e.settings,navCollapsed:!e.settings.navCollapsed})}
            title="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
            aria-label="${e.settings.navCollapsed?"Expand sidebar":"Collapse sidebar"}"
          >
            <span class="nav-collapse-toggle__icon">${M.menu}</span>
          </button>
          <div class="brand">
            <div class="brand-logo">
              <img src="/favicon.svg" alt="智税宝" />
            </div>
            <div class="brand-text">
              <div class="brand-title">智税宝</div>
              <div class="brand-sub">智能税务助手</div>
            </div>
          </div>
        </div>
        <div class="topbar-status">
          <div class="pill">
            <span class="statusDot ${e.connected?"ok":""}"></span>
            <span>Health</span>
            <span class="mono">${e.connected?"OK":"Offline"}</span>
          </div>
          ${Ha(e)}
        </div>
      </header>
      <aside class="nav ${e.settings.navCollapsed?"nav--collapsed":""}">
        ${Ss.map(c=>{const u=e.settings.navGroupsCollapsed[c.label]??!1,b=c.tabs.some($=>$===e.tab);return l`
            <div class="nav-group ${u&&!b?"nav-group--collapsed":""}">
              <button
                class="nav-label"
                @click=${()=>{const $={...e.settings.navGroupsCollapsed};$[c.label]=!u,e.applySettings({...e.settings,navGroupsCollapsed:$})}}
                aria-expanded=${!u}
              >
                <span class="nav-label__text">${c.label}</span>
                <span class="nav-label__chevron">${u?"+":"−"}</span>
              </button>
              <div class="nav-group__items">
                ${c.tabs.map($=>Da(e,$))}
              </div>
            </div>
          `})}
        <div class="nav-group nav-group--links">
          <div class="nav-label nav-label--static">
            <span class="nav-label__text">Resources</span>
          </div>
          <div class="nav-group__items">
            <a
              class="nav-item nav-item--external"
              href="https://docs.openclaw.ai"
              target="_blank"
              rel="noreferrer"
              title="Docs (opens in new tab)"
            >
              <span class="nav-item__icon" aria-hidden="true">${M.book}</span>
              <span class="nav-item__text">Docs</span>
            </a>
          </div>
        </div>
      </aside>
      <main class="content ${a?"content--chat":""}">
        <section class="content-header">
          <div>
            <div class="page-title">${Ye(e.tab)}</div>
            <div class="page-sub">${As(e.tab)}</div>
          </div>
          <div class="page-meta">
            ${e.lastError?l`<div class="pill danger">${e.lastError}</div>`:v}
            ${a?Ka(e):v}
          </div>
        </section>

        ${e.tab==="overview"?oc({connected:e.connected,hello:e.hello,settings:e.settings,password:e.password,lastError:e.lastError,presenceCount:n,sessionsCount:t,cronEnabled:e.cronStatus?.enabled??null,cronNext:i,lastChannelsRefresh:e.channelsLastSuccess,onSettingsChange:c=>e.applySettings(c),onPasswordChange:c=>e.password=c,onSessionKeyChange:c=>{e.sessionKey=c,e.chatMessage="",e.resetToolStream(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c}),e.loadAssistantIdentity()},onOpenTaxChat:()=>{const c="taxchat";e.sessionKey=c,e.chatMessage="",e.resetToolStream(),e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c}),e.setTab("chat"),e.loadAssistantIdentity(),U(e)},onConnect:()=>e.connect(),onRefresh:()=>e.loadOverview()}):v}

        ${e.tab==="channels"?ro({connected:e.connected,loading:e.channelsLoading,snapshot:e.channelsSnapshot,lastError:e.channelsError,lastSuccessAt:e.channelsLastSuccess,whatsappMessage:e.whatsappLoginMessage,whatsappQrDataUrl:e.whatsappLoginQrDataUrl,whatsappConnected:e.whatsappLoginConnected,whatsappBusy:e.whatsappBusy,configSchema:e.configSchema,configSchemaLoading:e.configSchemaLoading,configForm:e.configForm,configUiHints:e.configUiHints,configSaving:e.configSaving,configFormDirty:e.configFormDirty,nostrProfileFormState:e.nostrProfileFormState,nostrProfileAccountId:e.nostrProfileAccountId,onRefresh:c=>E(e,c),onWhatsAppStart:c=>e.handleWhatsAppStart(c),onWhatsAppWait:()=>e.handleWhatsAppWait(),onWhatsAppLogout:()=>e.handleWhatsAppLogout(),onConfigPatch:(c,u)=>F(e,c,u),onConfigSave:()=>e.handleChannelConfigSave(),onConfigReload:()=>e.handleChannelConfigReload(),onNostrProfileEdit:(c,u)=>e.handleNostrProfileEdit(c,u),onNostrProfileCancel:()=>e.handleNostrProfileCancel(),onNostrProfileFieldChange:(c,u)=>e.handleNostrProfileFieldChange(c,u),onNostrProfileSave:()=>e.handleNostrProfileSave(),onNostrProfileImport:()=>e.handleNostrProfileImport(),onNostrProfileToggleAdvanced:()=>e.handleNostrProfileToggleAdvanced()}):v}

        ${e.tab==="instances"?Er({loading:e.presenceLoading,entries:e.presenceEntries,lastError:e.presenceError,statusMessage:e.presenceStatus,onRefresh:()=>vn(e)}):v}

        ${e.tab==="sessions"?hc({loading:e.sessionsLoading,result:e.sessionsResult,error:e.sessionsError,activeMinutes:e.sessionsFilterActive,limit:e.sessionsFilterLimit,includeGlobal:e.sessionsIncludeGlobal,includeUnknown:e.sessionsIncludeUnknown,basePath:e.basePath,onFiltersChange:c=>{e.sessionsFilterActive=c.activeMinutes,e.sessionsFilterLimit=c.limit,e.sessionsIncludeGlobal=c.includeGlobal,e.sessionsIncludeUnknown=c.includeUnknown},onRefresh:()=>W(e),onPatch:(c,u)=>hs(e,c,u),onDelete:c=>ms(e,c)}):v}

        ${e.tab==="cron"?xr({loading:e.cronLoading,status:e.cronStatus,jobs:e.cronJobs,error:e.cronError,busy:e.cronBusy,form:e.cronForm,channels:e.channelsSnapshot?.channelMeta?.length?e.channelsSnapshot.channelMeta.map(c=>c.id):e.channelsSnapshot?.channelOrder??[],channelLabels:e.channelsSnapshot?.channelLabels??{},channelMeta:e.channelsSnapshot?.channelMeta??[],runsJobId:e.cronRunsJobId,runs:e.cronRuns,onFormChange:c=>e.cronForm={...e.cronForm,...c},onRefresh:()=>e.loadCron(),onAdd:()=>ts(e),onToggle:(c,u)=>is(e,c,u),onRun:c=>ss(e,c),onRemove:c=>as(e,c),onLoadRuns:c=>bt(e,c)}):v}

        ${e.tab==="agents"?vl({loading:e.agentsLoading,error:e.agentsError,agentsList:e.agentsList,selectedAgentId:g,activePanel:e.agentsPanel,configForm:y,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,channelsLoading:e.channelsLoading,channelsError:e.channelsError,channelsSnapshot:e.channelsSnapshot,channelsLastSuccess:e.channelsLastSuccess,cronLoading:e.cronLoading,cronStatus:e.cronStatus,cronJobs:e.cronJobs,cronError:e.cronError,agentFilesLoading:e.agentFilesLoading,agentFilesError:e.agentFilesError,agentFilesList:e.agentFilesList,agentFileActive:e.agentFileActive,agentFileContents:e.agentFileContents,agentFileDrafts:e.agentFileDrafts,agentFileSaving:e.agentFileSaving,agentIdentityLoading:e.agentIdentityLoading,agentIdentityError:e.agentIdentityError,agentIdentityById:e.agentIdentityById,agentSkillsLoading:e.agentSkillsLoading,agentSkillsReport:e.agentSkillsReport,agentSkillsError:e.agentSkillsError,agentSkillsAgentId:e.agentSkillsAgentId,skillsFilter:e.skillsFilter,onRefresh:async()=>{await un(e);const c=e.agentsList?.agents?.map(u=>u.id)??[];c.length>0&&yt(e,c)},onSelectAgent:c=>{e.agentsSelectedId!==c&&(e.agentsSelectedId=c,e.agentFilesList=null,e.agentFilesError=null,e.agentFilesLoading=!1,e.agentFileActive=null,e.agentFileContents={},e.agentFileDrafts={},e.agentSkillsReport=null,e.agentSkillsError=null,e.agentSkillsAgentId=null,mt(e,c),e.agentsPanel==="files"&&Ue(e,c),e.agentsPanel==="skills"&&me(e,c))},onSelectPanel:c=>{e.agentsPanel=c,c==="files"&&g&&e.agentFilesList?.agentId!==g&&(e.agentFilesList=null,e.agentFilesError=null,e.agentFileActive=null,e.agentFileContents={},e.agentFileDrafts={},Ue(e,g)),c==="skills"&&g&&me(e,g),c==="channels"&&E(e,!1),c==="cron"&&e.loadCron()},onLoadFiles:c=>Ue(e,c),onSelectFile:c=>{e.agentFileActive=c,g&&Ga(e,g,c)},onFileDraftChange:(c,u)=>{e.agentFileDrafts={...e.agentFileDrafts,[c]:u}},onFileReset:c=>{const u=e.agentFileContents[c]??"";e.agentFileDrafts={...e.agentFileDrafts,[c]:u}},onFileSave:c=>{if(!g)return;const u=e.agentFileDrafts[c]??e.agentFileContents[c]??"";Wa(e,g,c,u)},onToolsProfileChange:(c,u,b)=>{if(!y)return;const $=y.agents?.list;if(!Array.isArray($))return;const w=$.findIndex(x=>x&&typeof x=="object"&&"id"in x&&x.id===c);if(w<0)return;const S=["agents","list",w,"tools"];u?F(e,[...S,"profile"],u):N(e,[...S,"profile"]),b&&N(e,[...S,"allow"])},onToolsOverridesChange:(c,u,b)=>{if(!y)return;const $=y.agents?.list;if(!Array.isArray($))return;const w=$.findIndex(x=>x&&typeof x=="object"&&"id"in x&&x.id===c);if(w<0)return;const S=["agents","list",w,"tools"];u.length>0?F(e,[...S,"alsoAllow"],u):N(e,[...S,"alsoAllow"]),b.length>0?F(e,[...S,"deny"],b):N(e,[...S,"deny"])},onConfigReload:()=>R(e),onConfigSave:()=>he(e),onChannelsRefresh:()=>E(e,!1),onCronRefresh:()=>e.loadCron(),onSkillsFilterChange:c=>e.skillsFilter=c,onSkillsRefresh:()=>{g&&me(e,g)},onAgentSkillToggle:(c,u,b)=>{if(!y)return;const $=y.agents?.list;if(!Array.isArray($))return;const w=$.findIndex(_=>_&&typeof _=="object"&&"id"in _&&_.id===c);if(w<0)return;const S=$[w],x=u.trim();if(!x)return;const A=e.agentSkillsReport?.skills?.map(_=>_.name).filter(Boolean)??[],C=(Array.isArray(S.skills)?S.skills.map(_=>String(_).trim()).filter(Boolean):void 0)??A,k=new Set(C);b?k.add(x):k.delete(x),F(e,["agents","list",w,"skills"],[...k])},onAgentSkillsClear:c=>{if(!y)return;const u=y.agents?.list;if(!Array.isArray(u))return;const b=u.findIndex($=>$&&typeof $=="object"&&"id"in $&&$.id===c);b<0||N(e,["agents","list",b,"skills"])},onAgentSkillsDisableAll:c=>{if(!y)return;const u=y.agents?.list;if(!Array.isArray(u))return;const b=u.findIndex($=>$&&typeof $=="object"&&"id"in $&&$.id===c);b<0||F(e,["agents","list",b,"skills"],[])},onModelChange:(c,u)=>{if(!y)return;const b=y.agents?.list;if(!Array.isArray(b))return;const $=b.findIndex(A=>A&&typeof A=="object"&&"id"in A&&A.id===c);if($<0)return;const w=["agents","list",$,"model"];if(!u){N(e,w);return}const x=b[$]?.model;if(x&&typeof x=="object"&&!Array.isArray(x)){const A=x.fallbacks,L={primary:u,...Array.isArray(A)?{fallbacks:A}:{}};F(e,w,L)}else F(e,w,u)},onModelFallbacksChange:(c,u)=>{if(!y)return;const b=y.agents?.list;if(!Array.isArray(b))return;const $=b.findIndex(_=>_&&typeof _=="object"&&"id"in _&&_.id===c);if($<0)return;const w=["agents","list",$,"model"],S=b[$],x=u.map(_=>_.trim()).filter(Boolean),A=S.model,C=(()=>{if(typeof A=="string")return A.trim()||null;if(A&&typeof A=="object"&&!Array.isArray(A)){const _=A.primary;if(typeof _=="string")return _.trim()||null}return null})();if(x.length===0){C?F(e,w,C):N(e,w);return}F(e,w,C?{primary:C,fallbacks:x}:{fallbacks:x})}}):v}

        ${e.tab==="skills"?bc({loading:e.skillsLoading,report:e.skillsReport,error:e.skillsError,filter:e.skillsFilter,edits:e.skillEdits,messages:e.skillMessages,busyKey:e.skillsBusyKey,onFilterChange:c=>e.skillsFilter=c,onRefresh:()=>de(e,{clearMessages:!0}),onToggle:(c,u)=>bs(e,c,u),onEdit:(c,u)=>ys(e,c,u),onSaveKey:c=>$s(e,c),onInstall:(c,u,b)=>ws(e,c,u,b)}):v}

        ${e.tab==="nodes"?Br({loading:e.nodesLoading,nodes:e.nodes,devicesLoading:e.devicesLoading,devicesError:e.devicesError,devicesList:e.devicesList,configForm:e.configForm??e.configSnapshot?.config,configLoading:e.configLoading,configSaving:e.configSaving,configDirty:e.configFormDirty,configFormMode:e.configFormMode,execApprovalsLoading:e.execApprovalsLoading,execApprovalsSaving:e.execApprovalsSaving,execApprovalsDirty:e.execApprovalsDirty,execApprovalsSnapshot:e.execApprovalsSnapshot,execApprovalsForm:e.execApprovalsForm,execApprovalsSelectedAgent:e.execApprovalsSelectedAgent,execApprovalsTarget:e.execApprovalsTarget,execApprovalsTargetNodeId:e.execApprovalsTargetNodeId,onRefresh:()=>xe(e),onDevicesRefresh:()=>z(e),onDeviceApprove:c=>ls(e,c),onDeviceReject:c=>os(e,c),onDeviceRotate:(c,u,b)=>rs(e,{deviceId:c,role:u,scopes:b}),onDeviceRevoke:(c,u)=>cs(e,{deviceId:c,role:u}),onLoadConfig:()=>R(e),onLoadExecApprovals:()=>{const c=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return gn(e,c)},onBindDefault:c=>{c?F(e,["tools","exec","node"],c):N(e,["tools","exec","node"])},onBindAgent:(c,u)=>{const b=["agents","list",c,"tools","exec","node"];u?F(e,b,u):N(e,b)},onSaveBindings:()=>he(e),onExecApprovalsTargetChange:(c,u)=>{e.execApprovalsTarget=c,e.execApprovalsTargetNodeId=u,e.execApprovalsSnapshot=null,e.execApprovalsForm=null,e.execApprovalsDirty=!1,e.execApprovalsSelectedAgent=null},onExecApprovalsSelectAgent:c=>{e.execApprovalsSelectedAgent=c},onExecApprovalsPatch:(c,u)=>fs(e,c,u),onExecApprovalsRemove:c=>ps(e,c),onSaveExecApprovals:()=>{const c=e.execApprovalsTarget==="node"&&e.execApprovalsTargetNodeId?{kind:"node",nodeId:e.execApprovalsTargetNodeId}:{kind:"gateway"};return vs(e,c)}}):v}

        ${e.tab==="chat"?si({sessionKey:e.sessionKey,onSessionKeyChange:c=>{e.sessionKey=c,e.chatMessage="",e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c}),e.loadAssistantIdentity(),U(e),Z(e)},thinkingLevel:e.chatThinkingLevel,showThinking:r,loading:e.chatLoading,sending:e.chatSending,compactionStatus:e.compactionStatus,assistantAvatarUrl:f,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:s,error:e.lastError,sessions:e.sessionsResult,focusMode:o,onRefresh:()=>(e.resetToolStream(),Promise.all([U(e),Z(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:c=>e.handleChatScroll(c),onDraftChange:c=>e.chatMessage=c,attachments:e.chatAttachments,onAttachmentsChange:c=>e.chatAttachments=c,onSend:()=>e.handleSendChat(),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onQueueRemove:c=>e.removeQueuedMessage(c),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>e.scrollToBottom(),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,splitRatio:e.splitRatio,onOpenSidebar:c=>e.handleOpenSidebar(c),onCloseSidebar:()=>e.handleCloseSidebar(),onSplitRatioChange:c=>e.handleSplitRatioChange(c),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar}):v}

        ${e.tab==="taxchat"?hr({sessionKey:e.sessionKey,onSessionKeyChange:c=>{e.sessionKey=c,e.chatMessage="",e.chatAttachments=[],e.chatStream=null,e.chatStreamStartedAt=null,e.chatRunId=null,e.chatQueue=[],e.resetToolStream(),e.resetChatScroll(),e.applySettings({...e.settings,sessionKey:c,lastActiveSessionKey:c}),e.loadAssistantIdentity(),U(e),Z(e)},thinkingLevel:e.chatThinkingLevel,showThinking:r,loading:e.chatLoading,sending:e.chatSending,compactionStatus:e.compactionStatus,assistantAvatarUrl:f,messages:e.chatMessages,toolMessages:e.chatToolMessages,stream:e.chatStream,streamStartedAt:e.chatStreamStartedAt,draft:e.chatMessage,queue:e.chatQueue,connected:e.connected,canSend:e.connected,disabledReason:s,error:e.lastError,sessions:e.sessionsResult,focusMode:o,onRefresh:()=>(e.resetToolStream(),Promise.all([U(e),Z(e)])),onToggleFocusMode:()=>{e.onboarding||e.applySettings({...e.settings,chatFocusMode:!e.settings.chatFocusMode})},onChatScroll:c=>e.handleChatScroll(c),onDraftChange:c=>e.chatMessage=c,attachments:e.chatAttachments,onAttachmentsChange:c=>e.chatAttachments=c,onSend:()=>e.handleSendChat(),canAbort:!!e.chatRunId,onAbort:()=>{e.handleAbortChat()},onQueueRemove:c=>e.removeQueuedMessage(c),onNewSession:()=>e.handleSendChat("/new",{restoreDraft:!0}),showNewMessages:e.chatNewMessagesBelow,onScrollToBottom:()=>e.scrollToBottom(),sidebarOpen:e.sidebarOpen,sidebarContent:e.sidebarContent,sidebarError:e.sidebarError,splitRatio:e.splitRatio,onOpenSidebar:c=>e.handleOpenSidebar(c),onCloseSidebar:()=>e.handleCloseSidebar(),onSplitRatioChange:c=>e.handleSplitRatioChange(c),assistantName:e.assistantName,assistantAvatar:e.assistantAvatar}):v}

        ${e.tab==="config"?$r({raw:e.configRaw,originalRaw:e.configRawOriginal,valid:e.configValid,issues:e.configIssues,loading:e.configLoading,saving:e.configSaving,applying:e.configApplying,updating:e.updateRunning,connected:e.connected,schema:e.configSchema,schemaLoading:e.configSchemaLoading,uiHints:e.configUiHints,formMode:e.configFormMode,formValue:e.configForm,originalValue:e.configFormOriginal,searchQuery:e.configSearchQuery,activeSection:e.configActiveSection,activeSubsection:e.configActiveSubsection,onRawChange:c=>{e.configRaw=c},onFormModeChange:c=>e.configFormMode=c,onFormPatch:(c,u)=>F(e,c,u),onSearchChange:c=>e.configSearchQuery=c,onSectionChange:c=>{e.configActiveSection=c,e.configActiveSubsection=null},onSubsectionChange:c=>e.configActiveSubsection=c,onReload:()=>R(e),onSave:()=>he(e),onApply:()=>Ai(e),onUpdate:()=>Ci(e)}):v}

        ${e.tab==="debug"?Lr({loading:e.debugLoading,status:e.debugStatus,health:e.debugHealth,models:e.debugModels,heartbeat:e.debugHeartbeat,eventLog:e.eventLog,callMethod:e.debugCallMethod,callParams:e.debugCallParams,callResult:e.debugCallResult,callError:e.debugCallError,onCallMethodChange:c=>e.debugCallMethod=c,onCallParamsChange:c=>e.debugCallParams=c,onRefresh:()=>Se(e),onCall:()=>qi(e)}):v}

        ${e.tab==="logs"?Pr({loading:e.logsLoading,error:e.logsError,file:e.logsFile,entries:e.logsEntries,filterText:e.logsFilterText,levelFilters:e.logsLevelFilters,autoFollow:e.logsAutoFollow,truncated:e.logsTruncated,onFilterTextChange:c=>e.logsFilterText=c,onLevelToggle:(c,u)=>{e.logsLevelFilters={...e.logsLevelFilters,[c]:u}},onToggleAutoFollow:c=>e.logsAutoFollow=c,onRefresh:()=>ln(e,{reset:!0}),onExport:(c,u)=>e.exportLogs(c,u),onScroll:c=>e.handleLogsScroll(c)}):v}
      </main>
      ${Ir(e)}
      ${Mr(e)}
    </div>
  `}var Ac=Object.defineProperty,Cc=Object.getOwnPropertyDescriptor,h=(e,n,t,i)=>{for(var s=i>1?void 0:i?Cc(n,t):n,a=e.length-1,o;a>=0;a--)(o=e[a])&&(s=(i?o(n,t,s):o(s))||s);return i&&s&&Ac(n,t,s),s};const Ve=wa();function Lc(){if(!window.location.search)return!1;const n=new URLSearchParams(window.location.search).get("onboarding");if(!n)return!1;const t=n.trim().toLowerCase();return t==="1"||t==="true"||t==="yes"||t==="on"}let p=class extends rt{constructor(){super(...arguments),this.settings=Cs(),this.password="",this.tab="chat",this.onboarding=Lc(),this.connected=!1,this.theme=this.settings.theme??"system",this.themeResolved="dark",this.hello=null,this.lastError=null,this.eventLog=[],this.eventLogBuffer=[],this.toolStreamSyncTimer=null,this.sidebarCloseTimer=null,this.assistantName=Ve.name,this.assistantAvatar=Ve.avatar,this.assistantAgentId=Ve.agentId??null,this.sessionKey=this.settings.sessionKey,this.chatLoading=!1,this.chatSending=!1,this.chatMessage="",this.chatMessages=[],this.chatToolMessages=[],this.chatStream=null,this.chatStreamStartedAt=null,this.chatRunId=null,this.compactionStatus=null,this.chatAvatarUrl=null,this.chatThinkingLevel=null,this.chatQueue=[],this.chatAttachments=[],this.sidebarOpen=!1,this.sidebarContent=null,this.sidebarError=null,this.splitRatio=this.settings.splitRatio,this.nodesLoading=!1,this.nodes=[],this.devicesLoading=!1,this.devicesError=null,this.devicesList=null,this.execApprovalsLoading=!1,this.execApprovalsSaving=!1,this.execApprovalsDirty=!1,this.execApprovalsSnapshot=null,this.execApprovalsForm=null,this.execApprovalsSelectedAgent=null,this.execApprovalsTarget="gateway",this.execApprovalsTargetNodeId=null,this.execApprovalQueue=[],this.execApprovalBusy=!1,this.execApprovalError=null,this.pendingGatewayUrl=null,this.configLoading=!1,this.configRaw=`{
}
`,this.configRawOriginal="",this.configValid=null,this.configIssues=[],this.configSaving=!1,this.configApplying=!1,this.updateRunning=!1,this.applySessionKey=this.settings.lastActiveSessionKey,this.configSnapshot=null,this.configSchema=null,this.configSchemaVersion=null,this.configSchemaLoading=!1,this.configUiHints={},this.configForm=null,this.configFormOriginal=null,this.configFormDirty=!1,this.configFormMode="form",this.configSearchQuery="",this.configActiveSection=null,this.configActiveSubsection=null,this.channelsLoading=!1,this.channelsSnapshot=null,this.channelsError=null,this.channelsLastSuccess=null,this.whatsappLoginMessage=null,this.whatsappLoginQrDataUrl=null,this.whatsappLoginConnected=null,this.whatsappBusy=!1,this.nostrProfileFormState=null,this.nostrProfileAccountId=null,this.presenceLoading=!1,this.presenceEntries=[],this.presenceError=null,this.presenceStatus=null,this.agentsLoading=!1,this.agentsList=null,this.agentsError=null,this.agentsSelectedId=null,this.agentsPanel="overview",this.agentFilesLoading=!1,this.agentFilesError=null,this.agentFilesList=null,this.agentFileContents={},this.agentFileDrafts={},this.agentFileActive=null,this.agentFileSaving=!1,this.agentIdentityLoading=!1,this.agentIdentityError=null,this.agentIdentityById={},this.agentSkillsLoading=!1,this.agentSkillsError=null,this.agentSkillsReport=null,this.agentSkillsAgentId=null,this.sessionsLoading=!1,this.sessionsResult=null,this.sessionsError=null,this.sessionsFilterActive="",this.sessionsFilterLimit="120",this.sessionsIncludeGlobal=!0,this.sessionsIncludeUnknown=!1,this.cronLoading=!1,this.cronJobs=[],this.cronStatus=null,this.cronError=null,this.cronForm={...ma},this.cronRunsJobId=null,this.cronRuns=[],this.cronBusy=!1,this.skillsLoading=!1,this.skillsReport=null,this.skillsError=null,this.skillsFilter="",this.skillEdits={},this.skillsBusyKey=null,this.skillMessages={},this.debugLoading=!1,this.debugStatus=null,this.debugHealth=null,this.debugModels=[],this.debugHeartbeat=null,this.debugCallMethod="",this.debugCallParams="{}",this.debugCallResult=null,this.debugCallError=null,this.logsLoading=!1,this.logsError=null,this.logsFile=null,this.logsEntries=[],this.logsFilterText="",this.logsLevelFilters={...ha},this.logsAutoFollow=!0,this.logsTruncated=!1,this.logsCursor=null,this.logsLastFetchAt=null,this.logsLimit=500,this.logsMaxBytes=25e4,this.logsAtBottom=!0,this.client=null,this.chatScrollFrame=null,this.chatScrollTimeout=null,this.chatHasAutoScrolled=!1,this.chatUserNearBottom=!0,this.chatNewMessagesBelow=!1,this.nodesPollInterval=null,this.logsPollInterval=null,this.debugPollInterval=null,this.logsScrollFrame=null,this.toolStreamById=new Map,this.toolStreamOrder=[],this.refreshSessionsAfterChat=new Set,this.basePath="",this.popStateHandler=()=>Ks(this),this.themeMedia=null,this.themeMediaHandler=null,this.topbarObserver=null}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),Ia(this)}firstUpdated(){Ma(this)}disconnectedCallback(){Ea(this),super.disconnectedCallback()}updated(e){Fa(this,e)}connect(){Nt(this)}handleChatScroll(e){ji(this,e)}handleLogsScroll(e){Hi(this,e)}exportLogs(e,n){zi(e,n)}resetToolStream(){_e(this)}resetChatScroll(){kn(this)}scrollToBottom(){kn(this),re(this,!0)}async loadAssistantIdentity(){await Pt(this)}applySettings(e){H(this,e)}setTab(e){Fs(this,e)}setTheme(e,n){Ts(this,e,n)}async loadOverview(){await Lt(this)}async loadCron(){await be(this)}async handleAbortChat(){await Et(this)}removeQueuedMessage(e){ua(this,e)}async handleSendChat(e,n){await ga(this,e,n)}async handleWhatsAppStart(e){await Mi(this,e)}async handleWhatsAppWait(){await Ei(this)}async handleWhatsAppLogout(){await Fi(this)}async handleChannelConfigSave(){await Ti(this)}async handleChannelConfigReload(){await Ri(this)}handleNostrProfileEdit(e,n){Bi(this,e,n)}handleNostrProfileCancel(){Ni(this)}handleNostrProfileFieldChange(e,n){Di(this,e,n)}async handleNostrProfileSave(){await Oi(this)}async handleNostrProfileImport(){await Ui(this)}handleNostrProfileToggleAdvanced(){Ki(this)}async handleExecApprovalDecision(e){const n=this.execApprovalQueue[0];if(!(!n||!this.client||this.execApprovalBusy)){this.execApprovalBusy=!0,this.execApprovalError=null;try{await this.client.request("exec.approval.resolve",{id:n.id,decision:e}),this.execApprovalQueue=this.execApprovalQueue.filter(t=>t.id!==n.id)}catch(t){this.execApprovalError=`Exec approval failed: ${String(t)}`}finally{this.execApprovalBusy=!1}}}handleGatewayUrlConfirm(){const e=this.pendingGatewayUrl;e&&(this.pendingGatewayUrl=null,H(this,{...this.settings,gatewayUrl:e}),this.connect())}handleGatewayUrlCancel(){this.pendingGatewayUrl=null}handleOpenSidebar(e){this.sidebarCloseTimer!=null&&(window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=null),this.sidebarContent=e,this.sidebarError=null,this.sidebarOpen=!0}handleCloseSidebar(){this.sidebarOpen=!1,this.sidebarCloseTimer!=null&&window.clearTimeout(this.sidebarCloseTimer),this.sidebarCloseTimer=window.setTimeout(()=>{this.sidebarOpen||(this.sidebarContent=null,this.sidebarError=null,this.sidebarCloseTimer=null)},200)}handleSplitRatioChange(e){const n=Math.max(.4,Math.min(.7,e));this.splitRatio=n,this.applySettings({...this.settings,splitRatio:n})}render(){return kc(this)}};h([m()],p.prototype,"settings",2);h([m()],p.prototype,"password",2);h([m()],p.prototype,"tab",2);h([m()],p.prototype,"onboarding",2);h([m()],p.prototype,"connected",2);h([m()],p.prototype,"theme",2);h([m()],p.prototype,"themeResolved",2);h([m()],p.prototype,"hello",2);h([m()],p.prototype,"lastError",2);h([m()],p.prototype,"eventLog",2);h([m()],p.prototype,"assistantName",2);h([m()],p.prototype,"assistantAvatar",2);h([m()],p.prototype,"assistantAgentId",2);h([m()],p.prototype,"sessionKey",2);h([m()],p.prototype,"chatLoading",2);h([m()],p.prototype,"chatSending",2);h([m()],p.prototype,"chatMessage",2);h([m()],p.prototype,"chatMessages",2);h([m()],p.prototype,"chatToolMessages",2);h([m()],p.prototype,"chatStream",2);h([m()],p.prototype,"chatStreamStartedAt",2);h([m()],p.prototype,"chatRunId",2);h([m()],p.prototype,"compactionStatus",2);h([m()],p.prototype,"chatAvatarUrl",2);h([m()],p.prototype,"chatThinkingLevel",2);h([m()],p.prototype,"chatQueue",2);h([m()],p.prototype,"chatAttachments",2);h([m()],p.prototype,"sidebarOpen",2);h([m()],p.prototype,"sidebarContent",2);h([m()],p.prototype,"sidebarError",2);h([m()],p.prototype,"splitRatio",2);h([m()],p.prototype,"nodesLoading",2);h([m()],p.prototype,"nodes",2);h([m()],p.prototype,"devicesLoading",2);h([m()],p.prototype,"devicesError",2);h([m()],p.prototype,"devicesList",2);h([m()],p.prototype,"execApprovalsLoading",2);h([m()],p.prototype,"execApprovalsSaving",2);h([m()],p.prototype,"execApprovalsDirty",2);h([m()],p.prototype,"execApprovalsSnapshot",2);h([m()],p.prototype,"execApprovalsForm",2);h([m()],p.prototype,"execApprovalsSelectedAgent",2);h([m()],p.prototype,"execApprovalsTarget",2);h([m()],p.prototype,"execApprovalsTargetNodeId",2);h([m()],p.prototype,"execApprovalQueue",2);h([m()],p.prototype,"execApprovalBusy",2);h([m()],p.prototype,"execApprovalError",2);h([m()],p.prototype,"pendingGatewayUrl",2);h([m()],p.prototype,"configLoading",2);h([m()],p.prototype,"configRaw",2);h([m()],p.prototype,"configRawOriginal",2);h([m()],p.prototype,"configValid",2);h([m()],p.prototype,"configIssues",2);h([m()],p.prototype,"configSaving",2);h([m()],p.prototype,"configApplying",2);h([m()],p.prototype,"updateRunning",2);h([m()],p.prototype,"applySessionKey",2);h([m()],p.prototype,"configSnapshot",2);h([m()],p.prototype,"configSchema",2);h([m()],p.prototype,"configSchemaVersion",2);h([m()],p.prototype,"configSchemaLoading",2);h([m()],p.prototype,"configUiHints",2);h([m()],p.prototype,"configForm",2);h([m()],p.prototype,"configFormOriginal",2);h([m()],p.prototype,"configFormDirty",2);h([m()],p.prototype,"configFormMode",2);h([m()],p.prototype,"configSearchQuery",2);h([m()],p.prototype,"configActiveSection",2);h([m()],p.prototype,"configActiveSubsection",2);h([m()],p.prototype,"channelsLoading",2);h([m()],p.prototype,"channelsSnapshot",2);h([m()],p.prototype,"channelsError",2);h([m()],p.prototype,"channelsLastSuccess",2);h([m()],p.prototype,"whatsappLoginMessage",2);h([m()],p.prototype,"whatsappLoginQrDataUrl",2);h([m()],p.prototype,"whatsappLoginConnected",2);h([m()],p.prototype,"whatsappBusy",2);h([m()],p.prototype,"nostrProfileFormState",2);h([m()],p.prototype,"nostrProfileAccountId",2);h([m()],p.prototype,"presenceLoading",2);h([m()],p.prototype,"presenceEntries",2);h([m()],p.prototype,"presenceError",2);h([m()],p.prototype,"presenceStatus",2);h([m()],p.prototype,"agentsLoading",2);h([m()],p.prototype,"agentsList",2);h([m()],p.prototype,"agentsError",2);h([m()],p.prototype,"agentsSelectedId",2);h([m()],p.prototype,"agentsPanel",2);h([m()],p.prototype,"agentFilesLoading",2);h([m()],p.prototype,"agentFilesError",2);h([m()],p.prototype,"agentFilesList",2);h([m()],p.prototype,"agentFileContents",2);h([m()],p.prototype,"agentFileDrafts",2);h([m()],p.prototype,"agentFileActive",2);h([m()],p.prototype,"agentFileSaving",2);h([m()],p.prototype,"agentIdentityLoading",2);h([m()],p.prototype,"agentIdentityError",2);h([m()],p.prototype,"agentIdentityById",2);h([m()],p.prototype,"agentSkillsLoading",2);h([m()],p.prototype,"agentSkillsError",2);h([m()],p.prototype,"agentSkillsReport",2);h([m()],p.prototype,"agentSkillsAgentId",2);h([m()],p.prototype,"sessionsLoading",2);h([m()],p.prototype,"sessionsResult",2);h([m()],p.prototype,"sessionsError",2);h([m()],p.prototype,"sessionsFilterActive",2);h([m()],p.prototype,"sessionsFilterLimit",2);h([m()],p.prototype,"sessionsIncludeGlobal",2);h([m()],p.prototype,"sessionsIncludeUnknown",2);h([m()],p.prototype,"cronLoading",2);h([m()],p.prototype,"cronJobs",2);h([m()],p.prototype,"cronStatus",2);h([m()],p.prototype,"cronError",2);h([m()],p.prototype,"cronForm",2);h([m()],p.prototype,"cronRunsJobId",2);h([m()],p.prototype,"cronRuns",2);h([m()],p.prototype,"cronBusy",2);h([m()],p.prototype,"skillsLoading",2);h([m()],p.prototype,"skillsReport",2);h([m()],p.prototype,"skillsError",2);h([m()],p.prototype,"skillsFilter",2);h([m()],p.prototype,"skillEdits",2);h([m()],p.prototype,"skillsBusyKey",2);h([m()],p.prototype,"skillMessages",2);h([m()],p.prototype,"debugLoading",2);h([m()],p.prototype,"debugStatus",2);h([m()],p.prototype,"debugHealth",2);h([m()],p.prototype,"debugModels",2);h([m()],p.prototype,"debugHeartbeat",2);h([m()],p.prototype,"debugCallMethod",2);h([m()],p.prototype,"debugCallParams",2);h([m()],p.prototype,"debugCallResult",2);h([m()],p.prototype,"debugCallError",2);h([m()],p.prototype,"logsLoading",2);h([m()],p.prototype,"logsError",2);h([m()],p.prototype,"logsFile",2);h([m()],p.prototype,"logsEntries",2);h([m()],p.prototype,"logsFilterText",2);h([m()],p.prototype,"logsLevelFilters",2);h([m()],p.prototype,"logsAutoFollow",2);h([m()],p.prototype,"logsTruncated",2);h([m()],p.prototype,"logsCursor",2);h([m()],p.prototype,"logsLastFetchAt",2);h([m()],p.prototype,"logsLimit",2);h([m()],p.prototype,"logsMaxBytes",2);h([m()],p.prototype,"logsAtBottom",2);h([m()],p.prototype,"chatNewMessagesBelow",2);p=h([ct("openclaw-app")],p);
//# sourceMappingURL=main.js.map
