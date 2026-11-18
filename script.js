// First-visit welcome animation: fades into the full website automatically or on Enter.
const introScreen=document.querySelector('#introScreen');
function dismissIntro(){if(!introScreen||introScreen.classList.contains('leaving'))return;introScreen.classList.add('leaving');document.body.classList.add('site-entered');window.setTimeout(()=>introScreen.remove(),800)}
if(introScreen){document.querySelector('#enterSite')?.addEventListener('click',dismissIntro);window.setTimeout(dismissIntro,2600);}
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
// Portfolio image preview gallery
const galleryItems=[...document.querySelectorAll('[data-gallery-item]')].map(card=>({
 title:card.dataset.title,category:card.dataset.category,
 src:card.querySelector('img').getAttribute('src'),alt:card.querySelector('img').alt
}));
const galleryModal=$('#galleryModal'),galleryImage=$('#galleryImage');
let galleryIndex=0,zoom=1;
function showGallery(index){
 if(!galleryItems.length)return;
 galleryIndex=(index+galleryItems.length)%galleryItems.length;zoom=1;
 const item=galleryItems[galleryIndex];
 galleryImage.src=item.src;galleryImage.alt=item.alt;galleryImage.style.transform='scale(1)';
 $('#galleryTitle').textContent=item.title;$('#galleryCategory').textContent=item.category;
 $('#galleryCount').textContent=(galleryIndex+1)+'/'+galleryItems.length;$('#zoomValue').textContent='100%';
 galleryModal.classList.remove('hidden');document.body.style.overflow='hidden';
}
function closeGallery(){galleryModal.classList.add('hidden');document.body.style.overflow='';galleryImage.src=''}
function changeGallery(step){showGallery(galleryIndex+step)}
document.querySelectorAll('[data-gallery-item]').forEach((card,index)=>card.querySelector('.project-open').addEventListener('click',()=>showGallery(index)));
$('#galleryClose').addEventListener('click',e=>{e.preventDefault();e.stopPropagation();closeGallery()});
document.addEventListener('click',e=>{if(e.target.closest('#galleryClose'))closeGallery()},true);
$('#galleryPrev').addEventListener('click',()=>changeGallery(-1));$('#galleryNext').addEventListener('click',()=>changeGallery(1));
$('#galleryPrevBottom').addEventListener('click',()=>changeGallery(-1));$('#galleryNextBottom').addEventListener('click',()=>changeGallery(1));
function setZoom(value){zoom=Math.max(0.5,Math.min(3,value));galleryImage.style.transform=`scale(${zoom})`;$('#zoomValue').textContent=Math.round(zoom*100)+'%'}
$('#zoomIn').addEventListener('click',()=>setZoom(zoom+.25));$('#zoomOut').addEventListener('click',()=>setZoom(zoom-.25));$('#detailZoom').addEventListener('click',()=>setZoom(2.5));
galleryModal.addEventListener('click',e=>{if(e.target===galleryModal)closeGallery()});
document.addEventListener('keydown',e=>{if(galleryModal.classList.contains('hidden'))return;if(e.key==='Escape')closeGallery();if(e.key==='ArrowRight')changeGallery(1);if(e.key==='ArrowLeft')changeGallery(-1)});

const nav=$('.nav'),hamb=$('.hamb');hamb.addEventListener('click',()=>nav.classList.toggle('open'));$$('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));$('#year').textContent=new Date().getFullYear();
const modal=$('#managerModal'),playModal=$('#playModal');const key='aloyPortfolioGamesV1';
const getGames=()=>{try{return JSON.parse(localStorage.getItem(key)||'[]')}catch{return []}};
function renderGames(filter='All'){const grid=$('#gamesGrid');grid.querySelectorAll('.custom-game').forEach(n=>n.remove());getGames().filter(g=>filter==='All'||g.category===filter).forEach((g,i)=>{const card=document.createElement('article');card.className='game-card custom-game';const art=document.createElement('div');art.className='game-art';art.style.background=g.cover?`center/cover url("${g.cover}")`:'radial-gradient(circle at 50% 50%,#326aa5,#152541 72%)';if(!g.cover){const emoji=document.createElement('span');emoji.textContent='🎮';art.append(emoji)}const tag=document.createElement('small');tag.textContent=g.category.toUpperCase();art.append(tag);const info=document.createElement('div');info.className='game-info';const d=document.createElement('div');const b=document.createElement('b');b.textContent=g.name;const sm=document.createElement('small');sm.textContent='Added game';d.append(b,sm);const btn=document.createElement('button');btn.className='play-btn';btn.textContent='Play ↗';btn.addEventListener('click',()=>playGame(g));info.append(d,btn);card.append(art,info);grid.append(card)});$$('.game-card').forEach(c=>{if(c.classList.contains('custom-game'))return;const category=c.querySelector('.game-art small')?.textContent||'';c.style.display=filter==='All'||category.toLowerCase()===filter.toLowerCase()?'':'none'})}
function renderSaved(){const list=$('#savedList');list.innerHTML='';getGames().forEach((g,i)=>{const row=document.createElement('div');row.className='saved-item';const name=document.createElement('span');name.textContent=g.name+' · '+g.category;const del=document.createElement('button');del.textContent='Remove';del.addEventListener('click',()=>{const a=getGames();a.splice(i,1);localStorage.setItem(key,JSON.stringify(a));renderSaved();renderGames($('#filters .active')?.dataset.filter||'All')});row.append(name,del);list.append(row)})}
$('#manageGames').addEventListener('click',()=>{modal.classList.remove('hidden');renderSaved()});$('#closeManager').addEventListener('click',()=>modal.classList.add('hidden'));modal.addEventListener('click',e=>{if(e.target===modal)modal.classList.add('hidden')});
$('#gameForm').addEventListener('submit',async e=>{e.preventDefault();const name=$('#gameName').value.trim(),category=$('#gameCategory').value,url=$('#gameUrl').value.trim(),cover=$('#coverUrl').value.trim(),file=$('#htmlFile').files[0];if(!url&&!file){alert('Please enter a game URL or choose an HTML file.');return}let localHtml='';if(file){if(file.size>1500000){alert('For this browser-only demo, HTML files must be under 1.5 MB. Host larger games and use their URL.');return}localHtml=await file.text()}const games=getGames();games.push({name,category,url,cover,html:localHtml});try{localStorage.setItem(key,JSON.stringify(games))}catch{alert('Browser storage is full. Try using a hosted game URL instead.');return}e.target.reset();renderSaved();renderGames($('#filters .active')?.dataset.filter||'All');alert('Game added in this browser. It is not yet published for other visitors.')});
$$('.filter').forEach(btn=>btn.addEventListener('click',()=>{$$('.filter').forEach(b=>b.classList.remove('active'));btn.classList.add('active');renderGames(btn.dataset.filter)}));
function playGame(g){$('#playingTitle').textContent=g.name;$('#playMessage').textContent=g.html?'Local HTML preview in this browser.':'Opening hosted game URL.';const frame=$('#gameFrame');if(g.html){frame.removeAttribute('src');frame.srcdoc=g.html}else{frame.srcdoc='';frame.src=g.url}playModal.classList.remove('hidden')}
$$('[data-demo]').forEach(b=>b.addEventListener('click',()=>{alert('This is a sample card only. Add a real HTML5 game from “Manage Games” to make it playable.')}));$('#closePlay').addEventListener('click',()=>{playModal.classList.add('hidden');$('#gameFrame').src='about:blank';$('#gameFrame').srcdoc=''});playModal.addEventListener('click',e=>{if(e.target===playModal){playModal.classList.add('hidden');$('#gameFrame').src='about:blank';$('#gameFrame').srcdoc=''}});renderGames();