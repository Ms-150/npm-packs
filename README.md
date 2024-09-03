# npm-packs

`npm-packs` 是一个简单的命令行工具，用于列出所有依赖项并将它们打包成 `.tgz` 文件，同时可以清理指定目录中的历史构建缓存。

## 安装

```bash
npx npm-packs <command> [options]
# or
npm install npm-packs -D
```

## 使用

```bash
# 出所有的依赖项，并将它们打包成 .tgz 文件，存放在指定的目录中。
npm-packs build [options]

# 清除指定的目录中的 .tgz 文件。
npm-packs clean [options]

# [options]
-o, --output <directory>：指定输出目录（默认为 packs）。
```

### example

```bash
npx npm-packs build

npx npm-packs clean
```
