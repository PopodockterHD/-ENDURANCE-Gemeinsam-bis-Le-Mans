/* Fictional career world. Category names are descriptive; performance and calendars are game values. */
(function(root,factory){const d=factory();if(typeof module==='object'&&module.exports)module.exports=d;else root.EnduranceData=d;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const CLASSES={
 GT4:{name:'GT4',series:'GT4 European Journey',subtitle:'Dein Einstieg. Dein erstes Team.',lap:118,base:68,budget:320000,scale:1,color:'#7edbb0',next:['GT3','LMP3'],rep:0},
 GT3:{name:'GT3 / LMGT3',series:'GT Endurance Tour',subtitle:'Die Welt der großen GT-Rennen.',lap:105,base:77,budget:950000,scale:2.5,color:'#4ad9c0',next:['LMP2','Hypercar'],rep:26},
 LMP3:{name:'LMP3',series:'Prototype Challenge',subtitle:'Leicht, direkt, kompromisslos.',lap:101,base:73,budget:680000,scale:1.8,color:'#c29cff',next:['LMP2','GT3'],rep:24},
 LMP2:{name:'LMP2',series:'European Endurance Series',subtitle:'Der Weg nach Le Mans.',lap:94,base:82,budget:1800000,scale:4.5,color:'#84adff',next:['Hypercar','GT3'],rep:44},
 Hypercar:{name:'Hypercar',series:'World Endurance Journey',subtitle:'Um den Gesamtsieg. Gemeinsam.',lap:89,base:87,budget:6200000,scale:12,color:'#ffba7a',next:['GT3','LMP2'],rep:67}
};
const TRACKS={
 monza:{name:'Monza',country:'IT',label:'Italien',factor:1.00,rain:0.18,startHour:14,character:'Vollgas & Windschatten'},
 spielberg:{name:'Spielberg',country:'AT',label:'Österreich',factor:0.78,rain:0.25,startHour:14,character:'Bremsen & Traktion'},
 zandvoort:{name:'Zandvoort',country:'NL',label:'Niederlande',factor:0.94,rain:0.3,startHour:14,character:'Rhythmus & Reifen'},
 misano:{name:'Misano',country:'IT',label:'Italien',factor:0.9,rain:0.12,startHour:18,character:'Kurven & Verkehr'},
 barcelona:{name:'Barcelona',country:'ES',label:'Spanien',factor:0.98,rain:0.16,startHour:14,character:'Reifenmanagement'},
 spa:{name:'Spa-Francorchamps',country:'BE',label:'Belgien',factor:1.37,rain:0.5,startHour:16,character:'Wetter & Mut'},
 paulricard:{name:'Paul Ricard',country:'FR',label:'Frankreich',factor:1.1,rain:0.16,startHour:18,character:'Strategie & Ausdauer'},
 brands:{name:'Brands Hatch',country:'GB',label:'Großbritannien',factor:0.82,rain:0.4,startHour:14,character:'Präzision & Verkehr'},
 nurburgring:{name:'Nürburgring',country:'DE',label:'Deutschland',factor:4.7,rain:0.45,startHour:16,character:'Grüne Hölle · Nacht & Geduld'},
 lemans:{name:'Le Mans',country:'FR',label:'Frankreich',factor:2.25,rain:0.38,startHour:16,character:'Mulsanne · Nacht · Legende'},
 imola:{name:'Imola',country:'IT',label:'Italien',factor:1.0,rain:0.22,startHour:13,character:'Kerbs & Rhythmus'},
 silverstone:{name:'Silverstone',country:'GB',label:'Großbritannien',factor:1.18,rain:0.4,startHour:14,character:'Schnelle Richtungswechsel'},
 portimao:{name:'Portimão',country:'PT',label:'Portugal',factor:1.03,rain:0.18,startHour:14,character:'Kuppen & Balance'},
 saopaulo:{name:'São Paulo',country:'BR',label:'Brasilien',factor:0.86,rain:0.42,startHour:11,character:'Verkehr & Wetter'},
 fuji:{name:'Fuji',country:'JP',label:'Japan',factor:1.0,rain:0.45,startHour:11,character:'Gerade & Regen'},
 bahrain:{name:'Bahrain',country:'BH',label:'Bahrain',factor:1.17,rain:0.06,startHour:14,character:'Sonnenuntergang & Reifen'}
};
const ROUNDS={
GT4:[['monza',90],['spielberg',60],['zandvoort',90],['misano',120],['barcelona',180],['spa',240]],
GT3:[['paulricard',360],['brands',90],['spa',1440],['nurburgring',1440],['barcelona',180],['lemans',1440]],
LMP3:[['barcelona',240],['paulricard',240],['imola',240],['spa',240],['silverstone',240],['portimao',240]],
LMP2:[['barcelona',240],['paulricard',240],['lemans',1440],['spa',240],['silverstone',240],['portimao',240]],
Hypercar:[['imola',360],['spa',360],['lemans',1440],['saopaulo',360],['fuji',360],['bahrain',480]]};
function calendar(classId){return ROUNDS[classId].map(([id,minutes],i)=>({...TRACKS[id],id,minutes,round:i+1,title:minutes>=60?(minutes/60)+'h '+TRACKS[id].name:minutes+' min '+TRACKS[id].name,special:minutes>=720,multiclass:classId==='LMP2'||classId==='LMP3'||classId==='Hypercar'||id==='lemans'||id==='nurburgring',lmgt3:id==='lemans'&&classId==='GT3',pointsMultiplier:minutes>=1440?2:1}));}
const TEAMS=[['Alpenwerk Racing','Nordwerk','#71d6b3'],['Veloce Corse','Veloce','#f38681'],['Northstar Motorsport','Kestrel','#9ebaff'],['Sakura Endurance','Sakura','#e8b3cf'],['Aster Competition','Aster','#e6c780'],['Atlantic Racing','Kestrel','#78c2da'],['Eclipse Motorsport','Aster','#b9a3e6'],['Vertex Racing','Veloce','#edac75'],['Meridian Sport','Nordwerk','#b9c2d0'],['Kyoto Performance','Sakura','#b2d585']];
const PEOPLE=[['Luca Marin','IT','Angreifer'],['Daniel Weber','DE','Reifenspezialist'],['Emilia Costa','PT','Regenexpertin'],['Hana Sato','JP','Nachtprofi'],['Noah Keller','CH','Teamspieler'],['Louis Moreau','FR','Konstanz'],['Sofia Romano','IT','Angreiferin'],['Oliver Reed','GB','Regenexperte'],['Mika Berg','FI','Nachtprofi'],['Lena Hofmann','AT','Teamspielerin'],['Tiago Silva','PT','Reifenspezialist'],['Arthur Bell','GB','Konstanz'],['Yuki Mori','JP','Angreifer'],['Eva Laurent','FR','Nachtprofi'],['Mateo Ruiz','ES','Reifenprofi'],['Nils Andersen','DK','Konstanz'],['Jonas Falk','SE','Regenexperte'],['Maya Carter','US','Angreiferin'],['Julien Blanc','FR','Teamspieler'],['Felix Hartmann','DE','Nachtprofi'],['Enzo Ricci','IT','Reifenprofi'],['Sven de Vries','NL','Konstanz'],['Clara Weiss','AT','Regenexpertin'],['Theo Wilson','GB','Teamspieler'],['Alex Duarte','BR','Angreifer'],['Riku Tanaka','JP','Konstanz'],['Milan Novak','CZ','Reifenprofi'],['Camille Dubois','FR','Nachtprofi'],['Ben Foster','GB','Teamspieler'],['Sara Lind','SE','Regenexpertin'],['David Berger','AT','Konstanz'],['Marco Bianchi','IT','Angreifer'],['Iris Vermeer','NL','Teamspielerin'],['Adrian Wolf','DE','Reifenprofi'],['Nico Santos','ES','Nachtprofi'],['Aya Nakamura','JP','Regenexpertin']];
const STAT_LABELS={pace:'Tempo',consistency:'Konstanz',wet:'Regen',night:'Nacht',tyre:'Reifen',teamwork:'Teamwork'};
const SPONSORS=[{id:'steady',name:'Nordlicht Engineering',tag:'Verlässlich',text:'Feste Unterstützung, unabhängig vom Ergebnis.',base:22000,bonus:0,target:10}, {id:'podium',name:'Apex Motion',tag:'Leistungsorientiert',text:'Weniger Grundbetrag. Hoher Bonus für ein Podium.',base:14000,bonus:26000,target:3},{id:'finish',name:'Horizon Logistics',tag:'Langstreckenpartner',text:'Belohnt jedes sauber beendete Rennen.',base:17000,bonus:11000,target:10}];
const POINTS=[25,18,15,12,10,8,6,4,2,1];
const SOURCES=[{name:'ELMS – Fahrzeugklassen und Besetzungen',url:'https://www.europeanlemansseries.com/en/page/classes'},{name:'FIA – Fahrereinstufungen',url:'https://www.fia.com/fia-driver-categorisation'},{name:'24 Stunden von Le Mans',url:'https://www.24h-lemans.com/en'}];
return {CLASSES,TRACKS,ROUNDS,calendar,TEAMS,PEOPLE,STAT_LABELS,SPONSORS,POINTS,SOURCES};
});
