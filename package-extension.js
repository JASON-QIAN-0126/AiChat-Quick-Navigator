const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('📦 开始打包 Chrome 扩展...\n');

// 确保已经构建
if (!fs.existsSync('dist')) {
  console.log('⚠️  dist 目录不存在，先执行构建...');
  execSync('npm run build', { stdio: 'inherit' });
}

// 获取版本号
const manifestPath = path.join('dist', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const version = manifest.version;
const name = manifest.name.replace(/\s+/g, '-').toLowerCase();

// 创建压缩包文件名
const zipName = `${name}-v${version}.zip`;
const zipPath = path.join(process.cwd(), zipName);

// 删除旧的压缩包
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
  console.log(`🗑️  删除旧的压缩包: ${zipName}`);
}

// 打包 dist 目录
console.log('📦 正在压缩 dist 目录...');

try {
  // 使用系统的 zip 命令
  const command = `cd dist && zip -r ../${zipName} . -x "*.DS_Store"`;
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ 打包完成！');
  console.log(`📦 文件位置: ${zipPath}`);
  console.log(`📊 文件大小: ${(fs.statSync(zipPath).size / 1024).toFixed(2)} KB`);
  console.log('\n📝 使用方法:');
  console.log('1. 打开 Chrome 浏览器，访问 chrome://extensions/');
  console.log('2. 启用右上角的「开发者模式」');
  console.log('3. 将 zip 文件解压后，点击「加载已解压的扩展程序」选择解压后的文件夹');
  console.log('   或者直接将解压后的文件夹拖入扩展页面\n');
  console.log('💡 注意: Chrome 不支持直接拖入 .zip 文件，需要先解压');
} catch (error) {
  console.error('❌ 打包失败:', error.message);
  process.exit(1);
}

