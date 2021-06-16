/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const copyPlugin = require("copy-webpack-plugin");

const isProduction = process.env.NODE_ENV == "production";

const mainConfig = {
	entry: "./src/main.ts",
	target: "electron-main",
	devtool: "inline-source-map",
	output: {
		filename: "src/main.js",
		path: path.resolve(__dirname, "out"),
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				include: path.resolve(__dirname, "src"),
				exclude: path.resolve(__dirname, "node_modules"),
				use: [{ loader: "ts-loader" }],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
};

const preloadConfig = {
	entry: "./src/preload.ts",
	target: "electron-preload",
	devtool: "inline-source-map",
	output: {
		filename: "src/preload.js",
		path: path.resolve(__dirname, "out"),
	},
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				exclude: path.resolve(__dirname, "node_modules"),
				use: [{ loader: "ts-loader" }],
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
};

const rendererConfig = {
	entry: "./src/view/index.ts",
	target: "electron-renderer",
	devtool: "inline-source-map",
	output: {
		filename: "src/view/index.js",
		path: path.resolve(__dirname, "out"),
	},
	plugins: [
		new copyPlugin({
			patterns: ["src/**/*.html", "src/**/*.css", "package.json"],
		}),
	],
	module: {
		rules: [
			{
				test: /\.(ts|tsx)$/i,
				use: [{ loader: "ts-loader" }],
			},
			{
				test: /\.css$/i,
				use: ["style-loader", "css-loader"],
			},
			{
				test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
				include: path.resolve(__dirname, "src"),
				type: "asset",
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
};

module.exports = () => {
	const configs = [mainConfig, preloadConfig, rendererConfig];
	for (const config of configs) {
		if (isProduction) {
			config.mode = "production";
		} else {
			config.mode = "development";
		}
	}
	return configs;
};
