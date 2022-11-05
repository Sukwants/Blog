---
title: 动态规划 - 单调队列优化
tags:
  - '[I] 动态规划'
categories:
  - Informatics
  - Notes
date: 2022-07-14 22:33:21
---


谨持单调，置答队首，取之即来，舍之既去

<!--more-->

## 前言

所谓「单调队列优化动态规划」实际并不是一种动态规划，事实上，冠以「优化」二字的动态规划都并非一种专门的动态规划，而是动态规划的优化技巧。

因此，这里不命名为「单调队列优化动态规划」，以将其与动态规划的分类区别。

## 前置知识

**单调队列**，更多在[数据结构 - 单调栈 / 单调队列](//还没写呢)。

单调队列是用于实现一类特殊用途的队列，其运行规则与一般队列无异，区别在于其并不是用来管理先进先出的顺序，而是利用单调的特性完成一个集合的更新和统计。

实现单调队列的容器并不是普通队列，而是**双端队列**。双端队列与普通队列的区别在于普通队列只能尾进头出，而双端队列在首尾都可以进出，也在首尾都可以查询。

既然如此，聪明如你，一定会发现这根本就违背了队列关于 FIFO 的基本原则，事实上确实如此，如果只开放尾进头出的用途，那么这就是普通队列；而如果只开放尾进尾出的用途，那么这也就是普通的栈。所以说，在 C++ 的 STL 库里，双端队列并不包含在 ``<queue>`` 库里，而是包含在单独的 ``<deque>`` 库里。

单调队列，顾名思义，就是队列内部保持单增或是单减的队列。

至于在无序序列加入队列的时候，如何保持队列的单调，其实也没有那么玄乎。假设当前队列内部是单调的，如果队尾元素与待加入的元素不满足当前单调关系，换言之，待加入的元素加入过后会破坏队列的单调性，那么就弹出队尾，直到队尾元素与待加入的元素相对顺序在单调队列中合法为止。

此时聪明的你脑袋上又冒出了大大的问号，怎么能将队列里的元素直接扔掉不要呢？稍安勿躁，请看实际问题。

这是著名的「滑动窗口」问题，一句话题意，给定数列 $x_1,x_2,x_3,...,x_n$ 和一个数 $k$，对于所有 $i\in[1,n-k+1]$，求 $\max/\min_{j\in[i,i+k-1]}\{a_j\}$。

朴素做法是对于每个 $i$，都用 $O(k)$ 的时间求出答案，总的时间复杂度是 $O(nk)$。

可以用单调队列，窗口移动的过程中从队头剔除不在求值集合中的数，又从队尾加入新数。而在队列中如果有 $i<j$ 且 $a_i<a_i$，也就说明数 $a_i$ 比数 $a_j$ 更早退出队列，那么在数 $a_j$ 退出队列之前，数 $a_i$ 都不再可能成为最大值，果断舍弃。

因此，我们的单调队列中如果 $i<j$ 那么就有 $a_i>a_j$，于是保留下来的就只有当前较大的数或者是未来有可能成为较大数的数。

需要提到的是，这只是单调队列的应用，并非单调队列优化 DP~~（这不显然吗）~~。

可以发现，当自变量的取值范围单调变化时，如果要求函数值的最值，那么就可以引入单调队列。

## T 股票交易

题目来源：SCOI 2010
评测链接：<https://www.luogu.com.cn/problem/P2569>

$\text{lxhgww}$ 预测到了未来 $T$ 天内某只股票的走势，第 $i$ 天的股票买入价为每股 $AP_i$，第 $i$ 天的股票卖出价为每股 $BP_i$（数据保证对于每个 $i$，都有 $AP_i \geq BP_i$），但是每天不能无限制地交易，于是股票交易所规定第 $i$ 天的一次买入至多只能购买 $AS_i$ 股，一次卖出至多只能卖出 $BS_i$ 股。

另外，股票交易所还制定了两个规定。

  1. 在两次交易（某一天的买入或者卖出均算是一次交易）之间，至少要间隔 $W$ 天，也就是说如果在第 $i$ 天发生了交易，那么从第 $i+1$ 天到第 $i+W$ 天，均不能发生交易。
  2. 在任何时间，一个人的手里的股票数不能超过 $\mathit{MaxP}$。

在第 $1$ 天之前，$\text{lxhgww}$ 手里有一大笔钱（可以认为钱的数目无限），但是没有任何股票，当然，$T$ 天以后，$\text{lxhgww}$ 想要赚到最多的钱。

请编程求出最多可能赚到的钱。

$0\leq W<T\leq 2000,1\leq\mathit{MaxP}\leq2000,1\leq BP_i\leq AP_i\leq 1000,1\leq AS_i,BS_i\leq\mathit{MaxP}$

<br>

~~显而易见，显而易见，~~用 $f_{i,j}$ 表示第 $i$ 天过后，$\text{lxhgww}$ 手里有 $j$ 张股票，此时他赚到钱的最大值。

那么就有

$$
f_{i,j}=\\max
\\begin{cases}
  f_{i-1,j} \\\\
  \\max_{k\\in[j-AS_i,j)}\\{f_{i-W-1,k}-AP_i\\times(j-k)\\} \\\\
  \\max_{k\\in(j,j+BS_i]}\\{f_{i-W-1,k}+BP_i\\times(k-j)\\}
\\end{cases}
$$

注：状态转移方程只考虑了最重要的情况。

时间复杂度为 $O(T\times \mathit{MaxP}^2)$。~~显而易见，显而易见，~~会超时。

以第二行的状态转移方程为例，我们来研究如何优化。

将该等式恒等变形。

$$
\\begin{align}f_{i,j} & = \\max_{k\\in[j-AS_i,j)}\\{f_{i-W-1,k}-AP_i\\times(j-k)\\}\\\\
& = \\max\\{f_{i-W-1,k}-AP_i\\times j+AP_i\\times k\\}\\\\
& = -AP_i\\times j+\\max\\{f_{i-W-1,k}+AP_i\\times k\\}\\end{align}
$$

状态转移方程中有三个变量 $i,j,k$，我们将与 $k$ 无关的项移到 $\max\{\}$ 外面去，然后发现 $\max\{\}$ 里剩下的项均与 $j$ 无关。

那么在外层循环的 $i$ 确定过后，随着 $j$ 的单调变化，$k$ 的取值范围 $[j-AS_i,j)$ 也随之单调变化。

这是否就与滑动窗口异曲同工了呢？于是我们引入单调队列对状态转移进行优化。

单调队列在只能在单一变量 $j$ 变化的情况下起作用，因此要求 $i$ 确定这一前提。在 $i$ 可以视为常量的前提下，随着 $j$ 的变化，我们从队头中剔除 $k<j-AS_i$ 的元素，然后从队尾剔除不满足单调性的元素，接着加入新的 $f_{i-W-1,k}+AP_i\times k$。每次访问队头，得出最大值，即可。

同样的，我们来分析，设 $g(x)=f_{i-W-1,x}+AP_i\times x$，那么当 $x_1<x_2$ 时，$x_1$ 会比 $x_2$ 更早从队头剔除，也就是接下来直到 $x_1$ 被剔除之前，$x_2$ 都会一直存在。而如若又满足 $g(x_1)<g(x_2)$，那么 $x_1$ 就不再可能成为最大值，因此理应被删除。

相比 $x_2$ 这种函数值更优存活时间又更长的元素，$x_1$ 的存在便显得无足轻重。

同理，第三行的状态转移方程也可以这样处理。

需要注意的是，由于单调队列的应用是在 $i$ 确定的前提下进行的，因此对于 $i$ 每一次变化，都需要将单调队列清空。

以下使用 STL 库的 ``deque`` 容器实现单调队列。

<details class="note">
  <summary>参考代码</summary>

```cpp
#include <iostream>
#include <cstdio>
#include <utility>
#include <deque>

using namespace std;

int T, MaxP, W, e;
int AP[2005], BP[2005], AS[2005], BS[2005];
int f[2005][2005];

deque<pair<int, int> > dq1, dq2;    // dq1处理第二行的状态转移方程，dq2处理第三行的状态转移方程

int main()
{
    scanf("%d%d%d", &T, &MaxP, &W);
    for (int i = 1; i <= T; ++i) scanf("%d%d%d%d", &AP[i], &BP[i], &AS[i], &BS[i]);
    
    for (int j = 1; j <= MaxP; ++j) f[0][j] = -0x3f3f3f3f;    // 由于初始为 0 且不会有股票，因此 f[0][i] 对于任何 i != 0 都是非法的
    for (int i = 1; i <= T; ++i)
    {
        while (!dq1.empty()) dq1.pop_back();    // 清空
        while (!dq2.empty()) dq2.pop_back();    // 队列
        for (int j = 0; j <= MaxP; ++j)
        {
            f[i][j] = f[i - 1][j];    // 第一行的情况
            if (j <= AS[i]) f[i][j] = max(f[i][j], - j * AP[i]);    // 当前这是第一次购买股票
            if (i >= W + 2)    // 此时才能不是第一次购买股票
            {
                /*** 处理dq1 ***/
                while (!dq1.empty() && dq1.front().first < j - AS[i]) dq1.pop_front();
                if (j - 1 >= 0)
                {
                    e = f[i - W - 1][j - 1] + (j - 1) * AP[i];
                    while (!dq1.empty() && dq1.back().second <= e) dq1.pop_back();
                    dq1.push_back(make_pair(j - 1, e));
                }

                /*** 处理dq2 ***/
                if (j == 0)
                {
                    for (int k = j + 1; k < j + BS[i] && k <= MaxP; ++k)
                    {
                        e = f[i - W - 1][k] + k * BP[i];
                        while (!dq2.empty() && dq2.back().second <= e) dq2.pop_back();
                        dq2.push_back(make_pair(k, e));
                    }
                }
                while (!dq2.empty() && dq2.front().first < j + 1) dq2.pop_front();
                if (j + BS[i] <= MaxP)
                {
                    e = f[i - W - 1][j + BS[i]] + (j + BS[i]) * BP[i];
                    while (!dq2.empty() && dq2.back().second <= e) dq2.pop_back();
                    dq2.push_back(make_pair(j + BS[i], e));
                }
            
                /*** 得出结果 ***/
                if (!dq1.empty()) f[i][j] = max(f[i][j], dq1.front().second - j * AP[i]);
                if (!dq2.empty()) f[i][j] = max(f[i][j], dq2.front().second - j * BP[i]);
            }
        }
    }
    
    printf("%d", f[T][0]);
    
    return 0;
}
```

</details>

因为对于每个 $k$，在单调队列中至多入队出队一次，因此单调队列的入队出队操作均摊时间复杂度是 $O(1)$ 的。总的时间复杂度降到了 $O(T\times \mathit{MaxP})$，降低了一维 $\mathit{MaxP}$。

这里应该就能够理解单调队列这种满足特殊性质的数据结构通过取舍对动态规划的转移产生的优化效果。~~（请给上面的句子划分节奏）~~

## T Watching Fireworks is Fun

题目来源： Codeforces 372C
评测链接：<https://codeforces.com/problemset/problem/372/C>

街上有 $n$ 个位置，编号从 $1$ 到 $n$，相邻两个位置的距离为 $1$ 个单位距离。

现在将要在特定时间 $t_i$ 特定位置 $a_i$ 放 $m$ 个烟花，注意可能同时放 $2$ 个烟花。如果放烟花的时候你在位置 $x$，那么你将获得 $b_i-|a_i-x|$ 的快乐值，注意快乐值可能为负数。

你一开始可以在任何位置，接下来每个单位时间内可以移动 $d$ 个单位距离。

你需要编程计算出最大可能获得的快乐值，如果你要在 C++ 中输出 64 位整型，请不要使用 ``%lld``，请使用 ``cin``,``cout`` 流或者 ``%I64d`` 格式符。

<br>

首先可以写出以下朴素 DP 代码。

<details class="note" open>
  <summary>参考代码</summary>

```cpp
for (int i = 1; i <= m; ++i)
{
    for (int j = 1; j <= n; ++j)
    {
        f[i][j] = 0xc000000000000000;
        int _l = max(1, j - d * (t[i] - t[i - 1])), _r = min(n, j + d * (t[i] - t[i - 1]));
        for (int k = _l; k <= _r; ++k)
        {
            f[i][j] = max(f[i][j], f[i - 1][k] + b[i] - abs(a[i] - j));
        }
    }
}
```

</details>

仔细检查状态转移方程，按照上面的方法，将与 $k$ 无关的提到 $\max{}$外面去。

$$
\\begin{align}  f_{i,j} &= \\max_{k\\in[j-d(t_i-t_{i-1}),j+d(t_i-t_{i-1})]}\\{f_{i-1,k}+b_i-|a_i-j|\\}\\\\
&= -|a_i-j|+\\max\\{f_{i-1,k}+b_i\\}\\end{align}
$$

好巧不巧，$\max\{\}$ 里留下的与 $k$ 有关的项全部与 $j$ 无关，而根据上面的经验我们知道 $i$ 又可以看作常量，因此请出我们今天的主角——单调队列。

$k$ 的取值范围 $[j-d(t_i-t_{i-1}),j+d(t_i-t_{i-1})]$ 单调变化，依然可以在外层循环 $i$ 确定的条件下使用单调队列优化。

以下给出手写双端队列的代码。

<details class="note">
  <summary>参考代码</summary>

```cpp
#include <iostream>
#include <cstdio>
#include <cmath>

using namespace std;

int n, m, d;
int a[305], b[305], t[305];
long long f[2][150005];

namespace Deque
{
    int q[150005], f = 1, r = 0;
    void push(int x) { q[++r] = x; }
    void pop_front() { ++f; }
    void pop_back() { --r; }
    int front() { return q[f]; }
    int back() { return q[r]; }
    bool empty() { return f > r; }
    void clear() { f = 1; r = 0; }
}

int main()
{
    scanf("%d%d%d", &n, &m, &d);
    for (int i = 1; i <= m; ++i) scanf("%d%d%d", &a[i], &b[i], &t[i]);

    for (int i = 1; i <= m; ++i)
    {
        Deque::clear();
        int step = min((long long)(d) * (t[i] - t[i - 1]), (long long)(n));
        for (int j = 1; j <= step; ++j)
        {
            while (!Deque::empty() && f[(i & 1) ^ 1][Deque::back()] <= f[(i & 1) ^ 1][j]) Deque::pop_back();
            Deque::push(j);
        }
        for (int j = 1; j <= n; ++j)
        {
            while (!Deque::empty() && Deque::front() < j - step) Deque::pop_front();
            if (j + step <= n)
            {
                while (!Deque::empty() && f[(i & 1) ^ 1][Deque::back()] <= f[(i & 1) ^ 1][j + step]) Deque::pop_back();
                Deque::push(j + step);
            }
            f[i & 1][j] = f[(i & 1) ^ 1][Deque::front()] + b[i] - abs(a[i] - j);
        }
    }

    long long Ans = 0xc000000000000000;
    for (int i = 1; i <= n; ++i) Ans = max(Ans, f[m & 1][i]);
    printf("%I64d\n", Ans);

    return 0;
}
```

</details>

## 单调队列优化多重背包

回顾一下多重背包问题，有 $N$ 种物品和一个容量是 $V$ 的背包。第 $i$ 种物品最多有 $s_i$ 件，每件体积是 $v_i$ ，价值是 $w_i$ 。求解将哪些物品装入背包，可使物品体积总和不超过背包容量，且价值总和最大。

观察朴素算法的状态转移模型。

$$
f_{i,j}=\\max_{k\\in[0,s_i]}\\{f_{i-1,j-k\\times v_i}+k\\times w_i\\}
$$

应用单调队列优化的前提是决策集合单调变化，每次都有有限（即不与 $n$ 同级）个数的元素入队或者出队，且每个元素仅能入队出队一次。

$f_{i,j}$ 的决策集合 $S_{i,j}$ 为 $\\{f_{i-1,j-k\times v_i}+k\times w_i\ | \ k\in[0,s_i]\\}$。

$f_{i,j-1}$ 的决策集合 $S_{i,j-1}$ 为 $\\{f_{i-1,j-1-k\times v_i}+k\times w_i\ | \ k\in[0,s_i]\\}$。

在从 $S_{i,j-1}$ 调整到 $S_{i,j}$ 的过程中，显而易见 $S_{i,j}\cap S_{i,j-1}=\varnothing$，两者全无交集，并不能快速从 $S_{i,j-1}$ 转换到 $S_{i,j}$。

但是，如果 $v_i=1$ 的话，就可以了。

究其原因，是因为当 $v_i=1$ 时，$f_{i-1,j-p\times v_i}=f_{i-1,j-1-(p-1)\times v_i}$。

观察上面的等式，我们发现 $v_i$ 无特殊要求时，依然满足 $f_{i-1,j-p\times v_i}=f_{i-1,j-v-(p-1)\times v_i}$。

也就是说 $S_{i,j}\cap S_{i,j-v_i}\neq \varnothing$。

下面这张图会直观一些。

{% asset_img knapsack.png '"" "多重背包余数分组 示意图"' %}

既然这样的话，我们虽不能快速从 $S_{i,j-1}$ 转换到 $S_{i,j}$，但是能够快速从 $S_{i,j-v_i}$ 转换到 $S_{i,j}$。那么我们就可以通过分组，在每一组内使用单调队列的优化技巧。

具体来说，将 $f_{i,j}$ 按 $j \mod v_i$ 分组，再分组进行转移。那么在外层循环 $i$ 和余数 $r$ 确定时，枚举商数 $p$，让 $j=p\times v_i+r$。

那么就有

$$
\\begin{align}f_{i,p\\times v_i+r} & = f_{i,j}\\\\
& =\\max_{k\\in[0,s_i]}\\{f_{i-1,j-k\\times v_i}+k\\times w_i\\}\\\\
& =\\max\\{f_{i-1,p\\times v_i +r-k\\times v_i}+k\\times w_i\\}\\\\
& =\\max\\{f_{i-1,(p-k)\\times v_i+r}+k\\times w_i\\}\\\\
& =\\max_{t\\in[p,p-s_i]}\\{f_{i-1,t\\times v_i+r}+(p-t)\\times w_i\\}\\\\
& =p\\times w_i+\\max_{t\\in[p,p-s_i]}\\{f_{i-1,t\\times v_i+r}-t\\times w_i\\}\\\\
\\end{align}
$$

如果令 $g_p=f_{i,p\\times v_i+r},h_p=f_{i-1,p\\times v_i+r}$（$g,h$ 与 $i,r$ 有关），那么状态转移方程可以写得美观一些。

$$
g_p=p\\times w_i+\max_{t\\in[p,p-s_i]}\\{h_t-t\\times w_i\\}
$$

因此，接下来的做法就是外两层循环枚举 $i,r$，在 $i,r$ 确定的前提下，随着 $p$ 的变化进行单调队列优化决策。

## 应用条件

在将某些变量看作常量的情况下，只余下 $i,j$ 两个变量，其中 $i$ 将参与表示最优子结构，而 $j$ 不会参与表示最优子结构。

假设确定了某些变量，本次最优子结构可以看作只有一个变量的 $f_i$，将要从 $g_i$ 转移过来。

如果状态转移方程可以看作 $f_i=A+\max/\min\\{B\\}$，其中，$A$ 与 $j$ 无关，$B$ 只与 $j$ 有关，那么，就可以使用单调队列优化。

## 总结

在这样的 DP 问题中，如果一个值比另一个值更优，还比另一个值存活时间更长，那么可以果断舍弃另一个值。这样，我们保证了队列的单调性，也剪掉了无意义的浪费。之所以单调，就是为了让里面的元素或者更优，或者更长寿。

我们在单调中寻寻觅觅，试图高效地找出队头那个最优的决策，也遗忘了被我们从队尾弹出的曾经队列中的一员。

这是冷漠，这是在追求效率的社会不得不做出的取舍。这是在冰冷的数字之间，对不可能的一种否决，对曾经创造过社会财富的退休老人的抛弃。

但是，你所爱的人，YOUR LOVED ONES，无论现状如何，都在守候着你，愿你平安回家。

你爱着的人，永远爱着你。

谁说时光面前，万物软弱无力？

——亲情面前，时光无能为力。
