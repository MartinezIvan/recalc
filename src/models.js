import { Sequelize, DataTypes } from 'sequelize';

const inTest = process.env.NODE_ENV === 'test';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    logging: !inTest,
    storage: inTest ? './db.sqlite3' : './db.sqlite3'
})

export const History = sequelize.define('History', {
    firstArg: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    secondArg: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    result: {
        type: DataTypes.NUMBER,
        allowNull: true
    },
    error: {
        type: DataTypes.TEXT,
        allowNull: true
    }
});

export const Operation = sequelize.define('Operation', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

Operation.hasMany(History)
History.belongsTo(Operation)

export async function createHistoryEntry({ firstArg, secondArg, operationName, result }) {
    const operation = await Operation.findOne({
        where: {
            name: operationName
        }
    });
    return History.create({
        firstArg: firstArg,
        secondArg: secondArg,
        result: result,
        OperationId: operation.id
    })
}

export async function createErrorHistoryEntry({ firstArg, secondArg, operationName, error }) {
    const operation = await Operation.findOne({
        where: {
            name: operationName
        }
    });

    return History.create({
        firstArg: firstArg,
        secondArg: secondArg,
        error: error,
        OperationId: operation.id
    })
}

export async function deleteHistory(){
    await History.destroy({
        where: {},
        truncate: true
    })
}

export function createTables() {
    return Promise.all([
        History.sync({ force: true }),
        Operation.sync({ force: true })
    ]);
}

export function findAll(){
    return History.findAll({
        include: [Operation]
    })
}