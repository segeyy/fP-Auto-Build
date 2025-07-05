// Vencord 81b3c0f
// Standalone: false
// Platform: linux
// Updater Disabled: false
"use strict";var Pr=Object.create;var Oe=Object.defineProperty;var Or=Object.getOwnPropertyDescriptor;var kr=Object.getOwnPropertyNames;var _r=Object.getPrototypeOf,Mr=Object.prototype.hasOwnProperty;var d=(t,e)=>()=>(t&&(e=t(t=0)),e);var le=(t,e)=>{for(var n in e)Oe(t,n,{get:e[n],enumerable:!0})},Ot=(t,e,n,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of kr(e))!Mr.call(t,i)&&i!==n&&Oe(t,i,{get:()=>e[i],enumerable:!(r=Or(e,i))||r.enumerable});return t};var kt=(t,e,n)=>(n=t!=null?Pr(_r(t)):{},Ot(e||!t||!t.__esModule?Oe(n,"default",{value:t,enumerable:!0}):n,t)),_t=t=>Ot(Oe({},"__esModule",{value:!0}),t);var c=d(()=>{"use strict"});var ue=d(()=>{"use strict";c()});var Ze,Mt,Se,Lt=d(()=>{"use strict";c();Ze=Symbol("SettingsStore.isProxy"),Mt=Symbol("SettingsStore.getRawTarget"),Se=class{pathListeners=new Map;globalListeners=new Set;proxyContexts=new WeakMap;proxyHandler=(()=>{let e=this;return{get(n,r,i){if(r===Ze)return!0;if(r===Mt)return n;let o=Reflect.get(n,r,i),s=e.proxyContexts.get(n);if(s==null)return o;let{root:a,path:l}=s;if(!(r in n)&&e.getDefaultValue!=null&&(o=e.getDefaultValue({target:n,key:r,root:a,path:l})),typeof o=="object"&&o!==null&&!o[Ze]){let m=`${l}${l&&"."}${r}`;return e.makeProxy(o,a,m)}return o},set(n,r,i){if(i?.[Ze]&&(i=i[Mt]),n[r]===i)return!0;if(!Reflect.set(n,r,i))return!1;let o=e.proxyContexts.get(n);if(o==null)return!0;let{root:s,path:a}=o,l=`${a}${a&&"."}${r}`;return e.notifyListeners(l,i,s),!0},deleteProperty(n,r){if(!Reflect.deleteProperty(n,r))return!1;let i=e.proxyContexts.get(n);if(i==null)return!0;let{root:o,path:s}=i,a=`${s}${s&&"."}${r}`;return e.notifyListeners(a,void 0,o),!0}}})();constructor(e,n={}){this.plain=e,this.store=this.makeProxy(e),Object.assign(this,n)}makeProxy(e,n=e,r=""){return this.proxyContexts.set(e,{root:n,path:r}),new Proxy(e,this.proxyHandler)}notifyListeners(e,n,r){let i=e.split(".");if(i.length>3&&i[0]==="plugins"){let o=i.slice(0,3),s=o.join("."),a=o.reduce((l,m)=>l[m],r);this.globalListeners.forEach(l=>l(r,s)),this.pathListeners.get(s)?.forEach(l=>l(a))}else this.globalListeners.forEach(o=>o(r,e));this.pathListeners.get(e)?.forEach(o=>o(n))}setData(e,n){if(this.readOnly)throw new Error("SettingsStore is read-only");if(this.plain=e,this.store=this.makeProxy(e),n){let r=e,i=n.split(".");for(let o of i){if(!r){console.warn(`Settings#setData: Path ${n} does not exist in new data. Not dispatching update`);return}r=r[o]}this.pathListeners.get(n)?.forEach(o=>o(r))}this.markAsChanged()}addGlobalChangeListener(e){this.globalListeners.add(e)}addChangeListener(e,n){let r=this.pathListeners.get(e)??new Set;r.add(n),this.pathListeners.set(e,r)}removeGlobalChangeListener(e){this.globalListeners.delete(e)}removeChangeListener(e,n){let r=this.pathListeners.get(e);r&&(r.delete(n),r.size||this.pathListeners.delete(e))}markAsChanged(){this.globalListeners.forEach(e=>e(this.plain,""))}}});function We(t,e){for(let n in e){let r=e[n];typeof r=="object"&&!Array.isArray(r)?(t[n]??={},We(t[n],r)):t[n]??=r}return t}var Nt=d(()=>{"use strict";c()});var Ut,$,ke,X,Y,fe,Ke,He,Vt,_e,he=d(()=>{"use strict";c();Ut=require("electron"),$=require("path"),ke=process.env.VENCORD_USER_DATA_DIR??(process.env.DISCORD_USER_DATA_DIR?(0,$.join)(process.env.DISCORD_USER_DATA_DIR,"..","VencordData"):(0,$.join)(Ut.app.getPath("userData"),"..","Vencord")),X=(0,$.join)(ke,"settings"),Y=(0,$.join)(ke,"themes"),fe=(0,$.join)(X,"quickCss.css"),Ke=(0,$.join)(X,"settings.json"),He=(0,$.join)(X,"native-settings.json"),Vt=["https:","http:","steam:","spotify:","com.epicgames.launcher:","tidal:","itunes:"],_e=process.argv.includes("--vanilla")});function zt(t,e){try{return JSON.parse((0,Q.readFileSync)(e,"utf-8"))}catch(n){return n?.code!=="ENOENT"&&console.error(`Failed to read ${t} settings`,n),{}}}var $e,Q,D,Lr,Gt,V,F=d(()=>{"use strict";c();ue();Lt();Nt();$e=require("electron"),Q=require("fs");he();(0,Q.mkdirSync)(X,{recursive:!0});D=new Se(zt("renderer",Ke));D.addGlobalChangeListener(()=>{try{(0,Q.writeFileSync)(Ke,JSON.stringify(D.plain,null,4))}catch(t){console.error("Failed to write renderer settings",t)}});$e.ipcMain.on("VencordGetSettings",t=>t.returnValue=D.plain);$e.ipcMain.handle("VencordSetSettings",(t,e,n)=>{D.setData(e,n)});Lr={plugins:{},customCspRules:{}},Gt=zt("native",He);We(Gt,Lr);V=new Se(Gt);V.addGlobalChangeListener(()=>{try{(0,Q.writeFileSync)(He,JSON.stringify(V.plain,null,4))}catch(t){console.error("Failed to write native settings",t)}})});function Ft(){Ye.session.defaultSession.webRequest.onHeadersReceived(({responseHeaders:t,resourceType:e},n)=>{if(t&&(e==="mainFrame"&&Vr(t),e==="stylesheet")){let r=qe(t,"content-type");r&&(t[r]=["text/css"])}n({cancel:!1,responseHeaders:t})}),Ye.session.defaultSession.webRequest.onHeadersReceived=()=>{}}var Ye,pe,k,jt,w,Bt,Je,qe,Nr,Ur,Vr,Xe=d(()=>{"use strict";c();F();Ye=require("electron"),pe=["connect-src"],k=[...pe,"img-src"],jt=["style-src","font-src"],w=[...k,...jt],Bt=[...w,"script-src","worker-src"],Je={"http://localhost:*":w,"http://127.0.0.1:*":w,"localhost:*":w,"127.0.0.1:*":w,"*.github.io":w,"github.com":w,"raw.githubusercontent.com":w,"*.gitlab.io":w,"gitlab.com":w,"*.codeberg.page":w,"codeberg.org":w,"*.githack.com":w,"jsdelivr.net":w,"fonts.googleapis.com":jt,"i.imgur.com":k,"i.ibb.co":k,"i.pinimg.com":k,"*.tenor.com":k,"files.catbox.moe":w,"cdn.discordapp.com":w,"media.discordapp.net":k,"cdnjs.cloudflare.com":Bt,"cdn.jsdelivr.net":Bt,"api.github.com":pe,"ws.audioscrobbler.com":pe,"translate-pa.googleapis.com":pe,"*.vencord.dev":k,"manti.vendicated.dev":k,"decor.fieryflames.dev":pe,"ugc.decor.fieryflames.dev":k,"sponsor.ajay.app":pe,"dearrow-thumb.ajay.app":k,"usrbg.is-hardly.online":k,"icons.duckduckgo.com":k},qe=(t,e)=>Object.keys(t).find(n=>n.toLowerCase()===e),Nr=t=>{let e={};return t.split(";").forEach(n=>{let[r,...i]=n.trim().split(/\s+/g);r&&!Object.prototype.hasOwnProperty.call(e,r)&&(e[r]=i)}),e},Ur=t=>Object.entries(t).filter(([,e])=>e?.length).map(e=>e.flat().join(" ")).join("; "),Vr=t=>{let e=qe(t,"content-security-policy-report-only");e&&delete t[e];let n=qe(t,"content-security-policy");if(n){let r=Nr(t[n][0]),i=(o,...s)=>{r[o]??=[...r["default-src"]??[]],r[o].push(...s)};i("style-src","'unsafe-inline'"),i("script-src","'unsafe-inline'","'unsafe-eval'");for(let o of["style-src","connect-src","img-src","font-src","media-src","worker-src"])i(o,"blob:","data:","vencord:");for(let[o,s]of Object.entries(V.store.customCspRules))for(let a of s)i(a,o);for(let[o,s]of Object.entries(Je))for(let a of s)i(a,o);t[n]=[Ur(r)]}}});function be(t){return async function(){try{return{ok:!0,value:await t(...arguments)}}catch(e){return{ok:!1,error:e instanceof Error?{...e,message:e.message,name:e.name,stack:e.stack}:e}}}}var Zt=d(()=>{"use strict";c()});var Fr={};function ge(...t){let e={cwd:$t};return et?Qe("flatpak-spawn",["--host","git",...t],e):Qe("git",t,e)}async function zr(){return(await ge("remote","get-url","origin")).stdout.trim().replace(/git@(.+):/,"https://$1/").replace(/\.git$/,"")}async function Gr(){await ge("fetch");let t=(await ge("branch","--show-current")).stdout.trim();if(!((await ge("ls-remote","origin",t)).stdout.length>0))return[];let r=(await ge("log",`HEAD...origin/${t}`,"--pretty=format:%an/%h/%s")).stdout.trim();return r?r.split(`
`).map(i=>{let[o,s,...a]=i.split("/");return{hash:s,author:o,message:a.join("/").split(`
`)[0]}}):[]}async function Br(){return(await ge("pull")).stdout.includes("Fast-forward")}async function jr(){return!(await Qe(et?"flatpak-spawn":"node",et?["--host","node","scripts/build/build.mjs"]:["scripts/build/build.mjs"],{cwd:$t})).stderr.includes("Build failed")}var Wt,Te,Kt,Ht,$t,Qe,et,Yt=d(()=>{"use strict";c();ue();Wt=require("child_process"),Te=require("electron"),Kt=require("path"),Ht=require("util");Zt();$t=(0,Kt.join)(__dirname,".."),Qe=(0,Ht.promisify)(Wt.execFile),et=!!process.env.FLATPAK_ID;Te.ipcMain.handle("VencordGetRepo",be(zr));Te.ipcMain.handle("VencordGetUpdates",be(Gr));Te.ipcMain.handle("VencordUpdate",be(Br));Te.ipcMain.handle("VencordBuild",be(jr))});var qt=d(()=>{"use strict";c();Yt()});function Qt(t,e,n,r){return BigInt(t)|BigInt(e)<<16n|BigInt(n)<<32n|BigInt(r)<<48n}function Z(t,e){return BigInt(t[e])|BigInt(t[e+1])<<8n|BigInt(t[e+2])<<16n|BigInt(t[e+3])<<24n|BigInt(t[e+4])<<32n|BigInt(t[e+5])<<40n|BigInt(t[e+6])<<48n|BigInt(t[e+7])<<56n}function C(t,e){return t<<e&Zr|t>>en-e}function f(t){return BigInt.asUintN(64,t)}function tn(t,e=0){return new tt(e).update(t).digest()}var I,b,Jt,xe,Xt,en,Zr,Wr,tt,nn=d(()=>{c();I=11400714785074694791n,b=14029467366897019727n,Jt=1609587929392839161n,xe=9650029242287828579n,Xt=2870177450012600261n,en=64n,Zr=2n**en-1n,Wr=new TextEncoder;tt=class{#t;#n;#r;#i;#o;#s;#a;#e;constructor(e=0){this.reset(e)}reset(e=this.#t){return this.#t=BigInt.asUintN(32,BigInt(e)),this.#n=f(this.#t+I+b),this.#r=f(this.#t+b),this.#i=this.#t,this.#o=f(this.#t-I),this.#s=null,this.#a=0,this.#e=0,this}update(e){typeof e=="string"&&(e=Wr.encode(e));let n=0,r=e.length,i=n+r;if(r===0)return this;if(this.#a+=r,this.#e===0&&(this.#s=new Uint8Array(32)),this.#e+r<32)return this.#s.set(e.subarray(0,r),this.#e),this.#e+=r,this;if(this.#e>0){this.#s.set(e.subarray(0,32-this.#e),this.#e);let o=0,s;s=Z(this.#s,o),this.#n=f(C(f(this.#n+s*b),31n)*I),o+=8,s=Z(this.memory,o),this.#r=f(C(f(this.#r+s*b),31n)*I),o+=8,s=Z(this.memory,o),this.#i=f(C(f(this.#i+s*b),31n)*I),o+=8,s=Z(this.memory,o),this.#o=f(C(f(this.#o+s*b),31n)*I),n+=32-this.#e,this.#e=0}if(n<=i-32){let o=i-32;do{let s;s=Z(e,n),this.#n=f(C(f(this.#n+s*b),31n)*I),n+=8,s=Z(e,n),this.#r=f(C(f(this.#r+s*b),31n)*I),n+=8,s=Z(e,n),this.#i=f(C(f(this.#i+s*b),31n)*I),n+=8,s=Z(e,n),this.#o=f(C(f(this.#o+s*b),31n)*I),n+=8}while(n<=o)}return n<i&&(this.#s.set(e.subarray(n,i),this.#e),this.#e=i-n),this}digest(){let e=this.#s,n=this.#e,r=0,i=0n,o=0n,s=0n;for(this.#a>=32?(i=C(this.#n,1n)+C(this.#r,7n)+C(this.#i,12n)+C(this.#o,18n),i=f(i^C(f(this.#n*b),31n)*I),i=f(i*I+xe),i=f(i^C(f(this.#r*b),31n)*I),i=f(i*I+xe),i=f(i^C(f(this.#i*b),31n)*I),i=f(i*I+xe),i=f(i^C(f(this.#o*b),31n)*I),i=f(i*I+xe)):i=f(this.#t+Xt),i+=BigInt(this.#a);r<=n-8;)s=Z(e,r),s=f(C(f(s*b),31n)*I),i=f(C(i^s,27n)*I+xe),r+=8;for(r+4<=n&&(s=Qt(e[r+1]<<8|e[r],e[r+3]<<8|e[r+2],0,0),i=f(C(i^f(s*I),23n)*b+Jt),r+=4);r<n;)s=Qt(e[r++],0,0,0),i=f(C(i^f(s*Xt),11n)*I);return o=f(i>>33n),i=f((i^o)*b),o=f(i>>29n),i=f((i^o)*Jt),o=f(i>>32n),i=f(i^o),i}}});function Hr(t){t=BigInt(t);let e=[],n=Math.ceil(Math.floor(Math.log2(Number(t))+1)/8);for(let i=0;i<n;i++)e.unshift(Number(t>>BigInt(8*i)&BigInt(255)));let r=new Uint8Array(e);return Kr?r:r.reverse()}function rn(t){let e=tn(t,0),n=Hr(e);return[de[n[0]>>2],de[(n[0]&3)<<4|n[1]>>4],de[(n[1]&15)<<2|n[2]>>6],de[n[2]&63],de[n[3]>>2],de[(n[3]&3)<<4|n[3]>>4]].join("")}var de,Kr,on=d(()=>{"use strict";c();nn();de="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),Kr=(()=>{let t=new Uint8Array(4),e=new Uint32Array(t.buffer);return!((e[0]=1)&t[0])})()});function sn(t){let e=typeof t=="string"?t:t.source;if(e=e.replaceAll(/#{intl::([\w$+/]*)(?:::(\w+))?}/g,(i,o,s)=>{let a=s==="raw"?o:rn(o),l=typeof t=="string";return!Number.isNaN(Number(a[0]))||a.includes("+")||a.includes("/")?l?`["${a}"]`:String.raw`(?:\["${a}"\])`.replaceAll("+","\\+"):l?`.${a}`:String.raw`(?:\.${a})`}),typeof t=="string")return e;let n=e.replaceAll("\\i",String.raw`(?:[A-Za-z_$][\w$]*)`),r=new RegExp(n,t.flags);return r.toString=t.toString.bind(t),r}var an=d(()=>{"use strict";c();on()});var it={};le(it,{fetchTrackData:()=>Xr});async function nt(t){let{stdout:e}=await un("osascript",t.map(n=>["-e",n]).flat());return e}async function Jr({id:t,name:e,artist:n,album:r}){if(t===L?.id){if("data"in L)return L.data;if("failures"in L&&L.failures>=5)return null}try{let i=new URL("https://amp-api-edge.music.apple.com/v1/catalog/us/search");i.searchParams.set("platform","web"),i.searchParams.set("l","en-US"),i.searchParams.set("limit","1"),i.searchParams.set("with","serverBubbles"),i.searchParams.set("types","songs"),i.searchParams.set("term",`${e} ${n} ${r}`),i.searchParams.set("include[songs]","artists");let o=await qr(),s=await fetch(i,{headers:{accept:"*/*","accept-language":"en-US,en;q=0.9",authorization:`Bearer ${o}`,"user-agent":"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",origin:"https://music.apple.com"}}).then(a=>a.json()).then(a=>a.results.song.data[0]);return L={id:t,data:{appleMusicLink:s.attributes.url,songLink:`https://song.link/i/${s.id}`,albumArtwork:s.attributes.artwork.url.replace("{w}x{h}","512x512"),artistArtwork:s.relationships.artists.data[0].attributes.artwork.url.replace("{w}x{h}","512x512")}},L.data}catch(i){return console.error("[AppleMusicRichPresence] Failed to fetch remote data:",i),L={id:t,failures:(t===L?.id&&"failures"in L?L.failures:0)+1},null}}async function Xr(){try{await un("pgrep",["^Music$"])}catch{return null}if(await nt(['tell application "Music"',"get player state","end tell"]).then(g=>g.trim())!=="playing")return null;let e=await nt(['tell application "Music"',"get player position","end tell"]).then(g=>Number.parseFloat(g.trim())),n=await nt(['set output to ""','tell application "Music"',"set t_id to database id of current track","set t_name to name of current track","set t_album to album of current track","set t_artist to artist of current track","set t_duration to duration of current track",'set output to "" & t_id & "\\n" & t_name & "\\n" & t_album & "\\n" & t_artist & "\\n" & t_duration',"end tell","return output"]),[r,i,o,s,a]=n.split(`
`).filter(g=>!!g),l=Number.parseFloat(a),m=await Jr({id:r,name:i,artist:s,album:o});return{name:i,album:o,artist:s,playerPosition:e,duration:l,...m}}var cn,ln,un,L,$r,Yr,rt,qr,fn=d(()=>{"use strict";c();an();cn=require("child_process"),ln=require("util"),un=(0,ln.promisify)(cn.execFile);L=null,$r=/<script type="module" crossorigin src="([a-zA-Z0-9.\-/]+)"><\/script>/,Yr=sn(/\b(\i)="([A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*)"(?=.+?Bearer \$\{\1\})/),qr=async()=>{if(rt)return rt;let t=await fetch("https://music.apple.com/").then(i=>i.text()),e=new URL(t.match($r)[1],"https://music.apple.com/"),r=(await fetch(e).then(i=>i.text())).match(Yr)[2];return rt=r,r}});var ot={};le(ot,{initDevtoolsOpenEagerLoad:()=>Qr});function Qr(t){let e=()=>t.sender.executeJavaScript("Vencord.Plugins.plugins.ConsoleShortcuts.eagerLoad(true)");t.sender.isDevToolsOpened()?e():t.sender.once("devtools-opened",()=>e())}var hn=d(()=>{"use strict";c()});var gn={};var pn,dn=d(()=>{"use strict";c();F();pn=require("electron");pn.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://open.spotify.com/embed/")){let i=D.store.plugins?.FixSpotifyEmbeds;if(!i?.enabled)return;r.executeJavaScript(`
                    const original = Audio.prototype.play;
                    Audio.prototype.play = function() {
                        this.volume = ${i.volume/100||.1};
                        return original.apply(this, arguments);
                    }
                `)}})})})});var vn={};var mn,yn=d(()=>{"use strict";c();F();mn=require("electron");mn.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{if(r.url.startsWith("https://www.youtube.com/")){if(!D.store.plugins?.FixYoutubeEmbeds?.enabled)return;r.executeJavaScript(`
                new MutationObserver(() => {
                    if(
                        document.querySelector('div.ytp-error-content-wrap-subreason a[href*="www.youtube.com/watch?v="]')
                    ) location.reload()
                }).observe(document.body, { childList: true, subtree:true });
                `)}})})})});var st={};le(st,{resolveRedirect:()=>ti});function An(t){return new Promise((e,n)=>{let r=(0,In.request)(new URL(t),{method:"HEAD"},i=>{e(i.headers.location?An(i.headers.location):t)});r.on("error",n),r.end()})}async function ti(t,e){return ei.test(e)?An(e):e}var In,ei,Cn=d(()=>{"use strict";c();In=require("https"),ei=/^https:\/\/(spotify\.link|s\.team)\/.+$/});var at={};le(at,{makeDeeplTranslateRequest:()=>ni});async function ni(t,e,n,r){let i=e?"https://api.deepl.com/v2/translate":"https://api-free.deepl.com/v2/translate";try{let o=await fetch(i,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`DeepL-Auth-Key ${n}`},body:r}),s=await o.text();return{status:o.status,data:s}}catch(o){return{status:-1,data:String(o)}}}var wn=d(()=>{"use strict";c()});var ct={};le(ct,{readRecording:()=>ri});async function ri(t,e){e=(0,Ee.normalize)(e);let n=(0,Ee.basename)(e),r=(0,Ee.normalize)(Sn.app.getPath("userData")+"/");if(console.log(n,r,e),n!=="recording.ogg"||!e.startsWith(r))return null;try{let i=await(0,bn.readFile)(e);return new Uint8Array(i.buffer)}catch{return null}}var Sn,bn,Ee,Tn=d(()=>{"use strict";c();Sn=require("electron"),bn=require("fs/promises"),Ee=require("path")});var lt={};le(lt,{sendToOverlay:()=>ii});function ii(t,e){e.messageType=e.type;let n=JSON.stringify(e);xn??=(0,En.createSocket)("udp4"),xn.send(n,42069,"127.0.0.1")}var En,xn,Dn=d(()=>{"use strict";c();En=require("dgram")});var Rn,Pn=d(()=>{c();Rn=`/* eslint-disable */

/**
 * This file is part of AdGuard's Block YouTube Ads (https://github.com/AdguardTeam/BlockYouTubeAdsShortcut).
 *
 * Copyright (C) AdGuard Team
 *
 * AdGuard's Block YouTube Ads is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * AdGuard's Block YouTube Ads is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with AdGuard's Block YouTube Ads.  If not, see <http://www.gnu.org/licenses/>.
 */

const hiddenCSS = [
    "#__ffYoutube1",
    "#__ffYoutube2",
    "#__ffYoutube3",
    "#__ffYoutube4",
    "#feed-pyv-container",
    "#feedmodule-PRO",
    "#homepage-chrome-side-promo",
    "#merch-shelf",
    "#offer-module",
    '#pla-shelf > ytd-pla-shelf-renderer[class="style-scope ytd-watch"]',
    "#pla-shelf",
    "#premium-yva",
    "#promo-info",
    "#promo-list",
    "#promotion-shelf",
    "#related > ytd-watch-next-secondary-results-renderer > #items > ytd-compact-promoted-video-renderer.ytd-watch-next-secondary-results-renderer",
    "#search-pva",
    "#shelf-pyv-container",
    "#video-masthead",
    "#watch-branded-actions",
    "#watch-buy-urls",
    "#watch-channel-brand-div",
    "#watch7-branded-banner",
    "#YtKevlarVisibilityIdentifier",
    "#YtSparklesVisibilityIdentifier",
    ".carousel-offer-url-container",
    ".companion-ad-container",
    ".GoogleActiveViewElement",
    '.list-view[style="margin: 7px 0pt;"]',
    ".promoted-sparkles-text-search-root-container",
    ".promoted-videos",
    ".searchView.list-view",
    ".sparkles-light-cta",
    ".watch-extra-info-column",
    ".watch-extra-info-right",
    ".ytd-carousel-ad-renderer",
    ".ytd-compact-promoted-video-renderer",
    ".ytd-companion-slot-renderer",
    ".ytd-merch-shelf-renderer",
    ".ytd-player-legacy-desktop-watch-ads-renderer",
    ".ytd-promoted-sparkles-text-search-renderer",
    ".ytd-promoted-video-renderer",
    ".ytd-search-pyv-renderer",
    ".ytd-video-masthead-ad-v3-renderer",
    ".ytp-ad-action-interstitial-background-container",
    ".ytp-ad-action-interstitial-slot",
    ".ytp-ad-image-overlay",
    ".ytp-ad-overlay-container",
    ".ytp-ad-progress",
    ".ytp-ad-progress-list",
    '[class*="ytd-display-ad-"]',
    '[layout*="display-ad-"]',
    'a[href^="http://www.youtube.com/cthru?"]',
    'a[href^="https://www.youtube.com/cthru?"]',
    "ytd-action-companion-ad-renderer",
    "ytd-banner-promo-renderer",
    "ytd-compact-promoted-video-renderer",
    "ytd-companion-slot-renderer",
    "ytd-display-ad-renderer",
    "ytd-promoted-sparkles-text-search-renderer",
    "ytd-promoted-sparkles-web-renderer",
    "ytd-search-pyv-renderer",
    "ytd-single-option-survey-renderer",
    "ytd-video-masthead-ad-advertiser-info-renderer",
    "ytd-video-masthead-ad-v3-renderer",
    "YTM-PROMOTED-VIDEO-RENDERER",
];
/**
* Adds CSS to the page
*/
const hideElements = () => {
    const selectors = hiddenCSS;
    if (!selectors) {
        return;
    }
    const rule = selectors.join(", ") + " { display: none!important; }";
    const style = document.createElement("style");
    style.textContent = rule;
    document.head.appendChild(style);
};
/**
* Calls the "callback" function on every DOM change, but not for the tracked events
* @param {Function} callback callback function
*/
const observeDomChanges = callback => {
    const domMutationObserver = new MutationObserver(mutations => {
        callback(mutations);
    });
    domMutationObserver.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
};
/**
* This function is supposed to be called on every DOM change
*/
const hideDynamicAds = () => {
    const elements = document.querySelectorAll("#contents > ytd-rich-item-renderer ytd-display-ad-renderer");
    if (elements.length === 0) {
        return;
    }
    elements.forEach(el => {
        if (el.parentNode && el.parentNode.parentNode) {
            const parent = el.parentNode.parentNode;
            if (parent.localName === "ytd-rich-item-renderer") {
                parent.style.display = "none";
            }
        }
    });
};
/**
* This function checks if the video ads are currently running
* and auto-clicks the skip button.
*/
const autoSkipAds = () => {
    // If there's a video that plays the ad at this moment, scroll this ad
    if (document.querySelector(".ad-showing")) {
        const video = document.querySelector("video");
        if (video && video.duration) {
            video.currentTime = video.duration;
            // Skip button should appear after that,
            // now simply click it automatically
            setTimeout(() => {
                const skipBtn = document.querySelector("button.ytp-ad-skip-button");
                if (skipBtn) {
                    skipBtn.click();
                }
            }, 100);
        }
    }
};
/**
* This function overrides a property on the specified object.
*
* @param {object} obj object to look for properties in
* @param {string} propertyName property to override
* @param {*} overrideValue value to set
*/
const overrideObject = (obj, propertyName, overrideValue) => {
    if (!obj) {
        return false;
    }
    let overriden = false;
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && key === propertyName) {
            obj[key] = overrideValue;
            overriden = true;
        } else if (obj.hasOwnProperty(key) && typeof obj[key] === "object") {
            if (overrideObject(obj[key], propertyName, overrideValue)) {
                overriden = true;
            }
        }
    }
    return overriden;
};
/**
* Overrides JSON.parse and Response.json functions.
* Examines these functions arguments, looks for properties with the specified name there
* and if it exists, changes it's value to what was specified.
*
* @param {string} propertyName name of the property
* @param {*} overrideValue new value for the property
*/
const jsonOverride = (propertyName, overrideValue) => {
    const nativeJSONParse = JSON.parse;
    JSON.parse = (...args) => {
        const obj = nativeJSONParse.apply(this, args);
        // Override it's props and return back to the caller
        overrideObject(obj, propertyName, overrideValue);
        return obj;
    };
    // Override Response.prototype.json
    Response.prototype.json = new Proxy(Response.prototype.json, {
        async apply(...args) {
            // Call the target function, get the original Promise
            const result = await Reflect.apply(...args);
            // Create a new one and override the JSON inside
            overrideObject(result, propertyName, overrideValue);
            return result;
        },
    });
};
// Removes ads metadata from YouTube XHR requests
jsonOverride("adPlacements", []);
jsonOverride("playerAds", []);
// Applies CSS that hides YouTube ad elements
hideElements();
// Some changes should be re-evaluated on every page change
hideDynamicAds();
autoSkipAds();
observeDomChanges(() => {
    hideDynamicAds();
    autoSkipAds();
});`});var kn={};var On,_n=d(()=>{"use strict";c();F();On=require("electron");Pn();On.app.on("browser-window-created",(t,e)=>{e.webContents.on("frame-created",(n,{frame:r})=>{r?.once("dom-ready",()=>{D.store.plugins?.YoutubeAdblock?.enabled&&(r.url.includes("youtube.com/embed/")||r.url.includes("discordsays")&&r.url.includes("youtube.com"))&&r.executeJavaScript(Rn)})})})});var Mn,Ln=d(()=>{c();fn();hn();dn();yn();Cn();wn();Tn();Dn();_n();Mn={AppleMusicRichPresence:it,ConsoleShortcuts:ot,FixSpotifyEmbeds:gn,FixYoutubeEmbeds:vn,OpenInApp:st,Translate:at,VoiceMessages:ct,XSOverlay:lt,YoutubeAdblock:kn}});var ut,Nn,Un=d(()=>{"use strict";c();ue();ut=require("electron");Ln();Nn={};for(let[t,e]of Object.entries(Mn)){let n=Object.entries(e);if(!n.length)continue;let r=Nn[t]={};for(let[i,o]of n){let s=`VencordPluginNative_${t}_${i}`;ut.ipcMain.handle(s,o),r[i]=s}}ut.ipcMain.on("VencordGetPluginIpcMethodMap",t=>{t.returnValue=Nn})});function ft(t,e=300){let n;return function(...r){clearTimeout(n),n=setTimeout(()=>{t(...r)},e)}}var Vn=d(()=>{"use strict";c()});var zn,Gn=d(()=>{c();zn="PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KICAgIDxoZWFkPgogICAgICAgIDxtZXRhIGNoYXJzZXQ9InV0Zi04IiAvPgogICAgICAgIDx0aXRsZT5WZW5jb3JkIFF1aWNrQ1NTIEVkaXRvcjwvdGl0bGU+CiAgICAgICAgPGxpbmsKICAgICAgICAgICAgcmVsPSJzdHlsZXNoZWV0IgogICAgICAgICAgICBocmVmPSJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL21vbmFjby1lZGl0b3JAMC41MC4wL21pbi92cy9lZGl0b3IvZWRpdG9yLm1haW4uY3NzIgogICAgICAgICAgICBpbnRlZ3JpdHk9InNoYTI1Ni10aUpQUTJPMDR6L3BaL0F3ZHlJZ2hyT016ZXdmK1BJdkVsMVlLYlF2c1prPSIKICAgICAgICAgICAgY3Jvc3NvcmlnaW49ImFub255bW91cyIKICAgICAgICAgICAgcmVmZXJyZXJwb2xpY3k9Im5vLXJlZmVycmVyIgogICAgICAgIC8+CiAgICAgICAgPHN0eWxlPgogICAgICAgICAgICBodG1sLAogICAgICAgICAgICBib2R5LAogICAgICAgICAgICAjY29udGFpbmVyIHsKICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTsKICAgICAgICAgICAgICAgIGxlZnQ6IDA7CiAgICAgICAgICAgICAgICB0b3A6IDA7CiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTsKICAgICAgICAgICAgICAgIGhlaWdodDogMTAwJTsKICAgICAgICAgICAgICAgIG1hcmdpbjogMDsKICAgICAgICAgICAgICAgIHBhZGRpbmc6IDA7CiAgICAgICAgICAgICAgICBvdmVyZmxvdzogaGlkZGVuOwogICAgICAgICAgICB9CiAgICAgICAgPC9zdHlsZT4KICAgIDwvaGVhZD4KCiAgICA8Ym9keT4KICAgICAgICA8ZGl2IGlkPSJjb250YWluZXIiPjwvZGl2PgogICAgICAgIDxzY3JpcHQKICAgICAgICAgICAgc3JjPSJodHRwczovL2Nkbi5qc2RlbGl2ci5uZXQvbnBtL21vbmFjby1lZGl0b3JAMC41MC4wL21pbi92cy9sb2FkZXIuanMiCiAgICAgICAgICAgIGludGVncml0eT0ic2hhMjU2LUtjVTQ4VEdyODRyN3VuRjdKNUlnQm85NWFlVnJFYnJHZTA0UzdUY0ZVanM9IgogICAgICAgICAgICBjcm9zc29yaWdpbj0iYW5vbnltb3VzIgogICAgICAgICAgICByZWZlcnJlcnBvbGljeT0ibm8tcmVmZXJyZXIiCiAgICAgICAgPjwvc2NyaXB0PgoKICAgICAgICA8c2NyaXB0PgogICAgICAgICAgICByZXF1aXJlLmNvbmZpZyh7CiAgICAgICAgICAgICAgICBwYXRoczogewogICAgICAgICAgICAgICAgICAgIHZzOiAiaHR0cHM6Ly9jZG4uanNkZWxpdnIubmV0L25wbS9tb25hY28tZWRpdG9yQDAuNTAuMC9taW4vdnMiLAogICAgICAgICAgICAgICAgfSwKICAgICAgICAgICAgfSk7CgogICAgICAgICAgICByZXF1aXJlKFsidnMvZWRpdG9yL2VkaXRvci5tYWluIl0sICgpID0+IHsKICAgICAgICAgICAgICAgIGdldEN1cnJlbnRDc3MoKS50aGVuKChjc3MpID0+IHsKICAgICAgICAgICAgICAgICAgICB2YXIgZWRpdG9yID0gbW9uYWNvLmVkaXRvci5jcmVhdGUoCiAgICAgICAgICAgICAgICAgICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJjb250YWluZXIiKSwKICAgICAgICAgICAgICAgICAgICAgICAgewogICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IGNzcywKICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhbmd1YWdlOiAiY3NzIiwKICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoZW1lOiBnZXRUaGVtZSgpLAogICAgICAgICAgICAgICAgICAgICAgICB9CiAgICAgICAgICAgICAgICAgICAgKTsKICAgICAgICAgICAgICAgICAgICBlZGl0b3Iub25EaWRDaGFuZ2VNb2RlbENvbnRlbnQoKCkgPT4KICAgICAgICAgICAgICAgICAgICAgICAgc2V0Q3NzKGVkaXRvci5nZXRWYWx1ZSgpKQogICAgICAgICAgICAgICAgICAgICk7CiAgICAgICAgICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoInJlc2l6ZSIsICgpID0+IHsKICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWFrZSBtb25hY28gcmUtbGF5b3V0CiAgICAgICAgICAgICAgICAgICAgICAgIGVkaXRvci5sYXlvdXQoKTsKICAgICAgICAgICAgICAgICAgICB9KTsKICAgICAgICAgICAgICAgIH0pOwogICAgICAgICAgICB9KTsKICAgICAgICA8L3NjcmlwdD4KICAgIDwvYm9keT4KPC9odG1sPgo="});function Bn(){me.ipcMain.handle("VencordCspRemoveOverride",ci),me.ipcMain.handle("VencordCspRequestAddOverride",ai),me.ipcMain.handle("VencordCspIsDomainAllowed",li)}function oi(t,e){try{let{host:n}=new URL(t);if(/[;'"\\]/.test(n))return!1}catch{return!1}return!(e.length===0||e.some(n=>!w.includes(n)))}function si(t,e,n){let r=new URL(t).host,i=`${n} wants to allow connections to ${r}`,o=`Unless you recognise and fully trust ${r}, you should cancel this request!

You will have to fully close and restart Discord for the changes to take effect.`;if(e.length===1&&e[0]==="connect-src")return{message:i,detail:o};let s=e.filter(a=>a!=="connect-src").map(a=>{switch(a){case"img-src":return"Images";case"style-src":return"CSS & Themes";case"font-src":return"Fonts";default:throw new Error(`Illegal CSP directive: ${a}`)}}).sort().join(", ");return o=`The following types of content will be allowed to load from ${r}:
${s}

${o}`,{message:i,detail:o}}async function ai(t,e,n,r){if(!oi(e,n))return"invalid";let i=new URL(e).host;if(i in V.store.customCspRules)return"conflict";let{checkboxChecked:o,response:s}=await me.dialog.showMessageBox({...si(e,n,r),type:r?"info":"warning",title:"Vencord Host Permissions",buttons:["Cancel","Allow"],defaultId:0,cancelId:0,checkboxLabel:`I fully trust ${i} and understand the risks of allowing connections to it.`,checkboxChecked:!1});return s!==1?"cancelled":o?(V.store.customCspRules[i]=n,"ok"):"unchecked"}function ci(t,e){return e in V.store.customCspRules?(delete V.store.customCspRules[e],!0):!1}function li(t,e,n){try{let r=new URL(e).host,i=Je[r]??V.store.customCspRules[r];return i?n.every(o=>i.includes(o)):!1}catch{return!1}}var me,jn=d(()=>{"use strict";c();F();ue();me=require("electron");Xe()});function ht(t,e={}){return{fileName:t,name:e.name??t.replace(/\.css$/i,""),author:e.author??"Unknown Author",description:e.description??"A Discord Theme.",version:e.version,license:e.license,source:e.source,website:e.website,invite:e.invite}}function Fn(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}function Zn(t,e){if(!t)return ht(e);let n=t.split("/**",2)?.[1]?.split("*/",1)?.[0];if(!n)return ht(e);let r={},i="",o="";for(let s of n.split(ui))if(s.length!==0)if(s.charAt(0)==="@"&&s.charAt(1)!==" "){r[i]=o.trim();let a=s.indexOf(" ");i=s.substring(1,a),o=s.substring(a+1)}else o+=" "+s.replace("\\n",`
`).replace(fi,"@");return r[i]=o.trim(),delete r[""],ht(e,r)}var ui,fi,Wn=d(()=>{"use strict";c();ui=/[^\S\r\n]*?\r?(?:\r\n|\n)[^\S\r\n]*?\*[^\S\r\n]?/,fi=/^\\@/});function Hn(t){t.webContents.setWindowOpenHandler(({url:e})=>{switch(e){case"about:blank":case"https://discord.com/popout":case"https://ptb.discord.com/popout":case"https://canary.discord.com/popout":return{action:"allow"}}try{var{protocol:n}=new URL(e)}catch{return{action:"deny"}}switch(n){case"http:":case"https:":case"mailto:":case"steam:":case"spotify:":Kn.shell.openExternal(e)}return{action:"deny"}})}var Kn,$n=d(()=>{"use strict";c();Kn=require("electron")});function pt(t,e){let n=(0,ve.normalize)(t+"/"),r=(0,ve.join)(t,e),i=(0,ve.normalize)(r);return i.startsWith(n)?i:null}function Yn(){return(0,te.readFile)(fe,"utf-8").catch(()=>"")}async function hi(){let t=await(0,te.readdir)(Y).catch(()=>[]),e=[];for(let n of t){if(!n.endsWith(".css"))continue;let r=await qn(n).then(Fn).catch(()=>null);r!=null&&e.push(Zn(r,n))}return e}function qn(t){t=t.replace(/\?v=\d+$/,"");let e=pt(Y,t);return e?(0,te.readFile)(e,"utf-8"):Promise.reject(`Unsafe path ${t}`)}function Jn(t){let e;(0,te.open)(fe,"a+").then(r=>{r.close(),e=(0,ee.watch)(fe,{persistent:!1},ft(async()=>{t.webContents.postMessage("VencordQuickCssUpdate",await Yn())},50))}).catch(()=>{});let n=(0,ee.watch)(Y,{persistent:!1},ft(()=>{t.webContents.postMessage("VencordThemeUpdate",void 0)}));t.once("closed",()=>{e?.close(),n.close()})}var A,ee,te,ve,gt=d(()=>{"use strict";c();qt();Un();F();Vn();ue();A=require("electron");Gn();ee=require("fs"),te=require("fs/promises"),ve=require("path");jn();Wn();he();$n();(0,ee.mkdirSync)(Y,{recursive:!0});Bn();A.ipcMain.handle("VencordOpenQuickCss",()=>A.shell.openPath(fe));A.ipcMain.handle("VencordOpenExternal",(t,e)=>{try{var{protocol:n}=new URL(e)}catch{throw"Malformed URL"}if(!Vt.includes(n))throw"Disallowed protocol.";A.shell.openExternal(e)});A.ipcMain.handle("VencordGetQuickCss",()=>Yn());A.ipcMain.handle("VencordSetQuickCss",(t,e)=>(0,ee.writeFileSync)(fe,e));A.ipcMain.handle("VencordGetThemesList",()=>hi());A.ipcMain.handle("VencordGetThemeData",(t,e)=>qn(e));A.ipcMain.handle("VencordGetThemeSystemValues",()=>({"os-accent-color":`#${A.systemPreferences.getAccentColor?.()||""}`}));A.ipcMain.handle("VencordOpenThemesFolder",()=>A.shell.openPath(Y));A.ipcMain.handle("VencordOpenSettingsFolder",()=>A.shell.openPath(X));A.ipcMain.handle("VencordOpenMonacoEditor",async()=>{let t="Vencord QuickCSS Editor",e=A.BrowserWindow.getAllWindows().find(r=>r.title===t);if(e&&!e.isDestroyed()){e.focus();return}let n=new A.BrowserWindow({title:t,autoHideMenuBar:!0,darkTheme:!0,webPreferences:{preload:(0,ve.join)(__dirname,"preload.js"),contextIsolation:!0,nodeIntegration:!1,sandbox:!1}});Hn(n),await n.loadURL(`data:text/html;base64,${zn}`)})});function Cr(t,e,n){let r=e;if(e in t)return void n(t[r]);Object.defineProperty(t,e,{set(i){delete t[r],t[r]=i,n(i)},configurable:!0,enumerable:!1})}var wr=d(()=>{"use strict";c()});var Ui={};var M,q,Mi,Li,Ct,Ni,Sr=d(()=>{"use strict";c();wr();M=kt(require("electron")),q=require("path");gt();F();he();console.log("[Vencord] Starting up...");Mi=require.main.filename,Li=require.main.path.endsWith("app.asar")?"_app.asar":"app.asar",Ct=(0,q.join)((0,q.dirname)(Mi),"..",Li),Ni=require((0,q.join)(Ct,"package.json"));require.main.filename=(0,q.join)(Ct,Ni.main);M.app.setAppPath(Ct);if(_e)console.log("[Vencord] Running in vanilla mode. Not loading Vencord");else{let t=D.store;class e extends M.default.BrowserWindow{constructor(o){if(o?.webPreferences?.preload&&o.title){let s=o.webPreferences.preload;o.webPreferences.preload=(0,q.join)(__dirname,"preload.js"),o.webPreferences.sandbox=!1,o.webPreferences.backgroundThrottling=!1,t.frameless&&(o.frame=!1),t.transparent&&(o.transparent=!0,o.backgroundColor="#00000000"),t.disableMinSize&&(o.minWidth=0,o.minHeight=0),!1&&(o.backgroundColor="#00000000",t.macosVibrancyStyle&&(o.vibrancy=t.macosVibrancyStyle)),process.env.DISCORD_PRELOAD=s,super(o),t.disableMinSize&&(this.setMinimumSize=(l,m)=>{}),Jn(this)}else super(o)}}Object.assign(e,M.default.BrowserWindow),Object.defineProperty(e,"name",{value:"BrowserWindow",configurable:!0});let n=require.resolve("electron");delete require.cache[n].exports,require.cache[n].exports={...M.default,BrowserWindow:e},Cr(global,"appSettings",i=>{i.set("DANGEROUS_ENABLE_DEVTOOLS_ONLY_ENABLE_IF_YOU_KNOW_WHAT_YOURE_DOING",!0)}),process.env.DATA_DIR=(0,q.join)(M.app.getPath("userData"),"..","Vencord");let r=M.app.commandLine.appendSwitch;M.app.commandLine.appendSwitch=function(...i){if(i[0]==="disable-features"){let o=new Set((i[1]??"").split(","));o.add("WidgetLayering"),o.add("UseEcoQoSForBackgroundProcess"),i[1]+=[...o].join(",")}return r.apply(this,i)},M.app.commandLine.appendSwitch("disable-renderer-backgrounding"),M.app.commandLine.appendSwitch("disable-background-timer-throttling"),M.app.commandLine.appendSwitch("disable-backgrounding-occluded-windows")}console.log("[Vencord] Loading original Discord app.asar");require(require.main.filename)});c();var re=require("electron"),br=require("path"),wt=require("url");Xe();gt();F();he();c();var yr=require("electron");c();var er=require("module"),pi=(0,er.createRequire)("/"),Ne,gi=";var __w=require('worker_threads');__w.parentPort.on('message',function(m){onmessage({data:m})}),postMessage=function(m,t){__w.parentPort.postMessage(m,t)},close=process.exit;self=global";try{Ne=pi("worker_threads").Worker}catch{}var di=Ne?function(t,e,n,r,i){var o=!1,s=new Ne(t+gi,{eval:!0}).on("error",function(a){return i(a,null)}).on("message",function(a){return i(null,a)}).on("exit",function(a){a&&!o&&i(new Error("exited with code "+a),null)});return s.postMessage(n,r),s.terminate=function(){return o=!0,Ne.prototype.terminate.call(s)},s}:function(t,e,n,r,i){setImmediate(function(){return i(new Error("async operations unsupported - update to Node 12+ (or Node 10-11 with the --experimental-worker CLI flag)"),null)});var o=function(){};return{terminate:o,postMessage:o}},E=Uint8Array,ne=Uint16Array,tr=Int32Array,vt=new E([0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0,0,0,0]),yt=new E([0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,0,0]),nr=new E([16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15]),rr=function(t,e){for(var n=new ne(31),r=0;r<31;++r)n[r]=e+=1<<t[r-1];for(var i=new tr(n[30]),r=1;r<30;++r)for(var o=n[r];o<n[r+1];++o)i[o]=o-n[r]<<5|r;return{b:n,r:i}},ir=rr(vt,2),It=ir.b,mi=ir.r;It[28]=258,mi[258]=28;var or=rr(yt,0),sr=or.b,gs=or.r,ze=new ne(32768);for(v=0;v<32768;++v)W=(v&43690)>>1|(v&21845)<<1,W=(W&52428)>>2|(W&13107)<<2,W=(W&61680)>>4|(W&3855)<<4,ze[v]=((W&65280)>>8|(W&255)<<8)>>1;var W,v,ye=function(t,e,n){for(var r=t.length,i=0,o=new ne(e);i<r;++i)t[i]&&++o[t[i]-1];var s=new ne(e);for(i=1;i<e;++i)s[i]=s[i-1]+o[i-1]<<1;var a;if(n){a=new ne(1<<e);var l=15-e;for(i=0;i<r;++i)if(t[i])for(var m=i<<4|t[i],g=e-t[i],u=s[t[i]-1]++<<g,y=u|(1<<g)-1;u<=y;++u)a[ze[u]>>l]=m}else for(a=new ne(r),i=0;i<r;++i)t[i]&&(a[i]=ze[s[t[i]-1]++]>>15-t[i]);return a},De=new E(288);for(v=0;v<144;++v)De[v]=8;var v;for(v=144;v<256;++v)De[v]=9;var v;for(v=256;v<280;++v)De[v]=7;var v;for(v=280;v<288;++v)De[v]=8;var v,ar=new E(32);for(v=0;v<32;++v)ar[v]=5;var v;var cr=ye(De,9,1);var lr=ye(ar,5,1),Ue=function(t){for(var e=t[0],n=1;n<t.length;++n)t[n]>e&&(e=t[n]);return e},_=function(t,e,n){var r=e/8|0;return(t[r]|t[r+1]<<8)>>(e&7)&n},Ve=function(t,e){var n=e/8|0;return(t[n]|t[n+1]<<8|t[n+2]<<16)>>(e&7)},ur=function(t){return(t+7)/8|0},Ge=function(t,e,n){return(e==null||e<0)&&(e=0),(n==null||n>t.length)&&(n=t.length),new E(t.subarray(e,n))};var fr=["unexpected EOF","invalid block type","invalid length/literal","invalid distance","stream finished","no stream handler",,"no callback","invalid UTF-8 data","extra field too long","date not in range 1980-2099","filename too long","stream finishing","invalid zip data"],x=function(t,e,n){var r=new Error(e||fr[t]);if(r.code=t,Error.captureStackTrace&&Error.captureStackTrace(r,x),!n)throw r;return r},hr=function(t,e,n,r){var i=t.length,o=r?r.length:0;if(!i||e.f&&!e.l)return n||new E(0);var s=!n,a=s||e.i!=2,l=e.i;s&&(n=new E(i*3));var m=function(Dt){var Rt=n.length;if(Dt>Rt){var Pt=new E(Math.max(Rt*2,Dt));Pt.set(n),n=Pt}},g=e.f||0,u=e.p||0,y=e.b||0,U=e.l,ie=e.d,B=e.m,R=e.n,P=i*8;do{if(!U){g=_(t,u,1);var K=_(t,u+1,3);if(u+=3,K)if(K==1)U=cr,ie=lr,B=9,R=5;else if(K==2){var Ae=_(t,u,31)+257,Re=_(t,u+10,15)+4,J=Ae+_(t,u+5,31)+1;u+=14;for(var O=new E(J),se=new E(19),S=0;S<Re;++S)se[nr[S]]=_(t,u+S*3,7);u+=Re*3;for(var Ce=Ue(se),Tr=(1<<Ce)-1,xr=ye(se,Ce,1),S=0;S<J;){var St=xr[_(t,u,Tr)];u+=St&15;var T=St>>4;if(T<16)O[S++]=T;else{var ae=0,Pe=0;for(T==16?(Pe=3+_(t,u,3),u+=2,ae=O[S-1]):T==17?(Pe=3+_(t,u,7),u+=3):T==18&&(Pe=11+_(t,u,127),u+=7);Pe--;)O[S++]=ae}}var bt=O.subarray(0,Ae),H=O.subarray(Ae);B=Ue(bt),R=Ue(H),U=ye(bt,B,1),ie=ye(H,R,1)}else x(1);else{var T=ur(u)+4,j=t[T-4]|t[T-3]<<8,oe=T+j;if(oe>i){l&&x(0);break}a&&m(y+j),n.set(t.subarray(T,oe),y),e.b=y+=j,e.p=u=oe*8,e.f=g;continue}if(u>P){l&&x(0);break}}a&&m(y+131072);for(var Er=(1<<B)-1,Dr=(1<<R)-1,Be=u;;Be=u){var ae=U[Ve(t,u)&Er],ce=ae>>4;if(u+=ae&15,u>P){l&&x(0);break}if(ae||x(2),ce<256)n[y++]=ce;else if(ce==256){Be=u,U=null;break}else{var Tt=ce-254;if(ce>264){var S=ce-257,we=vt[S];Tt=_(t,u,(1<<we)-1)+It[S],u+=we}var je=ie[Ve(t,u)&Dr],Fe=je>>4;je||x(3),u+=je&15;var H=sr[Fe];if(Fe>3){var we=yt[Fe];H+=Ve(t,u)&(1<<we)-1,u+=we}if(u>P){l&&x(0);break}a&&m(y+131072);var xt=y+Tt;if(y<H){var Et=o-H,Rr=Math.min(H,xt);for(Et+y<0&&x(3);y<Rr;++y)n[y]=r[Et+y]}for(;y<xt;++y)n[y]=n[y-H]}}e.l=U,e.p=Be,e.b=y,e.f=g,U&&(g=1,e.m=B,e.d=ie,e.n=R)}while(!g);return y!=n.length&&s?Ge(n,0,y):n.subarray(0,y)};var vi=new E(0);var yi=function(t,e){var n={};for(var r in t)n[r]=t[r];for(var r in e)n[r]=e[r];return n},Xn=function(t,e,n){for(var r=t(),i=t.toString(),o=i.slice(i.indexOf("[")+1,i.lastIndexOf("]")).replace(/\s+/g,"").split(","),s=0;s<r.length;++s){var a=r[s],l=o[s];if(typeof a=="function"){e+=";"+l+"=";var m=a.toString();if(a.prototype)if(m.indexOf("[native code]")!=-1){var g=m.indexOf(" ",8)+1;e+=m.slice(g,m.indexOf("(",g))}else{e+=m;for(var u in a.prototype)e+=";"+l+".prototype."+u+"="+a.prototype[u].toString()}else e+=m}else n[l]=a}return e},Le=[],Ii=function(t){var e=[];for(var n in t)t[n].buffer&&e.push((t[n]=new t[n].constructor(t[n])).buffer);return e},Ai=function(t,e,n,r){if(!Le[n]){for(var i="",o={},s=t.length-1,a=0;a<s;++a)i=Xn(t[a],i,o);Le[n]={c:Xn(t[s],i,o),e:o}}var l=yi({},Le[n].e);return di(Le[n].c+";onmessage=function(e){for(var k in e.data)self[k]=e.data[k];onmessage="+e.toString()+"}",n,l,Ii(l),r)},Ci=function(){return[E,ne,tr,vt,yt,nr,It,sr,cr,lr,ze,fr,ye,Ue,_,Ve,ur,Ge,x,hr,At,pr,gr]};var pr=function(t){return postMessage(t,[t.buffer])},gr=function(t){return t&&{out:t.size&&new E(t.size),dictionary:t.dictionary}},wi=function(t,e,n,r,i,o){var s=Ai(n,r,i,function(a,l){s.terminate(),o(a,l)});return s.postMessage([t,e],e.consume?[t.buffer]:[]),function(){s.terminate()}};var z=function(t,e){return t[e]|t[e+1]<<8},N=function(t,e){return(t[e]|t[e+1]<<8|t[e+2]<<16|t[e+3]<<24)>>>0},dt=function(t,e){return N(t,e)+N(t,e+4)*4294967296};function Si(t,e,n){return n||(n=e,e={}),typeof n!="function"&&x(7),wi(t,e,[Ci],function(r){return pr(At(r.data[0],gr(r.data[1])))},1,n)}function At(t,e){return hr(t,{i:2},e&&e.out,e&&e.dictionary)}var mt=typeof TextDecoder<"u"&&new TextDecoder,bi=0;try{mt.decode(vi,{stream:!0}),bi=1}catch{}var Ti=function(t){for(var e="",n=0;;){var r=t[n++],i=(r>127)+(r>223)+(r>239);if(n+i>t.length)return{s:e,r:Ge(t,n-1)};i?i==3?(r=((r&15)<<18|(t[n++]&63)<<12|(t[n++]&63)<<6|t[n++]&63)-65536,e+=String.fromCharCode(55296|r>>10,56320|r&1023)):i&1?e+=String.fromCharCode((r&31)<<6|t[n++]&63):e+=String.fromCharCode((r&15)<<12|(t[n++]&63)<<6|t[n++]&63):e+=String.fromCharCode(r)}};function xi(t,e){if(e){for(var n="",r=0;r<t.length;r+=16384)n+=String.fromCharCode.apply(null,t.subarray(r,r+16384));return n}else{if(mt)return mt.decode(t);var i=Ti(t),o=i.s,n=i.r;return n.length&&x(8),o}}var Ei=function(t,e){return e+30+z(t,e+26)+z(t,e+28)},Di=function(t,e,n){var r=z(t,e+28),i=xi(t.subarray(e+46,e+46+r),!(z(t,e+8)&2048)),o=e+46+r,s=N(t,e+20),a=n&&s==4294967295?Ri(t,o):[s,N(t,e+24),N(t,e+42)],l=a[0],m=a[1],g=a[2];return[z(t,e+10),l,m,i,o+z(t,e+30)+z(t,e+32),g]},Ri=function(t,e){for(;z(t,e)!=1;e+=4+z(t,e+2));return[dt(t,e+12),dt(t,e+4),dt(t,e+20)]};var Qn=typeof queueMicrotask=="function"?queueMicrotask:typeof setTimeout=="function"?setTimeout:function(t){t()};function dr(t,e,n){n||(n=e,e={}),typeof n!="function"&&x(7);var r=[],i=function(){for(var R=0;R<r.length;++R)r[R]()},o={},s=function(R,P){Qn(function(){n(R,P)})};Qn(function(){s=n});for(var a=t.length-22;N(t,a)!=101010256;--a)if(!a||t.length-a>65558)return s(x(13,0,1),null),i;var l=z(t,a+8);if(l){var m=l,g=N(t,a+16),u=g==4294967295||m==65535;if(u){var y=N(t,a-12);u=N(t,y)==101075792,u&&(m=l=N(t,y+32),g=N(t,y+48))}for(var U=e&&e.filter,ie=function(R){var P=Di(t,g,u),K=P[0],T=P[1],j=P[2],oe=P[3],Ae=P[4],Re=P[5],J=Ei(t,Re);g=Ae;var O=function(S,Ce){S?(i(),s(S,null)):(Ce&&(o[oe]=Ce),--l||s(null,o))};if(!U||U({name:oe,size:T,originalSize:j,compression:K}))if(!K)O(null,Ge(t,J,J+T));else if(K==8){var se=t.subarray(J,J+T);if(j<524288||T>.8*j)try{O(null,At(se,{out:new E(j)}))}catch(S){O(S,null)}else r.push(Si(se,{size:j},O))}else O(x(14,"unknown compression type "+K,1),null);else O(null,null)},B=0;B<m;++B)ie(B)}else s(null,{});return i}var Ir=require("fs"),G=require("fs/promises"),Ie=require("path");he();c();function mr(t){function e(s,a,l,m){let g=0;return g+=s<<0,g+=a<<8,g+=l<<16,g+=m<<24>>>0,g}if(t[0]===80&&t[1]===75&&t[2]===3&&t[3]===4)return t;if(t[0]!==67||t[1]!==114||t[2]!==50||t[3]!==52)throw new Error("Invalid header: Does not start with Cr24");let n=t[4]===3,r=t[4]===2;if(!r&&!n||t[5]||t[6]||t[7])throw new Error("Unexpected crx format version number.");if(r){let s=e(t[8],t[9],t[10],t[11]),a=e(t[12],t[13],t[14],t[15]),l=16+s+a;return t.subarray(l,t.length)}let o=12+e(t[8],t[9],t[10],t[11]);return t.subarray(o,t.length)}c();var Pi=require("original-fs");async function Oi(t,e){try{var n=await fetch(t,e)}catch(i){throw i instanceof Error&&i.cause&&(i=i.cause),new Error(`${e?.method??"GET"} ${t} failed: ${i}`)}if(n.ok)return n;let r=`${e?.method??"GET"} ${t}: ${n.status} ${n.statusText}`;try{let i=await n.text();r+=`
${i}`}catch{}throw new Error(r)}async function vr(t,e){let r=await(await Oi(t,e)).arrayBuffer();return Buffer.from(r)}var ki=(0,Ie.join)(ke,"ExtensionCache");async function _i(t,e){return await(0,G.mkdir)(e,{recursive:!0}),new Promise((n,r)=>{dr(t,(i,o)=>{if(i)return void r(i);Promise.all(Object.keys(o).map(async s=>{if(s.startsWith("_metadata/"))return;if(s.endsWith("/"))return void(0,G.mkdir)((0,Ie.join)(e,s),{recursive:!0});let a=s.split("/"),l=a.pop(),m=a.join("/"),g=(0,Ie.join)(e,m);m&&await(0,G.mkdir)(g,{recursive:!0}),await(0,G.writeFile)((0,Ie.join)(g,l),o[s])})).then(()=>n()).catch(s=>{(0,G.rm)(e,{recursive:!0,force:!0}),r(s)})})})}async function Ar(t){let e=(0,Ie.join)(ki,`${t}`);try{await(0,G.access)(e,Ir.constants.F_OK)}catch{let r=`https://clients2.google.com/service/update2/crx?response=redirect&acceptformat=crx2,crx3&x=id%3D${t}%26uc&prodversion=${process.versions.chrome}`,i=await vr(r,{headers:{"User-Agent":`Electron ${process.versions.electron} ~ Vencord (https://github.com/Vendicated/Vencord)`}});await _i(mr(i),e).catch(o=>console.error(`Failed to extract extension ${t}`,o))}yr.session.defaultSession.loadExtension(e)}_e||re.app.whenReady().then(()=>{re.protocol.handle("vencord",({url:t})=>{let e=decodeURI(t).slice(10).replace(/\?v=\d+$/,"");if(e.endsWith("/")&&(e=e.slice(0,-1)),e.startsWith("/themes/")){let n=e.slice(8),r=pt(Y,n);return r?re.net.fetch((0,wt.pathToFileURL)(r).toString()):new Response(null,{status:404})}switch(e){case"renderer.js.map":case"vencordDesktopRenderer.js.map":case"preload.js.map":case"vencordDesktopPreload.js.map":case"patcher.js.map":case"vencordDesktopMain.js.map":return re.net.fetch((0,wt.pathToFileURL)((0,br.join)(__dirname,e)).toString());default:return new Response(null,{status:404})}});try{D.store.enableReactDevtools&&Ar("fmkadmapgofadopljbjfkapdkoienihi").then(()=>console.info("[Vencord] Installed React Developer Tools")).catch(t=>console.error("[Vencord] Failed to install React Developer Tools",t))}catch{}Ft()});Sr();
//# sourceURL=file:///VencordPatcher
//# sourceMappingURL=vencord://patcher.js.map
/*! For license information please see patcher.js.LEGAL.txt */
