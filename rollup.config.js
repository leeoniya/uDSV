const fs = require('fs');

// function cssmin(css) {
// 	return css
// 		.replace(/\s{1,}/g, ' ')
// 		.replace(/\{\s{1,}/g,"{")
// 		.replace(/\}\s{1,}/g,"}")
// 		.replace(/\;\s{1,}/g,";")
// 		.replace(/\/\*\s{1,}/g,"/*")
// 		.replace(/\*\/\s{1,}/g,"*/");
// }

// let minicss = cssmin(fs.readFileSync('./src/uCSV.css', 'utf8'));
// fs.writeFileSync('./dist/uCSV.min.css', minicss);

import terser from '@rollup/plugin-terser';

const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const ver = "v" + pkg.version;
const urlVer = "https://github.com/leeoniya/uCSV (" + ver + ")";
const banner = [
	"/**",
	"* Copyright (c) " + new Date().getFullYear() + ", Leon Sorokin",
	"* All rights reserved. (MIT Licensed)",
	"*",
	"* uCSV.js",
	"* A small, fast CSV parser",
	"* " + urlVer,
	"*/",
	"",
].join("\n");

function bannerlessESM() {
	return {
		name: 'stripBanner',
		resolveId(importee) {
			if (importee == 'uCSV')
				return importee;
			return null;
		},
		load(id) {
			if (id == 'uCSV')
				return fs.readFileSync('./dist/uCSV.esm.js', 'utf8').replace(/\/\*\*.*?\*\//gms, '');
			return null;
		}
	};
}

const terserOpts = {
	compress: {
		inline: 0,
		passes: 2,
		keep_fargs: false,
		pure_getters: true,
		unsafe: true,
		unsafe_comps: true,
		unsafe_math: true,
		unsafe_undefined: true,
	},
	output: {
		comments: /^!/
	}
};

export default [
	{
		input: './src/uCSV.js',
		output: {
			name: 'uCSV',
			file: './dist/uCSV.esm.js',
			format: 'es',
			banner,
		},
	},
	{
		input: './src/uCSV.js',
		output: {
			name: 'uCSV',
			file: './dist/uCSV.cjs.js',
			format: 'cjs',
			exports: "auto",
			banner,
		},
	},
	{
		input: 'uCSV',
		output: {
			name: 'uCSV',
			file: './dist/uCSV.iife.js',
			format: 'iife',
			esModule: false,
			banner,
		},
		plugins: [
			bannerlessESM(),
		]
	},
	{
		input: 'uCSV',
		output: {
			name: 'uCSV',
			file: './dist/uCSV.iife.min.js',
			format: 'iife',
			esModule: false,
			banner: "/*! " + urlVer + " */",
		},
		plugins: [
			bannerlessESM(),
			terser(terserOpts),
		]
	},
];