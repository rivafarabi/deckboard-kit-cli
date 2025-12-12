# deckboard-kit-cli

Command-line interface for creating and building Deckboard extensions.

## Features

- 🎨 **Create** new extension projects with complete boilerplate
- 📦 **Build** extensions with optimized `.asar` packaging

## Installation

```bash
npm install -g deckboard-kit-cli
```

## Commands

### Create a New Extension

```bash
deckboard-kit --create <extension-name>
```

Creates a new extension project with:
- Pre-configured `package.json`
- Extension metadata (`extension.yml`)
- Template code with examples
- Development documentation
- Git ignore rules

**Interactive prompts for:**
- Extension name
- Package name
- Description
- Author name

### Build an Extension

```bash
deckboard-kit --build
```

Run from within an extension project folder. Creates an optimized `.asar` package in the `dist/` folder.

**Build optimizations:**
- Removes all devDependencies
- Excludes test files and specs
- Removes documentation (except README.md)
- Strips IDE and Git files
- Eliminates cache directories
- Minimizes final bundle size

### Build and Install

```bash
deckboard-kit --install
```

Builds the extension and copies it directly to your Deckboard extensions folder.

## Project Structure

Generated projects include:

```
your-extension/
├── index.js               # Main extension code
├── extension.yml          # Metadata (name, version, etc.)
├── package.json           # Node.js configuration
├── README.md              # Project documentation
├── EXTENSION_GUIDE.md     # Development guide
├── .eslintrc.js          # ESLint configuration
├── .prettierrc.json      # Prettier configuration
├── .editorconfig         # Editor configuration
└── .gitignore            # Git ignore rules
```

## Generated Scripts

Every extension project includes:

```bash
npm run build      # Build the extension to .asar
npm run install    # Build and install to Deckboard
npm run lint       # Run ESLint
npm run format     # Format code with Prettier
```

## Extension Metadata (extension.yml)

```yaml
name: Extension Display Name
package: extension-package-name
version: 1.0.0
description: What your extension does
author: Your Name
license: MIT
repository: "https://github.com/username/repo"
```

## Build Process

The build process:

1. ✅ Validates `extension.yml`
2. 📁 Copies project to temporary folder
3. 🗑️ Removes devDependencies
4. 🧹 Cleans unnecessary files:
   - Test files (`.test.js`, `.spec.js`)
   - Documentation (except README.md)
   - IDE folders (`.vscode`, `.idea`)
   - Git files and history
   - Cache directories
   - Configuration files for development
5. 📦 Creates optimized `.asar` package
6. 🚀 Outputs to `dist/` folder

## Development Workflow

```bash
# 1. Create a new extension
deckboard-kit --create my-extension
cd my-extension
npm install

# 2. Develop your extension
# Edit index.js with your logic

# 3. Lint and format
npm run lint
npm run format

# 4. Build
npm run build

# 5. Test
# Copy dist/my-extension.asar to:
#   Windows: %USERPROFILE%\deckboard\extensions\
#   macOS: ~/deckboard/extensions/
#   Linux: ~/deckboard/extensions/
# Restart Deckboard

# Or use the install command:
npm run install
```

## Requirements

- Node.js 12 or higher
- npm or yarn

## Dependencies

- **asar** - Archive creation
- **chalk** - Terminal styling
- **fs-extra** - Enhanced file operations
- **galactus** - Dependency cleanup
- **inquirer** - Interactive prompts
- **listr** - Task runner with progress
- **yaml** - YAML parsing

## API

### JavaScript API

```javascript
const { buildExtension } = require('deckboard-kit-cli/build');
const { createProject } = require('deckboard-kit-cli/create');

// Build extension
await buildExtension(install = false);

// Create project
await createProject({
	extName: 'My Extension',
	packageName: 'my-extension',
	description: 'Extension description',
	author: 'Author Name'
});
```

## Troubleshooting

**Build fails with "extension.yml not found"**
- Ensure you're in an extension project directory
- Check that `extension.yml` exists

**Large bundle sizes**
- The CLI automatically optimizes builds
- Check your dependencies - avoid large packages
- Use `asar list dist/your-extension.asar` to inspect contents

**Extension not loading in Deckboard**
- Verify the `.asar` file is in the correct directory
- Check Deckboard logs for errors
- Ensure `extension.yml` format is correct

## Contributing

Contributions welcome! Submit issues and PRs to the GitHub repository.

## License

MIT

## Links

- [deckboard-kit](https://github.com/rivafarabi/deckboard-kit) - Core library
- [Deckboard Extensions](https://github.com/rivafarabi/deckboard-extensions) - Extension directory
- [Example Extensions](https://github.com/rivafarabi/deckboard-kit#example)
