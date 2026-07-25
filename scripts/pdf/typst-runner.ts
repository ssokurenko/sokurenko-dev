import { execFileSync } from 'node:child_process';

const REPO_ROOT = new URL('../../', import.meta.url).pathname;
const FONT_PATH = `${REPO_ROOT}typst/fonts`;
const PACKAGE_PATH = `${REPO_ROOT}typst/packages`;

export function assertTypstInstalled() {
  try {
    execFileSync('typst', ['--version'], { stdio: 'ignore' });
  } catch {
    throw new Error(
      'Typst is not installed or not on PATH.\n' +
        'Install it with: brew install typst  (pin 0.15.x — see specs/07-build-and-deploy.md)',
    );
  }
}

/** Compiles a .typ entry file to a PDF using the vendored fonts/packages. */
export function typstCompile(entryPath: string, outPath: string) {
  execFileSync(
    'typst',
    [
      'compile',
      '--root',
      REPO_ROOT,
      '--font-path',
      FONT_PATH,
      '--ignore-system-fonts',
      '--package-path',
      PACKAGE_PATH,
      entryPath,
      outPath,
    ],
    { stdio: 'pipe', encoding: 'utf8' },
  );
}

export { REPO_ROOT, FONT_PATH, PACKAGE_PATH };
