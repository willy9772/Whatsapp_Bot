const Sequelize = require('sequelize');
const { Model, DataTypes } = require('sequelize');

module.exports = { StartDatabases }

async function StartDatabases() {

    return await new Promise(async (res, rej) => {
        try {

            console.log(`Iniciando a Conexão com o Banco de Dados`)

            const sequelize = await new Sequelize('controlefinanceiro', 'controleFinanceiro', 'controleFinanceiro30392203', {
                timezone: '-03:00',
                host: '10.20.30.17',
                dialect: 'mysql',
                logging: false,
            });

            const mensagensDb = carregar_mensagensDb(sequelize)
            const logsDb = carregar_logsDb(sequelize)
            const mensagensEnviadasDb = carregar_mensagensEnviadasDb(sequelize)

            await sequelize.sync()
                .then(() => {
                    console.log('Tabelas sincronizadas');
                });

            const databases = {
                sequelize: sequelize,
                bds: {
                    mensagensDb: mensagensDb,
                    mensagensEnviadasDb: mensagensEnviadasDb,
                    logsDb: logsDb
                }
            }

            module.exports = { databases }
            console.log(`Banco de dados iniciado com sucesso!`);
            res(true)

        } catch (error) {
            console.log(`Erro ao Iniciar o banco de dados, o erro:\n${error}`);
            rej(`Erro: ${error}`)
        }
    })

}

function carregar_mensagensDb(sequelize) {

    class mensagensDb extends Model { }

    mensagensDb.init({

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        numero: {
            type: DataTypes.STRING,
            primaryKey: false,
            autoIncrement: false
        },

        celular: DataTypes.STRING,

        mensagem: DataTypes.TEXT,

        msgId: DataTypes.STRING,

        status: DataTypes.STRING,

        data: DataTypes.STRING

    }, {
        sequelize,
        modelName: 'mensagensRecebidas',
        timestamps: true
    });

    return mensagensDb

}

function carregar_mensagensEnviadasDb(sequelize) {

    class mensagensDb extends Model { }

    mensagensDb.init({

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        numero: {
            type: DataTypes.STRING,
            primaryKey: false,
            autoIncrement: false
        },

        celular: DataTypes.STRING,

        status: DataTypes.STRING,

        mensagem: DataTypes.TEXT,

        msgId: DataTypes.STRING,

        data: DataTypes.STRING

    }, {
        sequelize,
        modelName: 'mensagensEnviadas',
        timestamps: true
    });

    return mensagensDb

}

function carregar_logsDb (sequelize) {

    class Logs extends Model { }

    Logs.init({

        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        erro: DataTypes.TEXT,

        operaçao: DataTypes.STRING

    }, {
        sequelize,
        modelName: 'Logs',
        timestamps: true
    });

    return Logs

}