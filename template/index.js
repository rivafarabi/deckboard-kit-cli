const {
	Extension,
	log,
	InputTypes,
	Platforms,
	Icons
} = require('deckboard-kit');

/**
 * Sample Extension for Deckboard
 * 
 * This template demonstrates:
 * - Basic extension structure
 * - Input configuration with different types
 * - Action execution
 * - Logging
 * 
 * For detailed documentation, see EXTENSION_GUIDE.md
 */
class MyExtension extends Extension {
	constructor() {
		super();
		this.name = 'Sample Extension';
		
		// Define which platforms this extension supports
		this.platforms = [Platforms.windows, Platforms.mac, Platforms.linux];
		
		// Define available actions
		this.inputs = [
			{
				label: 'Simple Action',
				value: 'simple-action',
				icon: 'book',
				fontIcon: Icons.ionicons,
				color: '#8E44AD',
				input: [
					{
						label: 'Text Input',
						ref: 'textValue',
						type: InputTypes.text,
						placeholder: 'Enter some text'
					}
				]
			},
			{
				label: 'Action with Select',
				value: 'select-action',
				icon: 'list',
				fontIcon: Icons.ionicons,
				color: '#3498DB',
				input: [
					{
						label: 'Choose Option',
						ref: 'option',
						type: InputTypes.select,
						items: [
							{ label: 'Option 1', value: 'opt1' },
							{ label: 'Option 2', value: 'opt2' },
							{ label: 'Option 3', value: 'opt3' }
						]
					}
				]
			},
			{
				label: 'File Action',
				value: 'file-action',
				icon: 'folder',
				fontIcon: Icons.ionicons,
				color: '#E67E22',
				input: [
					{
						label: 'Select File',
						ref: 'filePath',
						type: InputTypes.file
					}
				]
			}
		];
		
		// Optional: Define extension configuration
		this.configs = [
			// Example:
			// {
			//     label: 'API Key',
			//     ref: 'apiKey',
			//     type: InputTypes.text,
			//     placeholder: 'Enter your API key'
			// }
		];
	}

	/**
	 * Called when the extension is loaded
	 * Use this for initialization tasks
	 */
	initExtension() {
		log.info('Sample Extension initialized');
		// Add initialization code here
		// Examples:
		// - Load configuration
		// - Set up connections
		// - Initialize resources
	}

	/**
	 * Called when a user triggers an action
	 * @param {string} action - The action identifier
	 * @param {object} args - Arguments passed from the button configuration
	 */
	execute(action, args) {
		try {
			switch (action) {
				case 'simple-action':
					this.handleSimpleAction(args);
					break;
				
				case 'select-action':
					this.handleSelectAction(args);
					break;
				
				case 'file-action':
					this.handleFileAction(args);
					break;
				
				default:
					log.warn(`Unknown action: ${action}`);
					break;
			}
		} catch (error) {
			log.error('Error executing action:', error);
		}
	}

	/**
	 * Handle simple text action
	 */
	handleSimpleAction(args) {
		log.info('Simple action triggered with value:', args.textValue);
		
		// Add your logic here
		// Example: Execute a command, make an API call, etc.
	}

	/**
	 * Handle action with selection
	 */
	handleSelectAction(args) {
		log.info('Select action triggered with option:', args.option);
		
		// Add your logic here based on selected option
		switch (args.option) {
			case 'opt1':
				log.info('Executing option 1');
				break;
			case 'opt2':
				log.info('Executing option 2');
				break;
			case 'opt3':
				log.info('Executing option 3');
				break;
		}
	}

	/**
	 * Handle file-based action
	 */
	handleFileAction(args) {
		log.info('File action triggered with path:', args.filePath);
		
		// Add your logic here
		// Example: Process the file, execute it, etc.
		
		// Example of executing system commands:
		// const { exec } = require('child_process');
		// exec(`your-command "${args.filePath}"`, (error, stdout, stderr) => {
		//     if (error) {
		//         log.error('Command failed:', error);
		//         return;
		//     }
		//     log.info('Output:', stdout);
		// });
	}

	/**
	 * Optional: Called when extension is unloaded
	 * Use this for cleanup
	 */
	// destructor() {
	//     log.info('Sample Extension destroyed');
	//     // Clean up resources here
	// }
}

module.exports = new MyExtension();
