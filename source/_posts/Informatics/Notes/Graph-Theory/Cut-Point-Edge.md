---
title: 图论 - 割点与割边
tags:
  - '[I] 图论'
categories:
  - Informatics
  - Notes
date: 2022-10-14 23:57:19
---


扼住命运的咽喉

<!--more-->

## 引导

某年，苏伊士运河被堵，导致印度洋到大西洋航道基本瘫痪，商船除了等待只能绕道非洲南部好望角，短短几日造成了全球范围内的跨国贸易经济损失。这也引发我们关于控制整张图连通性的割点和桥的思考。

## 定义

割点指删去这条边后，整张图的连通分量会增加的点。

割边指删去这条边后，整张图的连通分量会增加的边，又称桥。

形象点的理解，就是割点或割边占据了几个连通块之间来往的必经之路。

## 割点

关于割点，我们介绍 Tarjan 算法~~（没错，又是我）~~。

同样依然是在 DFS 生成树上讨论，注意因为这里是无向图，所以不存在横叉边和前向边，所有边都可以划分为树边和反祖边。

我们考虑一个点是割点，当且仅当其存在一个儿子，使得从该儿子出发，不经过这个结点，不能够到达该结点在 DFS 生成树上的祖先。正确性显然。

于是我们依然记录时间戳 $dfn_x$ 和能返回的最早祖先结点 $ret_x$。在 DFS 过程中，扫描到树边 $(u,v)$ 就用 $ret_v$ 更新 $ret_u$，扫描到反祖边 $(u,v)$ 就用 $dfn_v$ 更新 $ret_u$。

然后观察结点 $x$ 所有儿子的 $ret$，如果存在一个 $ret$ 访问在 $x$ 之后，那么结点 $x$ 为割点。注意我们这里应该观察所有儿子的 $ret$ 而非 $ret_x$。

Tarjan 算法中，每个连通分量的第一个结点，例如 $1$ 号结点的判定与其余结点不同。$1$ 号结点是割点，当且仅当其存在超过 $1$ 个儿子。正确性显然。

## 割边

首先明确，反祖边不可能是割边。

接下来，一条树边是割边，当且仅当这条边连接的子节点的 $ret$，是比父结点早或就是父结点的。因此，我们只需要略微改一下割点的代码即可得出割边。

## 双连通分量

双连通分量分为点双连通分量和边双连通分量。一下以点双联通分量为例。

两个结点点双连通，当且仅当撤销任意一个其他结点，这两个结点都连通。无向图的点双连通分量，指极大点双联通子图。点双连通在一般意义下不具备传递性。

显而易见的是，一张无向图中的所有割点将整张图分成了若干点双连通分量。并且，割点与其相连的任意点双连通分量中的结点均点双连通。

边双联通分量同理。

## T 矿场搭建

题目来源：HNOI 2012
评测链接：<https://loj.ac/p/10099>

煤矿工地可以看成是由隧道连接挖煤点组成的无向图。为安全起见，希望在工地发生事故时所有挖煤点的工人都能有一条出路逃到救援出口处。于是矿主决定在某些挖煤点设立救援出口，使得无论哪一个挖煤点坍塌之后，其他挖煤点的工人都有一条道路通向救援出口。

请写一个程序，用来计算至少需要设置几个救援出口，以及不同最少救援出口的设置方案总数。

<br>

找出割点和点双连通分量，如果一个点双连通分量与两个及以上割点连接，则不需要设置救援出口，可以使用其他点双连通分量的救援出口；如果仅与一个割点连接，则需要设置 $1$ 个救援出口；如果不与任何割点连接，则需要设置 $2$ 个救援出口。

可以证明，不会有所有的点双连通分量均与两个及以上的割点相连，因此答案不会为 0。

<details class="note">
  <summary>参考代码</summary>

```cpp
#include <cstdio>
#include <cstring>
#include <iostream>

const int MAXM = 500;

int M, N;
int h[MAXM + 5], nxt[MAXM * 2 + 5], to[MAXM * 2 + 5];

int imp[MAXM + 5], vis[MAXM + 5];

int ch[MAXM + 5], fa[MAXM + 5], dep[MAXM + 5], ret[MAXM + 5];

void Dfs(int x)
{
    ret[x] = x;
    for (int i = h[x]; i; i = nxt[i])
    {
        if (!dep[to[i]])
        {
            ch[x]++;
            dep[to[i]] = dep[x] + 1;
            fa[to[i]] = x;
            Dfs(to[i]);
            ret[x] = dep[ret[to[i]]] < dep[ret[x]] ? ret[to[i]] : ret[x];
        }
        else if (to[i] != fa[x]) ret[x] = dep[to[i]] < dep[ret[x]] ? to[i] : ret[x];
    }
    if (x == 1)
    {
        if (ch[x] > 1) imp[x] = 1;
        else imp[x] = 0;
    }
    else
    {
        imp[x] = 0;
        for (int i = h[x]; i; i = nxt[i])
        {
            if (fa[to[i]] == x && dep[ret[to[i]]] >= dep[x])
            {
                imp[x] = 1;
                break;
            }
        }
    }
}

int ans = 0;
long long Ans = 1;

int cnt_g, cnt_n;

void dfs(int x, int o)
{
    vis[x] = o;
    cnt_n++;
    for (int i = h[x]; i; i = nxt[i])
    {
        if (!imp[to[i]] && vis[to[i]] < o) dfs(to[i], o);
        else if (imp[to[i]] && vis[to[i]] < o)
        {
            vis[to[i]] = o;
            cnt_g++;
        }
    }
}

long long C(int x, int y)
{
    long long res = 1;
    for (int i = x; i >= x - y + 1; i--) res = res * i;
    for (int i = y; i >= 1; i--) res = res / i;
    return res;
}

void solve(int x)
{
    cnt_g = 0;
    cnt_n = 0;
    dfs(x, x);
    if (cnt_g == 0)
    {
        ans = ans + 2;
        if (cnt_n >= 2) Ans = Ans * C(cnt_n, 2);
    }
    else if (cnt_g == 1)
    {
        ans = ans + 1;
        Ans = Ans * cnt_n;
    }
}

int main()
{
    for (int Test = 1;; Test++)
    {
        scanf("%d", &M);
        if (!M) return 0;

        N = 0;
        memset(h, 0, sizeof h);
        memset(ch, 0, sizeof ch);
        memset(dep, 0, sizeof dep);
        memset(imp, 0, sizeof imp);
        memset(vis, 0, sizeof vis);

        for (int i = 1; i <= M; i++)
        {
            int S, T;
            scanf("%d%d", &S, &T);
            N = std::max(N, S);
            N = std::max(N, T);
            to[i << 1] = T;
            nxt[i << 1] = h[S];
            h[S] = i << 1;
            to[i << 1 | 1] = S;
            nxt[i << 1 | 1] = h[T];
            h[T] = i << 1 | 1;
        }

        for (int i = 1; i <= N; i++)
        {
            if (!dep[i])
            {
                dep[i] = 1;
                fa[i] = 0;
                Dfs(i);
            }
        }

        ans = 0;
        Ans = 1;
        for (int i = 1; i <= N; i++) if (!imp[i] && !vis[i]) solve(i);

        printf("Case %d: %d %lld\n", Test, ans, Ans);
    }

    return 0;
}
```

</details>

## 结语

无论太平洋多么辽阔，印度洋多么繁荣，大西洋多么平静，苏伊士运河依旧集纳了繁忙的航线，马六甲海峡仍然控制了海上生命线。

不愿被割点束缚的少年啊，怀着可以平视这个世界的信心，让风带着青春的骄傲自由无拘地漫天飞舞。
