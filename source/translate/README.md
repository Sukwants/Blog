---
title: Google 翻译记忆版使用说明
comments: false
---


[关于 Google 翻译](https://translate.google.com/about/?hl=zh-CN)

2022 年 9 月 28 日起，中国大陆用户访问 Google 翻译会有概率被引导到香港域名；2022 年 10 月 1 日，Google 关闭了其在中国大陆的翻译服务，理由是「使用率过低」。自此，中国大陆地区的 Google 翻译网页版和使用 Google 翻译 API 的软件均不能使用，中国大陆地区迎来了 Google 翻译的谢幕。

<img src="./goodbye.png" alt="再见，Google 翻译">

Google 虽然关闭了在中国大陆地区的翻译服务，但是 Google 翻译 API 依然保留，因此可以借此继续使用应用了 Google 翻译 API 的软件，包括 Chrome 内置翻译功能。我们 ~~考虑~~ 钦定谷歌（上海）提供的 203.208.40.66 和 203.208.41.66 是可以使用的，或者可以通过 IP 测速网站对 translate.google.cn 测速得出可用 IP 地址。然后在系统 HOSTS 文件（Windows 下位于 C:\Windows\System32\drivers\etc\hosts）中加入以下两行

```yml
203.208.40.66    translate.google.com    # 出题人表示这一行可以不写
203.208.40.66    translate.googleapis.com
```

正确性显然。

但是这样我们还有一个 Subtask 没法解决，于是我们打算骗分（/doge）

我们手玩几个点从 Google Translate 上扒下来 Google Translate 的网页源代码，伪造 Google 翻译的页面，打一个表将原文框的内容复制到译文框，这个时候我们只需要打开 Chrome 内置翻译即可利用 Google 翻译进行翻译啦。

这里有一个小小的优化技巧，在中文语言下「中文（简体）」和「英语」选项都在列表末尾，暴力去找比较麻烦，因此给出两种解决方案：

  1. 预选中第一个语言选项，在键盘上按 ↑ 键，即可跳到列表末尾。
  2. 点击语言选择框，输入「中文」或「英语」，即可切换到对应语言，这里要注意如果你之前使用过一次「中文（简体）」，那么输入「中文」会切换到「中文（繁体）」，此时只需要再输入一次「中文」即可切换到「中文（简体）」。

当然这并不是正解，只在考场上作为标算的替代品，所以并不是真正解决了「使用 Google 翻译网页版」这个问题啦。
