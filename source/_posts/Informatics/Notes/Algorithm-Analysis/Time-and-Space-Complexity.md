---
title: 算法分析 - 时空复杂度
tags:
  - '算法分析'
categories:
  - Informatics
  - Notes
date: 2022-07-21 16:01:03
---


时间的匆匆乘客，空间的默默过客

<!--more-->

## 等效异耗

请看。

菲波那契数列是指这样的数列: 数列的第一个和第二个数都为 $1$，接下来每个数都等于前面 $2$ 个数之和。

给出一个正整数 $a$，要求菲波那契数列中第 $a$ 个数是多少。

我们对此已经积累出了三种解法，递归法、递推法、矩阵快速幂优化递推。效果相同，但有时，你会发现，在不合适的地方用了不合适的解法可能会 <font style="color:orange"><i class="fa-solid fa-clock"></i> Time Limit Exceeded</font>。

再看。

我们存储图，有两种流行的方式，邻接表和邻接矩阵。效果相同，但有时，你会发现，用邻接矩阵的解法可能会 <font style="color:orange"><i class="fa-solid fa-microchip"></i> Memory Limit Exceeded</font>。

一定是我们打开方式有点不对。

在算法竞赛中，我们写出的程序不仅要解决问题，还要高效地解决问题，具体说，在限定时间限定空间内解决问题。诸如以上超时间、超空间的情况，就是超出了题目允许的时空限制。

算法不仅要正确地解决问题，还要高效地解决问题。计算机不是无限快的，存储器也不是无限大的，在时空资源有限的情况下，耗时短、内存小的算法显然更受欢迎。这也是算法研究的一个主题。

为了能够评判程序的时间和空间消耗，时空复杂度应运而生。

## 时空评判

一般来说，时间评判以 $\mathrm{s}$ 作为单位，空间评判以 $\mathrm{MB}$ 作为单位，事实上在评测的时候也确实按这样的实际数据进行限制。但这样，我们只能写出一个程序在特定数据下测量其时空消耗。

而更多时候，我们关心的是能否根据算法结构评估它在不同数据下的时空消耗，或者说它的时空消耗随数据规模增长的大致趋势。这样计算出的时空消耗才有预判性，才能对程序设计产生引导作用。

我们习惯用时间复杂度表示用时随数据规模的增长，用空间复杂度表示占用内存随数据规模的增长。

$T(n)$ 表示数据规模为 $n$ 的时间复杂度，$S(n)$ 表示数据规模为 $n$ 的空间复杂度。

## 时间复杂度

时间复杂度用基本操作的次数进行衡量，加减乘除、访问、赋值等操作可以视为基本操作。

在此规则下，假设我们有算法 A 运行时间表达式为 $T_A(n)=2n^2$，同样有算法 B 运行时间表达式为 $T_B(n)=50n\lg n$。当 $n=10$ 时，$T_A(n)=2,T_B(n)=500$，算法 A 运行得更快，并且此时两种算法相差无几；而当 $n=10^7$ 时，$T_A(n)=2\times 10^{14},T_B(n)=3.5\times 10^9$，即使执行算法 A 的计算机每秒处理 $10^{10}$ 条指令而执行算法 B 的计算机每秒处理 $10^7$ 条指令，算法 A 需要运行超过 5.5 个小时而算法 B 需要运行不到 20 分钟。

可以发现，对于不同的时间表达式，运行时间随数据规模的增长是大相径庭的。我们仔细观察下面一个多项式表达式，比如 $T(n)=30n^4+20n^3+40n^2+48n+100$，当 $n$ 增长时，$T(n)$ 表达式除了常数项的每一项都在增长，而其中增长最快的无疑是高次项 $30n^4$，而常数项 $100$ 根本不增长。当 $n$ 增长到一定规模时，低次项相较于高次项对整体的影响微乎其微，同样每一项的系数对整体也造成不了大的影响。

所以在更关心规模增长的条件下，这里我们舍弃增长较慢或不增长的项，以及每一项的系数，只留下对整体增长影响较大的部分。也就是 $T_1(n)=30n^4+20n^3+40n^2+48n+100\approx n^4$, $T_2(n)=100n^3+50n^2+78n+10\approx n^3$，我们可以记为 $T_1(n)=\Theta(n^4)$,$ T_2(n)=\Theta(n^3)$。

为什么可以这么干呢？请看，如果有 $T_3(n)=1000n^3=\Theta(n^3)$, $T_4(n)=n^3=\Theta(n^3)$，即使系数相差甚远，但无论 $n$ 取何值，$T_3(n)$ 只会永远是 $T_4(n)$ 的 $100$ 倍，这个比值永远不会扩大。我们将 $T_3(n)$ 与 $T_4(n)$ 之间这样的关系称为两者同级。在只关心数据规模增长的情况下，这就足够描述时间的增长趋势了，在 $n$ 越来越大的情况下，不同级的数据差距越来越大，而同级的数据差距基本保持恒定。于是，我们就可以按照“级别”来评估时间随数据规模增长的趋势。

一般我们关心的是程序运行耗时的上限，所以一般我们用的渐进记号是 $\mathrm{O}$ 而不是 $\Theta$，$\mathrm{O}(1)$, $\mathrm{O}(\log n)$, $\mathrm{O}(n)$, $\mathrm{O}(n+m)$, $\mathrm{O}(n\log n)$, $\mathrm{O}(n^2)$, $\mathrm{O}(n!)$, $\mathrm{O}(2^n)$ 这些让人眼花缭乱的时间复杂度你应该异常熟悉。

$\Theta,\mathrm{O},\Omega$ 这些渐进记号的讲解请移步[算法分析 - 渐进式](/Informatics/Notes/ALGORITHM-ANALYSIS-Asymptotics/)。

那么什么样的时间复杂度在 1s 内可以承受什么样的数据规模，请看。

| 时间复杂度 | 稳过的数据规模 | 最大的数据规模 |
| :---------: | :-------------: | :-------------: |
| $\mathrm{O}(1)$ | $+\infty$ | $+\infty$ |
| $\mathrm{O}(\log n)$ | $2^{5\times 10^7}$ | $2^{1\times 10^{8}}$ |
| $\mathrm{O}(n)$ | $5\times 10^7$ | $1\times 10^8$ |
| $\mathrm{O}(n\log n)$ | $5\times 10^5$ | $1\times 10^6$ |
| $\mathrm{O}(n^2)$ | $5000$ | $10000$ |
| $\mathrm{O}(n^3)$ | $300$ | $500$ |
| $\mathrm{O}(2^n)$ | $25$ | $27$ |
| $\mathrm{O}(n!)$ | $11$ | $11$ |
| $\mathrm{O}(n^n)$ | $8$ | $8$ |

看看一些简单的时间复杂度计算。

  - 一般的循环嵌套——各层循环次数乘积。
  - ``while`` 内指针扫描数组——数组长度。
  - DFS 遍历图——$\mathrm{O}(n+m)$。
  - 一般的递归，递归 $k$ 层，每层从 $a$ 个子节点统计——$O(a^k)$。
  - 基于二分的排序——$\mathrm{O}(n\log n)$

一些比较麻烦的又呈现出规律性的递归，计算时间复杂度可以用主定理，请移步[算法分析 - 主定理](/Informatics/Notes/ALGORITHM-ANALYSIS-Master-Theorem)。
  
通常情况下，时间复杂度不仅与数据规模有关，还与数据特点有关，此时我们不能算出一以贯之的时间复杂度，于是就有了最坏时间复杂度、平均（期望）时间复杂度之分。比如二分快排，平均（期望）时间复杂度是 $\mathrm{O}(n\log n)$ 而最坏情况下能够被卡到 $\mathrm{O}(n^2)$。

但有时候，对事件复杂度友好和不友好的情况会在一道题的反复操作中都出现，如果这些操作总的时间复杂度是可以确定的，那么便可以均摊到各个操作中，这里叫做均摊复杂度，请移步[算法分析 - 摊还分析](//还没写呢)。

## 卡常

时间复杂度是在量级上对时间消耗的预估，事实上，由于每一次循环操作次数，或者是低次项的影响，时间复杂度并不能说明一切。比如说树状数组和线段树，单次操作时间复杂度都是 $\mathrm{O}(\log n)$ 的，但是由于线段树的常数比树状数组大，所以很可能被某些毒瘤的出题人卡掉。

此时就需要一些奇奇怪怪的编程技巧来优化常数了。

能用循环，就避免递归，压栈弹栈是一个挺麻烦的操作，搞不好还会爆栈。

输入数据过大时建议写快读。

多重循环对应多维数组的时候，如果可以，建议如果要访问 ``f[i][j]``，那么外层循环 ``i`` 内层循环 ``j``，以增加内存访问的连续性。

不要随时定义局部变量，申请变量也比较耗时。

循环条件不要出现算式，尤其是 ``strlen(s)`` 这样的。

循环体或者分支结构里只有一个语句就将其压行到判断条件同一行。

……

## 空间复杂度

其实，空间复杂度没有什么好说的……

定义与时间复杂度大同小异，但更简单，影响因素也更少。因为在算法竞赛中，我们常常是实现定义好变量的，不会中途去申请太多空间，因此我们只需要对定义的几个数组算一下占多少空间即可。

比如说你只用看我们开了一个数组 ``a[1000000]``，你就知道这里会用大约 $4\mathrm{MB}$ 的内存。

## 总结

时间与空间是算法竞赛中永恒的话题，而复杂度是评判时空消耗的一把标尺。处处皆学问，不知将时空复杂度研究得更加透彻的你，又有何体悟？

爱因斯坦的相对论打破了牛顿力学的绝对时空观，时间与空间、时空与参考系紧密联系在一起。我们不过是时间流过的渺茫一瞥，也不过是空间角落的沧海一粟。

而

「我有我们，足矣。」
