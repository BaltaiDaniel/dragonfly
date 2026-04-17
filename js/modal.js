(function ($) {
	const modal = document.getElementById('leadershipModal1');
	
	const ld1Btn = document.getElementById('showLeadershipModal1Btn');
	const ld1CloseBtn = document.getElementById('leadershipModalCloseBtn1');


	ld1Btn.addEventListener('click', showLeadershipModal1);
	ld1CloseBtn.addEventListener('click', hideLeadershipModal1);

	let scrollPosition = 0;


	
	modal.addEventListener('keydown', (e) => {
	  if (e.key === 'Escape') {
	    hideLeadershipModal1();
	  }
	});


	function showLeadershipModal1() {
		scrollPosition = window.scrollY;
		document.body.style.position = 'fixed';
		document.body.style.top = `-${scrollPosition}px`;
		
		modal.style.display = 'flex';
		modal.classList.add('show');
	}


	function hideLeadershipModal1() {
		document.body.style.position = '';
		document.body.style.top = '';
		window.scrollTo(0, scrollPosition);

		modal.style.display = 'none';
	}

})(jQuery);

