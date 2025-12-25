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

form.addEventListener('submit', async (e) => {
  e.preventDefault()

  const city = cityInput.value.trim() || 'London'
  statusEl.textContent = 'Loading...'
  statusEl.style.color = 'inherit'

  // reset UI
  cityName.textContent = '-'
  temp.textContent = '-'
  desc.textContent = '-'
  icon.style.display = 'none'
  icon.removeAttribute('src')
  aqi.textContent = '-'
  pm25.textContent = '-'
  pm10.textContent = '-'

  try {
    const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`)
    if (!res.ok) throw new Error('Request failed')

    const data = await res.json()

    cityName.textContent = data.city
    temp.textContent = data.temperature?.toFixed(1) ?? '-'
    desc.textContent = data.description ?? '-'

    if (data.icon) {
      icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`
      icon.style.display = 'block'
    }

    aqi.textContent = data.airQualityIndex ?? '-'
    pm25.textContent = data.pm2_5 ?? '-'
    pm10.textContent = data.pm10 ?? '-'

    statusEl.textContent = ''
  } catch (err) {
    console.error(err)
    statusEl.textContent = 'Error loading weather.'
    statusEl.style.color = 'red'
  }
})

// โหลดค่าเริ่มต้นตอนเปิดหน้า
form.dispatchEvent(new Event('submit'))

