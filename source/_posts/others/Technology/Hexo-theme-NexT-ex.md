---
title: Hexo 主题 NexT 魔改版备忘录
category:
  - others
  - Computer
unshow: true
categories:
  - others
  - Technology
date: 2022-05-06 14:44:38
updated: 2022-07-31 19:41:13
tags:
---


创造吧，向着未知世界！

<!--more-->

## Front-matter

| 参数 | 描述 | 默认值 |
| :--- | :---- | :---- |
| ``unshow`` | 文章不在主页显示 | false |

## 站点配置文件

/\_config.yml

```yml
# 设置博客单词统计
symbols_count_time:
  # 文章字数统计
  symbols: true
  # 文章阅读时间统计
  time: true
  # 站点总字数统计
  total_symbols: false
  # 站点总阅读时间统计
  total_time: false
  exclude_codeblock: false
```

```yml
# Security 文章加密，需要插件 hexo-blog-encrypt
encrypt: # hexo-blog-encrypt
  #abstract: 有东西被加密了, 请输入密码查看. # 设置文章摘要显示内容
  #message: 您好, 这里需要密码. # 设置密码框提示信息
  #tags: # 设置标签，包含以下标签的文章全部被加密
  #- {name: tagName, password: 密码A}
  #- {name: tagName, password: 密码B}
  theme: shrink
  #wrong_pass_message: 抱歉, 这个密码看着不太对, 请再试试. # 设置错误密码提示
  #wrong_hash_message: 抱歉, 这个文章不能被校验, 不过您还是能看看解密后的内容. # 设置错误哈希提示
```

```yml
# APlayer 音乐播放器
aplayer:
  meting: true # 开启 Meting 功能
```

## 主题配置文件

/themes/next/\_config.yml

```yml
footer:
  # Website running time 在页面脚部显示的本站已安全运行……天……小时……分钟……秒
  running:
    enable: true # 开启功能
    set_up_time: 02/11/2022 13:14:21 # 设置建站时间
```

```yml
# Read more button 主页文章的「阅读更多」按钮
read_more_btn:
  enable: true # If true, the read more button will be displayed in excerpt section. 设置是否加入该按钮
  scroll_to_more: false # 默认为 true ，如果为 true 则点击按钮会滑到文章 #more 标签以下。
```

```yml
# List related posts 相关文章，插件 hexo-next-list-related-posts
related_posts:
  enable: true # 开启功能
  title: # 设置标题，默认为「相关文章」
  display_in_home: false # 决定是否在主页开启此功能
```
