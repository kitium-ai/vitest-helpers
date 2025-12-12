/**
 * Accessibility testing utilities for WCAG compliance and a11y checks
 */

// Error messages
const HTML_LANG_MESSAGE = 'HTML element must have a lang attribute';
const IMAGE_ALT_MESSAGE = 'Images must have alt text';

export type AccessibilityRule = {
  id: string;
  name: string;
  description: string;
  level: 'A' | 'AA' | 'AAA';
  impact: 'minor' | 'moderate' | 'serious' | 'critical';
  check: (element: unknown) => AccessibilityViolation | null;
};

export type AccessibilityViolation = {
  rule: string;
  impact: string;
  description: string;
  element?: string;
  help: string;
  helpUrl?: string;
};

export type AccessibilityResult = {
  violations: AccessibilityViolation[];
  passes: string[];
  incomplete: string[];
  inapplicable: string[];
  score: number; // 0-100
};

export class AccessibilityTester {
  private rules: AccessibilityRule[] = [];

  constructor() {
    this.loadDefaultRules();
  }

  addRule(rule: AccessibilityRule): void {
    this.rules.push(rule);
  }

  async testElement(element: unknown): Promise<AccessibilityResult> {
    await Promise.resolve();

    const violations: AccessibilityViolation[] = [];
    const passes: string[] = [];
    const incomplete: string[] = [];
    const inapplicable: string[] = [];

    for (const rule of this.rules) {
      try {
        const violation = rule.check(element);
        if (violation) {
          violations.push(violation);
        } else {
          passes.push(rule.id);
        }
      } catch (_error) {
        incomplete.push(rule.id);
      }
    }

    const score = this.calculateScore(violations, passes);

    return {
      violations,
      passes,
      incomplete,
      inapplicable,
      score,
    };
  }

  private checkHtmlLang(
    html: string,
    violations: AccessibilityViolation[],
    passes: string[]
  ): void {
    if (!html.includes('lang=')) {
      violations.push({
        rule: 'html-lang',
        impact: 'serious',
        description: HTML_LANG_MESSAGE,
        help: 'Add lang attribute to the html element',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/html-lang',
      });
    } else {
      passes.push('html-lang');
    }
  }

  private checkDocumentTitle(
    html: string,
    violations: AccessibilityViolation[],
    passes: string[]
  ): void {
    if (!html.includes('<title>')) {
      violations.push({
        rule: 'document-title',
        impact: 'serious',
        description: 'Document must have a title element',
        help: 'Add a title element to the head',
        helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/document-title',
      });
    } else {
      passes.push('document-title');
    }
  }

  private checkImageAlt(
    html: string,
    violations: AccessibilityViolation[],
    passes: string[]
  ): void {
    const imgRegex = /<img[^>]*>/gi;
    const images = html.match(imgRegex) || [];
    images.forEach((img) => {
      if (!img.includes('alt=')) {
        violations.push({
          rule: 'image-alt',
          impact: 'critical',
          description: IMAGE_ALT_MESSAGE,
          element: img,
          help: 'Add alt attribute to img elements',
          helpUrl: 'https://dequeuniversity.com/rules/axe/4.4/image-alt',
        });
      } else {
        passes.push('image-alt');
      }
    });
  }

  async testHTML(html: string): Promise<AccessibilityResult> {
    await Promise.resolve();

    const violations: AccessibilityViolation[] = [];
    const passes: string[] = [];
    const incomplete: string[] = [];
    const inapplicable: string[] = [];

    this.checkHtmlLang(html, violations, passes);
    this.checkDocumentTitle(html, violations, passes);
    this.checkImageAlt(html, violations, passes);

    const score = this.calculateScore(violations, passes);

    return {
      violations,
      passes,
      incomplete,
      inapplicable,
      score,
    };
  }

  private calculateScore(violations: AccessibilityViolation[], passes: string[]): number {
    const totalChecks = violations.length + passes.length;
    if (totalChecks === 0) {
      return 100;
    }

    // Weight violations by impact
    const violationScore = violations.reduce((score, violation) => {
      switch (violation.impact) {
        case 'minor':
          return score - 1;
        case 'moderate':
          return score - 2;
        case 'serious':
          return score - 3;
        case 'critical':
          return score - 4;
        default:
          return score - 2;
      }
    }, 100);

    return Math.max(0, violationScore);
  }

  private createHtmlLangRule(): AccessibilityRule {
    return {
      id: 'html-lang',
      name: 'HTML Language',
      description: HTML_LANG_MESSAGE,
      level: 'A',
      impact: 'serious',
      check: (element: unknown) => {
        if (typeof element === 'string') {
          return element.includes('<html lang=')
            ? null
            : {
                rule: 'html-lang',
                impact: 'serious',
                description: HTML_LANG_MESSAGE,
                help: 'Add lang attribute to the html element',
              };
        }
        return null;
      },
    };
  }

  private createImageAltRule(): AccessibilityRule {
    return {
      id: 'image-alt',
      name: 'Image Alt Text',
      description: IMAGE_ALT_MESSAGE,
      level: 'A',
      impact: 'critical',
      check: (element: unknown) => {
        if (typeof element === 'string' && element.includes('<img')) {
          return element.includes('alt=')
            ? null
            : {
                rule: 'image-alt',
                impact: 'critical',
                description: IMAGE_ALT_MESSAGE,
                help: 'Add alt attribute to img elements',
              };
        }
        return null;
      },
    };
  }

  private createColorContrastRule(): AccessibilityRule {
    return {
      id: 'color-contrast',
      name: 'Color Contrast',
      description: 'Text must have sufficient color contrast',
      level: 'AA',
      impact: 'serious',
      check: () => {
        // This would require actual color analysis
        return null; // Placeholder
      },
    };
  }

  private loadDefaultRules(): void {
    this.rules = [
      this.createHtmlLangRule(),
      this.createImageAltRule(),
      this.createColorContrastRule(),
    ];
  }
}

export class AccessibilityReporter {
  generateReport(result: AccessibilityResult): string {
    let report = '# Accessibility Test Report\n\n';

    report += `## Summary\n\n`;
    report += `- Score: ${result.score}/100\n`;
    report += `- Violations: ${result.violations.length}\n`;
    report += `- Passes: ${result.passes.length}\n`;
    report += `- Incomplete: ${result.incomplete.length}\n\n`;

    if (result.violations.length > 0) {
      report += `## Violations\n\n`;
      result.violations.forEach((violation, index) => {
        report += `### ${index + 1}. ${violation.description}\n`;
        report += `- **Rule:** ${violation.rule}\n`;
        report += `- **Impact:** ${violation.impact}\n`;
        report += `- **Help:** ${violation.help}\n`;
        if (violation.helpUrl) {
          report += `- **Help URL:** ${violation.helpUrl}\n`;
        }
        if (violation.element) {
          report += `- **Element:** \`${violation.element}\`\n`;
        }
        report += '\n';
      });
    }

    if (result.passes.length > 0) {
      report += `## Passed Checks\n\n`;
      result.passes.forEach((rule) => {
        report += `- ${rule}\n`;
      });
      report += '\n';
    }

    return report;
  }

  generateJSONReport(result: AccessibilityResult): string {
    return JSON.stringify(result, null, 2);
  }
}

export const accessibilityTester = new AccessibilityTester();
export const accessibilityReporter = new AccessibilityReporter();
