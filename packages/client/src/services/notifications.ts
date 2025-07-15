/**
 * Client-side Notification Service
 * Handles displaying toast notifications for server errors and rate limiting
 */

export type NotificationType = 'error' | 'warning' | 'info' | 'success';

export interface NotificationOptions {
  type: NotificationType;
  message: string;
  duration?: number;
  persistent?: boolean;
}

export class NotificationService {
  private container: HTMLElement | null = null;
  private notifications: Map<string, HTMLElement> = new Map();

  constructor() {
    this.createContainer();
  }

  /**
   * Create the notification container
   */
  private createContainer(): void {
    this.container = document.createElement('div');
    this.container.id = 'notification-container';
    this.container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  }

  /**
   * Show a notification
   */
  show(options: NotificationOptions): string {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification = this.createNotification(id, options);
    
    if (this.container) {
      this.container.appendChild(notification);
      this.notifications.set(id, notification);
    }

    // Auto-remove after duration (default 5 seconds)
    if (!options.persistent) {
      setTimeout(() => {
        this.remove(id);
      }, options.duration || 5000);
    }

    return id;
  }

  /**
   * Create a notification element
   */
  private createNotification(id: string, options: NotificationOptions): HTMLElement {
    const notification = document.createElement('div');
    notification.id = id;
    notification.style.cssText = `
      background: ${this.getBackgroundColor(options.type)};
      color: white;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      line-height: 1.4;
      max-width: 100%;
      word-wrap: break-word;
      pointer-events: auto;
      cursor: pointer;
      opacity: 0;
      transform: translateX(100%);
      transition: all 0.3s ease;
    `;

    // Add close button
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      background: none;
      border: none;
      color: white;
      font-size: 18px;
      cursor: pointer;
      padding: 0;
      width: 20px;
      height: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
    `;
    closeButton.onclick = () => this.remove(id);

    // Add message
    const messageElement = document.createElement('div');
    messageElement.style.cssText = `
      padding-right: 30px;
      font-weight: 500;
    `;
    messageElement.textContent = options.message;

    notification.appendChild(messageElement);
    notification.appendChild(closeButton);

    // Click to dismiss
    notification.onclick = () => this.remove(id);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);

    return notification;
  }

  /**
   * Get background color based on notification type
   */
  private getBackgroundColor(type: NotificationType): string {
    switch (type) {
      case 'error':
        return '#ff5252';
      case 'warning':
        return '#ff9800';
      case 'info':
        return '#2196f3';
      case 'success':
        return '#4caf50';
      default:
        return '#757575';
    }
  }

  /**
   * Remove a notification
   */
  remove(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        this.notifications.delete(id);
      }, 300);
    }
  }

  /**
   * Clear all notifications
   */
  clearAll(): void {
    this.notifications.forEach((_, id) => {
      this.remove(id);
    });
  }

  /**
   * Show an error notification
   */
  error(message: string, duration?: number): string {
    return this.show({ type: 'error', message, duration });
  }

  /**
   * Show a warning notification
   */
  warning(message: string, duration?: number): string {
    return this.show({ type: 'warning', message, duration });
  }

  /**
   * Show an info notification
   */
  info(message: string, duration?: number): string {
    return this.show({ type: 'info', message, duration });
  }

  /**
   * Show a success notification
   */
  success(message: string, duration?: number): string {
    return this.show({ type: 'success', message, duration });
  }
}

// Export singleton instance
export const notifications = new NotificationService(); 