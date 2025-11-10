# hexo-butterfly-swiper

给`hexo-theme-butterfly`添加 [首页轮播图](https://akilar.top/posts/8e1264d1/)

# 安装


1. 安装插件,在博客根目录`[Blogroot]`下打开终端，运行以下指令：
  ```bash
  npm install hexo-butterfly-swiper --save
  ```

2. 添加配置信息，以下为写法示例
  在站点配置文件`_config.yml`或者主题配置文件`_config.butterfly.yml`中添加

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
  default_img: https://hoochanlon.github.io/picx-images-hosting/special/author.png
  use_default_img_mode: true
  swiper_css: "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper.min.css" 
  swiper_js: "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper.min.js"   
  custom_css: "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiperstyle.css"
  custom_js: "https://npm.elemecdn.com/hexo-butterfly-swiper/lib/swiper_init.js"  
  ```


3. 参数释义

  |参数|备选值/类型|释义|
  |:--|:--|:--|
  |priority|number|【可选】过滤器优先级，数值越小，执行越早，默认为10，选填|
  |enable|true/false|【必选】控制开关|
  |enable_page|path/all|【可选】填写想要应用的页面的相对路径（即路由地址）,如根目录就填'/',分类页面就填'/categories/'。若要应用于所有页面，就填'all'，默认为all|
  |exclude|path|【可选】填写想要屏蔽的页面，可以多个。仅当enable_page为'all'时生效。写法见示例。原理是将屏蔽项的内容逐个放到当前路径去匹配，若当前路径包含任一屏蔽项，则不会挂载。|
  |timemode|date/updated|【可选】时间显示，date为显示创建日期，updated为显示更新日期,默认为date|
  |layout.type|id/class|【可选】挂载容器类型，填写id或class，不填则默认为id|
  |layout.name|text|【必选】挂载容器名称|
  |layout.index|0和正整数|【可选】前提是layout.type为class，因为同一页面可能有多个class，此项用来确认究竟排在第几个顺位|
  |insertposition|text|'beforebegin'：元素自身的前面。'afterbegin'：插入元素内部的第一个子节点之前。'beforeend'：插入元素内部的最后一个子节点之后。'afterend'：插入元素自身的后面。|
  |default_img|url|【可选】默认图|
  |use_default_img_mode|true/false|【可选】所有文章一律使用默认图|

4. 使用方法

>  [!WARNING]
> 由于图片与轮播内容是一体的，所以暂无法做到指定图片固定
   
  在文章的`front_matter`中添加`swiper_index`配置项即可:
  
  * 仅首页加载: `enable_page: all` 改成 `enable_page: /` 就好了。
  
  ```markdown
  ---
  title: 文章标题
  date: 创建日期
  updated: 更新日期
  cover: 文章封面
  description: 文章描述
  swiper_index: 1 #置顶轮播图顺序，需填非负整数，数字越大越靠前
  ---
  ```

# 截图
![](https://npm.elemecdn.com/akilar-candyassets/image/f4783623.png)
