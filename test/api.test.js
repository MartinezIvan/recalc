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
    test("Si a = 0.1 y b = 0.3 deberia responder con un 200 'ok' y el resultado ser la suma de ambos", async () => {
        const app = await api.build()

        let a = 0.1;
        let b = 0.2;

        const res = await request(app)
            .get(`/api/v1/add/${a}/${b}`)
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")
            
        expect(res.body.result).toBeCloseTo(0.3,5)
    })
})

describe("API division", () => {
    test("Si el segundo parametro es 0 deberia responder con un 400 y el correspondiente mensaje de error", async () => {
        const app = await api.build()

        let a = Math.floor(Math.random() * 50);
        let b = 0;

        const res = await request(app)
            .get(`/api/v1/div/${a}/${b}`)
            .expect(400)
            .expect('Content-Type', "text/html; charset=utf-8")

        expect(res.text).toBe("No se puede dividir entre 0!")
    })
    test("Si la operacion es valida, deberia devolver el resultado de la division", async () => {
        const app = await api.build()

        let a = Math.floor(Math.random() * 50);
        let b = Math.floor(Math.random() * 10) + 2;

        const res = await request(app)
            .get(`/api/v1/div/${a}/${b}`)
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")

        expect(res.body.result).toBeLessThan(a)
        expect(typeof (res.body.result)).toBe(typeof(1))
    })
    test("Si el divisor es 1, deberia devolver el primer parametro", async () => {
        const app = await api.build()

        let a = Math.floor(Math.random() * 50);
        let b = 1;

        const res = await request(app)
            .get(`/api/v1/div/${a}/${b}`)
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")

        expect(res.body.result).toBe(a)
        expect(typeof (res.body.result)).toBe(typeof(1))
    })
})

describe("API multiplication", () => {
    test("Si los parametros son decimales, el resultado debe ser decimal.", async () => {
        const app = await api.build()

        let a = Math.floor(Math.random());
        let b = Math.floor(Math.random());

        const res = await request(app)
            .get(`/api/v1/mul/${a}/${b}`)
            .expect(200)
            .expect('Content-Type', "application/json; charset=utf-8")

        expect(res.body.result).toBeLessThan(1);
    })
    test("Si los parametros son decimales, el resultado debe ser decimal.", async () => {
        const app = await api.build()

        let a = "invalidParam"
        let b = Math.floor(Math.random());

        const res = await request(app)
            .get(`/api/v1/mul/${a}/${b}`)
            .expect(400)
            .expect('Content-Type', "text/html; charset=utf-8")

        expect(res.text).toBe('Uno o ambos parametros no son un numero.');
    })
})

describe("API pow", ()=>{
    test("Si el parametro no es un numero responder con un 400", async () => {
        const app = await api.build()

        let a = "NoSoyUnNumero"

        const res = await request(app)
        .get(`/api/v1/pow/${a}`)
        .expect(400)
        .expect('Content-Type', "text/html; charset=utf-8")

        expect(res.text).toBe("El parametro debe ser un numero.")
    })
})