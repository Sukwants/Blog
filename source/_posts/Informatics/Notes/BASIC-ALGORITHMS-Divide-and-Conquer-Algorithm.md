---
title: 基础算法 - 分治法
tags:
  - '[I] 基础算法'
  - '[I] 分治法'
categories:
  - Informatics
  - Notes
date: 2022-07-31 10:29:57
---


分而治之，大而化小

<!--more-->

## 介绍

分治法，Divide and Conquer Algorithm，字面意义，「分而治之」。

我们对于一个规模巨大的问题，将其切成几个子问题，对于每个子问题分别求解再合并，或者说做出判断选取其中一个子问题求解，这样将大规模的问题不断切分成小规模的问题，是分治法的核心思想。

如上，分治法的一般形式有两种：1. 分而治之，递归；2. 不断缩小问题规模直至得出答案。

## 二分法

二分法，顾名思义，每次将问题分为两个子问题，上述第一种形式的代表是二分排序、基于二分思想的线段树，第二种形式的代表是二分查找、二分求连续函数零点、二分答案。

先看一个简单的例子，这个例子经常被用来入门二分。有这样一个游戏叫做数字炸弹，一个人在一定值域内随意选定一个数，其余人在可能的答案中随意猜这个数，这个人会给出猜到的数比答案大、比答案小或正确的回复。如果有人猜中，那此人就寄了，可能会被惩罚，然后作为下一轮的裁判。

如果我们的要求是用尽可能少的次数猜中别人所想的数，那二分就派上大用。我们的想法是，对于答案的值域 $[L,R]$，我们猜的数为 $\mathit{mid}=\dfrac{L+R}{2}$，待对方回答，如果答案大了，缩减区间为 $[L,\mathit{mid}-1]$，如果答案小了，缩减区间为 $[\mathit{mid}+1,R]$，直到猜中为止。这个方法每次将答案区间缩减一半，虽然可能比某些运气爆棚的方法慢，但一般情况下就是最快的，对于区间大小为 $N$，我们最多只需要 $\lceil\log_2N\rceil$ 次即可猜中。

### 二分查找

在有序数列 $x_1,x_2,...x_n$ 中查找一个数 $x$ 的位置。假设我们此时处理的是单增的序列。

一开始查找区间为 $[1,n]$，我们每次对于查找区间 $[l,r]$，令 $\mathit{mid}=\dfrac{l+r}{2}$，访问 $x_\mathit{mid}$，如果 $x_\mathit{mid}>x$，则查找区间 $[l,\mathit{mid}-1]$，如果 $x_\mathit{mid}<x$，则查找区间 $[\mathit{mid}+1,r]$，如果 $x_\mathit{mid}=x$，则得到答案，终止算法。

$$
\\begin{align}
  & \\text{BINARY-SEARCH}(l,r,x)\\\\
  & \\begin{array}{rl}
      1 &  \\mathit{mid}=\\left\\lfloor\\frac{l+r}{2}\\right\\rfloor \\\\
      2 &  \\textbf{if } A[\\mathit{mid}\\,]==x \\\\
      3 &  \\qquad \\textbf{return } mid \\\\
      4 &  \\textbf{else if } A[\\mathit{mid}\\,]>x \\\\
      5 &  \\qquad \\textbf{return } \\text{BINARY-SEARCH}(l,\\mathit{mid}-1,x) \\\\
      6 &  \\textbf{else} \\\\
      7 &  \\qquad \\textbf{return } \\text{BINARY-SEARCH}(\\mathit{mid}+1,r,x) \\\\
    \\end{array}
\\end{align}
$$

二分查找的时间复杂度是 $\mathrm{O}(\log n)$。

在 C++ 的 ``<algorithm>`` 库中，提供了两个二分查找的函数，使用条件都是在非严格单增的序列上。

``lower_bound(type *start, type *end, type x)``，在地址从 ``start`` 到 ``end`` 的左闭右开区间中查找数 ``x``，返回所有 ``x`` 组成的区间的开头地址。也描述成返回第一个大于等于 ``x`` 的元素的地址。

``upper_bound(type *start, type *end, type x)``，在地址从 ``start`` 到 ``end`` 的左闭右开区间中查找数 ``x``，返回所有 ``x`` 组成的区间的结尾地址的后一个。也描述成返回第一个大于 ``x`` 的元素的地址。

比如说，我要在数组 ``a[1...n]`` 中查找第一个 ``x`` 的下标，那就用 ``lower_bound(a + 1, a + n + 1, x) - a``。

### 二分排序

基于二分思想的排序方法常用的有两种，快速排序和归并排序。以下假设我们要将数组升序排序。

#### 快速排序

对于一个待排序区间，我们随机抓取区间中的一个元素 $x$，将所有小于等于 $x$ 的数移到整个区间的左半部分，将所有大于 $x$ 的数移到整个区间的右半部分，然后分别对左半部分和右半部分排序。

将元素分为两半部分的操作我们是这样实现的。用一个指针 $i$ 从区间左端点开始向右扫描，扫描到第一个大于 $x$ 的数为止；用一个指针 $j$ 从区间右端点开始向左扫描，扫描到第一个小于等于 $x$ 的数为止。将位于 $i$、$j$ 的数交换，接着继续 $i$ 向右、$j$ 向左扫描，直到 $i>j$ 为止。

$$
\\begin{align}
  & \\text{QUICK-SORT}(l,r)\\\\
  & \\begin{array}{rl}
      1  &  \\textbf{if } l \\geq r\\\\
      2  &  \\qquad \\textbf{return void}()\\\\
      3  &  \\mathit{mid}=A[\\text{RANDOM}(l,r)]\\\\
      4  &  i=l\\\\
      5  &  j=r\\\\
      6  &  \\textbf{while } i<j\\\\
      7  &  \\qquad \\textbf{while } A[i] \\leq \\mathit{mid} \\textbf{ and } i \\leq r\\\\
      8  &  \\qquad \\qquad i=i+1\\\\
      9  &  \\qquad \\textbf{while } A[j] > \\mathit{mid} \\textbf{ and } j \\geq l\\\\
      10 &  \\qquad \\qquad j=j-1\\\\
      11 &  \\qquad \\textbf{if } i<j\\\\
      12 &  \\qquad \\qquad \\text{SWAP(A[i],A[j])}\\\\
      13 &  \\text{QUICK-SORT}(l,j)\\\\
      14 &  \\text{QUICK-SORT}(i,r)
    \\end{array}
\\end{align}
$$

快速排序的平均时间复杂度为 $\mathrm{O}(n\log n)$，最坏时间复杂度为 $\mathrm{O}(n^2)$。就随机情况而言，它被认为是时间复杂度最优秀的基于定义域的排序算法。快速排序是不稳定的排序。

C++ 的 ``<algorithm>`` 库中包含实现了快速排序的函数 ``sort(type *start,type *end)``，对地址从 ``start`` 到 ``end`` 的左闭右开区间升序排序，对于未实现 ``<`` 的类型，可以自写比较函数并赋为第三个参数。也可以用 ``<functional>`` 库中的 ``greater<type>()``，这将会让数组降序排序。

#### 归并排序

我们将待排序区间等分成左右两个区间，对左右区间分别归并排序，然后合并左右区间。

合并的方法是，另开一个数组，将左右两个有序区间的开头元素作比较，取出更小的一个放入新的数组，然后将这一个从属的区间的开头标记往后移一位，继续比较，直到其中一个区间无剩余为止，剩下的数依次加入新的数组。

$$
\\begin{align}
  & \\text{MERGE}(l,\\mathit{mid},r)\\\\
  & \\begin{array}{rl}
      1  &  i=l \\\\
      2  &  j=\\mathit{mid}+1 \\\\
      3  &  \\textbf{while } i \\leq mid \\textbf{ and } j \\leq r \\\\
      4  &  \\qquad \\textbf{if } A[i]\\leq A[j] \\\\
      5  &  \\qquad \\qquad B[i+j-\\mathit{mid}-1]=A[i] \\\\
      6  &  \\qquad \\qquad i=i+1 \\\\
      7  &  \\qquad \\textbf{else} \\\\
      8  &  \\qquad \\qquad B[i+j-\\mathit{mid}-1]=A[j] \\\\
      9  &  \\qquad \\qquad j=j+1 \\\\
      10 &  \\textbf{if } i \\leq \\mathit{mid} \\\\
      11 &  \\qquad B[i+j-\\mathit{mid}-1...r]=A[i...\\mathit{mid}] \\\\
      12 &  \\textbf{else} \\\\
      13 &  \\qquad B[i+j-\\mathit{mid}-1...r]=A[j...r] \\\\
      14 &  A[l...r]=B[l...r]
     \\end{array}\\\\\\\\
  & \\text{MERGE-SORT}(l,r)\\\\
  & \\begin{array}{rl}
      1 &  \\textbf{if } l==r \\\\
      2 &  \\qquad \\textbf{return void}() \\\\
      3 &  \\mathit{mid}=\\left\\lfloor\\frac{l+r}{2}\\right\\rfloor \\\\
      4 &  \\text{MERGE-SORT}(l,\\mathit{mid}\\,) \\\\
      5 &  \\text{MERGE-SORT}(\\mathit{mid}+1,r) \\\\
      6 &  \\text{MERGE}(l,\\mathit{mid},r)
    \\end{array}
\\end{align}
$$

归并排序的时间复杂度稳定为 $\mathrm{O}(n\log n)$，此外，归并排序是稳定的排序。

### 二分法求连续函数零点

#### 零点存在定理

对于连续函数 $f(x)$，如果对于 $x_1<x_2$，有 $f(x_1)\cdot f(x_2)\leq 0$，那么区间 $[x_1,x_2]$ 上一定存在至少一个零点。

#### 二分法求连续函数零点

根据零点存在定理，首先我们要找到一个区间 $[L,R]$，使得 $f(L)\cdot f(R)\leq 0$，然后令 $\mathit{mid}=\frac{1}{2}(L+R)$，如果 $|f(\mathit{mid})|\leq\mathit{eps}$，那么 $\mathit{mid}$ 为误差允许范围内的函数零点；否则如果 $f(L)\cdot f(\mathit{mid})\leq 0$，在区间 $[L,\mathit{mid}]$ 继续寻找零点；否则在区间 $[\mathit{mid},R]$ 继续寻找零点。

一般来说，我们讨论的对象是整数域上的单调函数，并且在一定的区间范围内寻找零点。

### 二分答案

二分答案是这样一种方法，已知一个答案区间，表示答案可能的范围，每次通过假设答案为 $\mathit{mid}$，判断是否可行。这样，我们利用 $\mathrm{O}(\log(\mathit{AnsR}-\mathit{AnsL}))$ 的时间将问题转化成了判定可行性的问题，难度降低了不少，可以用贪心法或者 DFS 之类的算法解决。

类似最大化最小值、最小化最大值的题目，一般就是二分答案的题目。

#### T1 愤怒的牛

评测链接：<https://loj.ac/p/10011>

农夫约翰建造了一座有 $n$ 间牛舍的小屋，牛舍排在一条直线上，第 $i$ 间牛舍在 $x_i$ 的位置，但是约翰的 $m$ 头牛对小屋很不满意，因此经常互相攻击。约翰为了防止牛之间互相伤害，因此决定把每头牛都放在离其它牛尽可能远的牛舍。也就是要最大化最近的两头牛之间的距离。那么，这个最大的最小距离是多少呢？

<br>

整数域上的二分答案，二分答案这个最小距离，然后用贪心的思路依次给每头牛安排牛舍，保证距离不小于最小距离。如果能安排完，那么答案比二分出的答案小，否则比二分出的答案大。

这里我们额外注意一下，为了避免 $l+1=r$ 时 $\mathit{mid}=l$ 又要将 $l$ 赋为 $\mathit{mid}$ 的情况出现，我们在定义 $\mathit{mid}$ 的时候用的是 $\left\lceil\frac{l+r}{2}\right\rceil$。

```cpp
#include <cstdio>
#include <algorithm>

int n, c, x[100005];

int main()
{
    scanf("%d%d", &n, &c);
    for (int i = 1; i <= n; ++i) scanf("%d", x + i);
    std::sort(x + 1, x + n + 1);
    x[0] = -0x3f3f3f3f;

    int l = 1, r = (x[n] - x[1]) / (c - 1);
    while (l < r)
    {
        int mid = (l + r >> 1) + 1;
        int last = 0, cnt = 0;
        for (int i = 1; i <= n && cnt < c; ++i)
            if (x[i] - x[last] >= mid) ++cnt, last = i;
        if (cnt == c) l = mid;
        else r = mid - 1;
    }
    printf("%d", l);
    return 0;
}
```

#### T2 Best Cow Fences

评测链接：<https://loj.ac/p/10012>

给定一个长度为 $n$ 的非负整数序列 $A$，求一个平均数最大的，长度不小于 $L$ 的子段。

<br>

处理平均数这是一个很麻烦的问题，总和变化的时候数量随之变化，而二者又是相除的计算关系，所以**很麻烦**（致敬 袁老师）。一般的处理技巧是，如果能确定平均数是多少，那么就可以将所有数减去平均数来处理。

那么我们如果要确定平均数，要做的就是实数域上的二分答案。二分答案这个平均数，将所有数减去平均数，然后判断是否存在长度不小于 $L$ 的子段其总和大于 $0$。

判断过程，我们扫描一遍数组，存储前缀和，对于 $i\geq L$，我们找到下标在 $[0,i-L]$ 之间的最大值，也就是在 $i$ 移动过程中不断用 $[1,i-L]$ 的前缀和去更新最大值，到时候直接取出来即可。

```cpp
#include <cstdio>

template <class T>
T max(T x, T y)
{
    return x > y ? x : y;
}

template <class T>
T min(T x, T y)
{
    return x < y ? x : y;
}

int n, L, a[100005], sum, maximum;
double b[100005];
double pres[100005];

int main()
{
    scanf("%d%d", &n, &L);
    for (int i = 1; i <= n; ++i)
    {
        scanf("%d", a + i);
        sum += a[i];
        maximum = max(maximum, a[i]);
    }

    double l = sum * 1.0 / n, r = maximum + 1, esp = 0.0001;
    while (r - l > esp)
    {
        double mid = (l + r) / 2;
        for (int i = 1; i <= n; ++i) b[i] = a[i] - mid;

        bool flag = false;
        double minipres = 0;
        for (int i = 1; i <= L; ++i) pres[i] = pres[i - 1] + b[i];
        if (pres[L] > 0) flag = true;
        else
        {
            for (int i = L + 1; i <= n; ++i)
            {
                minipres = min(minipres, pres[i - L]);
                pres[i] = pres[i - 1] + b[i];
                if (pres[i] - minipres > 0)
                {
                    flag = true;
                    break;
                }
            }
        }

        if (flag) l = mid;
        else r = mid;
    }

    printf("%d", (int)(r * 1000));
    
    return 0;
}
```

其实，$\mathit{eps}$ 还是要开小一点比较保险。

另外，请思考，最后为什么要输出右端点 $r$ 而不是左端点 $l$？因为我们所计算的平均数，小数部分是 $0.000000000$ 的情况显然很常见，而小数部分是 $0.999999999$ 的情况几乎不可见。当小数部分是 $0.000000000$ 的时候，由于数据类型的误差或者算法的误差，很有可能 $l$ 的整数部分就与答案的整数部分差 $1$，而因为 $0.999999999$ 的情况几乎没有，所以 $r$ 是几乎没有可能进位的。

## 三分法

### 三分法求单峰函数最值

单峰函数，顾名思义，只有一个最值，最值其左、其右均单调。众所周知，最常见的单峰函数是二次函数，虽然你知道最值等于 $\frac{4ac-b^2}{4a}$，但是我们还是借二次函数来探讨三分法。

<div style="width:75%;margin:auto">
  {% asset_img quadraticfunction.png '"" "三分法求单峰函数最值"' %}
</div>

假设我们要在区间 $[l,r]$ 上求最值，令 $L(l,f(l)),R(r,f(r)),P\left(\frac{2l+r}{3},f\left(\frac{2l+r}{3}\right)\right),Q\left(\frac{l+2r}{3},f\left(\frac{l+2r}{3}\right)\right)$，也就是取区间左右端点 $L,R$ 的三等分点 $P,Q$。这里我们称 $P,Q$ 中函数值更优的点为优点，另外一个称为劣点，图示优点为 $Q$，劣点为 $P$。我们找到优点 $Q$ 关于抛物线对称轴的对称点 $Q'$，称 $Q,Q'$ 中更靠近 $P$ 的点为 $Q_0$，那么 $[P,Q_0]$ 是一段单调区间，且单调方向与 $[L,P]$ 相同，图示为单增区间。于是，可以肯定，最值存在于 $P$ 以右。由于我们并不能找出 $Q_0$ 的坐标，也不能确定最值存在于 $Q$ 左还是 $Q$ 右，因此我们只能将最值限定在 $[P,R]$ 内。$P,Q$ 的优劣点地位交换同理。

我们可以概括为，最值存在于从劣点到距离劣点更远的端点的这一段区间上。

当然，没人拦着你用 $\frac{4ac-b^2}{4a}$。

#### T3 曲线

评测链接：<https://loj.ac/problem/10013>

明明做作业的时候遇到了 $n$ 个二次函数 $S_i(x)=ax^2+bx+c$，他突发奇想设计了一个新的函数 $F(x)=\max\\{S_i(x)\\},i=1...n$。$0\leq a\leq 100,0\leq b\leq 5000,0\leq|c|\leq 5000$。

明明现在想求这个函数在 $[1,1000]$ 的最小值，要求精确到小数点后四位，四舍五入。

<br>

明明设计的函数 $F(x)$ 等价于 $n$ 个二次函数 $S_i(x)$ 的最大值，反映在平面直角坐标系上，表示为最高的图象。

观察数据特点，$a\geq 0$ 保证了这些二次函数均为开口向上的二次函数，或者是一次函数，即这些函数在各个点上的切线斜率是非严格单调递增的。这些函数取最大值，在交点位置，交点之前的部分较高的一段所属的二次函数相对另一段向下走，说明这一段的切线斜率小于另一段。而又由于各函数的切线斜率非严格单增，于是交点前后较高的两端组成的新图象的切线斜率依旧是非严格单增的。这样，整个函数 $F(x)$ 图象的切线斜率均为非严格单增的。

于是就是一个单峰函数。

```cpp
#include <cstdio>

template <class T>
T abs(T x)
{
    if (x < 0) return -x;
    return x;
}
template <class T>
T max(T x, T y)
{
    return x > y ? x : y;
}

int n, a[10005], b[10005], c[10005];

double s(int i, double x)
{
    return a[i] * x * x + b[i] * x + c[i];
}
double f(double x)
{
    double ans = -0x7fffffff;
    for (int i = 1; i <= n; ++i) ans = max(ans, s(i, x));
    return ans;
}

int main()
{
    int T;
    scanf("%d", &T);
    for (int test = 1; test <= T; ++test)
    {
        scanf("%d", &n);
        for (int i = 1; i <= n; ++i) scanf("%d%d%d", &a[i], &b[i], &c[i]);
        double l = 0, r = 1000, esp = 0.0000000001, fl = f(l), fr = f(r);
        while (abs(fr - fl) > esp)
        {
            double x1 = (l + l + r) / 3;
            double x2 = (l + r + r) / 3;
            double fx1 = f(x1), fx2 = f(x2);

            if (fl > fr)
            {
                if (fx1 < fx2)
                {
                    r = x2;
                    fr = fx2;
                }
                else
                {
                    l = x1;
                    fl = fx1;
                }
            }
            else
            {
                if (fx2 < fx1)
                {
                    l = x1;
                    fl = fx1;
                }
                else
                {
                    r = x2;
                    fr = fx2;
                }
            }
        }
        printf("%.4lf\n", fr);
    }
    return 0;
}
```

## 废题

有些时候，一些适用分治法的题目数学特性太强，导致可以直接推出函数表达式，进而通过数学知识求得零点或者最值。比如你可以用 $\frac{4ac-b^2}{4a}$。

### T4 灯泡

评测链接：<https://loj.ac/p/10016>

相比 wildleopard 的家，他的弟弟 mildleopard 比较穷。他的房子是狭窄的而且在他的房间里面仅有一个灯泡。每天晚上，他徘徊在自己狭小的房子里，思考如何赚更多的钱。有一天，他发现他的影子的长度随着他在灯泡和墙壁之间走到时发生着变化。一个突然的想法出现在脑海里，他想知道他的影子的最大长度。

{% asset_img light.webp '"" "灯泡 题图"' %}

输入三个实数 $H,h,D$，输出 $L$。题目有多组测试数据。

<br>

典型废题，均值不等式，或者说双勾函数。

设人到灯的水平距离为 $x$，可以推出 $L=H+D-(\frac{D(H-h)}{x}+x)$。

令 $A=\frac{D(H-h)}{x}+x$，这是典型的双勾函数，但别着急乐呵。

~~我绝对不会告诉你要注意定义域。~~

  1. 人不可能穿到墙壁右边去，因此 $x\leqslant D$。
  2. 墙上的影子不可能为负数，即 $H-\frac{D(H-h)}{x}\geqslant 0$，因此 $x\geqslant\frac{D(H-h)}{H}$。

在考虑了 $x\in[\frac{D(H-h)}{H},D]$ 之后，再考察双勾函数的单调性解题。

```cpp
#include <iostream>
#include <cstdio>
#include <cmath>

using namespace std;

int main()
{
	int T;
	scanf("%d", &T);
	for (int i = 1; i <= T; ++i)
	{
		double H, h, D;
		scanf("%lf%lf%lf", &H, &h, &D);
		double l = (H - h) / H * D;
		double r = D;
		double x = sqrt(D * (H - h));
		fprintf(stderr, "%.3lf %.3lf %.3lf ", l, x, r);
		double x_true;
		if (x < l) x_true = l;
		else if (x > r) x_true = r;
		else x_true = x;
		fprintf(stderr, "%.3lf\n", x_true);
		printf("%.3lf\n", D + H - D * (H - h) / x_true - x_true);
	}
	return 0;
}
```

## 结语

连续函数，零点存在，碰撞出一正一负。

单峰函数，最值唯一，分割出一优一劣。

抬头，是二分答案，俯首，是双勾函数，转身，是将军饮马，驻足，只是你，只是我。
