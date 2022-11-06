---
title: 图论 - 树 - 虚树
tags:
  - '[I] 图论'
  - '[I] 树'
categories:
  - Informatics
  - Notes
date: 2022-08-21 10:03:21
---


跃过毋庸置疑，无顾吹网欲满

<!--more-->

## T 消耗战

题目来源：SDOI 2011
评测链接：<https://www.luogu.com.cn/problem/P2495>

给出一棵以 $1$ 为根的有根树，有 $n$ 个结点，每条边有一个价值。有 $m$ 个询问，对每个询问，给出一些关键结点，要求剪除一些边，使得关键结点都不与根结点相连，求剪除边的最小代价。

<br>

思路是树形 DP，状态转移方程式

$$
f(x)=\\sum_{y\\in S_x}\\left\\{\\begin{matrix}\\min(w(x,y),f(y)) & p_y=\\textbf{false}\\\\w(x,y)            & p_y=\\textbf{true}\\end{matrix}\\right.
$$

单次询问时间复杂度 $O(n)$，总的时间复杂度 $O(nm)$，<font style="color:blue">TLE</font>。

## 虚树

我们观察所要处理的树，发现，没有关键结点的子树无需 DP，因此可以直接删除。接下来留下的结点，有一些非关键结点只有一个子结点，也就是处在一个关键结点到一个拥有两个以上儿子的祖先的路径上，并且这条路径不分叉，那么这条路径就可以被压缩掉。

也就是，我们最终要保留下来的，就是所有关键节点，和它们的 LCA，以及压缩过后的中间的路径。

Such is 虚树，Virtual Tree，顾名思义，有别于题目中直接给出的树或者模型概括出的树，虚树是以前两者为基础和大体框架来构建的。大概就是，保留原树的祖先后代关系，去掉一些无意义的结点，让一些祖先和后代略过中间辈直接相连。一般来说，我们将原树浓缩成虚树来进行树形 DP 或者其他算法，以追求更低的时间复杂度。

比如说下面四张图，以红色结点为关键结点。

{% asset_img vtree1.svg '"" "虚树 1"' %}

{% asset_img vtree2.svg '"" "虚树 2"' %}

{% asset_img vtree3.svg '"" "虚树 3"' %}

{% asset_img vtree4.svg '"" "虚树 4"' %}

接下来我们讨论如何建立虚树。

## 虚树的建立

一般来说，我们 $O(n)$ 建立虚树的方法是，DFS 一遍整棵树，如果当前结点是关键结点或者其有两棵包含关键结点的子树，那么就将其加入虚树。这样我们需要扫描一遍所有结点，如果我们能只扫描应该加入虚树的结点，那么效率将会大大提升。

我们讲过，最终要保留下来的，就是所有关键节点，和它们的 LCA。于是，如果我们按照 DFS 序从小到大对所有关键结点排序，这样在同一棵子树内部的结点都处在一段连续区间内，那么我们需要的 LCA 作为子树的根结点，一定是相邻两结点的 LCA，易证（和 Tarjan 求 LCA 类似）。

我们需要一个辅助的数据结构——栈。

那么我们的思路是，按 DFS 序依次将关键入栈。在入栈之前，首先将栈中非该结点的祖先的结点弹出栈结构，然后检查该结点与刚才弹出的一溜结点的 LCA 是否在栈中，若非则先入 LCA，然后再入该结点。在弹栈的过程中，就建立被弹出栈的结点到栈顶结点的一条边，而如果要加入 LCA 的话，关照一下，此时的父亲结点不是栈顶而是未入栈的 LCA。

也就是，这个栈里，存的就是一条起自根结点的链上的一些结点，如果要加入链外的点，就加入 LCA 过后将链改道到欲加入的结点。此时被弹栈的一条链上的点的父子关系已成定局，不会再加入 LCA，因此可以建边。

## 题目解答

在本题中，有一些特殊的性质，比如说根结点 $1$ 一定是要在虚树中存在的，因此我们就先将 $1$ 入栈。

于是就是预处理出 LCA 需要的数组，DFS 序，对每个询问建立虚树然后树形 DP 解答。

还需要注意的是，每次虚树所用到的数组不要用 ``memset`` 清空，这样时间消耗大，最好将修改过的下标存下来后边再改回 0。

{% contentbox type:success title:参考代码 %}
```cpp
#include <iostream>
#include <cstdio>
#include <algorithm>


using namespace std;


int n, m, k, h[250005], u, v, w;
int t[250005], s = 0;

int hd[250005], to[500005], nt[500005], wt[500005];
int fa[250005], dep[250005];

int p[250005], r[250005], tot = 0;

int f[250005][20], g[250005][20];    // 除了 f 存 2^i 代祖先以外，还开 g 存到 2^i 代祖先的路径上的代价最小值
int power[20];

int stk[250005], top = 0;

bool vp[250005], imp[250005];
int vhd[250005], vto[250005], vnt[250005], vwt[250005], vcnt = 0;
int vfa[250005];


void Dfs(int x)
{
    f[x][0] = fa[x];
    for (int i = 0; f[x][i]; ++i)
    {
        f[x][i + 1] = f[f[x][i]][i];
        g[x][i + 1] = min(g[x][i], g[f[x][i]][i]);
    }

    ++tot;
    p[x] = tot;
    r[tot] = x;
    for (int i = hd[x]; i; i = nt[i])
    {
        if (to[i] != fa[x])
        {
            fa[to[i]] = x;
            dep[to[i]] = dep[x] + 1;
            g[to[i]][0] = wt[i];
            Dfs(to[i]);
        }
    }    
}


int log(int x)
{
    return upper_bound(power, power + 20, x) - power - 1;
}

int lca(int x, int y)
{
    if (dep[x] < dep[y]) swap(x, y);
    while (dep[x] > dep[y]) x = f[x][log(dep[x] - dep[y])];

    if (x == y) return x;
    while (fa[x] != fa[y])
    {
        int i = 0;
        while (f[x][i] != f[y][i]) ++i;
        --i;
        x = f[x][i];
        y = f[y][i];
    }
    return fa[x];
}

int mt(int x, int k)    // 求结点 x 到其 k 代祖先的路径上的代价最小值
{
    int ans = 0x7fffffff, d;
    while (k)
    {
        d = log(k);
        ans = min(ans, g[x][d]);
        x = f[x][d];
        k = k - power[d];
    }
    return ans;
}


long long dp(int x)
{
    long long ans = 0;
    for (int i = vhd[x]; i; i = vnt[i])
    {
        if (imp[vto[i]]) ans = ans + vwt[i];
        else ans = ans + min(dp(vto[i]), (long long)(vwt[i]));
    }
    return ans;
}

int main()
{
    scanf("%d", &n);
    for (int i = 1; i < n; ++i)
    {
        scanf("%d%d%d", &u, &v, &w);
        to[i * 2 - 1] = v;
        wt[i * 2 - 1] = w;
        nt[i * 2 - 1] = hd[u];
        hd[u] = i * 2 - 1;
        to[i * 2] = u;
        wt[i * 2] = w;
        nt[i * 2] = hd[v];
        hd[v] = i * 2;
    }


    Dfs(1);
    power[0] = 1;    // 预处理出 2 的幂的数组，方便 log
    for (int i = 1; i < 20; ++i) power[i] = power[i - 1] << 1;


    scanf("%d", &m);
    for (int i = 1; i <= m; ++i)
    {
        scanf("%d", &k);
        for (int j = 1; j <= k; ++j)
        {
            scanf("%d", h + j);
            imp[h[j]] = 1;
            h[j] = p[h[j]];    // 改成 DFS 序，方便排序
        }
        sort(h + 1, h + k + 1);

        
        vcnt = 0;

        stk[top = 1] = 1;    // 将 1 压栈
        vp[1] = 1;    // 曾经在栈中
        vfa[1] = 0;
        t[s = 1] = 1;
        for (int j = 1; j <= k; ++j)
        {
            int a = lca(stk[top], r[h[j]]);

            if (vp[a])
            {
                while (dep[stk[top]] > dep[a])
                {
                    vfa[stk[top]] = stk[top - 1];
                    ++vcnt;
                    vto[vcnt] = stk[top];
                    vwt[vcnt] = mt(stk[top], dep[stk[top]] - dep[stk[top - 1]]);
                    vnt[vcnt] = vhd[stk[top - 1]];
                    vhd[stk[top - 1]] = vcnt;
                    --top;
                }
            }
            else
            {
                while (dep[stk[top - 1]] > dep[a])
                {
                    vfa[stk[top]] = stk[top - 1];
                    ++vcnt;
                    vto[vcnt] = stk[top];
                    vwt[vcnt] = mt(stk[top], dep[stk[top]] - dep[stk[top - 1]]);
                    vnt[vcnt] = vhd[stk[top - 1]];
                    vhd[stk[top - 1]] = vcnt;
                    --top;
                }
                vfa[stk[top]] = a;
                ++vcnt;
                vto[vcnt] = stk[top];
                vwt[vcnt] = mt(stk[top], dep[stk[top]] - dep[a]);
                vnt[vcnt] = vhd[a];
                vhd[a] = vcnt;
                stk[top] = a;
                vp[a] = 1;
                t[++s] = a;
            }

            stk[++top] = r[h[j]];
            vp[r[h[j]]] = 1;
            t[++s] = r[h[j]];
        }

        while (top > 1)
        {
            vfa[stk[top]] = stk[top - 1];
            ++vcnt;
            vto[vcnt] = stk[top];
            vwt[vcnt] = mt(stk[top], dep[stk[top]] - dep[stk[top - 1]]);
            vnt[vcnt] = vhd[stk[top - 1]];
            vhd[stk[top - 1]] = vcnt;
            --top;
        }


        printf("%lld\n", dp(1));


        for (int i = 1; i <= s; ++i)    // 清空
        {
            imp[t[i]] = 0;
            vp[t[i]] = 0;
            vhd[t[i]] = 0;
        }
    }

    return 0;
}
```
{% endcontentbox %}

## 算法分析

对于关键结点个数为 $k$ 的树，我们建立的虚树最多有 $2k-1$ 个结点，这将在虚树退化为二叉树时得到。而倍增法求 LCA 的时间复杂度最坏为 $O(\log n)$，因此单次询问的时间复杂度为 $O(k\log n)$，总的时间复杂度为 $O\left(n\log n+\sum k\log n\right)$。

所以，虚树在给出 $\sum k$ 的时候比较好用。

## 总结

虚树，就是为原树上无必要的分叉开一条快车道，压缩掉单方向的路径，排除掉永远为 0 的结点，将原树浓缩成一棵虚树。

这是一棵追求效率至上的虚树，毋庸置疑的直道，将一跃而过；吹网欲满的断路，将目不斜视。你用原树关键的骨架构造除了一棵更简单的树，简单到——不能再简单了。

相应的，你失去了在旅途中观赏风景的美好。

慢慢走，每个站点都有风景。
