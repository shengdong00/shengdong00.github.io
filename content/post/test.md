---
title: "HugoBlog Test"
date: 2022-11-01T15:31:58+08:00
draft: false
tags: ["测试","Hugo","博客"]
categories: "技巧"
math: true
mermaid: true
---

# This is a test page

本页面用于测试网站的显示格式，以及不同模块的渲染情况。<!--more-->

## Subtitle 1

* aaa
* bbb
* ccc

put some emoji :smile:

and some formula $y=x^2$[^2]

公式块中换行的`\\`要写成`\\\`
$$
\begin{aligned}
y &= \int_0^a\sqrt{x}dx\\\
z &= x\cdot\ln y
\end{aligned}
$$


and some `codes`

```python
package main

import (
    "fmt"
    "math/rand"
    "time"
)

type Moo struct {
    Cow   int
    Sound string
    Tube  chan bool
}

// A cow will moo until it is being fed
func cow(num int, mootube chan Moo) {
    tube := make(chan bool)
    for {
        select {
        case mootube <- Moo{num, "moo", tube}:
            fmt.Println("Cow number", num, "mooed through the mootube")
            <-tube
            fmt.Println("Cow number", num, "is being fed and stops mooing")
            mootube <- Moo{num, "mooh", nil}
            fmt.Println("Cow number", num, "moos one last time out of happyness")
            return
        default:
            fmt.Println("Cow number", num, "mooed through the mootube and was ignored")
            time.Sleep(time.Duration(rand.Int31n(1000)) * time.Millisecond)
        }
    }
}

// The farmer wants to put food in all the mootubes to stop the mooing
func farmer(numcows int, mootube chan Moo, farmertube chan string) {
    fmt.Println("Farmer starts listening to the mootube")
    for hungryCows := numcows; hungryCows > 0; {
        moo := <-mootube
        if moo.Sound == "mooh" {
            fmt.Println("Farmer heard a moo of relief from cow number", moo.Cow)
            hungryCows--
        } else {
            fmt.Println("Farmer heard a", moo.Sound, "from cow number", moo.Cow)
            time.Sleep(2e9)
            fmt.Println("Farmer starts feeding cow number", moo.Cow)
            moo.Tube <- true
        }
    }
    fmt.Println("Farmer doesn't hear a single moo anymore. All done!")
    farmertube <- "yey!"
}

// The farm starts out with mooing cows that wants to be fed
func runFarm(numcows int) {
    farmertube := make(chan string)
    mootube := make(chan Moo)
    for cownum := 0; cownum < numcows; cownum++ {
        go cow(cownum, mootube)
    }
    go farmer(numcows, mootube, farmertube)
    farmerSaid := <-farmertube
    if farmerSaid == "yey!" {
        fmt.Println("All cows are happy.")
    }
}

func main() {
    runFarm(4)
    fmt.Println("done")
}
```



insert images

* 以本地文件的`content`文件夹作为相对路径的起点，或者直接使用网页外链

  <img src="/images/image-20221101202147118.png" alt="image-20221101202147118" style="zoom: 33%;" />

## Subtitle 2

| 表格 | A    | B    |
| ---- | ---- | ---- |
| 000  | 111  | 222  |
| 0000 | 1111 | 2222 |


try quoting?

> Blahblahblah...[^n]

注脚的编号会根据出现的顺序自动生成

## Subtitle 3

mermaid插件的渲染[^marmaid参考]
在mermaid代码块前后添加：

```html
<div class="mermaid">
%%{init: {'theme': 'forest', 'fill': 'white', 'securitylevel': 'loose' } }%%
...
</div>
```


<div class="mermaid">
%%{init: {'theme': 'forest', 'fill': 'white', 'securitylevel': 'loose' } }%%
sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!
</div>


<div class="mermaid">
%%{init: {'theme': 'dark', 'fill': 'red', 'securitylevel': 'loose' } }%%
flowchart LR
A-->B-->C-->A

</div>

### 将Hugo部署到到Github Pages[^git]

生成网页静态页面文件

```bash
hugo
```

进入public文件夹，使用git上传文件

```bash
cd public
git init    ##初始化仓库
git remote add origin https://github.com/username/username.github.io.git    ##链接远程仓库
git add .
git commit -m "first commit"
git push -u origin master
```

在此之后更新文章，使用hugo生成新的静态页面，并使用git push进行同步

```bash
cd public
git add .
git status
git commit -m "add blog post"
git push
```

### html语言标记补充

#### 强制居中

```html
<center>需要居中的内容</center>
```

<center>需要居中的内容</center>


#### 图片并排

用表格标签`<table>`来实现多个图片的并排

```html
<table><tr>
<td><img src="/images/leaf-styles.jpg" style="zoom:60%;" /></td>
    <td><img src="/images/prime.jpg" style="zoom:60%;" /></td>
</tr></table>
```

<table><tr>
<td><img src="/images/leaf-styles.jpg" style="zoom:60%;" /></td>
    <td><img src="/images/prime.jpg" style="zoom:60%;" /></td>
</tr></table>

#### 图片注释

在`<img>`标签之后添加`<figcaption>`

PS：在正文里，用`<figure>`标签将`<img>`和`<figcaption>`包裹起来后，PaperMod会图注文字渲染为粗体。

```html
<center><figure>
    <img src="/images/image-20221101202147118.png" style="zoom: 33%;" />
    <figcaption>一张月球照片</figcaption>
</figure></center>
```
<center><figure>
<img src="/images/image-20221101202147118.png" style="zoom: 33%;" />
<figcaption>一张月球照片</figcaption>
</figure></center>









[^n]:From nobody
[^2]: 参考教程：[在Hugo中使用MathJax · 零壹軒·笔记 (qidong.name)](https://note.qidong.name/2018/03/hugo-mathjax/)
[^marmaid参考]:参考教程：[hugo增加mermaidjs的支持 - 木木飞 (mmfei.com)](https://www.mmfei.com/2021/05/hugo增加mermaidjs的支持/)
[^git]:参考教程：[使用hugo生成静态博客并部署在GitHub上 - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/397612900)
