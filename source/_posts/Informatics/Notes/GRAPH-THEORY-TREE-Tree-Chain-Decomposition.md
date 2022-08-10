---
title: 图论 - 树 - 树链剖分
tags:
  - '[I] 图论'
  - '[I] 树'
categories:
  - Informatics
  - Notes
date: 2022-08-09 21:24:28
---


独行其道，总会走到大道上

<!--more-->

## 干流——支流

给定一个序列，进行若干操作，操作可能同时修改某一段区间里的值，也可能查询某一段区间里的值之和。

我们用线段树。

给定一棵树，进行若干操作，操作可能同时修改某一条路径上或某一棵子树内的点权，也可能查询某一条路径或某一棵子树内的点权之和。（评测链接：<https://www.luogu.com.cn/problem/P3384>）

我们用线段树。

呃，可是线段树使用的要求是要有区间连续性的，这树结构，每个结点都有若干分叉诶，怎么维护。

那没啥事，既然有分叉，那我们就剖分成几段来维护就是了。我们按分叉将树上路径给拆分开，生成若干连续的区间，然后分段放到一个大的区间上，用线段树维护各区间，每次只需要将路径拆成几段连续的区间，进行修改和维护操作。（啥，你问我为什么不给每个区间开一棵线段树，$\mathrm{O}(n^2)$ 的空间复杂度好用吗？）

可是你又发现了大大的问题，每个分叉都拆，那不每段都只有一条边，成了朴素~~暴力~~算法了。我们想到，如果一个结点只有一个子结点，那么这里是没有必要拆分的，直接将其与唯一子结点视为同一段连续区间处理。同样的，就算是有多个子结点的结点，我们事实上也能保留其中一个结点加入父结点所在的连续区间，而剩下的边另外开一段连续的区间。

以河流譬喻，就是对从根结点往下走的路径分「干流」和「支流」，干流独立开一段连续区间，支流另外开一段区间，也可能作为相对干流，拥有二级支流。

就像这样。被同一颜色的线段串起来的结点构成一条相对干流，也都会汇入绝对干流，汇入的部分未上色。

{% asset_img decomposition.png '"" "树链剖分示意"' %} 

那么思考，在众多子结点中，应该选择哪一个作为干流呢？考虑到干流或水势浩大，或源远流长，我们可以采取**重链剖分**或者**长链剖分**。顾名思义，重链剖分是选择水势浩大即子树更大的分支作为干流，长链剖分是选择源远流长即子树更高的分支作为干流。一般意义上树链剖分都是指重链剖分。

悄悄告诉你，上面那张图既是重链剖分又是长链剖分哦。

接下来我们对重链剖分和长链剖分分别介绍，在此之前，先指定几个概念。

在 OI 里，我们将一个结点，沿着上述干流走下去的子结点称为重子结点，这条边被称为重边。走向支流的子结点称为轻子结点，这条边被称为轻边。显然，轻边将重边隔离开，我们若干重边相连组成的链称为重链，也就是上述相对干流，单独一个结点也被称为重链。

这样，一棵树被剖分成若干重链，在只关心结点而不关心边的条件下，一段路径也被剖分为若干重链的整体或部分。

树链剖分的性质有

  1. 每个结点属于唯一一条重链。
  2. 整棵树被完全且不重复地剖分成若干重链。
  3. 对整棵树进行 DFS 遍历，并且遍历子结点时先遍历重子结点，所生成的 DFS 序中，同一条重链的结点处在连续区间，同一棵子树的结点处在连续区间。

我们可以看到，对拆成若干条链的路径和子树，我们能够在区间上处理了。

## 水势浩大

在重链剖分中，我们将子树大的结点作为重子结点，其余结点作为轻子结点。

我们举一个重链剖分的例子。

{% asset_img decomposition.png '"" "重链剖分示意"' %} 

是不是感觉有些熟悉，~~因为这是我从上面复制过来的~~。

重链剖分有一个性质

  - 每个结点到根结点的路径上，至多存在 $\log_2n$ 条轻边即 $\log_2n$ 条重链。

原因是，我们从结点往上走到根结点的路径，每经过一条轻边，轻边联系的父结点的子树大小就至少是子结点的子树大小的 $2$ 倍，而总共只用 $n$ 个结点的树，最多经历 $\log_2n$ 次折腾。

重链剖分需要两次 DFS。

第一次 DFS，记录父结点（$\mathit{fa}_x$）、深度（$\mathit{dep}_x$）、子树大小（$\mathit{sz}_x$）、重子结点（$\mathit{hson}_x$）。

$$
\\begin{array}{l}
  \\text{BUILD}(x) \\\\
  \\begin{array}{rl}
    1 &  \\textbf{for } i \\in {E}\_x \\\\
    2 &  \\qquad \\textbf{if } \\mathit{to}\_i \\neq \\mathit{fa}\_x \\\\
    3 &  \\qquad \\qquad \\mathit{dep}\_{to\_i} \\gets \\mathit{dep}\_x + 1 \\\\
    4 &  \\qquad \\qquad \\mathit{fa}\_{to\_i} \\gets x \\\\
    5 &  \\qquad \\qquad \\text{BUILD}(\\mathit{to}\_i) \\\\
    6 &  \\qquad \\qquad \\mathit{sz}\_x \\gets \\mathit{sz}\_x + \\mathit{sz}\_{to\_i} \\\\
    7 &  \\qquad \\qquad \\mathit{hson}\_x \\gets \\mathit{sz}\_{\\mathit{hson}\_x} > \\mathit{sz}\_{\\mathit{to}\_i} \\ ? \\ \\mathit{hson}\_x : \\mathit{to}\_i \\\\
    8 &  \\mathit{sz}\_x \\gets \\mathit{sz}\_x + 1
  \\end{array}
\\end{array}
$$

第二次 DFS，记录结点所处重链的开头结点（$\mathit{top}_x$）、结点在重边优先 DFS 序中的编号（$\mathit{p}_x$）、$p$ 的反函数（$r_x$）、以该结点为根的子树在 DFS 序中最后一个结点的编号（$\mathit{tred}_x$）。

$$
\\begin{array}{l}
\\text{DECOMPOSITE}(x) \\\\
\\begin{array}{rl}
1  &  \\mathit{tot} \\gets \\mathit{tot} + 1 \\\\
2  &  p\_x \\gets \\mathit{tot} \\\\
3  &  r\_\\mathit{tot} \\gets x \\\\
4  &  \\textbf{if } \\mathit{hson}\_x \\neq 0 \\\\
5  &  \\qquad \\mathit{top}\_{\\mathit{hson}\_x} \\gets \\mathit{top}\_x \\\\
6  &  \\qquad \\text{DECOMPOSITE}(\\mathit{hson}\_x) \\\\
7  &  \\qquad \\textbf{for } i \\in E\_x \\\\
8  &  \\qquad \\qquad \\textbf{if } \\mathit{to}\_i \\neq \\mathit{fa}\_x \\land \\mathit{to}\_i \\neq \\mathit{hson}\_x \\\\
9  &  \\qquad \\qquad \\qquad \\mathit{top}\_{\\mathit{to}\_i} \\gets \\mathit{to}\_i \\\\
10 &  \\qquad \\qquad \\qquad \\text{DECOMPOSITE}(\\mathit{to}\_i) \\\\
11 &  \\mathit{tred}\_x = \\mathit{tot}
\\end{array}
\\end{array}
$$

我们 DFS 序生成的区间使用线段树或者其他数据结构，在这道题我们用线段树。

这是树链剖分的过程，预处理完成过后，我们要处理操作或者回答询问。

对于子树的操作好说，就是对 $p_x...\mathit{tred}_x$ 的连续区间进行操作。对于路径的操作，我们之前说过，要将其划分为若干重链。由于重链是重边首尾相连形成的，所以重链上的结点深度是单调的且相邻两个结点深度差为 $1$，所以我们大致思路是，找到 LCA，将左边的路径单独剖分成链处理，将右边的路径单独剖分成链处理。事实上处理过程中不用刻意去求 LCA，只需要明白我们应该左右两边同时向上处理重链，而不是从一端处理到另一段。

我们采用类似倍增法求 LCA 的向上跳的方式，两边处理完的最终标志是 $x,y$ 两个结点处在同一条重链内，这里再加上 $p_x...p_y$ （端点不分先后）的处理或者询问即可。我们明白，支流相对于干流，$\mathit{top}$ 值是要更大，因此我们每次选取 $r\in\{x,y\}$ 中 $\mathit{top}_r$ 更大的一个，跳到 $\mathit{fa}_{\mathit{top}_r}$，也就是支流汇入干流的地方，并处理或询问跳过的重链其中一段，直到 $\mathit{top}_x=\mathit{top}_y$ 为止。

在过程中，每一个 $x,y$ 都是从 $x_0,y_0$ 到根节点的路径中属于所属的重链的结点中深度最大的一个，因此到 $\mathit{top}_x=\mathit{top}_y$ 的时候，$x,y$ 中更大的一个即为 LCA，此时再处理或询问剩下的一段即可。由此可见，树链剖分还可以用来求 LCA。

```cpp
#include <iostream>
#include <cstdio>
#include <algorithm>

using namespace std;

int N, M, R, x, y, opt;
long long P, z;

long long a[100005];
int fa[100005], sz[100005], hson[100005], dep[100005];

int h[100005], nxt[200005], to[200005], cnt = 0;

int p[100005], r[100005], top[100005], tred[100005], tot = 0;

long long s[400005], tag[400005];

void build(int x, int y)
{
    ++cnt;
    to[cnt] = y;
    nxt[cnt] = h[x];
    h[x] = cnt;
}

void Dfs1(int x)
{
    sz[x] = 1;
    for (int i = h[x]; i; i = nxt[i])
    {
        if (to[i] != fa[x])
        {
            fa[to[i]] = x;
            dep[to[i]] = dep[x] + 1;
            Dfs1(to[i]);
            sz[x] = sz[x] + sz[to[i]];
            if (sz[to[i]] > sz[hson[x]]) hson[x] = to[i];
        }
    }
}

void Dfs2(int x)
{
    ++tot;
    p[x] = tot;
    r[tot] = x;
    if (hson[x])
    {
        top[hson[x]] = top[x];
        Dfs2(hson[x]);
        for (int i = h[x]; i; i = nxt[i])
        {
            if (to[i] != fa[x] && to[i] != hson[x])
            {
                top[to[i]] = to[i];
                Dfs2(to[i]);
            }
        }
    }
    tred[x] = tot;
}

void buildST(int k, int l, int r)
{
    if (l == r) return s[k] = a[::r[l]] % P, void();
    
    int mid = (l + r >> 1);
    buildST(k << 1, l, mid);
    buildST(k << 1 | 1, mid + 1, r);
    s[k] = (s[k << 1] + s[k << 1 | 1]) % P;
}

void pushdown(int k, int l, int r)
{
    if ((k << 1) <= (N << 2)) tag[k << 1] = (tag[k << 1] + tag[k]) % P;
    if ((k << 1 | 1) <= (N << 2)) tag[k << 1 | 1] = (tag[k << 1 | 1] + tag[k]) % P;
    s[k] = ((s[k] + (r - l + 1) * tag[k]) % P + P) % P;
    tag[k] = 0;
    tag[0] = 0;
}

void modify(int k, int l, int r, int ml, int mr, long long d)
{
    pushdown(k, l, r);
    if (l == ml && r == mr) return tag[k] = d, void();
    
    s[k] = ((s[k] + (mr - ml + 1) * d) % P + P) % P;
    int mid = (l + r >> 1);
    if (mid >= mr) modify(k << 1, l, mid, ml, mr, d);
    else if (mid + 1 <= ml) modify(k << 1 | 1, mid + 1, r, ml, mr, d);
    else modify(k << 1, l, mid, ml, mid, d), modify(k << 1 | 1, mid + 1, r, mid + 1, mr, d);
}

long long query(int k, int l, int r, int ql, int qr)
{
    pushdown(k, l, r);
    if (l == ql && r == qr) return s[k];
    
    int mid = (l + r >> 1);
    if (mid >= qr) return query(k << 1, l, mid, ql, qr);
    else if (mid + 1 <= ql) return query(k << 1 | 1, mid + 1, r, ql, qr);
    else return (query(k << 1, l, mid, ql, mid) + query(k << 1 | 1, mid + 1, r, mid + 1, qr)) % P;
}

int main()
{
    scanf("%d%d%d%lld", &N, &M, &R, &P);
    for (int i = 1; i <= N; ++i) scanf("%lld", &a[i]);
    for (int i = 1; i < N; ++i)
    {
        scanf("%d%d", &x, &y);
        build(x, y);
        build(y, x);
    }
    
    Dfs1(R);
    
    top[R] = R;
    Dfs2(R);
    
    buildST(1, 1, N);
    
    for (int i = 1; i <= M; ++i)
    {
        scanf("%d", &opt);
        switch (opt)
        {
            case 1:
                scanf("%d%d%lld", &x, &y, &z);
                while (top[x] != top[y])
                {
                    if (dep[top[x]] < dep[top[y]]) swap(x, y);
                    modify(1, 1, N, p[top[x]], p[x], z);
                    x = fa[top[x]];
                }
                if (dep[x] < dep[y]) swap(x, y);
                modify(1, 1, N, p[y], p[x], z);
                break;
            case 2:
                scanf("%d%d", &x, &y);
                z = 0;
                while (top[x] != top[y])
                {
                    if (dep[top[x]] < dep[top[y]]) swap(x, y);
                    z = (z + query(1, 1, N, p[top[x]], p[x])) % P;
                    x = fa[top[x]];
                }
                if (dep[x] < dep[y]) swap(x, y);
                printf("%lld\n", (z + query(1, 1, N, p[y], p[x])) % P);
                break;
            case 3:
                scanf("%d%lld", &x, &z);
                modify(1, 1, N, p[x], tred[x], z);
                break;
            case 4:
                scanf("%d", &x);
                printf("%lld\n", query(1, 1, N, p[x], tred[x]) % P);
                break;
        }
    }
    
    return 0;
} 
```

重链剖分预处理的时间复杂度为 $\mathrm{O}(n)$，单次操作的时间复杂度为 $\mathit{O}(\log^2n)$。

由于每个结点到根节点的路径上至多存在 $\log_2n$ 条重链，也就至多被剖分成 $\log_2n$ 段，每一段都需要 $\mathit{O}(\log n)$ 的时间，单次操作就要 $\mathit{O}(\log^2n)$ 的时间。

## 源远流长

长链剖分也没有什么特殊的，就是重子结点的定义换成了子树最高的一个。

当然性质也变化了

  - 每个结点到根结点的路径上，至多存在 $\sqrt{2n}$ 条轻边即 $\sqrt{2n}$ 条重链。

还是一样的思路，每经过一条轻边，整棵树的结点数都至少要增加当前已经走过的路径长度，那么经过 $m$ 条轻边的话，整棵树的结点就至少有 $\frac{m(m+1)}{2}+m+1$ 个，$m$ 上限大约就在 $\sqrt{2n}$。

因此，单次操作的时间复杂度为 $\sqrt{n}\log n$。

## 结话

将一棵树剖分成链，无论重链剖分还是长链剖分，均将更多或者更高的分支归到主干，如少数服从多数，近代民主的雏形。

无论持何异见，如何不得志独行其道，总会在至多 $\log n$ 过后归于大道，归于布尔什维克多数派。

独行其道，总会走到大道上。
