---
title: 动态规划 - 区间动态规划
tags:
  - '[I] 动态规划'
categories:
  - Informatics
  - Notes
date: 2022-04-12 13:29:04
---


区间上的抉择与合并

<!--more-->

## 导语

回顾一下，我们在处理线性动态规划的问题时，总是定义一个当前状态的最优子结构，一般意味着以当前状态结尾的或者起始状态到当前状态的最优，换句话说，其中一个端点在边界上，只需表示另一个端点。而在另一类动态规划中，我们的最优子结构所概括的范围不一定有一个端点在边界上，转移是通过分割小区间再合并，有点类似于分治的思想。

具体来说，定义了一个最优子结构 $f_{i,j}$ 表示状态 $i$ 到状态 $j$ 的子问题的最优解，一般状态转移方程就是
$$
f_{i,j}=\max/\min\{opt(f_{i,k},f_{k+1,j})\}
$$
以上 $i$ , $j$ 可以是多个参数（多维）， $opt$ 是运算符。

## T 石子合并

题目来源：NOI 1995
评测链接：<https://www.luogu.com.cn/problem/P1880>

在一个圆形操场的四周摆放 $N$ 堆石子，现要将石子有次序地合并成一堆，规定每次只能选相邻的2堆合并成新的一堆，并将新的一堆的石子数，记为该次合并的得分。

试设计出一个算法,计算出将 $N$ 堆石子合并成 $1$ 堆的最小得分和最大得分。

<br>

这是一道区间 DP 经典例题，~~来自 NOI1995~~ ，我们用来分析一下区间 DP 和线性 DP 的区别和联系。

首先忽略环状，将石子摆成一条直线。

这道题目中，我们不知从何下手，换言之，题目中没有给出特定的合并顺序，只要在区间上的子区间操作均为合法；而处理线性 DP 问题的时候，要么有事件发生的严格先后顺序，要么就如 LIS 和 LCS 般可以指定先后顺序。我们将线性 DP 的套路套用到本问题上来，发现并不能单纯用一个状态作为最优子结构的参数，而同时需要左右端点两个状态作为参数。注意，这里的状态可以表示为多个参数，但它们共同代表一个状态。

分析这道题，我们用 $f_{i,j}$ 表示合并区间 $[i,j]$ 上的石子到一堆的最优解，那么根据题意，这堆石子就可以由区间 $[i,k]$ 和 $[k+1,j]$ 合并过后的两堆石子合并而来，有
$$
f_{i,j}=\min/\max\{f_{i,k}+f_{k+1,j}+\sum_{x=i}^ja_x|k\in[i,j)\} \nonumber
$$
分析这个状态转移方程，不难得出边界条件为 $f_{i,i}=0$ ，转移顺序按照 $j-i$ 从小到大排序。对于 $\\sum_{x=i}^ja_x$ 的处理，需要维护前缀和。时间复杂度为 $\mathrm{O}(n^2)$ 。

可以发现，区间 DP 和线性 DP 的联系在于 DP 思维的延续，本质上的区别仅仅在于组成最优子结构的状态含义。

回到本题，再考虑环状情况。有一种思路是基于本题中总会有最有一次合并，那么就从最后一次合并处将圆环断开，转化成区间处理，如下图。由于我们并不知道最后一次在何处，因此要将每一处断开，求的结果取最优值，于是复杂度升到了 $\mathrm{O}(n^3)$ 。

{% asset_img stonemerging1.png '"" "石子合并 解图 1"' %}

我们将该方法进行优化，可以让时间复杂度降到 $\mathrm{O}(n^2)$ 。在上述方法中，总会导致首尾断开，如果我们能在将环断开为区间的前提下保证首尾相连，那便可以解决 $n$ 次 DP 的问题。最好的方法是在断开过后在尾部复制一遍原区间，使首尾相连，而寻找最终答案时只需比较每个 $f_{i, i+n-1}$ 的大小即可。

{% asset_img stonemerging2.png '"" "石子合并 解图 2"' %}

优化上述方法的方法，实际上也运用了 DP 的思想。核心要旨便是提高数据利用率，避免重复计算。如果在两次 DP 中，存在某一固定连续区间，那么这一区间在两次 DP 中的最优解都相同，直观来看

{% asset_img stonemerging3.png '"" "石子合并 解图 3"' %}

这是我们处理 DP 问题中环状情况的一般套路，**任意选择一个位置断开，复制形成 2 倍长度的链**。

综上所述，代码如下。

<details class="note">
  <summary>参考代码</summary>

```cpp
#include<iostream>
#include<cstdio>
#include<cmath>
using namespace std;
int n,Min=0x7fffffff,Max=0,ax[300][300],in[300][300],a[300];
int sum[300];
int add(int i,int j)
{
    return sum[j]-sum[i-1];
}
int main() 
{
    cin>>n;
    for(int i=1;i<=n+n;i++)
    {
        if(i<=n) cin>>a[i];
        a[i+n]=a[i];
        sum[i]=sum[i-1]+a[i];
    }
    for(int k=1;k<n;k++)
    {
        int i=1,j=i+k;
        for(i,j;j<n*2;i++,j++)
            {
                  in[i][j]=0x7fffffff;
                  for(int l=i;l<j;l++)
            {
                ax[i][j]=max(ax[i][j],ax[i][l]+ax[l+1][j]+add(i,j));
                in[i][j]=min(in[i][j],in[i][l]+in[l+1][j]+add(i,j));
            }
        }
    }
    for(int i=1;i<=n;i++)
    {
        if(in[i][i+n-1]<Min) Min=in[i][i+n-1];
        if(ax[i][i+n-1]>Max) Max=ax[i][i+n-1];
    }
    cout<<Min<<endl<<Max;
    return 0;  
}
```

</details>

练习：[[NOIP 2006 提高组] 能量项链](https://www.luogu.com.cn/problem/P1063)

## T 加分二叉树

题目来源：NOIP 2003 提高组
评测链接：<https://www.luogu.com.cn/problem/P1040>

设一个 $n$ 个节点的二叉树 $\text{tree}$ 的中序遍历为$(1,2,3,\ldots,n)$，其中数字 $1,2,3,\ldots,n$ 为节点编号。每个节点都有一个分数（均为正整数），记第 $i$ 个节点的分数为 $d_i$，$\text{tree}$ 及它的每个子树都有一个加分，任一棵子树 $\text{subtree}$（也包含 $\text{tree}$ 本身）的加分计算方法如下：

$\text{subtree}$ 的左子树的加分 $\times$ $\text{subtree}$ 的右子树的加分 $+$ $\text{subtree}$ 的根的分数。

若某个子树为空，规定其加分为 $1$，叶子的加分就是叶节点本身的分数。不考虑它的空子树。

试求一棵符合中序遍历为 $(1,2,3,\ldots,n)$ 且加分最高的二叉树 $\text{tree}$。要求输出

1. $\text{tree}$ 的最高加分。

2. $\text{tree}$ 的前序遍历。

<br>

一道看似树形 DP 实则区间 DP 的题。

其实只要一思考，很容易可以知道这道题是在区间上做文章而不是树上，仅仅是用到了树的一点知识。在给出的区间上，用 $f_{i,j}$ 表示区间 $[i,j]$ 作为一棵子树，而并不明确根，那么就可以枚举区间上的点作为树根进行决策转移，有

$$
f_{i,j}=\max\{f_{i,k-1}\times f_{k+1,j}+d_k|k\in(i,j)\}
$$

至于第 2 个问题，相信熟练于线性动态规划的你一定知道如何由最优解还原出最优解的情况吧。代码如下：

<details class="note">
  <summary>参考代码</summary>

```cpp
#include <cstdio>

unsigned n, sc[31];
unsigned f[31][31];

unsigned max(unsigned x, unsigned y)
{
    return x > y ? x : y;
}

unsigned function(unsigned x, unsigned y)
{
    if (f[x][y]) return f[x][y];
    if (x > y) return 1;
    if (x == y) return sc[x];
    if (x == y - 1) return sc[x] + sc[y];
    for (unsigned i = x; i <= y; ++i)
    {
        f[x][y] = max(f[x][y], function(x, i - 1) * function(i + 1, y) + sc[i]);
    }
    return f[x][y];
}

void output(unsigned x, unsigned y)
{
    if (x > y) return;
    if (x == y) printf("%u ", x);
    for (unsigned i = x; i <= y; ++i)
    {
        if (function(x, y) == function(x, i - 1) * function(i + 1, y) + sc[i])
        {
            printf("%u ", i);
            output(x, i - 1);
            output(i + 1, y);
            return;
        }
    }
}

int main()
{
    scanf("%u", &n);
    for (int i = 1; i <= n; ++i)
        scanf("%u", sc + i);
    printf("%u\n", function(1, n));
    output(1, n);
    return 0;
}
```

</details>

## T 金字塔

评测链接： <https://www.acwing.com/problem/content/286/>

探险队来到金字塔，金字塔由若干房间组成，房间之间连有通道。

如果把房间看作节点，通道看作边的话，整个金字塔呈现一个有根树结构，节点的子树之间有序，金字塔有唯一的一个入口通向树根。

并且，每个房间的墙壁都涂有若干种颜色的一种。

有一种机器人，会从入口进入金字塔，之后对金字塔进行深度优先遍历。

机器人每进入一个房间（无论是第一次进入还是返回），都会记录这个房间的颜色。

最后，机器人会从入口退出金字塔。

显然，机器人会访问每个房间至少一次，并且穿越每条通道恰好两次（两个方向各一次），然后，机器人会得到一个颜色序列。

但是，探险队员发现这个颜色序列并不能唯一确定金字塔的结构。

现在他们想请你帮助他们计算，对于一个给定的颜色序列，有多少种可能的结构会得到这个序列。

因为结果可能会非常大，你只需要输出答案对 $10^9$ 取模之后的值。

<br>

是不是感觉这道题神似 加分二叉树 ？猜得没错，这也是一个形似树形 DP 实则区间 DP 的 **Y 货**（致敬 长城爷爷）。

注意， DFS 序不同于前序、中序、后序遍历的任何一种，它是从每棵子树退回根都要重新输出一次根。

再注意，题目中描述「节点的子树之间有序」，有两层意思：1.节点的两棵子树交换位置视为不同的情况；2. DFS 序严格按照节点的子树顺序安排，因此不用考虑交换子树的排列组合问题。

那么这道题就简单了，用 $f_{i,j}$ 表示区间 $[i,j]$ 为一棵子树的 DFS 序，那么树根的颜色就是 $S_i$ 和 $S_j$ 代表的颜色。根据区间内出现的树根颜色进行划分或者不划分，可以排列出这棵子树之下可能出现所有子树排列，但是这样时间复杂度就会承受不了。

再想想，若对于区间 ABABABA，可以划分为 A 下 3 个 B 的形态（如下图），但是同样是这样的形态，不仅可以划分为 |AB|AB|AB|A 的形式，也可以将第一棵子树划分出来，将后面的 ABABA 再行划分为 |AB|AB|A 。

<div style="width:50%;margin:auto">
  {% asset_img pyramid.png '"" "金字塔 解图 1"' %}
</div>

总结一下，这样的优化方法实质上也是用动态规划思想的子问题递归代替了排列组合，本质也是用动态规划的转移代替搜索的盲目排列的做法。我们现在已经遇到了很多次这样的思想，譬如多重背包的二进制拆分法、本文 加分二叉树 和 金字塔，等等。

这里状态转移方程不方便用数学公式表示，伪代码如下

$$
\\begin{align}
  & \\text{SOVLE-POSSIBLE-SCENARIOS}(A)\\\\
  & \\begin{array}{rl}
      1 &  \\textbf{for } d=2 \\textbf{ to } n \\\\
      2 &  \\qquad \\textbf{for } i=1 \\textbf{ to } n-d+1 \\\\
      3 &  \\qquad \\qquad j=i+d-1 \\\\
      4 &  \\qquad \\qquad \\textbf{if } S[i]==S[j] \\\\
      5 &  \\qquad \\qquad \\qquad \\textbf{for } k=i+1 \\textbf{ to } j \\\\
      6 &  \\qquad \\qquad \\qquad \\qquad \\textbf{if } S[k]==S[i] \\\\
      7 &  \\qquad \\qquad \\qquad \\qquad \\qquad f[i][j] = (f[i][j] + f[i+1][k-1] \\times f[k][j]) \\mod MOD \\\\
    \\end{array}
\\end{align}
$$

边界条件， $f[i][i]=1$ 。

请看代码：

<details class="note">
  <summary>参考代码</summary>

```cpp
#include <cstdio>
#include <cstring>

const int MOD = 1e9;

char s[305];
long long n, f[305][305];

int main()
{
    scanf("%s", s + 1);
    n = strlen(s + 1);
    for (int i = 1; i <= n; ++i)
        f[i][i] = 1;

    for (int d = 2; d <= n; ++d)
        for (int i = 1, j = d; j <= n; ++i, ++j)
            if (s[i] == s[j])
                for (int k = i + 1; k <= j; ++k)
                    if (s[k] == s[i])
                        f[i][j] = (f[i][j] + f[i + 1][k - 1] * f[k][j]) % MOD;

    printf("%d", f[1][n]);
    return 0;
}
```

</details>

p.s.不要忘了模数，调了半天没调出来……

总之，这道题也就是简简单单的区间 DP 问题。

## 总结

区间 DP 就是在区间上进行的 DP 操作~~（废话）~~。它通过 DP 的等效子问题思想、基于区间划分，将问题递归成子区间上的子问题求解。这也是一类比较简单的 DP 。

有时会出现形似树形 DP 的区间 DP 问题，比如说本文 加分二叉树、金字塔。

一场区间合并的视觉盛宴，你是否确信问题分解的选择中会有迷茫，有权衡，有统一？

试着在跋涉的长途中找到合适的驿站，收拾好心情，再整装上阵。
