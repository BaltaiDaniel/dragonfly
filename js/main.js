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
	const topNavDropdown = document.getElementById('topNavDropdown');
	const THRESHOLD = 100;
	let lastY = window.scrollY || window.pageYOffset;
	let ticking = false;

	function update(){
		const y = window.scrollY || window.pageYOffset;
		// if (y >= THRESHOLD) navbar.classList.add('compact');
		// else navbar.classList.remove('compact');
		
		if (y >= THRESHOLD) {
			navbar.classList.add('compact');
			topNavDropdown.classList.add('transp');
			// topNavDropdown.style.background = 'transparent';
		}
		else {
			navbar.classList.remove('compact');
			topNavDropdown.classList.remove('transp');
			// topNavDropdown.style.background = '#33333388';
		}
		
		// For Navbar dropdown
		// if (y >= THRESHOLD) topNavDropdown.classList.add('transparent');
		// else topNavDropdown.classList.remove('transparent');
		//

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





	const dropdown = document.getElementById('topNavDropdown');
	const bsCollapse = bootstrap?.Collapse && new bootstrap.Collapse(dropdown, { toggle: false });
	const toggle = document.querySelector('[data-bs-target="#topNavDropdown"], [data-bs-toggle="collapse"][aria-controls="topNavDropdown"]');



	if (!dropdown) return console.warn('No #topNavDropdown found');

	function debug(...args){ console.log('[nav-dropdown]', ...args); }

	// Helper to get pointer coordinates
	function getXY(e){
	const t = e.touches?.[0] ?? e.changedTouches?.[0];
	return {
	  x: t ? t.clientX : e.clientX,
	  y: t ? t.clientY : e.clientY
	};
	}

	// Returns true if the point (from event) is inside element (or its descendants)
	function pointInside(el, e){
	const {x, y} = getXY(e);
	const hit = document.elementFromPoint(x, y);
	return !!(hit && (el === hit || el.contains(hit)));
	}

	// Main handler
	function onPointerDown(e){
	// Only act if dropdown is visible (Bootstrap adds .show)
	if (!dropdown.classList.contains('show')) return;

	const { x, y } = getXY(e);
	const rect = dropdown.getBoundingClientRect();
	debug('event at', x, y, 'dropdown rect', rect);

	// If pointer is inside dropdown or toggle, do nothing
	if (pointInside(dropdown, e) || (toggle && pointInside(toggle, e))) {
	  debug('inside dropdown or toggle — ignore');
	  return;
	}

	// Close when pointer is outside dropdown's vertical bounds
	if (y < rect.top || y > rect.bottom) {
	  debug('outside bounds — closing');
	  // Prefer existing Bootstrap instance if present
	  const inst = window.bootstrap?.Collapse?.getInstance?.(dropdown);
	  if (inst) inst.hide();
	  else {
	    dropdown.classList.remove('show');
	    dropdown.setAttribute('aria-hidden', 'true');
	    if (toggle) toggle.setAttribute('aria-expanded', 'false');
	  }
	} else {
	  debug('within vertical bounds — ignore');
	}
	}

	// Use pointerdown; try non-passive so elementFromPoint works consistently on iOS
	document.addEventListener('pointerdown', onPointerDown, { passive: false });

	// Useful debug listeners you can remove later
	document.addEventListener('pointerdown', e => debug('global pointerdown', e.type, getXY(e)), { passive: true });





	// Close on Escape
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












