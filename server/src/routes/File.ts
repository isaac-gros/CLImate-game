import { Router } from "express"
import { getAllByDirectory, getOneById, createOne, updateOneById, deleteOneById } from '../controllers/File'

const fileRouter: Router = Router()
fileRouter.get('/:id', getOneById)
fileRouter.get('/:directoryId?', getAllByDirectory)
fileRouter.post('/', createOne)
fileRouter.put('/:id', updateOneById)
fileRouter.delete('/:id', deleteOneById)

export { fileRouter }