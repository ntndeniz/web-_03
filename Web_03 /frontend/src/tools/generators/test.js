const fs = require('fs');
const path = require('path');

const testTemplate = `import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'
import {ComponentName} from '@/components/{componentPath}'

describe('{ComponentName}', () => {
  // Test setup
  const createWrapper = (props = {}) => {
    return mount({ComponentName}, {
      props,
      global: {
        // Global plugins, components, etc.
      }
    })
  }

  it('renders correctly', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  it('matches snapshot', () => {
    const wrapper = createWrapper()
    expect(wrapper.html()).toMatchSnapshot()
  })

  describe('props', () => {
    it('handles props correctly', () => {
      const props = {
        // Test props
      }
      const wrapper = createWrapper(props)
      // Add assertions
    })
  })

  describe('events', () => {
    it('emits events correctly', async () => {
      const wrapper = createWrapper()
      // Trigger and test events
    })
  })

  describe('methods', () => {
    it('executes methods correctly', () => {
      const wrapper = createWrapper()
      // Test methods
    })
  })
})
`;

function generateTest(name, options = {}) {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  const componentPath = options.path || name.toLowerCase();
  const testsDir = path.join(process.cwd(), 'tests/unit/components');

  // Create directory if it doesn't exist
  if (!fs.existsSync(testsDir)) {
    fs.mkdirSync(testsDir, { recursive: true });
  }

  // Generate test file
  const testContent = testTemplate
    .replace(/{ComponentName}/g, componentName)
    .replace(/{componentPath}/g, componentPath);

  const filePath = path.join(testsDir, `${name}.spec.ts`);
  fs.writeFileSync(filePath, testContent);

  console.log(`Test ${componentName}.spec.ts created at ${filePath}`);
}

module.exports = {
  generateTest
}; 