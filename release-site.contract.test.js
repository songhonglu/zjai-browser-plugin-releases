const assert = require('node:assert/strict');
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const index = fs.readFileSync(path.join(root, 'download-archive.html'), 'utf8');
const promo = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const changelog = fs.readFileSync(path.join(root, 'CHANGELOG.md'), 'utf8');
const downloads = JSON.parse(fs.readFileSync(path.join(root, 'downloads.json'), 'utf8'));
const workflow = fs.readFileSync(path.join(root, '.github', 'workflows', 'refresh-download-counts.yml'), 'utf8');
const refreshFilter = path.join(root, '.github', 'workflows', 'refresh-download-counts.jq');
const worker = fs.readFileSync(path.join(root, 'worker.js'), 'utf8');
const versions = ['3.4.8', '3.4.9', '3.4.10', '3.4.11', '3.4.12', '3.4.13', '3.4.14', '3.4.15', '3.4.16', '3.4.17', '3.4.18', '3.4.19', '3.4.27', '3.4.28'];
const baselineCounts = {'3.4.8': 12, '3.4.9': 17, '3.4.10': 24, '3.4.11': 38, '3.4.12': 0, '3.4.13': 0, '3.4.14': 0, '3.4.15': 0, '3.4.16': 0, '3.4.17': 0, '3.4.18': 0, '3.4.19': 0, '3.4.27': 0, '3.4.28': 0};
const releaseStarts = {'3.4.8': 10, '3.4.9': 10, '3.4.10': 11, '3.4.11': 12, '3.4.12': 0, '3.4.13': 0, '3.4.14': 0, '3.4.15': 0, '3.4.16': 0, '3.4.17': 0, '3.4.18': 0, '3.4.19': 0, '3.4.27': 0, '3.4.28': 0};

assert.match(index, /ZJAI-PLUGIN/);
assert.match(index, /<html lang="zh-CN" data-theme="light">/);
assert.match(index, /data-theme-value="light"/);
assert.match(index, /data-theme-value="dark"/);
assert.match(index, /zjai-release-theme/);
assert.match(index, /document\.documentElement\.dataset\.theme = theme/);
assert.match(index, /v3\.4\.11/);
assert.match(index, /https:\/\/github\.com\/songhonglu\/zjai-browser-plugin-releases\/releases\/download\/v3\.4\.11\/zjai-browser-plugin-v3\.4\.11\.zip/);
assert.match(index, /v3\.4\.12/);
assert.match(index, /https:\/\/github\.com\/songhonglu\/zjai-browser-plugin-releases\/releases\/download\/v3\.4\.12\/zjai-browser-plugin-v3\.4\.12\.zip/);
assert.match(index, /v3\.4\.13/);
assert.match(index, /https:\/\/github\.com\/songhonglu\/zjai-browser-plugin-releases\/releases\/download\/v3\.4\.13\/zjai-browser-plugin-v3\.4\.13\.zip/);
assert.match(index, /v3\.4\.14/);
assert.match(index, /https:\/\/github\.com\/songhonglu\/zjai-browser-plugin-releases\/releases\/download\/v3\.4\.14\/zjai-browser-plugin-v3\.4\.14\.zip/);
assert.match(index, /v3\.4\.15/);
assert.match(index, /https:\/\/github\.com\/songhonglu\/zjai-browser-plugin-releases\/releases\/download\/v3\.4\.15\/zjai-browser-plugin-v3\.4\.15\.zip/);
assert.match(index, /v3\.4\.16/);
assert.match(index, /https:\/\/github\.com\/songhonglu\/zjai-browser-plugin-releases\/releases\/download\/v3\.4\.28\/zjai-browser-plugin-v3\.4\.28\.zip/);
assert.match(index, /v3\.4\.10/);
assert.match(index, /https:\/\/github\.com\/songhonglu\/zjai-browser-plugin-releases\/releases\/download\/v3\.4\.10\/zjai-browser-plugin-v3\.4\.10\.zip/);
assert.match(index, /安装步骤/);
assert.match(index, /已发布版本/);
assert.doesNotMatch(index, /v3\.4\.7\.2/);
assert.doesNotMatch(index, /releases\/zjai-browser-plugin-(?:patch-v3\.4\.2|v3\.4\.(?:1|6|7))\.zip/);
assert.match(index, /\.steps li \{[^}]*padding-left: var\(--space-10\)/s);
assert.match(index, /readCounts\('downloads\.json'\)/);
assert.match(index, /COUNTER_API/);
assert.match(index, /\/counts/);
assert.match(index, /\/download/);
assert.match(index, /event\.preventDefault\(\)/);
assert.doesNotMatch(index, /event\.button/);
assert.match(index, /setTimeout\(\(\) => window\.location\.assign/);
assert.doesNotMatch(index, /api\.github\.com/);
assert.match(workflow, /schedule:/);
assert.match(workflow, /gh api/);
assert.match(workflow, /-f \.github\/workflows\/refresh-download-counts\.jq/);
assert.ok(fs.existsSync(refreshFilter));
assert.match(index, /<span class="keep-together">自定义入口图标<\/span>、<span class="keep-together">手动裁剪<\/span>、<span class="keep-together">最近五次记录<\/span>。/);
assert.match(index, /<span class="keep-together">项目检查<\/span>兼容<span class="keep-together">无前缀详情页<\/span>和<span class="keep-together">同源 iframe<\/span>。/);
assert.match(index, /footer \{[^}]*text-align: center/s);
assert.match(index, /<div class="shell">ZJAI-PLUGIN · 公开安装包<\/div>/);
assert.match(index, /\.keep-together \{[^}]*white-space: nowrap/s);
assert.match(index, /<span class="keep-together">可见名字<\/span>/);
assert.match(index, /<span class="keep-together">30 分钟检查<\/span>/);
assert.match(index, /<span class="keep-together">工单三项<\/span>/);
assert.match(index, /<span class="keep-together">未到数据<\/span>/);
assert.match(index, /\.delay-emphasis \{[^}]*color: var\(--danger\);[^}]*font-weight: 700/s);
assert.match(index, /<span class="keep-together">开发者模式<\/span>/);
assert.match(index, /<span class="keep-together">处理链路<\/span>/);
assert.match(index, /<span class="keep-together">项目移交<\/span>/);
assert.match(index, /<span class="keep-together">本地文件夹<\/span>/);
assert.match(index, /<span class="keep-together">已解压版本<\/span>/);
assert.match(index, /<span class="keep-together">项目周报批量处理<\/span>支持<span class="keep-together">【杭州】<\/span>、<span class="keep-together">【杭州区】<\/span>。/);
assert.match(index, /@media \(max-width: 840px\) \{[\s\S]*?\.steps \{ grid-template-columns: repeat\(2, minmax\(0, 1fr\)\);/);
assert.match(worker, /zjai-browser-plugin-releases/);
assert.match(worker, /GH_TOKEN/);
assert.match(worker, /downloads\.json/);
assert.match(worker, /v3\.4\.13/);
assert.match(worker, /v3\.4\.14/);
assert.match(worker, /v3\.4\.15/);
assert.match(worker, /v3\.4\.16/);
assert.match(worker, /v3\.4\.17/);
assert.match(worker, /v3\.4\.18/);
assert.match(worker, /v3\.4\.19/);
assert.match(worker, /POST/);
assert.match(worker, /\(request\.method === 'POST' \|\| request\.method === 'OPTIONS'\) && !allowedOrigin\(request, env\)/);
assert.match(promo, /ZJAI/);
assert.match(promo, /把协同里的重复事，放到手边/);
assert.match(promo, /周工作计划汇总/);
assert.match(promo, /项目台账检查/);
assert.match(promo, /项目移交会议纪要/);
assert.match(promo, /代码合规扫描/);
assert.match(promo, /工单速配/);
assert.match(promo, /客开冲突雷达/);
assert.match(promo, /https:\/\/github\.com\/songhonglu\/zjai-browser-plugin-releases\/releases\/download\/v3\.4\.28\/zjai-browser-plugin-v3\.4\.28\.zip/);
assert.match(promo, /download-archive\.html/, '宣传页应保留原下载页入口');
assert.match(promo, /已发查询/);
assert.match(promo, /扇形入口/);
assert.doesNotMatch(promo, /v3\.4\.7\.2/);
for (const version of versions) {
  assert.match(index, new RegExp(`zjai-browser-plugin-v${version.replaceAll('.', '\\.')}\\.zip`));
  assert.doesNotMatch(index, /class="download-count"/);
  assert.match(changelog, new RegExp(`## \\[${version.replaceAll('.', '\\.')}`));
  assert.ok([
    path.join(root, 'releases', `zjai-browser-plugin-v${version}.zip`),
    path.join(root, '..', 'pak', `zjai-browser-plugin-v${version}.zip`)
  ].some(fs.existsSync));
  assert.equal(downloads.baseline[`v${version}`][`zjai-browser-plugin-v${version}.zip`], baselineCounts[version]);
  assert.equal(downloads.githubReleaseStart[`v${version}`][`zjai-browser-plugin-v${version}.zip`], releaseStarts[version]);
  assert.ok(downloads.counts[`v${version}`][`zjai-browser-plugin-v${version}.zip`] >= baselineCounts[version]);
}
const releaseFixture = versions.map((version, index) => ({
  tag_name: `v${version}`,
  assets: [{
    name: `zjai-browser-plugin-v${version}.zip`,
    download_count: downloads.githubReleaseStart[`v${version}`][`zjai-browser-plugin-v${version}.zip`] + index + 1
  }]
}));
const refreshed = JSON.parse(execFileSync('jq', ['-S', '--slurpfile', 'current', path.join(root, 'downloads.json'), '-f', refreshFilter], {
  input: JSON.stringify(releaseFixture),
  encoding: 'utf8'
}));
for (const [index, version] of versions.entries()) {
  const asset = `zjai-browser-plugin-v${version}.zip`;
  assert.equal(refreshed.baseline[`v${version}`][asset], baselineCounts[version]);
  assert.equal(refreshed.githubReleaseStart[`v${version}`][asset], downloads.githubReleaseStart[`v${version}`][asset]);
  assert.equal(refreshed.counts[`v${version}`][asset], Math.max(
    downloads.counts[`v${version}`][asset],
    baselineCounts[version] + index + 1
  ));
}
assert.doesNotMatch(changelog, /^## \[(?:3\.4\.(?:1|6|7)|3\.4\.2 补丁包)\]/m);

console.log('release-site.contract.test.js passed');
