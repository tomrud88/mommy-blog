# Auto Port Selection Scripts

This project includes scripts to automatically find and use available ports, preventing the common "port already in use" errors.

## Available Ports

The system will try to use ports in this order:

- 3000 (Next.js default)
- 3001
- 3002
- 3003
- 3004

If none of these are available, it will find the next available port starting from 3005.

## Usage

### Method 1: NPM Script (Recommended)

```bash
npm run dev:auto
```

### Method 2: Direct Node.js Script

```bash
node scripts/start-dev.js
```

### Method 3: PowerShell Script (Windows)

```powershell
# Navigate to project root first
cd c:\mommy-blog

# Run the PowerShell script
.\scripts\start-dev.ps1
```

## What These Scripts Do

1. **Port Detection**: Automatically scan for available ports from the predefined list
2. **Environment Update**: Update the `NEXTAUTH_URL` in `.env.local` to match the selected port
3. **Server Start**: Launch the Next.js development server on the available port

## Benefits

- ✅ No more manual port configuration
- ✅ Automatic environment variable updates
- ✅ Supports multiple development instances
- ✅ Cross-platform compatibility
- ✅ Prevents port conflict errors

## Traditional Method

If you prefer to use the traditional method:

```bash
npm run dev
```

This will use Next.js's built-in port detection, but won't automatically update the environment variables.
