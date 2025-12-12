# Deckboard Extension Development Guide

## Overview

This guide will help you create custom extensions for Deckboard using the deckboard-kit.

## Project Structure

```
your-extension/
├── extension.yml      # Extension metadata
├── index.js          # Main extension code
├── package.json      # Node dependencies
├── .eslintrc.js      # Linting configuration
├── .prettierrc.json  # Code formatting
├── .editorconfig     # Editor settings
└── .gitignore        # Git ignore rules
```

## Extension Configuration (extension.yml)

```yaml
name: Your Extension Name
package: your-extension-name
version: 1.0.0
description: What your extension does
author: Your Name
license: MIT
repository: "https://github.com/yourusername/your-extension"
```

## Extension Class Structure

### Basic Template

```javascript
const { Extension, InputTypes, Platforms, Icons, log } = require('deckboard-kit');

class MyExtension extends Extension {
	constructor() {
		super();
		this.name = 'My Extension';
		this.platforms = [Platforms.windows, Platforms.mac, Platforms.linux];
		
		// Define available actions
		this.inputs = [
			{
				label: 'Action Name',
				value: 'action-id',
				icon: 'icon-name',
				fontIcon: Icons.ionicons,
				color: '#8E44AD',
				input: [
					{
						label: 'Parameter Name',
						ref: 'param1',
						type: InputTypes.text
					}
				]
			}
		];
		
		// Define configuration options (optional)
		this.configs = [];
	}

	// Called when extension loads
	initExtension() {
		log.info('Extension initialized');
	}

	// Called when user triggers an action
	execute(action, args) {
		switch (action) {
			case 'action-id':
				log.info('Action executed with:', args);
				// Your action logic here
				break;
			default:
				break;
		}
	}
}

module.exports = new MyExtension();
```

## Available Constants

### Platforms
- `Platforms.windows` - Windows OS
- `Platforms.mac` - macOS
- `Platforms.linux` - Linux

### Input Methods
- `InputTypes.text` - Text input field
- `InputTypes.select` - Dropdown selection
- `InputTypes.number` - Number input
- `InputTypes.file` - File picker dialog
- `InputTypes.folder` - Folder picker dialog

### Icons
- `Icons.ionicons` - Ionicons (default)
- `Icons.fontAwesomeSolid` - Font Awesome Solid (prefix: 'fas')
- `Icons.fontAwesomeBrand` - Font Awesome Brand (prefix: 'fab')

## Input Configuration

### Text Input
```javascript
{
	label: 'Enter text',
	ref: 'myText',
	type: InputTypes.text,
	placeholder: 'Optional placeholder'
}
```

### Select/Dropdown
```javascript
{
	label: 'Choose option',
	ref: 'myOption',
	type: InputTypes.select,
	items: [
		{ label: 'Option 1', value: 'opt1' },
		{ label: 'Option 2', value: 'opt2' }
	]
}
```

### Dynamic Select (async)
```javascript
async getDynamicOptions() {
	// Fetch or generate options dynamically
	return [
		{ label: 'Dynamic 1', value: 'dyn1' },
		{ label: 'Dynamic 2', value: 'dyn2' }
	];
}

// In setInputOptions()
{
	label: 'Dynamic choice',
	ref: 'dynamicOption',
	type: InputTypes.select,
	items: await this.getDynamicOptions()
}
```

### File/Folder Picker
```javascript
{
	label: 'Select file',
	ref: 'filePath',
	type: InputTypes.file
}

{
	label: 'Select folder',
	ref: 'folderPath',
	type: InputTypes.folder
}
```

## Logging

```javascript
const { log } = require('deckboard-kit');

log.info('Information message');
log.warn('Warning message');
log.error('Error message');
log.debug('Debug message');
```

## Executing System Commands

```javascript
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Async/await style (recommended)
async executeCommand() {
	try {
		const { stdout, stderr } = await execAsync('your-command');
		log.info('Output:', stdout);
	} catch (error) {
		log.error('Command failed:', error);
	}
}

// Callback style
exec('your-command', (error, stdout, stderr) => {
	if (error) {
		log.error('Error:', error);
		return;
	}
	log.info('Output:', stdout);
});
```

## Best Practices

### 1. Error Handling
Always wrap risky operations in try-catch blocks:

```javascript
execute(action, args) {
	try {
		switch (action) {
			case 'my-action':
				this.performAction(args);
				break;
		}
	} catch (error) {
		log.error('Action failed:', error);
	}
}
```

### 2. Async Operations
Use async/await for cleaner asynchronous code:

```javascript
async setInputOptions() {
	this.inputs = [
		{
			label: 'Action',
			value: 'action',
			icon: 'book',
			fontIcon: Icons.ionicons,
			color: '#8E44AD',
			input: [
				{
					label: 'Options',
					ref: 'option',
					type: InputTypes.select,
					items: await this.fetchOptions()
				}
			]
		}
	];
}
```

### 3. Platform-Specific Logic
```javascript
const os = require('os');

execute(action, args) {
	const platform = os.platform();
	
	if (platform === 'win32') {
		// Windows-specific code
	} else if (platform === 'darwin') {
		// macOS-specific code
	} else {
		// Linux or other
	}
}
```

### 4. Clean Up Resources
```javascript
destructor() {
	// Clean up resources when extension unloads
	// Close connections, clear intervals, etc.
}
```

## Development Workflow

### 1. Create Extension
```bash
deckboard-kit --create my-extension
cd my-extension
npm install
```

### 2. Development
- Edit `index.js` with your extension logic
- Run ESLint: `npm run lint`
- Fix formatting: `npm run format`

### 3. Testing
- Build the extension: `npm run build`
- Copy the `.asar` file from `dist/` to `%USERPROFILE%\deckboard\extensions\`
- Restart Deckboard app

### 4. Building for Distribution
```bash
npm run build
```

The built `.asar` file will be in the `dist/` folder.

## Common Patterns

### Extension with Configuration
```javascript
constructor() {
	super();
	this.configs = [
		{
			label: 'API Key',
			ref: 'apiKey',
			type: InputTypes.text,
			placeholder: 'Enter your API key'
		}
	];
}

// Access config values
execute(action, args) {
	const apiKey = this.configs.find(c => c.ref === 'apiKey').value;
	// Use apiKey...
}
```

### Dynamic Input Updates
```javascript
constructor() {
	super();
	this.initExtension();
}

initExtension() {
	this.setInputOptions();
}

// Call this when you need to refresh options
update() {
	this.setInputOptions();
}

async setInputOptions() {
	// Fetch fresh data and update inputs
	this.inputs = [...];
}
```

## Troubleshooting

### Extension Not Loading
1. Check `extension.yml` format
2. Verify `package.json` main field points to `index.js`
3. Check Deckboard logs for errors

### Actions Not Appearing
1. Ensure `this.inputs` is properly configured
2. Verify platform compatibility in `this.platforms`
3. Check for JavaScript syntax errors

### Build Fails
1. Run `npm install` to ensure all dependencies are installed
2. Check for syntax errors with `npm run lint`
3. Verify `extension.yml` exists and is valid

## Resources

- [Deckboard Extensions Repository](https://github.com/rivafarabi/deckboard-extensions)
- [Example Extensions](https://github.com/rivafarabi/deckboard-kit#example)
- [Submit Your Extension](https://github.com/rivafarabi/deckboard-extensions)

## Example Extensions

Study these for reference:
- [Power Control](https://github.com/rivafarabi/deckboard-power-control) - System power operations
- [Steam Launcher](https://github.com/rivafarabi/steam-launcher) - Launch Steam games
