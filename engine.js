/* ENDURANCE simulation: seeded, serialisable, offline; no DOM and no wall-clock dependencies. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./data.js'));else root.Endurance=factory(root.EnduranceData);})(typeof globalThis!=='undefined'?globalThis:this,function(D){
'use strict';
const VERSION=1, STATS=Object.keys(D.STAT_LABELS);
const clamp=(n,lo=0,hi=100)=>Math.min(hi,Math.max(lo,n));
const copy=x=>JSON.parse(JSON.stringify(x));
function fail(msg){throw new Error(msg);}
function random(s){let x=s.rng>>>0;x^=x<<13;x^=x>>>17;x^=x<<5;s.rng=x>>>0;return s.rng/4294967296;}
function between(s,a,b){return a+(b-a)*random(s);}
function average(d){return STATS.reduce((a,k)=>a+d[k],0)/STATS.length;}
function category(d,rep=0){return average(d)>=90&&rep>=82?'Platinum':average(d)>=81&&rep>=57?'Gold':d.age>=30&&rep<30?'Bronze':'Silver';}
function generateDriver(s,index,base,id,cat){const p=D.PEOPLE[index%D.PEOPLE.length];const d={id:id||'d'+index,name:p[0],country:p[1],specialty:p[2],age:cat==='Bronze'?38+(index%14):22+(index%11),category:cat||'Silver'};for(const k of STATS)d[k]=Math.round(clamp(base+between(s,-7,7),42,98));if(/Angreif/.test(d.specialty)){d.pace=clamp(d.pace+7);d.consistency=clamp(d.consistency-6);}if(/Regen/.test(d.specialty))d.wet=clamp(d.wet+10);if(/Nacht/.test(d.specialty))d.night=clamp(d.night+10);if(/Reifen/.test(d.specialty))d.tyre=clamp(d.tyre+10);if(/Team/.test(d.specialty))d.teamwork=clamp(d.teamwork+10);if(/Konstanz/.test(d.specialty))d.consistency=clamp(d.consistency+8);return d;}
function crew(s,index,base,classId){const cats=classId==='Hypercar'?['Gold','Platinum','Gold']:['Bronze','Silver','Gold'];return [0,1,2].map(j=>generateDriver(s,index*3+j,base+(j===0?-3:2),`t${index}-d${j}`,cats[j]));}
function newPrep(){return {used:false,action:null,boost:0,start:0,night:2,finish:0,tyres:'double',qualifying:'balanced',plan:'rotation',interviewed:false};}
function makeRivals(s){const b=D.CLASSES[s.classId].base;return D.TEAMS.slice(1).map((t,i)=>({id:'team'+(i+1),name:t[0],brand:t[1],color:t[2],quality:clamp(b+between(s,-3,9),55,96),reliability:between(s,76,96),pitCrew:between(s,67,95),morale:80,drivers:crew(s,i+1,b+between(s,-4,6),s.classId)}));}
function newChampionship(s){s.championship={teams:[s.team,...s.rivals].map(t=>({id:t.id,name:t.name,color:t.color,points:0,wins:0,podiums:0,finishes:[],own:t.id==='own'})),drivers:[s.team,...s.rivals].flatMap(t=>t.drivers.map(d=>({id:d.id,name:d.name,country:d.country,teamId:t.id,team:t.name,category:d.category,points:0,wins:0,podiums:0,finishes:[],own:t.id==='own',player:d.id==='player'})))};}
function createCareer(o={}){
 const role=o.role||'driver',mode=o.mode||'quick',classId=o.scenario==='lemans'?'Hypercar':role==='driver'?'GT4':o.classId||'GT4';
 if(!['driver','manager'].includes(role)||!['quick','standard'].includes(mode)||!D.CLASSES[classId])fail('Ungültiger Karrierestart.');
 const s={version:VERSION,rng:(Number(o.seed)||628719)>>>0,role,mode,classId,season:1,year:2027,round:0,phase:'preparation',reputation:o.scenario==='lemans'?75:18,money:12000,player:null,team:null,rivals:[],calendar:D.calendar(classId),championship:null,prep:newPrep(),race:null,history:[],archive:[],news:[],achievements:[],sponsorPicked:false,scenario:o.scenario==='lemans'?'lemans':null};
 const age=clamp(Math.round(Number(o.age)||21),16,70),b=D.CLASSES[classId].base;
 s.player={id:'player',name:String(o.name||'Mario Trefflinger').trim().slice(0,40)||'Mario Trefflinger',country:['AT','DE','CH','IT','FR','GB','HR','US'].includes(o.country)?o.country:'AT',age,category:age>=30?'Bronze':'Silver',specialty:'Dein eigener Weg',pace:b+1,consistency:b+5,wet:b,night:b+3,tyre:b+3,teamwork:b+6};
 if(o.scenario==='lemans')s.player.category='Gold';
 let drivers=crew(s,0,b,classId);if(role==='driver'){drivers=[copy(s.player),generateDriver(s,1,b+3,'crew-b','Bronze'),generateDriver(s,3,b+5,'crew-c','Silver')];}
 const tier=['academy','balanced','front'].includes(o.teamStyle)?o.teamStyle:'balanced';
 s.team={id:'own',name:String(o.teamName||(tier==='academy'?'Alpenwerk Academy':tier==='front'?'Alpenwerk Performance':'Alpenwerk Racing')).trim().slice(0,40)||'Alpenwerk Racing',brand:'Nordwerk',color:'#71d6b3',quality:b+(tier==='front'?6:tier==='academy'?-3:1),reliability:tier==='academy'?80:87,pitCrew:tier==='front'?88:76,morale:78,affinity:40,budget:Math.round(D.CLASSES[classId].budget*(tier==='front'?.72:1)),drivers,sponsor:'steady',upgrades:{quality:0,reliability:0,pitCrew:0}};
 s.rivals=makeRivals(s);newChampionship(s);
 if(s.scenario){s.calendar=[{...D.calendar('Hypercar').find(e=>e.id==='lemans'),round:1}];s.news.push({title:'Die 24h-Challenge',text:'Ein eigenständiger Le-Mans-Spielstand. Keine Auswirkungen auf andere Speicherplätze.'});}
 s.news.push({title:'Willkommen bei '+s.team.name,text:role==='driver'?'Deine Leistungen zählen im Kontext des Autos. Ihr gewinnt und verliert zusammen.':'Du verantwortest Fahrer, Budget und jedes Rennkapitel. Ein Auto. Ein gemeinsames Ergebnis.'});
 return s;
}
function ownCar(s){return s.race?.cars.find(c=>c.own)||null;}
function event(s){return s.calendar[s.round]||null;}
function carLabel(s){return s.team.brand+' '+(s.classId==='Hypercar'?'H-01':s.classId);}
function prepare(s,action){if(s.phase!=='preparation'||s.race)fail('Vorbereitung ist nur vor dem Rennen möglich.');if(s.prep.used)fail('Deine Wochenend-Vorbereitung ist bereits abgeschlossen.');
 const driverActions=['pace','wet','night','tyre','teamwork','rest'],managerActions=['setup','pitdrill','reliability','teamwork'];
 if(!(s.role==='driver'?driverActions:managerActions).includes(action))fail('Diese Vorbereitung ist nicht verfügbar.');
 s.prep.used=true;s.prep.action=action;
 if(s.role==='driver'){if(action==='rest'){s.prep.boost=2;}else{const amount=action==='teamwork'?2.2:1.7;s.player[action]=clamp(s.player[action]+amount,0,99);if(action==='teamwork')s.team.morale=clamp(s.team.morale+5);const d=s.team.drivers.find(d=>d.id==='player');if(d)d[action]=s.player[action];s.prep.boost=1;}}
 else {s.prep.boost=action==='setup'?3:1;if(action==='teamwork')s.team.morale=clamp(s.team.morale+6);}
 return s;
}
function setPlan(s,opts){if(s.phase!=='preparation'||s.race)fail('Der Plan ist für dieses Rennen bereits aktiv.');const allowed={start:[0,1,2],night:[0,1,2],finish:[0,1,2],tyres:['fresh','double'],qualifying:['safe','balanced','attack'],plan:['rotation','conditions']};for(const [k,v]of Object.entries(opts)){if(!allowed[k]?.includes(v))fail('Ungültiger Stintplan.');}Object.assign(s.prep,opts);return s;}
function lineupValid(drivers,classId,lmgt3=false){if(drivers.length!==3||new Set(drivers.map(d=>d.id)).size!==3)return false;if(classId==='GT3'&&lmgt3)return drivers.some(d=>d.category==='Bronze')&&drivers.filter(d=>['Gold','Platinum'].includes(d.category)).length<=1;if(classId==='LMP2'||classId==='LMP3')return drivers.some(d=>['Bronze','Silver'].includes(d.category));return true;}
function candidates(s){const dummy={rng:(s.season*3779+s.round*227+1883)>>>0};return [0,1,2,3,4,5].map((x)=>{const cat=['Bronze','Silver','Gold','Silver','Platinum','Bronze'][x];const d=generateDriver(dummy,(s.season*7+x+18)%D.PEOPLE.length,D.CLASSES[s.classId].base+(cat==='Platinum'?11:cat==='Gold'?6:cat==='Bronze'?-4:0),'market-'+s.season+'-'+s.round+'-'+x,cat);d.price=Math.round((16000+(average(d)-55)*1100)*D.CLASSES[s.classId].scale);return d;});}
function hire(s,id,slot){if(s.role!=='manager'||s.phase!=='preparation'||s.race)fail('Fahrer können nur als Manager vor dem Rennen verpflichtet werden.');if(![0,1,2].includes(slot))fail('Ungültiger Fahrerplatz.');const d=candidates(s).find(d=>d.id===id);if(!d)fail('Das Angebot ist nicht mehr verfügbar.');if(s.team.drivers.some(x=>x.id===id))fail('Dieser Fahrer ist bereits im Team.');if(s.team.budget<d.price)fail('Dafür reicht dein Budget nicht.');const proposed=copy(s.team.drivers);proposed[slot]=copy(d);if(!lineupValid(proposed,s.classId,s.classId==='GT3'))fail('Diese Besetzung passt nicht: GT3 benötigt für Le Mans einen Bronze-Fahrer und maximal einen Gold/Platin-Fahrer; Prototypen einen Bronze/Silber-Fahrer.');s.team.budget-=d.price;s.team.drivers=proposed;if(!s.championship.drivers.some(x=>x.id===d.id))s.championship.drivers.push({id:d.id,name:d.name,country:d.country,category:d.category,teamId:'own',team:s.team.name,points:0,wins:0,podiums:0,finishes:[],own:true,player:false});addNews(s,'Neuverpflichtung',d.name+' übernimmt Cockpit '+(slot+1)+'.');return s;}
function upgradeCost(s,key){return Math.round((22000+13000*(s.team.upgrades[key]||0))*D.CLASSES[s.classId].scale);}
function develop(s,key){if(s.role!=='manager'||s.phase!=='preparation'||s.race)fail('Entwicklung ist nur als Manager zwischen Rennen möglich.');if(!['quality','reliability','pitCrew'].includes(key))fail('Unbekannter Entwicklungsbereich.');const cost=upgradeCost(s,key);if(s.team[key]>=96)fail('Dieser Bereich ist bereits auf Spitzenniveau.');if(s.team.budget<cost)fail('Dafür reicht das Team-Budget nicht.');s.team.budget-=cost;s.team[key]=clamp(s.team[key]+3,0,97);s.team.upgrades[key]++;return s;}
function chooseSponsor(s,id){if(s.phase!=='preparation'||s.race||s.sponsorPicked)fail('Der Saisonpartner ist bereits festgelegt.');if(!D.SPONSORS.some(x=>x.id===id))fail('Unbekannter Partner.');s.team.sponsor=id;s.sponsorPicked=true;return s;}
function weatherPlan(s,e){const n=Math.ceil(e.minutes/30)+2,arr=Array(n).fill(0);if(random(s)<(e.rain||.3)*.6)arr[0]=35;if(e.minutes>=180||random(s)<(e.rain||.3)){const begin=Math.max(1,Math.floor(between(s,.22,.58)*n)),len=Math.max(1,Math.floor(n*between(s,.13,.3)));for(let i=begin;i<Math.min(n,begin+len);i++)arr[i]=(i===begin||i===begin+len-1)?35:80;}if(e.minutes>=720&&random(s)<.65){const begin=Math.floor(n*.75);for(let i=begin;i<Math.min(n,begin+3);i++)arr[i]=i===begin?35:75;}return arr;}
function getWeather(r,at=r.elapsed){return r.weatherPlan[Math.min(r.weatherPlan.length-1,Math.floor(at/30))]||0;}
function isNight(r,at=r.elapsed){const hour=(r.event.startHour+at/60)%24;return hour<6||hour>=21;}
function timeOfDay(r){const hour=(r.event.startHour+r.elapsed/60)%24;return hour<6||hour>=21?'Nacht':hour<8?'Morgengrauen':hour>=18?'Abend':'Tag';}
function activeDrivers(s,r){const count=r.event.minutes<=180?2:3;const order=[s.prep.start,...[0,1,2].filter(i=>i!==s.prep.start)];if(count===2&&s.role==='driver'&&!order.slice(0,2).some(i=>s.team.drivers[i].id==='player'))order[1]=s.team.drivers.findIndex(d=>d.id==='player');return order.slice(0,count);}
function makeCar(s,t,classId,own,r,index){const active=own?activeDrivers(s,r):r.event.minutes<=180?[0,1]:[0,1,2];const c={teamId:t.id,name:t.name,brand:t.brand,color:t.color||'#aab8b5',number:own?10:21+index*3,classId,own,drivers:copy(t.drivers),quality:t.quality,reliability:t.reliability,pitCrew:t.pitCrew,morale:t.morale||80,progress:0,fuel:100,tyres:100,compound:getWeather(r)>40?'wet':'slick',damage:0,driver:active[0],active,fatigue:[0,0,0],driveMinutes:[0,0,0],stint:0,stops:0,pendingPit:0,status:'running',errors:0,repairTime:0,pitTime:0,lastLap:0,lastManual:-1,paceOrder:'balanced',bestLap:null,contacts:0};return c;}
function startRace(s){if(s.phase!=='preparation'||s.race)fail('Dieses Rennen wurde bereits gestartet.');const e=event(s);if(!e)fail('Für diese Saison sind keine Rennen mehr offen.');if(!lineupValid(s.team.drivers,s.classId,!!e.lmgt3))fail('Die Fahrerbesetzung ist für dieses Rennen nicht zulässig.');
 const decisionMinutes=s.mode==='quick'?(e.minutes>=360?60:20):(e.minutes>=360?30:10);
 const r={event:copy(e),elapsed:0,decisionMinutes,decisions:0,weatherPlan:weatherPlan(s,e),cars:[],finished:false,result:null,prompt:null,log:[],neutralUntil:0,flag:'green',lastCondition:0,bonus:0,qualifying:[],lastAction:'',lastSummary:null};
 r.cars=[s.team,...s.rivals].map((t,i)=>makeCar(s,t,s.classId,i===0,r,i));
 if(e.multiclass){const extra=s.classId==='Hypercar'?(e.id==='lemans'?['LMP2','GT3']:['GT3']):s.classId==='GT3'?(e.id==='lemans'?['Hypercar','LMP2']:['GT4']):s.classId==='LMP2'?(e.id==='lemans'?['Hypercar','GT3']:['LMP3','GT3']):['LMP2','GT3'];for(const cl of extra){for(let i=0;i<4;i++){const n=D.TEAMS[(i+4)%D.TEAMS.length];const t={id:'guest-'+cl+i,name:n[0]+' '+cl,brand:n[1],color:D.CLASSES[cl].color,quality:D.CLASSES[cl].base+between(s,-2,5),reliability:88,pitCrew:82,drivers:crew(s,i+1,D.CLASSES[cl].base,cl)};r.cars.push(makeCar(s,t,cl,false,r,r.cars.length));}}}
 for(const c of r.cars){let q=D.CLASSES[c.classId].lap*e.factor+(82-c.drivers[c.driver].pace)*.12+(80-c.quality)*.075+between(s,-.75,.75);if(c.own){q-=s.prep.boost*.1;if(s.prep.qualifying==='safe')q+=.28;if(s.prep.qualifying==='attack'){q-=.40;if(random(s)<.2){q+=2;log(r,'Qualifying','Die aggressive Runde wurde durch einen Fehler teuer.','warning');}}}c.qualifyingLap=q;}
 const grid=[...r.cars].sort((a,b)=>a.qualifyingLap-b.qualifyingLap);grid.forEach((c,i)=>c.progress=-(i*1.5)/(D.CLASSES[c.classId].lap*e.factor));
 r.qualifying=grid.map((c,i)=>({name:c.name,own:c.own,classId:c.classId,overall:i+1,time:c.qualifyingLap}));
 s.race=r;s.phase='race';log(r,'Grüne Flagge',s.team.drivers[ownCar(s).driver].name+' startet. Die Mannschaft übernimmt automatisch notwendige Tankstopps und geplante Fahrerwechsel.','good');r.prompt=makePrompt(s);return s;
}
function log(r,title,text,kind='info'){r.log.push({at:r.elapsed,title,text,kind});if(r.log.length>110)r.log.splice(0,r.log.length-110);}
function addNews(s,title,text){s.news.unshift({title,text});s.news=s.news.slice(0,18);}
function chooseNextDriver(s,r,c){const desired=c.active,remaining=r.event.minutes-r.elapsed,maxStint=Math.min(70,r.event.minutes/desired.length);
 let next=desired[(desired.indexOf(c.driver)+1)%desired.length];
 if(c.own&&s.prep.plan==='conditions'){
  if(remaining<=maxStint+5&&desired.includes(s.prep.finish)&&c.fatigue[s.prep.finish]<65)next=s.prep.finish;
  else if(isNight(r)&&desired.includes(s.prep.night)&&c.fatigue[s.prep.night]<40)next=s.prep.night;
  else if(getWeather(r)>40)next=[...desired].filter(i=>c.fatigue[i]<65).sort((a,b)=>c.drivers[b].wet-c.drivers[a].wet)[0]??next;
 }
 // Never omit a mandatory active driver or leave one driver in for the entire race.
 const unused=desired.filter(i=>c.driveMinutes[i]===0&&i!==c.driver);
 if(unused.length&&remaining<=maxStint*(unused.length+1)+5)next=unused[0];
 if(next===c.driver&&c.stint>=maxStint)next=[...desired].filter(i=>i!==c.driver).sort((a,b)=>c.fatigue[a]-c.fatigue[b])[0]??next;
 return next;
}
function service(s,r,c,opts={},automatic=false){
 const driver=opts.driver===undefined?c.driver:opts.driver,tyres=opts.tyres||'keep',repair=opts.repair||'none';
 if(!c.active.includes(driver))fail('Dieser Fahrer ist bei diesem Rennen Reserve.');
 if(!['keep','slick','wet'].includes(tyres)||!['none','quick','full'].includes(repair))fail('Ungültiger Boxenauftrag.');
 let seconds=24+(100-c.fuel)*.36+Math.max(0,85-c.pitCrew)*.4;
 if(c.own&&s.prep.action==='pitdrill')seconds-=4;
 c.fuel=100;if(tyres!=='keep'){c.tyres=100;c.compound=tyres;seconds+=18;}
 if(driver!==c.driver){seconds+=7;c.driver=driver;c.stint=0;}
 if(repair!=='none'){const amount=repair==='full'?c.damage:Math.min(c.damage,14);const rt=amount*2+8;c.damage=clamp(c.damage-amount);c.repairTime+=rt;seconds+=rt;}
 if(r.flag!=='green')seconds*=.62;
 c.pendingPit+=seconds;c.pitTime+=seconds;c.stops++;
 if(c.own)log(r,automatic?'Boxenstopp · Teamplan':'Boxenstopp · deine Entscheidung',`${c.drivers[driver].name} übernimmt / bleibt. ${tyres==='keep'?'Reifen bleiben am Auto':tyres==='wet'?'Regenreifen':'Neue Slicks'} · ${Math.round(seconds)} s Stand- und Boxenverlust${repair!=='none'?' · Reparatur':''}.`,'pit');
 return seconds;
}
function pit(s,opts={}){if(s.phase!=='race'||!s.race||s.race.finished)fail('Kein laufendes Rennen.');const c=ownCar(s);if(c.status!=='running')fail('Das Auto ist ausgefallen.');if(c.lastManual===s.race.decisions)fail('Für dieses Rennkapitel ist der Boxenauftrag bereits erledigt.');service(s,s.race,c,opts);c.lastManual=s.race.decisions;return s;}
function ranked(r,classId){return [...r.cars].filter(c=>!classId||c.classId===classId).sort((a,b)=>(a.status==='dnf')-(b.status==='dnf')||b.progress-a.progress);}
function standings(s){const sort=(a,b)=>b.points-a.points||b.wins-a.wins||b.podiums-a.podiums||bestFinish(a)-bestFinish(b)||a.name.localeCompare(b.name);return {teams:[...s.championship.teams].sort(sort),drivers:[...s.championship.drivers].sort(sort)};}
function bestFinish(x){return x.finishes.length?Math.min(...x.finishes):99;}
function racePosition(s){const r=s.race,c=ownCar(s);return ranked(r,s.classId).indexOf(c)+1;}
function forecast(s){const r=s.race,now=getWeather(r);for(let m=30;m<=90;m+=30){const val=getWeather(r,r.elapsed+m);if(val!==now)return {minutes:m,wet:val,text:val>40?'Regen wahrscheinlich':val>0?'Leichte Nässe erwartet':'Abtrocknende Strecke'};}return {minutes:90,wet:now,text:now>40?'Regen bleibt voraussichtlich':now>0?'Wechselhafte Bedingungen':'Vorerst trockene Strecke'};}
function makePrompt(s){const r=s.race,c=ownCar(s),d=c.drivers[c.driver],remaining=r.event.minutes-r.elapsed,weather=getWeather(r);let kind='pace';
 if(c.status==='dnf')return {kind:'retired',title:'Das Rennen geht ohne euch weiter.',text:'Die Mannschaft analysiert den Ausfall. Die übrigen Fahrzeuge fahren um ihre Punkte.'};
 if(c.damage>=12)kind='damage';
 else if((weather>=60&&c.compound==='slick')||(weather===0&&c.compound==='wet'))kind='weather';
 else if(r.flag!=='green')kind='safety';
 else if(s.role==='driver'&&d.id!=='player')kind='rest';
 else if(remaining<=Math.max(60,r.decisionMinutes)&&r.elapsed>0)kind='final';
 else if(r.elapsed===0)kind='start';
 else {const kinds=['pace','duel','traffic','tyres','night','pressure'];kind=kinds[(r.decisions+s.round)%kinds.length];if(kind==='traffic'&&!r.event.multiclass)kind='duel';if(kind==='night'&&!isNight(r))kind='pace';}
 const texts={
 start:['Die erste Kurve ist nur der Anfang.',`${d.name} startet für euch. Positionen gewinnen – oder das Auto für die lange Distanz schützen?`],
 pace:['Finde euren Rhythmus.',`${d.name} liegt auf Klassenposition ${racePosition(s)}. Tempo, Material und Konzentration müssen zusammenpassen.`],
 duel:['Der nächste Gegner ist in Reichweite.',`${d.name} meldet eine mögliche Überholchance. Ein Versuch kostet Reifen und erhöht das Fehlerrisiko.`],
 traffic:['Mehrere Klassen. Ein Stück Asphalt.',s.classId==='Hypercar'?'Eine Gruppe GT-Fahrzeuge liegt vor euch. Der Zeitgewinn darf nicht auf Kosten des gemeinsamen Autos gehen.':'Schnellere Prototypen nähern sich. Vorhersehbar bleiben oder Zeit mit einem riskanten Manöver suchen?'],
 tyres:['Was hinterlässt du dem nächsten Fahrer?',`Die Reifen haben noch ${Math.round(c.tyres)} % Reserve. Ein sauberer Stint hilft auch dem Teamkollegen nach dir.`],
 night:['Die Nacht gehört den Konzentrierten.',`${d.name} fährt unter Flutlicht und Scheinwerfern. Müdigkeit und die Nachtstärke beeinflussen jede Runde.`],
 pressure:['Das Team wartet auf deine Haltung.',`Das Rennen bleibt offen. Ihr liegt auf P${racePosition(s)}. Wie viel Risiko ist die aktuelle Situation wert?`],
 final:['Jetzt zählt, was noch im Auto steckt.',`Noch ${Math.round(remaining)} Minuten. ${d.name} muss den gemeinsamen Einsatz ins Ziel bringen.`],
 damage:['Ein beschädigtes Auto wechselt nicht von selbst.',`${Math.round(c.damage)} % Schaden kosten jede Runde Zeit. Eine Reparatur hilft allen folgenden Fahrern, kostet aber sofort Positionen.`],
 weather:['Das Wetter verändert den Plan.',`${weather>=60?'Die Strecke ist nass':'Die Strecke trocknet ab'}, ihr fahrt auf ${c.compound==='wet'?'Regenreifen':'Slicks'}. Das richtige Fenster zählt.`],
 safety:['Die Rennleitung neutralisiert.',`${r.flag==='sc'?'Safety Car':'Full Course Yellow'}: Das Feld wird langsamer. Ein Stopp kostet in diesem vereinfachten Regelprofil weniger Zeit.`],
 rest:['Dein Teamkollege fährt. Du bleibst Teil des Teams.',`${d.name} übernimmt das Auto mit ${Math.round(c.tyres)} % Reifenreserve und ${Math.round(c.damage)} % Schaden. Seine Fähigkeiten bestimmen jetzt den Stint.`]
 };return {kind,title:texts[kind][0],text:texts[kind][1]};
}
function choices(s){if(!s.race||s.race.finished)return [];const r=s.race,c=ownCar(s),kind=r.prompt.kind;const a=(id,title,desc,tag)=>({id,title,desc,tag});
 if(kind==='retired')return [a('review','Stints auswerten','Du lernst aus dem Ausfall; die übrigen Fahrzeuge fahren bis zur Zielflagge.','Analyse'),a('support','Bei der Mannschaft bleiben','Rückhalt für die nächste gemeinsame Chance.','Teamwork')];
 if(kind==='rest')return [a('rest','Regenerieren','Deine Ermüdung sinkt zusätzlich. Der Teamkollege fährt mit eigenem Stil.','Frischer nächster Stint'),a('analyse','Telemetrie besprechen','Ein kleiner Vorbereitungsvorteil für deinen nächsten Einsatz.','Lernen'),a('support','Teamkollegen stärken','Bessere Stimmung und Zusammenarbeit. Seine Pace bleibt seine Leistung.','Vertrauen')];
 if(kind==='damage')return [a('repair','Vollständig reparieren','Schaden entfernen, Reifen erneuern; der Stopp kostet Zeit.','Langfristig sicher'),a('patch','Schnelle Reparatur','Bis zu 14 Schadenspunkte reparieren; Reifen weiterverwenden.','Kompromiss'),a('balanced','Mit dem Schaden weiter','Kein zusätzlicher Stopp. Zeitverlust und Folgerisiko bleiben.','Position halten')];
 if(kind==='weather')return [a('weather','Auf passende Reifen wechseln','Ein zusätzlicher Stopp, dafür wieder mehr Grip.','Wetter annehmen'),a('conserve','Vorsichtig draußen bleiben','Reifen schonen und bis zum nächsten geplanten Stopp warten.','Risiko begrenzen'),a('push','Auf ein Wetterfenster setzen','Weiter angreifen. Falsche Reifen bleiben langsam und riskant.','Hohes Risiko')];
 if(kind==='safety')return [a('safetypit','Das günstigere Boxenfenster nutzen','Auftanken, passende neue Reifen und ein frischer Fahrer.','Strategie'),a('balanced','Die Position behalten','Kein Extra-Stopp. Der nächste Tankstopp bleibt nötig.','Streckenposition'),a('conserve','Ressourcen schonen','Mehr Reserve für die Phase nach der Freigabe.','Langstrecke')];
 return [a('push',kind==='final'?'Alles für das Ergebnis':kind==='traffic'?'Die Lücke konsequent nutzen':'Angreifen','Mehr Tempo, aber höherer Verbrauch, Verschleiß und Fehlerrisiko.','Tempo ↑ · Risiko ↑'),a('balanced',kind==='traffic'?'Vorhersehbar und sauber bleiben':'Den Rhythmus halten','Ausgewogene Pace. Fähigkeiten und Bedingungen geben den Ausschlag.','Ausgewogen'),a('conserve',kind==='tyres'?'Gute Reifen weitergeben':'Material und Kräfte schonen','Etwas langsamer, dafür weniger Reifenverschleiß, Verbrauch und Fehler.','Reserven ↑')];
}
function skill(c,r){const d=c.drivers[c.driver],wet=getWeather(r)>35,night=isNight(r);return (d.pace*.46+d.consistency*.17+d.tyre*.10+d.teamwork*.05+(wet?d.wet:d.pace)*.12+(night?d.night:d.consistency)*.10);}
function tick(s,r,dt,order){
 const previousWeather=getWeather(r,r.elapsed-.01),wet=getWeather(r);if(previousWeather!==wet)log(r,'Wetterwechsel',wet>=60?'Regen setzt ein. Die Reifenwahl wird wichtig.':wet>0?'Die Strecke ist feucht.':'Die Ideallinie trocknet ab.','weather');
 if(r.neutralUntil<=r.elapsed){if(r.flag!=='green'){r.flag='green';log(r,'Freie Fahrt','Die Rennleitung gibt das Rennen wieder frei.','good');}if(random(s)<dt/60*.16&&r.elapsed>15&&r.event.minutes-r.elapsed>10){r.flag=random(s)<.45?'sc':'fcy';r.neutralUntil=r.elapsed+between(s,10,20);log(r,r.flag==='sc'?'Safety Car':'Full Course Yellow','Ein Zwischenfall im Feld neutralisiert das Rennen. Boxenverluste sind vorübergehend kleiner.','warning');}}
 for(const c of r.cars){if(c.status!=='running')continue;
  const maxStint=Math.min(70,r.event.minutes/c.active.length),needsDriver=c.stint>=maxStint-.01&&r.event.minutes-r.elapsed>5;
  if(c.fuel<10||needsDriver||c.damage>65){let next=needsDriver?chooseNextDriver(s,r,c):c.driver;const suitable=wet>=50?'wet':'slick';const replace=c.tyres<42||c.compound!==suitable||(c.own?s.prep.tyres==='fresh':c.stops%2===0);service(s,r,c,{driver:next,tyres:replace?suitable:'keep',repair:c.damage>40?'full':'none'},true);}
  let command;
  if(c.own&&(s.role==='manager'||c.drivers[c.driver].id==='player'))command=order;
  else command=/Angreif/.test(c.drivers[c.driver].specialty)&&c.tyres>35?'push':/Reifen/.test(c.drivers[c.driver].specialty)?'conserve':'balanced';
  if(!['push','balanced','conserve'].includes(command))command='balanced';c.paceOrder=command;
  const aggression=command==='push'?1:command==='conserve'?-1:0;
  const mismatched=(wet>=60&&c.compound==='slick')||(wet===0&&c.compound==='wet');
  let lap=D.CLASSES[c.classId].lap*r.event.factor+(82-skill(c,r))*.145+(80-c.quality)*.085+c.damage*.075+(100-c.tyres)*.019+c.fatigue[c.driver]*.026-aggression*.92;
  if(wet)lap+=wet*.055;if(mismatched)lap+=wet>=60?8.5:4.8;
  if(c.own){lap-=s.prep.boost*.10;if(s.prep.action==='reliability')lap-=.03;if(c.drivers[c.driver].id==='player'&&r.bonus>0){lap-=.45;r.bonus=Math.max(0,r.bonus-dt);}}
  if(r.flag!=='green')lap*=r.flag==='sc'?2.4:1.9;
  lap=Math.max(40,lap+between(s,-.12,.12));c.lastLap=lap;if(r.flag==='green'&&!mismatched)c.bestLap=Math.min(c.bestLap||Infinity,lap);
  const errorChance=dt/60*(.006+(100-c.drivers[c.driver].consistency)*.0008+Math.max(0,c.fatigue[c.driver]-55)*.0011+(aggression===1?.030:aggression===-1?-.008:0)+(mismatched?.035:0));
  if(random(s)<Math.max(.0001,errorChance)){const loss=between(s,4,22),damage=between(s,3,18)*(aggression===1?1.35:1);c.pendingPit+=loss;c.damage=clamp(c.damage+damage);c.errors++;if(c.own)log(r,c.drivers[c.driver].name+' · Fehler',`Ein Ausrutscher kostet ${Math.round(loss)} Sekunden und hinterlässt ${Math.round(damage)} % zusätzlichen Schaden. Der nächste Fahrer übernimmt dieses Auto.`,'warning');}
  const effectiveReliability=c.reliability+(c.own&&s.prep.action==='reliability'?4:0);
  if(random(s)<dt/60*(100-effectiveReliability)*.00023){const damage=between(s,7,18);c.damage=clamp(c.damage+damage);if(c.own)log(r,'Technische Warnung','Vibrationen und Leistungsabfall: Die Haltbarkeit hat eine neue Reparaturentscheidung erzeugt.','warning');}
  if(c.damage>=99){c.status='dnf';if(c.own)log(r,'Ausfall','Das Auto kann nicht weiterfahren. Die Karriere geht nach diesem Rückschlag weiter.','danger');continue;}
  const lost=Math.min(dt*60,c.pendingPit);c.pendingPit-=lost;c.progress+=(dt*60-lost)/lap;
  c.fuel=clamp(c.fuel-dt*(1.2+aggression*.09));c.tyres=clamp(c.tyres-dt*(.36+aggression*.095)*(1+(100-c.drivers[c.driver].tyre)/150)*(mismatched?1.45:1));
  c.stint+=dt;c.driveMinutes[c.driver]+=dt;c.fatigue=c.fatigue.map((f,i)=>clamp(f+dt*(i===c.driver?.32+aggression*.04:-.52)));
 }
 r.elapsed=Math.min(r.event.minutes,r.elapsed+dt);
}
function choose(s,id){if(!s.race||s.race.finished||s.phase!=='race')fail('Kein offenes Rennkapitel.');const available=choices(s);if(!available.some(c=>c.id===id))fail('Diese Entscheidung ist nicht verfügbar.');const r=s.race,c=ownCar(s);const before={position:racePosition(s),tyres:c.tyres,damage:c.damage,driver:c.drivers[c.driver].name,at:r.elapsed};let order=['push','balanced','conserve'].includes(id)?id:'balanced';
 if(['repair','patch','weather','safetypit'].includes(id)&&c.lastManual!==r.decisions){const newDriver=id==='safetypit'?chooseNextDriver(s,r,c):c.driver;pit(s,{driver:newDriver,tyres:id==='patch'?'keep':getWeather(r)>=50?'wet':'slick',repair:id==='repair'?'full':id==='patch'?'quick':'none'});}
 if(id==='rest'){const p=c.drivers.findIndex(d=>d.id==='player');if(p>=0)c.fatigue[p]=clamp(c.fatigue[p]-12);}
 if(id==='analyse'||id==='review')r.bonus+=35;
 if(id==='support'){c.morale=clamp(c.morale+2);s.team.morale=clamp(s.team.morale+1);c.drivers.forEach(d=>d.teamwork=clamp(d.teamwork+.25,0,99));}
 if(['conserve','balanced','push'].includes(id)&&r.prompt.kind==='pressure')s.team.morale=clamp(s.team.morale+(id==='conserve'?1:0));
 r.lastAction=available.find(x=>x.id===id).title;
 const target=Math.min(r.event.minutes,r.elapsed+r.decisionMinutes);
 while(r.elapsed<target)tick(s,r,Math.min(5,target-r.elapsed),order);
 r.decisions++;
 r.lastSummary={from:before.at,to:r.elapsed,fromPosition:before.position,position:racePosition(s),tyreChange:c.tyres-before.tyres,damageChange:c.damage-before.damage,driver:before.driver,title:r.lastAction};
 if(r.elapsed>=r.event.minutes)finishRace(s);else r.prompt=makePrompt(s);
 return s;
}
function finishRace(s){const r=s.race;if(r.finished)return;const c=ownCar(s),classOrder=ranked(r,s.classId),position=classOrder.indexOf(c)+1,overall=ranked(r).indexOf(c)+1,finish=c.status!=='dnf';
 const qualified=classOrder.filter(c=>c.status!=='dnf');
 classOrder.forEach((car,i)=>{const points=car.status==='dnf'?0:(D.POINTS[i]||0)*(r.event.pointsMultiplier||1);const t=s.championship.teams.find(t=>t.id===car.teamId);if(t){t.points+=points;t.wins+=i===0&&car.status!=='dnf'?1:0;t.podiums+=i<3&&car.status!=='dnf'?1:0;t.finishes.push(car.status==='dnf'?99:i+1);}car.drivers.forEach((d,di)=>{if(car.driveMinutes[di]<=0)return;const row=s.championship.drivers.find(x=>x.id===d.id);if(row){row.points+=points;row.wins+=i===0&&car.status!=='dnf'?1:0;row.podiums+=i<3&&car.status!=='dnf'?1:0;row.finishes.push(car.status==='dnf'?99:i+1);}});});
 const expected=clamp(6-Math.round((s.team.quality-D.CLASSES[s.classId].base)*.45),1,10),repGain=finish?clamp(3+(expected-position)*.65+(position<=3?2:0),1,8):.5;s.reputation=clamp(s.reputation+repGain);
 const personal=c.drivers.findIndex(d=>d.id==='player');if(s.role==='driver'&&personal>=0){const growth=Math.min(1.0,.25+c.driveMinutes[personal]/500);for(const k of STATS)s.player[k]=clamp(s.player[k]+growth,0,99);syncPlayer(s);}
 const sponsor=D.SPONSORS.find(x=>x.id===s.team.sponsor);const scale=D.CLASSES[s.classId].scale;const sponsorBonus=finish&&position<=sponsor.target?sponsor.bonus:0;const income=Math.round((sponsor.base+sponsorBonus+(finish?(11-position)*2200:1000))*scale),expenses=Math.round((12500+c.damage*190)*scale),net=income-expenses;
 s.team.budget+=net;s.money+=Math.round((finish?1200+Math.max(0,8-position)*260:400)*scale);s.team.affinity=clamp(s.team.affinity+(finish?2:0)+(position<=3?2:0));s.team.morale=clamp(s.team.morale+(finish?position<=3?5:1:-5));
 if(s.team.budget<12000*scale){s.team.budget+=30000*scale;addNews(s,'Rettungsbudget','Der Partner finanziert den nächsten Einsatz. Die Aufstiegschancen bleiben erhalten.');}
 const result={season:s.season,year:s.year,classId:s.classId,eventId:r.event.id,eventName:r.event.title||r.event.name,minutes:r.event.minutes,position:finish?position:0,overall:finish?overall:0,dnf:!finish,points:finish?(D.POINTS[position-1]||0)*(r.event.pointsMultiplier||1):0,expected,repGain,income,expenses,net,sponsorBonus,team:s.team.name,stops:c.stops,errors:c.errors,damage:c.damage,drivers:c.drivers.map((d,i)=>({name:d.name,id:d.id,minutes:c.driveMinutes[i],fatigue:c.fatigue[i]})),winner:qualified[0]?.name||'Kein klassifizierter Sieger'};
 r.finished=true;r.result=result;s.phase='result';s.history.push(copy(result));r.prompt=null;
 const achievement=(id,name)=>{if(!s.achievements.some(x=>x.id===id))s.achievements.push({id,name,season:s.season});};
 if(finish)achievement('finish','Die erste Zielflagge');if(finish&&position<=3)achievement('podium','Gemeinsam aufs Podium');if(finish&&position===1)achievement('win','Der erste Klassensieg');if(finish&&r.event.minutes>=1440)achievement('24h','Durch die Nacht');if(finish&&position===1&&r.event.id==='lemans')achievement(s.classId==='Hypercar'?'lemans-overall':'lemans-class',s.classId==='Hypercar'?'Le Mans: Gesamtsieger':'Le Mans: Klassensieger');
 log(r,'Zielflagge',finish?`P${position} in eurer Klasse · ${result.points} Punkte. Das Ergebnis gehört der ganzen Besetzung.`:'Ausfall. Auswerten, lernen, wiederkommen.',finish?'good':'danger');
 addNews(s,result.eventName+' · '+(finish?'P'+position:'DNF'),finish?(position<expected?'Über den Erwartungen. ':'')+'Ein gemeinsames Ergebnis für '+s.team.name+'.':'Eine schwierige Etappe, aber kein Ende deiner Karriere.');
 return s;
}
function syncPlayer(s){const d=s.team.drivers.find(d=>d.id==='player');if(d)for(const k of STATS)d[k]=s.player[k];}
function interview(s,id){if(s.phase!=='result'||s.prep.interviewed)fail('Dieses Interview wurde bereits geführt.');if(!['team','ambition','honest'].includes(id))fail('Ungültige Antwort.');s.prep.interviewed=true;if(id==='team')s.team.morale=clamp(s.team.morale+4);if(id==='ambition')s.reputation=clamp(s.reputation+1);if(id==='honest'){s.player.consistency=clamp(s.player.consistency+.6,0,99);syncPlayer(s);}return s;}
function nextRound(s){if(s.phase!=='result'||!s.race?.finished)fail('Zuerst muss das Rennen beendet werden.');s.race=null;s.round++;s.prep=newPrep();if(s.round>=s.calendar.length){s.phase='offseason';const st=standings(s),position=st.teams.findIndex(x=>x.id==='own')+1;const archive={season:s.season,year:s.year,classId:s.classId,team:s.team.name,position,points:st.teams.find(x=>x.id==='own').points,champion:st.teams[0].name,standings:copy(st),races:s.history.filter(h=>h.season===s.season).length};s.archive.push(archive);if(position===1&&!s.achievements.some(a=>a.id==='champion'))s.achievements.push({id:'champion',name:'Eine Meisterschaft. Ein Team.',season:s.season});addNews(s,'Saison abgeschlossen','Teamwertung P'+position+'. Deine Karriere geht mit einem neuen Vertrag weiter.');}else s.phase='preparation';return s;}
function offers(s){if(s.phase!=='offseason')return [];const scale=D.CLASSES[s.classId].scale,base=D.CLASSES[s.classId].base;const result=[{id:'stay',classId:s.classId,name:s.team.name,title:'Zusammen weitermachen',text:'Garantierter Vertrag. Vertraute Mannschaft und gesicherter nächster Einsatz.',quality:s.team.quality+1,brand:s.team.brand,salary:Math.round(24000*scale),funding:Math.round(D.CLASSES[s.classId].budget*.38),stay:true}];
 if(!s.scenario)result.push({id:'stronger',classId:s.classId,name:D.TEAMS[(s.season+2)%D.TEAMS.length][0],title:'Neue Mannschaft, neue Chance',text:'Ein anderer Ansatz in deiner aktuellen Klasse. Ein Klassenwechsel ist nicht nötig, um erfolgreich zu sein.',quality:clamp(base+4+s.reputation*.045,0,95),brand:D.TEAMS[(s.season+2)%D.TEAMS.length][1],salary:Math.round(30000*scale),funding:D.CLASSES[s.classId].budget,stay:false});
 if(!s.scenario)for(const cl of D.CLASSES[s.classId].next){if(s.reputation>=D.CLASSES[cl].rep||(s.role==='manager'&&s.season>=2)){result.push({id:'move-'+cl,classId:cl,name:cl==='Hypercar'?'Nordwerk Endurance':cl==='GT3'?'Alpenwerk GT Program':'Vertex '+cl,title:cl==='Hypercar'?'Das Hypercar-Angebot':cl+'-Programm',text:cl==='GT3'?'Bleibe im GT-Sport und kämpfe um große Klassensiege.':cl==='Hypercar'?'Ein finanziertes Programm für die Spitzenklasse. Neue Konkurrenz, gleiche Verantwortung.':'Eine neue Herausforderung im Prototypen-Sport.',quality:D.CLASSES[cl].base+1,brand:cl==='Hypercar'?'Nordwerk':'Aster',salary:Math.round(28000*D.CLASSES[cl].scale),funding:D.CLASSES[cl].budget,stay:false});}}
 return result;
}
function acceptOffer(s,id){const off=offers(s).find(x=>x.id===id);if(!off)fail('Dieser Vertrag ist nicht verfügbar.');const oldClass=s.classId;s.classId=off.classId;s.season++;s.year++;s.player.age++;s.player.category=category(s.player,s.reputation);s.team.name=off.name;s.team.brand=off.brand;if(s.role==='driver')s.money+=off.salary;s.team.quality=clamp(off.quality,0,97);s.team.budget=off.stay?s.team.budget+off.funding:off.funding;s.team.affinity=off.stay?clamp(s.team.affinity+8):35;
 if(!off.stay){s.team.reliability=87;s.team.pitCrew=80;s.team.upgrades={quality:0,reliability:0,pitCrew:0};const b=D.CLASSES[s.classId].base;s.team.drivers=crew(s,0,b,s.classId);if(s.role==='driver')s.team.drivers=[copy(s.player),generateDriver(s,1,b+1,'crew-b','Bronze'),generateDriver(s,3,b+3,'crew-c','Silver')];}
 else{syncPlayer(s);const p=s.team.drivers.find(d=>d.id==='player');if(p)p.category=s.player.category;}
 s.calendar=s.scenario?[{...D.calendar('Hypercar').find(e=>e.id==='lemans'),round:1}]:D.calendar(s.classId);s.round=0;s.race=null;s.phase='preparation';s.prep=newPrep();s.sponsorPicked=false;s.rivals=makeRivals(s);for(const t of s.rivals){if(t.name===s.team.name)t.name+=' Juniors';}newChampionship(s);
 addNews(s,'Dein nächstes Kapitel',off.name+' · '+D.CLASSES[s.classId].name+'. '+(oldClass===s.classId?'Kontinuität kann Rennen gewinnen.':'Ein Klassenwechsel ist ein neuer Anfang, kein garantierter Sieg.'));return s;
}
function switchToManager(s){if(s.role!=='driver'||s.phase!=='offseason')fail('Der Rollenwechsel ist nur nach einer Fahrersaison möglich.');s.role='manager';const i=s.team.drivers.findIndex(x=>x.id==='player');if(i>=0)s.team.drivers[i]=generateDriver(s,19,D.CLASSES[s.classId].base+2,'successor-'+s.season,s.classId==='Hypercar'?'Gold':'Silver');addNews(s,'Vom Cockpit an die Boxenmauer','Deine Chronik bleibt erhalten. Ab jetzt entscheidest du als Manager.');return s;}
function validate(s){
 if(!s||typeof s!=='object'||Array.isArray(s)||s.version!==VERSION)fail('Diese Datei ist kein kompatibler ENDURANCE-Spielstand.');
 if(!['driver','manager'].includes(s.role)||!['quick','standard'].includes(s.mode)||!D.CLASSES[s.classId]||!['preparation','race','result','offseason'].includes(s.phase))fail('Ungültiger Karriere-Modus.');
 const finite=n=>typeof n==='number'&&Number.isFinite(n),checkD=d=>d&&typeof d.id==='string'&&typeof d.name==='string'&&d.name.length<=80&&STATS.every(k=>finite(d[k])&&d[k]>=0&&d[k]<=100)&&['Bronze','Silver','Gold','Platinum'].includes(d.category);
 if(!Number.isInteger(s.rng)||!Number.isInteger(s.season)||s.season<1||!Number.isInteger(s.round)||s.round<0||!finite(s.reputation)||!finite(s.money)||!checkD(s.player))fail('Beschädigte Karriere- oder Fahrerdaten.');
 if(!s.team||!Array.isArray(s.team.drivers)||s.team.drivers.length!==3||!s.team.drivers.every(checkD)||!finite(s.team.budget)||!finite(s.team.quality)||!finite(s.team.pitCrew)||!finite(s.team.reliability)||!D.SPONSORS.some(x=>x.id===s.team.sponsor)||!s.team.upgrades)fail('Beschädigte Teamdaten.');
 if(!Array.isArray(s.rivals)||s.rivals.length!==9||!s.rivals.every(t=>Array.isArray(t.drivers)&&t.drivers.length===3&&t.drivers.every(checkD)&&finite(t.quality)))fail('Beschädigtes Teilnehmerfeld.');
 if(!Array.isArray(s.calendar)||!s.calendar.length||s.calendar.length>12||s.round>s.calendar.length||!s.calendar.every(e=>finite(e.minutes)&&e.minutes>0&&e.minutes<=1440&&finite(e.factor)&&e.factor>0))fail('Beschädigter Kalender.');
 if(!Array.isArray(s.history)||s.history.length>2000||!Array.isArray(s.archive)||!Array.isArray(s.news)||!Array.isArray(s.achievements)||!s.prep)fail('Beschädigte Chronik.');
 if(!s.championship||!Array.isArray(s.championship.teams)||!Array.isArray(s.championship.drivers)||![...s.championship.teams,...s.championship.drivers].every(x=>finite(x.points)&&Array.isArray(x.finishes)))fail('Beschädigte Meisterschaftsdaten.');
 const text=v=>typeof v==='string'&&v.length<=500,integer=(v,a=0,b=100000)=>Number.isInteger(v)&&v>=a&&v<=b;
 if(!integer(s.year,2027)||!integer(s.rng,0,4294967295)||s.reputation<0||s.reputation>100||!text(s.team.name)||!text(s.team.brand)||!finite(s.team.morale)||!finite(s.team.affinity)||!['quality','reliability','pitCrew'].every(k=>integer(s.team.upgrades[k],0,1000)))fail('Beschädigte Team- oder Jahresdaten.');
 if(![s.player,...s.team.drivers,...s.rivals.flatMap(t=>t.drivers)].every(d=>text(d.specialty)&&text(d.country)&&integer(d.age,16,10000)))fail('Beschädigtes Fahrerprofil.');
 if(!['start','night','finish'].every(k=>[0,1,2].includes(s.prep[k]))||!['rotation','conditions'].includes(s.prep.plan)||!['fresh','double'].includes(s.prep.tyres)||!['safe','balanced','attack'].includes(s.prep.qualifying)||typeof s.prep.used!=='boolean'||!finite(s.prep.boost))fail('Beschädigter Stintplan.');
 if(!s.calendar.every(e=>integer(e.minutes,5,1440)&&e.minutes%5===0&&text(e.name)&&text(e.id)&&text(e.title)&&text(e.country)&&finite(e.startHour)))fail('Beschädigte Rennveranstaltung.');
 if((s.phase==='offseason'&&s.round!==s.calendar.length)||(s.phase!=='offseason'&&s.round>=s.calendar.length)||(['offseason','preparation'].includes(s.phase)&&s.race))fail('Saisonphase und Kalender passen nicht zusammen.');
 if(!s.news.every(n=>n&&text(n.title)&&text(n.text))||!s.achievements.every(a=>a&&text(a.id)&&text(a.name)))fail('Beschädigte Meldungen.');
 if(![...s.championship.teams,...s.championship.drivers].every(x=>text(x.id)&&text(x.name)&&integer(x.wins)&&integer(x.podiums)&&x.finishes.every(n=>integer(n,1,40)||n===99)))fail('Beschädigte Wertungszeilen.');
 const resultValid=x=>x&&text(x.eventName)&&text(x.classId)&&text(x.team)&&integer(x.season,1)&&integer(x.position,0,40)&&finite(x.points)&&finite(x.net)&&Array.isArray(x.drivers)&&x.drivers.length===3&&x.drivers.every(d=>text(d.name)&&finite(d.minutes));
 if(!s.history.every(resultValid)||!s.archive.every(a=>a&&text(a.classId)&&integer(a.season,1)&&integer(a.position,1,40)&&a.standings&&Array.isArray(a.standings.teams)&&Array.isArray(a.standings.drivers)))fail('Beschädigte Ergebnis-Chronik.');
 if(['race','result'].includes(s.phase)&&!s.race)fail('Rennzustand fehlt.');
 if(s.race){const r=s.race;if(!r.event||!finite(r.elapsed)||r.elapsed<0||r.elapsed>r.event.minutes||!finite(r.decisionMinutes)||r.decisionMinutes<5||!Array.isArray(r.cars)||r.cars.length>40||r.cars.filter(c=>c.own).length!==1||!Array.isArray(r.weatherPlan)||!Array.isArray(r.log)||!r.cars.every(c=>D.CLASSES[c.classId]&&finite(c.progress)&&finite(c.damage)&&finite(c.fuel)&&finite(c.tyres)&&Array.isArray(c.drivers)&&c.drivers.length===3&&c.drivers.every(checkD)&&Array.isArray(c.driveMinutes)&&c.driveMinutes.length===3&&c.driveMinutes.every(finite)&&Array.isArray(c.fatigue)&&c.fatigue.length===3&&c.fatigue.every(finite)&&[0,1,2].includes(c.driver)&&Array.isArray(c.active)))fail('Beschädigter Rennzustand.');if(!r.finished&&!r.prompt)fail('Rennentscheidung fehlt.');
 if(!integer(r.event.minutes,5,1440)||!['green','sc','fcy'].includes(r.flag)||!finite(r.neutralUntil)||!integer(r.decisions)||!Array.isArray(r.qualifying)||!r.qualifying.every(q=>text(q.name)&&D.CLASSES[q.classId]&&finite(q.time))||!r.weatherPlan.length||!r.weatherPlan.every(v=>finite(v)&&v>=0&&v<=100)||!r.log.every(l=>finite(l.at)&&text(l.title)&&text(l.text)))fail('Beschädigte Renninformationen.');
 if((s.phase==='result'&&(!r.finished||!resultValid(r.result)))||(s.phase==='race'&&r.finished))fail('Rennergebnis und Spielphase passen nicht zusammen.');
 if(!r.finished&&(!['retired','start','pace','duel','traffic','tyres','night','pressure','final','damage','weather','safety','rest'].includes(r.prompt.kind)||!text(r.prompt.title)||!text(r.prompt.text)))fail('Ungültige Rennentscheidung.');
 if(!r.cars.every(c=>text(c.name)&&text(c.teamId)&&['running','dnf'].includes(c.status)&&['slick','wet'].includes(c.compound)&&c.active.length>=2&&c.active.length<=3&&c.active.every(i=>[0,1,2].includes(i))&&c.active.includes(c.driver)&&[c.quality,c.reliability,c.pitCrew,c.morale,c.stint,c.stops,c.pendingPit,c.errors,c.repairTime,c.pitTime,c.lastManual].every(finite)))fail('Beschädigte Fahrzeugdaten.');}
 return true;
}
function serialise(s){validate(s);return JSON.stringify(s);}
function parse(text){if(typeof text!=='string'||text.length>2500000)fail('Die Datei ist zu groß oder ungültig.');let nodes=0;let s;try{s=JSON.parse(text,(key,value)=>{if(['__proto__','prototype','constructor'].includes(key))fail('Ungültiges Datenfeld.');if(++nodes>150000)fail('Die Datei enthält zu viele Daten.');if(typeof value==='number'&&!Number.isFinite(value))fail('Ungültiger Zahlenwert.');return value;});}catch(e){fail('Spielstand kann nicht gelesen werden: '+e.message);}validate(s);return s;}
return {VERSION,D,createCareer,prepare,setPlan,event,carLabel,lineupValid,candidates,hire,develop,upgradeCost,chooseSponsor,startRace,choices,choose,pit,ownCar,ranked,standings,racePosition,getWeather,isNight,timeOfDay,forecast,interview,nextRound,offers,acceptOffer,switchToManager,validate,serialise,parse,average,category,clamp};
});
