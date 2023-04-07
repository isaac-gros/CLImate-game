import { Express, Router } from "express"
import { getAll, getOneById, createOne, updateOneById, deleteOneById } from '../controllers/FileSystem'

const fileSystemRouter: Router = Router()
fileSystemRouter.get('/', getAll)
fileSystemRouter.get('/:id', getOneById)
fileSystemRouter.post('/', createOne)
fileSystemRouter.put('/:id', updateOneById)
fileSystemRouter.delete('/:id', deleteOneById)

export { fileSystemRouter }