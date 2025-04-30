---
title: "Python多线程和多进程的运行速度比较"
date: 2022-12-16T14:11:55+08:00
draft: false
tags: ["Python","多线程","多进程"]
categories: "探索"
math: false
mermaid: false
ShowToc: false
---


通过一个图像合成视频的脚本案例测试了一下Python3在单线程、多线程和多进程下的运行速度。发现多线程可以一定程度上提高运行速度（将1个线程拆为4个线程，提速大约83%），但是不能达到完全的并行运算，据说是因为`threading`模块并不能真正调用多个处理器。在多进程下运行，可以接近完全平行的运算速度。

<!--more-->

## 例程概述

在相对路径`./image_storage/`里有四个文件夹，分别是`./image_storage/1/`, `./image_storage/2/`, `./image_storage/3/`, `./image_storage/4/`。每个文件夹中有300张`.bmp`图片文件，单个图片的文件大小为14.3MB，尺寸为2448×2048。需要将这四个文件夹中的图片分别合成成四个`.mp4`视频。此外，由于图片文件中记录了其拍摄时刻，所以还会据此来计算视频的帧率。

合成视频的函数：

```python
def generate_mp4(path, image_list):
    print('Generating video... '+path)
    image_list.sort() # 按时间排序（即按文件名排序）
    t_steps = [] # 计算帧率，具体命名格式不重要
    for i in range(len(image_list)-1):
        im0_stamp = image_list[i][:-4]
        t0 = int(im0_stamp.split('_')[-1])/1e6 + int(im0_stamp.split('_')[-2]) + int(im0_stamp.split('_')[-3])*60 + int(im0_stamp.split('_')[-4])*60*60
        im1_stamp = image_list[i+1][:-4]
        t1 = int(im1_stamp.split('_')[-1])/1e6 + int(im1_stamp.split('_')[-2]) + int(im1_stamp.split('_')[-3])*60 + int(im1_stamp.split('_')[-4])*60*60
        t_steps.append(t1-t0)
    frame_rate = 1/np.mean(t_steps) # 根据相邻帧平均时差得帧率
    
    size = (2448, 2048) #(width, height)
    four_cc = cv2.VideoWriter_fourcc(*'mp4v')

    cam_id = ...
    video_name = cam_id+image_list[0][-31:-4]+'-'+image_list[-1][-19:-4]
    videowriter = cv2.VideoWriter('./saved_video/'+video_name+'.mp4', four_cc, frame_rate, size)

    for im in image_list:
        img = cv2.imread(path+im)
        videowriter.write(img)
    videowriter.release()
    cv2.destroyAllWindows()
```



## 测试与结果

### 线性程序

先测一下单线情况下的运行时长，依次将四个文件夹里的图片合成为视频。

```python
paths = ['./image_storage/4/', './image_storage/2/', './image_storage/3/', './image_storage/4/']
start = time.time()
for p in paths:
    raw_list = os.listdir(p)
    im_list = [i for i in raw_list if i[-4:]=='.bmp']
    generate_mp4(p, im_list)
end = time.time()
print(str(end-start))
```

Output:

```
Generating video... ./image_storage/1/
Generating video... ./image_storage/2/
Generating video... ./image_storage/3/
Generating video... ./image_storage/4/
74.97052454948425
```

分别单独运行的结果：

```bash
Generating video... ./image_storage/1/
19.02564239501953
```

```bash
Generating video... ./image_storage/2/
19.450006008148193
```

```bash
Generating video... ./image_storage/3/
16.513428211212158
```

```bash
Generating video... ./image_storage/4/
19.51286506652832
```

一共用时大约75秒，四个任务的耗时基本上是相似的。

### 多线程

用`threading`模块实现多线程处理，

```python
threads = []
paths = ['./image_storage/4/', './image_storage/2/', './image_storage/3/', './image_storage/4/']
start = time.time()
for p in paths:
    raw_list = os.listdir(p)
    im_list = [i for i in raw_list if i[-4:]=='.bmp']
    thread = threading.Thread(name=p, target=generate_mp4, args=(p, im_list), daemon=False) # 创建线程
    threads.append(thread)

for th in threads:
    th.start() # 开始线程

while(True): # 监测线程数量，≤1表示除主线程外都已完成
    c = threading.active_count()
    if c<=1:
        break
end = time.time()
print(str(end-start))
```

Output:

```bash
Generating video... ./image_storage/1/
Generating video... ./image_storage/2/
Generating video... ./image_storage/3/
Generating video... ./image_storage/4/
40.90414476394653
```

一共用时大约41秒，比线性的耗时少了45%，速度明显提高，但是并没有达到完全并行的效果。



## 多进程

用`multiprocessing`模块实现多进程处理，

```python
if __name__=='__main__':
    processes = []
    paths = ['./image_storage/4/', './image_storage/2/', './image_storage/3/', './image_storage/4/']
    start = time.time()
    for p in paths:
        raw_list = os.listdir(p)
        im_list = [i for i in raw_list if i[-4:]=='.bmp']
        process = multiprocessing.Process(name=p, target=generate_mp4, args=(p, im_list), daemon=False) # 创建进程
        processes.append(process)

    for pr in processes:
        pr.start() # 开始进程

    while(True): # 监测子进程数量
        c = len(multiprocessing.active_children())
        if c<=0:
            break
    end = time.time()
    print(str(end-start))
```

Output:

```bash
Generating video... ./image_storage/4/
Generating video... ./image_storage/2/
Generating video... ./image_storage/3/
Generating video... ./image_storage/4/
22.97856903076172
```

用时大约23秒，比较接近线性运行用时的四分之一了。

> 注意：[^1]
>
> - 在Windows中，由于没有fork(Linux中创建进程的机制)，在创建进程的时候会import启动该文件，而在import文件的时候又会再次运行整个文件，如果把``Process()``放在`` if __name__ == '__main__'``判断之外，则``Process()``在被import的时候也会被运行，导致无限递归创建子进程导致报错，所以在Windows系统下，必须把``Process()``放在 ``if __name__ == '__main__'`` 的判断保护之下。
> - 在子进程中不能使用input，因为输入台只显示在主进程中，故如果在子进程中使用input，会导致报错。


[^1]: [Python编程之多进程(multiprocessing)详解 - LoveFishO - 博客园 (cnblogs.com)](https://www.cnblogs.com/lovefisho/p/16202006.html)
