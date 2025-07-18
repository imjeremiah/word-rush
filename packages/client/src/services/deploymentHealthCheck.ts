/**
 * Deployment Health Check and Rollback Service
 * Monitors the health of board synchronization features and provides
 * rollback mechanisms for reverting to client-side countdown if needed
 */

interface HealthCheckResult {
  feature: string;
  status: 'healthy' | 'degraded' | 'critical';
  metrics: any;
  lastCheck: number;
  errorCount: number;
}

interface DeploymentConfig {
  enableServerSync: boolean;
  enableChecksumValidation: boolean;
  enableEdgeCaseHandling: boolean;
  enableMonitoring: boolean;
  clientSideCountdownFallback: boolean;
}

class DeploymentHealthService {
  private healthResults: Map<string, HealthCheckResult> = new Map();
  private config: DeploymentConfig;
  private healthCheckInterval: NodeJS.Timeout | null = null;
  private isHealthy: boolean = true;
  private rollbackTriggered: boolean = false;
  
  // Health thresholds
  private readonly HEALTH_THRESHOLDS = {
    maxErrorRate: 0.1, // 10% error rate
    maxLatency: 500, // ms
    maxDesyncEvents: 10, // per minute
    minSuccessRate: 0.9 // 90% success rate
  };

  constructor() {
    this.config = this.loadDeploymentConfig();
    this.startHealthChecks();
    console.log(`[${new Date().toISOString()}] 🏥 Deployment health monitoring started`);
  }

  /**
   * Load deployment configuration
   */
  private loadDeploymentConfig(): DeploymentConfig {
    // Load from localStorage or use defaults
    const storedConfig = localStorage.getItem('wordRushDeploymentConfig');
    const defaultConfig: DeploymentConfig = {
      enableServerSync: true,
      enableChecksumValidation: false, // Currently disabled due to algorithm mismatch
      enableEdgeCaseHandling: true,
      enableMonitoring: true,
      clientSideCountdownFallback: false
    };
    
    return storedConfig ? { ...defaultConfig, ...JSON.parse(storedConfig) } : defaultConfig;
  }

  /**
   * Save deployment configuration
   */
  private saveDeploymentConfig(): void {
    localStorage.setItem('wordRushDeploymentConfig', JSON.stringify(this.config));
    console.log(`[${new Date().toISOString()}] 💾 Deployment config saved`);
  }

  /**
   * Start health monitoring
   */
  private startHealthChecks(): void {
    this.healthCheckInterval = setInterval(() => {
      this.runHealthChecks();
    }, 30000); // Check every 30 seconds
    
    // Initial health check
    setTimeout(() => this.runHealthChecks(), 5000);
  }

  /**
   * Stop health monitoring
   */
  public stopHealthChecks(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }
    console.log(`[${new Date().toISOString()}] 🏥 Health monitoring stopped`);
  }

  /**
   * Run comprehensive health checks
   */
  private async runHealthChecks(): Promise<void> {
    console.log(`[${new Date().toISOString()}] 🏥 Running deployment health checks...`);
    
    try {
      // Check sync monitoring service health
      await this.checkSyncMonitoringHealth();
      
      // Check network connectivity
      await this.checkNetworkHealth();
      
      // Check board synchronization
      await this.checkBoardSyncHealth();
      
      // Check edge case handling
      await this.checkEdgeCaseHealth();
      
      // Evaluate overall health
      this.evaluateOverallHealth();
      
    } catch (error) {
      console.error(`[${new Date().toISOString()}] ❌ Health check failed:`, error);
    }
  }

  /**
   * Check sync monitoring service health
   */
  private async checkSyncMonitoringHealth(): Promise<void> {
    try {
      const { syncMonitoring } = await import('./syncMonitoring.js');
      const metrics = syncMonitoring.getMetricsSummary();
      
      const errorCount = metrics.alerts.critical + metrics.alerts.unresolved;
      const status = errorCount > 5 ? 'critical' : errorCount > 2 ? 'degraded' : 'healthy';
      
      this.healthResults.set('sync_monitoring', {
        feature: 'Sync Monitoring',
        status,
        metrics,
        lastCheck: Date.now(),
        errorCount
      });
      
    } catch (error) {
      this.healthResults.set('sync_monitoring', {
        feature: 'Sync Monitoring',
        status: 'critical',
        metrics: { error: error instanceof Error ? error.message : String(error) },
        lastCheck: Date.now(),
        errorCount: 1
      });
    }
  }

  /**
   * Check network health
   */
  private async checkNetworkHealth(): Promise<void> {
    const startTime = Date.now();
    
    try {
      // Simple connectivity test
      await fetch('/favicon.ico', { method: 'HEAD', cache: 'no-cache' });
      const latency = Date.now() - startTime;
      
      const status = latency > this.HEALTH_THRESHOLDS.maxLatency ? 'degraded' : 'healthy';
      
      this.healthResults.set('network', {
        feature: 'Network Connectivity',
        status,
        metrics: { latency, timestamp: Date.now() },
        lastCheck: Date.now(),
        errorCount: 0
      });
      
    } catch (error) {
      this.healthResults.set('network', {
        feature: 'Network Connectivity', 
        status: 'critical',
        metrics: { error: error instanceof Error ? error.message : String(error), latency: Date.now() - startTime },
        lastCheck: Date.now(),
        errorCount: 1
      });
    }
  }

  /**
   * Check board synchronization health
   */
  private async checkBoardSyncHealth(): Promise<void> {
    try {
      const gameState = localStorage.getItem('wordRushGameState');
      const deviceInfo = (window as any).deviceInfo;
      
      const metrics = {
        gameState,
        deviceType: deviceInfo?.isMobile ? 'mobile' : 'desktop',
        connectionQuality: deviceInfo?.connectionQuality?.() || 'unknown',
        lastBoardSync: localStorage.getItem('lastBoardSyncTime') || 'never'
      };
      
      // Check if we're in a critical state
      const isInMatch = gameState === 'match' || gameState === 'countdown';
      const hasRecentSync = Date.now() - parseInt(metrics.lastBoardSync || '0') < 60000;
      
      let status: 'healthy' | 'degraded' | 'critical' = 'healthy';
      let errorCount = 0;
      if (isInMatch && !hasRecentSync) {
        status = 'degraded';
        errorCount = 0; // Degraded is not an error, just a warning
      }
      
      this.healthResults.set('board_sync', {
        feature: 'Board Synchronization',
        status,
        metrics,
        lastCheck: Date.now(),
        errorCount
      });
      
    } catch (error) {
      this.healthResults.set('board_sync', {
        feature: 'Board Synchronization',
        status: 'critical',
        metrics: { error: error instanceof Error ? error.message : String(error) },
        lastCheck: Date.now(),
        errorCount: 1
      });
    }
  }

  /**
   * Check edge case handling health
   */
  private async checkEdgeCaseHealth(): Promise<void> {
    try {
      const testUtils = (window as any).testEdgeCases;
      const deviceInfo = (window as any).deviceInfo;
      
      const metrics = {
        testUtilsAvailable: !!testUtils,
        deviceInfoAvailable: !!deviceInfo,
        edgeCaseHandlingEnabled: this.config.enableEdgeCaseHandling
      };
      
      const status = metrics.edgeCaseHandlingEnabled && metrics.deviceInfoAvailable ? 'healthy' : 'degraded';
      
      this.healthResults.set('edge_cases', {
        feature: 'Edge Case Handling',
        status,
        metrics,
        lastCheck: Date.now(),
        errorCount: 0
      });
      
    } catch (error) {
      this.healthResults.set('edge_cases', {
        feature: 'Edge Case Handling',
        status: 'critical',
        metrics: { error: error instanceof Error ? error.message : String(error) },
        lastCheck: Date.now(),
        errorCount: 1
      });
    }
  }

  /**
   * Evaluate overall system health
   */
  private evaluateOverallHealth(): void {
    const results = Array.from(this.healthResults.values());
    const criticalCount = results.filter(r => r.status === 'critical').length;
    const degradedCount = results.filter(r => r.status === 'degraded').length;
    
    const previousHealth = this.isHealthy;
    this.isHealthy = criticalCount === 0 && degradedCount < 2;
    
    // Log health status change
    if (previousHealth !== this.isHealthy) {
      const message = this.isHealthy ? 
        '✅ System health recovered' : 
        `⚠️ System health degraded (${criticalCount} critical, ${degradedCount} degraded)`;
      console.warn(`[${new Date().toISOString()}] ${message}`);
    }
    
    // Trigger rollback if too many critical issues
    if (criticalCount >= 2 && !this.rollbackTriggered) {
      this.triggerRollback('Multiple critical health issues detected');
    }
  }

  /**
   * Trigger rollback to client-side countdown
   */
  public triggerRollback(reason: string): void {
    if (this.rollbackTriggered) return;
    
    this.rollbackTriggered = true;
    console.error(`[${new Date().toISOString()}] 🔄 ROLLBACK TRIGGERED: ${reason}`);
    
    // Update configuration to disable server-side features
    this.config.enableServerSync = false;
    this.config.clientSideCountdownFallback = true;
    this.config.enableChecksumValidation = false;
    this.saveDeploymentConfig();
    
    // Notify user
    import('./notifications.js').then(({ notifications }) => {
      notifications.warning('System issues detected - switching to fallback mode', 8000);
    }).catch(() => {});
    
    // Store rollback event
    const rollbackEvent = {
      timestamp: Date.now(),
      reason,
      healthResults: Array.from(this.healthResults.entries()),
      config: this.config
    };
    localStorage.setItem('wordRushLastRollback', JSON.stringify(rollbackEvent));
    
    // Reload page to apply fallback configuration
    setTimeout(() => {
      console.log(`[${new Date().toISOString()}] 🔄 Reloading page to apply rollback configuration...`);
      window.location.reload();
    }, 3000);
  }

  /**
   * Manual rollback for testing/emergency
   */
  public manualRollback(): void {
    this.triggerRollback('Manual rollback requested');
  }

  /**
   * Get current health status
   */
  public getHealthStatus(): any {
    return {
      isHealthy: this.isHealthy,
      rollbackTriggered: this.rollbackTriggered,
      config: this.config,
      results: Array.from(this.healthResults.entries()),
      lastCheck: Math.max(...Array.from(this.healthResults.values()).map(r => r.lastCheck))
    };
  }

  /**
   * Reset rollback state (for recovery)
   */
  public resetRollback(): void {
    this.rollbackTriggered = false;
    this.config.enableServerSync = true;
    this.config.clientSideCountdownFallback = false;
    this.saveDeploymentConfig();
    
    console.log(`[${new Date().toISOString()}] 🔄 Rollback state reset - server sync re-enabled`);
  }

  /**
   * Export health data for analysis
   */
  public exportHealthData(): any {
    return {
      healthResults: Array.from(this.healthResults.entries()),
      config: this.config,
      isHealthy: this.isHealthy,
      rollbackTriggered: this.rollbackTriggered,
      lastRollback: localStorage.getItem('wordRushLastRollback'),
      timestamp: Date.now()
    };
  }
}

// Initialize health service
const deploymentHealth = new DeploymentHealthService();

// Export for use
export { deploymentHealth, DeploymentHealthService };

// Development utilities
if (process.env.NODE_ENV === 'development') {
  (window as any).deploymentHealth = deploymentHealth;
  (window as any).triggerRollback = () => deploymentHealth.manualRollback();
  (window as any).getHealthStatus = () => deploymentHealth.getHealthStatus();
  (window as any).exportHealthData = () => deploymentHealth.exportHealthData();
  
  console.log('🏥 Deployment health utilities available:');
  console.log('  - window.getHealthStatus() - Get current health status');
  console.log('  - window.triggerRollback() - Manually trigger rollback');
  console.log('  - window.exportHealthData() - Export health data');
  console.log('  - window.deploymentHealth - Direct access to health service');
} 