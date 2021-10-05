// API REST de Funcionario
import express from 'express'
import sql from 'mssql'
import { sqlConfig } from '../sql/config.js'
const router = express.Router()

/******************************************
 * GET /funcionario
 * Retornar a lista de todos funcionarios
 *****************************************/
router.get("/", (req, res) => {
    try{
        sql.connect(sqlConfig).then(pool => {
            return pool.request()
            .execute('SP_S_FUN_FUNCIONARIO')
        }).then(dados => {
            res.status(200).json(dados.recordset)
        }).catch(err => {
            res.status(400).json(err) //400 - bad request
        })
    } catch (err){
        console.log(err)
    }
})

/******************************************
 * GET /funcionario/:cadastro
 * Retornar um funcionario através do cadastro
 ******************************************/
 router.get("/:cadastro", (req, res) => {
     const cadastro = req.params.cadastro
    try{
        sql.connect(sqlConfig).then(pool => {
            return pool.request()
            .input('cadastro', sql.Int, cadastro)
            .execute('SP_S_FUN_FUNCIONARIO_CADASTRO')
        }).then(dados => {
            res.status(200).json(dados.recordset)
        }).catch(err => {
            res.status(400).json(err) //400 - bad request
        })
    } catch (err){
        console.log(err)
    }
})

/******************************************
 * POST /funcionarios/
 * Insere um novo funcionario
 ******************************************/
router.post("/", (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const {cadastro, nome, cargo, genero, nascimento, rg, email, celular} = req.body
        return pool.request()
        .input('cadastro', sql.Int, cadastro)
        .input('nome', sql.VarChar(50), nome)
        .input('cargo', sql.VarChar(50), cargo)
        .input('genero', sql.VarChar(25), genero)
        .input('nascimento', sql.Date, nascimento)
        .input('rg', sql.Char(12), rg)
        .input('email', sql.VarChar(50), email)
        .input('celular', sql.VarChar(15), celular)        
        .output('codigogerado', sql.Int)
        .execute('SP_I_FUN_FUNCIONARIO')
    }).then(dados => {
        res.status(200).json(dados.output)
    }).catch(err => {
        res.status(400).json(err.message) // Bad request
    })
})

/******************************************
 * PUT /funcionario
 * Altera os dados de um funcionario
 ******************************************/
 router.put("/", (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const {cadastro, nome, cargo, genero, nascimento, rg, email, celular} = req.body
        return pool.request()
        .input('cadastro', sql.Int, cadastro)
        .input('nome', sql.VarChar(50), nome)
        .input('cargo', sql.VarChar(50), cargo)
        .input('genero', sql.VarChar(25), genero)
        .input('nascimento', sql.Date, nascimento)
        .input('rg', sql.Char(12), rg)
        .input('email', sql.VarChar(50), email)
        .input('celular', sql.VarChar(15), celular)
        .execute('SP_U_FUN_FUNCIONARIO')
    }).then(dados => {
        res.status(200).json('Cadastro do funcionario alterado com sucesso!')
    }).catch(err => {
        res.status(400).json(err.message) // Bad request
    })
})

/******************************************
 * DELETE /funcionario/:cadastro
 * Apaga um funcionario pelo cadastro
 ******************************************/
router.delete('/:cadastro', (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const cadastro = req.params.cadastro
        return pool.request()
        .input('cadastro', sql.Int, cadastro)
        .execute('SP_D_FUN_FUNCIONARIO')
    }).then(dados => {
        res.status(200).json('Cadastro do funcionario excluido com sucesso!')
    }).catch(err => {
        res.status(400).json(err.message)
    })
})


export default router