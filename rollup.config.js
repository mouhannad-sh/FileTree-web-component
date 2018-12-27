// Rollup plugins
import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import replace from 'rollup-plugin-replace';
import { uglify } from 'rollup-plugin-uglify';
import sass from 'rollup-plugin-sass';
import nodeSASS from 'node-sass';
import { plugin as analyze } from 'rollup-plugin-analyzer';
import autoExternal from 'rollup-plugin-auto-external';
export default {
	entry: 'src/js/main.js',
	dest: 'build/js/main.js',
	moduleName: 'mayon',
	format: 'es',
	sourceMap: true,
	plugins: [
		autoExternal(),
		resolve({
			jsnext: true,
			main: true,
			browser: true,
			extensions: [ '.mjs', '.js', '.jsx', '.json' ]
		}),

		sass({
			output: true,
			// insert: true,
			runtime: nodeSASS
		}),
		// eslint({
		// 	exclude: [ 'src/assets/**' ]
		// }),
		babel({
			exclude: 'node_modules/**',
			plugins: [ 'external-helpers' ],
			runtimeHelpers: true
		}),
		commonjs({
			include: 'node_modules/**',
			namedExports: {
				'node_modules/react-color/lib/components/common/index.js': [ 'Swatch', 'EditableInput', 'ColorWrap' ],
				'node_modules/react-dom/server.browser.js': [ 'renderToStaticMarkup' ]
			}
		}),
		replace({
			exclude: 'node_modules/**',
			ENV: JSON.stringify(process.env.NODE_ENV || 'development')
		})
		// process.env.NODE_ENV === 'production' && uglify()
	]
	// external: [ 'react', 'react-dom', 'react-color/lib/helpers/color', 'react-color/lib/components/common' ]
};
