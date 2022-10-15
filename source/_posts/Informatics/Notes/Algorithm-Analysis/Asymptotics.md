---
title: 算法分析 - 渐进式
tags:
  - '[I] 算法分析'
categories:
  - Informatics
  - Notes
date: 2022-07-21 17:01:00
---


$\Theta,\mathrm{O},\Omega$ 一场盛宴

<!--more-->

## 概述

渐进记号有 $\Theta$, $\mathrm{O}$, $o$, $\Omega$, $\omega$，各自表达的意思大同小异，共同点就在于「渐进」二字。所谓渐进，就不能用一般的比大小手段，因为根据以上描述，我们是舍弃了增长慢的项和系数的，因此不能以数的手段来比较大小。

## $\Theta$

$\Theta$ 是「渐进紧确界记号」。对于函数 $f(n)$ 和 $g(n)$，有 $f(n)=\Theta(g(n))$，当且仅当 $\exists c_1,c_2,n_0>0,\forall n\geq n_0,0\leq c_1\cdot g(n)\leq f(n)\leq c_2\cdot g(n)$。

之所以要有一个 $n\geq n_0$，是因为此时 $f(n)$ 和 $g(n)$ 均为函数，比较大小还需要考虑系数，如果 $n$ 过小，也有可能产生不满足后面条件的情况。而如果对于一个足够大的 $n$，$f(n)$ 能够被 $c_1\cdot g(n)$ 和 $c_2\cdot g(n)$ 夹在中间（$c_1,c_2$ 为与 $n$ 无关的定值），那么说明随着 $n$ 的增长，$g(n)$ 不会偏离 $f(n)$ 太多，也就是我们之前分析时间复杂度所说的同级的含义，增长速率相同，比值基本一定。

不要试图简单用数的思维去理解 $c_1,c_2$ 以及 $f(n)$ 被夹在中间，可以用函数图像增长的思路去理解，[后面](#小结)我们会去看看 $\Theta,\mathrm{O},\Omega$ 三个记号与 $f(n)$ 增长的关系。

$\Theta$ 记号为我们提供了一个能够限制 $f(n)$ 上下界的条件，也为我们找到了 $f(n)$ 在渐进意义上可以视为相等的一个式子。

p.s. 刚开始接触渐进记号，注意不要搞错，$f(n)$ 是原式，而 $g(n)$ 是渐进式。

## $\mathrm{O}$

$\mathrm{O}$ 是「渐进上界记号」。对于函数 $f(n)$ 和 $g(n)$，有 $f(n)=\mathrm{O}(f(n))$，当且仅当 $\exists c,n_0>0,\forall n\geq n_0,0\leq f(n)\leq c\cdot g(n)$。

用 $c$ 的原因和 $\Theta$ 一样。

如果说 $\Theta$ 提供了原式的上下界，那么这个 $\mathrm{O}$ 就是提供了原式的下界，这可以看作渐进意义上的小于等于，也就是低级或同级。

一般来说，我们计算时间复杂度都是要看极限数据是否能够通过，因此我们用 $\mathrm{O}$ 的时候会比较多。

## $\Omega$

$\Omega$ 是「渐进下界记号」。对于函数 $f(n)$ 和 $g(n)$，有 $f(n)=\mathrm{O}(f(n))$，当且仅当 $\exists c,n_0>0,\forall n\geq n_0,0\leq c\cdot g(n)\leq f(n)$。

同样，这就是渐进意义上的大于等于，也就是高级或同级。

## 小结

$\Theta$ 提供了一个更加准确的渐进式，而 $\mathrm{O}$ 和 $\Omega$ 分别提供了上界和下界。显然，如果有 $f(n)=\Theta(g(n))$，那么一定有 $f(n)=\mathrm{O}(g(n))$, $f(n)=\Omega(g(n))$。反过来，如果有 $f(n)=\mathrm{O}(g(n))$, $f(n)=\Omega(g(n))$，那么夹逼可得 $f(n)=\Theta(g(n))$。这个时候你聪明的大脑袋就要说话了，我以为每个 $f(n)$ 都同时有 $\Theta,\mathrm{O},\Omega$ 的呢，事实上，我们的 $f(n)$ 只是一个函数，不一定能够被解析式表示出来，但此时如果我们能算出渐进上界或者下界，那么就可以有 $\mathrm{O}$ 或者 $\Omega$。

$f(n)=\Theta(g(n))$, $f(n)=\mathrm{O}(g(n))$, $f(n)=\Omega(g(n))$ 三种情况下 $f(n)$ 与 $c\cdot g(n)$ 的增长变化可以看一下下面这张图（来自《算法导论》）。

{% asset_img thetaomicronomega.png '"" "渐进记号增长"' %}

注意，这里函数高低并非由 $c_1,c_2$ 或者 $c$ 的取值决定，更重要的是增长速度，$f(n)=\Theta(g(n))$ 时 $f(n)$ 与 $c\cdot g(n)$ 增长速度相当，$f(n)=\mathrm{O}(g(n))$ 时较慢，$f(n)=\Omega(g(n))$ 时较快。这一点可以通过 $\forall n\geq n_0$ 看出，在 $n_0$ 以后的部分，$f(n)$ 与 $c\cdot g(n)$ 的大小关系不会变化，也就是函数图像不会再产生交叉。

这样的定义 $n\geq n_0$，似乎和极限差不多诶，都是对于足够大的 $n$，始终满足条件。

## $o$

$o$ 是「非渐进紧确上界记号」。对于函数 $f(n)$ 和 $g(n)$，有 $f(n)=\mathrm{O}(f(n))$，当且仅当 $\forall c>0,\exists n_0>0,\forall n\geq n_0,0\leq f(n)< c\cdot g(n)$。

也就是说，$\mathrm{O}$ 表示的是渐进意义上的小于等于，低级或同级，而 $o$ 表示的是渐进意义上的小于，低级。

## $\omega$

$\omega$ 是「非渐进紧确下界记号」。对于函数 $f(n)$ 和 $g(n)$，有 $f(n)=\mathrm{O}(f(n))$，当且仅当 $\forall c>0,\exists n_0>0,\forall n\geq n_0,0\leq c\cdot g(n)< f(n)$。

显然，$\Omega$ 表示的是渐进意义上的大于等于，高级或同级，而 $o$ 表示的是渐进意义上的大于，高级。

## 大结

$\Theta$ 是比较精确的渐进式；$\mathrm{O}$ 和 $o$ 给定了上界，其中一个上界不可取一个上界可取（可以类比闭区间和开区间）；$\Omega$ 和 $\omega$ 给定了下界，其中一个下界不可取一个下界可取。

理解来就是，渐进意义上，将同级的都看成相等的。
$f(n)=\Theta(g(n))$ 就是 $f(n)=g(n)$。
$f(n)=\mathrm{O}(g(n))$ 就是 $f(n)\leq g(n)$ 或者 $f(n)\in[0,g(n)]$。
$f(n)=o(g(n))$ 就是 $f(n)<g(n)$ 或者 $f(n)\in [0,g(n))$。
$f(n)=\Omega(g(n))$ 就是 $f(n)\geq g(n)$ 或者 $f(n)\in[g(n),+\infty)$。
$f(n)=\omega(f(n))$ 就是 $f(n)>g(n)$ 或者 $f(n)\in(g(n),+\infty)$。

{% asset_img 5signsvenn.png '"" "渐进记号 Venn 图"' %}

## 性质

### 传递性

$$
\\begin{align}
& f(n)=\\Theta(g(n))\\land g(n)=\\Theta(h(n))\\Rightarrow f(n)=\\Theta(h(n))\\\\
& f(n)=\\mathrm{O}(g(n))\\land g(n)=\\mathrm{O}(h(n))\\Rightarrow f(n)=\\mathrm{O}(h(n))\\\\
& f(n)=\\Omega(g(n))\\land g(n)=\\Omega(h(n))\\Rightarrow f(n)=\\Omega(h(n))\\\\
& f(n)=o(g(n))\\land g(n)=o(h(n))\\Rightarrow f(n)=o(h(n))\\\\
& f(n)=\\omega(g(n))\\land g(n)=\\omega(h(n))\\Rightarrow f(n)=\\omega(h(n))
\\end{align}
$$

### 自反性

$$
\\begin{align}
f(n)=\\Theta(f(n))\\\\
f(n)=\\mathrm{O}(f(n))\\\\
f(n)=\\Omega(f(n))
\\end{align}
$$

### 对称性

$$
f(n)=\Theta(g(n))\iff g(n)=\Theta(f(n))
$$

### 转置对称性

$$
\\begin{align}
f(n)=\\mathrm{O}(g(n))\\iff g(n)=\\Omega(f(n))\\\\
f(n)=o(g(n))\\iff g(n)=\\omega(f(n))
\\end{align}
$$

## 总结

渐进，一个奇妙的话题，系数天壤之别的多项式，也有可能渐进相等。在 $n$ 足够大的时候，系数的影响微乎其微。

同样，在绝对的实力面前，一切偶然因素不值一提。

那就，奋斗者，正青春。
