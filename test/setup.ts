import { rmdir } from "fs/promises"
import { join } from "path"

global.beforeEach( async () => {
    try {
        await rmdir(join(__dirname, '..', 'test.sqlite'));
    } catch (error) {}
})