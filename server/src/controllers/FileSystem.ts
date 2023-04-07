import { Request, Response, Router } from "express"
import { PrismaClient } from "@prisma/client"

const prisma: PrismaClient = new PrismaClient()

/**
 * Get all FileSystem
 * @param {Request} req 
 * @param {Response} res 
 */
const getAll = (req: Request, res: Response) => {
    try {
        prisma.fileSystem.findMany().then(fileSystems => {
            res.status(200).send({ data: fileSystems })
        }).catch(err => {
            console.log(err)
            res.status(500).send({ message: err.meta.cause })
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: "An error occured" })
    }
}

/**
 * Get one FileSystem by Id
 * @param {Request} req 
 * @param {Response} res 
 */
const getOneById = (req: Request, res: Response) => {
    try {

        // Convert :id to number
        let reqId = Number.parseInt(req.params.id)

        // Check if the :id is a number
        if (Number.isNaN(reqId)) {
            res.status(400).send({ message: "Invalid :id parameter" })
        } else {

            // Find the matching FileSystem
            prisma.fileSystem.findUnique({
                where: { id: reqId },
                include: {
                    directories: true
                }
            }).then(fileSystem => {
                let status = (fileSystem === null) ? 404 : 200
                let data = (fileSystem === null) ? { message: "No FileSystem found" } : { data: fileSystem }
                res.status(status).send(data)
            }).catch(err => {
                console.log(err)
                res.status(500).send({ message: err.meta.cause })
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: "An error occured" })
    }
}

/**
 * Create one FileSystem
 * @param {Request} req 
 * @param {Response} res 
 */
const createOne = (req: Request, res: Response) => {
    try {

        // Request data
        let reqData = req.body
        let requiredFields = ['name', 'enabled']
        for (const key in reqData) {
            if (!requiredFields.includes(key)) {
                res.status(400).send({ message: `The field '${key}' is illegal` })
                return
            }
        }

        prisma.fileSystem.create({
            data: {
                name: reqData.name,
                enabled: reqData.enabled,
            }
        }).then(fileSystem => {
            let status = (fileSystem === null) ? 500 : 200
            let data = (fileSystem === null) ? { message : "An error occured" } : {
                message: "Created FileSystem successfully",
                data: fileSystem
            }
            res.status(status).send(data)
        }).catch(err => {
            console.log(err)
            res.status(500).send({ message: err.meta.cause })
        })
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: "An error occured" })
    }
}

/**
 * Update one FileSystem
 * @param {Request} req 
 * @param {Response} res 
 */
const updateOneById = (req: Request, res: Response) => {
    try {

        // Convert :id to number
        let reqId = Number.parseInt(req.params.id)

        // Check if the :id is a number
        if (Number.isNaN(reqId)) {
            res.status(400).send({ message: "Invalid :id parameter" })
        } else {
            
            // Request data
            let reqData = req.body
            let allowedFields = ['name', 'enabled']
            for (const key in reqData) {
                if (!allowedFields.includes(key)) {
                    res.status(400).send({ message: `The field '${key}' is not allowed` })
                    return
                }
            }

            // Try to update the filesystem with given id
            prisma.fileSystem.update({
                where: { id: reqId },
                data: reqData
            }).then(fileSystem => {
                let status = (fileSystem === null) ? 500 : 200
                let data = (fileSystem === null) ? { message : "An error occured" } : {
                    message: `Updated FileSystem #${reqId} successfully`,
                    data: fileSystem
                }
                res.status(status).send(data)
            }).catch(err => {
                console.log(err)
                res.status(500).send({ message: err.meta.cause })
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: "An error occured" })
    }
}

/**
 * Delete one FileSystem
 * @param {Request} req 
 * @param {Response} res 
 */
const deleteOneById = (req: Request, res: Response) => {
    try {

        // Convert :id to number
        let reqId = Number.parseInt(req.params.id)

        // Check if the :id is a number
        if (Number.isNaN(reqId)) {
            res.status(400).send({ message: "Invalid :id parameter" })
        } else {
            prisma.fileSystem.delete({
                where: { id: reqId }
            }).then(() => {
                res.status(200).send({ message: `Successfully deleted FileSystem #${reqId}` })
            }).catch(err => {
                console.log(err)
                res.status(500).send({ message: err.meta.cause })
            })
        }
    } catch (e) {
        console.log(e)
        res.status(500).send({ message: "An error occured" })
    }
}

export {
    getAll,
    getOneById,
    createOne,
    updateOneById,
    deleteOneById
}