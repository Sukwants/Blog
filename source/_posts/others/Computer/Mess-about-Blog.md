---
title: 博客乱搞
tags:
categories:
  - others
  - Computer
date: 2022-02-11 13:14:21
updated: 2022-12-07 23:04:22
---


创造吧，向着未知世界

<!--more-->

## 依稀记得，来时的路

2022/11/07 首次完全独立编写插件：hexo-content-blocks。

2022/08/05 首次编写插件：hexo-related-posts-bysk。

2022/04/23 首次修改模板文件。

2022/02/14 首次使用 `styles.styl`。

2022/02/11 首次搭建 Hexo + NexT 博客网站。

## Giscus

/themes/next/\_config.yml

在 Comments Settings 部分，追加了

（通过 [giscus 的官方网页](https://giscus.app/zh-CN) 生成以下配置）

```yml
# Giscus (Manually additional)
# See: https://giscus.app/zh-CN
giscus:
  enable: true
  data_repo: Sukwants/Sukwants.github.io
  data_repo_id: R_kgDOG5K_WA
  data_category: Ideas
  data_category_id: DIC_kwDOG5K_WM4CS9Du
  data_mapping: pathname
  data_strict: 0
  data_reactions_enabled: 1
  data_emit_metadata: 0
  data_input_position: top
  data_theme: light
  data_lang: zh-CN
  crossorigin: anonymous
```

/themes/next/layout/\_partials/comments.njk

在第 2 行至第 19 行，加入了

```njk
  {%- if theme.giscus.enable %}
    <div class="comments giscus"></div>
    <script src="https://giscus.app/client.js"
            data-repo="{{ theme.giscus.data_repo }}"
            data-repo-id="{{ theme.giscus.data_repo_id }}"
            data-category="{{ theme.giscus.data_category }}"
            data-category-id="{{ theme.giscus.data_category_id }}"
            data-mapping="{{ theme.giscus.data_mapping }}"
            data-strict="{{ theme.giscus.data_strict }}"
            data-reactions-enabled="{{ theme.giscus.data_reactions_enable }}"
            data-emit-metadata="{{ theme.giscus.data_emit_metadata }}"
            data-input-position="{{ theme.giscus.data_input_position }}"
            data-theme="{{ theme.giscus.data_theme }}"
            data-lang="{{ theme.giscus.data_lang }}"
            crossorigin="{{ theme.giscus.crossorigin }}"
            async>
    </script>
    <style>.giscus{width:initial}</style>
```

将第 20 行（原第 2 行），由

```njk
  {%- if theme.injects.comment.length == 1 %}
```

改为

```njk
  {%- elif theme.injects.comment.length == 1 %}
```

## [hexo-content-blocks](https://github.com/Sukwants/hexo-content-blocks)

一个为 Hexo 设计的插件，可以使用带有样式的内容块，并且支持自定义哦。

2022-11-13 发布 v1.1.1，强制渲染内容块，解决了部分情况下代码错乱的情况。

2022-11-12 发布 v1.1.0，收到友人 [@Eternal](https://lucareternity.github.io/) 的反馈，将图标支持更改为 `<i>` 标签，以适应对旧版本 Font Awesome 的支持。

2022-11-06 发布 v1.0.0，灵感源自 [OI Wiki](https://oi-wiki.org)。

## [hexo-related-posts-bysk](https://github.com/Sukwants/hexo-related-posts-bysk)

一个为 Hexo 设计的插件，用来生成相关文章，作者是 Sukwants。

2022-11-06 发布 v1.2.0，修改了一些细节。

2022-08-10 发布 v1.1.0，增加了指定标签和分类不参与文章相关性计算的功能。如要从 v1.0.0 更新，需修改 `themes/next/layout/_partials/post/post-related.njk` 和 `themes/next/_config.yml`。

2022-08-05 发布 v1.0.0，基于各种 Hexo 相关文章插件并再加修改制作，通过标签和分类生成相关文章，支持设置标题和最大显示数目。

## 单词统计

/\_config.yml

```yml
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

## 文章加密

/\_config.yml

```yml
# Security
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

## 音乐播放器

/\_config.yml

```yml
# Aplayer
aplayer:
  meting: true # 开启 Meting 功能
```

## Footer 字体颜色

/themes/next/\_config.yml

```yml
footer:
  color: "#ffffff"
```

/themes/next/layout/\_layout.njk

在第 36 行，将

```njk
  <footer class="footer">
```

改为了

```njk
  <footer class="footer" style="color: {{ theme.footer.color }}">
```

## 站点运行时间

/themes/next/\_config.yml

```yml
footer:
  # Website running time
  running:
    enable: true # 开启功能
    set_up_time: 02/11/2022 13:14:21 # 设置建站时间
```

/themes/next/languages/zh-CN.yml

```yml
footer:
  safely_running: 本站已经安全运行 # 配置站点运行时间的描述
  days: 天
  hours: 小时
  minutes: 分
  seconds: 秒
```

/themes/next/layout/\_partials/footer.njk

在第 $90$ 行至第 $111$ 行，加入了

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

## 「阅读更多」按钮

/themes/next/\_config.yml

```yml
# Read more button
read_more_btn:
  enable: true # If true, the read more button will be displayed in excerpt section. 设置是否加入该按钮
  scroll_to_more: false # 默认为 true ，如果为 true 则点击按钮会滑到文章 #more 标签以下。
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

## 置顶标签

/themes/next/\_config.yml

```yml
post_meta:
  sticky: # 决定置顶标签是否显示在文章元标签处
    enable: true # 默认为 true
    color: "#7d26cd" # 设置置顶标签的颜色
```

/themes/next/layout/\_macro/post.njk

第 $32$ 行与第 $33$ 行之间、第 $36$ 行与第 $37$ 行之间，删除了 $2$ 处

```njk
{%- if post.sticky > 0 %}
  <span class="post-sticky-flag" title="{{ __('post.sticky') }}">
    <i class="fa fa-thumbtack"></i>
  </span>
{%- endif %}
```

/themes/next/layout/\_partials/post/post-meta.njk

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
