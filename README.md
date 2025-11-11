# hexo-butterfly-swiper-x

>  [!Important]
> 修复原版地址拼接错误的问题  
> 移除了原版的error_img参数   
> 新增设置默认图及默认图模式   
> 新增随机排序

>  [!WARNING]
> 由于图片与轮播内容是一体的，所以暂无法做到指定图片固定。  
> ps：后期测试自定义似乎可以实现，但需要对css设计熟练程度非常高。  

* 原版项目：[Akilarlxh/hexo-butterfly-swiper](https://github.com/Akilarlxh/hexo-butterfly-swiper)
* 原版文章： [首页轮播图](https://akilar.top/posts/8e1264d1/)

效果：

<img width="887" height="236" alt="image" src="https://github.com/user-attachments/assets/56816d57-856e-4997-b9bb-936e105507e0" />


## 安装

【1】安装插件,在博客根目录`[Blogroot]`下打开终端，运行以下指令：

  ```bash
  npm uninstall hexo-butterfly-swiper
  ```
   
  ```bash
  npm install hexo-butterfly-swiper-x --save
  ```

> [!TIP]
> 也可使用随机图片API作为默认图，如：bing、lorem Picsum、loremFlickr、loliapi等
> * https://picsum.photos/1200/600
> * https://bingw.jasonzeng.dev/?index=random
> * https://random-picture.vercel.app/api 
> * https://www.loliapi.com/acg/pc

【2】在站点配置文件`_config.yml`或者主题配置文件`_config.butterfly.yml`中添加

  ```yaml
swiper:
  enable: true
  priority: 5
  enable_page: all
  timemode: date
  layout:
    type: id
    name: recent-posts
    index: 0
  default_img: https://cdn.jsdelivr.net/gh/hoochanlon/picx-images-hosting@master/special/loading.gif
  default_img_mode: false
  swiper_css: "https://cdn.jsdelivr.net/npm/hexo-butterfly-swiper-x/lib/swiper.min.css"  # swiper css依赖
  swiper_js: "https://cdn.jsdelivr.net/npm/hexo-butterfly-swiper-x/lib/swiper.min.js"    # swiper js依赖
  custom_css: "https://cdn.jsdelivr.net/npm/hexo-butterfly-swiper-x/lib/swiperstyle.css" # 适配主题样式补丁
  custom_js: "https://cdn.jsdelivr.net/npm/hexo-butterfly-swiper-x/lib/swiper_init.js"   # swiper初始化方法
  ```

【3】使用方法：在文章的`front_matter`中添加`swiper_index`配置项即可

> [!note]
> 轮播时间：下载 [/lib/swiper_init.js](https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper_init.js),修改 delay
   
  
  ```markdown
  ---
  title: 文章标题
  date: 创建日期
  updated: 更新日期
  cover: 文章封面
  description: 文章描述
  swiper_index: 1 #置顶轮播图顺序，需填非负整数，数字越大越靠前
  # random_swiper_index: true # 开启随机排序
  ---
  ```

## 附录

**参数说明**

  |参数|备选值/类型|释义|
  |:--|:--|:--|
  |priority|number|【可选】过滤器优先级，数值越小，执行越早，默认为10，选填|
  |enable|true/false|【必选】控制开关|
  |enable_page|path/all|【可选】默认为每一页都加载，仅首页加载: `enable_page: all` 改成 `enable_page: /`|
  |exclude|path|【可选】填写想要屏蔽的页面，可以多个。仅当enable_page为'all'时生效。写法见示例。原理是将屏蔽项的内容逐个放到当前路径去匹配，若当前路径包含任一屏蔽项，则不会挂载。|
  |timemode|date/updated|【可选】时间显示，date为显示创建日期，updated为显示更新日期,默认为date|
  |layout.type|id/class|【可选】挂载容器类型，填写id或class，不填则默认为id|
  |layout.name|text|【必选】挂载容器名称|
  |layout.index|0和正整数|【可选】前提是layout.type为class，因为同一页面可能有多个class，此项用来确认究竟排在第几个顺位|
  |insertposition|text|'beforebegin'：元素自身的前面。'afterbegin'：插入元素内部的第一个子节点之前。'beforeend'：插入元素内部的最后一个子节点之后。'afterend'：插入元素自身的后面。|
  |default_img|url|【可选】默认图|
  |default_img_mode|true/false|【可选】所有文章一律使用默认图|

**细节描述**

| 功能/技术         | 描述                                                                                            |
| ----------------- | ------------------------------------------------------------------------------------------------- |
| 生成 Swiper 列表  | 遍历文章，筛选出启用 `random_swiper_index` 或 `swiper_index` 的文章，并按顺序添加到 `swiper_list` 中。                    |
| 渲染模板         | 使用 **Pug** 模板引擎生成 HTML 内容，并将其插入到页面中。                                                              |
| 动态注入 CSS 和 JS | 将 **Swiper** 的 CSS 和 JS 文件动态插入页面，并确保它们在页面中正确加载。                                                   |
| Swiper 初始化    | 在页面加载完成后，通过 **Swiper** 初始化轮播图，确保它能够正确工作。                                                          |
| 局部刷新支持       | 在 **pjax** 事件触发后，使用原生 JavaScript 重新初始化 Swiper，避免每次都需要刷新页面。                                        |
| 浏览器环境判断      | 使用 `isBrowser()` 函数来检查当前环境是否为浏览器环境。避免在 Hexo 构建过程中（Node.js 环境）进行 DOM 操作，因为 Node.js 不支持 `document`。 |

