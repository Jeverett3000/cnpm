'use strict';

const path = require('path');
const coffee = require('coffee');
const { rmSync } = require('fs');

const cnpmbin = path.join(__dirname, '../bin/cnpm');
const fixtures = path.join(__dirname, 'fixtures');
const RUN_ON_CI = process.env.CI;

describe('test/custom-installer.test.js', () => {
  it('should install with npm: --by=npm', () => {
    const cwd = path.join(fixtures, 'npm-installer');
    rmSync(path.join(cwd, 'node_modules'), { force: true, recursive: true });

    const args = [ 'i', '--by=npm' ];
    if (RUN_ON_CI) {
      args.push('--registry=https://registry.npmjs.org');
      args.push('--disturl=none');
      args.push('--userconfig=none');
    }

    const testRE = process.platform === 'win32' ? /\\node_modules\\\.bin\\npm/ : /\/node_modules\/\.bin\/npm i/;

    return coffee.fork(cnpmbin, args, {
      cwd,
      env: Object.assign({}, process.env, {
        DEBUG: 'cnpm*',
      }),
    })
      .debug()
      .expect('code', 0)
      .expect('stderr', testRE)
      .end();
  });
});
