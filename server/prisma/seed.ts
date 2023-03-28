import { Prisma, PrismaClient } from "@prisma/client"

/**
 * Index generator
 * @returns {Generator}
 */
const indexGenerator = function*(): Generator {
    let index = 1
    while (true) yield index++
}

/**
 * Create Directory input 
 * @param {Generator} generator => Used to generate directory #index
 * @param {Prisma.DirectoryUncheckedCreateWithoutFile_systemInput} customValues => Custom values
 * @returns {Prisma.DirectoryUncheckedCreateWithoutFile_systemInput} => An object representing a new directory instance
 */
const createDirInput = (
    generator: Generator, 
    customValues: Prisma.DirectoryUncheckedCreateWithoutFile_systemInput,
    useIndex: boolean = true
): Prisma.DirectoryUncheckedCreateWithoutFile_systemInput => {
    return {
        id: customValues?.id ?? undefined,
        name: `${customValues.name ?? 'Directory'}${useIndex ? ' #' + generator.next().value : ''}`,
        permissions: customValues?.permissions ?? 755,
        is_spawn_point: customValues?.is_spawn_point ?? false,
        width: customValues?.width ?? 100,
        height: customValues?.height ?? 100,
        parent_dir_id: customValues?.parent_dir_id ?? undefined
    }
}

const prisma = new PrismaClient()
async function main (): Promise<void> {

    // Create a file system
    const dirIndexGen = indexGenerator()
    const fileSystem = await prisma.fileSystem.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: "My 1st FileSystem",
            enabled: true,
            directories: {
                create: [
                    createDirInput(dirIndexGen, { is_spawn_point: true, name: 'Main entrance' }, false), // Spawn point / Dir
                ]
            }
        }
    })
    console.log('[OK] Created FileSystem and Directories', fileSystem)

    // Create subdirectories
    const subDirectories = await prisma.directory.createMany({
        data: [
            {...createDirInput(dirIndexGen, { name: 'Room', parent_dir_id: 1 }), file_system_id: 1 }, // Room #1
            {...createDirInput(dirIndexGen, { name: 'Room', parent_dir_id: 1 }), file_system_id: 1 }, // Room #2
            {...createDirInput(dirIndexGen, { name: 'Room', parent_dir_id: 1, permissions: 550 }), file_system_id: 1 }, // Room #3
        ]
    })
    console.log('[OK] Created Sub-directories', subDirectories)

    // Create files
    const files = await prisma.file.createMany({
        data: [
            { name: 'Challenge', content: 'Try to access Room #3', directory_id: 1 }, // 
            { name: 'room_3_username', content: 'username', directory_id: 2 },
            { name: 'room_3_password', content: 'password', directory_id: 3 },
            { name: 'Congrats', content: 'You did it, well done !', directory_id: 4 },
        ]
    })
    console.log('[OK] Created files', files)
}

main().then(async () => {
    await prisma.$disconnect()
}).catch(async (err)=> {
    console.error(err)
    await prisma.$disconnect
    process.exit(1)
})