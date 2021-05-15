const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../server')

const api = supertest(app)

test('GET /api/users', async () => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiamFzb24iLCJpYXQiOjE2MjA0NDk5NjV9.HyFlJpiTrmMKOey3T-g2v75BYDoCKXfjhtzuqCJNpSQ"
    await api
        .get('/api/users')
        .set("Authorization", "bearer " + token)
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

// test('token is sent back', async () => {
//     const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoiamFzb24iLCJpYXQiOjE2MjA0NDk5NjV9.HyFlJpiTrmMKOey3T-g2v75BYDoCKXfjhtzuqCJNpSQ"
//     await api
//         .get('/api/users/sent')
//         .set("Authorization", "bearer " + token)
//         .expect(200)
//         .expect('Content-Type', /application\/json/)
// })

afterAll(() => {
    mongoose.connection.close()
})