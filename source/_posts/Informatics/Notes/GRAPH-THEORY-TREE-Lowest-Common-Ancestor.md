---
title: 图论 - 树 - 最近公共祖先
tags:
  - '[I] 图论'
  - '[I] 树'
categories:
  - Informatics
  - Notes
date: 2022-08-05 15:18:05
---


沿着时间之线追溯遥远的血缘

<!--more-->

## 问题

评测链接：<https://www.luogu.com.cn/problem/P3379>

树如家谱。

{% asset_img tree.png '"" "树"' %}

知一族之树，问两结点来自远古的血脉自何时始分化。

抑或言之，求树上两个结点的公共祖先中深度最深的那一个。

这是最近公共祖先（Lowest Common Ancestor, LCA）问题。

朴素算法是，首先将深度较深的结点跳到它的一个祖先，让其与另一个结点深度相同。然后不停对两个结点找父亲，直到两个结点相同，即找到了最近公共祖先。无疑，很容易 TLE。

当然，我们这里讨论的是对同一棵树多次询问，如果是单次询问的话那么朴素算法就是最快的。

## 倍增法

我们对结点一层一层地跳，那么就很容易被卡到 $\mathrm{O}(n)$，此时我们思考，是否可以一次性跳过很多层，来迅速略过祖先不同的时期，并且也要不至于找到非最深的公共祖先。具体要跳多少层我们并不清楚，但我们可以判断出跳过去是否超过了应该直接略过的层数，也就是如果我们跳过去过后两个结点相同了，那么就是超过。根据每个正整数都可以分解为若干个 $2$ 的幂之和的性质，我们可以每次跳过 $2$ 的幂层，这样时间即使被卡也被减少到了 $\mathrm{O}(\log n)$。即每次找最大可以跳的也就是跳过去不会相同的 $2$ 的幂层，直到两结点的父亲相同时为止。

我们预处理出一个空间复杂度为 $\mathrm{O}(n\log k)$ 的数组 $f_{i,j}$，指向结点 $i$ 的 $j$ 代祖先。预处理时间复杂度为 $\mathrm{O}(n\log k)$，因此单次询问就不要用倍增法了。

伪代码。

$$
\\begin{array}{rl}
  \\begin{array}{l}
    \\text{PRESET}(x) \\\\
    \\begin{array}{rl}
      1 &  f_{x,0} \\gets fa_x \\\\
      2 &  i \\gets 0 \\\\
      3 &  \\textbf{while } f_{x,i} \\neq 0 \\\\
      4 &  \\qquad i \\gets i + 1 \\\\
      5 &  \\qquad f_{x,i} \\gets f_{f_{x,i-1},i-1} \\\\
      6 &  \\textbf{for } y \\in S_x \\\\
      7 &  \\qquad \\text{PRESET}(y)
    \\end{array}
  \\end{array}
  &  \\begin{array}{l}
    \\text{LCA}(x,y) \\\\
    \\begin{array}{rl}
      1  &  \\textbf{if } d_x < d_y \\\\
      2  &  \\qquad \\text{SWAP}(x,y) \\\\
      3  &  \\textbf{while } d_x < d_y \\\\
      4  &  \\qquad x \\gets f_{x,2^{\\lfloor \\log_2(d_x-d_y) \\rfloor}} \\\\
      5  &  \\textbf{while } fa_x \\neq fa_y \\\\
      6  &  \\qquad i \\gets 0 \\\\
      7  &  \\qquad \\textbf{while } f_{x,i} \\neq f_{y,i} \\\\
      8  &  \\qquad \\qquad i \\gets i + 1 \\\\
      9  &  \\qquad x \\gets f_{x,i-1} \\\\
      10 &  \\qquad y \\gets f_{y,i-1} \\\\
      11 &  \\textbf{return } fa_x
    \\end{array}
  \\end{array}
\\end{array}
$$

代码。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std; 

int N, M, T = 0, S, x, y;
int h[500005], to[1000005], nxt[1000005], cnt = 0;
int fa[500005], f[500005][25], dep[500005];
int p[25];

void add_edge(int x, int y)
{
    ++cnt;
    to[cnt] = y;
    nxt[cnt] = h[x];
    h[x] = cnt;
}

void build_tree(int x)
{
    for (int i = h[x]; i; i = nxt[i])
    {
        if (to[i] != fa[x])
        {
            fa[to[i]] = x;
            dep[to[i]] = dep[x] + 1;
            build_tree(to[i]);
        } 
    }
}

void preset(int x)
{
    f[x][0] = fa[x];
    for (int i = 1; f[x][i - 1]; ++i) f[x][i] = f[f[x][i - 1]][i - 1];
    for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x]) preset(to[i]);
}

int lca(int x, int y)
{
    if (dep[x] < dep[y]) swap(x, y);
    while (dep[x] > dep[y]) x = f[x][upper_bound(p, p + T + 1, dep[x] - dep[y]) - p - 1];
    if (x == y) return x;    
    while (fa[x] != fa[y])
    {
        int i = 0;
        while (f[x][i] != f[y][i]) ++i;
        x = f[x][i - 1];
        y = f[y][i - 1];
    }
    
    return fa[x];
}

int main()
{
    scanf("%d%d%d", &N, &M, &S);
    for (int i = 1; i < N; ++i)
    {
        scanf("%d%d", &x, &y);
        add_edge(x, y);
        add_edge(y, x);
    }
    
    build_tree(S);
    preset(S);
    p[0] = 1;
    for (int i = 1; p[i - 1] <= N; ++i)
    {
        ++T;
        p[i] = p[i - 1] << 1;
    }
    
    for (int i = 1; i <= M; ++i)
    {
        scanf("%d%d", &x, &y);
        printf("%d\n", lca(x, y));
    }
    
    return 0;
} 
```

## Tarjan 算法

解决 LCA 的 Tarjan 算法是伟大的计算机科学家 Tarjan 发明的离线算法。

大致思路是，通过 DFS 和并查集。在每搜完以结点 $x$ 为根的子树后，先扫描与 $x$ 有关的询问 $(x,y)$，如果 $y$ 已经被搜到过，那么并查集的 $f_y$ 即为该询问的答案，记录下来。再将以 $x$ 为根的子树并入以 $x$ 的父结点为根的子树的并查集。

正确性在于，首先我们需要明确，如果能够处理询问 $(x,y)$，那么结点 $y$ 已经被搜到过，$x$ 恰好搜完。

此时，如果结点 $y$ 是结点 $x$ 的后代，那么 $f_y$ 就指向 $x$，答案正确。

如果结点 $y$ 非结点 $x$ 的后代，那么 $f_y$ 表示的是，包含结点 $y$ 的极大已搜完子树，其父亲节点的编号。因为包含结点 $y$ 的极大已搜完子树并不会包含结点 $x$，并且以其父亲节点为根的子树尚未搜完，说明结点 $x$ 不被包含在这棵极大子树内而被包含在以 $f_y$ 为根的子树内，那么答案即为 $f_y$。

这里并查集的合并比较特殊，我们进行合并的时候，一定是将独立并查集的一棵树的树根合并到父结点上去，因此直接改 ``f`` 数组即可而不用先调用 ``find(x)`` 函数，并且不能够按秩合并。

还需注意的是，洛谷上板子题的测试点 #11 包含 $a$ 与 $b$ 相同的询问，因此需要加一个特判。

```cpp
#include <cstdio>
#include <algorithm>

using namespace std; 

int N, M, S, x, y;
int h[500005], to[1000005], nxt[1000005], cnt = 0;
int fa[500005]; 
int qh[500005], qto[1000005], qnxt[1000005], qcnt = 1;
int f[500005];
int Ans[500005];

void add_edge(int x, int y)
{
    ++cnt;
    to[cnt] = y;
    nxt[cnt] = h[x];
    h[x] = cnt;
}

void add_ques(int x, int y)
{
    ++qcnt;
    qto[qcnt] = y;
    qnxt[qcnt] = qh[x];
    qh[x] = qcnt;
}

void build_tree(int x)
{
    for (int i = h[x]; i; i = nxt[i])
    {
        if (to[i] != fa[x])
        {
            fa[to[i]] = x;
            build_tree(to[i]);
        } 
    }
}

int find(int x)
{
    if (f[x] == x) return x;
    else return f[x] = find(f[x]);
}

void Tarjan(int x)
{
    for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x]) Tarjan(to[i]);
    for (int i = qh[x]; i; i = qnxt[i]) if (f[qto[i]] != qto[i] || qto[i] == x) Ans[i >> 1] = find(qto[i]);
    f[x] = fa[x];
}

int main()
{
    scanf("%d%d%d", &N, &M, &S);
    for (int i = 1; i < N; ++i)
    {
        scanf("%d%d", &x, &y);
        add_edge(x, y);
        add_edge(y, x);
    }
    for (int i = 1; i <= M; ++i)
    {
        scanf("%d%d", &x, &y);
        add_ques(x, y);
        add_ques(y, x);
    }
    
    build_tree(S);
    for (int i = 1; i <= N; ++i) f[i] = i;
    
    Tarjan(S);
    
    for (int i = 1; i <= M; ++i) printf("%d\n", Ans[i]);
    
    return 0;
} 
```

## 转化为欧拉序列上的 RMQ 问题

欧拉序列指的是，对于每棵子树，首先访问根结点，接着每访问完一棵子树，就再访问一次根结点，所生成的序列。

此时可以发现，访问同一结点下的不同子树的两个结点之间，会访问一次根结点；而访问同一结点下的同一子树的两个结点之间，并不会访问根结点。于是，我们对于询问 $(x,y)$，要求的就是在访问 $x,y$ 之间，所访问的最低深度的结点。打一个 ST 表完事。

~~不靠谱的《CCF 中学生程序设计 · 提高篇》也认为，~~该算法，理论价值大于实际价值。

## 总结

世界问，你是谁，来自哪？请回答。

爱什么，梦什么，去何方？请回答。

答案有，一百年的时光。

源自血脉分化之时的亲缘或已无迹可寻，取自民族的信念依旧强盛。无论最近公共祖先已经消散在了多少年前的历史尘埃之中，血液中依旧流淌着古老的民族自强不息的强大活力。
