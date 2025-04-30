---
title: "在Hugo + Papermod中添加Echartsjs"
date: 2023-03-12T01:38:43+08:00
draft: false
author:
tags: ["Echarts", "Hugo"]
categories: "技巧"
math: false
mermaid: false
ShowToc: false
TocOpen: true
echarts: true
cover:
    image: "images/屏幕截图 2023-03-15 045909.jpg"
---

参照Echarts的[官方入门文档](https://echarts.apache.org/handbook/zh/get-started/)，给Hugo框架的博客网站添加使用Echarts渲染的功能（主题为[Papermod](https://github.com/adityatelange/hugo-PaperMod))。以后需要放图表的时候就不用再傻乎乎地截图了。

<!--more-->

在主题文件夹中，`layouts/partials/head.html`的文档末尾加上：

```html
{{ if .Params.echarts }}
<!-- 引入 echarts.js -->
<script src="https://cdn.staticfile.org/echarts/4.3.0/echarts.min.js"></script>
{{ end }}
```

这里使用七牛云提供的CDN加速服务（[Staticfile CDN](http://staticfile.org/)）。

如果在某篇博客里需要使用echarts渲染，需要在头部使用声明：

```
---
echarts: true
---
```



尝试一下渲染入门文档给的例程（为了避免移动端浏览时容器的宽度溢出，所以把宽度从`600px`改成了`auto`）：

```html
<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
<div id="main" style="width: auto; height:400px;"></div>
<script type="text/javascript">
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '第一个 ECharts 实例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
</script>
```

<!-- 为ECharts准备一个具备大小（宽高）的Dom -->
<div id="main" style="width: auto; height:400px;"></div>
<script type="text/javascript">
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'));
    // 指定图表的配置项和数据
    var option = {
        title: {
            text: '第一个 ECharts 实例'
        },
        tooltip: {},
        legend: {
            data:['销量']
        },
        xAxis: {
            data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
        },
        yAxis: {},
        series: [{
            name: '销量',
            type: 'bar',
            data: [5, 20, 36, 10, 10, 20]
        }]
    };
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
</script>


