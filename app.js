const C={Food:"🍔",Travel:"🚌",Education:"📚",Shopping:"🛍️",Entertainment:"🎬",Health:"💊",Bills:"🧾",Other:"•••"};
const off=n=>{let d=new Date();d.setDate(d.getDate()+n);return d.toISOString().slice(0,10)};
const demo=[["Lunch at canteen",250,"Food","UPI",0],["Bus fare",80,"Travel","Cash",0],["DBMS reference book",450,"Education","Card",-2],["Movie with friends",320,"Entertainment","UPI",-4],["Groceries",180,"Food","UPI",-5],["Notebook & pens",120,"Education","Cash",-7],["Online shopping",220,"Shopping","UPI",-10],["Coffee",150,"Food","UPI",-12],["Auto ride",90,"Travel","Cash",-14],["Pharmacy",300,"Health","UPI",-16],["Hostel laundry",210,"Bills","Cash",-19],["Snacks",140,"Food","UPI",-22]].map((x,i)=>({id:i+1,description:x[0],amount:x[1],category:x[2],payment:x[3],date:off(x[4]),note:""}));
let S=JSON.parse(localStorage.getItem("spendwise_state")||"null")||{name:"Alex Student",budget:6000,theme:"light",expenses:demo};
const $=id=>document.getElementById(id), $$=s=>document.querySelectorAll(s), money=n=>"₹"+Math.round(n||0).toLocaleString("en-IN"), key=s=>s.slice(0,7),nowKey=()=>new Date().toISOString().slice(0,7), total=a=>a.reduce((x,e)=>x+ +e.amount,0);
const dateFmt=s=>new Date(s+"T00:00:00").toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"}),monthName=k=>new Date(k+"-01T00:00:00").toLocaleDateString("en-IN",{month:"long",year:"numeric"}), esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
const month=()=>S.expenses.filter(e=>key(e.date)===nowKey()),save=()=>localStorage.setItem("spendwise_state",JSON.stringify(S));
function theme(){document.body.classList.toggle("dark",S.theme==="dark"||(S.theme==="system"&&matchMedia("(prefers-color-scheme:dark)").matches))}
function nav(v){$$(".view").forEach(x=>x.classList.toggle("active",x.id===v));$$(".nav").forEach(x=>x.classList.toggle("active",x.dataset.v===v));$("title").textContent={dashboard:"Dashboard",expenses:"Expenses",budgetView:"Budget Planner",analytics:"Analytics",settings:"Settings"}[v]||"Dashboard";$("sidebar").classList.remove("open");if(v==="analytics")charts()}
function open(id){$(id).classList.add("open")} function close(id){$(id).classList.remove("open")}
function toast(t){let x=$("toast");x.textContent=t;x.classList.add("show");clearTimeout(window.tt);window.tt=setTimeout(()=>x.classList.remove("show"),2200)}
function init(){
 theme();populate();bind();render();
 const h=new Date().getHours();$("greet").textContent=h<12?"GOOD MORNING":h<18?"GOOD AFTERNOON":"GOOD EVENING";$("date").value=off(0);
}
function populate(){
 $("category").innerHTML=Object.keys(C).map(x=>`<option>${x}</option>`).join("");
 $("catFilter").innerHTML='<option value="all">All categories</option>'+Object.keys(C).map(x=>`<option>${x}</option>`).join("");
}
function bind(){
 $$(".nav").forEach(b=>b.onclick=()=>nav(b.dataset.v));$$("[data-j]").forEach(b=>b.onclick=()=>nav(b.dataset.j));
 $("hamb").onclick=()=>$("sidebar").classList.toggle("open");$("addTop").onclick=()=>open("expenseModal");$("add2").onclick=()=>open("expenseModal");
 ["budgetTop","budgetBtn","editBudget"].forEach(id=>$(id).onclick=()=>{$("budgetAmount").value=S.budget;open("budgetModal")});
 $$("[data-close]").forEach(b=>b.onclick=()=>close(b.dataset.close));$$(".modal").forEach(m=>m.onclick=e=>{if(e.target===m)close(m.id)});
 $("expenseForm").onsubmit=e=>{e.preventDefault();S.expenses.unshift({id:Date.now(),amount:+$("amount").value,description:$("desc").value.trim(),category:$("category").value,payment:$("payment").value,date:$("date").value,note:$("note").value.trim()});save();e.target.reset();$("date").value=off(0);close("expenseModal");render();toast("Expense added successfully")};
 $("budgetForm").onsubmit=e=>{e.preventDefault();S.budget=+$("budgetAmount").value||0;save();close("budgetModal");render();toast("Budget updated")};
 ["search","catFilter","monthFilter"].forEach(id=>$(id).oninput=table);$("reset").onclick=()=>{$("search").value="";$("catFilter").value="all";$("monthFilter").value="all";table()};$("range").onchange=charts;
 $("save").onclick=()=>{S.name=$("nameInput").value.trim()||"Alex Student";S.budget=+$("budgetInput").value||0;save();render();toast("Settings saved")};
 $("resetData").onclick=()=>{if(confirm("Reset all data to demo data?")){localStorage.removeItem("spendwise_state");location.reload()}};
 [$("theme"),$("theme2")].forEach(b=>b.onclick=()=>{S.theme=S.theme==="dark"?"light":"dark";save();theme();themeButtons()});
 $$("[data-theme]").forEach(b=>b.onclick=()=>{S.theme=b.dataset.theme;save();theme();themeButtons()});themeButtons();$("export").onclick=csv;
}
function themeButtons(){$$("[data-theme]").forEach(b=>b.classList.toggle("active",b.dataset.theme===S.theme))}
function render(){
 let e=month(),sp=total(e),left=Math.max(S.budget-sp,0),p=S.budget?Math.min(sp/S.budget*100,100):0,name=S.name||"Alex Student";
 $("heroName").textContent=name.split(" ")[0];$("sideName").textContent=name;$("sideAvatar").textContent=name[0].toUpperCase();$("topAvatar").textContent=name[0].toUpperCase();$("month").textContent=monthName(nowKey());$("analyticsMonth").textContent=monthName(nowKey());
 $("spent").textContent=money(sp);$("budget").textContent=money(S.budget);$("remain").textContent=money(left)+" remaining";$("avg").textContent=money(sp/Math.max(new Date().getDate(),1));$("count").textContent=e.length;
 $("pct").textContent=Math.round(p)+"%";$("spent2").textContent=money(sp);$("remain2").textContent=money(left);$("pageBudget").textContent=money(S.budget);$("pageSpent").textContent=money(sp);$("pageRemain").textContent=money(left);$("circlePct").textContent=Math.round(p)+"%";
 $("bar").style.width=p+"%";$("pageBar").style.width=p+"%";$("circle").style.background=`conic-gradient(var(--p) ${p*3.6}deg,var(--l) ${p*3.6}deg)`;
 [$("bar"),$("pageBar")].forEach(x=>x.className=p>=100?"danger":p>=80?"warn":"");
 let st=$("budgetStatus");st.textContent=p>=100?"Over budget":p>=80?"Watch spending":"On track";st.className="pill "+(p>=100?"danger":p>=80?"warn":"");
 recent();cats();table();budgetCats();insights();charts();months();$("nameInput").value=name;$("budgetInput").value=S.budget;
}
function recent(){$("recent").innerHTML=S.expenses.slice().sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id).slice(0,6).map(e=>`<div class="expense"><div class="expenseicon">${C[e.category]}</div><div><strong>${esc(e.description)}</strong><small>${e.category} · ${dateFmt(e.date)}</small></div><b>${money(e.amount)}</b></div>`).join("")||'<div class="empty">No expenses yet.</div>'}
function cats(){
 let e=month(),sum=total(e),a=Object.keys(C).map(c=>({c,v:total(e.filter(x=>x.category===c))})).filter(x=>x.v).sort((a,b)=>b.v-a.v);
 $("cats").innerHTML=a.length?a.slice(0,5).map(x=>`<div class="catrow"><div class="caticon">${C[x.c]}</div><div><div class="catname">${x.c}</div><div class="catmeta">${Math.round(x.v/sum*100)}% of spending</div></div><b class="catamt">${money(x.v)}</b><div class="minibar"><span style="width:${x.v/sum*100}%"></span></div></div>`).join(""):'<div class="empty">Add an expense to see categories.</div>';
}
function months(){
 let a=[...new Set(S.expenses.map(e=>key(e.date)))].sort().reverse(),old=$("monthFilter").value;
 $("monthFilter").innerHTML='<option value="all">All months</option>'+a.map(m=>`<option value="${m}">${monthName(m)}</option>`).join("");if(a.includes(old))$("monthFilter").value=old;
}
function table(){
 let q=$("search").value.toLowerCase(),c=$("catFilter").value,m=$("monthFilter").value,a=S.expenses.filter(e=>(!q||`${e.description} ${e.category} ${e.payment}`.toLowerCase().includes(q))&&(c==="all"||e.category===c)&&(m==="all"||key(e.date)===m)).sort((x,y)=>y.date.localeCompare(x.date)||y.id-x.id);
 $("result").textContent=a.length+" transaction"+(a.length===1?"":"s");$("empty").classList.toggle("hidden",a.length>0);
 $("tbody").innerHTML=a.map(e=>`<tr><td>${dateFmt(e.date)}</td><td><strong>${esc(e.description)}</strong>${e.note?`<br><small>${esc(e.note)}</small>`:""}</td><td><span class="tag">${C[e.category]} ${e.category}</span></td><td>${e.payment}</td><td><strong>${money(e.amount)}</strong></td><td><button class="del" onclick="del(${e.id})">×</button></td></tr>`).join("");
}
function del(id){if(confirm("Delete this expense?")){S.expenses=S.expenses.filter(e=>e.id!==id);save();render();toast("Expense deleted")}}
function budgetCats(){
 let e=month();$("budgetCats").innerHTML=Object.keys(C).map((c,i)=>{let v=total(e.filter(x=>x.category===c)),guide=S.budget*([.3,.15,.2,.1,.08,.07,.05,.05][i]||.05),p=Math.min(v/Math.max(guide,1)*100,100);return `<div class="budgetcat"><div class="caticon">${C[c]}</div><div><strong>${c}</strong><small>${money(v)} spent · guide ${money(guide)}</small></div><strong>${Math.round(p)}%</strong><div class="bbar"><span style="width:${p}%"></span></div></div>`}).join("");
}
function insights(){
 let e=month(),sum=total(e),a=Object.keys(C).map(c=>({c,v:total(e.filter(x=>x.category===c))})).sort((a,b)=>b.v-a.v),p=S.budget?sum/S.budget*100:0,arr=[];
 if(a[0]?.v)arr.push(["↗",`${a[0].c} is your biggest category`,`You spent ${money(a[0].v)} on ${a[0].c}, about ${Math.round(a[0].v/Math.max(sum,1)*100)}% of your spending.`]);
 arr.push([p>=80?"!":"✓",p>=80?"Budget alert":"You're within budget",p>=80?`You've used ${Math.round(p)}% of your budget. Consider slowing discretionary spending.`:`You have ${money(Math.max(S.budget-sum,0))} remaining this month.`]);
 let food=a.find(x=>x.c==="Food");if(food?.v)arr.push(["⌁","Keep an eye on food",`Food spending is ${money(food.v)} so far. Planning meals can reduce small daily purchases.`]);
 $("insights").innerHTML=arr.map(x=>`<div class="insight"><i>${x[0]}</i><div><strong>${x[1]}</strong><p>${x[2]}</p></div></div>`).join("");
}
function ctx(id){let c=$(id),r=c.getBoundingClientRect(),d=devicePixelRatio||1;c.width=r.width*d;c.height=r.height*d;let x=c.getContext("2d");x.scale(d,d);return[x,r.width,r.height]}
function css(v){return getComputedStyle(document.body).getPropertyValue(v).trim()}
function charts(){line();donut();monthly()}
function line(){
 let [x,w,h]=ctx("lineChart"),n=+$("range").value,arr=[];for(let i=n-1;i>=0;i--){let d=new Date();d.setDate(d.getDate()-i),k=d.toISOString().slice(0,10);arr.push(total(S.expenses.filter(e=>e.date===k)))}let max=Math.max(...arr,100),l=12,r=8,t=18,b=30,cw=w-l-r,ch=h-t-b,pts=arr.map((v,i)=>[l+i*cw/Math.max(n-1,1),t+ch-v/max*ch]);
 x.strokeStyle=css("--l");for(let j=0;j<4;j++){let y=t+ch*j/3;x.beginPath();x.moveTo(l,y);x.lineTo(w-r,y);x.stroke()}x.beginPath();pts.forEach((p,i)=>i?x.lineTo(...p):x.moveTo(...p));x.strokeStyle=css("--p");x.lineWidth=2;x.stroke();
 x.fillStyle=css("--m");x.font="9px Inter";x.textAlign="center";arr.forEach((v,i)=>{if(n<=14||i%5===0||i===n-1)x.fillText(new Date(Date.now()-((n-1-i)*86400000)).getDate(),pts[i][0],h-8)})
}
function donut(){
 let [x,w,h]=ctx("donutChart"),e=month(),a=Object.keys(C).map(c=>({c,v:total(e.filter(z=>z.category===c))})).filter(z=>z.v),sum=total(e);if(!sum){x.fillStyle=css("--m");x.textAlign="center";x.font="12px Inter";x.fillText("Add expenses to see analytics",w/2,h/2);return}
 let st=-Math.PI/2,cx=w/2,cy=h/2,r=Math.min(w,h)*.32,colors=["#6d5dfc","#2fbf8f","#f2b84b","#ef6b7a","#48a6d9","#9b7be8","#6d7b91","#a4adba"];
 a.forEach((z,i)=>{let an=z.v/sum*Math.PI*2;x.beginPath();x.moveTo(cx,cy);x.arc(cx,cy,r,st,st+an);x.closePath();x.fillStyle=colors[i%colors.length];x.fill();st+=an});x.beginPath();x.arc(cx,cy,r*.55,0,7);x.fillStyle=css("--s");x.fill();x.fillStyle=css("--t");x.textAlign="center";x.font="800 19px Inter";x.fillText(money(sum),cx,cy+4);x.font="9px Inter";x.fillStyle=css("--m");x.fillText("total spent",cx,cy+19)
}
function monthly(){
 let [x,w,h]=ctx("monthChart"),arr=[];for(let i=5;i>=0;i--){let d=new Date();d.setMonth(d.getMonth()-i,1),k=d.toISOString().slice(0,7);arr.push({k,v:total(S.expenses.filter(e=>key(e.date)===k))})}let max=Math.max(...arr.map(a=>a.v),100),base=h-30,g=w/arr.length;x.strokeStyle=css("--l");x.beginPath();x.moveTo(15,base);x.lineTo(w-15,base);x.stroke();arr.forEach((a,i)=>{let bw=Math.min(45,g*.5),bh=a.v/max*(base-20),xx=g*i+g/2-bw/2;x.fillStyle=css("--p");x.beginPath();x.roundRect(xx,base-bh,bw,bh,7);x.fill();x.fillStyle=css("--m");x.font="9px Inter";x.textAlign="center";x.fillText(new Date(a.k+"-01").toLocaleDateString("en-IN",{month:"short"}),xx+bw/2,h-8)})}
function csv(){let rows=[["Date","Description","Category","Payment","Amount","Note"],...S.expenses.map(e=>[e.date,e.description,e.category,e.payment,e.amount,e.note])],b=new Blob([rows.map(r=>r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(",")).join("\n")],{type:"text/csv"}),a=document.createElement("a");a.href=URL.createObjectURL(b);a.download="spendwise-expenses.csv";a.click();toast("CSV exported")}
document.addEventListener("DOMContentLoaded",init);