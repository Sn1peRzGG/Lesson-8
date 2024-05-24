let response = await fetch('./data/bands.json')
let data = await response.json()

const container = document.querySelector('.container')
const participantsExceptSoloists = []

function checkDirectionBlock(index) {
	return index % 2 === 0 ? 'even' : 'odd'
}

function getParticipantsWithoutSoloist(band) {
	return band.participants.filter(
		participant => participant !== band.soloist && participant.trim() !== ''
	)
}

function createTracksList(band) {
	let tracksList = ''

	band.tracks.forEach(track => {
		if (track.name && track.duration) {
			tracksList += `<li>${track.name} - ${
				(track.duration - (track.duration % 60)) / 60
			} min ${track.duration % 60} sec</li>`
		}
	})

	return tracksList
}

function createBandDiv(band, index) {
	const bandDiv = document.createElement('div')
	bandDiv.classList.add('band')

	bandDiv.classList.add(checkDirectionBlock(index))
	let participantsWithoutSoloist = getParticipantsWithoutSoloist(band)

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
				${createTracksList(band)}
			</ul>
		</div>`

	return bandDiv
}

data.forEach((band, index) => {
	container.appendChild(createBandDiv(band, index))
})
