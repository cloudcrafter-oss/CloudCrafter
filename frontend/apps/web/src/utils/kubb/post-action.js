import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const eslintConfigTypes = {
    'rules': {
        '@typescript-eslint/no-explicit-any': 'off'
    }
}

const eslintConfigHooks = {
    'rules': {
        '@typescript-eslint/no-unused-vars': 'off'
    }

}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)


const jsonStringTypes = JSON.stringify(eslintConfigTypes, null, 2)
const jsongStringHooks = JSON.stringify(eslintConfigHooks, null, 2)
fs.writeFile(path.join(__dirname, '../../app/generated/types/.eslintrc'), jsonStringTypes, 'utf8', (err) => {
    if (err) {
        console.error('Error writing file:', err)
        throw err
    } else {
        console.log('File has been saved.')
    }
})

fs.writeFile(path.join(__dirname, '../../app/generated/hooks/.eslintrc'), jsongStringHooks, 'utf8', (err) => {
    if (err) {
        console.error('Error writing file:', err)
        throw err
    } else {
        console.log('File has been saved.')
    }
})