---
title: "快速上手科学工程计算集群"
date: 2025-09-29T20:10:08+08:00
draft: false
author:
tags: [""]
categories: ""
math: false
mermaid: false
ShowToc: true
TocOpen: true
echarts: false
cover:
    image: ""
---





与科学工程计算集群进行交互需要在校园网中，或者开启[西湖大学VPN客户端](https://vpn.westlake.edu.cn/)。

<!--more-->

## 登录集群

```bash
ssh <user name>@172.16.78.132 -p <port>
```

其中端口可选12021, 10002, 10003, 10004。

登录密码采用TOTP动态密码，密码每30秒自动重置，用户通过手机应用FreeOTP查询实时动态密码。

输入`exit`即退出登录节点。

## 数据传输和文件管理

### 在终端中交互

#### 数据传输

用wget/curl下载互联网资源到集群的示例：

```bash
# In any login nodes
wget https://www.gnu.org/graphics/heckert_gnu.transp.small.png -O gnu.png
curl https://www.gnu.org/graphics/heckert_gnu.transp.small.png -o gnu.png
```

用scp将本地文件上传到集群：

```bash
# In user's local computer shell
scp -P <port, usually 12021> file_to_upload <user name>@172.16.78.132:/path/to/save # upload to cluster

# In any login nodes
scp -P <port, usually 22> file_to_download <user name>@<local IP>:/path/to/save # download to user's local computer
```

需要动态密码验证。

#### 文件管理

其他一些常用的Shell命令：

```bash
# 列出目录内容
ls

# 列出目录内容，包括隐藏文件
ls -a

# 创建空文件
touch newfile.txt

# 复制文件
cp file.txt /home/user/Documents

# 删除文件
rm unwantedfile.txt

# 创建目录
mkdir /home/user/new_directory

# 删除空目录
rmdir /home/user/empty_directory

# 显示目录树
tree /home/user/

# 递归删除非空文件夹
rm -r foldername

# 递归强制删除，不接收提示
rm -rf foldername

# 递归强制删除，同时接收提示
rm -rvf foldername
```



### 图形化客户端

本地与集群之间的数据传输，以及集群上的文件管理，可以使用FileZilla图形化客户端进行。

主机：`sftp://172.16.78.132`

连接自动断开的超时时间默认为20秒，可以在设置中自定义。

但传输文件的自动断开时间强制为20秒。超时后需要重新输入动态密码才能再次传输文件。

实际使用中发现传输文件夹时容易反复提示输入动态密码，因此建议先单独传一个小文件来输入动态密码，然后将其余文件或文件夹一次性上传。

**NOTE：由于使用动态账号密码，需要禁止SFTP客户端自动保存密码！**

## Miniconda3管理环境

在home目录下安装Miniconda3

```bash
cd ~
wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh
bash Miniconda3-latest-Linux-x86_64.sh
```

所有选项选yes，会将Miniconda安装到`~/miniconda3/`路径下。

更换镜像源需要修改`~/.condarc`文件，然后执行`conda clean -i`并回复yes。

为了避免每次登录集群都需要`source ~/.bashrc`才能执行conda命令，在`~/.bash_profile`文件中添加：

```bash
echo '. ~/anaconda3/etc/profile.d/conda.sh' >> ~/.bash_profile
```

创建新的Python环境：

```bash
conda create -n py3 python=3.12
conda activate py3
```

其他一些conda的常见使用命令：

```bash
# 在当前conda环境中安装软件包最新版，或指定版本
conda install <soft name>[=<version>]

# 在当前conda环境中删除软件包
conda remove <soft name>

# 列出当前conda环境中已安装的软件包
conda list

# 列出已有的conda环境名称
conda info -e

# 退出当前conda环境，返回上一个conda环境
conda deactivate

# 删除制定的conda环境
conda remove -n <env name> --all

# 当家目录空间不足时，删除历次下载的软件包等缓存，可以极大的节省存储空间
conda clean --all
```



## 提交任务

### 临时调试

```bash
# In any login nodes
srun --pty bash
```

系统会分配计算资源，自动跳转登录到分配的computing node中，可以临时进行交互计算任务。默认资源参数：intel-sc3分区、1个CPU、2.5G总内存、无GPU，无时间限制。

用户执行`exit`即退出登录的computing节点，回到login节点，系统将自动释放分配的计算资源。

用户直接断开连接（网络中断、直接关闭终端窗口等）可能导致srun任务继续在后台运行，用`stat_job`命令查看任务状态。

### 后台提交

#### Slurm作业脚本

脚本示例（`my_job.sh`）：

```sh
#!/usr/bin/env bash

#SBATCH -J job_name            # Job name
#SBATCH -p amd-ep2,intel-sc3   # Select partition
#SBATCH -q normal              # Select QOS
#SBATCH -c 32                  # Set CPU number
#SBATCH --mem=32G              # Default is 2.5G memory per CPU core. This parameter changes the value from 20G to 64G

source ~/.bashrc
conda activate py3
cd <file path>
python main.py
```

常用Slurm参数：

| 参数    | 说明                                                         |
| ------- | ------------------------------------------------------------ |
| `-c`    | 申请CPU核心数量，默认为1，不能单个节点的核心上限             |
| `--mem` | 申请的总内存大小，默认为每个CPU核心2.5G                      |
| `-p`    | 指定computing节点分区，可以使用逗号指定多个分区              |
| `-q`    | 指定QOS                                                      |
| `-o`    | 自定义任务标准输出（日志）文件                               |
| `-e`    | 自定义任务标准错误输出（错误日志）文件                       |
| `-a`    | 例如`-a 1-100`的参数会提交一组共100个相同的任务，每个子任务中的环境变量`${SLURM_ARRAY_TASK_ID}`则分别为1-100的单独数字 *(?)* |



#### 提交和查看作业

提交脚本：

```bash
sbatch my_job.sh
```

脚本提交后，任务即进入排队阶段，当有符合条件的系统资源时，任务将自动开始执行。任务执行的标准输出结果（一般为运行日志）将输出到**脚本提交路径**下的`slurm-<job id>.out`文件中

查询本用户正在排队/运行的任务：

```bash
# In any login nodes
stat_job
```

| 任务状态 | 含义     |
| -------- | -------- |
| PD       | 排队中   |
| R        | 运行中   |
| S        | 暂停中   |
| CG       | 即将完成 |

修改排队中的任务的参数：

```bash
# In any login nodes

# 修改任务分区
scontrol update jobid=<job id> partition=<partition name>

# 修改任务QOS
scontrol update jobid=<job id> qos=<QOS>

# 修改任务CPU核心数，等同srun/sbatch参数-c
scontrol update jobid=<job id> CPUsPerTask=<CPU number>
```

取消并删除任务：

```bash
# In any login nodes
scancel <job id>
```

查询分区资源和状态：

```bash
# In any login nodes
stat_partition
```

部分计算节点分区的说明：

| 分区名称            | computing节点规格                                            |
| :------------------ | :----------------------------------------------------------- |
| amd-ep2             | 64核 amd CPU, 480G内存, QOS: normal/huge, 配有SSD缓存/data   |
| amdepyc             | 64核 amd CPU, 480G内存, QOS: normal/huge                     |
| amd-ep2-short       | 64核 amd CPU, 480G内存, QOS: normal/huge, 使用时间上限为1天  |
| intel-sc3(默认分区) | 64核 amd CPU, 480G内存, QOS: normal/huge, 配有SSD缓存/data   |
| intel-sc3-32c       | 64核 amd CPU, 480G内存, QOS: normal/huge, 任务必须使用32整倍数的CPU核心 |

部分Quality of Service (QOS)的说明：

| QOS    | 优先级 | 说明                                                         |
| ------ | ------ | ------------------------------------------------------------ |
| normal | 高     | 总任务提交数<=1000，总任务同时运行数<=30，总任务同时使用CPU核心<=200 |
| huge   | 低     | 总任务提交数<=20000，总任务同时使用CPU核心<=1600             |

