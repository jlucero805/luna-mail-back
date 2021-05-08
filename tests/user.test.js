const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../server')

const api = supertest(app)

test('token is sent back', async () => {
    await api
        .post('/api/auth/login')
        .send({
            username: "jason",
            passHash: "jason"
        })
        .expect(201)
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
})