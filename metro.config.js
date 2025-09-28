const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

config.serializer.createModuleIdFactory = () => {
	const fileToIdMap = new Map();
	let nextId = 0;
	return (path) => {
		if (!fileToIdMap.has(path)) {
			fileToIdMap.set(path, nextId++);
		}
		return fileToIdMap.get(path);
	};
};

module.exports = config;
