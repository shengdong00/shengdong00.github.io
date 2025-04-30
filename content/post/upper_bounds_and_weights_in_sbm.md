---
title: 在SBM模型中引入上边界和指标权重
date: 2022-09-07 09:31:54
tags: [数学建模,运筹学,线性代数]
categories: 探索
math: true
mermaid: false
ShowToc: false
---

在实际应用SBM模型分析绿色发展效率的时候，发现面临着以下两个困难：

1. 指标实际可取值具有上边界；
2. 不同指标之间存在重要性差异。

于是对经典的非期望产出SBM模型进行了修改，以解决上述问题。:triangular_ruler:<!--more-->（传统非期望产出SBM模型见上一篇文章“[非期望产出SBM模型的数学推演及Python实现](https://dongsheng2000.gitee.io/2022/08/10/undisirable_SBM_in_Python/)”）



# 添加指标取值范围

在工作中，我们把碳储量作为绿色发展的期望产出指标之一，而在一定的区域内，其所能达到的最高碳储量是有限的（最理想的状况是将全部建设用地面积都变成林地，从而实现区域内碳储量最大化，而这在现实中也是不可能的事情）。但是在原始的SBM模型中，所有投入和产出要素是没有上限的。这就导致在一些DMU中，SBM投射(SBM-projection)改进后的碳储量远远超出了该DMU理论上所能达到的碳储量。因此有必要对指标的取值范围添加更为严格的取值范围。

原始的非期望产出SBM模型：

$$
\begin{aligned}
\min &\rho=\frac{1-\frac1m\sum\_{i=1}^m\left({s^-\_i}/{x\_{i0}}\right)}
{1+\frac1{q\_1+q\_2}\left[\sum\_{r\_1=1}^{q\_1}\left({s^+\_r}/{y\_{r0}}\right) + \sum\_{r=1}^{q\_2}\left({s^{+'}\_r}/{z\_{r0}}\right)\right]}\\\
s.t. & \vec x_0 = X\vec\lambda + \pmb s^- \\\
& \vec y_0 = Y\vec\lambda - \pmb s^+\\\
&\vec z_0=Z\vec\lambda+\pmb s^{+'}\\\
& \vec\lambda\ge0,~\pmb s^-\ge0,\pmb s^+\ge 0
\end{aligned}
$$





决策单元$DMU_0$的期望产出指标上限由向量$\pmb l_{Y0}\in R^{q_1\times 1}$所决定，该决策单元在经过SBM投射优化后的期望产出亦不能超过$\pmb l_{Y0}$，即
$$
\pmb y_0 +\pmb s^+ \le \pmb l_{Y0}
$$
由于期望产出在经过SBM投射优化之后是变大的，因此没有必要对其设置下边界。但是，投入和非期望产出指标在优化之后将更小，虽然SBM模型本身设置了大于零的下边界，但是这一边界可能还是不够精确，所以同理可以添加投入指标和非期望产出指标的下边界，满足
$$
\begin{array}
\pmb x_0 - \pmb s^- \ge \pmb l_{X0}\\\
\pmb z_0 - \pmb s^{+'} \ge \pmb l_{Z0}
\end{array}
$$
综上，得到对松弛变量的约束条件：
$$
\begin{aligned}
\pmb s^- &\le \pmb x_0 - \pmb l_{X0}\\\
\pmb s^+ &\le -\pmb y_0 + \pmb l_{Y0}\\\
\pmb s^{+'} &\le \pmb z_0 - \pmb l_{Z0}
\end{aligned}
$$
写进规划模型：

$$
\begin{aligned}
\min &\rho=\frac{1-\frac1m\sum\_{i=1}^m\left({s^-\_i}/{x\_{i0}}\right)}
{1+\frac1{q\_1+q\_2}\left[\sum\_{r\_1=1}^{q\_1}\left({s^+\_r}/{y\_{r0}}\right) + \sum\_{r=1}^{q\_2}\left({s^{+'}\_r}/{z\_{r0}}\right)\right]}\\\
s.t. &
\pmb x\_0 = X\pmb\lambda + \pmb s^- \\\
& \pmb y\_0 = Y\pmb\lambda - \pmb s^+\\\
& \pmb z\_0=Z\pmb\lambda+\pmb s^{+'}\\\
& 0\le \pmb s^- \le \pmb x\_0 - \pmb l\_{X0}\\\
& 0\le \pmb s^+ \le -\pmb y\_0 + \pmb l\_{Y0}\\\
& 0\le \pmb s^{+'} \le \pmb z\_0 - \pmb l\_{Z0}\\\
& \pmb\lambda\ge0
\end{aligned}
$$

在后续进行Charnes-Cooper转换的时候，松弛变量的不等式约束只需要在两侧都乘上$t$即可：
$$
\begin{aligned}
\min &\rho=t-\frac1m\sum\_{i=1}^m\frac{S\_i^-}{x\_{i0}}\\\
s.t. & 1=t+\frac1{q\_1+q\_2}\left(\sum\_{r=1}^{q\_1}\frac{S\_r^+}{y\_{r0}}+\sum\_{r=1}^{q\_2}\frac{S\_r^{+'}}{y\_{r0}}\right)\\\
& t\pmb x\_0=\pmb X \pmb \Lambda + \pmb S^-\\\
& t\pmb y\_0=\pmb Y \pmb \Lambda - \pmb S^+\\\
& t\pmb z\_0=\pmb Z \pmb \Lambda + \pmb S^{+'}\\\
&0\le \pmb S^- \le t(\pmb x\_0 - \pmb l\_{X0})\\\
&0\le \pmb S^+ \le t(-\pmb y\_0 + \pmb l\_{Y0})\\\
&0\le \pmb S^{+'} \le t(\pmb z\_0 - \pmb l\_{Z0})\\\
& \pmb \Lambda\ge0, t\ge 0
\end{aligned}
$$
在基于Python `scipy.optimize`库的线性规划中，这一约束体现在添加不等式条件参数`A_ub`, `b_ub`。

# 添加指标权重

观察原始的目标函数：
$$
\rho=\frac{1-\frac1m\sum\_{i=1}^m\left({s^-\_i}/{x\_{i0}}\right)}
{1+\frac1{q\_1+q\_2}\left[\sum\_{r\_1=1}^{q\_1}\left({s^+\_r}/{y\_{r0}}\right) + \sum\_{r=1}^{q\_2}\left({s^{+'}\_r}/{z\_{r0}}\right)\right]}
$$
可以看出，最终在分子上影响目标函数的是所有投入指标**松弛变量占比**的**平均值**；在分母上影响目标函数的是期望产出和非期望产出指标**松弛变量占比**的**平均值**。当指标之间存在重要性差异时，为每个指标添加权重系数$\pmb w\_x, \pmb w\_y, \pmb w\_z$，则目标函数改为

$$
\rho=\frac{1-\frac1{\sum\_{i=1}^m w\_{xi}}\sum\_{i=1}^m (w\_{xi}{s^-\_i}/{x\_{i0}) }}
{1+\frac1{\sum\_{r\_1=1}^{q\_1} w\_{yr\_1}+\sum\_{r\_2=1}^{q\_2} w\_{zr\_2}} \left[\sum\_{r\_1=1}^{q\_1}\left({w\_{yr\_1}s^+\_r}/{y\_{r0}}\right) + \sum\_{r=1}^{q\_2}\left({w\_{zr\_2}s^{+'}\_r}/{z\_{r0}}\right)\right]}
$$

通过Charnes-Cooper转换后得到线性规划模型：
$$
\begin{aligned}
\min &\rho=t-\frac1{\sum_{i=1}^m w_{xi}}\sum_{i=1}^m\frac{w_{xi}S_i^-}{x_{i0}}\\\
s.t. & 1=t+\frac1{\sum_{r=1}^{q_1}w_{yr}+\sum_{r=1}^{q_2}w_{zr}}\left(\sum_{r=1}^{q_1}\frac{w_{yr}S_r^+}{y_{r0}}+\sum_{r=1}^{q_2}\frac{w_{zr}S_r^{+'}}{y_{r0}}\right)\\\
& t\pmb x_0=\pmb X \pmb \Lambda + \pmb S^-\\\
& t\pmb y_0=\pmb Y \pmb \Lambda - \pmb S^+\\\
& t\pmb z_0=\pmb Z \pmb \Lambda + \pmb S^{+'}\\\
& \pmb \Lambda\ge0, t\ge 0,\pmb S^-\ge0,\pmb S^+\ge0,\pmb S^{+'}\ge0
\end{aligned}
$$
写成矩阵形式，
$$
\begin{aligned}
\min & \rho=C\cdot \pmb X\\\
s.t. & A\cdot\pmb X = b\\\
& \pmb X\ge0
\end{aligned}
$$
其中自变量为
$$
\pmb X=\left[
{\color{red} \lambda_1,\lambda_2,\dots,\lambda_n,}t,
{\color{blue} S_1^-,S_2^-,\dots,S_m^-,}
{\color{green} S_1^+,S_2^+,\dots,S_{q_1}^+, S_1^{+'},S_2^{+'},\dots,S_{q_2}^{+'}}
\right]^\rm T,
$$
目标函数系数矩阵为
$$
C=\left[
{\color{red} 0,0,\dots,0,}1,{\color{blue} -\frac{w_{x1}}{\left(\sum_{i=1}^m w_{xi}\right)x_{10}},-\frac{w_{x2}}{\left(\sum_{i=1}^m w_{xi}\right)x_{20}},\dots,-\frac{w_{xm}}{\left(\sum_{i=1}^m w_{xi}\right)x_{m0}}},{\color{green}0,\dots,0}
\right],
$$
约束条件方程系数为
$$
\displaylines{
A=\left[
\begin{matrix}
\color{red} 0 & \color{red}\cdots & \color{red}0 & 1 & \color{blue}0 & \color{blue}\cdots & \color{blue}0 & \color{green}\alpha_{1} & \color{green}\cdots & \color{green}\alpha_{q_1} & 
\color{green}\beta_{1} & \color{green}\dots & \color{green}\beta_{q_2}\\\
\\\
\\\
\color{red}x_{11} & \color{red}\cdots & \color{red}x_{1n} & -x_{10} & \color{blue}1 & \color{blue}\cdots & \color{blue}0 & \color{green}0 & \color{green}\cdots & \color{green}0 & \color{green}0 & \color{green}\cdots & \color{green}0\\\
& \color{red}\vdots &&&& \color{blue}\ddots &&& \color{green}\vdots &&& \color{green}\vdots\\\
\color{red}x_{m1} & \color{red}\cdots & \color{red}x_{mn} & -x_{m0} & \color{blue}0 & \color{blue}\cdots & \color{blue}1 & \color{green}0 & \color{green}\cdots & \color{green}0 & \color{green}0 & \color{green}\cdots & \color{green}0\\\
\\\
\\\
\color{red}y_{11} & \color{red}\cdots & \color{red}y_{1n} & -y_{10} & \color{blue}0 & \color{blue}\cdots & \color{blue}0 & \color{green}-1 & \color{green}\cdots & \color{green}0 & \color{green}0 & \color{green}\cdots & \color{green}0\\\
& \color{red}\vdots &&&& \color{blue}\vdots &&& \color{green}\ddots &&& \color{green}\vdots\\\
\color{red}y_{q_11} & \color{red}\cdots & \color{red}y_{q_1n} & -y_{q_10} & \color{blue}0 & \color{blue}\cdots & \color{blue}0 & \color{green}0 & \color{green}\cdots & \color{green}-1 & \color{green}0 & \color{green}\cdots & \color{green}0\\\
\\\
\\\
\color{red}z_{11} & \color{red}\cdots & \color{red}z_{1n} & -z_{10} & \color{blue}0 & \color{blue}\cdots & \color{blue}0 & \color{green}0 & \color{green}\cdots & \color{green}0 & \color{green}1 & \color{green}\cdots & \color{green}0\\\
& \color{red}\vdots &&&& \color{blue}\vdots &&& \color{green}\vdots &&& \color{green}\ddots\\\
\color{red}z_{q_21} & \color{red}\cdots & \color{red}z_{q_2n} & -z_{q_20} & \color{blue}0 & \color{blue}\cdots & \color{blue}0 & \color{green}0 & \color{green}\cdots & \color{green}0 & \color{green}0 & \color{green}\cdots & \color{green}1\\\
\end{matrix}
\right],\\\
\alpha_{r} = \frac{w_{yr}}{\left(\sum_{i=1}^{q_1}w_{yr}+\sum_{i=1}^{q_2}w_{zr}\right)y_{r0}}~\left( r=1,2,\dots,q_1\right),\\\
\beta_{r} = \frac{w_{zr}}{\left(\sum_{i=1}^{q_1}w_{yr}+\sum_{i=1}^{q_2}w_{zr}\right)z_{r0}}~\left( r=1,2,\dots,q_2\right),
}
$$


约束条件常数项为
$$
b=\left[
1,0,0,\dots,0
\right]^\rm T
$$

