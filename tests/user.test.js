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

test('GET /api/users', async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiamFzb24iLCJpYXQiOjE2MjA0NDk5NjV9.HyFlJpiTrmMKOey3T-g2v75BYDoCKXfjhtzuqCJNpSQ"
    await api
        .get('/api/users')
        .set("Authorization", "bearer " + token)
        .expect(200, {name: { name: "jason", iat: 1620449965}})
        .expect('Content-Type', /application\/json/)
})

afterAll(() => {
    mongoose.connection.close()
})