const request = require('supertest')
const app = require('../../src/app')
const connection = require('../../src/database/connection')

async function populateDatabase() {
  await request(app)
      .post('/ongs')
      .send({ 
        name: "Pets IFPE",
        email: "contato@petsifpe.com.br",
        whatsapp: "81910000000",
        city: "Recife",
        uf: "PE"
      })
}

describe('ONG', () => {
  beforeEach(async () => {
    await connection.migrate.rollback()
    await connection.migrate.latest()
  })

  afterAll(async () => {
    await connection.destroy()
  })

  it('should be able to create a new ONG', async () => {
    const response = await request(app)
      .post('/ongs')
      .send({ 
        name: "Pets IFPE",
        email: "contato@petsifpe.com.br",
        whatsapp: "81910000000",
        city: "Recife",
        uf: "PE"
      })

    expect(response.body).toHaveProperty('id')
    expect(response.body.id).toHaveLength(8)
  })

  it('should be able to list all ONGs', async () => {

    populateDatabase()

    const response = await request(app)
      .get('/ongs')
      .send()

    expect(response.body[0]).toHaveProperty('id')
    expect(response.body[0].id).toHaveLength(8)

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

  
})