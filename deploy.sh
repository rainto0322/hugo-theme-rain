#!/usr/bin/env bash

hugo build --minify

cd public || exit

if [ ! -d ".git" ]; then
  git init
  git remote add origin git@github.com:rainto0322/rainto0322.github.io.git
  git config --global user.name "rainto0322"
  git config --global user.email "rainto0322@foxmail.com"
fi

# 添加所有更改并提交
git add .
git commit -m "Deploy site updates"

git push -f origin main

# vc --prod