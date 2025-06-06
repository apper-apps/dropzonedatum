import { subDays, format, startOfDay, endOfDay } from 'date-fns'
import { fileService } from './fileService'

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Generate mock historical data for analytics
const generateHistoricalData = (days = 30) => {
  const data = []
  const now = new Date()
  
  for (let i = days; i >= 0; i--) {
    const date = subDays(now, i)
    const dayStart = startOfDay(date)
    
    // Generate realistic data with some randomness
    const baseUploads = Math.floor(Math.random() * 20) + 5
    const baseSpeed = Math.random() * 10 + 2 // 2-12 MB/s
    const avgFileSize = Math.random() * 50 + 5 // 5-55 MB
    
    data.push({
      date: dayStart.toISOString(),
      uploadsCount: baseUploads,
      totalVolume: baseUploads * avgFileSize,
      avgFileSize: avgFileSize,
      avgUploadSpeed: baseSpeed,
      avgUploadTime: (avgFileSize / baseSpeed) * 1000, // in milliseconds
      successRate: Math.random() * 0.1 + 0.9 // 90-100%
    })
  }
  
  return data
}

let historicalData = generateHistoricalData(30)

export const analyticsService = {
  async getUploadStats(dateRange = null) {
    await delay(300)
    
    let filteredData = [...historicalData]
    
    if (dateRange?.start && dateRange?.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      
      filteredData = historicalData.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate >= startDate && itemDate <= endDate
      })
    }
    
    // Get current files for real-time stats
    const currentFiles = await fileService.getAll()
    
    // Calculate totals
    const totalFiles = currentFiles.length
    const totalVolume = currentFiles.reduce((sum, file) => sum + (file.size || 0), 0)
    const avgFileSize = totalFiles > 0 ? totalVolume / totalFiles : 0
    
    // Calculate historical totals
    const historicalTotalFiles = filteredData.reduce((sum, item) => sum + item.uploadsCount, 0)
    const historicalTotalVolume = filteredData.reduce((sum, item) => sum + item.totalVolume, 0)
    const historicalAvgSpeed = filteredData.length > 0 
      ? filteredData.reduce((sum, item) => sum + item.avgUploadSpeed, 0) / filteredData.length 
      : 0
    const historicalAvgUploadTime = filteredData.length > 0
      ? filteredData.reduce((sum, item) => sum + item.avgUploadTime, 0) / filteredData.length
      : 0
    
    return {
      overview: {
        totalFiles: totalFiles + historicalTotalFiles,
        totalVolume: totalVolume + historicalTotalVolume * 1024 * 1024, // Convert MB to bytes
        avgFileSize: avgFileSize || (historicalTotalVolume * 1024 * 1024 / Math.max(historicalTotalFiles, 1)),
        avgUploadSpeed: historicalAvgSpeed,
        avgUploadTime: historicalAvgUploadTime,
        successRate: 0.95
      },
      chartData: {
        uploadSpeed: filteredData.map(item => ({
          x: item.date,
          y: item.avgUploadSpeed
        })),
        fileSize: filteredData.map(item => ({
          x: item.date,
          y: item.avgFileSize
        })),
        volume: filteredData.map(item => ({
          x: item.date,
          y: item.totalVolume
        })),
        uploadsCount: filteredData.map(item => ({
          x: item.date,
          y: item.uploadsCount
        }))
      },
      dateRange: {
        start: filteredData.length > 0 ? filteredData[0].date : null,
        end: filteredData.length > 0 ? filteredData[filteredData.length - 1].date : null
      }
    }
  },

  async exportData(format = 'json', dateRange = null) {
    await delay(200)
    
    const stats = await this.getUploadStats(dateRange)
    
    if (format === 'csv') {
      const csvHeaders = 'Date,Upload Speed (MB/s),Avg File Size (MB),Total Volume (MB),Uploads Count\n'
      const csvData = historicalData.map(item => 
        `${format(new Date(item.date), 'yyyy-MM-dd')},${item.avgUploadSpeed.toFixed(2)},${item.avgFileSize.toFixed(2)},${item.totalVolume.toFixed(2)},${item.uploadsCount}`
      ).join('\n')
      
      return csvHeaders + csvData
    }
    
    return JSON.stringify(stats, null, 2)
  },

  async getRealtimeStats() {
    await delay(100)
    
    // Get current files
    const files = await fileService.getAll()
    const now = new Date()
    const last24Hours = subDays(now, 1)
    
    // Filter files from last 24 hours
    const recentFiles = files.filter(file => 
      new Date(file.uploadedAt) >= last24Hours
    )
    
    const recentVolume = recentFiles.reduce((sum, file) => sum + (file.size || 0), 0)
    
    return {
      activeUploads: 0, // In real app, this would track ongoing uploads
      filesLast24h: recentFiles.length,
      volumeLast24h: recentVolume,
      currentUploadSpeed: Math.random() * 10 + 2, // Simulated real-time speed
      systemHealth: 'healthy'
    }
  },

  // Add new data point (called when files are uploaded)
  async recordUpload(file) {
    await delay(50)
    
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd')
    let todayData = historicalData.find(item => 
      format(new Date(item.date), 'yyyy-MM-dd') === today
    )
    
    if (!todayData) {
      todayData = {
        date: startOfDay(new Date()).toISOString(),
        uploadsCount: 0,
        totalVolume: 0,
        avgFileSize: 0,
        avgUploadSpeed: Math.random() * 10 + 2,
        avgUploadTime: 0,
        successRate: 1
      }
      historicalData.push(todayData)
    }
    
    // Update today's stats
    const fileSizeMB = (file.size || 0) / (1024 * 1024)
    todayData.uploadsCount += 1
    todayData.totalVolume += fileSizeMB
    todayData.avgFileSize = todayData.totalVolume / todayData.uploadsCount
    
    return todayData
  }
}