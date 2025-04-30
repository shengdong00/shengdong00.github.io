---
title: "纤维状颗粒的空气动力学直径误差传递公式"
date: 2023-07-09T17:05:28+08:00
draft: false
author:
tags: ["空气动力学直径","纤维状颗粒","误差传递"]
categories: "知识"
math: true
mermaid: false
ShowToc: false
TocOpen: true
echarts: false
cover:
    image: ""
---


> 基于Prodi et al (1982)的纤维颗粒空气动力学等效直径计算公式推导出以纤维颗粒的长度、直径为直接测量变量的等效直径误差传递公式。

<!--more-->

Prodi et al[^1]给出了纤维状颗粒的空气动力学等效直径计算公式：
$$
D=\frac{3W}{2}\sqrt{\frac{\rho}{\frac{0.385}{\ln{2\beta}-0.5}+\frac{1.23}{\ln{2\beta}+0.5}}}
$$
其中$W$是纤维的直径，$\beta$是基于投影尺寸的纵横比（长/宽，$L/W$）[^2]。在做文献调研时，需要计算一些已发表实验中采用纤维颗粒的等效直径及误差，但是论文中通常只会给出纤维颗粒的直径和长度测量数据及误差，即$W±\sigma_W,L±\sigma_L$。这时虽然可以很方便地计算出$D=f(W,L)$，却不能直接知道$D$的误差是多少。本文给出从长度、直径误差计算出等效直径误差的推导过程和误差传递公式。

以偏导的形式表达等效直径误差，
$$
\sigma_D^2=\sigma_W^2\left(\frac{\partial D}{\partial W}\right)^2_{\overline W}+\sigma_L^2\left(\frac{\partial D}{\partial L}\right)^2_{\overline L}
$$
接下来开始对两个偏导项逐个击破。

#### 对$W$的偏导

$$
\frac{\partial D}{\partial W}=\frac32\cdot\sqrt{\frac{\rho}{\frac{0.385}{\ln{2\beta}-0.5}+\frac{1.23}{\ln{2\beta}+0.5}}}
+\frac{3W}{2}\cdot\frac{\partial g(W,L)}{\partial W}
$$

$$
\begin{aligned}
{\rm where~~}
g(W,L)&=\left[
\frac1\rho
\left(
\frac{0.385}{\ln(L/W)+\ln2-0.5}+\frac{1.23}{\ln(L/W)+\ln2+0.5}
\right)
\right]^{-\frac12}\\\
&=\sqrt\rho\cdot
h(W,L)^{-\frac 12}\\\
{\rm where~~}h(W,L)&=
\frac{0.385}{\ln(L/W)+\ln2-0.5}+\frac{1.23}{\ln(L/W)+\ln2+0.5}
\end{aligned}
$$

$$
\therefore~
\frac{\partial g(W,L)}{\partial W}=-\frac{\sqrt\rho}2\cdot h(W,L)^{-\frac32}\cdot\frac{\partial h(W,L)}{\partial W}
$$

$$
\begin{aligned}
\frac{\partial h(W,L)}{\partial W}&=\frac{\partial}{\partial W}\left[
\frac{0.385}{\ln(L/W)+\ln 2-0.5}+\frac{1.23}{\ln(L/W)+\ln2+0.5}
\right]\\\
&=\frac{0.385}{\left[\ln(L/W)+\ln 2-0.5\right]^2}\cdot\frac1W
+\frac{1.23}{[\ln(L/W)+\ln2+0.5]^2}\cdot\frac1W\\\
&=\frac{0.385}{\left[\ln(2\beta)-0.5\right]^2\cdot W}
+\frac{1.23}{[\ln(2\beta)+0.5]^2\cdot W}
\end{aligned}
$$

$$
\begin{aligned}
\therefore~\frac{\partial g(W,L)}{\partial W}&=-\frac{\sqrt\rho}{2W}\cdot
\left(
\frac{0.385}{\ln(2\beta)-0.5}+\frac{1.23}{\ln(2\beta)+0.5}
\right)^{-\frac32}\cdot\left(
\frac{0.385}{\left[\ln(2\beta)-0.5\right]^2\cdot W}
+\frac{1.23}{[\ln(2\beta)+0.5]^2\cdot W}
\right)\\\
&=-\frac{1}{2W}\sqrt{
\frac\rho
{\left[
\frac{0.385}{\ln(2\beta)-0.5}+\frac{1.23}{\ln(2\beta)+0.5}
\right]^3}
}
\times\left(
\frac{0.385}{\left[\ln(2\beta)-0.5\right]^2}
+\frac{1.23}{[\ln(2\beta)+0.5]^2}
\right)
\end{aligned}
$$

$$
\begin{aligned}
\therefore~\frac{\partial D}{\partial W}&=\frac32\cdot\sqrt{\frac{\rho}{\frac{0.385}{\ln{2\beta}-0.5}+\frac{1.23}{\ln{2\beta}+0.5}}}
+\frac{3W}{2}\cdot\frac{\partial g(W,L)}{\partial W}\\\
&=\frac32\cdot\sqrt{\frac{\rho}{\frac{0.385}{\ln{2\beta}-0.5}+\frac{1.23}{\ln{2\beta}+0.5}}}-\frac34\cdot\sqrt{
\frac\rho
{\left[
\frac{0.385}{\ln(2\beta)-0.5}+\frac{1.23}{\ln(2\beta)+0.5}
\right]^3}
}
\times\left(
\frac{0.385}{\left[\ln(2\beta)-0.5\right]^2}
+\frac{1.23}{[\ln(2\beta)+0.5]^2}
\right)\\\
&=\frac32\sqrt{\frac{\rho}{\frac{0.385}{\ln{2\beta}-0.5}+\frac{1.23}{\ln{2\beta}+0.5}}}
\left(
1-\frac12\frac{
\frac{0.385}{\left[\ln(2\beta)-0.5\right]^2}
+\frac{1.23}{[\ln(2\beta)+0.5]^2}
}
{\frac{0.385}{\ln(2\beta)-0.5}+\frac{1.23}{\ln(2\beta)+0.5}}
\right)
\end{aligned}
$$



#### 对$L$的偏导

$$
\begin{aligned}
\frac{\partial D}{\partial L}&=\frac{3W}{2}\times\frac{\partial g(W,L)}{\partial L}\\\
\frac{\partial g(W,L)}{\partial L}&=-\frac{\sqrt \rho}{2}h(W,L)^{-\frac32}\frac{\partial h(W,L)}{\partial L}
\end{aligned}
$$

由于$W$和$-L$在函数$h(W,L)$里的地位是相同的，所以根据前一节对$h(W,L)$求偏导的计算可以很快得到

$$
\begin{aligned}
\frac{\partial h(W,L)}{\partial L}&=-\frac{\partial h(W,L)}{\partial W}\\\
&=-\frac{0.385}{[\ln (2\beta)-0.5]^2\cdot L}-\frac{1.23}{[\ln(2\beta)+0.5]^2\cdot L}
\end{aligned}
$$

$$
\begin{aligned}
\therefore~\frac{\partial D}{\partial L}&=\frac{3}{4\beta}
\sqrt{
\frac{\rho}{\frac{0.385}{\ln2\beta-0.5}+\frac{1.23}{\ln2\beta+0.5}}
}
\left(\frac{\frac{0.385}{[\ln(2\beta)-0.5]^2}+\frac{1.23}{[\ln(2\beta)+0.5]^2}}{\frac{0.385}{\ln2\beta-0.5}+\frac{1.23}{\ln2\beta+0.5}}\right)
\end{aligned}
$$





[^1]:Prodi, V., De Zaiacomo, T., Hochrainer, D., & Spurny, K. (1982). Fibre collection and measurement with the inertial spectrometer. *Journal of Aerosol Science*, *13*(1), 49–58. https://doi.org/10.1016/0021-8502(82)90007-6
[^2]:Edo, C., Fernández-Alba, A. R., Vejsnæs, F., van der Steen, J. J. M., Fernández-Piñas, F., & Rosal, R. (2021). Honeybees as active samplers for microplastics. *Science of the Total Environment*, *767*, 144481. https://doi.org/10.1016/j.scitotenv.2020.144481
