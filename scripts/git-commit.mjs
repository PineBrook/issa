import git from 'isomorphic-git';
import fs from 'node:fs';

const dir = process.cwd();
const author = { name: 'yashvardhan', email: 'vs21yash@gmail.com' };

const status = await git.statusMatrix({ fs, dir });
for (const [filepath, head, workdir, stage] of status) {
  if (workdir === 0) {
    await git.remove({ fs, dir, filepath });
  } else if (workdir === 2) {
    await git.add({ fs, dir, filepath });
  }
}

const sha = await git.commit({
  fs,
  dir,
  author,
  message: 'feat: support full ratio portrait stories, simplify audit and server logs, add user action logging, and left-align login form',
});

console.log('Committed SHA:', sha);
