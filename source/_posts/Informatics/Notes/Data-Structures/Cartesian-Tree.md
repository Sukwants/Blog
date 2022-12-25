---
title: 笛卡尔树
tags:
  - '二叉查找树 / 平衡树'
  - '堆'
categories:
  - Informatics
  - Notes
date: 2022-11-14 23:58:28
---


跨越山河万里的相恋，在山花烂漫的顶峰遇见

<!--more-->

## 二叉查找树与堆的故事

二叉查找树：我限定了左子树和右子树的关系。

堆：我限定了父结点和子结点的关系。

~~笛卡尔~~：你们可以一起愉快地玩耍。

（事实上，笛卡尔树是 Vuillmin 提出的。）

## 笛卡尔树

笛卡尔树的结点包含两个关键字 $(k,w)$，其中 $k$ 满足二叉查找树的性质，$w$ 满足堆的性质。显而易见，对于任意生成的若干二元组 $(k,w)$，这样的树一定存在。

没错，平衡树 Treap 就是一种特殊的笛卡尔树，它的第二关键字 $w$ 是随机生成的。

一棵笛卡尔树可以这样构造。

首先将所有元素按照第一关键字 $k$ 排序。

依次扫描，因为已经按照 $k$ 排序，所以当前新加入的结点一定在树的最右链上，我们把这条最右链存在栈里。那么，我们要插入一个 $k$ 更大的结点，通过观察 $w$ 确定它应该成为栈里哪个结点的儿子，哪个结点的父亲。将将成为其儿子的结点设为其左儿子，并将这个儿子所带的一条链弹出栈，因为接下来不可能在这条链上加结点。

没错，就是很像虚树的构造方式，当前栈里的元素一定具有祖先和后代的关系，但是并不能确定是否是直接的父子关系，那么我们就在弹栈时确定了父子关系后再建边。

这是一个单调栈，因此建树是 $O(n)$ 的，而排序一般是 $O(n\log n)$ 的。

## T Largest Rectangle in a Histogram

题目来源：HDU 1506
评测链接：<https://vjudge.net/problem/HDU-1506>

给定若干宽为 $1$ 的依次有序紧密排列的矩形，在这些矩形组成的图形中找出一个最大的矩形。

我们以下标为第一关键字、高度为第二关键字建立一棵笛卡尔树，堆是一个小根堆。枚举选择区间的矩形高度的最小值，那么以这个最小值为高度的矩形即为左端点在该结点左子树内、右端点在该结点右子树内的所有情况，最大面积即为该矩形的高度乘上子树大小。

枚举所有结点，可以 $O(n)$ 得出结果。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>

template <class T> inline T max(T x, T y) { return x > y ? x : y; }

const int MAXN = 1e5;

int n, h[MAXN + 5];

int stk[MAXN + 5], top = 0;

int fa[MAXN + 5], ch[MAXN + 5][2];

long long Ans = 0;

int dfs(int x)
{
    if (!x) return 0;
    int res = dfs(ch[x][0]) + dfs(ch[x][1]) + 1;
    Ans = max(Ans, 1ll * res * h[x]);
    return res;
}

int main()
{
    scanf("%d", &n);
    while (n)
    {
        for (int i = 1; i <= n; ++i) scanf("%d", h + i);

        for (int i = 1; i <= n; ++i) fa[i] = 0, ch[i][0] = ch[i][1] = 0;
        for (int i = 1; i <= n; ++i)
        {
            if (h[stk[top]] <= h[i]) stk[++top] = i;
            else
            {
                while (h[stk[top - 1]] > h[i])
                {
                    fa[stk[top]] = stk[top - 1];
                    ch[stk[top - 1]][1] = stk[top];
                    --top;
                }
                fa[stk[top]] = i;
                ch[i][0] = stk[top];
                stk[top] = i;
            }
        }
        while (top)
        {
            fa[stk[top]] = stk[top - 1];
            ch[stk[top - 1]][1] = stk[top];
            --top;
        }

        Ans = 0;
        dfs(stk[1]);

        printf("%lld\n", Ans);

        scanf("%d", &n);
    }

    return 0;
}
```
{% endcontentbox %}

我们经常使用笛卡尔树时将下标作为第一关键字，那么此时的笛卡尔树就满足一个特殊性质：一段区间的最值是左端点结点与右端点结点的 LCA；或者说，一个元素是以其结点为根的子树内的最值；或者说，以该元素为最值的连续区间跨越其左右子树。

此时我们经常用笛卡尔树来解决与连续区间和最值有关的问题。

## T Yet Another Array Counting Problem

题目来源：Codeforces 1748E
评测链接：<https://codeforces.com/problemset/problem/1748/E>

给出长度为 $n$ 的数列 $a$，构造数列 $b$，使得 $b$ 中元素均在 $[1,m]$ 之间，且对于任意区间 $[l,r]$，有 $a$ 在此段区间内的最左的最大值与 $b$ 在此段区间内的最左的最大值相等。求方案数对 $10^9+7$ 的结果。

我们考虑以数列值、数列值相同时以坐标为第二关键字建立一棵笛卡尔树，题目转化按笛卡尔树的形态构造数列。

做一个树形 DP 完事。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstring>
 
const int MAXS = 1e6, MAXN = 2e5;
const int MOD = 1e9 + 7;
 
int T, n, m;
 
int a[MAXN + 5] = {0x7fffffff};
int lc[MAXN + 5], rc[MAXN + 5];
 
int stk[MAXN + 5], top = 0;
 
struct arr
{
    int d[MAXS + MAXN * 10 + 5], width;
    void setw(int w) { width = w; }
    void reset(int n) { memset(d, 0, sizeof(int) * n); }
    int *operator[](int x) { return d + x * width; }
} f;
 
void Dfs(int x)
{
    if (!x) return;
    Dfs(lc[x]);
    Dfs(rc[x]);
    int cnt1 = 0, cnt2 = f[rc[x]][0];
    for (int i = 1; i <= m; ++i)
    {
        cnt1 = (cnt1 + f[lc[x]][i - 1]) % MOD;
        cnt2 = (cnt2 + f[rc[x]][i]) % MOD;
        f[x][i] = 1ll * cnt1 * cnt2 % MOD;
    }
}
 
int main()
{
    scanf("%d", &T);
    while (T--)
    {
        scanf("%d%d", &n, &m);
        for (int i = 1; i <= n; ++i) scanf("%d", a + i);
        for (int i = 1; i <= n; ++i)
        {
            lc[i] = 0, rc[i] = 0;
            if (a[stk[top]] >= a[i]) stk[++top] = i;
            else
            {
                while (a[stk[top - 1]] < a[i])
                {
                    rc[stk[top - 1]] = stk[top];
                    --top;
                }
                lc[i] = stk[top];
                stk[top] = i;
            }
        }
        while (top)
        {
            rc[stk[top - 1]] = stk[top];
            --top;
        }
 
        f.setw(m + 5);
        f.reset((m + 5) * (n + 5));
        f[0][0] = 1;
        Dfs(stk[1]);
 
        int Ans = 0;
        for (int i = 1; i <= m; ++i) Ans = (Ans + f[stk[1]][i]) % MOD;
 
        printf("%d\n", Ans);
    }
 
    return 0;
}
```
{% endcontentbox %}

所以笛卡尔树这种东西，不能只是知道，至少得看看，不然就会像 2022-11-13 晚上的 Sukwants 一样。

## 总结

在笛卡尔树上，一段跨越子树的恋情，相遇在野花开遍的山岗。静静地站在区间的阁楼上，俯视着四面八方的线条。

曾经尝试过，就不会畏缩胆怯。找到区间里最高的那一个，再看看，左手右手。

笛卡尔的心形曲线，起笔在根左，收笔在根右，点在根上。
