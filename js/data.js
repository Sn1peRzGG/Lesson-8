import {
	addTrackDeleteEventListeners,
	convertTime,
	createTracksList,
	downloadJSON,
	loadBands,
} from './script.js'

document.addEventListener('DOMContentLoaded', async function () {
	const container = document.querySelector('.container')

	function checkDirectionBlock(index) {
		return index % 2 === 0 ? 'even' : 'odd'
	}

	function getParticipantsWithoutSoloist(band) {
		return band.participants.filter(
			participant => participant !== band.soloist && participant.trim() !== ''
		)
	}

	function createBandDiv(band, index) {
		const bandDiv = document.createElement('div')
		bandDiv.classList.add('band')
		bandDiv.dataset.id = band.id
		bandDiv.dataset.name = band.bandName

		bandDiv.classList.add(checkDirectionBlock(index))
		let participantsWithoutSoloist = getParticipantsWithoutSoloist(band)

		bandDiv.innerHTML = `
      <div class="img-wrapper" style="${
				band.icon && band.icon !== ''
					? `background-image: url('${band.icon}');`
					: `background-image: url(https://placehold.co/340x340?text=No%20Image)`
			}"></div>

      <div class="title-wrapper">
        <h2>${
					band.bandName != null && band.bandName !== ''
						? band.bandName
						: 'No Name'
				}</h2>
      </div>

      <div class="soloist-name-wrapper">
        <h2>${
					band.soloist != null && band.soloist !== ''
						? band.soloist
						: 'No Soloist'
				}</h2>
        <button class='deleteBandBtn'>Delete Band</button>
      </div>

      <div class="participants-except-soloists-wrapper">
        <p>${
					participantsWithoutSoloist.length > 0
						? participantsWithoutSoloist.join(', ')
						: 'No Other Participants'
				}</p>  
      </div>

      <div class="tracks-list-wrapper">
        <ul class="tracks-list">
          ${createTracksList(band)}
        </ul>
        <button class='addSongBtn'>Add a new song</button>
      </div>`

		return bandDiv
	}

	function addEventListenersToBandDiv(bandDiv) {
		const addSongBtn = bandDiv.querySelector('.addSongBtn')
		addSongBtn.addEventListener('click', function () {
			const bandId = bandDiv.getAttribute('data-id')
			document.querySelector('.add-track-popup').classList.add('active')
			document
				.querySelector('.add-track-popup .close-btn')
				.addEventListener('click', function () {
					document.querySelector('.add-track-popup').classList.remove('active')
				})

			const addTrackBtn = document.querySelector('.add-track-btn')
			addTrackBtn.onclick = function () {
				const trackName = document.getElementById('track-name').value
				const trackDuration = parseInt(
					document.getElementById('track-duration').value,
					10
				)

				const track = {
					name: trackName,
					duration: trackDuration,
				}

				document.getElementById('track-name').value = ''
				document.getElementById('track-duration').value = ''

				let storedData = JSON.parse(localStorage.getItem('bandsData'))
				const band = storedData.find(b => b.id === parseInt(bandId))

				if (band) {
					band.tracks.push(track)
					localStorage.setItem('bandsData', JSON.stringify(storedData))
					const tracksList = bandDiv.querySelector('.tracks-list')
					tracksList.innerHTML += `<li data-track-id="${
						band.tracks.length - 1
					}">${track.name} - ${convertTime(
						track.duration
					)} <button class='deleteSongBtn'>&times;</button></li>`
					addTrackDeleteEventListeners(bandDiv)
				} else {
					console.error(`Band with ID ${bandId} not found`)
				}

				document.querySelector('.add-track-popup').classList.remove('active')
			}
		})

		const deleteBandBtn = bandDiv.querySelector('.deleteBandBtn')
		deleteBandBtn.addEventListener('click', function () {
			const bandId = bandDiv.getAttribute('data-id')
			let storedData = JSON.parse(localStorage.getItem('bandsData'))
			storedData = storedData.filter(b => b.id !== parseInt(bandId))
			localStorage.setItem('bandsData', JSON.stringify(storedData))
			bandDiv.remove()
		})

		addTrackDeleteEventListeners(bandDiv)
	}

	function populateBands(data) {
		container.innerHTML = ''
		data.forEach((band, index) => {
			const bandDiv = createBandDiv(band, index)
			container.appendChild(bandDiv)
			addEventListenersToBandDiv(bandDiv)
		})
	}

	function filterBands(searchTerm) {
		const data = JSON.parse(localStorage.getItem('bandsData'))
		const filteredData = data.filter(band =>
			band.bandName.toLowerCase().includes(searchTerm.toLowerCase())
		)
		populateBands(filteredData)
	}

	document.getElementById('add-band-btn').addEventListener('click', () => {
		document.querySelector('.add-band-popup').classList.add('active')
		document
			.querySelector('.add-band-popup .close-btn')
			.addEventListener('click', function () {
				document.querySelector('.add-band-popup').classList.remove('active')
			})

		const addBandBtn = document.querySelector('.add-band-btn')
		addBandBtn.onclick = function () {
			const bandName = document.getElementById('band-name').value
			const bandIcon = document.getElementById('band-icon').value
			const bandSoloist = document.getElementById('band-soloist').value
			const bandParticipants = document
				.getElementById('band-participants')
				.value.split(',')

			const newBand = {
				id: Date.now(),
				bandName,
				icon: bandIcon,
				soloist: bandSoloist,
				participants: bandParticipants,
				tracks: [],
			}

			document.getElementById('band-name').value = ''
			document.getElementById('band-icon').value = ''
			document.getElementById('band-soloist').value = ''
			document.getElementById('band-participants').value = ''

			let storedData = JSON.parse(localStorage.getItem('bandsData'))
			storedData.push(newBand)
			localStorage.setItem('bandsData', JSON.stringify(storedData))

			const bandDiv = createBandDiv(newBand, storedData.length - 1)
			container.appendChild(bandDiv)
			addEventListenersToBandDiv(bandDiv)

			document.querySelector('.add-band-popup').classList.remove('active')
		}
	})

	document.getElementById('download-btn').addEventListener('click', () => {
		const data = JSON.parse(localStorage.getItem('bandsData'))
		downloadJSON(data, 'bands.json')
	})

	document.getElementById('search-btn').addEventListener('click', () => {
		const searchTerm = document.getElementById('search-input').value
		filterBands(searchTerm)
	})

	document.getElementById('search-input').addEventListener('input', () => {
		const searchTerm = document.getElementById('search-input').value
		filterBands(searchTerm)
	})

	const bandsData = await loadBands()
	populateBands(bandsData)
})
