(function ($) {

		const modalContainer = document.getElementById('base-footer');
		
		
		
		modalContainer.innerHTML = '\
			"<div class="margin-empty-large"></div>\
			<div class="margin-bottom-solid"></div>\
			\
			<div class="footer-flex gap-4">\
				<div class="footer-sect">\
					<div class="margin_bottom_s"></div>\
					<h3 class="footer-company-name dark-100">Dragonfly</h3>\
					<p class="text-muted"> <i class="bi-pin-map"></i><span> </span>Nigeria</p>\
					<div class="social-icons-holder">\
						<a href="https://instagram.com/madebydragonfly" class="social-icon"><i class="bi-instagram"></i></a>\
						<a href="https://facebook.com/madebydragonfly" class="social-icon"><i class="bi-facebook"></i></a>\
					</div>\
				</div>\
				\
				<div class="footer-right-items">\
					<div class="footer-sect">\
						<div class="margin_bottom_s"></div>\
						<p class="footer-section-title">Subscribe to Our Newsletter</p>\
						<div class="newsletter-email-sect">\
							<input placeholder="you@example.com" type="email" autocomplete="email" id="newsletterEmailInput">\
							<button class="primary-btn-slim" id="newsletterSubscribeBtn">Subscribe</button>\
						</div>\
					</div>\
					<div class="footer-sect">\
						<div class="margin_bottom_s"></div>\
						<p class="footer-section-title">From Dragonfly Studios</p>\
						<a href="https://baltaidaniel.github.io/dragonfly/get/zenolegends" class="footer-section-item">Zeno Legends</a>\
					</div>\
					<div class="footer-sect">\
						<div class="margin_bottom_s"></div>\
						<p class="footer-section-title">About Dragonfly</p>\
						<a href="https://baltaidaniel.github.io/dragonfly/about" class="footer-section-item">Who We Are</a>\
						<a href="https://baltaidaniel.github.io/dragonfly/about#leadership" class="footer-section-item">Leadership</a>\
					</div>\
				</div>\
				\
				\
				<div class="accordion footer-right-items-mobile" id="accordionGeneral">\
					<div class="accordion-item">\
						<p class="accordion-header footer-section-title-mobile" id="headingOne">\
							<button class="accordion-button collapsed footer-section-title-mobile dark-80" type="button" data-bs-toggle="collapse" data-bs-target="#accordionGeneralOne" aria-expanded="true" aria-controls="accordionGeneralOne">\
								From Dragonfly Studios\
							</button>\
						</p>\
						<div id="accordionGeneralOne" class="accordion-collapse collapse dark-80" aria-labelledby="headingOne" data-bs-parent="#accordionGeneral">\
							<div class="accordion-body">\
								<div class="footer-sect">\
									<a href="https://baltaidaniel.github.io/dragonfly/get/zenolegends" class="footer-section-item">Zeno Legends</a>\
								</div>\
							</div>\
						</div>\
					</div>\
					\
					<div class="accordion-item">\
						<p class="accordion-header footer-section-title-mobile" id="headingTwo">\
							<button class="accordion-button collapsed footer-section-title-mobile dark-80" type="button" data-bs-toggle="collapse" data-bs-target="#accordionGeneralTwo" aria-expanded="false" aria-controls="accordionGeneralTwo">\
									About Dragonfly\
							</button>\
						</p>\
						<div id="accordionGeneralTwo" class="accordion-collapse collapse dark-80" aria-labelledby="headingTwo" data-bs-parent="#accordionGeneral">\
							<div class="accordion-body">\
								<div class="footer-sect">\
									<a href="https://baltaidaniel.github.io/dragonfly/about" class="footer-section-item">\
										Who We Are\
									</a>\
									<a href="https://baltaidaniel.github.io/dragonfly/about#leadership" class="footer-section-item">\
										Leadership\
									</a>\
								</div>\
							</div>\
						</div>\
					</div>\
					\
					<div class="footer-sect">\
						<div class="margin_bottom_s"></div>\
						<div class="margin_bottom_s"></div>\
						<p class="footer-section-title">Subscribe to Our Newsletter</p>\
						<div class="newsletter-email-sect">\
							<input placeholder="Type your email here" type="email" class="email-input" autocomplete="email">\
							<button class="base-btn">Subscribe</button>\
						</div>\
						<div class="margin_bottom_s"></div>\
					</div>\
					\
				</div>\
			</div>\
			\
			<div class="margin-bottom-solid"></div>\
			<div class="footlinks-sect">\
				<p class="footer-copyright-text">\
					Copyright © 2026 Dragonfly Technologies Ltd. All Rights Reserved\
				</p>\
				<div class="footlinks-right-items">\
					<a href="https://baltaidaniel.github.io/dragonfly/terms" class="light-75 footer-section-item">\
						Terms of Use\
					</a>\
					<p class="light-75">\
						|\
					</p>\
					<a href="https://baltaidaniel.github.io/dragonfly/pp" class="light-75 footer-section-item">\
						Privacy Policy\
					</a>\
					<p class="light-75">\
						|\
					</p>\
					<a href="https://baltaidaniel.github.io/dragonfly/about#contact" class="light-75 footer-section-item">\
						Contact Us\
					</a>\
				</div>\
				<div class="footlinks-right-items-mobile">\
					<a href="https://baltaidaniel.github.io/dragonfly/terms" class="light-75 footer-section-item">\
						Terms of Use\
					</a>\
					<a href="https://baltaidaniel.github.io/dragonfly/pp" class="light-75 footer-section-item">\
						Privacy Policy\
					</a>\
					<a href="https://baltaidaniel.github.io/dragonfly/about#contact" class="light-75 footer-section-item">\
						Contact Us\
					</a>\
				</div>\
			</div>';

		
})(jQuery);

