---
title: "SETAR Model"
date: 2023-04-29T20:50:34+08:00
draft: false
author:
tags: ["SETAR", "数据分析", "时间序列分析"]
categories: "知识"
math: true
mermaid: false
ShowToc: false
TocOpen: true
echarts: false
cover:
    image: ""
---

SETAR的全称是“Self-Exciting Threshold Auto-Regressive (SETAR) models”，可用于对一个时间序列变量的模式演变进行阶段划分。该模型最早于1977年由Howell Tong提出[^1]。<!--more-->

考虑如下关于时间序列变量$y_t$的简单自回归模型$AR(p)$：
$$
y_t=\gamma_0 + \gamma_1 y_{t-1}+\gamma_2 y_{t-2}+\dots+\gamma_py_{t-p}+\epsilon_t
$$
其中$\gamma_i(i=1,2,\dots,p)$是自回归的系数，$\epsilon_t$~$WN(0;\sigma^2)$是服从正态分布的白噪音项。、

改写成向量形式：
$$
y_t = {\bf X_t}\gamma+\sigma\epsilon_t
$$
其中${\bf X_t}=[1, y_{t-1}, y_{t-2}, \dots, y_{t-p}]$是时间变量的行向量，$\gamma=[\gamma_0, \gamma_1, \gamma_2, \dots, \gamma_p]^{\rm T}$是系数列向量，$\epsilon_t$~$WN(0;1)$是服从标准正态分布的白噪音项。

在SETAR模型中，将$z_t=y_{t-d}$作为一个弱外源阈值变量(weakly exogenous **threshold variable**)，本质上就是$y_t$在迟滞项$d$之前的历史数值。SETAR模型的数学表达为：
$$
y_t={\bf X_t}\gamma^{(j)}+\sigma^{(j)}\epsilon_t,~{\rm if} ~r_{j-1}<z_t<r_j
$$
其中$-\infty=r_0<r_1<\dots<r_k=+\infty$定义了$z_t$可能落入的$k$个区间。



在R语言中可以通过使用`tsDyn`package里的函数`setar()`来进行SETAR模型分析，用法可以查看官方文档[R: Self Threshold Autoregressive model (r-project.org)](https://search.r-project.org/CRAN/refmans/tsDyn/html/setar.html)。另外，Michał Cukrow有一篇博客里给出了比较详细的解读和R例程（[Threshold Autoregressive Models — beyond ARIMA + R Code | by Michał Cukrowski | Towards Data Science](https://towardsdatascience.com/threshold-autoregressive-models-beyond-arima-r-code-6af3331e2755)），以后有空再看。

参考资料：[Wikipedia | SETAR model](https://en.wikipedia.org/wiki/SETAR_(model))




[^1]:Tong, H. (1977) "Contribution to the discussion of the paper entitled Stochastic modelling of riverflow time series by A.J.Lawrance and N.T.Kottegoda", [Journal of the Royal Statistical Society](https://en.wikipedia.org/wiki/Journal_of_the_Royal_Statistical_Society), Series A, 140, 34-35.