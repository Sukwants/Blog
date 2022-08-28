---
title: 数学 - 数论 - 质数
tags:
  - '[I] 数学'
  - '[I] 数论'
categories:
  - Informatics
  - Notes
date: 2022-08-21 21:33:03
---


数论的原子

<!--more-->

## 整除

根据初中数学竞赛知识，带余数除法的标准定义是 $a=px+r(a,p,x,r\in\mathbf{N})$，其中 $p$ 称为 $a$ 除以 $x$ 的商，$r$ 称为 $a$ 除以 $x$ 的余数。一般，我们取 $[0,x-1]$ 范围内的 $r$。

当 $r=0$，我们称 $a$ 被 $x$ 整除，或者 $x$ 整除 $a$，记作 $x\mid a$。否则，我们称 $a$ 不被 $x$ 整除，或者 $x$ 不整除 $a$，记作 $x\nmid a$。

## 质数

又称素数。对于一个数 $n>1$，若 $\forall x\in[2,n-1],x\nmid n$，则称 $n$ 为质数。否则称 $n$ 为合数。质数与合数是在大于 $1$ 的整数域上划分的，因此讨论小于等于 $1$ 的数或分数是没有意义的。

这样不能再分的特性，可以比作化学上的原子。

对于一个足够大的 $N$，不超过 $N$ 的质数大约有 $\frac{N}{\ln N}$ 个。

## 质数的判定

### T 质数筛

评测链接：<https://www.luogu.com.cn/problem/P5736>

输入 $n$ 个不大于的正整数，依次输出其中的质数。

### 试除法

根据定义，对于一个数 $n>1$，若 $\forall x\in[2,n-1],x\nmid n$，则 $n$ 为质数。改一种说法，若 $\exists x\in[2,n-1],x\mid n$，则 $n$ 为合数。接着看，如果存在 $x\mid n$ 且 $x>\sqrt{n}$，那么一定存在 $y=\dfrac{n}{x}$，这里 $y\mid n$ 且 $y<\sqrt{n}$，因此若 $n$ 为合数，则一定存在 $x\in[2,\sqrt{n}],x\mid n$。

因此，我们的做法是扫描 $2\sim\sqrt{n}$，判断 $n$ 是否能被其中某数整除。

时间复杂度为 $O(\sqrt{n})$。

```cpp
#include <cstdio>

bool isprime(int x)
{
    if (x < 2) return false;
    for (int i = 2; i * i <= x; ++i)
    {
        if (x % i == 0) return false;
    }
    return true;
}

int n, a;

int main()
{
    scanf("%d", &n);

    for (int i = 1; i <= n; ++i)
    {
        scanf("%d", &a);
        if (isprime(a)) printf("%d ", a);
    }

    return 0;
} 
```

### Miller-Robbin 算法

Miller-Robbin 是一种随机性算法，有较小的概率将合数误判为质数，因此我们多次判定，合起来错误概率趋近于零。

Miller-Robbin 基于费马小定理。费马小定理是这样描述的，若 $p$ 为质数且 $p\nmid a$，那么有

$$
a^{p-1}\equiv1\ (\bmod\ p)
$$

我们的思路就是任找一个 $a$，用快速幂计算 $\mathit{Ans}=a^{n-1}\mod n$，如果 $\mathit{Ans}=1$ 则 $n$ 为质数，否则 $n$ 为合数。

这里应用的事实上是费马小定理的逆定理。Unluckily，费马小定理的逆定理并不是一个真命题。

反例，当 $a=2,p=341$ 时 $a^{p-1}\equiv1\ (\bmod\ p)$，但 $p=341=11\times 31$ 是一个合数。我们称这样的数为伪质数。

这意味着我们有概率错判，但这样也好办，大概多操作几次，这样错误概率就趋近于零了。重复操作大约 30 次，便能将正确率提高到我们期望的水平。当然，如果遇到一些毒瘤的出题人，比如说 [[LOJ143]质数判定](https://loj.ac/p/143)，那就寄了。

时间复杂度为 $O(k\log n)$，$k$ 为重复操作次数。

```cpp
#include <cstdio>
#include <cstdlib>
#include <ctime>

int pow(long long x, int b, int mod)
{
    long long Ans = 1;
    while (b)
    {
        if (b & 1) Ans = (Ans * x) % mod;
        x = (x * x) % mod;
        b >>= 1;
    }
    return Ans;
}

bool isprime(int x)
{
    if (x < 2) return false;
    if (x == 2) return true;
    for (int i = 1; i <= 30; ++i) if (pow(rand() % (x - 2) + 2, x - 1, x) != 1) return false;
    return true;
}

int n, a;

int main()
{
    scanf("%d", &n);

    srand(time(0));
    for (int i = 1; i <= n; ++i)
    {
        scanf("%d", &a);
        if (isprime(a)) printf("%d ", a);
    }

    return 0;
} 
```

为了让 Miller-Robbin 更加正确，我们引入一个二次探测定理。它是这样描述的，若 $p$ 为一个奇质数，那么使得 $x^2\equiv1\pmod{p}$ 的小于 $p$ 的 $x$ 满足 $x=1$ 或 $x=p-1$。

欲证明此定理，因为 $x^2-1\equiv1\pmod{p}$，所以 $p\mid x^2-1$ 即 $p\mid(x+1)(x-1)$，所以 $p\mid x+1$ 或 $p\mid x-1$，即 $x+1\equiv0\pmod{p}$ 或 $x-1\equiv0\pmod{p}$，又因为 $x<p$，所以 $x=1$ 或 $x=p-1$。

然后我们 Miller-Robbin 的做法是，首先将 $n-1$ 中的因子 $2$ 全部拆出来剩余 $d$，记录因子 $2$ 的数量 $b$。每次随机一个数 $a$，计算 $y=a^d$，然后平方 $b$ 次，在平房过程中如果出现 $y\not\equiv1$ 且 $y\not\equiv n-1$ 而 $y^2\equiv1$ 的情况，则该数不为质数。

大概，还是需要重复至少 $8$ 次。

```cpp
#include <cstdio>
#include <cstdlib>
#include <ctime>

int pow(long long x, int b, int mod)
{
    long long Ans = 1;
    while (b)
    {
        if (b & 1) Ans = (Ans * x) % mod;
        x = (x * x) % mod;
        b >>= 1;
    }
    return Ans;
}

bool isprime(int x)
{
    if (x < 2) return false;
    if (x == 2) return true;
    if (!(x & 1)) return false;

    int d = x - 1, b = 0;
    while (!(d & 1)) d >>= 1, ++b;
    for (int i = 1; i <= 8; ++i)
    {
        int y = pow(rand() % (x - 2) + 2, d, x);
        if (y == 1 || y == x - 1) continue;
        for (int j = 1; j < b; ++j)
        {
            y = 1ll * y * y % x;
            if (y == x - 1) break;
            if (y == 1) return false;
        }
        if (y != x - 1) return false;
    }
    return true;
}

int n, a;

int main()
{
    scanf("%d", &n);

    srand(time(0));
    for (int i = 1; i <= n; ++i)
    {
        scanf("%d", &a);
        if (isprime(a)) printf("%d ", a);
    }

    return 0;
} 
```

## 质数的筛选

给定一个整数 $n$，求出 $1\sim n$ 之间的所有质数，称为质数的筛选问题。

### Eratosthenes 筛法

筛法一般是指 Eratosthenes 筛法，又称埃氏筛法。Eratosthenes 筛法基于这样的思想，任意整数 $x$ 除自身外的倍数均为合数，因此通过筛除倍数（合数）来筛出质数。对每个数，将其在 $1\sim n$ 范围内除自身外的所有倍数标记为合数，最终未被标记的数即为质数。

显然，这还比较朴素~~（暴力）~~。我们关注到，首先，一个合数的倍数一定是它的一个质因数的倍数，因此我们只需要对质数的倍数筛除即可；其次，整数 $x$ 的 $2,3,...,x-1$ 倍一定在之前已经被筛过，因此我们对每个数需要筛它的 $x,x+1,...,\lfloor\frac{n}{x}\rfloor$ 倍数。

可以概括为，将不大于 $\sqrt{n}$ 的所有质数的非 $1$ 倍数剔除，剩下的就是质数。

$$
\\begin{array}{l}
  & \\text{SIEVE-OF-ERATOSTHENES}(N) \\\\
  & \\begin{array}{rl}
    1 &  \\textbf{for } i \\gets 2 \\text{ to } N \\\\
    2 &  \\qquad \\textbf{if } v_i = 0 \\\\
    3 &  \\qquad \\qquad \\text{Number } i \\text{ is a prime number.} \\\\
    4 &  \\qquad \\qquad \\textbf{for } k \\gets i \\text{ to } \\left\\lfloor\\frac{N}{i}\\right\\rfloor \\\\
    5 &  \\qquad \\qquad \\qquad v_{ki} \\gets 1
    \\end{array}
\\end{array}
$$

时间复杂度为 $O(N\log\log N)$。

### 线性筛法

线性筛法基于这样的思想，因为唯一分解定理，所以对任何一个合数 $n$，均可以分解为若干质因数之积，其中必然有一个最小的质因子 $p_n$。我们就在循环到 $\frac{n}{p_n}$ 的时候将 $n$ 筛除（先不论如何筛除），我们这样能明确所有合数 $n$ 都将被唯一的 $\frac{n}{p_n}$ 筛除。

因为 $p_n$ 是 $n$ 的最小质因子，所以满足 $p_n\leq p_{\frac{n}{p_n}}$。那么合数 $x$ 能被 $y$ 筛除，当且仅当 $y\mid x$ 且 $\frac{x}{y}\leq p_y$。我们在循环到 $i$ 时，只需要将 $2,3,...,p_i$ 倍的 $i$ 筛除即可。这样，所有的合数 $n$ 都将作为 $p_n$ 倍的 $\frac{n}{p_n}$ 被筛除。

$$
\\begin{array}{l}
  & \\text{LINEAR-SIEVE}(N) \\\\
  & \\begin{array}{rl}
    1 &  \\textbf{for } i \\gets 2 \\text{ to } \\sqrt{N} \\\\
    2 &  \\qquad \\textbf{if } p_i = 0 \\\\
    3 &  \\qquad \\qquad \\text{Number } i \\text{ is a prime number.} \\\\
    4 &  \\qquad \\qquad p_i \\gets i \\\\
    5 &  \\qquad \\textbf{for } k \\gets 2 \\text{ to } p_i \\\\
    6 &  \\qquad \\qquad p_{ki} \\gets k
    \\end{array}
\\end{array}
$$

时间复杂度为 $O(N)$。

### T Prime Distance

评测链接：<https://loj.ac/p/10197>

求闭区间 $[L,R]$ 中相邻质数对差值最小的数对和差值最大的数对。$1 \leq L < R < 2^{31}, R - L \leq 10^6$。

<br>

我们需要筛出 $[L,R]$ 中所有的质数，然后扫描一遍求解。筛质数的时候，我们发现 $L,R$ 的范围很大，但是 $R-L$ 却不足大。此时线性筛法是 $O(R)$ 的，行不通。

Eratosthenes 筛法告诉我们可以通过筛除 $[2,\sqrt{R}]$ 中所有质数的非 $1$ 倍数，因此我们可以先筛出 $[2,\sqrt{R}]$ 的所有质数，然后对每个 $x\in[2,\sqrt{R}]$ 筛除 $i=\left[\left\lceil\frac{L}{x}\right\rceil,\left\lfloor\frac{R}{x}\right\rfloor\right]$ 倍的 $x$ 即可。

```cpp
#include <iostream>
#include <cstdio>
#include <cmath>
#include <cstring>
#include <utility>

using namespace std;

int L, R;
int p[1000005], v[1000005];
pair<int, int> Ans1, Ans2;
int lst;

int main()
{
    while (scanf("%d%d", &L, &R) != EOF)
    {
        memset(p, 0, sizeof p);
        memset(v, 0, sizeof v);
        for (int i = 2; 1ll * i * i <= R; ++i)
        {
            for (int j = i; 1ll * j * i * j * i <= R; ++j) p[j * i] = 1;
            if (p[i] == 0) for (int j = max(2ll, (L - 1ll + i) / i); 1ll * j * i <= R; ++j) v[j * i - L] = 1;
        }
        
        lst = 0;
        Ans1 = make_pair(0, 0x3f3f3f3f);
        Ans2 = make_pair(1, 0);
        for (int i = max(2 - L, 0); i <= R - L; ++i)
        {
            if (!v[i])
            {
                if (lst != 0)
                {
                    Ans1 = Ans1.second - Ans1.first <= i + L - lst ? Ans1 : make_pair(lst, i + L);
                    Ans2 = Ans2.second - Ans2.first >= i + L - lst ? Ans2 : make_pair(lst, i + L);
                }
                lst = i + L;
            }
        }
        
        if (Ans2.first < Ans2.second) printf("%d,%d are closest, %d,%d are most distant.\n", Ans1.first, Ans1.second, Ans2.first, Ans2.second);
        else puts("There are no adjacent primes.");
    }
    
    return 0;
}
```

## 质因数分解

### 算术基本定理

又称唯一分解定理。任一大于 $1$ 的正整数都能唯一分解为有限个质数的乘积，记作

$$
N=p_1^{c_1}p_2^{c_2}...p_m^{c_m}
$$

### 试除法

借鉴质数判定的试除法，我们用 $N'$ 来寄存 $N$，从 $2$ 扫描到 $\sqrt{N'}$，其中 $N'$ 指的是剩余的 $N$。每次扫描到剩余的 $N'$ 的一个因数 $x$，就从 $N'$ 中剔除所有因子 $x$，更新剩余的 $N'$。最后若剩余的 $N'$ 非 $1$，则 $N'$ 也为原 $N$ 的一个质因子。

$$
\\begin{array}{l}  & \\text{DECOMPOSITION}(N) \\\\  & \\begin{array}{rl}    1 &  i = 2 \\\\    2 &  \\textbf{while } i^2 \\leq N \\\\    3 &  \\qquad \\textbf{while } i \\mid N \\\\    4 &  \\qquad \\qquad \\text{Write down or count up Prime Factor } i. \\\\    5 &  \\qquad N \\gets \\frac{N}{i} \\\\    6 &  \\textbf{if } N \\neq 1 \\\\    7 &  \\qquad \\text{Write down or count up Prime Factor } N.    \\end{array}\\end{array}
$$

时间复杂度为 $O(\sqrt{N})$。

### Pollard's Rho 算法

Pollard's Rho 算法是用来快速找到大合数的一个因数的。

有一种想法是这样的

$$
\\begin{array}{l}  & \\text{DECOMPOSITION}(N) \\\\  & \\begin{array}{rl}    1 &  \\textbf{do} \\\\    2 &  \\qquad x = \\text{RANDOM}(2,N-1) \\\\    3 &  \\textbf{while } N \\bmod x \\neq 0 \\\\    4 &  \\textbf{return } x    \\end{array}\\end{array}
$$

看着有点像搞笑的，但是 Pollard's Rho 算法确实是基于这样的思想。另外，其实上面那玩意儿还可以改进。

$$
\\begin{array}{l}  & \\text{DECOMPOSITION}(N) \\\\  & \\begin{array}{rl}    1 &  \\textbf{do} \\\\    2 &  \\qquad x = \\text{GCD}(\\text{RANDOM}(2,N-1),N) \\\\    3 &  \\textbf{while } x = 1 \\\\    4 &  \\textbf{return } x    \\end{array}\\end{array}
$$

由于生日悖论什么乱七八糟的，期望在 $\sqrt{N}$ 的步数过后随机值会出现重复。我们这里用上伪随机序列。

$$
A={a_1,a_2,...a_n}
$$

其中，每个 $a_{i+1}$ 由 $a_i$ 通过固定的方式生成。比如一般来说，我们会用 $a_{i+1}=(a_i^2+c) \bmod N$，$c$ 是一个常数。我们的随机值就用 $|a_i-a_{2i}|$ 代替。

利用这个方式生成随机数到达一定时候一定会出现循环，形成类似希腊字母 $\rho$ 的造型，故因此而得名。我们判断什么时候出现循环，就在于 Floyd 提出的一个算法，形象说就是在圆形轨道上，让 B 的速度为 A 的速度的 $2$ 倍，那么当 B 第一次追上 A 就知道已经结束了循环节。因此我们会用 $|a_i-a_{2i}|$。

代码就算了吧。

## 结话

质数在数论的意义上，是乘法不可再分。根据算数基本定理，就是组成数的最小因子。这好比化学上的原子，不可再分的最小粒子。

数论者，往往复复，不过在质因子上做文章罢了。
