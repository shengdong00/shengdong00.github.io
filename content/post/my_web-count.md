---
title: "在Hugo + PaperMod主题下添加不蒜子网站统计"
date: 2022-12-01T01:34:50+08:00
draft: false
tags: ["不蒜子","网站统计","访客","Hugo"]
categories: "技巧"
math: false
mermaid: false
ShowToc: false
---

之前在使用Hexo平台 + NexT主题搭建博客的时候，自带不蒜子[^1]的网站访问统计。现在的这个主题下需要自行添加统计功能。最终还是决定使用不蒜子来实现，便于直接显示在网站页面上[^2]。唯一的缺点就是目前没办法自定义初始值，所以域名更换后数据就从零开始了。

<!--more-->

在`.\themes\PaperMod\layouts\partials\footer.html`的末尾添加：

```html
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```

并且在`<footer>`标签中添加访问量和访客数，

```html
<footer class="footer">
    ... ...
    <span id="busuanzi_container_site_count">
        <br>总访问量=<span id="busuanzi_value_site_pv"></span>, 
        访客数=<span id="busuanzi_value_site_uv"></span>, 
        本页阅读量=<span id="busuanzi_value_page_pv"></span>
    </span>
</footer>
```

在导入不蒜子的脚本后，已知可以调用的变量有三个：

* `busuanzi_value_site_pv`：单个用户连续访问n个页面，记录n次访问量
* `busuanzi_value_site_uv`：单个用户连续点击n篇文章，只记录1次访客数
* `busuanzi_value_page_pv`：单个用户点击1篇文章n次，本篇文章记录n次阅读量

顺便，意识到之后需要修改网站底部的文字的话，都可以在这个`<footer>`标签里进行编辑。

[^1]: [不蒜子 - 极简网页计数器 (ibruce.info)](http://busuanzi.ibruce.info/)
[^2]:[不蒜子计数器的使用_zolo_的博客-CSDN博客](https://blog.csdn.net/weixin_46247581/article/details/105848853)
