const glow=document.querySelector('.cursor-glow');window.addEventListener('pointermove',e=>{glow.style.left=e.clientX+'px';glow.style.top=e.clientY+'px'});const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

const backdrop=document.querySelector('.drawer-backdrop');
const drawers=[...document.querySelectorAll('.drawer')];
let activeDrawer=null;
let lastTrigger=null;

function closeDrawer(){
	if(!activeDrawer)return;
	activeDrawer.classList.remove('is-open');
	activeDrawer.setAttribute('aria-hidden','true');
	activeDrawer.inert=true;
	document.querySelector(`[aria-controls="${activeDrawer.id}"]`).setAttribute('aria-expanded','false');
	activeDrawer=null;
	backdrop.hidden=true;
	document.documentElement.classList.remove('drawer-open');
	lastTrigger?.focus();
}

function openDrawer(drawer,trigger){
	if(activeDrawer)closeDrawer();
	lastTrigger=trigger;
	activeDrawer=drawer;
	backdrop.hidden=false;
	document.documentElement.classList.add('drawer-open');
	drawer.inert=false;
	drawer.setAttribute('aria-hidden','false');
	trigger.setAttribute('aria-expanded','true');
	requestAnimationFrame(()=>drawer.classList.add('is-open'));
	drawer.querySelector('.drawer-close').focus();
}

document.querySelectorAll('.drawer-trigger').forEach(trigger=>{
	trigger.addEventListener('click',()=>{
		const drawer=document.getElementById(trigger.getAttribute('aria-controls'));
		if(activeDrawer===drawer)closeDrawer();
		else openDrawer(drawer,trigger);
	});
});

drawers.forEach(drawer=>{
	drawer.querySelector('.drawer-close').addEventListener('click',closeDrawer);
	drawer.querySelectorAll('.drawer-links a').forEach(link=>link.addEventListener('click',closeDrawer));
});

backdrop.addEventListener('click',closeDrawer);
document.addEventListener('keydown',event=>{
	if(!activeDrawer)return;
	if(event.key==='Escape')closeDrawer();
	if(event.key!=='Tab')return;
	const focusable=[...activeDrawer.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),textarea:not([disabled])')];
	const first=focusable[0];
	const last=focusable[focusable.length-1];
	if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
	else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
});

