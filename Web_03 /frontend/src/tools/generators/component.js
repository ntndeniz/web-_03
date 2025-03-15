const fs = require('fs');
const path = require('path');

const componentTemplate = `<template>
  <div class="component-name">
    <!-- Component content -->
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ComponentName',
  
  props: {
    // Component props
  },
  
  setup(props) {
    // Component logic
    return {
      // Template variables
    }
  }
})
</script>

<style scoped>
/* Component styles */
</style>
`;

function generateComponent(name, directory = 'components') {
  const componentName = name.charAt(0).toUpperCase() + name.slice(1);
  const componentPath = path.join(process.cwd(), 'src', directory, `${componentName}.vue`);
  
  // Create directories if they don't exist
  const dir = path.dirname(componentPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Replace template placeholders
  const content = componentTemplate
    .replace(/component-name/g, kebabCase(componentName))
    .replace(/ComponentName/g, componentName);

  // Write component file
  fs.writeFileSync(componentPath, content);
  
  console.log(`Component ${componentName} created at ${componentPath}`);
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

module.exports = {
  generateComponent
}; 