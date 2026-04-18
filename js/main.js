'use strict';

(function ($) {
	window.addEventListener('load', ()=>{
		document.querySelectorAll('.fade-in').forEach((el,i)=>{setTimeout(()=>el.classList.add('show'), 120 + i*120)});
		if (window.scrollY >= 100) {
			document.querySelectorAll('.fade-in').forEach((el,i)=>{el.classList.add('show')});
		}
	});


	const navbar = document.getElementById('navbarSelect');
	const THRESHOLD = 100;
	let lastY = window.scrollY || window.pageYOffset;
	let ticking = false;

	function update(){
		const y = window.scrollY || window.pageYOffset;
		if (y >= THRESHOLD) navbar.classList.add('compact');
		else navbar.classList.remove('compact');
		ticking = false;
	}

	function onScroll(){
	lastY = window.scrollY || window.pageYOffset;
		if (!ticking){
			window.requestAnimationFrame(update);
			ticking = true;
		}
	}


	window.addEventListener('scroll', onScroll, {passive:true});
	
	// init on load
	update();



})(jQuery);

