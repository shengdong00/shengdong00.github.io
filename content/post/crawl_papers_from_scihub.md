---
title: Sci-Hub + Python爬虫实现文献批量下载
date: 2022-05-18 19:27:46
tags: [Python,爬虫,文献,Sci-Hub]
categories: 技巧
---

<center>

<img src="/images/image-20220518230710288.png" alt="image-20220518230710288" style="zoom:50%;" />

</center>

# 操作思路

* 在Web of Science或者其他学术搜索引擎上查找所需要的文献，然后将全体检索结果的信息导出成Excel（包括作者、标题、出版年份、期刊、DOI号等等）
* 以DOI号为检索条件，到Sci-Hub下载文献，将这一过程写成爬虫进行批量处理
  * 导出DOI号序列，写成循环来逐个爬取
  * 以DOI号检索文献，进入下载页面，查找到保存按钮对应的元素，下载到本地
  * 将下载的PDF文件按照自己的标准重命名
* 手动补全无法在Sci-Hub上得到的文献

<!--more-->

# 注意事项

## 自动下载覆盖率

这个方法不可能自动获得100%的文献，因为：

* Sci-Hub据说对主要出版商的文献覆盖率超过90%，右——这些数据都只是道听途说，总之就是说在批量下载百篇以上文献的时候，肯定会遇到Sci-Hub未收录的情况，实际覆盖率还和学科领域、发表年份、文献语种之类的因素有关（实际操作中发现，Sci-Hub对西班牙语之类的小语种文献覆盖率没有英语文献那么高）
* Web of Science检索结果不一定包含DOI号（抑或PMID号），这些文章自然也就没无法在Sci-Hub上检索

除了上述硬性的限制，一些文献还可能因为其他原因下载失败：

* 网络条件不好，下载时间过长
* 频繁请求导致本机IP被Sci-Hub给ban了

解决思路如下。

## 下载时间过长

打开网页之后，点击`save`按钮就会自动开始下载PDF文件，通常在几秒内就能完成，但偶尔也会遇到下载特别久的情况（比如网卡了）。但是网页端保持打开的时长是确定的，我经过调整设置成了20秒。也就是说，点击`save`按钮20秒之后，不管文件有没有下载完成，下载过程都会中断。只下了一半的文件就会破损。在使用Chrome Driver的时候，在下载文件夹里可能会残留一个后缀为`.crdownload`的临时性文件。

对于这些临时性文件，可以通过检查文件名后缀的方式来辨别——只有后缀为`.pdf`的文件，我们才把它视为下载成功的完整文献，并进入到重命名保存的工作；否则就删除文件并标记为下载失败。

为了减少以上情况出现的概率，需要设置一个足够长的等待时间，具体根据文件大小和网络速度而定。但是也没有必要等得太长，不然也会降低爬虫的运行速度。建议在开始正式运行之前可以先下载两到三个文献尝试一下，然后确定适合的时长。

## IP被Sci-Hub拒绝

因为高频率重复相同的访问和下载请求，Sci-Hub有可能将我判定为机器人（事实上我也确实是一个机器人），并禁止我的IP访问其网站。想到了3个解决办法：

1. 用`sleep()`控制爬虫的暂停时间，适当延长两次访问之间的时间间隔。但是这样做的代价就是牺牲爬虫的工作速度，需要做好二者的权衡。我这里设置成了5秒。

2. 切换访问域名。Sci-Hub本身拥有多个域名，目前有[https://sci-hub.ru](https://sci-hub.ru)、[https://sci-hub.st](https://sci-hub.st)、[https://sci-hub.se](https://sci-hub.se)这三个。在每次访问的时候切换到不同的域名。
3. 如果Ke Xue上网的话，频频被Sci-Hub禁的时候可以换一条线路。（只要我改IP，你就ban不到我）

这个问题也在提醒我们，频繁用爬虫确实会给网站服务器带来过大的负担。我们在用爬虫给自己省力气的同时也还要体谅体谅网站。更何况是Sci-Hub这种在学术出版商的围堵中坚持为爱发电的伟大工程（呜呜呜不说了，给他们捐钱去了）

## 重复运行提高覆盖率

在我的实际操作中，网络条件良好的情况下，第一次全部爬取，得到了60%左右的文献；

第二次针对缺失的文献爬取，将文献覆盖率提高到了80%左右；

第三次爬取之后，覆盖率接近90%，可以确定剩下的文献都是Sci-Hub没有收录的，或者在检索的时DOI号就缺失的。对于这些文献，只能写一段代码输出其DOI号或者文章标题，手动补全。



# 整体代码

A crawler to do mass downloading based on reference table (from Web of Science) and Sci-Hub database.


```python
import pandas as pd
from selenium import webdriver
import time
import os
import random
```

```python
table = pd.read_excel('Full record.xlsx',sheet_name='savedrecs')

dois = table['DOI'].copy(deep=True)
for i in dois.index:
    dois[i] = str(dois[i])
finished = [0 for i in range(len(dois))]

auths = table['Authors'].copy(deep=True)
for i in auths.index:
    name = auths[i].split(';')[0]
    auths[i] = name.split(',')[0]

years = table['Publication Year']
```

```python
def scihub_get(dois, i):
    chromeOptions = webdriver.ChromeOptions()
    prefs = {"download.default_directory" : "D:/Chrome Downloads/Articles"}
    chromeOptions.add_experimental_option("prefs",prefs)
    chrome_driver_path = "D:/Chrome Downloads/chromedriver.exe"
    wd = webdriver.Chrome(executable_path=chrome_driver_path) #, options=chromeOptions)

    scihub = ['https://sci-hub.ru/', 'https://sci-hub.st/', 'https://sci-hub.se/']
    root = scihub[random.randint(0,2)]
    
    # search by doi
    doi = dois[i]
    wd.get(root+doi)
    time.sleep(1)
    
    try:
        b = wd.find_element_by_xpath('//*[@id="buttons"]/button')
        b.click()
        flag = True
        time.sleep(20)
    except:
        print('access failed.    index = '+str(i)+'    doi = '+doi)
        flag = False
        time.sleep(5)
    
    wd.quit()
    return flag
```

```python
def rename_file(dois, finished, auths, years, i):
    time.sleep(1)
    path = 'C:/Users/86158/Downloads/'
    dir_list = os.listdir(path)
    if len(dir_list)>0:
        found = 0
        for file in dir_list:
            if file[0:3]!='No_':
                found = 1
                break

        if found==0: #when didn't get the "save" button
            print('download failed.    index = '+str(i)+'    doi = '+dois[i])
        else: #when we get a new file
            l = file.split('.')
            if l[len(l)-1] != "pdf": #when the file was half downloaded
                print('download incomplete.    index = '+str(i)+'    doi = '+dois[i])
            else:
                old = path+ file
                auth = str(auths[i])
                try:
                    year = str(int(years[i]))
                except:
                    year = str(years[i])
                index = [str(i//100), str((i%100)//10), str(i%10)]
                    
                new = path+ 'No_' +index[0]+index[1]+index[2]+'_' +auth+'_'+year+'.pdf'
                os.rename(old, new)
                finished[i] = 1
```

```python
def article_get(dois, finished, auths, years, i):
    # visit scihub
    if dois[i]=='nan':
        print('doi missing.    index = '+str(i))
    else:
        if scihub_get(dois, i):
            # rename
            rename_file(dois, finished, auths, years, i)
```

```python
for i in range(0,3): #len(dois)):
    article_get(dois, finished, auths, years, i)
```

```python
# try a new round for missing articles
path = 'C:/Users/86158/Downloads/'
dir_list = os.listdir(path)
for i in range(0,len(dois)):
    auth = str(auths[i])
    try:
        year = str(int(years[i]))
    except:
        year = str(years[i])
    index = [str(i//100), str((i%100)//10), str(i%10)]
    filename = 'No_' +index[0]+index[1]+index[2]+'_' +auth+'_'+year+'.pdf'
    
    if filename in dir_list:
        continue
    else:    
        article_get(dois, finished, auths, years, i)
```

```python
# output information of all missing articles
path = 'C:/Users/86158/Downloads/'
dir_list = os.listdir(path)
count = 0
for i in range(0,len(dois)):
    auth = str(auths[i])
    try:
        year = str(int(years[i]))
    except:
        year = str(years[i])
    index = [str(i//100), str((i%100)//10), str(i%10)]
    filename = 'No_' +index[0]+index[1]+index[2]+'_' +auth+'_'+year+'.pdf'
    
    if filename in dir_list:
        continue
    else:    
        print(filename+"    doi: "+dois[i])
        if dois[i]=="nan":
            print("    title: "+table["Article Title"][i])
        count+=1
print(str(count)+" articles missing in total.")
```

60% downloaded after first round. Many failures were caused by webserver block. Our IP address may be identified as a robot or DDoS attacker due to regular, frequent visit to the website.

I used sleep command to lower the visiting frequency, and switched randomly between different sites, as methods to deal with webserver block.

80% downloaded after second round. Those that remained unfinished were mostly not in the database of sci-hub or lacked DOI numbers.

However, when an article is half downloaded, and the webdriver reached time limit and closed, it is possible that we get a broken file. This means that the file is correctly named, hiding in the group. Yet if we try to open the PDF file it won't work. At present I don't know how to do automatic check on these errors. The only solution is longer time period before the webdriver closes, but the whole process will be slower as a sacrifice.x