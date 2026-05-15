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
	const topNavDropdown = document.getElementById('topNavDropdown');
	const THRESHOLD = 100;
	let lastY = window.scrollY || window.pageYOffset;
	let ticking = false;

	function update(){
		const y = window.scrollY || window.pageYOffset;
		
		if (y >= THRESHOLD) {
			navbar.classList.add('compact');
			topNavDropdown.classList.add('transp');
		}
		else {
			navbar.classList.remove('compact');
			topNavDropdown.classList.remove('transp');
		}
		
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
	
	update();



	const dropdown = document.getElementById('topNavDropdown');
	const bsCollapse = bootstrap?.Collapse && new bootstrap.Collapse(dropdown, { toggle: false });
	const toggle = document.querySelector('[data-bs-target="#topNavDropdown"], [data-bs-toggle="collapse"][aria-controls="topNavDropdown"]');



	if (!dropdown) return;

	function getXY(e){
	const t = e.touches?.[0] ?? e.changedTouches?.[0];
	return {
	  x: t ? t.clientX : e.clientX,
	  y: t ? t.clientY : e.clientY
	};
	}

	function pointInside(el, e){
	const {x, y} = getXY(e);
	const hit = document.elementFromPoint(x, y);
	return !!(hit && (el === hit || el.contains(hit)));
	}

	// Main handler
	function onPointerDown(e){
		if (!dropdown.classList.contains('show')) return;

		const { x, y } = getXY(e);
		const rect = dropdown.getBoundingClientRect();

		if (pointInside(dropdown, e) || (toggle && pointInside(toggle, e))) {
		  return;
		}

		if (y < rect.top || y > rect.bottom) {
		  const inst = window.bootstrap?.Collapse?.getInstance?.(dropdown);
		  if (inst) inst.hide();
		  else {
		    dropdown.classList.remove('show');
		    dropdown.setAttribute('aria-hidden', 'true');
		    if (toggle) toggle.setAttribute('aria-expanded', 'false');
		  }
		}
	}


	document.addEventListener('pointerdown', onPointerDown, { passive: false });


	document.addEventListener('pointerdown', e => debug('global pointerdown', e.type, getXY(e)), { passive: true });



	document.addEventListener('keydown', (e) => {
	  if (e.key !== 'Escape' && e.key !== 'Esc') return;
	  // Only act if dropdown is visible
	  if (!dropdown.classList.contains('show')) return;
	  const inst = window.bootstrap?.Collapse?.getInstance?.(dropdown);
	  if (inst) inst.hide();
	  else {
	    dropdown.classList.remove('show');
	    dropdown.setAttribute('aria-hidden', 'true');
	    if (toggle) toggle.setAttribute('aria-expanded', 'false');
	  }
	});





	const btn = document.getElementById('topNavToggle');
	// const navDropdownBg = document.getElementById('navDropdownBg');
	// const navDropdownBgLight = document.getElementById('navDropdownBgLight');


	if (btn && dropdown) {
	  // Update aria when collapse shown/hidden
	  dropdown.addEventListener('show.bs.collapse', () => {
	    btn.classList.add('active');
	    btn.setAttribute('aria-expanded', 'true');
	    btn.innerHTML = '<i class="bi-x"></i>';
	    // navDropdownBg.classList.add('active');
	    // navDropdownBgLight.classList.add('active');
	  });
	  dropdown.addEventListener('shown.bs.collapse', () => {
	    btn.classList.add('active');
	    btn.innerHTML = '<i class="bi-x"></i>';
	    // navDropdownBg.classList.add('active');
	    // navDropdownBgLight.classList.add('active');
	  });
	  dropdown.addEventListener('hide.bs.collapse', () => {
	    btn.classList.remove('active');
	    btn.setAttribute('aria-expanded', 'false');
	    btn.innerHTML = '<i class="bi-list"></i>';
	    // navDropdownBg.classList.remove('active');
	    // navDropdownBgLight.classList.remove('active');
	  });
	  dropdown.addEventListener('hidden.bs.collapse', () => {
	    btn.classList.remove('active');
	    btn.innerHTML = '<i class="bi-list"></i>';
	    // navDropdownBg.classList.remove('active');
	    // navDropdownBgLight.classList.remove('active');
	  });


	  btn.addEventListener('click', () => {
	    btn.classList.toggle('active');
	  });
	}


})(jQuery);
