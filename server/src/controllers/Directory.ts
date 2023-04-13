import { Request, Response } from "express"
import { PrismaClient } from "@prisma/client"

const prisma: PrismaClient = new PrismaClient()

/**
 * Get all FileSystem
 * @param {Request} req 
 * @param {Response} res 
 */
const getAllByFileSystem = (req: Request, res: Response) => {
    try {
        let fileSystemId = 0

        // Try to convert param filesystemId to number
        if (typeof(req.query.fileSystemId) === 'string') {
            fileSystemId = Number.parseInt(req.query.fileSystemId)
        }

        // Send 404 if fileSystemId is not a valid parameter
        if (Number.isNaN(fileSystemId) || fileSystemId === 0) {
            res.status(400).send({ message: "Invalid fileSystemId parameter" })
            return
        }

        // Find every directory depending on given fileSystemId
        prisma.directory.findMany({
            where: {
                file_system_id: fileSystemId
            }
        }).then(fileSystems => {
            if (fileSystems.length > 0) {
                res.status(200).send({ data: fileSystems })
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
            prisma.directory.findUnique({
                where: { id: reqId },
                include: {
                    files: true,
                    children_dir: true
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

        // Check if required fields are not missing
        let missingFields = []
        let submittedFields = Object.keys(reqData)
        let requiredFields = ['file_system', 'name']
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
        let allowedFields = ['file_system', 'name', 'parent_dir', 'permissions', 'is_spawn_point', 'width', 'height', 'files']
        for (const key in reqData) {
            if (!allowedFields.includes(key)) {
                res.status(400).send({ message: `The field '${key}' is illegal` })
                return
            }
        }

        prisma.directory.create({
            data: {
                file_system: { connect: { id: reqData.file_system }},
                name: reqData.name,
                parent_dir: { connect: { id: reqData.parent_dir ?? undefined }},
                permissions: Number.parseInt(reqData.permissions) ?? undefined,
                is_spawn_point: reqData.is_spawn_point ?? undefined,
                width: reqData.width ?? undefined,
                height: reqData.height ?? undefined,
                files: reqData.files ?? undefined,
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
            let allowedFields = ['file_system', 'name', 'parent_dir', 'children_dir', 'permissions', 'is_spawn_point', 'width', 'height', 'files']
            for (const key in reqData) {
                if (!allowedFields.includes(key)) {
                    res.status(400).send({ message: `The field '${key}' is not allowed` })
                    return
                }
            }

            // TODO : Connect parent_dir and file_system 

            // Try to update the filesystem with given id
            prisma.directory.update({
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
            prisma.directory.delete({
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
    getAllByFileSystem,
    getOneById,
    createOne,
    updateOneById,
    deleteOneById
}