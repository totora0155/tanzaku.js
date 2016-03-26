const banner = `
/*!
 * Copyright 2016, nju33
 * Released under the MIT License
 * https://github.com/totora0155/tanzaku.js
 */
`;

export default {
  banner: banner.trim(),
  entry: 'lib/tanzaku.js',
  format: 'umd',
  dest: 'dist/tanzaku.js',
  moduleName: 'Tanzaku',
};
