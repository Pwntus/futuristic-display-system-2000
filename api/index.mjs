import express from 'express'
import axios from 'axios'
import currentWeekNumber from 'current-week-number'
import ical from 'node-ical'
import * as CONFIG from './config'

const app = express()
const port = process.env.PORT || 3000

// Enable CORS
app.use(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, X-API-KEY')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')

  // Intercept OPTIONS method
  if ('OPTIONS' == req.method) {
    res.status(200).send()
  } else {
    next()
  }
})

// API key middleware
app.use(async (req, res, next) => {
  try {
    if (!req.headers['x-api-key'] || !CONFIG.API_KEYS.includes(req.headers['x-api-key']))
      res.status(403).send()
    else
      next()
  } catch (err) {
    next(err)
  }
})

const api = async (endpoint, ...params) => {
  try {
    const response = await axios.get(`${CONFIG.API_ENDPOINT}/${endpoint}/${params.join('/')}`, {
      headers: {
        'X-API-KEY': CONFIG.API_KEY
      }
    })
    return response.data
  } catch (e) {
    console.error(e)
  }
}

// Screen data
app.get('/:cid([0-9]{10})', async (req, res, next) => {
  try {
    // Fetch Card ID param
    const cid = req.params.cid

    // Get card info
    const card_info = await api('card_info', cid)

    // Get student info
    const student_info = await api('student_info', card_info.user_name)

    // Get student courses
    const year = (new Date()).getFullYear()
    const semester = (new Date()).getMonth() > 6 ? 'H' : 'V'
    const student_courses = await api('student_courses', card_info.user_name, year, semester)

    // Generate ICS data
    const module = student_courses.emner.map(emne => `${emne.emnekode}-${emne.terminnr}`)
    const week = currentWeekNumber()

    // Get ICS
    const response = await axios.get('http://timeplan.uit.no/calendar.ics', {
      params: { module, year, week }
    })

    // Parse ICS
    ical.parseICS(response.data, (err, data) => {
      if (err)
        next(err)
      
      res.status(200).send(data)
    })
  } catch (err) {
    next(err)
  }
})

// Error
app.use(async (err, req, res, next) => {
  console.error(err)
  res.status(403).send()
})

app.listen(port)
