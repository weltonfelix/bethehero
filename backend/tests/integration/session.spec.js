const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

describe('ONG', () => {
  beforeEach(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a session', async () => {

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
      .post('/sessions')
      .send({
        id: responseId.body.id
      })

    expect(response.body).toHaveProperty('name')
  })

})