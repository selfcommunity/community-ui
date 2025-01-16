const { execSync } = require('child_process');
const pkg = require('../../package.json');

if (pkg.peerDependencies && Object.keys(pkg.peerDependencies).length > 0) {
  console.log('Installing peerDependencies...');
  execSync('yarn install-peers -f', { stdio: 'inherit' });
} else {
  console.log('No peerDependencies to install.');
}
