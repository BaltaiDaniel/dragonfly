'use strict';

(function ($) {
	window.addEventListener('load', () => {
		var items = document.querySelectorAll('.fade-in');

		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const customDelay = entry.target.getAttribute('data-delay');
					const delay = customDelay !== null ? parseInt(customDelay) : 0;

					const hideOnCompleteAttrib = entry.target.getAttribute('data-hide-on-complete');
					const hideOnComplete = hideOnCompleteAttrib !== null ? hideOnCompleteAttrib : false;
					

					setTimeout(() => {
						entry.target.classList.add('show');
						// if (hideOnComplete) {
						// 	entry.target.style.display = 'none';
						// }
					}, delay);
					
					observer.unobserve(entry.target);

				}
			});
		}, {
			threshold: 0.1
		});

		items.forEach((el) => observer.observe(el));
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

