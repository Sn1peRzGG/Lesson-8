import './data.js'
import './theme.js'

export function convertTime(duration) {
	return `${(duration - (duration % 60)) / 60} min ${duration % 60} sec`
}

export function createTracksList(band) {
	let tracksList = ''

	band.tracks.forEach((track, index) => {
		if (track.name && !isNaN(track.duration)) {
			tracksList += `<li data-track-id="${index}">${track.name} - ${convertTime(
				track.duration
			)} <button class='deleteSongBtn'>&times;</button></li>`
		}
	})

	return tracksList
}

export function addTrackDeleteEventListeners(bandDiv) {
	const deleteSongBtns = bandDiv.querySelectorAll('.deleteSongBtn')
	deleteSongBtns.forEach(btn => {
		btn.addEventListener('click', function () {
			const trackLi = this.closest('li')
			const trackId = parseInt(trackLi.getAttribute('data-track-id'))
			const bandId = parseInt(bandDiv.getAttribute('data-id'))

			let storedData = JSON.parse(localStorage.getItem('bandsData'))
			const band = storedData.find(b => b.id === bandId)

			if (band) {
				band.tracks.splice(trackId, 1)
				localStorage.setItem('bandsData', JSON.stringify(storedData))
				trackLi.remove()
			} else {
				console.error(`Band with ID ${bandId} not found`)
			}
		})
	})

	const deleteBandBtn = bandDiv.querySelector('.deleteBandBtn')
	deleteBandBtn.addEventListener('click', function () {
		const bandId = bandDiv.getAttribute('data-id')
		let storedData = JSON.parse(localStorage.getItem('bandsData'))
		storedData = storedData.filter(b => b.id !== parseInt(bandId))
		localStorage.setItem('bandsData', JSON.stringify(storedData))
		bandDiv.remove()
	})
}

export function downloadJSON(data, filename) {
	const dataStr =
		'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data))
	const downloadAnchorNode = document.createElement('a')
	downloadAnchorNode.setAttribute('href', dataStr)
	downloadAnchorNode.setAttribute('download', filename)
	document.body.appendChild(downloadAnchorNode) // required for firefox
	downloadAnchorNode.click()
	downloadAnchorNode.remove()
}

export async function loadBands() {
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

		return data
	} catch (error) {
		console.error('Error loading bands data:', error)
	}
}
