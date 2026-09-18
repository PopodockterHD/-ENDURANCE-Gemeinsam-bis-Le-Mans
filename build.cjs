const fs=require('node:fs');const path=require('node:path');
const root=__dirname,read=n=>fs.readFileSync(path.join(root,'src',n),'utf8');
let html=read('shell.html');for(const [key,file]of [['CSS','style.css'],['DATA','data.js'],['ENGINE','engine.js'],['APP','app.js']]){html=html.replace('/*__'+key+'__*/',()=>read(file));}
fs.writeFileSync(path.join(root,'index.html'),html);console.log('Built index.html:',Buffer.byteLength(html),'bytes; no external runtime assets.');
