import './data.js'
import './theme.js'

async function loadBands() {
	try {
		let data

		// Check if data is available in localStorage
		const storedData = localStorage.getItem('bandsData')
		if (storedData) {
			data = JSON.parse(storedData)
		} else {
			const response = await fetch('./data/bands.json')
			data = await response.json()
			localStorage.setItem('bandsData', JSON.stringify(data))
		}

		populateBands(data)
	} catch (error) {
		console.error('Error loading bands data:', error)
	}
}

const container = document.querySelector('.container')

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
	bandDiv.dataset.id = band.id
	bandDiv.dataset.name = band.bandName

	bandDiv.classList.add(checkDirectionBlock(index))
	let participantsWithoutSoloist = getParticipantsWithoutSoloist(band)

	bandDiv.innerHTML = `
        <div class="img-wrapper" style="${
					band.icon && band.icon !== ''
						? `background-image: url('${band.icon}');`
						: `background-image: url(https://placehold.co/340x340?text=${encodeURIComponent(
								band.bandName
						  )})`
				}"></div>

        <div class="title-wrapper">
            <h2>${
							band.bandName != null && band.bandName !== ''
								? band.bandName
								: 'No Name'
						}</h2>
        </div>

        <div class="soloist-name-wrapper"><h2>${
					band.soloist != null && band.soloist !== ''
						? band.soloist
						: 'No Soloist'
				}</h2></div>

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

function populateBands(data) {
	container.innerHTML = '' // Clear previous content
	data.forEach((band, index) => {
		container.appendChild(createBandDiv(band, index))
	})

	const addSongBtns = document.querySelectorAll('.addSongBtn')
	addSongBtns.forEach(btn => {
		btn.addEventListener('click', function () {
			const bandId = btn.closest('.band').dataset.id
			document.querySelector('.popup').classList.add('active')
			document
				.querySelector('.popup .close-btn')
				.addEventListener('click', function () {
					document.querySelector('.popup').classList.remove('active')
				})

			const addBtn = document.querySelector('.add-btn')
			addBtn.addEventListener('click', function () {
				const songName = document.getElementById('song-name').value
				const songDuration = parseInt(
					document.getElementById('song-duration').value,
					10
				)

				const song = {
					name: songName,
					duration: songDuration,
				}

				let storedData = JSON.parse(localStorage.getItem('bandsData'))
				console.log(storedData) // Debugging line to check the data structure
				console.log(`Searching for band with ID: ${bandId}`) // Debugging line

				const band = storedData.find(b => b.id === parseInt(bandId))

				if (band) {
					band.tracks.push(song)
					localStorage.setItem('bandsData', JSON.stringify(storedData))
					populateBands(storedData) // Re-render bands
				} else {
					console.error(`Band with ID ${bandId} not found`)
				}

				document.querySelector('.popup').classList.remove('active')
			})
		})
	})
}

function downloadJSON(data, filename) {
	const dataStr =
		'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
	const downloadAnchorNode = document.createElement('a')
	downloadAnchorNode.setAttribute('href', dataStr)
	downloadAnchorNode.setAttribute('download', filename)
	document.body.appendChild(downloadAnchorNode) // required for firefox
	downloadAnchorNode.click()
	downloadAnchorNode.remove()
}

document.getElementById('download-btn').addEventListener('click', () => {
	const data = JSON.parse(localStorage.getItem('bandsData'))
	downloadJSON(data, 'bands.json')
})

loadBands()
