const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('Profile', () => {
  beforeEach(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to list specific ONG incidents', async () => {
    const responseId = await request(app)
      .post('/ongs')
      .send({ 
        name: "Pets IFPE",
        email: "contato@petsifpe.com.br",
        whatsapp: "81910000000",
        city: "Recife",
        uf: "PE"
      })

    const createIncidents = await request(app)
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
      .get('/profile')
      .set({ Authorization: responseId.body.id })
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
  })

  
})