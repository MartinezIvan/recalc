const { seed } = require('../src/seed.js')
const {
    createHistoryEntry,
    History,
    Operation, deleteHistory
} = require('../src/models.js')

beforeEach(async () => {
    await seed()
})

describe("History", () => {
    test("Deberia poder crear una resta en el history", async () => {
        await createHistoryEntry({
            firstArg: 2,
            secondArg: 2,
            result: 0,
            operationName: "SUB"
        })

        const histories = await History.findAll({
            include: [Operation]
        })

        expect(histories.length).toEqual(1)
        expect(histories[0].firstArg).toEqual(2)
        expect(histories[0].result).toEqual(0)
        expect(histories[0].Operation.name).toEqual("SUB")
    })
    test("Deberia borrar todo el historial", async () => {
        await createHistoryEntry({
            firstArg: 2,
            secondArg: 2,
            result: 4,
            operationName: "ADD"
        })

        await createHistoryEntry({
            firstArg: 2,
            secondArg: 2,
            result: 0,
            operationName: "SUB"
        })

        const historiesBeforeDelete = await History.findAll({
            include: [Operation]
        })

        await deleteHistory();

        const historiesAfterDelete = await History.findAll({
            include: [Operation]
        })


        expect(historiesBeforeDelete.length).toEqual(2)
        expect(historiesAfterDelete.length).toEqual(0)
    })
})

describe("History", () => {
    test("Deberia poder crear entrada en el history con el segundo parametro", async () => {
        await createHistoryEntry({
            firstArg: 2,
            secondArg: 2,
            result: 4,
            operationName: "ADD"
        })

        const histories = await History.findAll({
            include: [Operation]
        })

        expect(histories.length).toEqual(1)
        expect(histories[0]).toBeInstanceOf(History)
        expect(histories[0]).toHaveProperty('secondArg')
        expect(histories[0].secondArg).toEqual(2)
        expect(histories[0].Operation.name).toEqual("ADD")
    })
})