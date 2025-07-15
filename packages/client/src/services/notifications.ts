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

/**
 * Notification service module interface
 */
interface NotificationModule {
  show: (options: NotificationOptions) => string;
  remove: (id: string) => void;
  clearAll: () => void;
  error: (message: string, duration?: number) => string;
  warning: (message: string, duration?: number) => string;
  info: (message: string, duration?: number) => string;
  success: (message: string, duration?: number) => string;
}

/**
 * Create a notification service for displaying toast notifications
 * @returns Notification service module with functions for showing notifications
 */
function createNotificationService(): NotificationModule {
  let container: HTMLElement | null = null;
  const notifications = new Map<string, HTMLElement>();

  /**
   * Create the notification container in the DOM
   */
  function createContainer(): void {
    container = document.createElement('div');
    container.id = 'notification-container';
    container.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
      pointer-events: none;
    `;
    document.body.appendChild(container);
  }

  /**
   * Get background color based on notification type
   * @param type - The notification type
   * @returns CSS color string for the notification background
   */
  function getBackgroundColor(type: NotificationType): string {
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
   * Create a notification element
   * @param id - Unique identifier for the notification
   * @param options - Notification configuration options
   * @returns HTMLElement representing the notification
   */
  function createNotification(id: string, options: NotificationOptions): HTMLElement {
    const notification = document.createElement('div');
    notification.id = id;
    notification.style.cssText = `
      background: ${getBackgroundColor(options.type)};
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
    closeButton.onclick = () => remove(id);

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
    notification.onclick = () => remove(id);

    // Animate in
    setTimeout(() => {
      notification.style.opacity = '1';
      notification.style.transform = 'translateX(0)';
    }, 10);

    return notification;
  }

  /**
   * Show a notification
   * @param options - Notification configuration options
   * @returns Unique identifier for the notification
   */
  function show(options: NotificationOptions): string {
    // Create container if it doesn't exist
    if (!container) {
      createContainer();
    }

    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const notification = createNotification(id, options);
    
    if (container) {
      container.appendChild(notification);
      notifications.set(id, notification);
    }

    // Auto-remove after duration (default 5 seconds)
    if (!options.persistent) {
      setTimeout(() => {
        remove(id);
      }, options.duration || 5000);
    }

    return id;
  }

  /**
   * Remove a notification
   * @param id - Unique identifier of the notification to remove
   */
  function remove(id: string): void {
    const notification = notifications.get(id);
    if (notification) {
      notification.style.opacity = '0';
      notification.style.transform = 'translateX(100%)';
      
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
        notifications.delete(id);
      }, 300);
    }
  }

  /**
   * Clear all notifications
   */
  function clearAll(): void {
    notifications.forEach((_, id) => {
      remove(id);
    });
  }

  /**
   * Show an error notification
   * @param message - Error message to display
   * @param duration - Duration in milliseconds (optional)
   * @returns Unique identifier for the notification
   */
  function error(message: string, duration?: number): string {
    return show({ type: 'error', message, duration });
  }

  /**
   * Show a warning notification
   * @param message - Warning message to display
   * @param duration - Duration in milliseconds (optional)
   * @returns Unique identifier for the notification
   */
  function warning(message: string, duration?: number): string {
    return show({ type: 'warning', message, duration });
  }

  /**
   * Show an info notification
   * @param message - Info message to display
   * @param duration - Duration in milliseconds (optional)
   * @returns Unique identifier for the notification
   */
  function info(message: string, duration?: number): string {
    return show({ type: 'info', message, duration });
  }

  /**
   * Show a success notification
   * @param message - Success message to display
   * @param duration - Duration in milliseconds (optional)
   * @returns Unique identifier for the notification
   */
  function success(message: string, duration?: number): string {
    return show({ type: 'success', message, duration });
  }

  // Return the public API
  return {
    show,
    remove,
    clearAll,
    error,
    warning,
    info,
    success,
  };
}

// Create and export singleton instance
export const notifications = createNotificationService(); 