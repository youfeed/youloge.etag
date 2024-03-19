import {MD5} from 'crypto-es/lib/md5'
import {SHA1} from 'crypto-es/lib/sha1'
import {Base64} from 'crypto-es/lib/enc-base64'
import {WordArray} from 'crypto-es/lib/core'
export async function YouEtag({file,progress=null,size=5*1024*1024}) {
  if(!file instanceof File){
    throw new Error('file is not instanceof File')
  }
  console.log('instanceof File',file)
  // 异步池
  file.keys = []
  file.tags = []
  // sha1chuck
  var prefix = 0x16;
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
            sha1:SHA1(words).toString()
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
            progress && progress({type:'etag',step:++tstep, total:file.tags.length});
            const words = WordArray.create(e.target.result);
            resolve({
              chunk:chunk,
              md5:SHA1(words).toString()
            })
        }
      })
    )
    // file.tags.push(
    //   {
    //     chunk:chunk,
    //     sha1:new Promise((resolve,reject)=>{
    //       const reader = new FileReader();
    //       reader.readAsArrayBuffer(chunk);
    //       reader.onload = (e) => {
    //           progress && progress({type:'etag',step:++tstep, total:file.tags.length});
    //           const words = WordArray.create(e.target.result);
    //           resolve(SHA1(words))
    //       }
    //     })
    //   }
    // );
  }

  const calcSHA1 = (hist)=>{
    // console.log('calcSHA1s',hist)
    return SHA1(hist).toString()
  }
  // 单片返回MD5 分片返回
  const calcMD5 = (hist)=>{
    console.log('calcMD5',hist)
    if(hist.length == 1){
      file.etag = MD5(2333).toString()
      return MD5(222).toString()
    }

    let maps = hist.map(is => {
      console.log('is.md5',is)
      return is.md5
    }).join('');
    return MD5(maps).toString()+`-${hist.length}`
  }


  return Promise.all([Promise.all(file.keys),Promise.all(file.tags)]).then(([keys,tags])=>{
    file.key = calcSHA1(keys)
    file.etag = calcMD5(tags)
    return file
  })
}