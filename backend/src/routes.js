const express = require("express")
const OngController = require("./controllers/OngController")
const IncidentController = require('./controllers/IncidentController')
const ProfileController = require('./controllers/ProfileController')
const SessionController = require('./controllers/SessionController')
const routes = express.Router()

// Login
routes.post('/sessions', SessionController.create)

// List all ONGS
routes.get('/ongs', OngController.index)

// Create ONG
routes.post('/ongs', OngController.create)

// List specific ONG incidents
routes.get('/profile', ProfileController.index)

// List all Incidents
routes.get('/incidents', IncidentController.index)

// Create Incident
routes.post('/incidents', IncidentController.create)

// Delete Incident
routes.delete('/incidents/:id', IncidentController.delete)

module.exports = routes