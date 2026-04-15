(function ($) {
	const ld1Btn = document.getElementById('showLeadershipModal1Btn');
	const ld1CloseBtn = document.getElementById('leadershipModalCloseBtn1');

	ld1Btn.addEventListener('click', showLeadershipModal1);
	ld1CloseBtn.addEventListener('click', hideLeadershipModal1);




	function showLeadershipModal1() {
		const modal = document.getElementById('leadershipModal1');
		modal.style.display = 'flex';

		modal.classList.add('show');
	}


	function hideLeadershipModal1() {
		const modal = document.getElementById('leadershipModal1');
		modal.style.display = 'none';
	}

})(jQuery);

