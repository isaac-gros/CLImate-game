import { Router } from "express"
import { getAllByFileSystem, getOneById, createOne, updateOneById, deleteOneById } from '../controllers/Directory'

const directoryRouter: Router = Router()
directoryRouter.get('/:id', getOneById)
directoryRouter.get('/:fileSystemId?', getAllByFileSystem)
directoryRouter.post('/', createOne)
directoryRouter.put('/:id', updateOneById)
directoryRouter.delete('/:id', deleteOneById)

export { directoryRouter }