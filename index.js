'use strict';
const pluginname = 'butterfly_swiper_x'
const pug = require('pug');
const path = require('path');
const urlFor = require('hexo-util').url_for.bind(hexo);
const util = require('hexo-util');


hexo.extend.filter.register('after_generate', function () {
  var posts_list = hexo.locals.get('posts').data;
  var swiper_list = [];

  // 将所有文章放入 swiper_list 中
  for (var item of posts_list) {
    let itemPath = urlFor(item.path).replace(/\/page\/\d+/, '');  // 去除分页路径

    // 如果文章启用了 random_swiper_index，则加入 swiper_list
    if (item.random_swiper_index) {
      swiper_list.push({ ...item, path: itemPath });
    } else {
      // 否则按照 swiper_index 排序
      if (item.swiper_index) {
        swiper_list.push({ ...item, path: itemPath });
      }
    }
  }

  // 如果需要按降序排序 swiper_list（数值大的排前面）
  swiper_list.sort((a, b) => b.swiper_index - a.swiper_index);

  // 获取整体配置项
  const config = hexo.config.swiper || hexo.theme.config.swiper;
  if (!(config && config.enable)) return;

  const random_swiper_index = config.random_swiper_index || false; // 读取随机排序配置

  // 随机排序函数
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // 交换元素
    }
  }

  // 仅对 swiper_list 中的文章进行随机排序
  if (random_swiper_index) {
    shuffleArray(swiper_list); // 对swiper_list进行随机排序
  }

  // 获取其他配置项
  const default_img_mode = config.default_img_mode || false;

  const data = {
    pjaxenable: hexo.theme.config.pjax.enable,
    enable_page: config.enable_page ? config.enable_page : "all",
    exclude: config.exclude,
    timemode: config.timemode ? config.timemode : "date",
    layout_type: config.layout.type,
    layout_name: config.layout.name,
    layout_index: config.layout.index ? config.layout.index : 0,
    default_img: config.default_img ? urlFor(config.default_img) : "https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/special/loading.gif",
    default_img_mode: default_img_mode,
    insertposition: config.insertposition ? config.insertposition : "afterbegin",
    swiper_list: swiper_list,
    default_descr: config.default_descr ? config.default_descr : "再怎么看我也不知道怎么描述它的啦！",
    swiper_css: config.swiper_css ? config.swiper_css : "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper.min.css",
    swiper_js: config.swiper_js ? config.swiper_js : "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper.min.js",
    custom_css: config.custom_css ? config.custom_css : "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiperstyle.css",
    custom_js: config.custom_js ? config.custom_js : "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper_init.js",
    urlFor: urlFor
  };

  // 渲染页面
  const temple_html_text = config.temple_html ? config.temple_html : pug.renderFile(path.join(__dirname, './lib/html.pug'), data);

  // 注入样式和脚本
  const css_text = `<link rel="stylesheet" href="${data.swiper_css}" media="print" onload="this.media='all'"><link rel="stylesheet" href="${data.custom_css}" media="print" onload="this.media='all'">`;
  const js_text = `<script defer src="${data.swiper_js}"></script><script defer data-pjax src="${data.custom_js}"></script>`;

  var get_layout;
  if (data.layout_type === 'class') {
    get_layout = `document.getElementsByClassName('${data.layout_name}')[${data.layout_index}]`;
  } else if (data.layout_type === 'id') {
    get_layout = `document.getElementById('${data.layout_name}')`;
  } else {
    get_layout = `document.getElementById('${data.layout_name}')`;
  }

  var user_info_js = `<script data-pjax>
  function ${pluginname}_injector_config(){
    var parent_div_git = ${get_layout};
    var item_html = '${temple_html_text}';
    console.log('已挂载${pluginname}')
    parent_div_git.insertAdjacentHTML("${data.insertposition}",item_html)
  }
  var elist = '${data.exclude}'.split(',');
  var cpage = location.pathname;
  var epage = '${data.enable_page}';
  var flag = 0;

  for (var i=0;i<elist.length;i++){
    if (cpage.includes(elist[i])){
      flag++;
    }
  }

  if ((epage === 'all') && (flag == 0)){
    ${pluginname}_injector_config();
  }
  else if (epage === cpage){
    ${pluginname}_injector_config();
  }
  </script>`;

  // 注入资源到页面
  hexo.extend.injector.register('body_end', user_info_js, "default");
  hexo.extend.injector.register('body_end', js_text, "default");
  hexo.extend.injector.register('head_end', css_text, "default");
});
