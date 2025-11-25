/**
 * Browser mode testing helpers
 * Utilities for @vitest/browser
 */

/**
 * Browser test setup helper
 */
export function setupBrowserTest(options: {
  provider?: 'playwright' | 'webdriverio';
  browser?: 'chromium' | 'firefox' | 'webkit';
  headless?: boolean;
} = {}) {
  const { provider = 'playwright', browser = 'chromium', headless = true } = options;

  return {
    provider,
    name: browser,
    headless,
  };
}

/**
 * Common browser test patterns
 */
export const BrowserHelpers = {
  /**
   * Wait for an element to appear
   */
  waitForElement: async (selector: string, timeout = 5000): Promise<Element> => {
    const startTime = Date.now();

    while (true) {
      const element = document.querySelector(selector);
      if (element) {
        return element;
      }

      if (Date.now() - startTime > timeout) {
        throw new Error(`Element ${selector} not found within ${timeout}ms`);
      }

      await new Promise((resolve) => setTimeout(resolve, 50));
    }
  },

  /**
   * Click an element
   */
  click: async (selector: string): Promise<void> => {
    const element = await BrowserHelpers.waitForElement(selector);
    if (element instanceof HTMLElement) {
      element.click();
    }
  },

  /**
   * Type into an input
   */
  type: async (selector: string, text: string): Promise<void> => {
    const element = await BrowserHelpers.waitForElement(selector);
    if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
      element.value = text;
      element.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },

  /**
   * Get text content
   */
  getText: async (selector: string): Promise<string> => {
    const element = await BrowserHelpers.waitForElement(selector);
    return element.textContent ?? '';
  },
};
