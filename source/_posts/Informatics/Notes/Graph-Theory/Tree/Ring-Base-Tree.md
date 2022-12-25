---
title: 图论 - 树 - 基环树
tags:
  - '图论'
  - '树'
categories:
  - Informatics
  - Notes
date: 2022-11-17 23:10:15
---


迷雾中，隐隐看见环挂了树，树套了环

<!--more-->

## 基环树

基环树不是树。

树是具有 $N$ 个结点、$N-1$ 条边的连通图。基环树是具有 $N$ 个结点、$N$ 条边的连通图，而具有 $N$ 个结点、$N$ 条边的非连通图是基环树森林。根据树的知识，我们知道它会在树上形成一个环，如果以环为主体、树为附加观察，它大概长成这样的。

{% asset_img rbt.png '"" "基环树"' %}

有些时候我们会给基环树的边加上方向，就像这样。

{% asset_img rbt1.png '"" "内向基环树"' %}

这样的基环树，每个结点只有一条出边，边的方向指向环内，称为内向（基环）树。

{% asset_img rbt2.png '"" "外向基环树"' %}

这样的基环树，每个结点只有一条入边，边的方向指向环外，称为外向（基环）树。

## 方法

解决基环树的问题，一般有两种办法：

  1. 环不大时，选择枚举环上的边，断掉边转化为树上问题。
  2. 将环上挂的树分别求解，答案浓缩到环上，转化为环上问题。

## T 骑士

题目来源：ZJOI 2008
评测链接：<https://loj.ac/p/3795>

求基环树森林的最大权独立集。

首先假定我们已经会了树上求最大权独立集。

这道题我们对环上挂的树求解过后，答案整理到环上，在环上任取一个位置断开，钦定不选开头或不选结尾，DP 得出结果。

或者说，不用对树单独求解，在环上断开，钦定不选 $u$ 或不选 $v$，转化为树形 DP 求解。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <iostream>
#include <utility>

using namespace std;

const int MAXN = 1e6;

int n;
int a[MAXN + 5], p[MAXN + 5];

int h[MAXN + 5], nxt[MAXN * 2 + 5], to[MAXN * 2 - 1];

int stk[MAXN + 5], top = 0;
int vis[MAXN + 5];

int c[MAXN + 5], cnt = 0;

bool av[MAXN + 5];

pair<long long, long long> Dfs(int x, int fa, int u)
{
    auto ans = make_pair(0ll, a[x] + 0ll);
    for (int i = h[x]; i; i = nxt[i])
    {
        if (to[i] != fa && to[i] != u && av[i >> 1])
        {
            auto res = Dfs(to[i], x, u);
            ans.first += max(res.first, res.second);
            ans.second += res.first;
        }
    }
    return ans;
}

long long Ans = 0;

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i)
    {
        scanf("%d%d", a + i, p + i);
        nxt[i * 2] = h[p[i]];
        to[i * 2] = i;
        h[p[i]] = i * 2;
        nxt[i * 2 + 1] = h[i];
        to[i * 2 + 1] = p[i];
        h[i] = i * 2 + 1;
        av[i] = true;
    }

    for (int i = 1; i <= n; ++i)
    {
        if (!vis[i])
        {
            int x = i;
            while (!vis[x])
            {
                vis[x] = i;
                stk[++top] = x;
                x = p[x];
            }
            if (vis[x] == i) c[++cnt] = x;
            top = 0;
        }
    }

    for (int i = 1; i <= cnt; ++i) av[c[i]] = false,
                 Ans += max(Dfs(c[i], 0, c[i]).first,
                            Dfs(p[c[i]], 0, p[c[i]]).first), av[c[i]] = true;

    printf("%lld\n", Ans);

    return 0;
}
```
{% endcontentbox %}

## T 电报

题目来源：JOISC 2016 Day 3
评测链接：<https://loj.ac/p/2737>

给出 $N$ 个点，每个点的出度均为 $1$，给出这 $N$ 个点初始指向的点 $A_i$，和改变这个点指向的目标所需要的价值 $C_i$。

求让所有点强连通的最小花费。

首先，最后强连通，只会是所有结点形成一个环。由于我们对于一个结点断开了出边就可以任选一个点指向，于是我们只考虑断开，不考虑重新指向。问题转化为，除本就只有一个环的情况，将基环树森林断成若干条链所需要的最小代价。

对每个基环树考虑，先对于所有入度大于 $1$ 的结点，除了代价最大的一条边都断掉，这样我们可能得到若干链或者若干链和一个环。如果这个基环树的环没有在上一步断开，考虑修改操作。有两种方案：

  1. 在环上选一条代价最小的边断掉。
  2. 对于环上某个结点的入边，选择除了环上的边最大代价的边不再断掉，改为环上的那条入边断掉。

取更小代价即可。

（因为某些同学先做过了 电报 再做过的 骑士，因此本题码风比较不正常）

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <iostream>

using namespace std;

const int MAXN = 1e5;

int n, A[MAXN + 5], C[MAXN + 5];

int vis[MAXN + 5];
bool type[MAXN + 5];

int tot = 0;
int Dfs(int x, int u)
{
    if (vis[x] && vis[x] < u) return 0;
    if (type[x]) return x;
    type[x] = true;
    vis[x] = u;
    int res = Dfs(A[x], u);
    type[x] = res;
    tot += type[x];
    return res == x ? 0 : res;
}

int Max[MAXN + 5], Max0[MAXN + 5];

long long Ans = 0;

bool ok[MAXN + 5];

int extra[MAXN + 5];

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%d%d", A + i, C + i);

    for (int i = 1; i <= n; ++i)
    {
        Ans += C[i];
        Max[A[i]] = max(Max[A[i]], C[i]);
    }

    Dfs(1, 1);
    if (tot == n) return puts("0"), 0;
    for (int i = 2; i <= n; ++i) if (!vis[i]) Dfs(i, i);

    for (int i = 1; i <= n; ++i) if (!type[i]) Max0[A[i]] = max(Max0[A[i]], C[i]);

    for (int i = 1; i <= n; ++i) Ans -= Max[i];

    for (int i = 1; i <= n; ++i)
    {
        if (type[i] && Max[i] == Max0[i])
        {
            ok[i] = true;
            int x = A[i];
            while (!ok[x]) ok[x] = true, x = A[x];
        }
    }

    for (int i = 1; i <= n; ++i) if (type[i] && !ok[i]) extra[i] = min(C[i], Max[i] - Max0[i]);

    for (int i = 1; i <= n; ++i)
    {
        if (type[i] && !ok[i])
        {
            ok[i] = true;
            int cost = extra[i];
            int x = A[i];
            while (!ok[x]) ok[x] = true, cost = min(cost, extra[x]), x = A[x];
            Ans += cost;
        }
    }

    printf("%lld\n", Ans);

    return 0;
}
```
{% endcontentbox %}

## 总结

基环树的本质就是环挂树、树套环，我们将环视为主体部分，将树视为附加部分，可以转化为环上问题；将树视为主体部分，将环视为特殊部分，可以转化为树上问题。

无论是环挂树，还是树套环，见证的都是 $|V|$ 与 $|E|$ 相等，讲述的都是不变的树与环的故事。

基环树的故事。
