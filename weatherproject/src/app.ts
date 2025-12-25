import 'dotenv/config'
import express, { Request, Response } from 'express'
import path from 'path'

const app = express()
const port = 3000

app.use(express.static(path.join(__dirname, '../public')))

type WeatherResp = {
  coord: { lon: number; lat: number }
  main: { temp: number }
  weather: { description: string; icon: string }[]
}

type PollutionResp = {
  list: { main: { aqi: number }; components: { pm2_5: number; pm10: number } }[]
}
app.get('/api/weather', async (req: Request, res: Response) => {
  const city = (req.query.city as string) || 'London'
  const appKey = process.env.OPENWEATHER_KEY

  if (!appKey)
    return res.status(500).json({ message: 'Missing OPENWEATHER_KEY' })
  try {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
      city
    )}&units=metric&appid=${appKey}`
    const weatherRes = await fetch(weatherUrl)
    if (!weatherRes.ok) {
      return res.status(502).json({ message: 'Weather API request failed' })
    }
    const weatherData = (await weatherRes.json()) as WeatherResp

    const weatherDetails = weatherData.weather[0]
    if (!weatherDetails) {
      return res
        .status(502)
        .json({ message: 'Weather API returned incomplete data' })
    }

    const { lat, lon } = weatherData.coord
    const pollutionUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${appKey}`
    const pollutionRes = await fetch(pollutionUrl)
    if (!pollutionRes.ok) {
      return res.status(502).json({ message: 'Pollution API request failed' })
    }
    const pollutionData = (await pollutionRes.json()) as PollutionResp
    const pollutionDetails = pollutionData.list[0]
    if (!pollutionDetails) {
      return res
        .status(502)
        .json({ message: 'Pollution API returned incomplete data' })
    }

    return res.json({
      city,
      temperature: weatherData.main.temp,
      description: weatherDetails.description,
      icon: weatherDetails.icon,
      airQualityIndex: pollutionDetails.main.aqi,
      pm2_5: pollutionDetails.components.pm2_5,
      pm10: pollutionDetails.components.pm10,
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Error fetching weather data' })
  }
})

app.listen(port, () => console.log(`http://localhost:${port}`))
