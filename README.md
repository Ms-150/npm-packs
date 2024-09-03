# npm-packs

`npm-packs` 是一个简单的命令行工具，用于列出所有依赖项并将它们打包成 `.tgz` 文件，同时可以清理指定目录中的历史构建缓存。

## 亮点

解决了项目离线安装中构建依赖需要的每个手动执行 `npm pack` 生成 `.tgz` 文件。
将文件统一构建完成后拷贝到没有网络连接的机器上，在使用 `npm install` 安装。

+ 简化依赖项打包：自动化打包过程，减少了手动操作，提高了效率。
+ 离线安装支持：将 .tgz 文件拷贝到没有网络连接的机器上，使用 npm install 安装，实现离线安装。
+ 灵活配置：支持指定输出目录和忽略特定模块，适应不同的需求和场景。

## 安装

```bash
npx npm-packs <command> [options]
```

## 使用

```bash
# 列出所有的依赖项，并将它们打包成 .tgz 文件，存放在指定的目录中，默认目录为 packs。
npx npm-packs build [options]

# 清除指定目录中的 .tgz 文件。
npx npm-packs clean [options]

# [options]
-o, --output <directory>  指定输出目录（默认为 packs）。
-i, --ignore <packages>   忽略指定的模块（默认为 npm-packs），多个模块用逗号分隔。
```

### 示例

```bash
# 打包依赖项并存储在默认目录 packs 中
npx npm-packs build

# 打包依赖项并存储在指定目录 output 中
npx npm-packs build -o output

# 打包依赖项时忽略 npm-counts 模块
npx npm-packs build -i npm-counts

# 清除默认目录 packs 中的 .tgz 文件
npx npm-packs clean

# 清除指定目录 output 中的 .tgz 文件
npx npm-packs clean -o output
```

```diff
  ./
  ├── README.md
  ├── index.js
  ├── node_modules
  │   └── xxx -> .pnpm/xxx@12.1.0/node_modules/xxx
  ├── package.json
+ ├── packs
+ │   └── xxx-12.1.0.tgz
  └── pnpm-lock.yaml
```
