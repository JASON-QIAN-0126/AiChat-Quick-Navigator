const esbuild = require('esbuild');
const fs = require('fs');
const path = require('path');

const isWatch = process.argv.includes('--watch');

// 确保 dist 目录存在
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// 复制 manifest.json
fs.copyFileSync(
  path.join('src', 'manifest.json'),
  path.join('dist', 'manifest.json')
);

// 复制 HTML 文件
const htmlFiles = ['options/index.html', 'popup/index.html'];
htmlFiles.forEach(file => {
  const srcPath = path.join('src', file);
  const distPath = path.join('dist', file);
  const distDir = path.dirname(distPath);
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, distPath);
  }
});

// 打包配置
const buildOptions = {
  entryPoints: [
    'src/background/index.ts',
    'src/content/index.ts',
    'src/options/index.ts',
    'src/popup/index.ts'
  ],
  bundle: true,
  outdir: 'dist',
  format: 'esm',
  platform: 'browser',
  target: 'chrome96',
  logLevel: 'info',
};

async function build() {
  try {
    if (isWatch) {
      const ctx = await esbuild.context(buildOptions);
      await ctx.watch();
      // console.log('👀 Watching for changes...');
    } else {
      await esbuild.build(buildOptions);
      // console.log('✅ Build complete!');
    }
  } catch (error) {
    // console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

build();

