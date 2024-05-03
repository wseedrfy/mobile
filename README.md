# 水滴培训 手机端

## 安装 ESLint
`pnpm i eslint eslint-config-airbnb eslint-config-airbnb-typescript eslint-plugin-import eslint-plugin-jsx-a11y eslint-plugin-react eslint-plugin-react-hooks @typescript-eslint/parser @typescript-eslint/eslint-plugin -D`

## vite 支持 eslint
`pnpm i vite-plugin-eslint -D`

## 实现 graphql service 层
`pnpm i @apollo/client graphql -S`

## OSS 图片上传文档
https://help.aliyun.com/document_detail/322691.html

## 搭建基本框架
1. 添加 Route
2. 添加 404 
3. 添加通用方法
4. 修复一些基本问题
5. reset.css https://www.jsdelivr.com/package/npm/reset-css

## 实现下拉刷新功能
1. ScrollTop
2. 鼠标事件：toouchstart、touchmove、 touchend
3. y 的偏移量
4. 最大偏移量：maxY

## 下拉刷新的扩展思考
- 动画组件库：https://www.react-spring.dev/docs/getting-started
- 手势操作组件库：https://use-gesture.netlify.app/docs/
- 体验更好的 Scroll 库：https://better-scroll.github.io/docs/zh-CN/guide/base-scroll.html

## 实现无限滚动
> 核心是判断有没有触底
1. document.documentElement.clientHeight 根节点的高度
2. document.body.scrollHeight body 内容高度
3. document.documentElement.scrollTop 滑动条距离顶部的高度
4. scrollTop + clientHeight = scrollHeight 触底条件
5. offset 偏移量
6. scrollTop + clientHeight >= scrollHeight - offset 触发条件

## 单元测试
- jest
- 安装包：pnpm i vitest jsdom @testing-library/react -D
- vitest 文档：https://vitest.dev/api/
- react-testing-library文档：https://testing-library.com/docs/react-testing-library/api

## 如何安装 nginx
- windows 部署 nginx：https://juejin.cn/post/7024762773980577805
- brew 的清华镜像：https://mirrors.tuna.tsinghua.edu.cn/help/homebrew/
- 使用 brew 安装：`brew install nginx`
- 启动 nginx：`nginx`
- 关闭 nginx：`nginx -s stop`
- 重启 nginx：`nginx -s reload`
- 访问地址：`http://localhost:8080`
- 查找 nginx 配置文件位置：`nginx -t`
- 查找默认的静态文件位置：`nginx -V 2>&1 | grep --color -o '\-\-prefix=[^ ]*' | cut -c 10- | xargs -I {} sh -c 'ls -al {}"/html"'`

## 本地安装和使用 docker
- docker 官网地址：https://www.docker.com/
- Mac 系统下载 docker 地址：https://docs.docker.com/desktop/install/mac-install/
- 构建 docker 镜像：`docker build -t mobile:v1 .`
