---
title: 算法分析 - 主定理
tags:
  - '算法分析'
  - '分治法'
categories:
  - Informatics
  - Notes
date: 2022-07-21 18:41:25
---


干就完了

<!--more-->

## 介绍

主定理（Master Theorem）通过 $T(n)$ 的递推式来计算 $T(n)$，但不是哈戳戳地去展开一个一个计算，有技巧的。

主定理要求的递推关系式为

$$
T(n)=aT(\\frac{n}{b})+f(n),\\qquad T(1)=\\Theta(1)
$$

表示当前状态下问题规模为 $n$，分成 $a$ 个等效的规模为 $\frac{n}{b}$ 的子问题计算，合并答案需要的时间为 $f(n)$。

那么

$$
\\begin{align}
& T(n) = \\begin{cases}\\Theta(n^{\\log_b a}) & f(n) = \\mathrm{O}(n^{\\log_b a-\\epsilon})\\\\
\\Theta(n^{\\log_b a}\\log^{k+1} n) & f(n)=\\Theta(n^{\\log_b a}\\log^k n),k\\ge 0\\\\
\\Theta(f(n)) & f(n) = \\Omega(n^{\\log_b a+\\epsilon})\\land p\\end{cases}\\\\
& p:\\exists 0<c<1,n_0>0,\\forall n\\geq n_0,af(\\frac{n}{b})\\leq cf(n)
\\end{align}
$$

条件 $p$ 的含义是，对于某个常数 $c<0$ 和所有足够大的 $n$ 有 $af(\frac{n}{b})\leq cf(n)$。

$\epsilon>0$ 是一个常数。

## 证明

以下是主定理的证明，看一看能加深理解，不看也没关系~~（主定理不学都没关系）~~，可以直接去[下面](#理解)理解的部分。网上的证明可能由于 Sukwants 太蒻了，单拎着一篇看一定会如听天书。

古人有言：欲证明 Master，先画一棵递归树。

{% asset_img master-theorem-proof.svg '"" "主定理递归树"' %}

由于我们每次递归，将规模为 $n$ 的问题分为 $a$ 个规模为 $\frac{n}{b}$ 的子问题，因此每一个非叶结点都会有 $a$ 个子结点。

而 $n$ 规模在 $\log_bn$ 次分割过后就会归于 $1$，因此整棵递归树的深度为 $h=\log_bn$。

所以这棵递归树的叶结点有 $a^{\log_bn}$ 个，诶，跟图上的不一样？别慌，$a^{\log_bn}=(b^{\log_ba})^{\log_bn}=(b^{\log_bn})^{\log_ba}=n^{\log_ba}$，之所以这么变是因为之后要用。

右边一列 $\text{Cost}$ 表示每一层的结点合并答案所用时 $f(n)$ 的总和。显然，从第 $0$ 层到第 $\log_bn-1$ 层，第 $i$ 层就是 $a^if(\frac{n}{b^i})$。最后一层，因为 $T(1)=\Theta(1)$，所以耗时为叶结点个数，$\Theta(n^{\log_ba})$。因此总用时即为 $T(n)=\Theta(n^{\log_ba})+\sum\limits_{i=0}^{\log_bn-1}a^if(\frac{n}{b^i})$。

我们记 $g(n)=\sum\limits_{i=0}^{\log_bn-1}a^if(\frac{n}{b^i})$，那么 $T(n)=\Theta(n^{\log_ba})+g(n)$。

### $1^{\circ}\ f(n)=\mathrm{O}(n^{\log_b a-\epsilon})\Rightarrow T(n)=\Theta(n^{\log_b a})$

干就完了！

$$
\\begin{align}
g(n)&=\\sum_{i=0}^{\\log_bn-1}a^if\\left(\\frac{n}{b^i}\\right)\\\\
&=\\mathrm{O}\\left(\\sum_{i=0}^{\\log_bn-1}a^i\\left(\\frac{n}{b^i}\\right)^{\\log_ba-\\epsilon}\\right)\\\\
&=\\mathrm{O}\\left(\\sum_{i=0}^{\\log_bn-1}a^i\\frac{n^{\\log_ba-\\epsilon}}{\\left(b^i\\right)^{\\log_ba-\\epsilon}}\\right)\\\\
&=\\mathrm{O}\\left(n^{\\log_ba-\\epsilon}\\sum_{i=0}^{\\log_bn-1}\\frac{a^i}{\\left(b^i\\right)^{\\log_ba-\\epsilon}}\\right)\\\\
&=\\mathrm{O}\\left(n^{\\log_ba-\\epsilon}\\sum_{i=0}^{\\log_bn-1}\\frac{a^i}{\\left(b^{\\log_ba-\\epsilon}\\right)^i}\\right)\\\\
&=\\mathrm{O}\\left(n^{\\log_ba-\\epsilon}\\sum_{i=0}^{\\log_bn-1}\\frac{a^i}{\\left(\\frac{a}{b^\\epsilon}\\right)^i}\\right)\\\\
&=\\mathrm{O}\\left(n^{\\log_ba-\\epsilon}\\sum_{i=0}^{\\log_bn-1}\\left(b^\\epsilon\\right)^i\\right)
\\end{align}
$$

而 $\sum\limits_{i=0}^{\log_bn-1}\left(b^\epsilon\right)^i$ 可以用等比数列求和的方法搞一通，不知你忘记了没有。

设 $S=\sum\limits_{i=0}^{\log_bn-1}\left(b^\epsilon\right)^i$，则 $b^\epsilon S=\sum\limits_{i=1}^{\log_bn}\left(b^\epsilon\right)^i$，那么 $(b^\epsilon-1)S=\left(b^\epsilon\right)^{\log_bn}-\left(b^\epsilon\right)^0=n^\epsilon-1$，于是 $S=\frac{n^\epsilon-1}{b^\epsilon-1}$。

那么继续

$$
\\begin{align}g(n)&=\\mathrm{O}\\left(n^{\\log_ba-\\epsilon}\\sum_{i=0}^{\\log_bn-1}\\left(b^\\epsilon\\right)^i\\right)\\\\&=\\mathrm{O}\\left(n^{\\log_ba-\\epsilon}\\frac{n^\\epsilon-1}{b^\\epsilon-1}\\right)\\\\\\end{align}
$$

我们一筹莫展了，这里回顾一下 $b,\epsilon$ 的定义~~（做到不忘初心牢记使命）~~，它们是常数，而这里又用上了渐进符号 $\mathrm{O}$，所以……

$$
\\begin{align}g(n)&=\\mathrm{O}\\left(n^{\\log_ba-\\epsilon}\\frac{n^\\epsilon-1}{b^\\epsilon-1}\\right)\\\\&=\\mathrm{O}(n^{\\log_ba-\\epsilon}n^\\epsilon)\\\\&=\\mathrm{O}(n^{\\log_ba})\\\\\\end{align}
$$

那么 $T(n)=\Theta(n^{\log_ba})+g(n)=\Theta(n^{\log_ba})+\mathrm{O}(n^{\log_ba})=\Theta(n^{\log_ba})$。这很明显，因为 $\Theta$ 表示「$=$」而 $\mathrm{O}$ 表示「$\leq$」。

以上，证得当 $f(n)=\mathrm{O}(n^{\log_b a-\epsilon})$ 时有 $T(n)=\Theta(n^{\log_b a})$。

### $2^{\circ}\ f(n)=\Theta(n^{\log_ba}\log^kn),k\geq 0\Rightarrow T(n)=\Theta(n^{\log_ba}\log^{k+1}n)$

这里我表示和上面一样的套路——干就完了！

$$
\\begin{align}
g(n)&=\\sum_{i=0}^{\\log_bn-1}a^if\\left(\\frac{n}{b^i}\\right)\\\\
&=\\Theta\\left(\\sum_{i=0}^{\\log_bn-1}a^i\\left(\\frac{n}{b^i}\\right)^{\\log_ba}\\log^k\\frac{n}{b^i}\\right)\\\\
&=\\Theta\\left(\\sum_{i=0}^{\\log_bn-1}\\frac{a^in^{\\log_ba}}{\\left(b^i\\right)^{\\log_ba}}\\log^k\\frac{n}{b^i}\\right)\\\\
&=\\Theta\\left(\\sum_{i=0}^{\\log_bn-1}n^{\\log_ba}\\log^k\\frac{n}{b^i}\\right)\\\\
&=\\Theta\\left(n^{\\log_ba}\\sum_{i=0}^{\\log_bn-1}\\log^k\\frac{n}{b^i}\\right)\\\\
&=\\Theta\\left(n^{\\log_ba}\\sum_{i=0}^{\\log_bn-1}\\left(\\log n-\\log b^i\\right)^k\\right)
\\end{align}
$$

而接下来又需要践行初心使命。

记 $h(n)=\left(\log n-\log b^i\right)^k=\sum_{j=0}^{k}\binom{k}{j}\left(\log n\right)^j\left(-\log b^i\right)^{k+1-j}$，因为 $i\leq\log_bn-1$，因此 $b^i<b^{\log_bn}=n$，进而得到 $\log b^i<\log n$，所以 $h(n)$ 的展开式中最高次即为 $\log^kn$。

既然我们这里是渐进意义，那么何不只留下最高次呢？

那么

$$
g(n)=\\Theta\\left(n^{\\log_ba}\\log_bn\\log^kn\\right)
$$

注意，我们现在先解释一个奇妙的变换。

$$
\\Theta \\left(\\log_bn\\right)=\\Theta \\left(\\frac{\\log n}{\\log b}\\right)=\\Theta \\left(\\log n\\right)
$$

（额，$\log b$ 是常数诶，当然可以这么干）

于是

$$
\\begin{align}g(n)
&=\\Theta\\left(n^{\\log_ba}\\log_bn\\log^kn\\right)\\\\
&=\\Theta\\left(n^{\\log_ba}\\log n\\log^kn\\right)\\\\&=\\Theta\\left(n^{\\log_ba}\\log^{k+1}n\\right)
\\end{align}
$$

最终 $T(n)=\Theta(n^{\log_ba})+g(n)=\Theta(n^{\log_ba})+\Theta(n^{\log_ba}\log^{k+1}n)=\Theta(n^{\log_ba}\log^{k+1}n)$。

以上，证得当 $f(n)=\Theta(n^{\log_ba}\log^kn),k\geq 0$ 时有 $T(n)=\Theta(n^{\log_ba}\log^{k+1}n)$。

这第二种情况大多数时候是一种特殊情况，就是 $k=0$ 的时候，那么此时就成为了 $f(n)=\Theta(n^{\log_ba}),k\geq 0\Rightarrow T(n)=\Theta(n^{\log_ba}\log n)$。

### $3^{\circ}\ f(n)=\Omega(n^{\log_ba+\epsilon})\land p\Rightarrow T(n)=\Theta(f(n))$

$p:\exists 0<c<1,n_0>0,\forall n\geq n_0,af(\frac{n}{b})\leq cf(n)$

这个情况有些特殊，虽然大部分是干，但是还是有巧劲的。

首先，根据 $g(n)$ 的定义 $g(n)=\sum\limits_{i=0}^{\log_bn-1}a^if(\frac{n}{b^i})$，很明显

$$
g(n)=\Omega(f(n))
$$

然后，我们从条件 $p:\exists 0<c<1,n_0>0,\forall n\geq n_0,af(\frac{n}{b})\leq cf(n)$ 入手。

$$
a^if\left(\frac{n}{b^i}\right)\leq c\cdot a^{i-1}f\left(\frac{n}{b^{i-1}}\right)\leq c^2\cdot a^{i-2}f\left(\frac{n}{b^{i-2}}\right)\leq ...\leq c^if\left(n\right)
$$

其实，也可以理解为，$f(n)$ 表示递归树的第 $0$ 层的合并用时，$af\left(\frac{n}{b}\right)$ 表示下一层的合并用时。递归 $i$ 层，第 $i$ 层的合并用时即为 $a^if\left(\frac{n}{b^i}\right)$，那么就有 $a^if\left(\frac{n}{b^i}\right)\leq c^if\left(n\right)$。

这样的话

$$
\\begin{align}
g(n)&=\\sum\\limits_{i=0}^{\\log_bn-1}a^if(\\frac{n}{b^i})\\\\
&\\leq \\sum\\limits_{i=0}^{\\log_bn-1}c^if(n)\\\\
&\\leq \\sum\\limits_{i=0}^{+\\infty}c^if(n)
\\end{align}
$$

大概是为了更方便证明。

自然

$$
\\sum\\limits_{i=0}^{+\\infty}c^if(n)=\\left(\\sum\\limits_{i=0}^{+\\infty}c^i\\right)f(n)=\\frac{1}{1-c}f(n)
$$

根据定义

$$
g(n)=\mathrm{O}(f(n))
$$

因为 $g(n)=\mathrm{O}(f(n))\land g(n)=\Omega(f(n))$，两侧夹逼，得到 $g(n)=\Theta(f(n))$。

以上，证得在满足条件 $p:\exists 0<c<1,n_0>0,\forall n\geq n_0,af(\frac{n}{b})\leq cf(n)$ 的前提下，当 $f(n)=\Omega(n^{\log_ba+\epsilon})$ 时有 $T(n)=\Theta(f(n))$。

#### 综上所述

$$
T(n) = \\begin{cases}\\Theta(n^{\\log_b a}) & f(n) = \\mathrm{O}(n^{\\log_b a-\\epsilon})\\\\
\\Theta(n^{\\log_b a}\\log^{k+1} n) & f(n)=\\Theta(n^{\\log_b a}\\log^k n),k\\ge 0\\\\
\\Theta(f(n)) & f(n) = \\Omega(n^{\\log_b a+\\epsilon})\\land p\\end{cases}\\\\
$$

$$
p:\\exists 0<c<1,n_0>0,\\forall n\\geq n_0,af(\\frac{n}{b})\\leq cf(n)
$$

## 理解

这 3 种情况，其实就是 $T(n)=\Theta(n^{\log_ba})+\sum\limits_{i=0}^{\log_bn-1}a^if(\frac{n}{b^i})$ 中两部分，哪部分更大的问题。

对于第 1 种情况，因为 $f(n)=\mathrm{O}(n^{\log_ba-\epsilon})$，所以

$$
af(\frac{n}{b})=a\left[(\frac{n}{b})^{\log_ba-\epsilon}\right]=a\left[\frac{n^{\log_ba-\epsilon}b^\epsilon}{a}\right]=n^{\log_ba-\epsilon}b^\epsilon<n^{\log_ba}=f(n)
$$

（以上等于、小于均为渐进意义，下同）

也就是下一层的合并代价比这一层的要小，同时我们发现第一层的合并代价也比最后一层的计算代价要小，那么总的 $T(n)$ 就由第一层的合并代价和最后一层的计算代价决定，也就是

$$
T(n)=\mathrm{O}(n^{\log_ba-\epsilon})+n^{\log_ba}\Theta(1)=\Theta(\log_ba)
$$

对于第 2 种情况，因为 $f(n)=\Theta(n^{\log_ba}\log^kn)$，所以

$$
af(\frac{n}{b})=a\left[(\frac{n}{b})^{\log_ba}\log^k\frac{n}{b}\right]=a\left[\frac{n^{\log_ba}}{a}(\log n-\log b)^k\right]=n^{\log_ba}\log^kn=f(n)
$$

也就是每一层的合并代价相等，那么总的

$$
T(n)=\log_bnf(n)+n^{\log_ba}\Theta(1)=\Theta(n^{\log_ba}\log^{k+1}n)+\Theta(n^{\log_ba})=\Theta(n^{\log_ba}\log^{k+1}n)
$$

对于第 3 种情况，因为 $f(n) = \Omega(n^{\log_b a+\epsilon})$ 和 $p:\exists 0<c<1,n_0>0,\forall n\geq n_0,af(\frac{n}{b})\leq cf(n)$，所以合并代价大于最后一层的计算代价，并且总的合并代价与第一层的合并代价同级，因此 $T(n)=\Theta(f(n))$。

简要证明已经写在证明部分。

伟大的 Master Theorem，就这么被我们干完了。

## 例题

  > NOIP 初赛的主定理题目就是授人以鱼，考人以鱽鱾鲀鱿鲃鲂鲉鲌鲄鲆鲅鲇鲏鲊鲋鲐鲈鲍鲎鲝鲘鲙鲗鲓鲖鲞鲛鲒鲚鲜鲟鲔鲕鲑鲧鲬鲪鲫鲩鲣鲨鲡鲢鲤鲠鲥鲦鲺鲯鲹鲴鲶鲳鲮鲭鲵鲲鲰鲱鲻鲷鲸鳋鳊鳁鳀鲾鲼鳈鳉鳃鳄鲿鳇鳂鳆鳅鲽鳌鳒鳎鳏鳑鳐鳍鳘鳛鳕鳓鳙鳗鳚鳔鳖鳜鳟鳞鳝鳡鳠鳢鳣鳤。

### P [NOIP2016 提高组初赛] 14.

假设某算法的计算时间表示为递推关系式

$T(n)=2T(\dfrac{n}{4})+\sqrt{n}$
$T(1)=1$

则算法的时间复杂度为（ ）。

<div style="width:25%; margin:0 0 0 0; float: left">
<center>A. $O(n)\qquad$</center>
</div>
<div style="width:25%; margin:0 0 0 0; float: left">
<center>B. $O(\sqrt{n})\qquad$</center>
</div>
<div style="width:25%; margin:0 0 0 0; float: left">
<center>C. $O(\sqrt{n}\log n)\qquad$</center>
</div>
<div style="width:25%; margin:0 0 0 0; float: left">
<center>D. $O(n^2)$</center>
</div>

<br>

这里我们已知 $a=2,b=4$，$f(n)={\sqrt{n}}$，得到 $f(n)=\Theta({\sqrt{n}})=\Theta(n^\frac{1}{2})=\Theta(n^{\log_ba})$，因此 $T(n)=\Theta(n^{\log_ba}\log n)=\mathrm{O}(\sqrt{n}\log n)$。

### P [NOIP2017 提高组初赛] 6.

若某算法的计算时间表示为递推关系式：

$T(N) = 2T(\dfrac{N}{2}) + N \log N$
$T(1) = 1$

则该算法的时间复杂度为（ ）。

<div style="width:25%; margin:0 0 0 0; float: left">
<center>A. $O(N)$</center>
</div>
<div style="width:25%; margin:0 0 0 0; float: left">
<center>B. $O(N \log N)$</center>
</div>
<div style="width:25%; margin:0 0 0 0; float: left">
<center>C. $O(N \log^2 N)$</center>
</div>
<div style="width:25%; margin:0 0 0 0; float: left">
<center>D. $O(N^2)$</center>
</div>

<br>

这里我们有 $a=2,b=2,f(N)=N\log N$，所以有 $f(N)=\Theta(N\log N)=\Theta(N^{\log_ba}\log N)$，因此 $T(N)=\Theta(N^{\log_ba}\log^2N)=\Theta(N\log^2N)$。

## 总结

干就完了。
