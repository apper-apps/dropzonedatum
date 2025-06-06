import React, { useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title as ChartTitle,
  Tooltip,
  Legend,
  TimeScale,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { format, subDays, startOfDay, endOfDay } from 'date-fns'
import 'chartjs-adapter-date-fns'
import { analyticsService } from '@/services/api/analyticsService'
import Header from '@/components/organisms/Header'
import Icon from '@/components/atoms/Icon'
import Text from '@/components/atoms/Text'
import Title from '@/components/atoms/Title'
import Button from '@/components/atoms/Button'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ChartTitle,
  Tooltip,
  Legend,
  TimeScale,
  Filler
)

const DashboardPage = ({ darkMode, toggleDarkMode }) => {
  const [stats, setStats] = useState(null)
  const [realtimeStats, setRealtimeStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [dateRange, setDateRange] = useState({
    start: format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    end: format(new Date(), 'yyyy-MM-dd')
  })
  const [activeChart, setActiveChart] = useState('speed')
  const realtimeInterval = useRef(null)

  useEffect(() => {
    loadStats()
    startRealtimeUpdates()
    
    return () => {
      if (realtimeInterval.current) {
        clearInterval(realtimeInterval.current)
      }
    }
  }, [dateRange])

  const loadStats = async () => {
    setLoading(true)
    try {
      const data = await analyticsService.getUploadStats({
        start: new Date(dateRange.start),
        end: new Date(dateRange.end)
      })
      setStats(data)
    } catch (err) {
      setError(err.message)
      toast.error('Failed to load dashboard statistics')
    } finally {
      setLoading(false)
    }
  }

  const startRealtimeUpdates = () => {
    if (realtimeInterval.current) {
      clearInterval(realtimeInterval.current)
    }
    
    realtimeInterval.current = setInterval(async () => {
      try {
        const realtime = await analyticsService.getRealtimeStats()
        setRealtimeStats(realtime)
      } catch (err) {
        console.error('Failed to fetch realtime stats:', err)
      }
    }, 5000) // Update every 5 seconds
  }

  const handleExportData = async (format) => {
    try {
      const data = await analyticsService.exportData(format, {
        start: new Date(dateRange.start),
        end: new Date(dateRange.end)
      })
      
      const blob = new Blob([data], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `upload-analytics-${format(new Date(), 'yyyy-MM-dd')}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast.success(`Data exported as ${format.toUpperCase()}`)
    } catch (err) {
      toast.error('Failed to export data')
    }
  }

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDuration = (ms) => {
    if (ms < 1000) return `${Math.round(ms)}ms`
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`
    return `${(ms / 60000).toFixed(1)}m`
  }

  const getChartOptions = (title, yAxisLabel) => ({
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index'
    },
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: title,
        color: darkMode ? '#E2E8F0' : '#334155',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      x: {
        type: 'time',
        time: {
          displayFormats: {
            day: 'MMM dd'
          }
        },
        grid: {
          color: darkMode ? '#374151' : '#E2E8F0'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#64748B'
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: darkMode ? '#374151' : '#E2E8F0'
        },
        ticks: {
          color: darkMode ? '#9CA3AF' : '#64748B'
        },
        title: {
          display: true,
          text: yAxisLabel,
          color: darkMode ? '#E2E8F0' : '#334155'
        }
      }
    }
  })

  const chartConfigs = {
    speed: {
      title: 'Upload Speed Over Time',
      yLabel: 'Speed (MB/s)',
      color: '#3B82F6',
      data: stats?.chartData.uploadSpeed || []
    },
    fileSize: {
      title: 'Average File Size Over Time',
      yLabel: 'Size (MB)',
      color: '#10B981',
      data: stats?.chartData.fileSize || []
    },
    volume: {
      title: 'Total Upload Volume Over Time',
      yLabel: 'Volume (MB)',
      color: '#F59E0B',
      data: stats?.chartData.volume || []
    }
  }

  const getChartData = (config) => ({
    datasets: [{
      label: config.yLabel,
      data: config.data,
      borderColor: config.color,
      backgroundColor: `${config.color}20`,
      fill: true,
      tension: 0.4,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: config.color,
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2
    }]
  })

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <div className={`text-center py-12 ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
          <Icon name="AlertCircle" className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <Text>{error}</Text>
          <Button 
            onClick={loadStats}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <Title as="h1" className="text-2xl lg:text-3xl mb-2">
              Upload Analytics Dashboard
            </Title>
            <Text className={darkMode ? 'text-surface-400' : 'text-surface-600'}>
              Monitor upload performance and track usage trends
            </Text>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 lg:mt-0">
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-surface-800 border-surface-700 text-white' 
                    : 'bg-white border-surface-300 text-surface-900'
                }`}
              />
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className={`px-3 py-2 rounded-lg border text-sm ${
                  darkMode 
                    ? 'bg-surface-800 border-surface-700 text-white' 
                    : 'bg-white border-surface-300 text-surface-900'
                }`}
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={() => handleExportData('json')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  darkMode 
                    ? 'bg-surface-700 hover:bg-surface-600 text-white' 
                    : 'bg-surface-100 hover:bg-surface-200 text-surface-900'
                }`}
              >
                <Icon name="Download" size={16} className="mr-2" />
                Export JSON
              </Button>
              <Button
                onClick={() => handleExportData('csv')}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  darkMode 
                    ? 'bg-surface-700 hover:bg-surface-600 text-white' 
                    : 'bg-surface-100 hover:bg-surface-200 text-surface-900'
                }`}
              >
                <Icon name="FileText" size={16} className="mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-surface-800 border-surface-700' : 'bg-white border-surface-200'
          } border shadow-card`}>
            <div className="flex items-center justify-between">
              <div>
                <Text className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
                  Total Files
                </Text>
                <Title as="h3" className="text-2xl mt-1">
                  {stats?.overview.totalFiles?.toLocaleString() || 0}
                </Title>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <Icon name="Files" className="w-6 h-6 text-primary" />
              </div>
            </div>
            {realtimeStats && (
              <Text className="text-sm text-green-500 mt-2">
                +{realtimeStats.filesLast24h} in last 24h
              </Text>
            )}
          </div>

          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-surface-800 border-surface-700' : 'bg-white border-surface-200'
          } border shadow-card`}>
            <div className="flex items-center justify-between">
              <div>
                <Text className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
                  Total Volume
                </Text>
                <Title as="h3" className="text-2xl mt-1">
                  {formatBytes(stats?.overview.totalVolume || 0)}
                </Title>
              </div>
              <div className="p-3 bg-secondary/10 rounded-lg">
                <Icon name="HardDrive" className="w-6 h-6 text-secondary" />
              </div>
            </div>
            {realtimeStats && (
              <Text className="text-sm text-green-500 mt-2">
                +{formatBytes(realtimeStats.volumeLast24h)} in last 24h
              </Text>
            )}
          </div>

          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-surface-800 border-surface-700' : 'bg-white border-surface-200'
          } border shadow-card`}>
            <div className="flex items-center justify-between">
              <div>
                <Text className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
                  Avg Speed
                </Text>
                <Title as="h3" className="text-2xl mt-1">
                  {(stats?.overview.avgUploadSpeed || 0).toFixed(1)} MB/s
                </Title>
              </div>
              <div className="p-3 bg-accent/10 rounded-lg">
                <Icon name="Zap" className="w-6 h-6 text-accent" />
              </div>
            </div>
            {realtimeStats && (
              <Text className="text-sm text-blue-500 mt-2">
                Current: {realtimeStats.currentUploadSpeed.toFixed(1)} MB/s
              </Text>
            )}
          </div>

          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-surface-800 border-surface-700' : 'bg-white border-surface-200'
          } border shadow-card`}>
            <div className="flex items-center justify-between">
              <div>
                <Text className={`text-sm ${darkMode ? 'text-surface-400' : 'text-surface-600'}`}>
                  Avg Upload Time
                </Text>
                <Title as="h3" className="text-2xl mt-1">
                  {formatDuration(stats?.overview.avgUploadTime || 0)}
                </Title>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Icon name="Clock" className="w-6 h-6 text-green-500" />
              </div>
            </div>
            <Text className="text-sm text-green-500 mt-2">
              {((stats?.overview.successRate || 0) * 100).toFixed(1)}% success rate
            </Text>
          </div>
        </div>

        {/* Chart Selection */}
        <div className="flex flex-wrap gap-2 mb-6">
          {Object.entries(chartConfigs).map(([key, config]) => (
            <Button
              key={key}
              onClick={() => setActiveChart(key)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                activeChart === key
                  ? 'bg-primary text-white'
                  : darkMode 
                    ? 'bg-surface-700 hover:bg-surface-600 text-white' 
                    : 'bg-surface-100 hover:bg-surface-200 text-surface-900'
              }`}
            >
              {config.title}
            </Button>
          ))}
        </div>

        {/* Main Chart */}
        <div className={`p-6 rounded-xl ${
          darkMode ? 'bg-surface-800 border-surface-700' : 'bg-white border-surface-200'
        } border shadow-card mb-8`}>
          <div style={{ height: '400px' }}>
            {stats?.chartData && (
              <Line
                data={getChartData(chartConfigs[activeChart])}
                options={getChartOptions(
                  chartConfigs[activeChart].title,
                  chartConfigs[activeChart].yLabel
                )}
              />
            )}
          </div>
        </div>

        {/* Additional Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upload Volume Chart */}
          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-surface-800 border-surface-700' : 'bg-white border-surface-200'
          } border shadow-card`}>
            <div style={{ height: '300px' }}>
              {stats?.chartData && (
                <Bar
                  data={{
                    datasets: [{
                      label: 'Daily Uploads',
                      data: stats.chartData.uploadsCount,
                      backgroundColor: '#3B82F6',
                      borderRadius: 6
                    }]
                  }}
                  options={{
                    ...getChartOptions('Daily Upload Count', 'Files'),
                    scales: {
                      ...getChartOptions('Daily Upload Count', 'Files').scales,
                      x: {
                        ...getChartOptions('Daily Upload Count', 'Files').scales.x,
                        type: 'time'
                      }
                    }
                  }}
                />
              )}
            </div>
          </div>

          {/* System Health Status */}
          <div className={`p-6 rounded-xl ${
            darkMode ? 'bg-surface-800 border-surface-700' : 'bg-white border-surface-200'
          } border shadow-card`}>
            <Title as="h3" className="text-lg mb-4">System Status</Title>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Text>Upload System</Text>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Text className="text-green-500 text-sm">Healthy</Text>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Text>Storage</Text>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Text className="text-green-500 text-sm">Available</Text>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <Text>Network</Text>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <Text className="text-green-500 text-sm">Optimal</Text>
                </div>
              </div>
              {realtimeStats && realtimeStats.activeUploads > 0 && (
                <div className="flex items-center justify-between">
                  <Text>Active Uploads</Text>
                  <Text className="text-blue-500 text-sm">
                    {realtimeStats.activeUploads}
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage