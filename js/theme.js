window.onload = function () {
	const toggle = document.getElementById('toggle')

	function applyColorScheme(scheme) {
		document.body.classList.remove('dark', 'light')
		document.body.classList.add(scheme)
		toggle.checked = scheme === 'dark'
	}

	if (window.matchMedia) {
		const darkSchemeMediaQuery = window.matchMedia(
			'(prefers-color-scheme: dark)'
		)
		applyColorScheme(darkSchemeMediaQuery.matches ? 'dark' : 'light')

		darkSchemeMediaQuery.addEventListener('change', function (e) {
			applyColorScheme(e.matches ? 'dark' : 'light')
		})
	} else {
		applyColorScheme('light')
	}

	toggle.addEventListener('change', function (e) {
		if (e.target.checked) {
			applyColorScheme('dark')
		} else {
			applyColorScheme('light')
		}
	})
}
