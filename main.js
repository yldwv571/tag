(()=>{
const $=i=>document.getElementById(i),qa=s=>[...document.querySelectorAll(s)];
const mem={};
const gs=k=>{try{const v=localStorage.getItem(k);return v===null?(mem[k]??null):v}catch(e){return mem[k]??null}};
const ss=(k,v)=>{mem[k]=v;try{localStorage.setItem(k,v)}catch(e){}};
const js=(k,d)=>{try{return JSON.parse(gs(k))||d}catch(e){return d}};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const toast=m=>{const t=document.createElement("div");t.className="t";t.textContent=m;$("toasts").appendChild(t);setTimeout(()=>t.remove(),3600)};
const sha=async s=>{try{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")}catch(e){return btoa(unescape(encodeURIComponent(s)))}};

/* server API */
let U=null,fem="";
const api=async(m,u,b)=>{try{const r=await fetch("/api"+u,{method:m,headers:{"Content-Type":"application/json"},credentials:"same-origin",body:b?JSON.stringify(b):undefined});const d=await r.json().catch(()=>({}));return r.ok?d:{err:d.err||"Server xatosi"}}catch(e){return {err:"Serverga ulanib bo‘lmadi"}}};
const me=()=>U,tasks=()=>U?U.tasks||[]:[],sync=d=>{if(d&&d.user)U=d.user;return d};
const forgotH=()=>`<h3 style="margin-bottom:12px">🔑 Parolni tiklash</h3><form id="fg" novalidate><input id="fe" type="email" placeholder="Ro‘yxatdan o‘tgan email"><div class="err" id="er"></div><button class="btn">Kod yuborish</button></form>`;
const resetH=e=>`<h3 style="margin-bottom:12px">🔐 Yangi parol</h3><form id="rs" novalidate><p class="mut">${esc(e)} manziliga kod yuborildi.</p><input id="rc" class="code" maxlength="4" inputmode="numeric" placeholder="••••"><input id="rp" type="password" placeholder="Yangi parol (kamida 6 ta belgi)"><div class="err" id="er"></div><button class="btn">Parolni almashtirish</button></form>`;

/* ma’lumotlar */
const SV=[["⚡","Veb-dasturlash","Tez va zamonaviy saytlar yaratamiz."],["📱","Mobil ilovalar","iOS va Android uchun ilovalar."],["🎨","UI/UX dizayn","Ko‘zni quvontiruvchi interfeyslar."],["🤖","AI yechimlar","Biznesingiz uchun aqlli botlar."],["☁️","Bulutli xizmat","Ishonchli hosting va xavfsizlik."],["📈","SEO va marketing","Mijozlar oqimini oshiring."]];
const PJ=[["Web","🛒","Onlayn do‘kon"],["Mobil","🍔","Yetkazib berish ilovasi"],["Dizayn","🎬","Kino platformasi"],["Web","🏦","Bank paneli"],["Mobil","🏋️","Fitnes tracker"],["Dizayn","🎵","Musiqa pleyeri"],["Web","📚","Onlayn maktab"],["Mobil","✈️","Sayohat gidi"]];
const BL=[["Texnologiya","JavaScript 2026: nimalar yangi?","12 okt","Til yildan-yilga rivojlanmoqda: yangi sintaksis, tezroq dvigatellar va qulayroq vositalar dasturchilar ishini yengillashtirmoqda."],["Dizayn","Qorong‘i rejim nega kerak?","8 okt","Qorong‘i rejim ko‘zni charchatmaydi, batareyani tejaydi va interfeysga zamonaviy ko‘rinish beradi."],["AI","Sun’iy intellekt biznesda","3 okt","Botlar mijozlarga 24/7 javob beradi, vaqtni tejaydi va xarajatlarni kamaytiradi."],["Xavfsizlik","Kuchli parol yaratish","29 sen","Uzun, harf, raqam va belgilarni aralashtirgan parol eng yaxshi himoya. Har sayt uchun alohida parol ishlating."],["Texnologiya","Mobil birinchi yondashuv","21 sen","Foydalanuvchilarning katta qismi telefondan kiradi, shuning uchun dizaynni avval kichik ekran uchun yarating."],["Marketing","SEO asoslari","15 sen","Sifatli kontent, tez sayt va to‘g‘ri kalit so‘zlar saytingizni qidiruvda yuqoriga ko‘taradi."]];
const AV=["🦊","🐼","🦁","🐯","🐸","🚀","👾","🎧"],IN=["Dasturlash","Dizayn","AI","Marketing","O‘yinlar","Musiqa"];

/* shablonlar */
const H=(t,s)=>`<div class="sh rv"><h2>${t}</h2>${s?`<p>${s}</p>`:""}</div>`;
const cd=(i,t,p)=>`<div class="card rv"><div class="fi">${i}</div><h3>${t}</h3><p>${p}</p></div>`;
const cta=()=>`<div class="wrap"><div class="card band rv"><h2>Loyihangizni boshlaymizmi? 🚀</h2><p>Bepul maslahat oling — biz doim aloqadamiz.</p>${me()?`<a class="btn" href="#kabinet">Kabinetga o‘tish</a>`:`<button class="btn" data-auth="register">Ro‘yxatdan o‘tish</button>`}</div></div>`;
const plans=()=>`<div class="sw rv"><span>Oylik</span><button id="bill" aria-label="Yillik"></button><span>Yillik (−20%)</span></div><div class="grid">
<div class="card price rv"><h3>Start</h3><div class="pr">$0</div><ul><li>5 ta loyiha</li><li>Asosiy vazifalar</li><li>Email yordam</li></ul><button class="btn o" data-auth="register">Tanlash</button></div>
<div class="card price pop rv"><h3>Pro 🔥</h3><div class="pr pv" data-pm="12">$12</div><ul><li>Cheksiz loyihalar</li><li>XP va yutuqlar</li><li>Tezkor yordam</li></ul><button class="btn" data-auth="register">Tanlash</button></div>
<div class="card price rv"><h3>Biznes</h3><div class="pr pv" data-pm="39">$39</div><ul><li>Hammasi Pro’da</li><li>Maxsus hisobotlar</li><li>24/7 menejer</li></ul><button class="btn o" data-auth="register">Tanlash</button></div></div>`;
const pjs=()=>PJ.map((p,i)=>(fl==="Hammasi"||p[0]===fl)?`<div class="card rv"><div class="th">${p[1]}</div><span class="tag">${p[0]}</span><h3>${p[2]}</h3><button class="btn o" data-pj="${i}" style="margin-top:10px">Ko‘rish</button></div>`:"").join("");
const bl=s=>BL.map((p,i)=>p[1].toLowerCase().includes(s.toLowerCase())?`<div class="card rv"><span class="tag">${p[0]}</span><h3>${p[1]}</h3><p style="margin:6px 0">📅 ${p[2]}</p><button class="btn o" data-post="${i}">O‘qish →</button></div>`:"").join("")||`<p class="mut" style="text-align:center">Hech narsa topilmadi 😕</p>`;
const faq=`<div class="wrap" style="max-width:760px"><details class="rv"><summary>Bu bepulmi?</summary><p>Ha, Start tarifi butunlay bepul.</p></details><details class="rv"><summary>Ma’lumotlarim qayerda saqlanadi?</summary><p>Ushbu demoda ma’lumotlar faqat brauzeringizda saqlanadi.</p></details><details class="rv"><summary>XP nima uchun kerak?</summary><p>Vazifa va fokus sessiyalari uchun XP olasiz, daraja va yutuqlar ochiladi.</p></details></div>`;
const fmt=s=>String(Math.floor(s/60)).padStart(2,"0")+":"+String(s%60).padStart(2,"0");
let fl="Hammasi",dt="tasks",am="login",rs=1,rg={int:[],av:AV[0]},code="",tm,ps=1500,pi=null;

const P={
home:()=>`<div class="wrap hero"><span class="tag">🚀 Yangi avlod agentligi</span><h1>Biz <span class="gr" id="tp">tez</span><br>loyihalar yaratamiz</h1><p>Orbita — veb, mobil va AI yechimlar. Ro‘yxatdan o‘ting, XP yig‘ing va shaxsiy kabinetingizni oching.</p><div class="cta"><button class="btn" data-auth="register">Bepul boshlash</button><a class="btn o" href="#portfolio">Ishlarimiz →</a></div></div>
<div class="mq"><div>${"<span>⚡ Tezlik</span><span>🔒 Xavfsizlik</span><span>🎨 Dizayn</span><span>🤖 AI</span><span>📱 Mobil</span><span>☁️ Bulut</span>".repeat(4)}</div></div>
<div class="wrap stats"><div class="card stat rv"><b data-n="128000">0</b>Foydalanuvchilar</div><div class="card stat rv"><b data-n="540">0</b>Bajarilgan loyiha</div><div class="card stat rv"><b data-n="99">0</b>% mamnun mijoz</div><div class="card stat rv"><b data-n="24">0</b>/7 yordam</div></div>
<section><div class="wrap">${H("Bizning <span class=\"gr\">xizmatlar</span>","Sizga kerak bo‘lgan hamma narsa")}<div class="grid">${SV.slice(0,3).map(s=>cd(...s)).join("")}</div><p style="text-align:center;margin-top:26px"><a class="btn o" href="#xizmatlar">Hammasi →</a></p></div></section>
<section><div class="wrap">${H("Qanday <span class=\"gr\">ishlaydi</span>")}<div class="grid">${cd("1️⃣","Ro‘yxatdan o‘ting","3 bosqichli tez ro‘yxatdan o‘tish.")}${cd("2️⃣","Vazifa bajaring","Har bir vazifa uchun 10 XP olasiz.")}${cd("3️⃣","Daraja oshiring","Yutuqlarni oching va yuqoriga ko‘tariling.")}</div></div></section>${cta()}`,
xizmatlar:()=>`<section><div class="wrap">${H("Bizning <span class=\"gr\">xizmatlar</span>","G‘oyadan tayyor mahsulotgacha")}<div class="grid">${SV.map(s=>cd(...s)).join("")}</div></div></section>${cta()}`,
portfolio:()=>`<section><div class="wrap">${H("Bizning <span class=\"gr\">ishlar</span>","Mijozlar uchun yaratgan loyihalarimiz")}<div class="chips">${["Hammasi","Web","Mobil","Dizayn"].map(c=>`<button class="chip ${c===fl?"on":""}" data-f="${c}">${c}</button>`).join("")}</div><div class="grid" id="pj">${pjs()}</div></div></section>`,
blog:()=>`<section><div class="wrap">${H("Bizning <span class=\"gr\">blog</span>","Foydali maqolalar va yangiliklar")}<div class="bs"><input id="bs" placeholder="🔍 Maqola qidirish..."></div><div class="grid" id="bl">${bl("")}</div></div></section>`,
narxlar:()=>`<section><div class="wrap">${H("Qulay <span class=\"gr\">tariflar</span>")}${plans()}</div></section><section><div class="wrap">${H("Ko‘p so‘raladigan <span class=\"gr\">savollar</span>")}</div>${faq}</section>`,
aloqa:()=>`<section><div class="wrap">${H("Biz bilan <span class=\"gr\">bog‘laning</span>")}<div class="two"><div class="grid" style="grid-template-columns:1fr">${cd("📍","Manzil","Toshkent, Amir Temur ko‘chasi")}${cd("📞","Telefon","+998 90 000 00 00")}${cd("✉️","Email","salom@orbita.uz")}</div><form class="c card rv" id="cf"><input id="cn" placeholder="Ismingiz" required><input id="ce" type="email" placeholder="Email" required><textarea id="cm2" rows="5" placeholder="Xabaringiz" required></textarea><button class="btn">Yuborish ✉️</button></form></div></div></section>`,
kabinet:()=>{const u=me(),t=tasks(),d=t.filter(x=>x.d).length,xp=u.xp||0,lv=Math.floor(xp/50)+1,pr=(xp%50)*2;
const bd=[["🌱","Boshlovchi",d>=1],["🔥","Faol",d>=5],["⚡","Tezkor",xp>=100],["👑","Usta",lv>=5]].map(b=>`<div class="bdg ${b[2]?"":"lk"}"><span>${b[0]}</span>${b[1]}</div>`).join("");
const body=dt==="tasks"?`<div class="todo"><input id="ti" placeholder="Yangi vazifa yozing..." maxlength="120"><button class="btn" id="ta">Qo‘shish</button></div><ul class="tl">${t.length?t.map((x,i)=>`<li class="${x.d?"d":""}"><input type="checkbox" data-tg="${x.id}" ${x.d?"checked":""}><span>${esc(x.x)}</span><button data-del="${x.id}">🗑️</button></li>`).join(""):`<li class="mut">Hozircha vazifa yo‘q ✨</li>`}</ul>`
:dt==="pomo"?`<div style="text-align:center"><div class="clk" id="pt">${fmt(ps)}</div><div class="cta"><button class="btn" id="ps">${pi?"⏸ Pauza":"▶ Boshlash"}</button><button class="btn o" id="pr">↺ Qayta</button></div><p class="mut" style="margin-top:14px">25 daqiqa fokus = +20 XP</p></div>`
:`<form class="c" id="pf"><label class="mut">Ismingiz</label><input id="pn" value="${esc(u.n)}"><label class="mut">Foydalanuvchi nomi</label><input value="@${esc(u.u)}" disabled><label class="mut">Qiziqishlar</label><div class="chips" style="justify-content:flex-start;margin:0">${(u.int||[]).map(i=>`<span class="chip on">${esc(i)}</span>`).join("")||"<span class=\"mut\">Tanlanmagan</span>"}</div><button class="btn">Saqlash</button><button type="button" class="btn o" id="delacc">Hisobni o‘chirish</button></form>`;
return `<div class="wrap" style="padding:40px 20px"><div class="dtop"><div><h2>${u.av} ${esc(u.n)}</h2><p class="mut">@${esc(u.u)} · ${new Date(u.t).toLocaleDateString("uz-UZ")} dan beri</p></div><button class="btn o" id="out">Chiqish</button></div>
<div class="stats"><div class="card stat"><b>Lv ${lv}</b>${xp} XP<div class="bar"><i style="width:${pr}%;background:var(--a)"></i></div></div><div class="card stat"><b>${t.length}</b>Jami vazifalar</div><div class="card stat"><b>${d}</b>Bajarilgan</div></div>
<div class="bdgs">${bd}</div>
<div class="tabs" style="max-width:440px">${[["tasks","✅ Vazifalar"],["pomo","⏱️ Fokus"],["prof","👤 Profil"]].map(([k,l])=>`<button data-tab="${k}" class="${dt===k?"on":""}">${l}</button>`).join("")}</div><div class="card">${body}</div></div>`}
};

/* modal va ro‘yxatdan o‘tish (3 bosqich) */
const modal=h=>{$("mc").innerHTML=h;$("ov").classList.add("show")};
const closeM=()=>$("ov").classList.remove("show");
const loginH=()=>`<form id="lf" novalidate><input id="li" placeholder="Email yoki foydalanuvchi nomi" autocomplete="username"><input id="lp" type="password" placeholder="Parol" autocomplete="current-password"><label class="mut" style="font-size:.85rem"><input type="checkbox" id="lr" checked style="width:auto"> Meni eslab qol</label><label class="mut" style="font-size:.85rem"><input type="checkbox" id="sp" style="width:auto"> Parolni ko‘rsatish</label><div class="err" id="er"></div><button class="btn">Kirish</button><a href="#" data-forgot style="text-align:center;color:var(--a)">Parolni unutdingizmi?</a></form>`;
const wiz=()=>{const dots=`<div class="dots">${[1,2,3].map(i=>`<i class="${i<=rs?"on":""}"></i>`).join("")}</div>`;
if(rs===1)return dots+`<form id="w1" novalidate><input id="an" placeholder="To‘liq ism" value="${esc(rg.n||"")}" autocomplete="name"><input id="ae" type="email" placeholder="Email" value="${esc(rg.e||"")}" autocomplete="email"><input id="ap" type="password" placeholder="Parol" value="${esc(rg.pw||"")}" autocomplete="new-password"><div class="bar"><i id="bi"></i></div><input id="ap2" type="password" placeholder="Parolni takrorlang" value="${esc(rg.pw||"")}" autocomplete="new-password"><label class="mut" style="font-size:.85rem"><input type="checkbox" id="sp" style="width:auto"> Parolni ko‘rsatish</label><div class="err" id="er"></div><button class="btn">Davom etish →</button></form>`;
if(rs===2)return dots+`<form id="w2" novalidate><input id="wu" placeholder="Foydalanuvchi nomi (masalan: aziz_01)" value="${esc(rg.u||"")}" maxlength="16"><p class="mut">Avatar tanlang:</p><div class="avs">${AV.map(a=>`<button type="button" class="av ${rg.av===a?"on":""}" data-av="${a}">${a}</button>`).join("")}</div><p class="mut">Qiziqishlar:</p><div class="chips" style="justify-content:flex-start;margin:0">${IN.map(i=>`<button type="button" class="chip ${rg.int.includes(i)?"on":""}" data-it="${i}">${i}</button>`).join("")}</div><div class="err" id="er"></div><div class="two2"><button type="button" class="btn o" data-back>← Orqaga</button><button class="btn">Davom →</button></div></form>`;
return dots+`<form id="w3" novalidate><p style="text-align:center">📨 <b>${esc(rg.e)}</b> manziliga 4 xonali kod yuborildi.<br><span class="mut">(Demo: kod yuqorida bildirishnomada ko‘rinadi)</span></p><input id="wc" class="code" maxlength="4" inputmode="numeric" placeholder="••••"><div class="err" id="er"></div><div class="two2"><button type="button" class="btn o" data-resend>Qayta yuborish</button><button class="btn">Tasdiqlash ✓</button></div></form>`};
const authM=()=>`<div class="tabs"><button data-am="login" class="${am==="login"?"on":""}">Kirish</button><button data-am="register" class="${am==="register"?"on":""}">Ro‘yxatdan o‘tish</button></div>${am==="login"?loginH():wiz()}`;
const openA=m=>{am=m;if(m==="register"){rs=1;rg={int:[],av:AV[0]}}modal(authM())};
const sendCode=async()=>{const d=await api("POST","/register/resend",{e:rg.e});toast(d.err||(d.demo?"📨 Yangi kod: "+d.demo+" (demo)":"📨 Kod qayta yuborildi"))};
const nav=()=>{const u=me();$("au").innerHTML=u?`<a class="btn" data-r="kabinet" href="#kabinet">${u.av} ${esc(u.n.split(" ")[0])}</a>`:`<button class="btn o" data-auth="login">Kirish</button> <button class="btn" data-auth="register">Ro‘yxatdan o‘tish</button>`};
const go=h=>location.hash==="#"+h?route():(location.hash=h);

/* animatsiyalar */
const io=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);if(el.dataset.n)count(el);else{el.classList.add("in");setTimeout(()=>el.classList.remove("rv","in"),800)}}),{threshold:.12});
const watch=()=>qa(".rv,[data-n]").forEach(el=>io.observe(el));
const count=el=>{const n=+el.dataset.n,s=performance.now();const f=t=>{const p=Math.min((t-s)/1400,1);el.textContent=Math.floor(n*(1-Math.pow(1-p,3))).toLocaleString("en-US");if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)};
const typed=()=>{const el=$("tp");if(!el)return;const W=["tez","xavfsiz","zamonaviy","kuchli"];let w=0,i=0,del=false;tm=setInterval(()=>{const s=W[w];i+=del?-1:1;el.textContent=s.slice(0,i);if(!del&&i===s.length)del=true;else if(del&&i===0){del=false;w=(w+1)%W.length}},120)};

function route(){clearInterval(tm);clearInterval(pi);pi=null;let h=location.hash.slice(1);if(!P[h])h="home";if(h==="kabinet"&&!me()){h="home";openA("login")}
const a=$("app");a.innerHTML=P[h]();a.className="";void a.offsetWidth;a.className="pg";
qa("[data-r]").forEach(l=>l.classList.toggle("act",l.dataset.r===h));$("links").classList.remove("open");scrollTo(0,0);watch();if(h==="home")typed()}
const rd=()=>{$("app").innerHTML=P.kabinet();const i=$("ti");if(i)i.focus()};

/* chat yordamchi */
const BOT=[[/salom|assalom|hi\b/,"Assalomu alaykum! 👋 Sizga qanday yordam bera olaman?"],[/narx|tarif|pul|\$/,"Tariflar: Start — $0, Pro — $12, Biznes — $39. Batafsil: Narxlar sahifasi 💰"],[/aloqa|telefon|manzil|email/,"Telefon: +998 90 000 00 00, email: salom@orbita.uz 📞"],[/xizmat|sayt|ilova|dizayn/,"Veb, mobil, dizayn, AI va marketing xizmatlarimiz bor. Xizmatlar sahifasiga qarang 🚀"],[/xp|daraja|yutuq/,"Vazifa uchun 10 XP, fokus uchun 20 XP olasiz. Har 50 XP — yangi daraja! ⭐"],[/rahmat|raxmat|sag/,"Marhamat! 😊 Yana savol bo‘lsa yozing."]];
const say=(t,u)=>{const m=document.createElement("div");m.className="m"+(u?" u":"");m.textContent=t;$("cm").appendChild(m);$("cm").scrollTop=1e5};
const reply=t=>{const m=BOT.find(b=>b[0].test(t.toLowerCase()));return m?m[1]:"Savolingizni tushundim 🤔 Aloqa sahifasi orqali yozing, jamoamiz tez javob beradi!"};
say("Salom! Men Orbita yordamchisiman 🤖 Narx, xizmat yoki XP haqida so‘rang.");

/* hodisalar */
document.addEventListener("click",e=>{const t=e.target,c=s=>t.closest(s);let x;
if(x=c(".btn")){const r=x.getBoundingClientRect(),s=document.createElement("span");s.className="rp";s.style.left=(e.clientX-r.left)+"px";s.style.top=(e.clientY-r.top)+"px";x.appendChild(s);setTimeout(()=>s.remove(),600)}
if(x=c("[data-auth]"))return openA(x.dataset.auth);
if(c("[data-forgot]")){e.preventDefault();return modal(forgotH())}
if(x=c("[data-am]"))return openA(x.dataset.am);
if(c("#cl")||t.id==="ov"||c("[data-close]"))return closeM();
if(x=c("[data-av]")){rg.u=$("wu").value;rg.av=x.dataset.av;return modal(authM())}
if(x=c("[data-it]")){rg.u=$("wu").value;const i=x.dataset.it;rg.int=rg.int.includes(i)?rg.int.filter(y=>y!==i):[...rg.int,i];return modal(authM())}
if(c("[data-back]")){rg.u=$("wu").value;rs=1;return modal(authM())}
if(c("[data-resend]"))return sendCode();
if(x=c("[data-f]")){fl=x.dataset.f;$("pj").innerHTML=pjs();qa("[data-f]").forEach(b=>b.classList.toggle("on",b===x));return watch()}
if(x=c("[data-post]")){const p=BL[x.dataset.post];return modal(`<h2>${p[1]}</h2><p class="mut">${p[0]} · ${p[2]}</p><p style="margin:14px 0 20px">${p[3]}</p><button class="btn" data-close>Yopish</button>`)}
if(x=c("[data-pj]")){const p=PJ[x.dataset.pj];return modal(`<div style="font-size:4rem;text-align:center">${p[1]}</div><h2 style="text-align:center">${p[2]}</h2><p class="mut" style="text-align:center">${p[0]} loyiha</p><p style="margin:14px 0 20px">Mijoz uchun to‘liq yechim: dizayn, dasturlash va doimiy qo‘llab-quvvatlash.</p><button class="btn" data-close>Yopish</button>`)}
if(c("#bill")){const y=$("bill").classList.toggle("on");qa(".pv").forEach(p=>p.textContent="$"+(y?Math.round(p.dataset.pm*.8):p.dataset.pm));return}
if(x=c("[data-tab]")){dt=x.dataset.tab;return rd()}
if(c("#out")){api("POST","/logout").then(()=>{U=null;nav();toast("Tizimdan chiqdingiz");go("home")});return}
if(c("#ta")){const v=$("ti").value.trim();if(v)api("POST","/tasks",{x:v}).then(d=>{if(d.err)toast(d.err);sync(d);rd()});return}
if(x=c("[data-del]")){api("DELETE","/tasks/"+x.dataset.del).then(d=>{sync(d);rd()});return}
if(c("#ps")){const b=$("ps");if(pi){clearInterval(pi);pi=null}else pi=setInterval(()=>{ps--;const el=$("pt");if(el)el.textContent=fmt(ps);if(ps<=0){clearInterval(pi);pi=null;ps=1500;api("POST","/focus").then(d=>{sync(d);toast("⏱️ Fokus tugadi! +20 XP 🎉");rd()})}},1000);b.textContent=pi?"⏸ Pauza":"▶ Boshlash";return}
if(c("#pr")){clearInterval(pi);pi=null;ps=1500;return rd()}
if(c("#delacc")){if(confirm("Hisobingiz o‘chirilsinmi?"))api("DELETE","/me").then(()=>{U=null;nav();toast("Hisob o‘chirildi");go("home")});return}
if(c("#cb"))$("cp").classList.toggle("show");
if(c("#cx"))$("cp").classList.remove("show");
if(c("#bt"))scrollTo({top:0,behavior:"smooth"})});
document.addEventListener("change",e=>{const x=e.target;
if(x.dataset.tg!==undefined){const ck=x.checked;api("PATCH","/tasks/"+x.dataset.tg,{d:ck}).then(d=>{sync(d);if(ck)toast("+10 XP ⭐");rd()})}
if(x.id==="sp"){const ty=x.checked?"text":"password";["ap","ap2","lp"].forEach(i=>{if($(i))$(i).type=ty})}});
document.addEventListener("input",e=>{const x=e.target;
if(x.id==="bs"){$("bl").innerHTML=bl(x.value);watch()}
if(x.id==="ap"&&am==="register"){const v=x.value;let s=0;if(v.length>=6)s++;if(v.length>=10)s++;if(/[A-Z]/.test(v)&&/[a-z]/.test(v))s++;if(/\d/.test(v))s++;if(/[^A-Za-z0-9]/.test(v))s++;const b=$("bi");b.style.width=s*20+"%";b.style.background=["#ff4d6d","#ff4d6d","#ffb703","#4cc9f0","#2ecc71","#2ecc71"][s]}});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeM();if(e.key==="Enter"&&e.target.id==="ti"){e.preventDefault();$("ta").click()}});
document.addEventListener("submit",async e=>{e.preventDefault();const f=e.target.id,v=i=>($(i)||{}).value||"",er=$("er");
if(f==="cf"){const b={n:v("cn"),e:v("ce"),m:v("cm2")};e.target.reset();const d=await api("POST","/contact",b);toast(d.err||"Xabaringiz yuborildi! ✅")}
if(f==="nf"){e.target.reset();toast("Obuna bo‘ldingiz! 📬")}
if(f==="cfm"){const t=v("ci").trim();if(!t)return;$("ci").value="";say(t,true);setTimeout(()=>say(reply(t)),700)}
if(f==="pf"){const n=v("pn").trim();if(n.length<2)return toast("Ism juda qisqa");sync(await api("PUT","/me",{n}));nav();toast("Saqlandi ✅");rd()}
if(f==="lf"){const d=await api("POST","/login",{id:v("li").trim(),pw:v("lp"),rem:$("lr").checked});if(d.err)return er.textContent=d.err;sync(d);closeM();nav();toast("Qaytganingiz bilan, "+U.n+"! 👋");go("kabinet")}
if(f==="w1"){const n=v("an").trim(),em=v("ae").trim().toLowerCase(),pw=v("ap");
if(n.length<2)return er.textContent="Ismingizni kiriting";
if(!/^\S+@\S+\.\S+$/.test(em))return er.textContent="Email noto‘g‘ri kiritilgan";
if(pw.length<6)return er.textContent="Parol kamida 6 ta belgi bo‘lsin";
if(pw!==v("ap2"))return er.textContent="Parollar bir xil emas";
Object.assign(rg,{n,e:em,pw});rs=2;modal(authM())}
if(f==="w2"){const un=v("wu").trim().toLowerCase();
if(!/^[a-z0-9_]{3,16}$/.test(un))return er.textContent="3–16 ta lotin harf, raqam yoki _ kiriting";
rg.u=un;const d=await api("POST","/register/start",{n:rg.n,e:rg.e,pw:rg.pw,u:un,av:rg.av,int:rg.int});if(d.err)return er.textContent=d.err;if(d.demo)toast("📨 Tasdiqlash kodi: "+d.demo+" (demo)");rs=3;modal(authM())}
if(f==="w3"){const d=await api("POST","/register/verify",{e:rg.e,code:v("wc")});if(d.err)return er.textContent=d.err;sync(d);rg={int:[],av:AV[0]};closeM();nav();toast("Xush kelibsiz, "+U.n+"! 🎉");go("kabinet")}
if(f==="fg"){fem=v("fe").trim().toLowerCase();const d=await api("POST","/forgot",{e:fem});if(d.err)return er.textContent=d.err;if(d.demo)toast("📨 Tiklash kodi: "+d.demo+" (demo)");modal(resetH(fem))}
if(f==="rs"){const d=await api("POST","/reset",{e:fem,code:v("rc"),pw:v("rp")});if(d.err)return er.textContent=d.err;toast("Parol almashtirildi ✅ Endi kiring");openA("login")}
});

if(matchMedia("(pointer:fine)").matches){document.addEventListener("mousemove",e=>{$("glow").style.transform=`translate(${e.clientX}px,${e.clientY}px)`;const c=e.target.closest&&e.target.closest(".card:not(.band):not(.stat)");if(c&&!c.querySelector(".tl,form,textarea")){const r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(700px) rotateX(${-y*9}deg) rotateY(${x*9}deg) translateY(-4px)`}});
document.addEventListener("mouseout",e=>{const c=e.target.closest&&e.target.closest(".card");if(c)c.style.transform=""})}
addEventListener("scroll",()=>{const d=document.documentElement,m=d.scrollHeight-innerHeight;$("prog").style.width=(m>0?scrollY/m*100:0)+"%";$("bt").classList.toggle("on",scrollY>400)},{passive:true});
const th=gs("nh_theme");if(th)document.documentElement.setAttribute("data-theme",th);
$("theme").onclick=()=>{const d=document.documentElement,a=d.getAttribute("data-theme"),dark=a?a==="dark":matchMedia("(prefers-color-scheme:dark)").matches,n=dark?"light":"dark";d.setAttribute("data-theme",n);ss("nh_theme",n)};
$("burger").onclick=()=>$("links").classList.toggle("open");
addEventListener("hashchange",route);
api("GET","/me").then(d=>{sync(d);nav();route()});
})();
