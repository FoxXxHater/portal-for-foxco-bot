module.exports = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	darkMode: 'class',
	plugins: [require('@tailwindcss/forms')],
	theme: {
		extend: {
			colors: {
				blurple: '#ff8c00'
			}
		}
	},
	variants: {}
};
