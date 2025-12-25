const form = document.getElementById('weatherForm')
const cityInput = document.getElementById('cityInput')
const statusEl = document.getElementById('status')

const cityName = document.getElementById('cityName')
const temp = document.getElementById('temp')
const desc = document.getElementById('desc')
const icon = document.getElementById('icon')

const aqi = document.getElementById('aqi')
const pm25 = document.getElementById('pm25')
const pm10 = document.getElementById('pm10')

async function fetchWeather(city) {
  // Call the backend weather endpoint and map the response for the UI
  const resp = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
  if (!resp.ok) {
    const { message } = await resp
      .json()
      .catch(() => ({ message: 'Request failed' }))
    throw new Error(message)
  }
  return resp.json()
}

function updateWeatherView(data) {
  cityName.textContent = data.city
  temp.textContent = Number.isFinite(data.temperature)
    ? data.temperature.toFixed(1)
    : '-'
  desc.textContent = data.description || '-'
  if (data.icon) {
    icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`
    icon.style.display = 'block'
  } else {
    icon.removeAttribute('src')
    icon.style.display = 'none'
  }

  aqi.textContent = data.airQualityIndex ?? '-'
  pm25.textContent = data.pm2_5 ?? '-'
  pm10.textContent = data.pm10 ?? '-'
}

form.addEventListener('submit', async (event) => {
  event.preventDefault()
  const city = cityInput.value.trim() || 'London'
  statusEl.textContent = 'Loading...'
  statusEl.style.color = 'inherit'

  cityName.textContent = '-'
  temp.textContent = '-'
  desc.textContent = '-'
  icon.removeAttribute('src')
  icon.style.display = 'none'

  aqi.textContent = '-'
  pm25.textContent = '-'
  pm10.textContent = '-'

  try {
    const weather = await fetchWeather(city)
    updateWeatherView(weather)
    statusEl.textContent = ''
  } catch (error) {
    console.error(error)
    statusEl.textContent = 'Error loading weather.'
    statusEl.style.color = 'red'
  }
})

// Display the default city when the page loads
form.dispatchEvent(new Event('submit'))
