---
title: 动态规划 - 动态动态规划
tags:
  - '[I] 动态规划'
  - '[I] 线性代数'
categories:
  - Informatics
  - Notes
date: 2022-11-27 10:56:10
---


矩阵舞动出步步推演的变幻

<!--more-->

## 广义矩阵乘法

定义广义矩阵乘法 $A\times B=C$ 为

$$
C_{i,j}=\max/\min\\{A_{i,k}+B_{k,j}\\}
$$

广义矩阵乘法也满足结合律，因此可以将步步的递推合并为一次矩阵变化，也可以使用矩阵快速幂加速。

## 动态 DP 概述

动态 DP，顾名思义，就是带修的 DP 问题。

动态 DP 首先将 DP 转移递推式改写为矩阵乘法，利用线段树等数据结构动态维护矩阵乘积，每次修改对应的方阵，查询变化后的转移矩阵。当然，也可以在线段树上区间查询。

## T 小白逛公园

评测链接：<https://www.luogu.com.cn/problem/P4513>

动态维护区间最大子段和。

正解明显是线段树，但可以使用动态 DP。对固定一段求解，定义 $f_{i,0}$ 表示不选择 $i$，在 $1\sim i$ 的最大子段和，$f_{i,1}$ 表示选择 $i$ 的最大子段和。有

$$
\begin{align}
f_{i,0}&=\max\\{f_{i-1,0},f_{i-1,1}\\}\\\\
f_{i,1}&=\max\\{a_i,f_{i-1,1}+a_i\\}
\end{align}
$$

边界条件为 $f_{0,0}=f_{0,1}=-\infty$。

改写为矩阵乘法即为

$$
\begin{bmatrix}
 f_{i,0} & f_{i,1} & 0
\end{bmatrix}=
\begin{bmatrix}
 f_{i-1,0} & f_{i-1,1} & 0
\end{bmatrix}
\times
\begin{bmatrix}
 0 & -\infty & -\infty \\\\
 0 & a_i & -\infty \\\\
 -\infty & a_i & 0
\end{bmatrix}
$$

于是我们对于 $[l,r]$ 的查询，只需要查询

$$
\begin{bmatrix}
 -\infty & -\infty & 0
\end{bmatrix}
\times\prod_{i=l}^r
\begin{bmatrix}
 0 & -\infty & -\infty \\\\
 0 & a_i & -\infty \\\\
 -\infty & a_i & 0
\end{bmatrix}
$$

用线段树动态维护区间矩阵乘积即可。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <algorithm>

struct Matrix
{
    int d[3][3], r, c;
    Matrix() {}
    Matrix(int _r, int _c) : r(_r), c(_c) {}
    Matrix(int _r, int _c, int _d[])
    {
        r = _r;
        c = _c;
        for (int i = 0; i < r; ++i) for (int j = 0; j < c; ++j) d[i][j] = _d[i * r + j];
    }
    Matrix operator*(const Matrix &x) const
    {
        if (c != x.r)
        {
            puts("Illegal Matrix God Law!");
            exit(114514);
        }
        Matrix res(r, x.c);
        for (int i = 0; i < r; ++i)
        {
            for (int j = 0; j < x.c; ++j)
            {
                res.d[i][j] = -0x3f3f3f3f;
                for (int k = 0; k < c; ++k) res.d[i][j] = std::max(res.d[i][j], d[i][k] + x.d[k][j]);
            }
        }
        return res;
    }
};

const int MAXN = 5e5;
const int INF = 0x3f3f3f3f;

int n, m;

int a[MAXN + 5];

namespace Seg
{
    Matrix s[MAXN * 4 + 5];
    int p[MAXN + 5];
    void build(int k, int l, int r)
    {
        if (l == r)
        {
            p[l] = k;
            s[k] = Matrix(3, 3, new int[9]{0, -INF, -INF, 0, a[l], -INF, -INF, a[l], 0});
            return;
        }
        int mid = l + r >> 1;
        build(k << 1, l, mid);
        build(k << 1 | 1, mid + 1, r);
        s[k] = s[k << 1] * s[k << 1 | 1];
    }
    void modify(int x, int d)
    {
        x = p[x];
        s[x] = Matrix(3, 3, new int[9]{0, -INF, -INF, 0, d, -INF, -INF, d, 0});
        x >>= 1;
        while (x)
        {
            s[x] = s[x << 1] * s[x << 1 | 1];
            x >>= 1;
        }
    }
    Matrix query(int k, int l, int r, int ql, int qr)
    {
        if (l == ql && r == qr) return s[k];
        int mid = l + r >> 1;
        if (qr <= mid) return query(k << 1, l, mid, ql, qr);
        else if (mid + 1 <= ql) return query(k << 1 | 1, mid + 1, r, ql, qr);
        else return query(k << 1, l, mid, ql, mid) * query(k << 1 | 1, mid + 1, r, mid + 1, qr);
    }
}

int k, p, s;

int main()
{
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) scanf("%d", a + i);

    Seg::build(1, 1, n);

    for (int i = 1; i <= m; ++i)
    {
        scanf("%d%d%d", &k, &p, &s);
        if (k == 1)
        {
            if (p > s) std::swap(p, s);
            Matrix res = Matrix(1, 3, new int[3]{-INF, -INF, 0}) * Seg::query(1, 1, n, p, s);
            printf("%d\n", std::max(res.d[0][0], res.d[0][1]));
        }
        else Seg::modify(p, s);
    }

    return 0;
}
```
{% endcontentbox %}

## T Doremy's Number Line

题目来源：Codeforces 1764E
评测链接：<https://codeforces.com/problemset/problem/1764/E>

有两个长度为 $n$ 的数组 $a,b$ 和一个整数 $k$。选择一个排列 $p$ 为 $[1,2,\ldots,n]$，然后在整数域上进行 $n$ 次操作：

选择一个未被染色的整数 $x$ 满足：

  - $x\leq a_{p_i}$ 或
  - 存在一个染过色的整数 $y$ 使得 $y\leq a_{p_i}$ 并且 $x\leq y+b_{p_i}$

将 $x$ 染为颜色 $p_i$。

询问是否可以使 $k$ 染为颜色 $1$。

<br>

首先可以明确，如果 $i$ 可以被染成颜色 $k$，那么小于 $i$ 的所有整数都存在被染成颜色 $k$ 的可能。此时我们将问题转化为，寻找一个不为 $1$ 的 $s$ 和一个元素互不相同且不为 $1$ 和 $s$ 的数列 $[c_1,c_2,\ldots,c_m]$，令 $Ans$ 初始为 $a_s$，对每个 $i\in[1,m]$ 执行 $Ans=\min(Ans,a_{m_i})+b_{m_i}$，让 $\min(Ans, a_1)+b_1$ 大于等于 $k$。

如果我们能够确定 $s$，那么易证，剩下的元素按 $a_i+b_i$ 由小到大排列的时候，能够得到最大的 $Ans$。

写成广义矩阵乘法（运算时取 $\min$），初始向量为

$$
\begin{bmatrix}
 a_s & 0
\end{bmatrix}
$$

转移方阵为

$$
\begin{bmatrix}
 b_{i} & 0 \\\\
 a_{i}+b_{i} & 0
\end{bmatrix}
$$

线段树维护矩阵乘积，枚举 $s$，每次将 $s$ 位置的矩阵写成 $\begin{bmatrix} 0 & 0 \\\\ \infty & 0 \end{bmatrix}$，二分出第一个 $a_i+b_i$ 大于 $a_s$ 的位置 $x$，查询 $[x,n]$ 的矩阵乘积。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstdlib>
#include <iostream>
#include <utility>
#include <algorithm>
 
using namespace std;
 
const int MAXN = 1e5;
 
int T, n;
long long k;
 
pair<long long, long long> a[MAXN + 5];
 
struct Matrix
{
    int r, c;
    long long d[2][2];
    Matrix() {}
    Matrix(int _r, int _c) : r(_r), c(_c) {}
    Matrix(int _r, int _c, long long _d[2][2])
    {
        r = _r;
        c = _c;
        for (int i = 0; i < r; ++i) for (int j = 0; j < c; ++j) d[i][j] = _d[i][j];
    }
    Matrix operator*(const Matrix &x) const
    {
        if (c != x.r)
        {
            puts("Illegal Matrix God Law!");
            exit(114514);
        }
        Matrix res(r, x.c);
        for (int i = 0; i < r; ++i)
        {
            for (int j = 0; j < x.c; ++j)
            {
                res.d[i][j] = 0x3f3f3f3f3f3f3f3f;
                for (int k = 0; k < c; ++k) res.d[i][j] = min(res.d[i][j], d[i][k] + x.d[k][j]);
            }
        }
        return res;
    }
};
 
namespace Seg
{
    Matrix s[MAXN * 4 + 5];
    int p[MAXN + 5];
    void build(int k, int l, int r)
    {
        if (l == r) return p[l] = k, s[k] = Matrix(2, 2, new long long[2][2]{{a[l].second, 0}, {a[l].first, 0}}), void();
        int mid = l + r >> 1;
        build(k << 1, l, mid);
        build(k << 1 | 1, mid + 1, r);
        s[k] = s[k << 1] * s[k << 1 | 1];
    }
    void modify(int x, Matrix d)
    {
        s[x = p[x]] = d;
        x >>= 1;
        while (x)
        {
            s[x] = s[x << 1] * s[x << 1 | 1];
            x >>= 1;
        }
    }
    Matrix query(int k, int l, int r, int ql, int qr)
    {
        if (l == ql && r == qr) return s[k];
        int mid = l + r >> 1;
        if (mid >= qr) return query(k << 1, l, mid, ql, qr);
        else if (mid + 1 <= ql) return query(k << 1 | 1, mid + 1, r, ql, qr);
        else return query(k << 1, l, mid, ql, mid) * query(k << 1 | 1, mid + 1, r, mid + 1, qr);
    }
}
 
int main()
{
    scanf("%d", &T);
 
    while (T--)
    {
        scanf("%d%lld", &n, &k);
        for (int i = 1; i <= n; ++i)
        {
            scanf("%lld%lld", &a[i].first, &a[i].second);
            a[i].first += a[i].second;
        }
 
        if (a[1].first - a[1].second >= k)
        {
            puts("YES");
            continue;
        }
        if (a[1].first < k)
        {
            puts("NO");
            continue;
        }
 
        sort(a + 2, a + n + 1);
 
        Seg::build(1, 1, n);
 
        for (int i = 2; i <= n; ++i)
        {
            Seg::modify(i, Matrix(2, 2, new long long[2][2]{{0, 0}, {0x3f3f3f3f3f3f3f3f, 0}}));
            int st = lower_bound(a + 2, a + n + 1, make_pair(a[i].first - a[i].second, 0ll)) - a;
            if (st == i) ++st;
            Matrix Ans(1, 2, new long long[2][2]{{a[i].first - a[i].second, 0}, {}});
            if (st <= n) Ans = Ans * Seg::query(1, 1, n, st, n);
            Ans = Ans * Seg::s[Seg::p[1]];
            if (Ans.d[0][0] >= k) goto Label;
            Seg::modify(i, Matrix(2, 2, new long long[2][2]{{a[i].second, 0}, {a[i].first, 0}}));
        }
        puts("NO");
        continue;
    Label:
        puts("YES");
    }
 
    return 0;
}

```
{% endcontentbox %}

## T 数据传输

题目来源：CSP-S 2022
评测链接：<https://www.luogu.com.cn/problem/P8820>

小 C 正在设计计算机网络中的路由系统。

测试用的网络总共有 $n$ 台主机，依次编号为 $1 \sim n$。这 $n$ 台主机之间由 $n - 1$ 根网线连接，第 $i$ 条网线连接个主机 $a_i$ 和 $b_i$。保证任意两台主机可以通过有限根网线直接或者间接地相连。受制于信息发送的功率，主机 $a$ 能够直接将信息传输给主机 $b$ 当且仅当两个主机在可以通过不超过 $k$ 根网线直接或者间接的相连。

在计算机网络中，数据的传输往往需要通过若干次转发。假定小 C 需要将数据从主机 $a$ 传输到主机 $b$（$a \neq b$），则其会选择出若干台用于传输的主机 $c_1 = a, c_2, \ldots, c_{m - 1}, c_m = b$，并按照如下规则转发：对于所有的 $1 \le i < m$，主机 $c_i$ 将信息直接发送给 $c_{i + 1}$。

每台主机处理信息都需要一定的时间，第 $i$ 台主机处理信息需要 $v_i$ 单位的时间。数据在网络中的传输非常迅速，因此传输的时间可以忽略不计。据此，上述传输过程花费的时间为 $\sum_{i = 1}^{m} v_{c_i}$。

现在总共有 $q$ 次数据发送请求，第 $i$ 次请求会从主机 $s_i$ 发送数据到主机 $t_i$。小 C 想要知道，对于每一次请求至少需要花费多少单位时间才能完成传输。

<br>

不带修的动态 DP，对每个结点建转移矩阵，树剖。

## T 【模板】"动态 DP"&动态树分治

评测链接：<https://www.luogu.com.cn/problem/P4719>

给定一棵 $n$ 个点的树，点带点权。

有 $m$ 次操作，每次操作给定 $x,y$，表示修改点 $x$ 的权值为 $y$。

你需要在每次操作之后求出这棵树的最大权独立集的权值大小。

<br>

不带修的时候，直接树形 DP 完事。

带修的时候，首先树链剖分，对每个结点额外记录 $g_{i,0},g_{i,1}$ 表示只选轻子树、结点 $i$ 选或不选的最优答案。

那么有

$$
\begin{align}
f_{i,0}=g_{i,0}+\max\\{f_{hson_i,0},f_{hson_i,1}\\}\\\\
f_{i,1}=g_{i,1}+f_{hson_i,0}
\end{align}
$$

在一条重链上，就可以写成只包含 $g$ 的矩阵连乘的形式。而 $g_{i,0}$ 和 $g_{i,1}$ 就由所有轻儿子的 $f$ 得出。

于是，我们每次修改对应的转移矩阵，然后跳到当前重链顶端的父结点，查询线段树，继续修改。最后答案为根所在重链的矩阵乘积。单次时间复杂度 $O(\log^2n)$。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstdlib>
#include <iostream>

using namespace std;

const int MAXN = 1e5;

int n, m, x, y;
int a[MAXN + 5];

int h[MAXN + 5], to[MAXN * 2 + 5], nxt[MAXN * 2 + 5];
int fa[MAXN + 5], sz[MAXN + 5], hson[MAXN + 5];

int p[MAXN + 5], b[MAXN + 5], q[MAXN + 5], tot = 0;
int top[MAXN + 5];

int f[MAXN + 5][2], g[MAXN + 5][2];

void build(int x)
{
    sz[x] = 1;
    for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x])
    {
        fa[to[i]] = x;
        build(to[i]);
        if (sz[to[i]] > sz[hson[x]]) hson[x] = to[i];
        sz[x] += sz[to[i]];
    }
}

int dfs(int x, int t)
{
    top[x] = t;
    p[x] = ++tot;
    q[tot] = x;
    if (hson[x])
    {
        b[x] = dfs(hson[x], t);
        g[x][1] = a[x];
        for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x] && to[i] != hson[x])
        {
            dfs(to[i], to[i]);
            g[x][0] += max(f[to[i]][0], f[to[i]][1]);
            g[x][1] += f[to[i]][0];
        }
        f[x][0] = g[x][0] + max(f[hson[x]][0], f[hson[x]][1]);
        f[x][1] = g[x][1] + f[hson[x]][0];
    }
    else f[x][1] = g[x][1] = a[x], b[x] = tot;
    return b[x];
}

struct Matrix
{
    int r, c, d[2][2];
    Matrix() {}
    Matrix(int _r, int _c) : r(_r), c(_c) {}
    Matrix(int _r, int _c, int _d[])
    {
        r = _r;
        c = _c;
        for (int i = 0; i < r; ++i) for (int j = 0; j < c; ++j) d[i][j] = _d[i * c + j];
    }
    Matrix operator*(const Matrix &x) const
    {
        if (c != x.r)
        {
            puts("Illegal Matrix God Law!");
            exit(0);
        }
        Matrix res(r, x.c);
        for (int i = 0; i < r; ++i)
        {
            for (int j = 0; j < x.c; ++j)
            {
                res.d[i][j] = -0x3f3f3f3f;
                for (int k = 0; k < c; ++k) res.d[i][j] = max(res.d[i][j], d[i][k] + x.d[k][j]);
            }
        }
        return res;
    }
} c[MAXN + 5], res;

Matrix pow(Matrix x, int b)
{
    Matrix res(2, 2, new int[4]{1, 0, 0, 1});
    while (b)
    {
        if (b & 1) res = res * x;
        x = x * x;
        b >>= 1;
    }
    return res;
}

namespace Seg
{
    Matrix s[MAXN * 4 + 5];
    int p[MAXN + 5];
    void build(int k, int l, int r)
    {
        if (l == r) return s[k] = c[l] = Matrix(2, 2, new int[4]{g[q[l]][0], g[q[l]][1], g[q[l]][0], -0x3f3f3f3f}), p[l] = k, void();
        int mid = l + r >> 1;
        build(k << 1, l, mid);
        build(k << 1 | 1, mid + 1, r);
        s[k] = s[k << 1 | 1] * s[k << 1];
    }
    void modify(int k, Matrix d)
    {
        s[k = p[k]] = d;
        k >>= 1;
        while (k)
        {
            s[k] = s[k << 1 | 1] * s[k << 1];
            k >>= 1;
        }
    }
    Matrix query(int k, int l, int r, int ql, int qr)
    {
        if (l == ql && r == qr) return s[k];
        int mid = l + r >> 1;
        if (mid >= qr) return query(k << 1, l, mid, ql, qr);
        else if (mid + 1 <= ql) return query(k << 1 | 1, mid + 1, r, ql, qr);
        else return query(k << 1 | 1, mid + 1, r, mid + 1, qr) * query(k << 1, l, mid, ql, mid);
    }
}

int main()
{
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i) scanf("%d", a + i);

    for (int i = 1; i < n; ++i)
    {
        scanf("%d%d", to + (i << 1 | 1), to + (i << 1));
        nxt[i << 1] = h[to[i << 1 | 1]];
        h[to[i << 1 | 1]] = i << 1;
        nxt[i << 1 | 1] = h[to[i << 1]];
        h[to[i << 1]] = i << 1 | 1;
    }

    build(1);

    dfs(1, 1);

    Seg::build(1, 1, n);

    for (int i = 1; i <= m; ++i)
    {
        scanf("%d%d", &x, &y);
        g[x][1] = g[x][1] - a[x] + y;
        a[x] = y;
        c[p[x]] = Matrix(2, 2, new int[4]{g[x][0], g[x][1], g[x][0], -0x3f3f3f3f});
        while (x)
        {
            res = Matrix(1, 2, new int[2]{0, 0}) * Seg::query(1, 1, n, p[top[x]], b[top[x]]);
            g[fa[top[x]]][0] -= max(res.d[0][0], res.d[0][1]);
            g[fa[top[x]]][1] -= res.d[0][0];
            Seg::modify(p[x], c[p[x]]);
            res = Matrix(1, 2, new int[2]{0, 0}) * Seg::query(1, 1, n, p[top[x]], b[top[x]]);
            g[fa[top[x]]][0] += max(res.d[0][0], res.d[0][1]);
            g[fa[top[x]]][1] += res.d[0][0];
            x = fa[top[x]];
            c[p[x]] = Matrix(2, 2, new int[4]{g[x][0], g[x][1], g[x][0], -0x3f3f3f3f});
        }
        res = Matrix(1, 2, new int[2]{0, 0}) * Seg::query(1, 1, n, p[1], b[1]);
        printf("%d\n", max(res.d[0][0], res.d[0][1]));
    }

    return 0;
}
```
{% endcontentbox %}

## 总结

动态 DP 的核心，在于用矩阵乘法表示转移方程，因为矩阵乘法具有结合律，因此修改时可以直接修改转移矩阵，更新整体的转移矩阵乘积，而不用从头再来一遍。

总之，就是利用矩阵的变幻，以及动态维护区间的数据结构，动态更新转移矩阵。

矩阵的变幻，舞动出转移的纷繁。
