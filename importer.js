class Importer {
  productionMode;
  commits;
  fileTimes;
  log = {};
  
  constructor() {
    this.productionMode = location.hostname.includes("github.io");
  }
  
  getVersion(normalFile) {
    if (this.productionMode) {
      if (!this.commits) {
        this.commits = fetch("https://api.github.com/repos/kree-nickm/progression-manager/commits")
          .then(resp => resp.json());
      }
      
      return this.commits.then(json => {
        return json[0].sha;
      });
    }
    else {
      if (!this.fileTimes) {
        this.fileTimes = fetch("fileVersion.php")
          .then(resp => resp.json());
      }
      
      return this.fileTimes.then(json => {
        if (json[normalFile])
          return json[normalFile];
        else {
          return 'ERROR_'+Date.now();
        }
      });
    }
  }
  
  normalize(uri) {
    let [filePath, query] = uri.split('?', 2);
    let rawPaths = filePath.split('/');
    let paths = [];
    for (let dir of rawPaths) {
      if (!dir || dir === '.')
        continue;
      else if (dir === '..')
        paths.pop();
      else
        paths.push(dir);
    }
    return paths.join('/');
  }
  
  get(file, method) {
    let normalFile = this.normalize(file);
    if (!method) {
      if (normalFile.endsWith('.js'))
        method = 'import';
      else if (normalFile.endsWith('.json'))
        method = 'json';
      else
        method = 'text';
    }
    
    if (!this.log[normalFile]) {
      console.debug(`Got "${normalFile}" (${method}) from "${file}"`);
      this.log[normalFile] = this.getVersion(normalFile)
        .then(version => {
          let finalFile = `${normalFile}?v=${version}`;
          console.debug(`Importing "${finalFile}"`);
          if (method === 'import')
            return import('./'+finalFile);
          else
            return fetch(finalFile).then(resp => method === 'json' ? resp.json() : resp.text());
        });
    }
    
    return this.log[normalFile];
  }
}

window.importer = new Importer();
