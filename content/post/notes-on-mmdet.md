---
title: "MMDetection目标检测入门笔记"
date: 2023-08-28T11:11:41+08:00
draft: false
author:
tags: ["目标检测","计算机视觉","MMDetection"]
categories: "技巧"
math: false
mermaid: false
ShowToc: true
TocOpen: true
echarts: false
cover:
    image: ""
---

本篇是MMDetection学习应用过程中的踩坑记录，随学习情况更新。

<!--more-->

### 训练报错：`CocoDataset`缺少`update_skip_type_keys`属性

运行条件：

- `pycocotools` version: 2.0.7
- `mmengine` version: 0.8.4

使用`dataset_type = 'CocoDataset'`训练模型，在倒数第15个epoch的时候会报错表示`CocoDataset`缺少`update_skip_type_keys`属性。

一开始以为问题出在`pycocotool`包上，于是安装卸载了好几轮，还尝试了用`mmpycocotools`替换`pycocotools`，但是都不能解决问题。经过调试发现报错发生在`mmengine`包里，即`site-packages/mmdet/engine/hooks/yolox_mode_switch_hook.py`的第50行：

```python
train_loader.dataset.update_skip_type_keys(self.skip_type_keys)
```

神奇的是将这一行直接注释掉之后依然能够正确地将模型训练出来，基本不影响正常的使用。于是就不再去动它了……:sweat_smile:

<center><img src="/images/running-bug.jpg" alt="running-bug" style="zoom:50%;" /></center>

### GPU加速模型训练

#### 核对GPU信息

有独立显卡（GPU）的电脑上可以用GPU来提高模型训练的速度。在使用GPU训练之前需要先安装CUDA。可以用如下代码来查看本机的GPU信息[^1]：

```python
import torch
torch.cuda.is_available()    #cuda是否可用；
torch.cuda.device_count()    #返回gpu数量；
torch.cuda.get_device_name() #返回gpu名字，设备索引默认从0开始；
torch.cuda.current_device()  #返回当前设备索引；
```

在本机上打印出来的结果依次为：

```python
True
1
'NVIDIA GeForce RTX 3060 Laptop GPU'
0
```

#### 启用GPU训练

MMDetection的官方文档里说可以通过`CUDA_VISIBLE_DEVICES=$GPU_ID`来指定选优单一的GPU进行模型训练[^2]，例如

```bash
CUDA_VISIBLE_DEVICES=2 python tools/train.py configs/qdtrack/qdtrack_faster-rcnn_r50_fpn_8xb2-4e_mot17halftrain_test-mot17halfval.py
```



但是上述命令在Windows平台中无法运行，命令行里会提示`'CUDA_VISIBLE_DEVICES' 不是内部或外部命令，也不是可运行的程序
或批处理文件。`在Windows中的workaround有很多种方式，其中我个人比较建议在训练脚本`tools/train.py`里插入：

```python
import os
os.environ["CUDA_VISIBLE_DEVICES"]='0'
```

相比于其他方案（例如添加系统环境变量、在cmd窗口里临时设置变量等等），直接写进训练代码里具有更好的可迁移性，换到另一台电脑上时不需要重新再麻烦地设置一遍（前提是另一台电脑也有独显和CUDA）。

#### 查看GPU占用率

打开任务管理器，把GPU的引擎设置为Cuda，就可以查看模型训练时GPU的占用率。如果发现GPU的占用率很低，但是CPU的占用率接近100%，可能是因为数据传输量过大。可以尝试减小`num_workers`、`img_scale`等参数来解决CPU相对于GPU的瓶颈问题。

<img src="/images/mmdet-gpu-occupation.jpg" alt="mmdet-gpu-occupation" style="zoom:60%;" />



### 不同的损失函数含义

训练模型时，每一个epoch会打印出格式如下的信息：

```bash
08/28 11:12:40 - mmengine - INFO - Epoch(train)  [306][1/1]  base_lr: 4.9967e-04 lr: 4.9967e-04  eta: 0:10:33  time: 0.9054  data_time: 0.3816  memory: 3733  loss: 4.1566  loss_cls: 0.6430  loss_bbox: 2.2906  loss_obj: 1.2230
```

其中涉及到几个不同损失函数，根据网上的资料粗略地区分一下每个函数的特点——

`loss`：损失函数用于衡量预测值与真实值之间的差异。

`loss_cls`：目标检测算法的分类损失，衡量预测边界框的分类正确性。

`loss_bbox`：衡量预测边界框与地面真实对象的“紧密程度”的损失。

`loss_obj`：目标对象的损失函数。



[^1]:[pytorch中查看gpu信息_torch_lsh呵呵的博客-CSDN博客](https://blog.csdn.net/nima1994/article/details/83001910)
[^2]:[Learn to train and test — MMDetection 3.1.0 documentation](https://mmdetection.readthedocs.io/en/latest/user_guides/tracking_train_test.html#train-on-single-gpu)