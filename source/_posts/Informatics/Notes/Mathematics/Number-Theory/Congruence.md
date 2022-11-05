---
title: 数学 - 数论 - 同余
tags:
  - '[I] 数学'
  - '[I] 数论'
categories:
  - Informatics
  - Notes
date: 2022-10-15 20:27:27
---


数论的守望

<!--more-->

## 同余

如果 $x,y$ 除以 $p$ 余数相等，那么称 $x,y$ 模 $p$ 同余，记作 $x\equiv y\pmod p$，$\LaTeX$ 数学公式 ``$x \equiv y \pmod p$``。

显而易见的是，在模 $p$ 意义下我们可以实现加、减、乘法运算，例如 $(x \bmod p) \times (y \bmod p) \bmod p = (x \times y) \bmod p$，证明略。

## 同余类和剩余系

对于 $\forall a\in[0,p-1]\cap\mathrm{Z}$，集合 $\\{a+kp,k\in\mathrm{Z}\\}$ 中的所有数模 $p$ 同余，我们称集合 $\\{a+kp\mid k\in\mathrm{Z}\\}$ 为 $p$ 的一个同余类，简记作 $\overline{a}$。

$p$ 的完全剩余系为 $\\{\overline{a}\mid a\in[0,p-1]\cap\mathrm{Z}\\}$。

$p$ 的简化剩余系为 $\\{\overline{a}\mid a\in[0,p-1]\cap\mathrm{Z}\land\gcd(a,p)=1\\}$

## 欧拉定理 & 费马小定理

费马小定理：若 $p$ 是质数，$p\nmid a$，则 $a^{p-1}\equiv 1\pmod p$。

欧拉定理：若 $(a,p)=1$，则 $a^{\varphi(p)}\equiv 1\pmod p$。

显而易见，费马小定理是欧拉定理在特殊条件下的形式，我们考虑证明欧拉定理。

我们将 $1$ 到 $p-1$ 内所有与 $p$ 互质的数写出来，或者说写出 $p$ 的简化剩余系中所有同余类的最小正整数代表。

$$
\mathrm{A}=\\{x_1,\quad x_2,\quad x_3,\quad \ldots,\quad x_{\varphi(p)}\\}
$$

将其中所有元素乘上与 $p$ 互质的 $a$。

$$
\mathrm{B}=\\{x_1\times a,\quad x_2\times a,\quad x_3\times a,\quad \ldots,\quad x_{\varphi(p)}\times a\\}
$$

想一想，若 $x\not\equiv y\pmod p$，那么对于与 $p$ 同余的 $a$，有 $x\times a\not\equiv y\times a\pmod p$。

采用反证法证明，假设有 $x\times a\equiv y\times a\pmod p$，那么 $(x-y)\times a\equiv 0\pmod p$，而 $x-y\not\equiv p\pmod p$ 且 $(a,p)=1$，产生矛盾，故不成立。因此，若 $x\not\equiv y\pmod p$，那么对于与 $p$ 同余的 $a$，有 $x\times a\not\equiv y\times a\pmod p$。

所以，$\mathrm{A}$ 和 $\mathrm{B}$ 本质上是同一个集合，因此

$$
\prod_{x\in\mathrm{A}}x\equiv\prod_{x\in\mathrm{B}}x\pmod p
$$

即

$$
\prod_{x\in\mathrm{A}}x\equiv\left(\prod_{x\in\mathrm{A}}x\right)\times a^{\varphi(p)}\pmod p
$$

所以

$$
a^{\varphi(p)}\equiv 1\pmod p
$$

命题得证，代入质数 $p$ 即可证明费马小定理。

根据欧拉定理得出一条推论，若 $(a,p)=1$，则 $a^{b}\equiv a^{b\bmod \varphi(p)}\pmod p$。

## 扩展欧几里得算法

二元一次不定方程，即形如 $ax+by=c$ 的关于 $x,y$ 的方程。

### 裴蜀定理

Bézout 定理，译作裴蜀定理，或贝祖定理。对于任意正整数 $a,b$，二元一次不定方程 $ax+by=\gcd(a,b)$ 存在解。

我们先暂且不考虑其正确性，当我们用扩展欧几里得算法做出答案时自然就证明了裴蜀定理。

### 扩展欧几里得算法

首先，我们可以知道，$(a,b)\mid c$ 是二元一次不定方程 $ax+by=c$ 成立的必要条件。因此我们来求解 $ax+by=(a,b)$ 之后将答案乘上 $\frac{c}{(a,b)}$ 即得到 $ax+by=c$ 的答案。

我们在辗转相除法求 $\gcd$ 的时候可以顺便求出一组 $(x,y)$。显然，当达到 $\left\\{\begin{array}{ll}a=\gcd\\\\b=0\end{array}\right.$ 边界的时候，我们可以让 $x=1,y=0$。然后回溯过程中，尝试通过二元一次不定方程 $bx'+(a\bmod b)y'=\gcd$ 的一组解来推出 $ax+by=\gcd$ 的一组解。

那么，原方程变形得到 $bx'+(a-\left\lfloor\frac{a}{b}\right\rfloor b)y'=\gcd$，因此 $ay'+b(x'-\left\lfloor\frac{a}{b}\right\rfloor y')=\gcd$，可以推出 $ax+by=0$ 的一组解 $\left\\{\begin{array}{ll}x=y'\\\\y=x'-\left\lfloor\frac{a}{b}\right\rfloor y'\end{array}\right.$。

用 C++ 代码可以这样实现：

<details class="note" open>
  <summary>参考代码</summary>

```cpp
int exgcd(int a, int b, int &x, int &y)
{
    if (a == b) return x = 1, y = 0, a;
    int res = exgcd(b, a % b, y, x);
    y = y - a / b * x;
    return res;
}
```

</details>

这样，我们不知不觉中就证明了裴蜀定理的正确性。我们还因此得出二元一次不定方程 $ax+by=c$ 有解的充要条件是，$(a,b)\mid c$。

exgcd 解出特解的范围粗略地在 $[-(a,b),(a,b)]$ 之间。

### 通解公式

如果我们得到了 $ax+by=c$ 的一组特解 $(x_0,y_0)$，尝试写出通解，注意，这里需要将 exgcd 求出的特解乘上 $\frac{c}{(a,b)}$。

二元一次不定方程的形式告诉我们，单项式 $ax$ 和 $by$ 的和是固定的，因此在 $x,y$ 变化的过程中，$ax$ 和 $by$ 值的变化等大反向。因为 $x,y$ 在整数域上变化，因此 $a\mid\Delta ax$，$b\mid\Delta by$，那么就有 $\operatorname{lcm}(a,b)\mid|\Delta ax=-\Delta by|$。因此，两个单项式的最小变化量是 $\operatorname{lcm}(a,b)$。

那么我们设变化量为最小变化量的 $t$ 倍，可以由此写出通解

$$
\left\\{
\begin{array}{ll}
x=x_0+\frac{\operatorname{lcm}(a,b)}{a}t\\\\
y=y_0-\frac{\operatorname{lcm}(a,b)}{b}t
\end{array}
\right.
$$

一般我们直接求出的是 gcd，因此通解可以写成

$$
\left\\{
\begin{array}{ll}
x=x_0+\frac{b}{(a,b)}t\\\\
y=y_0-\frac{a}{(a,b)}t
\end{array}
\right.
$$

### 线性同余方程

线性同余方程是指形如 $ax\equiv c\pmod b$ 的方程，等价于二元一次方程 $ax+by=c$。

## 乘法逆元

我们知道，在模意义下，可以进行加、减、乘法运算，但不能进行除法运算，有没有一种办法让除法运算也能在模意义下执行呢？

我们尝试将 $\div x$ 转化为 $\times x^{-1}$，这里的 $x^{-1}$ 即为 $x$ 在模 $p$ 意义下的乘法逆元。

在一般情况下，$x\times x^{-1}=1$，类推至模 $p$ 意义，有 $x\times x^{-1}\equiv 1\pmod p$，尝试找到一个整数与 $x$ 的乘积模 $p$ 等于 $1$，这个整数就是 $x$ 的乘法逆元，记作 $x^{-1}$。

在 $p$ 是质数的情况下，我们利用费马小定理，计算 $x^{-1}=x^{p-2}$ 即可得到 $x$ 的逆元。

在 $p$ 非质数的情况下，我们尝试 exgcd 解线性同余方程 $x\times x^{-1}\equiv 1\pmod p$。

两种方法都是 $O(\log p)$ 的时间复杂度，同时我们可以看到，$x$ 只有在 $(x,y)=1$ 的时候存在乘法逆元。

### 线性求逆元

考虑在 $O(n)$ 的时间内求出 $[1,n]$ 中所有数的乘法逆元，这里前提是 $p$ 是质数，否则不能保证 $[1,n]$ 所有数都有模 $p$ 意义下的逆元。

我们将 $p$ 拆解为 $p=ki+r$，其中 $i$ 是当前待求逆元的数，$k=\left\lfloor\frac{p}{i}\right\rfloor,r=p\bmod i$。

将 $p=ki+r$ 等式两边同时模 $p$ 得到（$p$ 模 $p$ 就比较魔怔）

$$
ki+r\equiv 0\pmod p
$$

移项，乘上 $i^{-1}$ 得到

$$
ri^{-1}\equiv -k\pmod p
$$

因此

$$
i^{-1}\equiv -k\times r^{-1}\pmod p
$$

这里 $r$ 是 $p$ 对 $i$ 的余数，因此是小于 $i$ 的，在此之前我们已经处理出了 $r^{-1}$，所以我们可以通过递推式得到逆元

$$
i^{-1}\equiv -\left\lfloor\frac{p}{i}\right\rfloor(p\bmod i)^{-1}
$$

---

逆元的用处在于将模意义下的运算扩展到除法领域，我们的做法是将除以一个数换成乘以这个数的逆元。

## 中国剩余定理

### 历史的渊源

  > 「物不知数」问题：有物不知其数，三三数之剩二，五五数之剩三，七七数之剩二。问物几何？

用现代数学语言描述，求解关于 $x$ 的同余方程组

$$
\left\\{
  \begin{align}
  x\equiv 2\pmod 3\\\\
  x\equiv 3\pmod 5\\\\
  x\equiv 2\pmod 7
  \end{align}
\right.
$$

该问题最早见于《孙子算经》中，并给出了解答，因此「中国剩余定理」也被称为「孙子定理」。在 13 世纪，秦九韶集前法之大成，在《数书九章》中给出了「物不知数」问题的完整解答——「大衍求一术」。

在欧洲，18 世纪的欧拉、拉格朗日等都对一次同余式问题进行过研究，德国数学家高斯独立研究出了与中国剩余定理一致的成果，在 1801 年出版的《算术探究》中介绍了该定理。1852 年，英国传教士伟烈亚力将「物不知数」问题的解法传到了欧洲，1874 年马蒂森验证指出其与高斯的定理一致，自此国际上将这个定理称为   **中国剩余定理（Chinese Remainder Theorem）**。

### 今日的审视

今天，我们研究的中国剩余定理用以解决以下问题

$$
\\begin{cases}
x &\\equiv a_1 \\pmod {n_1} \\\\
x &\\equiv a_2 \\pmod {n_2} \\\\
  &\\vdots \\\\
x &\\equiv a_k \\pmod {n_k} \\\\\
\end{cases}
$$

其中，$n_1,n_2,\ldots,n_k$ 两两互质。

利用中国剩余定理，解法是

  1. 计算 $M=\prod\limits_{i=1}^kn_i$。

  2. 计算 $m_i=\frac{M}{n_i}\quad(i\in[1,k])$。

  3. 计算 $m_i$ 在模 $n$ 意义下的逆元 $m_i^{-1}$。
  
  4. 方程组在模 $M$ 意义下的唯一解为 $x_0=\sum\limits_{i=1}^ka_im_im_i^{-1}$，方程组的通解为 $x=x_0+Mt$。

我们尝试证明此算法的正确性。

对于第 $j$ 个方程，当 $i\neq j$ 时，有 $n_j\mid m_i$，故 $a_im_im_i^{-1}\equiv 0\pmod{n_j}$；当 $i=j$ 时，有 $n_in_i{-1}\equiv 1\pmod{n_j}$，故 $a_im_im_i^{-1}\equiv a_i\pmod{n_j}$。因此 $x=\sum\limits_{i=1}^ka_im_im_i^{-1}\equiv a_i\pmod{n_j}$。

我们证明了特解的正确性，接下来证明其唯一性。假设方程组有两个解 $x,x'$，那么对于第 $i$ 个方程，有 $x-x'\equiv 0\pmod{n_i}$，即 $n_i\mid(x-x')$。那么就有 $M\mid(x-x')$，因此求得的 $x_0$ 是其在模 $M$ 意义下的唯一解，且通解为 $x=x_0+Mt$。

### 未来的方向

扩展中国剩余定理（exCRT）。

当 $n_1,n_2,\ldots,n_k$ 两两互质的条件不成立时，CRT 就不再使用，我们采用方程两两合并的想法。

对于两个方程

$$
\\begin{cases}
x &\\equiv a_1 \\pmod {n_1} \\\\
x &\\equiv a_2 \\pmod {n_2}
\end{cases}
$$

很容易可以写成，$n_1k_1-n_2k_2=a_2-a_1$，用 exgcd 写出 $k_1$ 或者 $k_2$ 的通解，进而写出 $x$ 的通解，合并为一个新的线性同余方程。

## 终言

你在上海，我在北京。你在 $20^\circ\mathrm{W}$，我在 $160^\circ\mathrm{E}$。你在各拉丹冬，我在东海。

不去关心距离，模 $p$ 仍是同余。跨越星河，是数论永恒的守望。
