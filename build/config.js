import { readFileSync } from 'fs';
import { minify } from 'uglify-es';
import nodeResolve from 'rollup-plugin-node-resolve';
import json from 'rollup-plugin-json';
import buble from 'rollup-plugin-buble';
import commonjs from 'rollup-plugin-commonjs';
import eslint from 'rollup-plugin-eslint';
import includePaths from 'rollup-plugin-includepaths';
import bundleSize from 'rollup-plugin-filesize';
import uglify from 'rollup-plugin-uglify';

const pkg = JSON.parse(readFileSync('./package.json', 'utf-8'));
const external = Object.keys(pkg.dependencies);

const globals = {
  openlayers: 'ol',
};

const lintOpts = {
  // extensions: ['js'],
  exclude: ['**/*.json'],
  cache: true,
  throwOnError: true
};

const includePathOptions = {
  paths: ['', './src']
};

const banner = readFileSync('./build/banner.js', 'utf-8')
  .replace('${name}', pkg.name)
  .replace('${description}', pkg.description)
  .replace('${homepage}', pkg.homepage)
  .replace('${version}', pkg.version)
  .replace('${time}', new Date());

export default [
  {
    external,
    banner,
    globals,
    input: './src/base.js',
    output: {
      file: './dist/ol-geocoder.js',
      format: 'umd',
      name: 'Geocoder',
    },
    plugins: [
      includePaths(includePathOptions),
      eslint(lintOpts),
      bundleSize(),
      nodeResolve(),
      commonjs(),
      json({ exclude: 'node_modules/**' }),
      buble({ target: { ie: 11 } }),
      uglify({ output: { comments: /^!/ } }, minify)
    ],
  },
  {
    external,
    banner,
    globals,
    input: './src/base.js',
    output: {
      file: './dist/ol-geocoder-debug.js',
      format: 'umd',
      name: 'Geocoder',
    },
    plugins: [
      includePaths(includePathOptions),
      eslint(lintOpts),
      bundleSize(),
      nodeResolve(),
      commonjs(),
      json({ exclude: 'node_modules/**' }),
      buble({ target: { ie: 11 } })
    ],
  }
];
