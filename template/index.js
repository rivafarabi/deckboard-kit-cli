const {
	Extension,
	log,
	INPUT_METHOD,
	PLATFORMS,
	ICONS
} = require('deckboard-kit');

class MyExtension extends Extension {
	constructor() {
		super();
		this.name = 'Sample Extension';
		this.platforms = [PLATFORMS.WINDOWS, PLATFORMS.MAC];
		this.inputs = [
			{
				label: 'Action',
				value: 'action',
				icon: 'book',
				fontIcon: ICONS.IONICONS,
				color: '#8E44AD',
				input: [
					{
						label: 'Action Value',
						ref: 'value',
						type: INPUT_METHOD.INPUT_TEXT
					}
				]
			}
		];
		this.configs = [];
	}

	// Executes when the extensions loaded every time the app start.
	initExtension() {
		return;
	}

	execute(action, args) {
		switch (action) {
			case 'action':
				log.info({
					type: 'action',
					ref: args.value
				});
				break;
			default:
				break;
		}
	};
}

module.exports = sendData => new MyExtension(sendData);
