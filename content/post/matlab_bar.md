---
title: 在Matlab中使用进度条
date: 2022-10-15 16:17:15
tags: [Matlab,进度条]
category: 技巧
---

最近经常要跑一些很耗时的matlab脚本，命令行窗口里又需要不断输出信息，不方便直接看运行进度。需要搞一个独立的进度条来显示告诉我们脚本运行的情况。<!--more-->

初始化进度条：

```matlab
f = waitbar(0, msg, 'Name', Value)
%{
x: 0~1的小数，表示进度
msg: 一段文本显示消息，例如"Loading data..."
'Name', Value: 设置对话框的名称，例如'Name', 'Progress'
%}
```

更新进度条：

```matlab
waitbar(x,f,msg)
%{
x: 0~1的小数，更新后的进度
f: 所更新的对话框的变量名
msg: 一段文本显示消息，例如"Processing data..."
%}
```

关闭进度条：

```matlab
close(f)
```

一个应用实例：

<!--<img src="/images/image-20221206223220526.png" alt="image-20221206223220526" style="zoom:67%;" />-->

<img src = 'https://s3.bmp.ovh/imgs/2023/01/18/9101f97a49a98c2f.png' style="zoom:67%;">

完整的官网文档见 [https://ww2.mathworks.cn/help/matlab/ref/waitbar.html](https://ww2.mathworks.cn/help/matlab/ref/waitbar.html)
