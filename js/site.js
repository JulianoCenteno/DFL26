document.addEventListener('DOMContentLoaded',()=>{
 const modal=document.getElementById('oferta-especial');
 const open=()=>{if(!modal)return;modal.hidden=false;document.body.classList.add('static-lock');modal.querySelector('[data-close-discount]')?.focus?.()};
 const close=()=>{if(!modal)return;modal.hidden=true;document.body.classList.remove('static-lock')};
 document.querySelectorAll('[data-open-discount]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();open()}));
 document.querySelectorAll('[data-close-discount]').forEach(x=>x.addEventListener('click',close));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 document.querySelectorAll('a[href^="#"]:not([data-open-discount])').forEach(a=>a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}}));
 document.querySelectorAll('[data-static-carousel]').forEach(root=>{
  const track=root.querySelector(':scope > .overflow-hidden > .flex'); if(!track)return;
  const slides=[...track.children]; if(slides.length<2)return;
  let index=0,timer; const visible=()=>innerWidth>=1024&&slides[0].classList.contains('lg:basis-1/3')?3:innerWidth>=768&&slides[0].classList.contains('md:basis-1/2')?2:1;
  const render=()=>{const max=Math.max(0,slides.length-visible());if(index>max)index=0;track.style.transform=`translate3d(-${index*(100/visible())}%,0,0)`};
  const go=d=>{const max=Math.max(0,slides.length-visible());index=index+d;if(index>max)index=0;if(index<0)index=max;render()};
  root.querySelector('[data-carousel-prev]')?.addEventListener('click',()=>{go(-1);restart()});root.querySelector('[data-carousel-next]')?.addEventListener('click',()=>{go(1);restart()});
  const restart=()=>{clearInterval(timer);timer=setInterval(()=>go(1),3500)};addEventListener('resize',render);render();restart();
 });
});