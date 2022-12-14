---
title: 动态规划 - 斜率优化
tags:
  - '动态规划'
categories:
  - Informatics
  - Notes
date: 2022-07-16 19:33:25
---


<p>一个平面，两条直线，三个字母，四个象限，就是&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;一个世界</p>

<!--more-->

## 前置知识

### 解析法

解析大法好。

这里只需要用到初中的直线解析式相关的知识。

比如说，斜截式 $y=kx+b$，其中 $k$ 被称为斜率。

### 凸包

更多在[计算几何 - 凸包](//还没写呢)。

一个平面上有一些点，形象地说，打了一些钉子。

<div style="width:80%;margin:auto">
  {% asset_img convexhull1.png '"" "凸包 1"' %}
</div>

用一个周长最短的封闭几何图形将所有点包含在内，形象地说，用一根橡皮筋将所有钉子围住。

<div style="width:80%;margin:auto">
  {% asset_img convexhull2.png '"" "凸包 2"' %}
</div>

这就是凸包。显然，凸包只会外凸，而不会内凹。

我们将凸包上凸的一段称为上凸壳（下图左），下凹的一段称为下凸壳（下图右）。

<div style="width:80%;margin:auto">
  {% asset_img convexhull3.png '"" "凸包 3"' %}
</div>

可以发现，如果将凸包放入平面直角坐标系，上凸壳部分各段的斜率单调递减，下凸壳部分各段的斜率单调递增。

## 问题引入

斜率优化的问题产生在下凸壳，以下面这个放入坐标系的下凸壳为例，下凸壳上的点为 $A,B,C,D,E$。

<div style="width:60%;margin:auto">
  {% asset_img optimization1.png '"" "斜率优化 1"'%}
</div>

我们往坐标系里面再扔一条平行直线 $l:y=kx+b\ (\ k$ 为定值 $)$，与 $y$ 轴交于 $G(0,b)$。

<div style="width:60%;margin:auto">
  {% asset_img optimization2.png '"" "斜率优化 2"'%}
</div>

找一个点 $F\in\\{A,B,C,D,E\\}$，使得满足 $y_F=kx_F+b$ 的 $b$ 最小。

也就是，让直线 $l$ 经过 $A,B,C,D,E$ 中的任意一点，求这些情况中 $G$ 的最低位置，也就是直线 $l$ 最低的时候 $G$ 的纵坐标。

转换一下问题，让直线 $l$ 经过 $A,B,C,D,E$ 中的任意一点，求使得凸包上的所有点都在 $l$ 上或者 $l$ 上方的情况。一个简单的反证法，如果有一个点在这条直线下方，那么经过这个点的直线 $l$ 会更低，因此这条直线就不是满足题意的直线。

那么拿上面的图思考，显而易见直线 $l$ 经过 $C$ 的时候就是满足题意的直线。

<div style="width:60%;margin:auto">
  {% asset_img optimization3.png '"" "斜率优化 3"' %}
</div>

由于除了 $C$ 点以外的所有点都在直线 $l$ 的上方，那么对于 $B,D$ 也依然，也就是 $y_B>kx_B+b,y_D>kx_D+b$。

可以带参算出 $BC,CD$ 的斜率。

$k_{BC}=\frac{y_C-y_B}{x_C-x_B}<\frac{(kx_C+b)-(kx_B+b)}{x_C-x_B}=\frac{k(x_C-kx_B)}{x_C-x_B}=k$
$k_{CD}=\frac{y_D-y_C}{x_D-x_C}>\frac{(kx_D+b)-(kx_C+b)}{x_D-x_C}=\frac{k(x_D-kx_C)}{x_D-x_C}=k$

也就是说，如果满足题意的直线 $l$ 经过 $F$，设 $F$ 左边的点为 $M$，右边的点为 $N$，则满足 $k_{MF}<k$ 且 $k_{FN}>k$。而由于下凸壳是下凹的，因此各段 $AB,BC,CD,DE$ 的斜率单调递增。我们寻找满足题意的直线 $l$ 的时候只需要查找到在各段斜率的有序序列中 $k$ 的位置即可，然后带入找到的点进行计算。

回顾一下，我们解决了这个问题：找一个点 $F\in\\{A,B,C,D,E\\}$，使得满足 $y_F=kx_F+b$ 的 $b$ 最小。

也就是找到了在 $F\in\\{A,B,C,D,E\\}$ 的条件下，$y_F-kx_F$ 的最小值。

那么，我们再看，以上内容，我们只是认定 $ABCDE$ 是一条各段斜率单增的折线段，为了这个引入一个凸包的定义似乎有一些多此一举。我们看看凸包除了边界线上的点，还有什么——这不废话，很明显是其他的点。

我们尝试在上面那张图的下凸壳上方撒上一些点，并不会应影响下凸壳的形态。

<div style="width:60%;margin:auto">
  {% asset_img optimization4.png '"" "斜率优化 4"' %}
</div>

找一个点 $F\in\mathbf{P}$，使得满足 $y_F=kx_F+b$ 的 $b$ 最小，$\mathbf{P}$ 为平面上撒的所有点的集合。

很明显，当直线 $l$ 经过非下凸壳上的点时，就会有下凸壳上的点处于直线 $l$ 下方，也就会有另一条直线 $l$ 的位置更低。因此，满足题意的直线 $l$ 一定经过的是下凸壳上的点。

这里，我们解决了在 $F\in\mathbf{P}$ 的条件下，$y_F-kx_F$ 的最小值。

这里，不需要数形结合找解法的时候，我们可以进一步将平面上撒的点看成是若干个二元组 $(x,y)$，要求 $y-kx$ 的最小值，这或许会更契合动态规划的决策。

## T 玩具装箱

题目来源：HNOI 2008
评测链接：<https://www.luogu.com.cn/problem/P3195>

P 教授有编号为 $1 \cdots n$ 的 $n$ 件玩具，第 $i$ 件玩具的长度为 $C_i$，要装到若干个容器里。

要求：

- 在一个一维容器中的玩具编号是连续的。

- 同时如果一个一维容器中有多个玩具，那么两件玩具之间要加入一个单位长度的填充物。形式地说，如果将第 $i$ 件玩具到第 $j$ 个玩具放到一个容器中，那么容器的长度将为 $x=j-i+\sum\limits_{k=i}^{j}C_k$。

如果容器长度为 $x$，其制作费用为 $(x-L)^2$。其中 $L$ 是一个常量。P 教授希望所有容器的总费用最小。

$1 \leq n \leq 5 \times 10^4$，$1 \leq L \leq 10^7$，$1 \leq C_i \leq 10^7$。

<br>

用 $f_i$ 表示用若干个容器装前 $i$ 个玩具的最小费用，显然有

$$
f_i=\\min_{j=0}^{i-1}\\{f_j+(i-j-1+\\sum_{k=j+1}^iC_k-L)^2\\}
$$

$\\sum_\\limits{k=j+1}^iC_k$ 可以直接用前缀和 $S_i-S_j$ 化解。

写出来朴素算法的核心代码如下。

{% contentbox type:note title:参考代码 open %}
```cpp
for (int i = 1; i <= n; ++i)
{
    f[i] = 0x7fffffffffffffff;
    for (int j = 0; j < i; ++j)
    {
        f[i] = min(f[i], f[j] + p2(i - j - 1 + s[i] - s[j] - L));
    }
}
```
{% endcontentbox %}

接下来尝试优化。

我们按照单调队列优化的套路，将与 $j$ 无关的项提到外面去，也就是

$$
\\begin{align}
f_i&=\\min_{j=0}^{i-1}\\{f_j+(i-j-1+S_i-S_j-L)^2\\}\\\\
&=\\min_{j=0}^{i-1}\\{f_j+(i-1+S_i-L)^2-2(i-1+S_i-L)(j+S_j)+(j+S_j)^2\\}\\\\
&=(i-1+S_i-L)^2+\\min_{j=0}^{i-1}\\{f_j+(j+S_j)^2-2(i-1+S_i-L)(j+S_j)\\}\\\\
\\end{align}
$$

我们发现，与单调队列优化的题不同的是，此时状态转移方程的 $\\max/\\min\\{\\}$ 里不止有只与 $j$ 有关的项，还有与 $i$ 与 $j$ 同时有关的项。

我们设 $g_i=\\min\\limits_{j=0}^{i-1}\\{f_j+(j+S_j)^2-2(i-1+S_i-L)(j+S_j)\\}$，因为与 $j$ 无关的项确实没有必要考虑。

试想刚才的问题引入，问题范围是若干个二元组 $(x,y)$，而对于每个询问 $k$ 都有一个回答，这个回答 $b=\\min\\{y-kx\\}$。

看看

$$
\\begin{align}
&g_i&&=\\min\\{&&[f_j+(j+S_j)^2]&&-&&[2(i-1+S_i-L)]&&(j+S_j)&&\\}&\\\\
&b&&=\\min\\{&&y&&-&&k&&x&&\\}&
\\end{align}
$$

我们认为 $j$ 是问题范围，而 $i$ 是询问，要找一个 $j$ 使得某个值最小。那么很明显我们要求的答案可以看成 $b$；$y$ 是二元组中的一个，那么就是只与 $j$ 有关的项；对于项 $kx$，同时与问题范围和询问有关，可以看成一个与问题范围有关的量 $x$ 和一个与询问有关的量 $k$ 的积。

既然这样的话，令

$$
\\begin{align}
& x_j=j+S_j\\\\
& y_j=f_j+(j+S_j)^2\\\\
& k_i=2(i-1+S_i-L)\\\\
& b_i=g_i
\\end{align}
$$

我们提出的那一部分状态转移方程就可以写成 $b_i=\\min\\limits_{j=0}^{i-1}\\{y_j-k_ix_j\\}$，就可以用我们上面的问题模型做。

我们需要做的就只是，对于外层循环每一次的 $i$，凭借斜率 $2(i-1+S_i-L)$ 求出答案，然后将二元组 $(i+S_i,f_i+(i+S_i)^2)$ 加到平面上，如果需要更新凸包，就更新。

这道题有些特殊地方，比如加点 $(i+S_i,f_i+(i+S_i)^2)$ 的横坐标 $(i+S_i)$ 明显是单增的。

{% contentbox type:success title:参考代码 %}
```cpp
#include <iostream>
#include <cstdio>

using namespace std;

int n, L, c[50005], s[50005];
long long f[50005];

long long p2(long long x)
{
    return x * x;
}

namespace ConvexHull    // 凸包
{
    long long x[50005], y[50005];    // (x[i],y[i]) 表示在下凸壳上的第 i 个点 P_{i} 的坐标
    double k[50005], b[50005];    // (k[i],b[i]) 表示线段 P_{i-1}P_{i} 的斜率和截距，线段 P_{0}p_{1} 被视为平行于 x 轴的线段
    int cnt = 0;

    void add(long long x0, long long y0)    // 加点
    {
        while (cnt && k[cnt] * x0 + b[cnt] >= y0) --cnt;    // 因为横坐标单增，所以不用关心新加点与后面点的连线，只考虑此时下凸壳尾部中将来应该被包含在下凸壳上方的点
        if (cnt)    // 在尾部新加点
        {
            ++cnt;
            x[cnt] = x0;
            y[cnt] = y0;
            k[cnt] = double(y[cnt] - y[cnt - 1]) / (x[cnt] - x[cnt - 1]);
            b[cnt] = y[cnt] - k[cnt] * x[cnt];
        }
        else    // 唯一的点
        {
            ++cnt;
            x[cnt] = x0;
            y[cnt] = y0;
            k[cnt] = 0;
            b[cnt] = y0; 
        }
    }

    long long calc(long long k0)    // 给定斜率查询
    {
        int i;
        for (i = 2; k[i] < k0 && i <= cnt; ++i) ;    // 找到斜率 k 的位置
        --i;
        return y[i] - k0 * x[i];
    }
}

int main()
{
    scanf("%d%d", &n, &L);
    for (int i = 1; i <= n; ++i) scanf("%d", &c[i]), s[i] = s[i - 1] + c[i];

    ConvexHull::add(0, 0);
    for (int i = 1; i <= n; ++i)
    {
        f[i] = p2(i - 1 + s[i] - L) + ConvexHull::calc(i - 1 + s[i] - L << 1);    // 查询结果
        ConvexHull::add(i + s[i], f[i] + p2(i + s[i]));    // 新加点
    }

    printf("%lld", f[n]);

    return 0;
}
```
{% endcontentbox %}

这就是斜率优化，外国人称为 Convex Hull Optimization 凸包优化。

## 应用范围

很明显，就是 $b=y-kx$ 这个式子。

如果状态转移方程可以写成 $b_i=y_j-k_ix_j$ 的形式，或者说，可以由 $b_i$ 和若干与 $j$ 无关的量进行有限次运算得到，其中，$x_j,y_j$ 只与 $j$ 有关，$k_i$ 只与 $i$ 有关，那么就可以使用斜率优化。

## 总结

数形结合，是斜率优化能够诞生的重要因素，也是探索方法的重要启迪。

与单调队列优化相同的思想，我们寻找决策集合重合的部分，尽量减少重复计算。我们拆分状态转移方程，按项拆分，单项式按因子拆分，让拆分出来的部分不同时与两个以上的变量相关。

一个平面，两条直线，三个字母，四个象限。我们在几何图形上正交分解，用已知条件推推敲敲，手执三角函数的利刃，可以创造一个世界。

致敬笛卡尔和它的坐标系，致敬几何与代数的美丽相遇。

我们用凸包，为了将杂乱无章的点画出轮廓。我们用图形，为了让繁杂的数字关系直观清晰。我们用证明，为了让眼之所见开遍大地。

理性枯燥了，试着用感性去领悟；感性无力了，试着用理性去推敲。

看，理性与感性结合出最美的花朵。
