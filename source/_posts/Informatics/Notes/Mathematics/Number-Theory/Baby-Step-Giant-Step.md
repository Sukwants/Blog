---
title: Baby Step, Giant Step 算法
tags:
  - '[I] 数学'
  - '[I] 数论'
categories:
  - Informatics
  - Notes
date: 2022-11-16 23:06:31
---


约定在最美的鲜花丛中

<!--more-->

## 高次同余方程

高次同余方程有 $a^x\equiv b\pmod p$ 和 $x^a\equiv b\pmod p$ 两种形式，Baby Step, Giant Step 算法讨论的是前者。

## BSGS 算法

**T 可爱的质数**

题目来源：TJOI 2007
评测链接：<https://www.luogu.com.cn/problem/P3846>

给定一个质数 $p$，以及一个整数 $b$，一个整数 $n$，现在要求你计算一个最小的非负整数 $l$，满足 $b^l \equiv n \pmod p$。

为了表述方便，我们重新定义字母，方程改写为 $a^x\equiv b\pmod p$。

普通的 BSGS 算法处理 $a$ 与 $p$ 互质的情况，这里 $p$ 是质数且 $a<p$ 自然 $(a,p)=1$。

根据欧拉定理有 $a^{\varphi(p)}\equiv 1\pmod p$，因此答案如果存在一定在 $[0,\varphi(p)-1]$ 以内，也就一定在 $[0,p-2]$ 以内。

令 $t=\lceil\sqrt{p}\rceil$，设 $x=it-j(i\in[1,t],j\in[0,t])$，显然这样我们能够表示出 $[0,p-2]$ 的所有数，甚至还有重复和多余。

利用哈希表直接寻址降低时间复杂度。做法是，将 $a^{it-j}\equiv b\pmod p$ 化为 $(a^t)^i\equiv b\times a^j\pmod p$，将右边的存入哈希表，对左边的每个 $i$ 在哈希表内寻找对应的 $j$，期望时间复杂度为 $O(\sqrt{p})$。

也就是，我们本来对于 $p$ 规模的枚举，通过 Meet in the Middle 的思想，化为两个 $\sqrt{p}$，在哈希表内直接寻址得出答案。这个样子我们相当于第二个 $\sqrt{p}$ 由遍历 $O(\sqrt{p})$ 降为了 $O(1)$。

实现的时候需要注意，我们无论是将 $b\times a^j$ 插入哈希表，还是将 $(a^t)^i$ 插入哈希表，在计算结果相同时都需要保留对最终答案更优的一个。如果使用 `map` 直接覆盖或者拉链法从头部插入，那么需要正序将 $b\times a^j$ 插入，或者倒序将 $(a^t)^i$ 插入。

（手写哈希的屑）

{% contentbox type:success title:参考代码 %}

```cpp
#include <cstdio>
#include <cmath>
#include <iostream>

using namespace std;

namespace Hash_Table
{
    const double s = (sqrt(5) - 1) / 2 * (1ll << 32);
    const unsigned MOD = 1e6 + 7, MAXN = 1e5;
    int h[MOD], nxt[MAXN + 5], ky[MAXN + 5], dt[MAXN + 5], tot = 0;
    int hash(int x) { return unsigned((long long)(x * s)) % MOD; }
    void insert(int x, int y)
    {
        int k = hash(x);
        ++tot;
        nxt[tot] = h[k];
        ky[tot] = x;
        dt[tot] = y;
        h[k] = tot;
    }
    int find(int x)
    {
        int k = hash(x);
        for (int i = h[k]; i; i = nxt[i]) if (ky[i] == x) return dt[i];
        return -1;
    }
}

int pow(long long x, int b, int m)
{
    long long res = 1;
    while (b)
    {
        if (b & 1) res = res * x % m;
        x = x * x % m;
        b >>= 1;
    }
    return res;
}

int a, p, b;

int Ans = 0x7fffffff;

int main()
{
    scanf("%d%d%d", &p, &a, &b);

    int t = ceil(sqrt(p));
    long long s = b % p;
    for (int i = 0; i <= t; ++i, s = s * a % p) Hash_Table::insert(s, i);
    
    int f = pow(a, t, p);
    s = f;
    for (int i = 1; i <= t; ++i, s = s * f % p)
    {
        int d = Hash_Table::find(s);
        if (~d) Ans = min(Ans, i * t - d);
    }

    if (Ans == 0x7fffffff) puts("no solution");
    else printf("%d\n", Ans);

    return 0;
}
```
{% endcontentbox %}

总之，就是用两个 $\sqrt{p}$，Meet in the Middle。

## 扩展 BSGS 算法

**T 【模板】扩展 BSGS/exBSGS**

题目来源：SPOJ 3105
评测链接：<https://www.luogu.com.cn/problem/P4195>

给定 $a,p,b$，求满足 $a^x\equiv b \pmod p$ 的最小自然数 $x$ 。

扩展 BSGS 增加考虑了 $(a,p)\neq 1$ 的情况，我们的做法是把它变成 $(a,p)=1$ 的情况。

首先，我们对于 $x\equiv y\pmod m$，如果 $d\mid x$ 且 $d\mid m$，有 $\frac{x}{d}\equiv\frac{y}{d}\pmod{\frac{m}{d}}$。

那么对于 $a^x\equiv b\pmod m$，如非 $x=0$（此时 $b=1$），则有 $\frac{a^x}{(a,p)}\equiv\frac{b}{(a,p)}\pmod{\frac{p}{(a,p)}}$。

在除的时候，如果发现 $(a,p)\nmid b$ 且 $b\neq 1$，方程无解。

此时我们的方程变成了，$a^{x-1}\times\frac{a}{(a,p)}\equiv\frac{b}{(a,p)}\pmod{\frac{p}{(a,p)}}$。

抛开 $\times\frac{a}{(a,p)}$ 不看，我们还能继续对现在的 $a$ 和 $p'=\frac{p}{(a,p)}$ 执行以上操作，直到 $(a,p')=1$。

在以上操作中，如非 $b'=1$ 得出答案或者 $(a,p')\nmid b'$ 得出无解，最终我们将得到形如 $a^{x-k}\times s\equiv b'\pmod{p'}$ 的方程，此时将 $s$ 的逆元乘到右边去，用 BSGS 解一下方程，答案加上 $k$ 就是原方程的答案。

（道理我都懂，可是为什么这道题卡常啊）

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cmath>
#include <cstring>
#include <algorithm>

using namespace std;

namespace IO
{
    const int T = 1 << 20;
    char Ibuf[T], *p1 = Ibuf, *p2 = Ibuf;
    char getchar() { return (p1 == p2 && (p2 = Ibuf + fread(p1 = Ibuf, 1, T, stdin), p1 == p2)) ? EOF : *p1++; }
    template <class T> void read(T &x) {
        x = 0; int sign = 1; static char ch = getchar();
        while (ch < '0' || ch > '9') { if (ch == '-') sign = -1; ch = getchar(); }
        while (ch >= '0' && ch <= '9') x = (x << 3) + (x << 1) + (ch ^ 48), ch = getchar();
        x = x * sign;
    }
    char Obuf[T], *pp = Obuf;
    void putchar(char ch) { if (pp - Obuf == T) fwrite(pp = Obuf, 1, T, stdout); *pp++ = ch; }
    void puts(const char *s) { while (*s) putchar(*s++); putchar('\n'); }
    void flush() { fwrite(Obuf, 1, pp - Obuf, stdout); pp = Obuf; }
    char stk[128], w = 0;
    template <class T> void write(T x) {
        if (x == 0) return putchar('0'), void();
        if (x < 0) putchar('-'), x = -x;
        while (x) stk[w++] = (x % 10) | 48, x /= 10;
        while (w) putchar(stk[--w]);
    }
}

namespace Hash_Table
{
    const double s = (sqrt(5) - 1) / 2 * (1ll << 32);
    const unsigned MOD = 1e6 + 7, MAXN = 1e5;
    int h[MOD], nxt[MAXN + 5], ky[MAXN + 5], dt[MAXN + 5], tot;
    int modified[MOD], cnt = 0;
    int hash(int x) { return unsigned((long long)(x * s)) % MOD; }
    void insert(int x, int y)
    {
        int k = hash(x);
        ++tot;
        nxt[tot] = h[k];
        ky[tot] = x;
        dt[tot] = y;
        if (!h[k]) modified[cnt++] = k;
        h[k] = tot;
    }
    int find(int x)
    {
        int k = hash(x);
        for (int i = h[k]; i; i = nxt[i]) if (ky[i] == x) return dt[i];
        return -1;
    }
    void clear() { while (cnt) h[modified[--cnt]] = 0; tot = 0; }
}

int gcd(int x, int y)
{
    while (y) swap(x, y), y = y % x;
    return x;
}

int exgcd(int a, int b, long long &x, long long &y)
{
    if (!b) return x = 1, y = 0, a;
    int res = exgcd(b, a % b, y, x);
    y = y - a / b * x;
    return res;
}

int inv(int a, int p)
{
    long long x, y;
    int res = exgcd(a, p, x, y);
    if (res > 1) return -1;
    else return (x % p + p) % p;
}

int pow(long long x, int b, int p)
{
    long long res = 1;
    while (b)
    {
        if (b & 1) res = res * x % p;
        x = x * x % p;
        b >>= 1;
    }
    return res;
}

int exBSGS(int a, int p, int b)
{
    a %= p, b %= p;
    if (b == 1 || p == 1) return 0;
    long long s = 1;
    int cnt = 0, c;
    while ((c = gcd(a, p)) > 1)
    {
        if (b % c != 0) return -1;
        b /= c;
        p /= c;
        s = s * (a / c) % p;
        a %= p;
        ++cnt;
        if (b == s) return cnt;
    }
    
    c = inv(s, p);
    if (c == -1) return -1;
    b = 1ll * b * c % p;

    Hash_Table::clear();
    int ans = 0x7fffffff;
    int t = ceil(sqrt(p));
    int f = pow(a, t, p);
    s = b % p;
    for (int i = 0; i <= t; ++i, s = s * a % p) Hash_Table::insert(s, i);
    s = f;
    for (int i = 1; i <= t; ++i, s = s * f % p)
    {
        int d = Hash_Table::find(s);
        if (~d) ans = min(ans, i * t - d + cnt);
    }
    return ans < 0x7fffffff ? ans : -1;
}

int a, p, b;

int main()
{
    IO::read(a);
    IO::read(p);
    IO::read(b);
    while (a || p || b)
    {
        int ans = exBSGS(a, p, b);
        if (~ans) IO::write(ans), IO::putchar('\n');
        else IO::puts("No Solution");
        IO::read(a);
        IO::read(p);
        IO::read(b);
    }
    IO::flush();
    return 0;
}
```
{% endcontentbox %}

## 总结

BSGS 算法的核心思想，在于 Meet in the Middle。将 $p=\sqrt{p}\times\sqrt{p}$ 的组合，从中间切开放到哈希表上直接寻址。这样从两边记录，相较于组合判断要更加优秀。

我们将寻找的漫长故事，改写为双向奔赴的相遇，共同约定在最美的鲜花丛中，见证最美的契合。
