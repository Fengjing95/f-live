# f-live-fe

## 踩坑记录

###  1. vetur 报错模块找不到
vite 项目初始化时将 tsconfig.json 进行了拆分, vetur应该是默认查找的 tconfig.json, 所以找不到别名配置, 将别名配置复制到 tsconfig.json 中即可,或者不使用别名

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
