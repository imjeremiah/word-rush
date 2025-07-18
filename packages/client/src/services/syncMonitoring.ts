/**
 * Board Synchronization Monitoring Service
 * Tracks metrics, detects desync issues, and provides deployment monitoring
 * for the Word Rush board sync system
 */

interface SyncMetrics {
  // Timing Metrics
  boardReceiveLatency: number[];
  countdownAccuracy: number[];
  matchStartSyncVariance: number[];
  
  // Validation Metrics
  checksumMismatches: number;
  boardResyncRequests: number;
  validationFailures: number;
  
  // Network Metrics
  networkLatency: number[];
  connectionDrops: number;
  reconnectionAttempts: number;
  
  // Error Metrics
  desyncEvents: Array<{
    timestamp: number;
    type: string;
    details: any;
    severity: 'low' | 'medium' | 'high' | 'critical';
  }>;
  
  // Performance Metrics
  boardRenderTime: number[];
  memoryUsage: number[];
  cpuUsageEstimate: number[];
}

interface SyncAlert {
  type: 'desync' | 'performance' | 'network' | 'validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: number;
  data: any;
  resolved?: boolean;
}

class SyncMonitoringService {
  private metrics: SyncMetrics;
  private alerts: SyncAlert[] = [];
  private isMonitoring: boolean = false;
  private monitoringInterval: NodeJS.Timeout | null = null;
  private logBuffer: string[] = [];
  
  // Thresholds for alerting
  private readonly THRESHOLDS = {
    maxLatency: 200, // ms
    maxChecksumMismatches: 3,
    maxSyncVariance: 100, // ms
    maxMemoryUsage: 100, // MB estimate
    criticalDesyncEvents: 5
  };

  constructor() {
    this.metrics = this.initializeMetrics();
    this.setupLogInterception();
    this.startMonitoring();
  }

  /**
   * Initialize metrics structure
   */
  private initializeMetrics(): SyncMetrics {
    return {
      boardReceiveLatency: [],
      countdownAccuracy: [],
      matchStartSyncVariance: [],
      checksumMismatches: 0,
      boardResyncRequests: 0,
      validationFailures: 0,
      networkLatency: [],
      connectionDrops: 0,
      reconnectionAttempts: 0,
      desyncEvents: [],
      boardRenderTime: [],
      memoryUsage: [],
      cpuUsageEstimate: []
    };
  }

  /**
   * Start monitoring process
   */
  private startMonitoring(): void {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log(`[${new Date().toISOString()}] 📊 Sync monitoring started`);
    
    // Monitor every 5 seconds
    this.monitoringInterval = setInterval(() => {
      this.collectPerformanceMetrics();
      this.analyzeMetrics();
      this.checkForAlerts();
    }, 5000);
    
    // Store monitoring data globally for access
    (window as any).syncMonitoring = this;
  }

  /**
   * Stop monitoring process
   */
  public stopMonitoring(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
    this.isMonitoring = false;
    console.log(`[${new Date().toISOString()}] 📊 Sync monitoring stopped`);
  }

  /**
   * Intercept console logs to detect desync keywords
   */
  private setupLogInterception(): void {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    
    const desyncKeywords = [
      'desync', 'checksum mismatch', 'board sync', 'validation failed',
      'server crash', 'sync error', 'board corruption', 'timing mismatch'
    ];
    
    const interceptor = (level: 'log' | 'warn' | 'error', originalFn: Function) => {
      return (...args: any[]) => {
        const message = args.join(' ').toLowerCase();
        
        // Check for desync keywords
        const foundKeyword = desyncKeywords.find(keyword => message.includes(keyword));
        if (foundKeyword) {
          this.recordDesyncEvent({
            type: `console_${level}`,
            keyword: foundKeyword,
            message: args.join(' '),
            timestamp: Date.now(),
            severity: level === 'error' ? 'high' : level === 'warn' ? 'medium' : 'low'
          });
        }
        
        // Store in log buffer for analysis
        this.logBuffer.push(`[${level.toUpperCase()}] ${args.join(' ')}`);
        if (this.logBuffer.length > 1000) {
          this.logBuffer.shift(); // Keep last 1000 logs
        }
        
        // Call original function
        originalFn.apply(console, args);
      };
    };
    
    console.log = interceptor('log', originalLog);
    console.warn = interceptor('warn', originalWarn);  
    console.error = interceptor('error', originalError);
  }

  /**
   * Record board receive latency
   */
  public recordBoardLatency(latency: number): void {
    this.metrics.boardReceiveLatency.push(latency);
    this.keepArraySize(this.metrics.boardReceiveLatency, 100);
    
    if (latency > this.THRESHOLDS.maxLatency) {
      this.createAlert({
        type: 'performance',
        severity: 'medium',
        message: `High board receive latency: ${latency}ms`,
        timestamp: Date.now(),
        data: { latency }
      });
    }
  }

  /**
   * Record checksum mismatch
   */
  public recordChecksumMismatch(serverChecksum: string, clientChecksum: string, eventType: string): void {
    this.metrics.checksumMismatches++;
    
    this.recordDesyncEvent({
      type: 'checksum_mismatch',
      eventType,
      serverChecksum,
      clientChecksum,
      timestamp: Date.now(),
      severity: 'high'
    });
    
    if (this.metrics.checksumMismatches > this.THRESHOLDS.maxChecksumMismatches) {
      this.createAlert({
        type: 'validation',
        severity: 'critical',
        message: `Multiple checksum mismatches detected: ${this.metrics.checksumMismatches}`,
        timestamp: Date.now(),
        data: { count: this.metrics.checksumMismatches }
      });
    }
  }

  /**
   * Record sync variance between clients
   */
  public recordSyncVariance(variance: number): void {
    this.metrics.matchStartSyncVariance.push(variance);
    this.keepArraySize(this.metrics.matchStartSyncVariance, 50);
    
    if (variance > this.THRESHOLDS.maxSyncVariance) {
      this.createAlert({
        type: 'desync',
        severity: 'high',
        message: `High sync variance detected: ${variance}ms`,
        timestamp: Date.now(),
        data: { variance }
      });
    }
  }

  /**
   * Record network metrics
   */
  public recordNetworkMetrics(latency: number, isDropped: boolean = false): void {
    this.metrics.networkLatency.push(latency);
    this.keepArraySize(this.metrics.networkLatency, 100);
    
    if (isDropped) {
      this.metrics.connectionDrops++;
    }
  }

  /**
   * Record board render performance
   */
  public recordBoardRenderTime(renderTime: number): void {
    this.metrics.boardRenderTime.push(renderTime);
    this.keepArraySize(this.metrics.boardRenderTime, 50);
  }

  /**
   * Record desync event
   */
  private recordDesyncEvent(event: any): void {
    this.metrics.desyncEvents.push({
      timestamp: Date.now(),
      type: event.type || 'unknown',
      details: event,
      severity: event.severity || 'medium'
    });
    
    // Keep last 100 events
    if (this.metrics.desyncEvents.length > 100) {
      this.metrics.desyncEvents.shift();
    }
  }

  /**
   * Collect performance metrics
   */
  private collectPerformanceMetrics(): void {
    // Estimate memory usage (rough approximation)
    const memoryEstimate = (performance as any).memory ? 
      (performance as any).memory.usedJSHeapSize / 1024 / 1024 : 0;
    this.metrics.memoryUsage.push(memoryEstimate);
    this.keepArraySize(this.metrics.memoryUsage, 100);
    
    // Estimate CPU usage based on frame timing
    const now = performance.now();
    const cpuEstimate = Math.min(100, Math.max(0, (16.67 - (now % 16.67)) / 16.67 * 100));
    this.metrics.cpuUsageEstimate.push(cpuEstimate);
    this.keepArraySize(this.metrics.cpuUsageEstimate, 100);
  }

  /**
   * Analyze metrics for patterns
   */
  private analyzeMetrics(): void {
    const recentDesyncEvents = this.metrics.desyncEvents.filter(
      event => Date.now() - event.timestamp < 60000 // Last minute
    );
    
    if (recentDesyncEvents.length >= this.THRESHOLDS.criticalDesyncEvents) {
      this.createAlert({
        type: 'desync',
        severity: 'critical',
        message: `Critical: ${recentDesyncEvents.length} desync events in last minute`,
        timestamp: Date.now(),
        data: { events: recentDesyncEvents }
      });
    }
  }

  /**
   * Check for new alerts
   */
  private checkForAlerts(): void {
    const unresolvedAlerts = this.alerts.filter(alert => !alert.resolved);
    
    if (unresolvedAlerts.length > 0) {
      console.warn(`[${new Date().toISOString()}] 🚨 ${unresolvedAlerts.length} unresolved sync alerts`);
    }
  }

  /**
   * Create new alert
   */
  private createAlert(alert: Omit<SyncAlert, 'resolved'>): void {
    const newAlert: SyncAlert = { ...alert, resolved: false };
    this.alerts.push(newAlert);
    
    // Keep last 50 alerts
    if (this.alerts.length > 50) {
      this.alerts.shift();
    }
    
    console.warn(`[${new Date().toISOString()}] 🚨 SYNC ALERT [${alert.severity.toUpperCase()}]: ${alert.message}`);
  }

  /**
   * Get current metrics summary
   */
  public getMetricsSummary(): any {
    const avgLatency = this.average(this.metrics.networkLatency);
    const avgRenderTime = this.average(this.metrics.boardRenderTime);
    const recentDesyncEvents = this.metrics.desyncEvents.filter(
      event => Date.now() - event.timestamp < 300000 // Last 5 minutes
    );
    
    return {
      performance: {
        averageNetworkLatency: avgLatency,
        averageBoardRenderTime: avgRenderTime,
        memoryUsage: this.average(this.metrics.memoryUsage),
        cpuUsage: this.average(this.metrics.cpuUsageEstimate)
      },
      sync: {
        checksumMismatches: this.metrics.checksumMismatches,
        boardResyncRequests: this.metrics.boardResyncRequests,
        validationFailures: this.metrics.validationFailures,
        recentDesyncEvents: recentDesyncEvents.length,
        syncVariance: this.average(this.metrics.matchStartSyncVariance)
      },
      network: {
        connectionDrops: this.metrics.connectionDrops,
        reconnectionAttempts: this.metrics.reconnectionAttempts,
        latencyPercentiles: this.calculatePercentiles(this.metrics.networkLatency)
      },
      alerts: {
        total: this.alerts.length,
        unresolved: this.alerts.filter(a => !a.resolved).length,
        critical: this.alerts.filter(a => a.severity === 'critical').length
      }
    };
  }

  /**
   * Export monitoring data for external analysis
   */
  public exportData(): any {
    return {
      metrics: this.metrics,
      alerts: this.alerts,
      logBuffer: this.logBuffer.slice(-100), // Last 100 logs
      summary: this.getMetricsSummary(),
      timestamp: Date.now()
    };
  }

  /**
   * Utility: Keep array at max size
   */
  private keepArraySize(array: any[], maxSize: number): void {
    while (array.length > maxSize) {
      array.shift();
    }
  }

  /**
   * Utility: Calculate average
   */
  private average(array: number[]): number {
    return array.length > 0 ? array.reduce((a, b) => a + b, 0) / array.length : 0;
  }

  /**
   * Utility: Calculate percentiles
   */
  private calculatePercentiles(array: number[]): any {
    if (array.length === 0) return { p50: 0, p90: 0, p95: 0, p99: 0 };
    
    const sorted = [...array].sort((a, b) => a - b);
    return {
      p50: sorted[Math.floor(sorted.length * 0.5)],
      p90: sorted[Math.floor(sorted.length * 0.9)],
      p95: sorted[Math.floor(sorted.length * 0.95)],
      p99: sorted[Math.floor(sorted.length * 0.99)]
    };
  }
}

// Initialize monitoring service
const syncMonitoring = new SyncMonitoringService();

// Export for use in other modules
export { syncMonitoring, SyncMonitoringService };

// Development utilities
if (process.env.NODE_ENV === 'development') {
  (window as any).getSyncMetrics = () => syncMonitoring.getMetricsSummary();
  (window as any).exportSyncData = () => syncMonitoring.exportData();
  
  console.log('📊 Sync monitoring utilities available:');
  console.log('  - window.getSyncMetrics() - Get current metrics summary');
  console.log('  - window.exportSyncData() - Export full monitoring data');
  console.log('  - window.syncMonitoring - Direct access to monitoring service');
} 