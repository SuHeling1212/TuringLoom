#!/bin/bash

cd "$(dirname "$0")/TuringLoom"

echo "正在安装依赖..."
pnpm install

echo "正在启动开发服务器..."
pnpm dev
