---
title: 数学 - 数论 - 因数
tags:
  - '[I] 数学'
  - '[I] 数论'
categories:
  - Informatics
  - Notes
date: 2022-08-28 12:15:09
updated: 2022-10-11 23:42:59
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

### 二进制的 gcd 算法

在《算法导论》上学 Pollard Rho 的时候偶然翻到，因为取模运算常数巨大，而二进制的加减法、折半运算却能运行出不错的效果，因此我们考虑~~（钦定）~~

$$
\\begin{align}
\\gcd(x,y)=\\left\\{
  \\begin{array}{ll}
  2\\times\\gcd(x/2,y/2)\\qquad & \\textbf{if }2\\mid x\\land 2\\min y.\\\\
  \\gcd(y,(x-y)/2)\\qquad      & \\textbf{if }2\\nmid x\\land 2\\nmid y.\\\\
  \\gcd(x/2,y)\\qquad          & \\textbf{if }2\\mid x\\land 2\\nmid y.
  \\end{array}
  \\right.
\\end{align}
$$

### 最小公倍数

如 $x$ 同为 $a,b$ 的倍数，则称 $x$ 为 $a,b$ 的公倍数，其中最小的一个 $x$ 被称为最小公倍数，记作 $x=\operatorname{lcm}(a,b)$。

分解为质因子观察，发现 $\operatorname{lcm}(a,b)$ 包含 $a,b$ 共有的质因子和 $a,b$ 独有的质因子，即 $\operatorname{lcm}(a,b)=\gcd(a,b)\times\frac{a}{\gcd(a,b)}\times\frac{b}{\gcd(a,b)}=\frac{ab}{\gcd(a,b)}$，也就是

$$
\gcd(a,b)\times\operatorname{lcm}(a,b)=a\times b
$$

## 互质 & 欧拉函数

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

令 $f(x)=\sum_{d\mid x}\varphi(d)$，取 $mn=d$ 且 $\gcd(m,n)=1$。则

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

## Pollard Rho 大数分解算法

Pollard Rho 大数分解算法直接解决了分解出一个大合数的一个非平凡因子的问题，分解质因数需要递归处理。和 Miller-Rabin 一样，Pollard Rho 也是一个随机算法，并且比 Miller-Rabin 更加**玄学**。

### 生日悖论

以下内容摘自 [OI-Wiki](https://oi-wiki.org/math/number-theory/pollard-rho/#%E7%94%9F%E6%97%A5%E6%82%96%E8%AE%BA)。

  > 不考虑出生年份，问：一个房间中至少多少人，才能使其中两个人生日相同的概率达到 $50\%$?
  > 
  > 解：假设一年有 $n$ 天，房间中有 $k$ 人，用整数 $1, 2,\dots, k$ 对这些人进行编号。假定每个人的生日均匀分布于 $n$ 天之中，且两个人的生日相互独立。
  > 
  > 设 k 个人生日互不相同为事件 $A$, 则事件 $A$ 的概率为
  > 
  > $$
  > P(A)=\frac{n}{n} \times \frac{n-1}{n} \times \dots \times \frac{n-k+1}{n}
  > $$
  > 
  > 至少有两个人生日相同的概率为 $P(\overline A)=1-P(A)$。根据题意可知 $P(\overline A)\ge\frac{1}{2}$, 那么就有 $1 \times \frac{n-1}{n} \times \dots \times \frac{n-k+1}{n} \le \frac{1}{2}$
  > 
  > 由不等式 $1+x\le e^x$ 可得
  > 
  > $$
  > \begin{gathered}
  > P(A) \le e^{-\frac{1}{n}}\times e^{-\frac{2}{n}}\times \dots \times e^{-\frac{k-1}{n}}=e^{-\frac{k(k-1)}{2n}}\le\frac{1}{2}\\
  > e^{-\frac{k(k-1)}{2n}}\le\frac{1}{2}
  > \end{gathered}
  > $$
  > 
  > 然而我们可以得到一个不等式方程，$e^{-\frac{k(k-1)}{2n}}\le 1-p$，其中 $p$ 是一个概率。
  > 
  > 将 $n=365$ 代入，解得 $k=23$。所以一个房间中至少 23 人，使其中两个人生日相同的概率达到 $50\%$, 但这个数学事实十分反直觉，故称之为一个悖论。
  > 
  > 当 $k>56$，$n=365$ 时，出现两个人同一天生日的概率将大于 $99\%$。那么在一年有 $n$ 天的情况下，当房间中有 $\sqrt{\dfrac{n}{\ln 2}}$ 个人时，至少有两个人的生日相同的概率约为 $50\%$。
  > 
  > 考虑一个问题，设置一个数据 $n$，在 $[1,1000]$ 里随机选取 $i$ 个数（$i=1$ 时就是它自己），使它们之间有两个数的差值为 $k$。当 $i=1$ 时成功的概率是 $\frac{1}{1000}$，当 $i=2$ 时成功的概率是 $\frac{1}{500}$（考虑绝对值，$k_2$ 可以取 $k_1-k$ 或 $k_1+k$），随着 $i$ 的增大，这个概率也会增大最后趋向于 1。

### Pollard 的 Rho 环

假设大合数 $N$ 存在一个非平凡因子 $P$，如果我们能够得到一个 $x$，使得 $N\nmid x$ 并且 $P\mid x$，那么我们就能够通过计算 $\gcd(x,N)$ 得到非平凡因子 $P$。

接下来我们要生成 $x$。试想，根据奇妙的生日悖论，我们随机生成两个数 $i,j$，希望 $i\equiv j\pmod P$。生日悖论告诉我们，随机生成数，出现模 $P$ 意义下同余的两个数的期望步数为 $\sqrt{N}$，而大合数 $N$ 一定存在一个非平凡因子 $P\leq\sqrt{N}$，因此期望在 $O(N^{\frac{1}{4}})$ 的时间内分解出 $N$ 的非平凡因子 $P$。

生日悖论的实质是：由于采用「组合随机采样」的方法，满足答案的组合比单个个体要多一些。这样可以提高正确率。

但是这样做有一个问题，我们虽然在期望 $O(\sqrt{P})$ 的时间内随出了两个模 $P$ 同余的数，但若要两两验证所需要的时间是 $O\left(\left(N^\frac{1}{4}\right)^2\right)=O(\sqrt{N})$ 的，和试除法一个级别。

接下来，开始玄学……

我们考虑一个伪随机数列 $x$，是这样定义的：$x_i=(x_{i-1}^2+C)\bmod N$，$C$ 是随机生成的一个常数，《算法导论》上说应该避免 $0$ 和 $2$。经过实践，它表现得与随机数列相差无几，也就是说它是“足够”随机的，但是由于生成这个数列基于固定的递推式，因此称为伪随机数列。显而易见的是，它将在某个时刻进入循环节，就像这样（图源 [OI-Wiki](https://oi-wiki.org/math/number-theory/pollard-rho/#%E6%9E%84%E9%80%A0%E4%BC%AA%E9%9A%8F%E6%9C%BA%E5%87%BD%E6%95%B0)）

{% asset_img Pollard-rho1.png '"" "Pollard 的 Rho 环"' %}

因为这样的循环节长得像希腊字母 $\rho$，因此我们称这个算法为 Pollard Rho。根据生日悖论，我们这个 $\rho$ 环的「环部」与「尾部」的长度均期望为 $\sqrt{N}$。

在这个 $\rho$ 环上，我们可以看到，给定 $x_i,x_j$，如果有 $\gcd(|x_i-x_j|，N)\neq1$，那么 $x_{i+1}-x_{j+1}\equiv x_i^2-x_j^2\equiv(x_i-x_j)(x_i+x_j)\pmod N$，也满足 $\gcd(|x_{i+1}-x_{j+1}|,N)\neq1$。也就是说，相同距离的 $(i,j)$ 二元组有很大概率是等效的。因此，在这个数列上，我们可以粗略地只按照 $i,j$ 在 $\rho$ 环上的距离观察，虽然这样做可能会造成非平凡因子的损失，但影响无伤大雅。因此，我们可以考虑观察在 $\rho$ 环上不同距离的 $i,j$，尝试计算 $\gcd(|x_i-x_j|,N)$ 来分解 $N$ 的非平凡因子。

形象地说，我们再生成一个序列 $y$，$y_i=x_i\bmod P$，虽然我们不知道 $P$ 也就不能计算出 $y$，但是我们隐性地知道有这样一个数列。如果 $i,j$ 在 $N-\rho$ 环上处于不同位置，而在 $P-\rho$ 上处于同一位置，那么就可以通过 $\gcd(|x_i-x_j|,N)$ 计算出 $P$。显然，$P-\rho$ 环的环部是 $N-\rho$ 环的环部的循环节。

问题在于这是一个 $\rho$ 环，由于时空限制我们并不能快速知道是否已经遍历完了环。比较朴素的做法是，枚举 $i$，再从 $i+1$ 开始枚举倍增数量的 $j$，然后将 $i$ 跳到最后一个枚举的 $j$ 的位置进行下一次倍增。我们以下提供两种解决方案。

### Floyd 判环

我们把 $\rho$ 环看成赛道，如果有 $A$ 以 $2$ 个单位的速度，$B$ 以 $1$ 个单位，从起点同时起跑，那么他们一定会在 $\rho$ 环的环部某个位置再次相遇。我们大致也可以选择一个 $s,t$，每次 $s$ 计算两次 $s=(s^2+C)\bmod P$，$t$ 计算一次 $t=(t^2+C)\bmod P$，类比 $2$ 个单位速度和 $1$ 个单位速度。那么每次两者的距离将会变化 $1$，我们就计算一次 $\gcd(|s-t|,N)$，就是按照不同距离 $i,j$ 尝试分解了 $P$。

同理，我们在 $N-\rho$ 环上既然是两倍比的速度，在 $P-\rho$ 环上也应是两倍比的速度。一般情况下，我们的 $s,t$ 在 $P-\rho$ 环上相遇的期望步数为 $O(\sqrt{P})$，此时我们可以得出答案退出。而如果我们在 $N-\rho$ 环上相遇了，我们将在期望 $O(\sqrt{N})$ 的时间后退出。

此时请注意，一般情况下我们只要在 $N-\rho$ 环上经过了 $P-\rho$ 环的环部期望长度，那么就应该得出 $P$ 而退出。如果过早就在 $N-\rho$ 环上相遇，说明此时的时间还不足 $P-\rho$ 环的期望长度即 $O(\sqrt{P})$，因此无解退出的期望时间也是 $O(\sqrt{P})$ 的。

我们判断无解退出过后，就再随一个 $C$ 进行一次 Pollard Rho。还需要注意的是，这样写的 Pollard Rho 会在 $N=4$ 的时候分解不出结果，此时需要特判。

```cpp
long long Pollard_Rho(long long x)
{
    if (x == 4) return 2;
    long long c = eng() % (x - 1) + 1;
    while (c == 2) c = eng() % (x - 1) + 1;
    __int128 s = 0, t = 0;
    do
    {
        s = (s * s + c) % x;
        t = (t * t + c) % x;
        t = (t * t + c) % x;
        long long d = gcd(llabs(s - t), x);
        if (d > 1) return d;
    } while (s != t);
    return x;
}
```

### 倍增优化

我们回顾刚才的朴素方法和 Floyd 判环写法。为了防止 $\gcd$ 调用次数过多消耗时间，我们可以累计因子，过一段时间统一与 $N$ 进行一次 $\gcd$。具体地说，在倍增方法的基础上，倍增每次都先将 $x_t-x_s$ 乘起来，之后将乘积与 $N$ 做一次 $\gcd$。而同时为了防止倍增区间增长地过长而耗费我们过多时间，我们需要适时地计算一下 $\gcd$，一般来说每隔 $127$ 次计算一次。在倍增过程中，如果出现 $x_s=x_t$ 即说明 $s,t$ 均已进入环部且完成了循环节，是时候退出了。 

```cpp
long long Pollard_Rho(long long x)
{
    __int128 s, t = 0, val = 1;
    long long c = eng() % (x - 1) + 1;
    while (c == 2) c = eng() % (x - 1) + 1;
    for (int goal = 1;; goal <<= 1, s = t, val = 1)
    {
        for (int step = 1; step <= goal; step++)
        {
            t = (t * t + c) % x;
            val = val * llabs(s - t) % x;
            if (step % 127 == 0)
            {
                long long d = gcd(val, x);
                if (d > 1) return d;
            }
        }
        long long d = gcd(val, x);
        if (d > 1) return d;
    }
}
```

### T 【模板】Pollard-Rho算法

评测链接：<https://www.luogu.com.cn/problem/P4718>

我们将 Pollard-Rho 用于分解质因数时，首先 Miller-Rabin 判断该数是否为质数，如果为质数直接返回，如果为合数则用 Pollard-Rho 分解出非平凡质因子过后递归处理。

在本题中，需要用到倍增优化写法的 Pollard-Rho，用 Floyd 判环写法的会 TEL 93。

```cpp
#include <cstdio>
#include <cmath>
#include <ctime>
#include <iostream>
#include <algorithm>
#include <random>

std::mt19937 eng(time(0));

long long gcd(long long x, long long y)
{
    if (x < y) std::swap(x, y);
    while (y) y = (x + 0) % (x = y);
    return x;
}

__int128 pow(__int128 x, long long b, long long p)
{
    __int128 res = 1;
    while (b)
    {
        if (b & 1) res = res * x % p;
        x = x * x % p;
        b >>= 1;
    }
    return res;
}

bool Miller_Rabin(long long x)
{
    if (x == 2) return true;
    if (!(x & 1)) return false;

    long long d = x - 1;
    int s = 0;
    while (!(d & 1))
    {
        d >>= 1;
        s++;
    }

    for (int i = 1; i <= 8; i++)
    {
        __int128 y = pow(eng() % (x - 2) + 2, d, x);
        if (y == 1) continue;
        for (int j = 1; j <= s; j++)
        {
            if (y == x - 1) break;
            y = y * y % x;
        }
        if (y != x - 1) return false;
    }

    return true;
}

long long Pollard_Rho(long long x)
{
    __int128 s, t = 0, val = 1;
    long long c = eng() % (x - 1) + 1;
    while (c == 2) c = eng() % (x - 1) + 1;
    for (int goal = 1;; goal <<= 1, s = t, val = 1)
    {
        for (int step = 1; step <= goal; step++)
        {
            t = (t * t + c) % x;
            val = val * llabs(s - t) % x;
            if (step % 127 == 0)
            {
                long long d = gcd(val, x);
                if (d > 1) return d;
            }
        }
        long long d = gcd(val, x);
        if (d > 1) return d;
    }
}

long long solve(long long x)
{
    if (Miller_Rabin(x)) return x;
    long long d = Pollard_Rho(x);
    while (d == x) d = Pollard_Rho(x);
    return std::max(solve(d), solve(x / d));
}

int T;
long long x;

int main()
{
    scanf("%d", &T);
    while (T--)
    {
        scanf("%lld", &x);
        if (Miller_Rabin(x)) puts("Prime");
        else printf("%lld\n", solve(x));
    }
    return 0;
}
```

是否感觉 Pollard Rho 听得晕乎乎的呢？~~别问，问就是玄学。~~有一句古话叫做：「学而不思则罔。」

## 结话

如果说，质数是数论的原子，那么因数，便是数论的星桥。因为因数与倍数，整除与质数，才在乘法中，绘出璀璨的数论星河。

看，因数，就是那飘渺于繁星之间的鹊桥。

<div class="popular-posts-header">参考资料</div>

  - 《信息学奥赛一本通 · 提高篇》 - 《第六部分 第 3 章 因数》
  - [分解质因数 - OI Wiki](https://oi-wiki.org/math/number-theory/pollard-rho/)
  - 《算法导论》 - 《31.9 整数的因子分解》
  