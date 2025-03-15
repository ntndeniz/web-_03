const fs = require('fs');
const path = require('path');

const serviceTemplate = `import axios from 'axios'
import { API_URL } from '@/config/constants'

export class {ServiceName}Service {
  private baseUrl: string

  constructor() {
    this.baseUrl = \`\${API_URL}/{servicePath}\`
  }

  async getAll(params?: any) {
    const response = await axios.get(this.baseUrl, { params })
    return response.data
  }

  async getById(id: string | number) {
    const response = await axios.get(\`\${this.baseUrl}/\${id}\`)
    return response.data
  }

  async create(data: any) {
    const response = await axios.post(this.baseUrl, data)
    return response.data
  }

  async update(id: string | number, data: any) {
    const response = await axios.put(\`\${this.baseUrl}/\${id}\`, data)
    return response.data
  }

  async delete(id: string | number) {
    const response = await axios.delete(\`\${this.baseUrl}/\${id}\`)
    return response.data
  }
}

export const {serviceName}Service = new {ServiceName}Service()
`;

function generateService(name, options = {}) {
  const serviceName = name.charAt(0).toUpperCase() + name.slice(1);
  const servicePath = name.toLowerCase();
  const servicesDir = path.join(process.cwd(), 'src/services');

  // Create directory if it doesn't exist
  if (!fs.existsSync(servicesDir)) {
    fs.mkdirSync(servicesDir, { recursive: true });
  }

  // Generate service file
  const serviceContent = serviceTemplate
    .replace(/{ServiceName}/g, serviceName)
    .replace(/{serviceName}/g, name.toLowerCase())
    .replace(/{servicePath}/g, servicePath);

  const filePath = path.join(servicesDir, `${name}.service.ts`);
  fs.writeFileSync(filePath, serviceContent);

  console.log(`Service ${serviceName} created at ${filePath}`);
}

module.exports = {
  generateService
}; 