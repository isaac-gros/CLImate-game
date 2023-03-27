import { PrismaClient, Directory } from "@prisma/client";
import { Type } from "typescript";

const indexGenerator = function*(): Generator {
    let index = 0
    while (true) {
        yield index
        index++
    }
}

const createDir = (generator: Generator, isSpawnPoint: boolean = false) => {
    return {
        name: `Directory #${generator.next().value}`,
        is_spawn_point: isSpawnPoint,
        width: 100,
        height: 100
    }
}

const prisma = new PrismaClient()

async function main (debug = false) {

    // Create a file system
    const dirIndexGen = indexGenerator()
    const fileSystem = await prisma.fileSystem.create({
        data: {
            name: "My 1st FileSystem",
            enabled: true,
            directories: {
                create: [
                    createDir(dirIndexGen, true),
                    createDir(dirIndexGen),
                    createDir(dirIndexGen)
                ]
            }
        }
    })

    if (debug) console.log('Created FileSystem', fileSystem)
}

main().then(async () => {
    console.log('Done !')
    await prisma.$disconnect()
}).catch(async (err)=> {
    console.error(err)
    await prisma.$disconnect
    process.exit(1)
})