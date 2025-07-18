/**
 * Monitoring Dashboard Component
 * Provides real-time visualization of board synchronization metrics,
 * deployment health status, and rollback controls for operations teams
 */

import { useState, useEffect } from 'react';

interface MonitoringDashboardProps {
  isVisible: boolean;
  onClose: () => void;
}

interface MetricsSummary {
  performance: {
    averageNetworkLatency: number;
    averageBoardRenderTime: number;
    memoryUsage: number;
    cpuUsage: number;
  };
  sync: {
    checksumMismatches: number;
    boardResyncRequests: number;
    validationFailures: number;
    recentDesyncEvents: number;
    syncVariance: number;
  };
  network: {
    connectionDrops: number;
    reconnectionAttempts: number;
    latencyPercentiles: {
      p50: number;
      p90: number;
      p95: number;
      p99: number;
    };
  };
  alerts: {
    total: number;
    unresolved: number;
    critical: number;
  };
}

interface HealthStatus {
  isHealthy: boolean;
  rollbackTriggered: boolean;
  config: any;
  results: Array<[string, any]>;
  lastCheck: number;
}

/**
 * Monitoring Dashboard component for deployment and sync monitoring
 */
function MonitoringDashboard({ isVisible, onClose }: MonitoringDashboardProps): JSX.Element | null {
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval] = useState(5000);

  /**
   * Load monitoring data
   */
  const loadMonitoringData = async (): Promise<void> => {
    try {
      // Get sync metrics
      if ((window as any).getSyncMetrics) {
        const syncMetrics = (window as any).getSyncMetrics();
        setMetrics(syncMetrics);
      }

      // Get health status
      if ((window as any).getHealthStatus) {
        const health = (window as any).getHealthStatus();
        setHealthStatus(health);
      }
    } catch (error) {
      console.error('Failed to load monitoring data:', error);
    }
  };

  /**
   * Export all monitoring data
   */
  const exportData = (): void => {
    try {
      const syncData = (window as any).exportSyncData?.() || {};
      const healthData = (window as any).exportHealthData?.() || {};
      
      const exportData = {
        sync: syncData,
        health: healthData,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };
      
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `word-rush-monitoring-${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  };

  /**
   * Trigger manual rollback
   */
  const triggerRollback = (): void => {
    if (confirm('Are you sure you want to trigger a rollback? This will reload the page.')) {
      (window as any).triggerRollback?.();
    }
  };

  /**
   * Get status color for metrics
   */
  const getStatusColor = (value: number, thresholds: { good: number; warning: number }): string => {
    if (value <= thresholds.good) return '#10b981'; // green
    if (value <= thresholds.warning) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  /**
   * Format latency value
   */
  const formatLatency = (ms: number): string => {
    return `${ms.toFixed(1)}ms`;
  };

  /**
   * Format percentage
   */
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(1)}%`;
  };

  // Auto-refresh effect
  useEffect(() => {
    if (!isVisible || !autoRefresh) return;

    const interval = setInterval(loadMonitoringData, refreshInterval);
    loadMonitoringData(); // Load immediately

    return () => clearInterval(interval);
  }, [isVisible, autoRefresh, refreshInterval]);

  // Initial load
  useEffect(() => {
    if (isVisible) {
      loadMonitoringData();
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      zIndex: 10000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: 'monospace'
    }}>
      <div style={{
        backgroundColor: '#1a1a1a',
        borderRadius: '8px',
        padding: '20px',
        maxWidth: '90vw',
        maxHeight: '90vh',
        overflow: 'auto',
        border: '1px solid #333'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#10b981' }}>📊 Sync Monitoring Dashboard</h2>
          <button 
            onClick={onClose}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            ✕ Close
          </button>
        </div>

        {/* Controls */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button
            onClick={loadMonitoringData}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh
          </button>
          
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            style={{
              background: autoRefresh ? '#10b981' : '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            {autoRefresh ? '⏸️ Pause' : '▶️ Auto'}
          </button>
          
          <button
            onClick={exportData}
            style={{
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            💾 Export
          </button>
          
          <button
            onClick={triggerRollback}
            style={{
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer'
            }}
          >
            🔄 Rollback
          </button>
        </div>

        {/* Health Status */}
        {healthStatus && (
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ color: '#f59e0b', marginBottom: '10px' }}>🏥 System Health</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
              <div style={{
                background: healthStatus.isHealthy ? '#065f46' : '#991b1b',
                padding: '10px',
                borderRadius: '4px'
              }}>
                <strong>Overall Status</strong><br />
                {healthStatus.isHealthy ? '✅ Healthy' : '❌ Degraded'}
              </div>
              
              <div style={{
                background: healthStatus.rollbackTriggered ? '#991b1b' : '#065f46',
                padding: '10px',
                borderRadius: '4px'
              }}>
                <strong>Rollback Status</strong><br />
                {healthStatus.rollbackTriggered ? '🔄 Active' : '✅ Normal'}
              </div>
              
              {healthStatus.results.map(([key, result]) => (
                <div key={key} style={{
                  background: result.status === 'healthy' ? '#065f46' : 
                             result.status === 'degraded' ? '#92400e' : '#991b1b',
                  padding: '10px',
                  borderRadius: '4px'
                }}>
                  <strong>{result.feature}</strong><br />
                  {result.status === 'healthy' ? '✅' : 
                   result.status === 'degraded' ? '⚠️' : '❌'} {result.status}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Performance Metrics */}
        {metrics && (
          <>
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#10b981', marginBottom: '10px' }}>⚡ Performance</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Network Latency</strong><br />
                  <span style={{ color: getStatusColor(metrics.performance.averageNetworkLatency, { good: 100, warning: 200 }) }}>
                    {formatLatency(metrics.performance.averageNetworkLatency)}
                  </span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Render Time</strong><br />
                  <span style={{ color: getStatusColor(metrics.performance.averageBoardRenderTime, { good: 50, warning: 100 }) }}>
                    {formatLatency(metrics.performance.averageBoardRenderTime)}
                  </span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Memory Usage</strong><br />
                  <span style={{ color: getStatusColor(metrics.performance.memoryUsage, { good: 50, warning: 100 }) }}>
                    {metrics.performance.memoryUsage.toFixed(1)}MB
                  </span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>CPU Usage</strong><br />
                  <span style={{ color: getStatusColor(metrics.performance.cpuUsage, { good: 30, warning: 60 }) }}>
                    {formatPercentage(metrics.performance.cpuUsage / 100)}
                  </span>
                </div>
              </div>
            </div>

            {/* Sync Metrics */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#f59e0b', marginBottom: '10px' }}>🔄 Synchronization</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Checksum Mismatches</strong><br />
                  <span style={{ color: metrics.sync.checksumMismatches > 0 ? '#ef4444' : '#10b981' }}>
                    {metrics.sync.checksumMismatches}
                  </span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Resync Requests</strong><br />
                  <span style={{ color: metrics.sync.boardResyncRequests > 5 ? '#f59e0b' : '#10b981' }}>
                    {metrics.sync.boardResyncRequests}
                  </span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Validation Failures</strong><br />
                  <span style={{ color: metrics.sync.validationFailures > 0 ? '#ef4444' : '#10b981' }}>
                    {metrics.sync.validationFailures}
                  </span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Recent Desync</strong><br />
                  <span style={{ color: metrics.sync.recentDesyncEvents > 0 ? '#ef4444' : '#10b981' }}>
                    {metrics.sync.recentDesyncEvents}
                  </span>
                </div>
              </div>
            </div>

            {/* Network Metrics */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#3b82f6', marginBottom: '10px' }}>🌐 Network</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>P50 Latency</strong><br />
                  <span>{formatLatency(metrics.network.latencyPercentiles.p50)}</span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>P90 Latency</strong><br />
                  <span>{formatLatency(metrics.network.latencyPercentiles.p90)}</span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>P95 Latency</strong><br />
                  <span>{formatLatency(metrics.network.latencyPercentiles.p95)}</span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>P99 Latency</strong><br />
                  <span>{formatLatency(metrics.network.latencyPercentiles.p99)}</span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Drops</strong><br />
                  <span style={{ color: metrics.network.connectionDrops > 0 ? '#ef4444' : '#10b981' }}>
                    {metrics.network.connectionDrops}
                  </span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Reconnects</strong><br />
                  <span style={{ color: metrics.network.reconnectionAttempts > 0 ? '#f59e0b' : '#10b981' }}>
                    {metrics.network.reconnectionAttempts}
                  </span>
                </div>
              </div>
            </div>

            {/* Alerts */}
            <div>
              <h3 style={{ color: '#ef4444', marginBottom: '10px' }}>🚨 Alerts</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Total Alerts</strong><br />
                  <span>{metrics.alerts.total}</span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Unresolved</strong><br />
                  <span style={{ color: metrics.alerts.unresolved > 0 ? '#f59e0b' : '#10b981' }}>
                    {metrics.alerts.unresolved}
                  </span>
                </div>
                
                <div style={{ background: '#374151', padding: '10px', borderRadius: '4px' }}>
                  <strong>Critical</strong><br />
                  <span style={{ color: metrics.alerts.critical > 0 ? '#ef4444' : '#10b981' }}>
                    {metrics.alerts.critical}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer */}
        <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#9ca3af' }}>
          Auto-refresh: {autoRefresh ? `${refreshInterval / 1000}s` : 'Off'} | 
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

export default MonitoringDashboard; 