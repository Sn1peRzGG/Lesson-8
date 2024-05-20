let response = await fetch('./data/bands.json')
let data = await response.json()

const container = document.querySelector('.container')
const participantsExceptSoloists = []

data.forEach((band, index) => {
	const bandDiv = document.createElement('div')
	bandDiv.classList.add('band')

	if (index % 2 === 0) {
		bandDiv.classList.add('even')
	} else {
		bandDiv.classList.add('odd')
	}

	const participantsWithoutSoloist = band.participants.filter(
		participant => participant !== band.soloist && participant.trim() !== ''
	)

	let tracksList = ''
	band.tracks.forEach(track => {
		if (track.name && track.duration) {
			const minutes = (track.duration - (track.duration % 60)) / 60
			const seconds = track.duration % 60
			tracksList += `<li>${track.name} - ${minutes} min ${seconds} sec</li>`
		} else {
		}
	})

	bandDiv.innerHTML = `
	<div class="img-wrapper" style="${
		band.icon != null && band.icon !== ''
			? `background-image: url('${band.icon}');`
			: `background-image: url('https://placehold.co/600x400?text=No%20Image');`
	}"></div>


		<div class="title-wrapper">
			<h2>${band.bandName}</h2>
		</div>

		<div class="soloist-name-wrapper"><h2>${band.soloist}</h2></div>

		<div class="participants-except-soloists-wrapper">
			<p>
			${
				participantsWithoutSoloist.length > 0
					? participantsWithoutSoloist.join(', ')
					: 'No other participants'
			}
			</p>	
		</div>

		<div class="tracks-list-wrapper">
			<ul class="tracks-list">
				${tracksList}
			</ul>
		</div>`

	container.appendChild(bandDiv)
})
