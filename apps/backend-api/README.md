# Backend API Development Setup

## Nodemon Configuration

The backend API is now configured with nodemon for enhanced development experience. Nodemon automatically restarts the server when file changes are detected.

### Features

- **Auto-restart**: Server automatically restarts when files change
- **Shared-types watching**: Monitors changes in the `@stack/shared-types` package
- **TypeScript support**: Uses `tsx` for TypeScript execution
- **Configurable delay**: 1-second delay to prevent rapid restarts
- **Verbose logging**: Shows detailed information about file changes

### Available Scripts

```bash
# Start development server with nodemon
pnpm dev

# Start development server with tsx (fallback)
pnpm dev:tsx

# Build the application
pnpm build

# Start production server
pnpm start
```

### Watched Directories

Nodemon watches the following directories for changes:

- `src/**/*` - Backend API source files
- `../../packages/shared-types/src/**/*` - Shared types source files
- `../../packages/shared-types/dist/**/*` - Shared types compiled files

### Ignored Files

The following files and directories are ignored:

- `node_modules/**/*`
- `dist/**/*`
- `**/*.test.ts`
- `**/*.spec.ts`
- `**/__tests__/**/*`
- `coverage/**/*`
- `*.log`

### Manual Restart

You can manually restart the server by typing `rs` in the terminal where nodemon is running.

### Configuration

The nodemon configuration is stored in `nodemon.json`. Key settings:

- **delay**: 1000ms delay before restart
- **signal**: SIGTERM for graceful shutdown
- **legacyWatch**: Disabled for better performance
- **verbose**: Enabled for detailed logging

### Environment Variables

Make sure your `.env` file contains all required environment variables:

- `DATABASE_URL` - Database connection string
- `ADMIN_PRIVATE_KEY` - Thirdweb admin private key
- `THIRDWEB_SECRET_KEY` - Thirdweb secret key
- `THIRDWEB_CLIENT_ID` - Thirdweb client ID
- `PORT` - Server port (defaults to 3001)
- `FRONTEND_URL` - Frontend URL for CORS (defaults to http://localhost:8081)

### Troubleshooting

If nodemon doesn't detect changes in shared-types:

1. Ensure the shared-types package is built: `cd ../../packages/shared-types && pnpm build`
2. Check that the paths in `nodemon.json` are correct
3. Restart nodemon manually with `rs`
4. Check the verbose logs for file watching information

### Integration with Shared Types

The backend automatically watches for changes in the shared-types package, which means:

- Changes to Prisma schemas will trigger a restart
- Updates to shared TypeScript types will be detected
- Zod schema modifications will restart the server

This ensures that the backend always uses the latest shared types without manual restarts.