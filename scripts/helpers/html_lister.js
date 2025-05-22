// const fs = require('fs');
// const path = require('path');

// hexo.extend.tag.register('list_html_in_dir', function(args) {
//   const dirPathInSource = args[0];
//   if (!dirPathInSource) {
//     hexo.log.warn('[HTML Lister Tag] Directory path argument is missing.');
//     return '<p>错误：未指定目录路径。</p>';
//   }
//   const baseDir = path.join(hexo.source_dir, dirPathInSource);
//   let fileListHtml = '<ul>';

//   try {
//     const files = fs.readdirSync(baseDir).sort(); // 可选：按文件名排序
//     files.forEach(file => {
//       if (path.extname(file).toLowerCase() === '.html') {
//         const filePath = path.join('/', dirPathInSource, file).replace(/\\/g, '/');
//         // ------------- 关键调试代码 -------------
//         console.log("------------------------------------");
//         console.log("Processing file:", file);
//         console.log("Calculated filePath:", filePath);
//         console.log("Is dirPathInSource correct?", dirPathInSource);
//         // ----------------------------------------
//         fileListHtml += `<li><a href="<span class="math-inline">\{filePath\}"\></span>{file}</a></li>`;    
//         console.log("Generated HTML for item:", `<li><a href="${filePath}">${file}</a></li>`); // 查看拼接结果
//         console.log("------------------------------------");
//       }
//     });
//   } catch (err) {
//     hexo.log.error(`[HTML Lister Tag] Error reading directory ${baseDir}:`, err);
//     return '<p>无法加载文件列表。请检查服务器日志。</p>';
//   }

//   fileListHtml += '</ul>';
//   if (fileListHtml === '<ul></ul>') {
//     fileListHtml = '<p>在 <code>source/' + dirPathInSource + '</code> 目录下没有找到 HTML 文件。</p>';
//   }
//   return fileListHtml;
// });

// const fs = require('fs');
// const path = require('path');

// // 将 .helper.register 修改为 .tag.register
// // 并确保注册的标签名与 Markdown 中使用的 'list_html_in_dir' 一致
// hexo.extend.tag.register('list_html_in_dir', function(args) {
//   // 对于标签插件，参数在 args 数组中
//   // args[0] 对应 'test_html'
//   const dirPathInSource = args[0];

//   if (!dirPathInSource) {
//     hexo.log.warn('[HTML Lister Tag] 错误：未在标签中指定目录路径。');
//     return '<p>错误：未在 <code>list_html_in_dir</code> 标签中指定目录路径。</p>';
//   }

//   const baseDir = path.join(hexo.source_dir, dirPathInSource);
//   let fileListHtml = '<ul>';

//   try {
//     const files = fs.readdirSync(baseDir).sort();
//     let foundFiles = false;

//     files.forEach(file => {
//       if (path.extname(file).toLowerCase() === '.html') {
//         foundFiles = true;
//         const filePath = path.join('/', dirPathInSource, file).replace(/\\/g, '/');
        
//         // 您可以保留这些日志用于调试，成功后可以移除
//         console.log("------------------------------------");
//         console.log("TAG PLUGIN: Processing file:", file);
//         console.log("TAG PLUGIN: Calculated filePath:", filePath);
//         console.log("TAG PLUGIN: dirPathInSource from tag:", dirPathInSource);

//         // 这一行生成HTML的逻辑已经被您的日志证明是正确的
//         fileListHtml += `<li><a href="${filePath}">${file}</a></li>`;
        
//         console.log("TAG PLUGIN: Generated HTML for item:", `<li><a href="${filePath}">${file}</a></li>`);
//         console.log("------------------------------------");
//       }
//     });

//     if (!foundFiles) {
//       fileListHtml += `<li>在 source/${dirPathInSource} 目录下没有找到 HTML 文件。</li>`;
//     }
//   } catch (err) {
//     hexo.log.error(`[HTML Lister Tag] 读取目录 ${baseDir} 时出错:`, err);
//     return `<p>无法加载文件列表。错误: ${err.message}</p>`;
//   }

//   fileListHtml += '</ul>';
//   return fileListHtml; // 标签插件返回将要插入到页面的HTML内容
// });


const fs = require('fs');
const path = require('path');

hexo.extend.tag.register('list_html_in_dir', function(args) {
  const dirPathInSource = args[0];

  if (!dirPathInSource) {
    hexo.log.warn('[HTML Lister Tag] 错误：未在标签中指定目录路径。');
    return '<p>错误：未在 <code>list_html_in_dir</code> 标签中指定目录路径。</p>';
  }

  const baseDir = path.join(hexo.source_dir, dirPathInSource); // Absolute path to the source/test_html directory
  let fileListHtml = '<ul>';

  try {
    const files = fs.readdirSync(baseDir).sort();
    let foundFiles = false;

    files.forEach(file => {
      if (path.extname(file).toLowerCase() === '.html') {
        foundFiles = true;
        const filePathInSource = path.join(dirPathInSource, file); // Relative path from source dir, e.g., test_html/DQN.html
        const fullFilePath = path.join(baseDir, file); // Absolute path to the individual HTML file
        let linkText = file; // Default link text is the filename

        try {
          const fileContent = fs.readFileSync(fullFilePath, 'utf8');
          const titleMatch = fileContent.match(/<title>(.*?)<\/title>/i);
          if (titleMatch && titleMatch[1]) {
            linkText = titleMatch[1].trim();
          }
        } catch (readErr) {
          hexo.log.warn(`[HTML Lister Tag] 无法读取文件 ${fullFilePath} 的标题: ${readErr.message}`);
          // linkText remains the filename in case of read error
        }
        
        // The link should be relative to the root of the site
        const publicPath = path.join('/', dirPathInSource, file).replace(/\\/g, '/');

        // Console logs for debugging (can be removed later)
        console.log("------------------------------------");
        console.log("TAG PLUGIN: Processing file:", file);
        console.log("TAG PLUGIN: Link text:", linkText);
        console.log("TAG PLUGIN: Public path:", publicPath);
        
        fileListHtml += `<li><a href="${publicPath}">${linkText}</a></li>`;
        
        console.log("TAG PLUGIN: Generated HTML for item:", `<li><a href="${publicPath}">${linkText}</a></li>`);
        console.log("------------------------------------");
      }
    });

    if (!foundFiles) {
      fileListHtml += `<li>在 source/${dirPathInSource} 目录下没有找到 HTML 文件。</li>`;
    }
  } catch (err) {
    hexo.log.error(`[HTML Lister Tag] 读取目录 ${baseDir} 时出错:`, err);
    return `<p>无法加载文件列表。错误: ${err.message}</p>`;
  }

  fileListHtml += '</ul>';
  return fileListHtml;
});