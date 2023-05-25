const request = require('supertest');
const api = require('../src/api.js');
const { seed } = require('../src/seed.js')

beforeEach(async () => {
    await seed()
})

describe("API substract", () => {
    test("Deberia responder con un 200 ok", async () => {
        const app = await api.build()

        const res = await request(app)
            .get('/api/v1/sub/2/1')
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            
        expect(res.body.result).toEqual(1)
    })
})

describe("API addition", () => {
    test("Si el segundo parametro es negativo deberia responder con un 200 'ok' y el resultado ser menor a 'a'", async () => {
        const app = await api.build()

        let a = Math.floor(Math.random() * 50);
        let b = Math.floor(Math.random() * -50);

        const res = await request(app)
            .get(`/api/v1/add/${a}/${b}`)
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            
        expect(res.body.result).toBeLessThan(a)
    })
})
