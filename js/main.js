'use strict';

var owl = $('.hero__slider');

(function ($) {
	/*------------------
		Background Set
	--------------------*/
	$('.set-bg').each(function () {
		var bg = $(this).data('setbg');
		$(this).css('background-image', 'url(' + bg + ')');
	});

	/*------------------
		Navigation
	--------------------*/
	$(".mobile-menu").slicknav({
		prependTo: '#mobile-menu-wrap',
		allowParentLinks: true
	});


	window.addEventListener('load', ()=>{
		document.querySelectorAll('.fade-in').forEach((el,i)=>{setTimeout(()=>el.classList.add('show'), 120 + i*120)});
	});



	const navbar = document.getElementById('navbar');
	const THRESHOLD = 100;
	let lastY = window.scrollY || window.pageYOffset;
	let ticking = false;

	function update(){
		const y = window.scrollY || window.pageYOffset;
		if (y >= THRESHOLD) navbar.classList.add('compact');
		else navbar.classList.remove('compact');
		// syncBodyPadding();
		ticking = false;
	}

	function onScroll(){
	lastY = window.scrollY || window.pageYOffset;
		if (!ticking){
			window.requestAnimationFrame(update);
			ticking = true;
		}
	}

	// function setNavbarCompact() {
	// 	window.pageYOffset += 101;
	// }


	window.addEventListener('scroll', onScroll, {passive:true});
	
	// init on load
	update();




	const modal = document.getElementById('leadershipModal');
	modal.addEventListener('show.bs.modal', e => {
		const item = e.relatedTarget;
		modal.querySelector('#modalTitle').textContent = item.dataset.title || '';
		modal.querySelector('#modalSubtitle').textContent = item.dataset.subtitle || '';
		modal.querySelector('#modalImg').src = item.dataset.imgsrc || '';
		// modal.querySelector('#modalLink1').innerHTML = item.dataset.modallink1 || '';
		// modal.querySelector('#modalLink2').textContent = item.dataset.modallink2 || '';
		// modal.querySelector('#modalLink3').textContent = item.dataset.modallink2 || '';
	});


	// CookieNoticeManager.new();



})(jQuery);

