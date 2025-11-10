'use strict';

const pluginname = 'butterfly_swiper'
const pug = require('pug');
const path = require('path');
const urlFor = require('hexo-util').url_for.bind(hexo);
const util = require('hexo-util');

// Hexo 中的过滤器，用于在生成页面之后注入自定义配置
hexo.extend.filter.register('after_generate', function () {
  var posts_list = hexo.locals.get('posts').data;
  var swiper_list = [];

  // 若文章的front_matter内设置了index和描述，则将其放到swiper_list内
  for (var item of posts_list) {
    if (item.swiper_index) {
      let itemPath = urlFor(item.path).replace(/\/page\/\d+/, '');  // 去除分页路径
      swiper_list.push({ ...item, path: itemPath });
    }
  }

  // 获取整体配置项
  const config = hexo.config.swiper || hexo.theme.config.swiper;
  if (!(config && config.enable)) return;


  const data = {
    pjaxenable: hexo.theme.config.pjax.enable,
    enable_page: config.enable_page ? config.enable_page : "all",
    exclude: config.exclude,
    timemode: config.timemode ? config.timemode : "date",
    layout_type: config.layout.type,
    layout_name: config.layout.name,
    layout_index: config.layout.index ? config.layout.index : 0,
    default_img: config.default_img ? urlFor(config.default_img) : "https://npm.elemecdn.com/akilar-candyassets/image/loading.gif",
    insertposition: config.insertposition ? config.insertposition : "afterbegin",
    swiper_list: swiper_list,
    default_descr: config.default_descr ? config.default_descr : "再怎么看我也不知道怎么描述它的啦！",
    // 资源路径直接使用完整的 URL 或 `urlFor`
    swiper_css: config.swiper_css ? config.swiper_css : "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper.min.css",
    swiper_js: config.swiper_js ? config.swiper_js : "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper.min.js",
    custom_css: config.custom_css ? config.custom_css : "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiperstyle.css",
    custom_js: config.custom_js ? config.custom_js : "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper_init.js", // 确保这里是正确的路径
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
