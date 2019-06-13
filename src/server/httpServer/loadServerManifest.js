import fs from 'fs'
import path from 'path'

export default () => {
  const manifestIndexPath = path.resolve(__dirname, 'clients.json')
  return JSON.parse(fs.readFileSync(manifestIndexPath))
}
