export const PERMISSIONS = {
  // User Permissions
  USER: {
    CREATE: 'user:create',
    READ: 'user:read',
    UPDATE: 'user:update',
    DELETE: 'user:delete',
    MANAGE: 'user:manage'
  },

  // Product Permissions
  PRODUCT: {
    CREATE: 'product:create',
    READ: 'product:read',
    UPDATE: 'product:update',
    DELETE: 'product:delete',
    MANAGE: 'product:manage'
  },

  // Order Permissions
  ORDER: {
    CREATE: 'order:create',
    READ: 'order:read',
    UPDATE: 'order:update',
    DELETE: 'order:delete',
    MANAGE: 'order:manage'
  },

  // Content Permissions
  CONTENT: {
    CREATE: 'content:create',
    READ: 'content:read',
    UPDATE: 'content:update',
    DELETE: 'content:delete',
    MANAGE: 'content:manage'
  },

  // Settings Permissions
  SETTINGS: {
    READ: 'settings:read',
    UPDATE: 'settings:update',
    MANAGE: 'settings:manage'
  }
}

export const ROLES = {
  SUPER_ADMIN: 'super-admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  EDITOR: 'editor',
  USER: 'user'
}

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS).flatMap(group => Object.values(group)),
  [ROLES.ADMIN]: [
    PERMISSIONS.USER.MANAGE,
    PERMISSIONS.PRODUCT.MANAGE,
    PERMISSIONS.ORDER.MANAGE,
    PERMISSIONS.CONTENT.MANAGE,
    PERMISSIONS.SETTINGS.MANAGE
  ],
  [ROLES.MANAGER]: [
    PERMISSIONS.USER.READ,
    PERMISSIONS.PRODUCT.MANAGE,
    PERMISSIONS.ORDER.MANAGE,
    PERMISSIONS.CONTENT.READ
  ],
  [ROLES.EDITOR]: [
    PERMISSIONS.PRODUCT.READ,
    PERMISSIONS.PRODUCT.UPDATE,
    PERMISSIONS.CONTENT.MANAGE
  ],
  [ROLES.USER]: [
    PERMISSIONS.PRODUCT.READ,
    PERMISSIONS.ORDER.CREATE,
    PERMISSIONS.ORDER.READ
  ]
} 