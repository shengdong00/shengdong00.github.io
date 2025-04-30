---
title: "自回归滑动平均模型预测全球CO2浓度变化"
date: 2022-04-27 03:03:57
tags: [环境科学,数据分析,系统科学,气候变化,时间序列分析,MATLAB]
categories: 探索
---

自回归滑动平均模型（Autoregressive moving average model，ARMA）是研究时间序列的重要方法，以由自回归模型（简称AR模型）与移动平均模型（简称MA模型）为基础“混合”构成。用AMRA模型预测了在当前趋势下，未来二十年内全球二氧化碳浓度的变化趋势。

<img src="/images/image-20220427030941064.png" alt="image-20220427030941064" style="zoom: 33%;" />

# 分析过程

数据集：NOAA Earth System Research Laboratories下属的Global Monitoring Laboratory提供的1969年-2022年逐月的二氧化碳浓度变化数据

[数据来源网址](https://gml.noaa.gov/dv/iadv/graph.php?code=MLO&program=ccgg&type=ts)

<!--more-->

<img src="/images/image-20220427030844684.png" alt="image-20220427030844684" style="zoom:50%;" />

用ARMA模型进行分析，估计出模型参数，并预测未来10年内的二氧化碳浓度变化。由于前7年数据有缺失，从1976年开始才有逐月连续的数据，所以时间序列上从1976年开始。

对数据取一阶差分，通过ADF检验和KPSS检验，认为数据平稳。

<img src="/images/image-20220427030901855.png" alt="image-20220427030901855" style="zoom: 50%;" />

<img src="/images/image-20220427030907352.png" alt="image-20220427030907352" style="zoom: 50%;" />

根据自相关函数ACF和偏自相关函数PACF，估计模型参数为$(p,q)=(10,16)$。

> 这里实际上并没有做到最后一个超出阈值的nLag，但是在二阶差分的条件下不管取多大的nLag都没法保证autoclrrelation小于阈值。随着差分阶数增大，ACF收敛得越来越快，但是PACF收敛得越来越慢，两者也没有办法兼顾。

<img src="/images/image-20220427030916373.png" alt="image-20220427030916373" style="zoom: 50%;" />

<img src="/images/image-20220427030923870.png" alt="image-20220427030923870" style="zoom: 50%;" />

对未来20年的二氧化碳浓度数据进行预测。

<img src="/images/image-20220427030941064.png" alt="image-20220427030941064" style="zoom:67%;" />

# MATLAB脚本

```matlab
Data = xlsread('历年CO2数据.xlsx'); % 读入数据

Y0 = Data(25:length(Data),3); % 前7年数据有缺失，从976年开始逐月连续。前两列是年-月，第三列数据是CO2浓度
figure(1)
plot(Y0); xlim([0,527]);
ylabel('CO_2浓度 μmol·mol^{-1}'); xlabel('时间序列'); title('CO_2浓度原始数据');

n = 2; % 差分阶数
Y = Y0;
for i = 1:n
	Y = diff(Y);
end

y_h_adf = adftest(Y) % ADF检验
y_h_kpss = kpsstest(Y) % KPSS检验

figure(2)
plot(Y); xlim([0,527]);
ylabel('CO_2浓度差分 μmol·mol^{-1}'); xlabel('时间序列'); title('CO_2浓度差分数
据');

figure(3)
autocorr(Y,10);
figure(4)
parcorr(Y,16);

Mdl = arima(10, 2, 16); % p, n, q
EstMdl = estimate(Mdl,Y0);

step = 12*20; %预测范围为20年
[forData,YMSE] = forecast(EstMdl,step,'Y0',Y0);
lower = forData - 1.96*sqrt(YMSE); %95置信区间下限
upper = forData + 1.96*sqrt(YMSE); %95置信区间上限

figure(5)
h0 = plot(Y0); hold on;
h1 = plot(length(Y0):length(Y0)+step,[Y0(end);lower],'r:');
plot(length(Y0):length(Y0)+step,[Y0(end);upper],'r:');
h2 = plot(length(Y0):length(Y0)+step,[Y0(end);forData]);
legend([h0, h1 h2],'历史数据','95% 置信区间','预测值',...'Location','NorthWest')
title('CO_2浓度变化预测'); ylabel('CO_2浓度差分 μmol·mol^{-1}'); xlabel('时间序
列');
hold off;
```

# 参考资料

[使用ARMA做时间序列预测全流程（附MATLAB代码，ARIMA法） - 知乎 (zhihu.com)](https://zhuanlan.zhihu.com/p/69630638)