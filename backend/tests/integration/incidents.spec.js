const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('Incidents', () => {
  beforeEach(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create an incident', async () => {
    const responseId = await request(app)
      .post('/ongs')
      .send({ 
        name: "Pets IFPE",
        email: "contato@petsifpe.com.br",
        whatsapp: "81910000000",
        city: "Recife",
        uf: "PE"
      })
    
    const response = await request(app)
      .post('/incidents')
      .set({
        Authorization: responseId.body.id,
        'Content-Type': "application/json",
      })
      .send({
        title: "Caso 1",
        description: "Detalhes do caso",
        value	: 120
      })

    expect(response.body).toHaveProperty('id')
  })

  it('should be able to list all incidents', async () => {

    const responseId = await request(app)
      .post('/ongs')
      .send({ 
        name: "Pets IFPE",
        email: "contato@petsifpe.com.br",
        whatsapp: "81910000000",
        city: "Recife",
        uf: "PE"
      })
    
    const responseIncident = await request(app)
      .post('/incidents')
      .set({
        Authorization: responseId.body.id,
        'Content-Type': "application/json",
      })
      .send({
        title: "Caso 1",
        description: "Detalhes do caso",
        value	: 120
      })

    const response = await request(app)
      .get('/incidents')
      .query({ page: 1 })
      .send()

    expect(response.body[0]).toHaveProperty('id')

    expect(response.body[0]).toHaveProperty('ong_id')
    expect(response.body[0].ong_id).toHaveLength(8)

    expect(response.body[0]).toHaveProperty('title')
    expect(response.body[0].title).not.toBeNull()

    expect(response.body[0]).toHaveProperty('description')
    expect(response.body[0].description).not.toBeNull()

    expect(response.body[0]).toHaveProperty('value')
    expect(response.body[0].value).not.toBeNull()

    expect(response.body[0]).toHaveProperty('name')
    expect(response.body[0].name).not.toBeNull()

    expect(response.body[0]).toHaveProperty('email')
    expect(response.body[0].email).not.toBeNull()

    expect(response.body[0]).toHaveProperty('whatsapp')
    expect(response.body[0].whatsapp).not.toBeNull()

    expect(response.body[0]).toHaveProperty('city')
    expect(response.body[0].city).not.toBeNull()

    expect(response.body[0]).toHaveProperty('uf')    
    expect(response.body[0].uf).toHaveLength(2) 
  })

  it('should be able to delete', async () => {
    const responseId = await request(app)
      .post('/ongs')
      .send({ 
        name: "Pets IFPE",
        email: "contato@petsifpe.com.br",
        whatsapp: "81910000000",
        city: "Recife",
        uf: "PE"
      })
    
    const responseIncident = await request(app)
      .post('/incidents')
      .set({
        Authorization: responseId.body.id,
        'Content-Type': "application/json",
      })
      .send({
        title: "Caso 1",
        description: "Detalhes do caso",
        value	: 120
      })
    
    const response = await request(app)
      .delete(`/incidents/${responseIncident.body.id}`)
      .set({
        Authorization: responseId.body.id,
        'Content-Type': "application/json",
      })
      .send()
    
    expect(response.status).toEqual(204)
  })
})