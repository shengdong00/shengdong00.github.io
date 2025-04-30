---
title: "自定义计算MMDetection目标检测模型的precision, recall, F1, AP, AR"
date: 2024-05-17T23:29:36+08:00
draft: false
author:
tags: ["MMDetection","目标检测"]
categories: "技巧"
math: false
mermaid: false
ShowToc: false
TocOpen: true
echarts: false
cover:
    image: ""
---

使用自定义的类别和数据集训练了MMDetection的目标检测模型，需要汇报模型的precision, recall等等各项指标。在MMDetection的[官网文档](https://mmdetection.readthedocs.io/en/latest/user_guides/index.html)里只找到了生成混淆矩阵的代码，但似乎并不支持直接给出其他常见的评价指标（见Github项目的[issue#6212](https://github.com/open-mmlab/mmdetection/issues/6212)和[issue#8791](https://github.com/open-mmlab/mmdetection/discussions/8791)。搜索一番后发现[CSDN博客](https://blog.csdn.net/xiao_9626/article/details/136810538)上有人分享了如何通过在`tools/analysis_tools/confusion_matrix.py`的`main()`函数末尾添加代码，从而得到precision, recall, F1, AP, AR。然而实际运行后发现其实有bug，并且原理上也有一些问题，所以进行了适当修改。

总体思路是，先从混淆矩阵中计算出每个分类的真阳性样本量`FP`、假阳性样本量`TP`、假阴性样本量`FN`，然后按照公式计算各分类标签的precision和recall。

需要注意的是，`precision`和`recall`的长度其实比分类数量多1。这是因为前面生成confusion matrix的时候，在已有分类的后边还加了一个“background”的标签。`precision`和`recall`的最后一位其实就是“background”的精确率和召回率，并且总是为零。从混淆矩阵里面也可以看出，background的真阳性比例一定是0%。在计算平均precision和recall的时候，我们不需要考虑这一个额外的分类。

<center><figure>
<img src="https://user-images.githubusercontent.com/12907710/140513068-994cdbf4-3a4a-48f0-8fd8-2830d93fd963.png" alt="normalized confusion matrix, from MMDetection documents"  />
<figcaption>MMDetection官方文档里的normalized confusion matrix，"background"分类的真阳性比例一定是0%</figcaption>
</figure></center>

需要在`main()`函数末尾添加的代码为：

```python
TP = np.diag(confusion_matrix)
FP = np.sum(confusion_matrix, axis=0) - TP
FN = np.sum(confusion_matrix, axis=1) - TP

precision = TP / (TP + FP)
recall = TP / (TP + FN)
average_precision = np.mean(precision[:-1])
average_recall = np.mean(recall[:-1])
f1 = 2* (average_precision * average_recall) / (average_precision + average_recall)

print('\n===Averaging all classes===')
print('AP:', average_precision)
print('AR:', average_recall)
print('F1:', f1)
print('Classes', dataset.metainfo['classes'] + ('background', ))
print('Precision', precision)
print('Recall', recall)
```

然后按照官方文档的说明，正常运行代码就可以输出结果了。

```
python tools/analysis_tools/confusion_matrix.py ${CONFIG}  ${DETECTION_RESULTS}  ${SAVE_DIR} --show
```

打印内容形如：

```
loading annotations into memory...
Done (t=0.02s)
creating index...
index created!
[>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>] 14/14, 62.8 task/s, elapsed: 0s, ETA:     0s
===Averaging all classes===
AP: 0.95018367938121
AR: 0.664406462586606
F1: 0.7820042508816204
Classes ('label1', 'label2', 'label3', 'label4', 'background')
Precision [0.92405063 0.97506925 0.96411483 0.9375     0.        ]
Recall [0.65765766 0.80182232 0.79019608 0.40794979 0.        ]
```