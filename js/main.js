'use strict';
document.querySelectorAll('[data-split]').forEach(el=>{
  el.setAttribute('aria-label', el.dataset.split.replace('|',' '));
  el.innerHTML = el.dataset.split.split('|').map(l=>l.trim().split(' ').map(w=>`<span class="anim w">${w}</span>`).join(' ')).join('<br>');
});

const slides=[...document.querySelectorAll('.slide')], N=slides.length;
const vids=[...document.querySelectorAll('.bgv')];
const dotsEl=document.getElementById('dots');
let cur=0, busy=false;
slides.forEach((_,i)=>{const d=document.createElement('button');d.type='button';d.className='dot';d.setAttribute('aria-label','Go to section '+(i+1));d.onclick=()=>go(i);dotsEl.appendChild(d);});
const dots=[...dotsEl.children];

function st(d){
  if(d===0) return ['none',1,2,'auto','blur(0px)'];
  if(d===1) return ['translateZ(-700px) scale(.88)',0,1,'none','blur(6px)'];
  if(d===-1) return ['translateZ(460px)',0,1,'none','blur(6px)'];
  return d>1 ? ['translateZ(-1200px) scale(.7)',0,0,'none','blur(8px)'] : ['translateZ(900px)',0,0,'none','blur(8px)'];
}
function showBg(){
  const idx=cur%vids.length;
  vids.forEach((v,k)=>{
    if(k===idx){
      if(!v.getAttribute('src')) v.src=v.dataset.src;
      v.muted=true; v.currentTime=0; const p=v.play(); if(p) p.catch(()=>{});
      v.classList.add('on');
    } else { v.classList.remove('on'); setTimeout(()=>{ if(!v.classList.contains('on')) v.pause(); },950); }
  });
}
function render(){
  slides.forEach((s,i)=>{const [t,o,z,p,f]=st(i-cur); s.style.transform=t; s.style.opacity=o; s.style.zIndex=z; s.style.pointerEvents=p; s.style.filter=f; s.style.transitionDelay=(i===cur)?'0s,.14s,.1s':'0s';});
  dots.forEach((d,i)=>d.classList.toggle('on',i===cur));
  const a=slides[cur];
  a.classList.remove('go'); void a.offsetWidth;
  a.querySelectorAll('.anim').forEach((el,k)=>el.style.animationDelay=(.08+Math.min(k*.08,1.2))+'s');
  a.classList.add('go');
  showBg();
}
function go(i){ if(busy||i===cur||i<0||i>=N) return; cur=i; busy=true; render(); setTimeout(()=>busy=false,900); }
const next=()=>go(Math.min(cur+1,N-1)), prev=()=>go(Math.max(cur-1,0));

let wl=false;
addEventListener('wheel',e=>{ e.preventDefault(); if(wl||Math.abs(e.deltaY)<Math.abs(e.deltaX)) return; if(Math.abs(e.deltaY)<20) return; wl=true; setTimeout(()=>wl=false,900); e.deltaY>0?next():prev(); },{passive:false});
let tx=null,ty=null;
addEventListener('touchstart',e=>{tx=e.touches[0].clientX;ty=e.touches[0].clientY;},{passive:true});
addEventListener('touchmove',e=>e.preventDefault(),{passive:false});
addEventListener('touchend',e=>{ if(ty===null) return; const dy=ty-e.changedTouches[0].clientY, dx=tx-e.changedTouches[0].clientX; ty=null;
  if(Math.abs(dy)>44 && Math.abs(dy)>Math.abs(dx)) dy>0?next():prev(); },{passive:true});
addEventListener('keydown',e=>{
  if(['ArrowDown','PageDown',' '].includes(e.key)){e.preventDefault();next();}
  if(['ArrowUp','PageUp'].includes(e.key)){e.preventDefault();prev();}
});

render();

// Pause the background video when the tab is hidden
document.addEventListener('visibilitychange',()=>{ const v=vids[cur%vids.length]; document.hidden?v.pause():v.play().catch(()=>{}); });
