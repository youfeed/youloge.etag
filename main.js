import { YouEtag } from './lib/main.js'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      
    </a>
    <h1>Hello Vite!</h1>
    <laber for="file">
      <button id="counter" type="button">buttonbutton</button>
      <input type="file" id="file" name="file" />
    </laber>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>
  </div>
`
document.querySelector('#file').onchange = function(e) {
  let files = e.target.files
  console.log('onchange',files)
  Array.from(files).forEach(file => {
    YouEtag({
      file: file,
      // progress: document.querySelector('#counter'),
      // size: 5*1024*1024
    }).then(file=>{
      console.log('file',file)
    }).catch(err=>{
      console.log('err',err)
    })
    
  });
  
}
