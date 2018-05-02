import express from 'express'
import db from 'sqlite'
import Promise from 'bluebird'
import axios from 'axios'

const app = express()
const port = process.env.PORT || 3002

// Enable JSON request body
app.use(express.json())

// Enable CORS
app.use(async (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

// API middleware
app.use('/:cid([0-9]{10})', async (req, res, next) => {
  try {
    const user = await db.get('SELECT * FROM User WHERE cid = ?', req.params.cid)

    // User not found, create it
    if (typeof user === 'undefined')
      await db.run('INSERT INTO User (cid) VALUES (?)', req.params.cid)

    next()
  } catch (err) {
    next(err)
  }
})

app.route('/:cid([0-9]{10})')
  
  // Fetch subject list
  .get(async (req, res, next) => {
    try {
      const subjects = await db.all(`
        SELECT s.id, s.label
        FROM Subject s
        INNER JOIN User u
          ON u.id = s.uid
        WHERE u.cid = ?
      `, req.params.cid)
      res.status(200).send(subjects)
    } catch (err) {
      next(err)
    }
  })

  // Add subject
  .post(async (req, res, next) => {
    try {
      if (!req.body.hasOwnProperty('label')) {
        next('Label required')
        return
      }

      const subjects = await db.run(`
        INSERT INTO Subject (uid, label)
        SELECT id, ?
        FROM User
        WHERE cid = ?
      `, req.body.label, req.params.cid)
      res.status(200).send()
    } catch (err) {
      next(err)
    }
  })

  // Delete subject
  .delete(async (req, res, next) => {
    try {
      if (!req.body.hasOwnProperty('id')) {
        next('ID required')
        return
      }

      await db.run(`
        DELETE FROM Subject
        WHERE uid IN (
          SELECT s.uid
          FROM Subject s
          INNER JOIN User u
            ON u.id = s.uid
          WHERE u.cid = ?
        )
        AND id = ?
      `, req.params.cid, req.body.id)
      res.status(200).send()
    } catch (err) {
      next(err)
    }
  })

  // Update name
  .put(async (req, res, next) => {
    res.status(200).send()
  })

app.get('/search/:term', async (req, res, next) => {
  try {
    const response = await axios.get(`http://timeplan.uit.no/emne_search.php?year=2018&term=${req.params.term}`)
    const output = response.data.reduce((a, b) => {
      a.push(b.id)
      return a
    }, [])
    res.status(200).send(output)
  } catch (err) {
    next(err)
  }
})

// Error
app.use(async (err, req, res, next) => {
  console.error(err)
  res.status(403).send()
})

// Route not found
app.use(async (req, res, next) => {
  res.status(404).send()
})

Promise.resolve()
  .then(() => db.open('./database.sqlite', { Promise }))
  .then(() => db.migrate({ force: false }))
  .catch(e => console.error(e.stack))
  .finally(() => app.listen(port))
