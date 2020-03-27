const express = require("express")
const { celebrate, Segments, Joi } = require('celebrate')

const OngController = require("./controllers/OngController")
const IncidentController = require('./controllers/IncidentController')
const ProfileController = require('./controllers/ProfileController')
const SessionController = require('./controllers/SessionController')
const routes = express.Router()

// Login
routes.post('/sessions', celebrate({
  [Segments.BODY]: Joi.object().keys({
    id: Joi.string().length(8).required()
  })
}), SessionController.create)

// List all ONGS
routes.get('/ongs', OngController.index)

// Create ONG
routes.post('/ongs', celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    whatsapp: Joi.number().required().min(10).max(11),
    city: Joi.string().required(),
    uf: Joi.string().required().length(2)
  })
}), OngController.create)

// List specific ONG incidents
routes.get('/profile', celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().length(8).required(),
  }).unknown()
}), ProfileController.index)

// List all Incidents
routes.get('/incidents', celebrate({
  [Segments.QUERY]: Joi.object().keys({
    page: Joi.number()
  })
}), IncidentController.index)

// Create Incident
routes.post('/incidents', celebrate({
  [Segments.HEADERS]: Joi.object({ 
    authorization: Joi.string().length(8).required()
   }).unknown(),
  [Segments.BODY]: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    value: Joi.number().min(0).required()
  })
}), IncidentController.create)

// Delete Incident
routes.delete('/incidents/:id', celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    id: Joi.number().required()
  })
}), IncidentController.delete)

module.exports = routes