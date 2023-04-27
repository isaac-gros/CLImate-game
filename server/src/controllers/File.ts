import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma: PrismaClient = new PrismaClient()

/**
 * Get all File
 * @param {Request} req 
 * @param {Response} res 
 */
const getAllByDirectory = (req: Request, res: Response) => {
    try {
        let directoryId = 0

        // Try to convert param directoryId to number
        if (typeof(req.query.directoryId) === 'string') {
            directoryId = Number.parseInt(req.query.directoryId)
        }

        // Send 404 if directoryId is not a valid parameter
        if (Number.isNaN(directoryId) || directoryId === 0) {
            res.status(400).send({ message: "Invalid directoryId parameter" })
            return
        }

        // Find every directory depending on given directoryId
        prisma.file.findMany({
            where: {
                directory_id: directoryId
            }
        }).then(files => {
            if (files.length > 0) {
                res.status(200).send({ data: files })
            } else {
                res.status(404).send({ message: "No records found with given parameters" })
            }
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
 * Get one File by Id
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

            // Find the matching file
            prisma.file.findUnique({
                where: { id: reqId },
                include: {
                    directory: true
                }
            }).then(file => {
                let status = (file === null) ? 404 : 200
                let data = (file === null) ? { message: "No File found" } : { data: file }
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
 * Create one File
 * @param {Request} req 
 * @param {Response} res 
 */
const createOne = (req: Request, res: Response) => {
    try {

        // Request data
        let reqData = req.body

        // Check if required fields are not missing
        let missingFields = []
        let submittedFields = Object.keys(reqData)
        let requiredFields = ['directory', 'name', 'content']
        for (const key in requiredFields) {
            if (!submittedFields.includes(requiredFields[key])) {
                missingFields.push(requiredFields[key])
            }
        }

        if (missingFields.length > 0) {
            res.status(400).send({ message: `Missing fields: ${missingFields.join(', ')}`})
            return
        }

        // Check if submitted fields are allowed
        let allowedFields = [...requiredFields, 'permissions']
        for (const key in reqData) {
            if (!allowedFields.includes(key)) {
                res.status(400).send({ message: `The field '${key}' is illegal` })
                return
            }
        }

        prisma.file.create({
            data: {
                directory: { connect: { id: reqData.directory }},
                name: reqData.name,
                content: reqData.content,
                permissions: Number.parseInt(reqData.permissions) ?? undefined,
            }
        }).then(file => {
            let status = (file === null) ? 500 : 200
            let data = (file === null) ? { message : "An error occured" } : {
                message: "Created File successfully",
                data: file
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
 * Update one File
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
            let allowedFields = ['content', 'name', 'permissions', 'directory']
            for (const key in reqData) {
                if (!allowedFields.includes(key)) {
                    res.status(400).send({ message: `The field '${key}' is not allowed` })
                    return
                }
            }

            // Try to update the File with given id
            prisma.file.update({
                where: { id: reqId },
                data: reqData
            }).then(file => {
                let status = (file === null) ? 500 : 200
                let data = (file === null) ? { message : "An error occured" } : {
                    message: `Updated File #${reqId} successfully`,
                    data: file
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
 * Delete one File
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
            prisma.file.delete({
                where: { id: reqId }
            }).then(() => {
                res.status(200).send({ message: `Successfully deleted File #${reqId}` })
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
    getAllByDirectory,
    getOneById,
    createOne,
    updateOneById,
    deleteOneById
}