---
title: 数学 - 数论 - 因数
tags:
  - '[I] 数学'
  - '[I] 数论'
categories:
  - Informatics
  - Notes
date: 2022-08-28 12:15:09
unshow: true
---


数论的鹊桥

<!--more-->

## 因数

因数，这里讲的并非是乘数的意思，而是与倍数相对的意思，又称约数。

如果存在大于 $2$ 的自然数 $a,b$ 满足 $a\mid b$，则称 $a$ 是 $b$ 的因数，$b$ 是 $a$ 的倍数。

### 算术基本定理的推论

根据算术基本定理

$$
N=p_1^{c_1}p_2^{c_2}...p_m^{c_m}=\prod_{i=1}^mp_i^{c_i}
$$

根据排列组合，质因子 $p_i$ 可以取 $0,1,...,c_i$ 次，因此

$N$ 的正因数个数为

$$
(c_1+1)(c_2+1)...(c_m+1)=\prod_{i=1}^m(c_i+1)
$$

$N$ 的所有正因数和为

$$
(p_1^{c_1}+p_1^{c_1-1}+...+1)(p_2^{c_2}+p_2^{c_2-1}+...+1)...(p_m^{c_m}+p_m^{c_m-1}+...+1)=\prod_{i=1}^m\sum_{j=0}^{c_i}p_i^j
$$

### 求 $N$ 的正因数集合（试除法）

通过扫描 $x\in[1,sqrt{N}]$，如果 $x\mid N$，则 $x$ 和 $\frac{N}{x}$ 是 $N$ 的因数。

### 求 $1\sim N$ 的正因数集合（倍数法）

通过扫描 $x\in[1,N]$，将 $x$ 加入所有 $x$ 的倍数的正因数集合。

## 最大公因数

### 最大公因数

如 $x$ 同为 $a,b$ 的因数，则称 $x$ 为 $a,b$ 的公因数，其中最大的一个 $x$ 被称为最大公因数，记作 $x=\gcd(a,b)$。

### 更相减损术

可以明确，如果 $a>b$ 且 $\gcd(a,b)=x$，则令 $a=k_1x,b=k_2x(k_1,k_2\in\mathbf{N}_+)$，那么一定有 $c=a-b=(k_1-k_2)x$ 即 $x\mid c$，要么 $c=0$ 要么 $c$ 也是 $x$ 的倍数。

更相减损术的做法是

$$
\\begin{array}{l}  & \\text{GCD}(a,b) \\\\  & \\begin{array}{rl}      1 &  \\textbf{if } a < b \\\\      2 &  \\qquad \\text{SWAP}(a,b) \\\\      3 &  \\textbf{while } b \\neq 0 \\\\      4 &  \\qquad a \\gets a - b \\\\      5 &  \\qquad \\textbf{if } a < b \\\\      6 &  \\qquad \\qquad \\text{SWAP}(a,b) \\\\      7 &  \\textbf{return } a    \\end{array}\\end{array}
$$

### 辗转相除法

又称欧几里得算法，观察更相减损术，我们发现减法可以通过取模代替。

$$
\\begin{array}{l}  & \\text{GCD}(a,b) \\\\  & \\begin{array}{rl}      1 &  \\textbf{if } a < b \\\\      2 &  \\qquad \\text{SWAP}(a,b) \\\\      3 &  \\textbf{while } b \\neq 0 \\\\      4 &  \\qquad a \\gets a \\bmod b \\\\      5 &  \\qquad \\text{SWAP}(a,b) \\\\      6 &  \\textbf{return } a    \\end{array}\\end{array}
$$

### 最小公倍数

如 $x$ 同为 $a,b$ 的倍数，则称 $x$ 为 $a,b$ 的公倍数，其中最小的一个 $x$ 被称为最小公倍数，记作 $x=\operatorname{lcm}(a,b)$。

分解为质因子查看，发现 $\operatorname{lcm}(a,b)$ 包含 $a,b$ 共有的质因子和 $a,b$ 独有的质因子，即 $\operatorname{lcm}(a,b)=\gcd(a,b)\times\frac{a}{\gcd(a,b)}\times\frac{b}{\gcd(a,b)}=\frac{ab}{\gcd(a,b)}$，也就是

$$
\gcd(a,b)\times\operatorname{lcm}(a,b)=a\times b
$$

## 互质

如果 $\gcd(a,b)=1$，则称 $a,b$ 互质。

定义欧拉函数 $\varphi(x)=\operatorname{card}(\\{i\in\mathbf{N}_+[1,i]\mid\gcd(i,x)=1\\})$，表示 $1\sim x$ 中与 $x$ 互质的数的个数。

在算术基本定理中，$N=p_1^{c_1}p_2^{c_2}...p_m^{c_m}=\prod_{i=1}^mp_i^{c_i}$，根据容斥原理，从 $N$ 个数中排除不与 $N$ 互质的，可以得到

$$
\\begin{align}
  \\varphi(N)&=N-\\sum_{i=1}^m\\frac{N}{p_i}+\\sum_{i=1}^m\\sum_{j=i+1}^m\\frac{N}{p_ip_j}-\\cdots\\pm\\frac{N}{p_1p_2\\cdots p_m} \\\\
            &=N\\left[1+\\sum_{i=1}^m(-\\frac{1}{p_i})+\\sum_{i=1}^m\\sum_{j=i+1}^m(-\\frac{1}{p_i})(-\\frac{1}{p_j})+\\cdots+(-\\frac{1}{p_1})(-\\frac{1}{p_2})\\cdots(-\\frac{1}{p_m})\\right] \\\\
            &=N\\sum_{k_1=0}^1\\sum_{k_2=0}^1\\cdots\\sum_{k_m=0}^1\\prod_{i=1}^m(-\\frac{1}{p_i})^{k_i} \\\\
            &=N(1-\\frac{1}{p_1})(1-\\frac{1}{p_2})\\cdots(1-\\frac{1}{p_m}) \\\\
            &=N\\prod_{i=1}^m(1-\\frac{1}{p_i})
\\end{align}
$$

显然，当 $N$ 为质数时，$\varphi(N)=N-1$。

**性质 1** $\forall n>1$，$1\sim n$ 中与 $n$ 互质的数的和为 $\frac{1}{2}n\varphi(n)$。

因为 $\gcd(n,x)=\gcd(n,n-x)$，所以与 $n$ 不互质的数 $x,n-x$ 总是成对出现，平均值为 $\frac{1}{2}n$。

**性质 2** 若 $\gcd(a,b)=1$，则 $\varphi(a,b)=\varphi(a)\varphi(b)$。

由上述欧拉函数的计算式可得。这样当 $\gcd(a,b)=1$ 时满足 $f(ab)=f(a)f(b)$ 的函数，被称为积性函数。积性函数显然是一个数论上的概念。

**性质 3** 设 $p$ 为质数，若 $p\mid n$ 且 $p^2\mid n$，则 $\varphi(n)=\varphi(\frac{n}{p})\times p$。

**性质 4** 设 $p$ 为质数，若 $p\mid n$ 且 $p^2\nmid n$，则 $\varphi(n)=\varphi(\frac{n}{p})\times(p-1)$。

**性质 5** $\sum_{d\mid n}\varphi(d)=n$。

令 $f(x)=\sum_{d\mid x}\varphi(d)$，取 $mn=x$ 且 $\gcd(m,n)=1$。则

$$
\\begin{align}
  \\sum_{d\\mid mn}\\varphi(d)&=1+\\sum_{x\\mid m\\land x\\neq 1}\\varphi(x)+\\sum_{y\\mid n\\land y\\neq 1}\\varphi(y)+\\sum_{d\\mid mn\\land d\\nmid m\\land d\\nmid n\\land d\\neq 1}\\varphi(d) \\\\
                           &=1+\\sum_{x\\mid m\\land x\\neq 1}\\varphi(x)+\\sum_{y\\mid n\\land y\\neq 1}\\varphi(y)+\\sum_{d\\mid mn\\land d\\nmid m\\land d\\nmid n\\land d\\neq 1}\\varphi(\\gcd(d, m))\\varphi(\\gcd(d, n)) \\\\
                           &=1+\\sum_{x\\mid m\\land x\\neq 1}\\varphi(x)+\\sum_{y\\mid n\\land y\\neq 1}\\varphi(y)+\\sum_{x\\mid m\\land x\\neq 1}\\sum_{y\\mid n\\land y\\neq 1}\\varphi(x)\\varphi(y) \\\\
                           &=1+\\sum_{x\\mid m\\land x\\neq 1}\\varphi(x)+\\sum_{y\\mid n\\land y\\neq 1}\\varphi(y)+\\sum_{x\\mid m\\land x\\neq 1}\\varphi(x)\\sum_{y\\mid n\\land y\\neq 1}\\varphi(y) \\\\
                           &=\\left(1+\\sum_{x\\mid m\\land x\\neq 1}\\varphi(x)\\right)\\left(1+\\sum_{y\\mid n\\land y\\neq 1}\\varphi(y)\\right) \\\\
                           &=\\sum_{x\\mid m}\\varphi(x)\\sum_{y\\mid n}\\varphi(y)\\end{align}
$$

即 $f(mn)=f(m)f(n)$，$f(x)$ 为积性函数。

对于单质因子

$$
f(x^b)=\sum\limits_{i=0}^b\varphi(x^i)=1+\sum\limits_{i=1}^b(x-1)x^{i-1}=1+(x-1)\sum\limits_{i=0}^{b-1}x^i=1+(x-1)\frac{x^b-1}{x-1}=x^b
$$

于是，$f(x)=\sum_{d\mid x}\varphi(d)=x$。

## 结话

如果说，质数是数论的原子，那么因数就是数论的星桥。因为因数与倍数，整除与质数，才在乘法中，绘出璀璨的数论星河。

看，因数，就是那飘渺于繁星之间的鹊桥。
