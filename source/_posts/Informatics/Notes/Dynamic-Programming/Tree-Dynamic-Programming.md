---
title: 动态规划 - 树形动态规划
tags:
  - '[I] 动态规划'
  - '[I] 树'
categories:
  - Informatics
  - Notes
date: 2022-06-17 15:09:15
---


天生的子问题递归——父与子

<!--more-->

## 前言

在区间动态规划一节中看了这么多冒充树形 DP 的 **Y 货**，是时候该见证一下真正的树形动态规划了。我们先从一道简单题开始（洛谷难度评级 <font style="color:green">普及+/提高</font> ）。

## T 二叉苹果树

评测链接：<https://www.luogu.com.cn/problem/P2015>

有一棵苹果树，如果树枝有分叉，一定是分二叉（就是说没有只有一个儿子的结点）

这棵树共有 $N$ 个结点（叶子点或者树枝分叉点），编号为 $1 \sim N$，树根编号一定是 $1$。

我们用一根树枝两端连接的结点的编号来描述一根树枝的位置。下面是一颗有 $4$ 个树枝的树：

{% codeblock line_number:false %}
2   5
 \ / 
  3   4
   \ /
    1
{% endcodeblock %}

现在这颗树枝条太多了，需要剪枝。但是一些树枝上长有苹果。

给定需要保留的树枝数量，求出最多能留住多少苹果。

<br>

这可是一道货真价实的树形 DP 。概括问题，给出一棵结点带权的二叉树，在保留一定数量的枝条的情况下求能保留的结点权值的最大值。

由于树形结构自身就是递归结构，因此对于每一棵子树都可以适用于上述问题，并且，可以将限制（保留枝条数量）传递给子问题，再从子问题递归回来答案并合并成当前问题的答案——即，DP 思想。

在一般的树形 DP 中，由于结构的特殊，转移方程要求先求解子树再求出本树，安排一种具体的求解顺序比较麻烦。又因为，树形结构上 DFS 最多只会遍历每个点 1 遍，时间复杂度为 $\mathrm{O}(n)$ ，而我们在每个结点上都必定要求解一遍，因此不会提高时间复杂度。树形结构这样不同于一般 DP 搜索产生的拓扑图那样可能出度 > 1 ，就决定了树形结构可以递归的模板来写。而一般来说，树形 DP 都是以递归形式写出的。

具体在本题中，首先 DFS 一遍整棵树，统计出每棵子树的枝条数 $b_i$ 。然后再 DFS 一遍，这次 DFS 就是 DP 的过程。

定义 $f_{i,j}$ 表示在以 $i$ 为根的子树上保留 $j$ 根枝条所得到的最大权值和，那么就有

$$
f_{i,j}=max\{a_i,f_{l_i,j-1}+a_i,f_{r_i,j-1}+a_i,f_{l_i,k}+f_{r_i,j-2-k}+a_i|k\in[j-2-b_{r_i},b_{l_i}]\}
$$

(无非也就是不保留子树、保留一棵子树、保留两棵子树)

边界条件：对于每个叶子结点 $i$ ，$f_{i,x}=a_i(x\in \mathbb{N})$ 。

代码如下。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>

int n, q, x;
int c1[101], c2[101], a1[101], a2[101];
int f[101][101], p[101];

int max(int a, int b)
{
    return a > b ? a : b;
}

void set(int x)
{
    if (!c1[x]) p[x] = 0;
    else
    {
        set(c1[x]);
        set(c2[x]);
        p[x] = p[c1[x]] + p[c2[x]] + 2;
    }
}

int function(int x, int k)
{
    if (f[x][k]) return f[x][k];
    if (k <= 0) return 0;
    int ans = 0;
    if (p[c1[x]] + 1 >= k) ans = max(ans, function(c1[x], k - 1) + a1[x]);
    if (p[c2[x]] + 1 >= k) ans = max(ans, function(c2[x], k - 1) + a2[x]);
    for (int i = max(1, k - p[c2[x]] - 1); i < k && p[c1[x]] + 1 >= i; ++i)
    {
        ans = max(ans,
                  function(c1[x], i - 1) + function(c2[x], k - i - 1)
                  + a1[x] + a2[x]);
    }
    f[x][k] = ans;
    return ans;
}

int main()
{
    scanf("%d%d", &n, &q);
    for (int i = 1; i < n; ++i)
    {
        scanf("%d", &x);
        if (c1[x]) scanf("%d%d", c2 + x, a2 + x);
        else scanf("%d%d", c1 + x, a1 + x);
    }
    set(1);
    printf("%d\n", function(1, q));
    return 0;
}
```
{% endcontentbox %}

## T 有依赖的背包问题

评测链接：<https://www.acwing.com/problem/content/10/>

有 N 个物品和一个容量是 V 的背包。

物品之间具有依赖关系，且依赖关系组成一棵树的形状。如果选择一个物品，则必须选择它的父节点。

如下图所示：

{% asset_img dependenceknapsack.png '"" "有依赖的背包问题 题图"' %}

如果选择物品 $5$，则必须选择物品 $1$ 和 $2$。这是因为 $2$ 是 $5$ 的父节点，$1$ 是 $2$ 的父节点。

每件物品的编号是 $i$，体积是 $v_i$，价值是 $w_i$，依赖的父节点编号是 $p_i$。物品的下标范围是 $1…N$。

求解将哪些物品装入背包，可使物品总体积不超过背包容量，且总价值最大。

输出最大价值。

<br>

有依赖的背包问题，亦或树上背包，就是根据依赖关系作为父子关系建立一棵树，然后树上 DP。~~（说清楚了吧）~~

因为物品有依赖关系，因此不方便确定线性的 DP 顺序，并且这样做反而会产生后效性。我们就可以把后效性放在递归结构里暗中处理，也就是具象化为树枝，即建树，消除不合法的转移。

于是就可以用树形 DP 的一般性套路和背包问题的一般性套路结合解答。

本题的难点在于多儿子的管理。我们可以借鉴分组背包的思路，因为分组背包同样也是同一组在不同的体积限制之下获得不同的收益，也就是同一组不是简单的一样物品。我们处理分组背包的问题时，将每一组的物品打包，内部决策过后再进行背包决策；同样的，我们对于一个父结点和多个子结点，可以将每个子结点打包，内部决策（由于 树形 DP 的递归性质，内部决策又是一个外部决策的子问题），再通过 0/1 背包决策出父结点。时间复杂度为 $\mathrm{O}(n^2V^2)$ 。

事实上，树上背包退化成只有一级依赖关系后，就成为了变形的分组背包。这也与树上背包与分组背包解决方法本质上一致相符合。

代码如下，以下代码在由子问题推导的时候采取了 0/1 背包的**滚动数组**空间压缩技巧。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstring>

template <class T>
T max(T x, T y)
{
    return x > y ? x : y;
}

int N, V, v[101], w[101], p[101];
int h[101], to[101], nxt[101], t = 0;
int f[101][101], rt;

void build(int x, int y)
{
    ++t;
    to[t] = y;
    nxt[t] = h[x];
    h[x] = t;
}

void dp(int x)         // DP 核心，采用 DFS 模式递归到叶子结点
{
    for (int i = v[x]; i <= V; ++i)      // 该子树的根节点一定要选
        f[x][i] = w[x];
    for (int i = h[x]; i; i = nxt[i])    // 遍历子结点，之所以把它安排到外层循环是因为 0/1 背包的要求
    {
        #define y to[i]
        dp(y);
        for (int j = V; j >= v[x]; --j)  // 这一层是滚动数组优化技巧要求要特别注意遍历顺序的一层
            for (int k = v[y]; k <= j - v[x]; ++k)     // 这一层是寻找当前最优决策
                f[x][j] = max(f[x][j], f[x][j - k] + f[y][k]);
    }
    /*
    以上三层循环均结束过后，f[x][y]|y∈N 才同时最终确定，循环过程中均为过程量。
    外两层循环为 0/1 背包的模板结构。
    */
}

int main()
{
    scanf("%d%d", &N, &V);
    for (int i = 1; i <= N; ++i)
    {
        scanf("%d%d%d", v + i, w + i, p + i);
        build(p[i], i);
        if (p[i] == -1) rt = i; 
    }

    dp(rt);
    printf("%d", f[rt][V]);
    return 0;
}
```
{% endcontentbox %}

## 换根 DP

换根 DP，又叫换根法，是适用于树形 DP 的一种辅助技巧。

需要用到换根法的树形 DP 问题一般有以下特点：

1. 无根树。
2. 枝条只代表结点之间相连，不具备严格父子关系。

由此可见，这样的树形 DP 问题并不是一般形式上的子问题递归，而通常需要指定根进行 DP 后根据 DP 结果再做处理（一般是树上统计）。如下题。

### T 积蓄程度

评测链接：<https://www.acwing.com/problem/content/289/>

有一个树形的水系，由 $N−1$ 条河道和 $N$ 个交叉点组成。

我们可以把交叉点看作树中的节点，编号为 $1∼N$，河道则看作树中的无向边。

每条河道都有一个容量，连接 $x$ 与 $y$ 的河道的容量记为 $c(x,y)$。

河道中单位时间流过的水量不能超过河道的容量。

有一个节点是整个水系的发源地，可以源源不断地流出水，我们称之为源点。

除了源点之外，树中所有度数为 $1$ 的节点都是入海口，可以吸收无限多的水，我们称之为汇点。

也就是说，水系中的水从源点出发，沿着每条河道，最终流向各个汇点。

在整个水系稳定时，每条河道中的水都以单位时间固定的水量流向固定的方向。

除源点和汇点之外，其余各点不贮存水，也就是流入该点的河道水量之和等于从该点流出的河道水量之和。

整个水系的流量就定义为源点单位时间发出的水量。

在流量不超过河道容量的前提下，求哪个点作为源点时，整个水系的流量最大，输出这个最大值。

<br>

这道题就给我们描绘了一棵无根树，那么就要用换根 DP。

大概思路就是首先 DFS 一遍整棵树（DP），接着再遍历每个结点，通过先前的 DP 结果在 $\mathrm{O}(1)$ 的时间内计算出以该结点为根的情况下问题的答案，通过比较得出最优解。

假设我们指定一个结点为根，构建了一棵有根树，如下图。

{% asset_img accumulationdegree.jpg '"" "积蓄程度 解图"' %}

当前我们要对红色结点进行统计，一部分流量来自于以它为根的子树，可以直接统计；而另一部分流量来自于它的父结点，显然可以在第二次 DFS 的时候根据 DP 结果计算出来，就是将非 该路径* 上的子树流量统计传递下去。

*该路径指的是当前节点到根节点的路径。

总之，第 1 次 DFS 进行 DP 并明确父子关系，第 2 次 DFS 进行计算统计。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstring>

template <class T>
T min(T x, T y)
{
    return x < y ? x : y;
}
template <class T>
T max(T x, T y)
{
    return x > y ? x : y;
}

int T;

int n, x, y, z;
int h[400005], to[400005], nxt[400005], we[400005], fa[400005], t;
int f[400005], Ans;

void build(int x, int y, int z)
{
    ++t;
    to[t] = y;
    nxt[t] = h[x];
    we[t] = z;
    h[x] = t;
}

int dp(int x)
{
    if (!nxt[h[x]] && to[h[x]] == fa[x]) return f[x] = 0, 0x7fffffff;
            // f[x] = 0是为了避免源点在海边而出现结果无穷大的情况，返回 0x7fffffff 是因为大海能吸收无限水。
    for (int i = h[x]; i; i = nxt[i])
        if (to[i] != fa[x])
        {
            fa[to[i]] = x;
            f[x] += min(dp(to[i]), we[i]);
        }
    return f[x];
}

void cnt(int x, int up)          // up 表示水倒流回父结点的最大流量
{
    Ans = max(Ans, up + f[x]);
    for (int i = h[x]; i; i = nxt[i])
        if (to[i] != fa[x])
        {
            if (nxt[h[x]]) cnt(to[i], min(up + f[x] - min(f[to[i]], we[i]), we[i]));
            else cnt(to[i], we[i]);     // 若根节点恰好就在海边，应下传的最大流量为该边容量。
        }
}

int main()
{
    scanf("%d", &T);
    for (int test = 0; test < T; ++test)
    {
        t = 0;                            //
        memset(h, 0, sizeof h);           // 多组数据，清空操作
        memset(f, 0, sizeof f);           //
        Ans = 0;
        scanf("%d", &n);
        for (int i = 1; i < n; ++i)
        {
            scanf("%d%d%d", &x, &y, &z);
            build(x, y, z);
            build(y, x, z);
        }

        dp(1);
        cnt(1, 0);

        printf("%d\n", Ans);
    }
    return 0;
}
```
{% endcontentbox %}

## 总结

树形 DP 在有根树上，体现为子树的子问题递归。

树形 DP 在无根树上，体现为 DP 结果的树上统计。

这就是父与子的对话，父对子的传递统计。

递归之归。
