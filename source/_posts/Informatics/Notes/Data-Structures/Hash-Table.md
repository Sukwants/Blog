---
title: 散列表
tags:
  - '哈希'
categories:
  - Informatics
  - Notes
date: 2022-11-10 13:00:00
---


散列路的门牌号

<!--more-->

## 概述

散列表，Hash Table，又译作「哈希表」。在处理数据时，我们可能会被要求存储形如 $(x,y)$ 的二元组，给定 $x$ 来查询 $y$，我们将 $x$ 称为「关键字」，$y$ 称为「卫星数据」。此时我们固然可以遍历数组，但这样时间效率不高，也可以在值域上开数组来直接寻址，但这样空间浪费太多。此时我们考虑将关键字的值域散列到一个较小的范围内，再直接寻址，这就是散列表。

## 直接寻址表

当关键字的全域 $U$ 比较小时，直接寻址表是一个效率很高的办法。我们开一段数组，在关键字的位置上，存储下或指向卫星数据。这样我们可以直接通过下标访问，$O(1)$ 地完成从关键字到卫星数据的查询。

我们将直接寻址表中的每个位置称为「槽」。

当 $U$ 比较大时，就会导致直接寻址表需要的空间随之增长，此时简单的直接寻址表会占用很大的空间。但是虽然我们开了这么多的空间，而能被占用的只与数据规模同级，因此直接寻址表会造成很大的空间浪费，也就是在直接寻址表中会有许多槽被闲置，这不是我们希望看到的。

## 散列表

直接寻址表的缺点在于当关键字集合远小于全域时空间的浪费。我们希望在时间复杂度依然 $O(1)$ 的同时，将空间压缩到 $|K|$ 的级别。但是对于散列表，$O(1)$ 是平均情况，而直接寻址表是最坏情况。

我们定义一个从 $U$ 指向 $K$ 的 **散列函数** $h(x)$，让关键字为 $x$ 的数据存储在 $h(x)$ 的位置。这样我们将表的规模由全域 $|U|$ 压缩到了 $|K|$。因为函数的定义域远大于值域，因此不可避免的会出现 $x\neq y$ 而 $h(x)=h(y)$ 的情况，而在一个优秀的散列函数下，映射到散列表中同一个槽的数据冲突是尽可能更低的，相当于我们一个槽里除了一个有效数据外，其余预留的位置都是无效的。

{% asset_img hash-function.png '"" "散列函数"' %}

哈希冲突是不可避免的，我们解决哈希冲突的办法主要有两种：链接法和开放寻址法。

## 链接法

链接法的思想在于，我们对于散列值相同的元素，串一个链表起来，每次查询就在计算出散列值的链表中遍历。在链表中，遍历、插入、删除都容易实现。

然后我们对链接法进行时间复杂度分析。我们假设散列函数构造出的散列表是简单均匀散列，这意味着在散列表中数据基本是均匀分布的。

我们定义散列表的装在因子 $\alpha=\frac{n}{m}$，$n$ 是数据规模，$m$ 是散列表规模。先给结论，在散列表中，一次成功和不成功的查询期望时间复杂度均为 $\Theta(1+\alpha)$。

令我们要查询的关键字为 $k$。

对于一次不成功的查询，查找所需时间就是计算散列值所需时间与遍历整个链表所需时间，假设计算散列值的时间复杂度为 $\Theta(1)$，令 $n_{h(k)}$ 为散列值为 $h(k)$ 的链表长度，因此时间复杂度为 $\Theta(1+n_{h(k)})$。而在简单均匀散列的假设下，$E[n_{h(k)}]=\frac{n}{m}=\alpha$，因此一次不成功的查询时间复杂度为 $\Theta(1+\alpha)$。

对于一次成功的查询，查找所需时间即为计算散列值所需时间与链表中 $k$ 之间的元素数量。我们在链表的表头处增加标量，因此遍历链表所需时间就是与它散列值相同且在它之后插入链表的元素数量。定义指示器随机变量 $X_{ij}=I\\{h(i)=h(j)\\}$，在简单均匀散列的假设下，有 $E[X_{ij}]=\frac{1}{m}$。则查询 $k$ 的期望数目为

$$
\begin{align}
E[\frac{1}{n}\sum_{i=1}^n(1+\sum_{j=i+1}^nX_{ij})]&=\frac{1}{n}\sum_{i=1}^n(1+\sum_{j=i+1}^nE[X_{ij}])\\\\
&=1+\frac{1}{n}\sum_{i=1}^n\sum_{j=i+1}^n\frac{1}{m}\\\\
&=1+\sum_{i=1}^n\sum_{j=i+1}^n\frac{1}{mn}\\\\
&=1+\frac{n(n-1)}{2mn}\\\\
&=1+\frac{n-1}{2m}\\\\
&=1+\frac{\alpha}{2}-\frac{\alpha}{2n}
\end{align}
$$

因此，一次成功的查询所需时间期望为 $\Theta(2+\frac{\alpha}{2}-\frac{\alpha}{2n})=\Theta(1+\alpha)$。

## 散列函数

一个优秀的散列函数应当（近似地）满足简单均匀假设，每个关键字都被等可能地映射到 $m$ 个槽中的某一个。这样能够满足我们上面对链接法分析时间的前提假设。

### 除法散列法

在除法散列法中，一般定义 $h(x)=x\bmod m$。因为模数可以任意选取而导致生成的散列值不同，因此被刻意构造出冲突数据是不大可能的。

选取模数的时候，应当避免 $2$ 的幂，因为这样关键字的散列值只与二进制下最低几位有关，很容易出现冲突。理想的模数应该是一个大质数，这样模数与散列表中的任意位置的编号都互质，能够更好地保证均匀分布。

### 乘法散列法

乘法散列法一般包含两个步骤：1. 将关键字 $k$ 乘上常数 $A$（$0<A<1$），提取 $kA$ 的小数部分；2. 用 $m$ 乘这个数，向下取整。即
 
$$
h(k)=\lfloor m(kA\bmod 1)\rfloor
$$

乘法散列法的一个优点是对 $m$ 的选择不是特别关键，一般选取为 $2$ 的幂。这样会比一般的乘法散列要快。

假设 $m$ 取 $2^p$，计算机的位长为 $w$，定义 $s=A\times 2^w$，则 $ks$ 的低 $w$ 位的高 $p$ 位即为哈希值。

而《算法导论》上说，$A=\frac{\sqrt{5}-1}{2}$ 是一个优秀的选择。

### 全域散列法

全域散列法的做法是，在若干散列函数中备选，随机选取一个散列函数，这样能够有效避免被刻意卡掉。

比如我们选一个大质数 $p$，取 $a\in\mathrm{Z}\_p^*,b\in\mathrm{Z}\_p$，定义散列函数 $h\_{ab}(k)=((ak+b)\bmod p)\bmod m$。所有的散列函数 $h\_{ab}$ 形成了一个散列函数簇。

## 非简单数值的散列函数

### 字符串

将字符串转化为散列值，可以将字符串视为一个 $b$ 进制数，这个 $b$ 应该至少要大于字符集。对于字符串 $s$，定义它的散列值为

$$
h(s)=\sum_{i=1}^{len}s_i\times b^{len-i} \bmod m
$$

并且这样设计的散列函数，我们能够非常方便的求出字符串的子串散列值，或是将两个字符串合并过后的散列值。

### 排列

对于一个排列，我们固然可以为其设定一个大小为 $n^n$ 的全域，但事实上可能出现的排列只有 $n!$ 种，此时我们打算将其一一对应。姑且定义它的散列值即为它在所有排列中的排名。

于是我们的计算方法是，对于第 $i$ 位是 $x_i$，统计 $cnt_i$ 表示 $i$ 之后存在多少 $j$ 满足 $x_j<x_i$，将 $cnt_i\times(n-i)!$ 累积到答案中。

## 开放寻址法

开放寻址法的思想是，如果当前的槽已经被占用，就跳到另一个槽去尝试放置，直到找到一个空闲的槽。因此，我们会为关键字设计一个排列，用以指示寻找顺序。我们按照排列依次寻找的过程，称为「探查」。探查方法一般有下面所说的线性探查、二次探查、双重探查。

我们希望探查（近似地）均匀分布在 $m!$ 种排列中，这称为「均匀散列」。

同样的，我们查询时也按照探查序列，依次寻找需要查询的数据。

因为开放寻址法的所有数据均存储在散列表中，因此数据规模 $n$ 不应大于散列表大小 $m$，此时依然定义装载因子 $\alpha=\frac{n}{m}$。

### 线性探查

给定一个普通的散列函数 $h':U\rightarrow\\{0,1,\ldots,m-1\\}$，接着我们定义探查序列

$$
h(k,i)=(h'(k)+i)\bmod m
$$

线性探查意味着，如果当前槽被占用，就往后找到第一个未被占用的槽来放置。

线性探查有一个很明显的问题，被称为「一次群集」，随着元素不断加入，被占用的槽越来越多，连续出现被占用的槽越来越长，就会使得一次探查的平均时间越来越长，出现群集现象。

### 二次探查

定义二次探查的探查序列

$$
h(k,i)=(h'(k)+c_1i+c_2i^2)\bmod m
$$

同样的，二次探查依然会有可能出现群集，这被称为「二次群集」。

### 双重探查

我们有两个普通散列函数 $h_1,h_2$，那么这个双重探查的探查序列

$$
h(k,i)=(h_1(k)+ih_2(k))\bmod m
$$

在双重探查下，每一次向后继续寻找的偏移量、二次偏移量都不等，这样能够让探查序列更加均匀。但是，无论是线性探查、二次探查，还是双重探查，均未达到「均匀散列」的标准，只是比较近似。

## 总结

散列表，就是将关键字巨大的全域映射到一段较小的域上去，并且能够拥有和直接寻址表等同的时间复杂度。

正是因此，我们才能够在常数时间内查询到卫星数据，才能够在数据规模的空间内存储散列表。

因为门牌的编号，与众不同，而门牌的编号，有拘有束。

<div class="popular-posts-header">参考资料</div>

  - 《算法导论》 - 《第 11 章 散列表》
