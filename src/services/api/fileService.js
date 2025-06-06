import mockFiles from '../mockData/files.json'

let files = [...mockFiles]

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

export const fileService = {
  async getAll() {
    await delay(300)
    return [...files]
  },

  async getById(id) {
    await delay(200)
    const file = files.find(f => f.id === id)
    return file ? { ...file } : null
  },

  async create(fileData) {
    await delay(400)
    const newFile = {
      id: Date.now().toString(),
      name: fileData.name,
      size: fileData.size,
      type: fileData.type,
      uploadedAt: new Date().toISOString(),
      status: 'completed',
      progress: 100,
      url: fileData.url || `https://picsum.photos/400/300?random=${Date.now()}`
    }
    files.push(newFile)
    return { ...newFile }
  },

  async update(id, updates) {
    await delay(300)
    const index = files.findIndex(f => f.id === id)
    if (index === -1) throw new Error('File not found')
    
    files[index] = { ...files[index], ...updates }
    return { ...files[index] }
  },

  async delete(id) {
    await delay(250)
    const index = files.findIndex(f => f.id === id)
    if (index === -1) throw new Error('File not found')
    
    files.splice(index, 1)
    return true
  }
}