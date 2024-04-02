# 最好用的前端文件分块哈希工具

实现七牛 ETag 算法 AWS s3 Etag 算法,仅`4.07 kB`,支持批量，带执行进度`progress`,
文件自动分片，支持分片单独读取，`MD5`或`SHA1`

### CDN 引入使用方式 `10.82 kB │ gzip: 4.07 kB`
- 



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