---
title: Markdown-mermaid画流程图、甘特图和饼图
date: 2022-03-20 01:07:53
tags: [Markdown,Typora,mermaid]
categories: 技巧
mermaid: true
---

在很多支持Markdown语法的编辑器（例如Typora, 印象笔记）中，可以通过mermaid代码块的方式，实现流程图、时序图等图表的绘制。它是一种基于 Javascript 的图表和图表工具，提供标记启发的文本定义，以动态创建和修改图表。

以下是除了普通的`graph`流程图以外，常用的一些mermaid功能。

<!--more-->

# `flowchart`绘制流程图

在绘制流程图的时候，将`graph`替换成`flowchart`，可以呈现节点之间的曲线连接。比之前生硬的折线段美观很多。同时，flowchart还可以实现不同子图(subgraph)之间的连通，并且允许箭头逆向。相比之下，graph就只能在节点和节点之间按照既定方向相连。

不过官网上显示flowchart仍然是测试版本，功能上可能会有一些欠缺。

```
flowchart TD
    c1--标注-->a2
    subgraph one
    	a1-.->a2
    end
    subgraph two
    	b1
    	b2
    end
    subgraph three
    	c1-->c2
    end
    one --> b2
    three --> two
    two --> c2
```

<img src="/images/image-20220320013442456.png" alt="image-20220320013442456" style="zoom: 67%;" />

这是在`graph`格式下的图表。图表之间的连线是刚性的，并且仅支持节点的链接。

<img src="/images/image-20220320013503568.png" alt="image-20220320013503568" style="zoom:67%;" />

# `gantt`甘特图

甘特图可以在时间轴上记录不同的事件名称、时长跨度和状态。

```
gantt
    dateFormat  YYYY-MM-DD
    title       甘特图名称
    
    section 类别A
    已经完成的任务    :         done,     des1,   2014-01-06,  2014-01-08
    进行中的任务      :         active,   des2,   2014-01-07,  2d
    未来的任务        :                   des3,   after des2,  2d

    section 类别B
    完成的关键任务    :crit,    done,             2014-01-06,  36h
    进行中的关键任务  :crit,    active,                        2d
    将来的关键任务    :crit,                                   1d
```



<div class="mermaid">
gantt
    dateFormat  YYYY-MM-DD
    title       甘特图名称
    section 类别A
    已经完成的任务    :         done,     des1,   2014-01-06,  2014-01-08
    进行中的任务      :         active,   des2,   2014-01-07,  2d
    未来的任务        :                   des3,   after des2,  2d
    section 类别B
    完成的关键任务    :crit,    done,             2014-01-06,  36h
    进行中的关键任务  :crit,    active,                        2d
    将来的关键任务    :crit,                                   1d
</div>

第二行的`YYYY-MM-DD`是日期格式，也可以尝试`MM-DD-YYYY`，`YYYY`等等不同的格式。

每一项任务的描述格式均为：
`任务名称:  是否关键(crit/缺省),  状态(done/active/缺省),  任务代号(代号/缺省),  开始时间(YYYY-MM-DD/after 其他代号/缺省),  结束时间(YYYY-MM-DD/持续时长/缺省)`
每一栏的缺省含义依次是
* 非关键任务
* 任务未开始
* 任务没有代号
* 紧接上一任务的结束时间开始
* 没有持续时长（即为一个点事件）

# `pie`饼图

`pie`可以按照类别占比有小到大的顺序，从12点开始顺时针排列并饼块，并计算出各部分的百分比。语法结构也很简单：

```
pie
    title 饼图名称
    "类别A" : 42.96
    "类别B" : 50.05
    "类别C" : 10.01
```



<div class="mermaid">
pie
    title 饼图名称
    "类别A" : 42.96
    "类别B" : 50.05
    "类别C" : 10.01
</div>

但是遗憾的是，mermaid在统计图表这方面并不能提供更多的选项。如果需要做折线图、柱状图等等各种丰富的内容，肯定还是得移步Python, MATLAB或者其他专业工具。

# 其他

mermaid还有绘制其他图表的功能，比如Sequence Diagram，Class Diagram，User Journey等等。对于流程图的文本内容、边框形状、连接线等等也有更多的自定义内容，本文没有再细究。所有内容都可以在开发者的教程（https://mermaid-js.github.io/mermaid）上找到！

除了mermaid之外，Typora的代码块还能渲染其他模块。比如分析程序的时候经常会用到`flow`模块来画流程图，留待以后整理。这里先贴一张之前写过的`flow`图，立一个日后整理的flag~

```flow
st=>start: call DWA function
in2=>inputoutput: input x,goal,ob
sub4=>subroutine: dw = calc_window_range(x)

cond3=>condition: (vx, vw) in dw ? 
sub3=>subroutine:  (h_cost, d_cost, v_cost)
op1=>operation: next (vx,vw)
cond2=>condition: item in table ?
op4=>operation: normalized total_cost
op5=>operation: find smallest total_cost, best_u = (vx, vw)
op6=>operation: next item

sub1=>subroutine: predict_trajectory(vx,vw)

out2=>inputoutput: return best_u
en=>end: end

st()->in2(left)->sub4->cond3(yes)->sub1->sub3->op1(left)->cond3
cond3(no)->cond2(yes)->op4->op6
op6(left)->cond2(no)->op5
op5->out2()->en
```

<img src="/images/image-20220320012910865.png" alt="image-20220320012910865" style="zoom: 67%;" />
