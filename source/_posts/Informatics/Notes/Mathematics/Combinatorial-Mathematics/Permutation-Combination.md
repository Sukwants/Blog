---
title: 数学 - 组合数学 - 排列组合
tags:
  - '数学'
  - '组合数学'
categories:
  - Informatics
  - Notes
date: 2022-10-16 20:27:19
---


演绎出大千世界

<!--more-->

## 序言

这是一个充满了随机性的世界。

## 加法原理 & 乘法原理

**加法原理**，完成一件事的方法有 $n$ 类，第 $i$ 类包含 $a_i$ 种方法，且这些方法互不重合，则完成这件事共有 $a=\sum\limits_{i=1}^na_i$ 种方法。

**乘法原理**，完成一件事需要完成 $n$ 步，第 $i$ 步存在 $a_i$ 种方法，且这些步骤互不干扰，则完成这件事共有 $a=\prod\limits_{i=1}^na_i$ 种方法。

## 排列数 & 组合数

从 $n$ 个不同的数中选取 $m$ 个数生成一个有序排列，其方案数被称为**排列数**，用 $A_n^m$ 表示。

$$
A_n^m=\frac{n!}{(n-m)!}
$$

从 $n$ 个不同的数中选取 $m$ 个数生成一个无序集合，其方案数被称为**组合数**，用 $C_n^m$ 或 $\binom{n}{m}$ 表示。

$$
C_n^m=\frac{n!}{m!(n-m)!}
$$

## 组合数

$$
\binom{n}{k}=\binom{n}{n-k}
$$

利用组合数的定义，正确性显然。

---

加法公式：
$$
\binom{n}{k}=\binom{n-1}{k}+\binom{n-1}{k-1}
$$

直接套用定义式，$\binom{n-1}{k}+\binom{n-1}{k-1}=\frac{(n-1)!}{k!(n-k-1)!}+\frac{(n-1)!}{(k-1)!(n-k)!}=\frac{(n-1)!(n-k+k)}{k!(n-k)!}=\frac{n!}{k!(n-k)!}=\binom{n}{k}$。

由此我们可以看出，杨辉三角中第 $n+1$ 行第 $k+1$ 个数就是 $\binom{n}{k}$。

---

$$
\binom{n}{0}+\binom{n}{1}+\binom{n}{2}+\ldots+\binom{n}{n}=2^n
$$

利用组合意义，正确性显然。

---

$$
\binom{n}{m}\binom{m}{k}=\binom{n}{k}\binom{n-k}{m-k}
$$

利用组合意义，正确性显然。

---

组合数的求法

  - 数据范围小时用加法公式，时间复杂度 $O(n^2)$。
  - 数据范围大时用定义式，这种情况一般需要对大质数取模。于是 $O(n)$ 预处理出阶乘和阶乘逆元，单次询问 $O(1)$。
  - 数据范围再大点，不能预处理全部阶乘时用 Lucas 定理，单次询问 $O(\log n)$。

---

平行求和：

$$
\binom{n-k-1}{0}+\binom{n-k}{1}+\binom{n-k+1}{2}+\ldots+\binom{n-1}{k}=\sum_{i=0}^k\binom{n-k-1+i}{i}=\binom{n}{k}
$$

上指标求和：

$$
\binom{k-1}{k-1}+\binom{k}{k-1}+\binom{k+1}{k-1}+\ldots+\binom{n-1}{k-1}=\sum_{i=0}^{n-k}\binom{k-1+i}{k-1}=\binom{n}{k}
$$

在杨辉三角上观察，

{% asset_img sum.png '"" "平行求和与上指标求和"' %}

正确性可以利用加法公式递归分解证明。

---

吸收公式：

$$
\binom{n}{k}k=\binom{n-1}{k-1}n
$$
$$
\binom{n}{k}(n-k)=\binom{n-1}{k}n
$$

直接套用定义式证明。

---

二项式定理：

$$
(x+y)^n=\sum_{k=0}^n\binom{n}{k}x^ky^{n-k}
$$

利用组合意义，正确性显然。

## 插板法

$x_1+x_2+x_3+\ldots+x_n=m$ 的正整数解个数？

题目可以转化为，利用 $n-1$ 个隔板将 $m$ 个小球分开，相邻隔板之间至少存在一个小球，隔板也不能放在首尾，问方案数。易得答案为 $\binom{m-1}{n-1}$。

## Lucas 定理

当 $p$ 是质数时，有

$$
\binom{n}{m}\equiv\binom{n/p}{m/p}\binom{n\bmod p}{m\bmod p}\pmod p
$$

### 引理

若 $p$ 是质数，$(x+y)^p\equiv x^p+y^p\pmod p$。

采用二项式定理，$(x+y)^p=\sum\limits_{i=0}^p\binom{p}{i}x^iy^{p-i}$，当 $i\in[1,p-1]$ 时，因为 $p$ 是质数，显然有 $p\mid\binom{p}{i}$，因此 $i$ 取这些值时 $\binom{p}{i}x^iy^{p-i}\equiv 0\pmod p$。进而得到 $(x+y)^p\equiv x^p+y^p\pmod p$。

### 证明

设 $n=kp+r$，其中 $k=n/p,r=n\bmod p$。

$$
\begin{align}
(x+1)^n&=(x+1)^{kp}\times(x+1)^r\\\\
       &=((x+1)^p)^k\times(x+1)^r\\\\
       &\equiv(x^p+1)^k\times(x+1)^r\pmod p
\end{align}
$$

因此

$$
\begin{align}
\sum_{m=0}^n\binom{n}{m}x^m&\equiv\left\(\sum_{i=0}^k\binom{k}{i}x^{ip}\right\)\times\left\(\sum_{j=0}^r\binom{r}{j}x^j\right\)\\\\
                           &\equiv\sum_{i=0}^k\sum_{j=0}^r\binom{k}{i}\binom{r}{j}x^{ip+r}
\end{align}
$$

因此，当 $m=ip+j$ 即 $i=m/p,j=m\bmod p$ 时，有 $\binom{n}{m}\equiv\binom{k}{i}\binom{r}{j}\pmod p$。

即

$$
\binom{n}{m}\equiv\binom{n/p}{m/p}\binom{n\bmod p}{m\bmod p}\pmod p
$$

## 后记

这是一个在排列组合的变幻中演绎出的大千世界。

<div class="popular-posts-header">参考资料</div>

  - starusc 的讲课课件
  - 《算法竞赛进阶指南》 - 《0x36 组合计数》
  