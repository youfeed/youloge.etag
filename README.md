# 最好用的前端文件分块哈希工具

实现七牛 ETag 算法 AWS s3 Etag 算法,仅`4.07 kB`,支持批量，带执行进度`progress`,
文件自动分片，支持分片单独读取，`MD5`或`SHA1`

### CDN 引入使用方式 `10.82 kB │ gzip: 4.07 kB`
- `https://unpkg.com/youloge.etag`
- `https://cdn.jsdelivr.net/npm/youloge.etag`

- 直接包安装 `npm i youloge.etag`

### 如何使用 
```js
youloge.etag({
  file:file, // 必选 传入文件
  size:1024*1024*5, // 可选参数 用于自定义分片大小(MD5)
  progress:(res)=>{ // 可选参数 监听执行进度
    res = {type: 'tag', step: 1, total: 1}
    res = {type: 'key', step: 1, total: 1}
  }
}).then(file=>{
  console.log(file) // 执行完成 哈希等参数挂载再file对象上
}).catch(err=>{ })
```

### 异步返回
```js
File 对象
{
  // QEtag 块信息
  "keys": [
      {
          "chunk": {}, // QEtag 分片 固定4MB
          "words": {}  // QEtag 分片哈希 .toString() 即可转为字符串
      },
  ],
  // MD5 Etag 块信息
  "tags": [
      {
          "chunk": {}, // 默认分片大小 5MB 可自定义
          "words": {}  // MD5 .toString() 即可转为字符串
      },
  ],
  "key": "lkNwJK-VGN5T5UienEnVEAhYCQxR", // QEtag 计算结果
  "tag": "19273b26242f42fad1ff8ca26790fcb8-3", // AWS Etag 计算结果
  // 标准File对象属性
  "lastModified":1710797382891,
  "lastModifiedDate":Tue Mar 19 2024 05:29:42 GMT+0800 (中国标准时间),
  "name":"test.txt",
  "size":14025894,
  "type":"text/plain",
  "webkitRelativePath":""
}
```

### 但行好事 莫问前程

> [Youloge.Qrcode 纯二维码生成库](https://github.com/youfeed/youloge.qrcode) `Gzip 5Kb`