import {MD5} from 'crypto-es/lib/md5'
import {SHA1} from 'crypto-es/lib/sha1'
import {Base64} from 'crypto-es/lib/enc-base64'
import {WordArray} from 'crypto-es/lib/core'
export async function YouEtag({file,size=5*1024*1024,progress=null}) {
  if(!file instanceof File){
    throw new Error('file is not instanceof File')
  }
  // 异步分片池
  file.keys = [];
  file.tags = [];
  //
  var kstep = 0
  var tstep = 0;
  // 分段读取文件
  while (file.keys.length * 4 * 1024 * 1024 < file.size) {
    const start = file.keys.length * 4 * 1024 * 1024;
    const end = Math.min((file.keys.length + 1) * 4 * 1024 * 1024, file.size);
    const chunk = file.slice(start, end);
    file.keys.push(new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.readAsArrayBuffer(chunk);
      reader.onload = (e) => {
        progress && progress({type:'key',step:++kstep, total:file.keys.length});
        const words = WordArray.create(e.target.result);
        resolve({
          chunk:chunk,
          words:SHA1(words),
        })
      }
    }));
  }
  // 分段读取文件
  while (file.tags.length * size < file.size) {
    const start = file.tags.length * 4 * 1024 * 1024;
    const end = Math.min((file.tags.length + 1) * size, file.size);
    const chunk = file.slice(start, end);
    file.tags.push(
      new Promise((resolve,reject)=>{
        const reader = new FileReader();
        reader.readAsArrayBuffer(chunk);
        reader.onload = (e) => {
            progress && progress({type:'tag',step:++tstep, total:file.tags.length});
            const words = WordArray.create(e.target.result);
            resolve({
              chunk:chunk,
              words:MD5(words)
            })
        }
      })
    )
  }
  const safeBase64 = (str)=>{
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
  }
  const calcSHA1 = (hist)=>{
    if(hist.length == 1){
      let [first] = hist;
      var prefix = WordArray.create(new Uint8Array([0x16]));
      return Base64.stringify(prefix.concat(first.words)).split('+').join('-').split('/').join('_').split('=').join('');
    }else{
      var prefix = WordArray.create(new Uint8Array([0x96]));
      let bytes = WordArray.create();
      hist.forEach(sha1 => {
        bytes.concat(sha1.words)
      });
      let end = SHA1(bytes)
      return Base64.stringify(prefix.concat(end)).split('+').join('-').split('/').join('_').split('=').join('');
    }
  }
  // 单片返回MD5 分片返回
  const calcMD5 = (hist)=>{
    if(hist.length == 1){
      let [first] = hist;
      return first.words.toString()
    }else{
      let bytes = WordArray.create();
      hist.forEach(md5 => {
        bytes.concat(md5.words)
      });
      return MD5(bytes).toString()+'-'+hist.length
    }
  }
  // 计算文件哈希
  return Promise.all([Promise.all(file.keys),Promise.all(file.tags)]).then(([keys,tags])=>{
    file.keys = keys
    file.key = calcSHA1(keys)
    file.tags = tags
    file.tag = calcMD5(tags)
    return file
  })
}