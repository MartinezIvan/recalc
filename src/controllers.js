import express from 'express';
import core from './core.js';

import {createErrorHistoryEntry, createHistoryEntry} from './models.js'

const router = express.Router();

const OperationType  = {
    SUB: 'SUB',
    ADD: 'ADD',
    POW: 'POW',
    MUL: 'MUL',
    DIV: 'DIV'
}

router.get("/sub/:a/:b", async function (req, res) {
    try {
        const params = getRequestParameters(req, res);
        const result = core.sub(params.a, params.b);
        await createHistoryEntry({
            firstArg: params.a,
            secondArg: params.b,
            operationName: OperationType.SUB,
            result:result
        })
        return res.send({result});
    } catch (e) {
        await createErrorHistoryEntry({
            operationName: OperationType.SUB,
            error: e.message
        })
        res.status(400).send(e.message);
    }
});

router.get("/add/:a/:b", async function (req, res) {
    try {
        const params = getRequestParameters(req, res);
        const result = core.add(params.a, params.b);
        await createHistoryEntry(
            {
                firstArg: params.a,
                secondArg: params.b,
                operationName: OperationType.ADD,
                result: result
            })
        return res.send({result})
    } catch (e) {
        await createErrorHistoryEntry({
            operationName: OperationType.ADD,
            error: e.message
        })
        res.status(400).send(e.message);
    }
});

router.get("/div/:a/:b", async function (req, res) {
    try {
        const params = getRequestParameters(req, res);
        const result = core.div(params.a, params.b);
        return res.send({result})
    } catch (e) {
        await createErrorHistoryEntry({
            operationName: OperationType.DIV,
            error: e.message
        })
        res.status(400).send(e.message);
    }
});

router.get("/mul/:a/:b", async function (req, res) {
    try {
        const params = getRequestParameters(req, res);
        const result = core.mul(params.a, params.b);
        return res.send({result})
    } catch (e) {
        await createErrorHistoryEntry({
            operationName: OperationType.MUL,
            error: e.message
        })
        res.status(400).send(e.message);
    }
});

router.get("/pow/:a", async function (req, res) {
    const a = Number(req.params.a);
    if (isNaN(a)) {
        await createErrorHistoryEntry({
            operationName: OperationType.POW,
            error: 'El parametro debe ser un numero.'
        });
        return res.status(400).send('El parametro debe ser un numero.');
    }
    const result = core.pow(a);
    await createHistoryEntry({firstArg: a, operationName:"POW"})
    return res.send({result})
});

function getRequestParameters(req) {
    const a = Number(req.params.a);
    const b = Number(req.params.b);
    if (isNaN(a) || isNaN(b))
        throw new Error('Uno o ambos parametros no son un numero.');
    return {a, b}
}

export default router;