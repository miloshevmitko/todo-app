const path = require('path');

module.exports = {
  webpack: {
    alias: {
      "@todo-app/client/api": path.resolve(__dirname, 'src/api.ts'),
      "@todo-app/client/components": path.resolve(__dirname, 'src/components/index.ts'),
      "@todo-app/client/configs": path.resolve(__dirname, 'src/configs/index.ts'),
      "@todo-app/client/features/todoItems": path.resolve(__dirname, 'src/features/todoItems/index.ts'),
      "@todo-app/client/mocks/server": path.resolve(__dirname, 'src/mocks/server.ts'),
    }
  },
};