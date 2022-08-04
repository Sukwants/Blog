---
title: Hexo 主题 NexT 魔改备忘录
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
# List related posts 相关文章，使用插件 hexo-next-list-related-posts
related_posts:
  enable: true # 开启功能
  title: # 设置标题，默认为「相关文章」
  display_in_home: false # 决定是否在主页开启此功能
```

```yml
post_meta:
  sticky: # 决定置顶标签是否显示在文章元标签处
    enable: true # 默认为 true
    color: "#7d26cd" # 设置置顶标签的颜色
```

## 语言包文件

/themes/next/languages/zh-CN.yml

```yml
footer:
  safely_running: 本站已经安全运行 # 配置站点运行时间的描述
  days: 天
  hours: 小时
  minutes: 分
  seconds: 秒
```

## 模板文件

### /themes/next/layout/\_macro/post.njk

在第 $1$ 行，加入了

```njk
{%- if not (is_index and post.unshow == true) %}
```

在第 $155$ 行，加入了

```njk
{%- endif %}
```
第 $32$ 行与第 $33$ 行之间、第 $36$ 行与第 $37$ 行之间，删除了 $2$ 处

```njk
{%- if post.sticky > 0 %}
  <span class="post-sticky-flag" title="{{ __('post.sticky') }}">
    <i class="fa fa-thumbtack"></i>
  </span>
{%- endif %}
```

### /themes/next/layout/\_partials/post/post-meta.njk

在第 $5$ 行至第 $14$ 行，加入了

```njk
{%- if theme.post_meta.sticky.enable and ( post.sticky > 0 ) %}
  <span class="post meta-item">
    <font color="{{ theme.post_meta.sticky.color }}">
      <span class="post-meta-item-icon">
        <i class="fa fa-thumbtack"></i>
      </span>
      <span class="post-meta-item-text">{{ __('post.sticky') }}</span>
    </font>
  </span>
{%- endif %}
```

### /themes/next/layout/\_partials/post/post-related.njk

在第 $1$ 行至第 $9$ 行，将

```njk
{%- if page.related_posts and page.related_posts.length > 0 %}
  <div class="popular-posts-header">{{ theme.related_posts.title or __('post.related_posts') }}</div>
  <ul class="popular-posts">
  {%- for path in page.related_posts %}
    {%- set popular_post = site.posts.findOne({ path: path }) %}
    <li class="popular-posts-item">
      {%- if popular_post.date %}
        <div class="popular-posts-date">{{ date(popular_post.date) }}</div>
      {%- endif %}
      {%- if popular_post.img %}
        <div class="popular-posts-img"><img src="{{ popular_post.img }}" alt="{{ popular_post.title }}"></div>
      {%- endif %}
      <div class="popular-posts-title"><a href="{{ popular_post.path }}" rel="bookmark">{{ popular_post.title }}</a></div>
      {%- if popular_post.excerpt and popular_post.excerpt != '' %}
        <div class="popular-posts-excerpt"><p>{{ popular_post.excerpt }}</p></div>
      {%- endif %}
    </li>
  {%- endfor %}
  </ul>
{%- endif %}
```

替换为了

```njk
{% set related_post =  list_related_posts(post, {maxCount: 10, orderBy: 'date'}) %}
{% if related_post.length > 0 %}
  <div class="popular-posts-header">{{ theme.related_posts.title or __('post.related_posts') }}</div>
  <ul class="related-posts">
  {% for rl_post in related_post %}
      <li class="related-posts-item"><a href="{{ url_for(rl_post.path) }}">{{ rl_post.title }}</a></li>
  {% endfor %}
  </ul>
{% endif %}
```

### /themes/next/layout/\_partials/footer.njk

在第 $92$ 行至第 $113$ 行，加入了

```njk
{%- if theme.footer.running.enable %}
  <div class="running-time">
    <span id="timeDate"></span>
    <span id="times"></span>
    <script>
        var now = new Date();
        function createtime() {
            var grt= new Date("{{ theme.footer.running.set_up_time }}");
            now.setTime(now.getTime()+250);
            days = (now - grt ) / 1000 / 60 / 60 / 24; dnum = Math.floor(days);
            hours = (now - grt ) / 1000 / 60 / 60 - (24 * dnum); hnum = Math.floor(hours);
            if(String(hnum).length ==1 ){hnum = "0" + hnum;} minutes = (now - grt ) / 1000 /60 - (24 * 60 * dnum) - (60 * hnum);
            mnum = Math.floor(minutes); if(String(mnum).length ==1 ){mnum = "0" + mnum;}
            seconds = (now - grt ) / 1000 - (24 * 60 * 60 * dnum) - (60 * 60 * hnum) - (60 * mnum);
            snum = Math.round(seconds); if(String(snum).length ==1 ){snum = "0" + snum;}
            document.getElementById("timeDate").innerHTML = "{{ __('footer.safely_running') }} " + dnum + " {{ __('footer.days') }}";
            document.getElementById("times").innerHTML = hnum + " {{ __('footer.hours') }} " + mnum + " {{ __('footer.minutes') }} " + snum + " {{ __('footer.seconds') }}";
        }
    setInterval("createtime()",250);
    </script>
  </div>
{%- endif %}
```

在第 $62$ 行至第 $68$ 行，将

```njk
{%- if theme.read_more_btn %}
  <div class="post-button">
    <a class="btn" href="{{ url_for(post.path) }}">
      {{ __('post.read_more') }} &raquo;
    </a>
  </div>
{%- endif %}
```

替换为了

```njk
{%- if theme.read_more_btn.enable %}
  <div class="post-button">
    <a class="btn" href="{{ url_for(post.path) }}">
      {{ __('post.read_more') }} &raquo;
    </a>
  </div>
{%- endif %}
```

在第 $73$ 行至第 $79$ 行，将

```njk
{%- if theme.read_more_btn %}
  <div class="post-button">
    <a class="btn" href="{{ url_for(post.path) }}#more" rel="contents">
      {{ __('post.read_more') }} &raquo;
    </a>
  </div>
{%- endif %}
```

替换为了

```njk
{%- if theme.read_more_btn.enable %}
  <div class="post-button">
    <a class="btn" href="{{ url_for(post.path) }}{%- if theme.read_more_btn.scroll_to_more %}#more{%- endif %}" rel="contents">
      {{ __('post.read_more') }} &raquo;
    </a>
  </div>
{%- endif %}
```
