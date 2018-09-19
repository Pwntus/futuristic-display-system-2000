import storage from 'node-persist'
import express from 'express'
import axios from 'axios'
import currentWeekNumber from 'current-week-number'
import ical from 'node-ical'
import * as CONFIG from './config'

const app = express()
const port = process.env.PORT || 3000

// Init storage
storage.init()

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

const get_card_info = async cid => {
  // Check if card ID is in cache
  const user_name = await storage.getItem(cid)

  // If cache hit, return
  if (typeof user_name !== 'undefined') {
    console.log('Uname HIT!')
    return { user_name }
  }

  // If cache miss, query API
  const card_info = await api('card_info', cid)

  // Store in cache
  await storage.setItem(cid, card_info.user_name, { ttl: 31536000000 }) // TTL: 1Y

  return card_info
}

const get_student_courses = async (cid, user_name) => {
  // Check if card ID is in chache
  let module = await storage.getItem(`${cid}-courses`)

  // If cache hit, return
  if (typeof module !== 'undefined') {
    console.log('Module HIT!')
    return module
  }

  // If cache miss, query API
  const year = (new Date()).getFullYear()
  const semester = (new Date()).getMonth() > 6 ? 'H' : 'V'
  const student_courses = await api('student_courses', user_name, year, semester)
  module = student_courses.emner.map(emne => `${emne.emnekode}-${emne.terminnr}`)

  // Store in cache
  await storage.setItem(`${cid}-courses`, module, { ttl: 604800000 }) // TTL: 1W

  return module
}

const get_ics_timeplan = async (cid, module) => {
  // Check if timeplan in cache
  let data = await storage.getItem(`${cid}-ics`)

  // If cache hit, return
  if (typeof data !== 'undefined') {
    console.log('TP HIT!')
    return data
  }

  // If cache miss, query API
  const year = (new Date()).getFullYear()
  const week = currentWeekNumber()
  const response = await axios.get('http://timeplan.uit.no/calendar.ics', {
    params: { module, year, week }
  })
  data = response.data

  // Store in cache
  await storage.setItem(`${cid}-ics`, data, { ttl: 604800000 }) // TTL: 1W

  return data
}

// Screen data
app.get('/:cid([0-9]{10})', async (req, res, next) => {
  try {
    // Fetch Card ID param
    const { cid } = req.params

    // Get card info
    // await api('card_info', cid)
    const card_info = await get_card_info(cid)

    // Get student info
    // const student_info = await api('student_info', card_info.user_name)

    // Get student courses
    // await api('student_courses', card_info.user_name, year, semester)
    const module = await get_student_courses(cid, card_info.user_name)

    // GET ICS from Timeplan
    const data = await get_ics_timeplan(cid, module)

    // Parse ICS
    ical.parseICS(data, (err, data) => {
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
