---
title: 动态规划 - 概率动态规划
tags:
  - '动态规划'
  - '概率 & 期望'
categories:
  - Informatics
  - Notes
date: 2022-11-21 08:25:21
---


尘埃落定之前

<!--more-->

## 总述

顾名思义，概率 DP 与期望 DP 是通过动态规划的手段解决概率与期望问题。

概率期望问题我们经常能够归纳出子问题模型，因此我们考虑动态规划手段。

## 概率 DP

此类 DP 问题一般采用顺推和刷表法，将当前状态的概率乘上转移的概率累积到目标状态的概率里去。

### T Bag of mice

题目来源：Codeforces 148D
评测链接：<https://codeforces.com/problemset/problem/148/D>

袋子里有若干白鼠和黑鼠，公主和龙轮流从袋子里随机取出一只鼠，随后从袋子里随机跑出一只鼠。先取到白鼠者获胜，如最后没有鼠了，龙获胜。公主先手，询问公主获胜的概率。

Simply 用 $f_{i,j}$ 表示到达 $i$ 只白鼠、$j$ 只黑鼠状态的概率，对每个状态，考虑公主在此轮获胜、龙在此轮获胜、二者均不获胜的概率。

核心代码如下：

{% contentbox type:note title:参考代码 open %}
```cpp
for (int i = w; i >= 1; --i)
{
    for (int j = b; j >= 0; --j)
    {
        Ans += f[i][j] * i / (i + j);
        if (j >= 3) f[i][j - 3] += f[i][j] * j / (i + j) * (j - 1) / (i + j - 1) * (j - 2) / (i + j - 2);
        if (i >= 1 && j >= 2) f[i - 1][j - 2] += f[i][j] * j / (i + j) * (j - 1) / (i + j - 1) * i / (i + j - 2);
    }
}
```
{% endcontentbox %}

完整代码如下：

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>

const int MAXN = 1000;

int w, b;
double f[MAXN + 5][MAXN + 5];

double Ans = 0;

int main()
{
    scanf("%d%d", &w, &b);
    
    f[w][b] = 1;
    for (int i = w; i >= 1; --i)
    {
        for (int j = b; j >= 0; --j)
        {
            Ans += f[i][j] * i / (i + j);
            if (j >= 3) f[i][j - 3] += f[i][j] * j / (i + j) * (j - 1) / (i + j - 1) * (j - 2) / (i + j - 2);
            if (i >= 1 && j >= 2) f[i - 1][j - 2] += f[i][j] * j / (i + j) * (j - 1) / (i + j - 1) * i / (i + j - 2);
        }
    }

    printf("%.9lf\n", Ans);

    return 0;
}
```
{% endcontentbox %}

### T 线

题目来源：124OJ 2796
评测链接：<http://124.221.194.184/problem/2796>

我是杨雅兰，我喜欢出阴间 Round。

你现在要做一个计算问题。

在一条直线上有 $N$ 个粒子，初始分别在 $1,2,...,N$ 处，在 $1$ 和 $N$ 处各有一堵墙。

每个粒子初始时向左或向右以 $1m/s$ 的速度运动。

粒子碰到墙时会立即改为向相反方向运动。

两个粒子相遇时，有 $p$ 的概率左边的粒子会消失，有 $1−p$ 的概率右边的粒子会消失。

试求最后 $N$ 号粒子存活下来的概率。

<br>

我们要知道最后 $N$ 号粒子存活下来的概率，就先要知道前 $N-1$ 个粒子最后存活下来 $k$ 个同时往右运动的概率，$k\in[1,N]$。

令 $f_{i,j}$ 表示前 $i$ 个粒子最后存活下来 $j$ 个同时往右运动的概率，那么如果第 $i$ 个粒子一开始就是往右运动，我们只需要从 $f_{i-1,j-1}$ 转移到 $f_{i,j}$。如果一开始是往左运动，那么我们需要考虑前 $i-1$ 个粒子存活下来 $k$ 个的概率，并且每次在第 $i$ 个粒子与前面的粒子相撞的时候，按照概率把 $f_{i-1,k}$ 分配给 $f_{i-1,k-1}$ 和 $f_{i,k}$。

核心代码如下。

{% contentbox type:note title:参考代码 open %}
```cpp
f[0][0] = 1;
for (int i = 1; i < N; ++i)
{
    if (a[i] == 1) for (int j = 1; j <= i; ++j) f[i][j] = f[i - 1][j - 1];    // Surely exists.
    else
    {
        for (int j = i - 1; j >= 1; --j)
        {
            f[i - 1][j - 1] = (f[i - 1][j - 1] + f[i - 1][j] * p) % MOD;    // p: exist
            f[i][j] = (f[i][j] + f[i - 1][j] * d) % MOD;    // d: die
        }
        f[i][1] = (f[i][1] + f[i - 1][0]) % MOD;
    }
}
```
{% endcontentbox %}

完整代码如下：

{% contentbox type:success title:参考代码 %}
本蒻写的第一道概率 DP 居然是联考题。

```cpp
#include <cstdio>

namespace IO
{
    const int T = 1 << 20;
    char Ibuf[T], *p1 = Ibuf, *p2 = Ibuf;
    char getchar() { return (p1 == p2 && (p2 = Ibuf + fread(p1 = Ibuf, 1, T, stdin), p1 == p2)) ? EOF : *p1++; }
    template <class T> void read(T &x) {
        x = 0; int sign = 1; static char ch = getchar();
        while (ch < '0' || ch > '9') { if (ch == '-') sign = -1; ch = getchar(); }
        while (ch >= '0' && ch <= '9') x = (x << 3) + (x << 1) + (ch ^ 48), ch = getchar();
        x = x * sign;
    }
}

const int MOD = 998244353;

const int MAXN = 1000;

int N, a[MAXN + 5];
long long p, d;

long long f[MAXN + 5][MAXN + 5];    // 1 ~ i, exists j.

int main()
{
    IO::read(N);
    IO::read(p);
    d = (1 - p + MOD) % MOD;
    for (int i = 1; i <= N; ++i) IO::read(a[i]);
    
    f[0][0] = 1;
    for (int i = 1; i < N; ++i)
    {
        if (a[i] == 1) for (int j = 1; j <= i; ++j) f[i][j] = f[i - 1][j - 1];    // Surely exists.
        else
        {
            for (int j = i - 1; j >= 1; --j)
            {
                f[i - 1][j - 1] = (f[i - 1][j - 1] + f[i - 1][j] * p) % MOD;    // p: exist
                f[i][j] = (f[i][j] + f[i - 1][j] * d) % MOD;    // d: die
            }
            f[i][1] = (f[i][1] + f[i - 1][0]) % MOD;
        }
    }
    
    for (int i = N - 1; i >= 1; --i) f[N - 1][i - 1] = (f[N - 1][i - 1] + f[N - 1][i] * p) % MOD;
    printf("%lld\n", f[N - 1][0]);

    return 0;
}
```
{% endcontentbox %}

## 期望 DP

此类 DP 问题一般采用逆推和填表法，通过目标状态的期望按转移的概率加权计算得到当前状态的期望。

### T Collecting Bugs

题目来源：POJ 2096
评测链接：<http://poj.org/problem?id=2096>

有一个系统，可能出现一些 bug，这些 bug 被分到 $n$ 个分类里，可能出现在 $s$ 个子系统里。每天会发现一个 bug，随机属于一个分类、属于一个子系统。求 $n$ 个分类均出现 bug，且 $s$ 个子系统均出现 bug 的期望天数。

Simply 用 $f_{i,j}$ 表示已经有 $i$ 个分类、$j$ 个子系统存在 bug，距离目标状态的期望步数。状态转移时，考虑这一次发现的 bug 属于已知或未知分类、属于已知或位置子系统的概率，列出状态转移方程。

$$
f_{i,j}=\frac{i}{n}\times\frac{j}{s}\times f_{i,j}+\frac{n-i}{n}\times\frac{j}{s}\times f_{i+1,j}+\frac{i}{n}\times\frac{s-j}{s}\times f_{i,j+1}+\frac{n-i}{n}\times\frac{s-j}{s}\times f_{i+1,j+1}
$$

整理得到

$$
f_{i,j}=\frac{1}{1-\frac{i}{n}\times\frac{j}{s}}\left(\frac{n-i}{n}\times\frac{j}{s}\times f_{i+1,j}+\frac{i}{n}\times\frac{s-j}{s}\times f_{i,j+1}+\frac{n-i}{n}\times\frac{s-j}{s}\times f_{i+1,j+1}\right)
$$

参考代码。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>

const int MAXN = 1000;

int n, s;
double f[MAXN + 5][MAXN + 5];

int main()
{
    scanf("%d%d", &n, &s);
    
    for (int i = n; i >= 0; --i)
    {
        for (int j = s; j >= 0; --j)
        {
            if (i == n && j == s) continue;
            f[i][j] = (f[i + 1][j] * (n - i) * j / n / s + f[i][j + 1] * i * (s - j) / n / s + f[i + 1][j + 1] * (n - i) * (s - j) / n / s + 1) / (1 - 1.0 * i * j / n / s);
        }
    }

    printf("%.4lf\n", f[0][0]);

    return 0;
}
```
{% endcontentbox %}

这样的期望 DP，我们更能够理解「状态转移方程」的方程属性。如果从期望定义的角度思考，是我们在原地踏步的概率越来越小，期望不断趋近于一个极限值。如同物理学上的芝诺悖论，这个极限值表示原方程左边和右边的 $f_{i,j}$ 是相等的，此时我们直接解方程就可以得出这个值。

我们的状态转移方程不仅局限于递推式，一般化的方程也是合理的一种形式。

更加一般化的，需要联解方程组，这就是有后效性的 DP。

### T 换教室

题目来源：NOIP 2016 提高组
评测链接：<https://www.luogu.com.cn/problem/P1850>

有 $n$ 个课程，对于第 $i$ 个课程，在教室 $c_i$ 上课，你可以选择申请换教室，此时你有 $k_i$ 的概率成功换到 $d_i$ 教室上这一堂课。有 $v$ 个教室 $e$ 条路径，保证图连通。你可以在学期开始前申请换至多 $m$ 个教室，求按顺序上课在教室间移动的期望值最小值。

事实上这是一道伪装成期望 DP 的背包水题。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstring>
#include <iostream>

using namespace std;

const int MAXN = 2000, MAXV = 300;

int n, m, v, e, a, b, w;
int c[MAXN + 5], d[MAXN + 5];
double k[MAXN + 5];

int dis[MAXV + 5][MAXV + 5];

double f[MAXN + 5][MAXN + 5][2];

int main()
{
    scanf("%d%d%d%d", &n, &m, &v, &e);
    for (int i = 1; i <= n; ++i) scanf("%d", c + i);
    for (int i = 1; i <= n; ++i) scanf("%d", d + i);
    for (int i = 1; i <= n; ++i) scanf("%lf", k + i);
    memset(dis, 0x3f, sizeof dis);
    for (int i = 1; i <= e; ++i)
    {
        scanf("%d%d%d", &a, &b, &w);
        if (w < dis[a][b]) dis[a][b] = dis[b][a] = w;
    }

    for (int i = 1; i <= v; ++i) dis[i][i] = dis[0][i] = 0;
    for (int k = 1; k <= v; ++k) for (int i = 1; i <= v; ++i) for (int j = 1; j <= v; ++j) dis[i][j] = min(dis[i][j], dis[i][k] + dis[k][j]);

    for (int i = 0; i <= n; ++i) for (int j = 0; j <= m; ++j) f[i][j][0] = f[i][j][1] = 1e9;
    f[0][0][0] = 0;
    for (int i = 1; i <= n; ++i)
    {
        f[i][0][0] = f[i - 1][0][0] + dis[c[i - 1]][c[i]];
        for (int j = 1; j <= m; ++j)
        {
            f[i][j][0] = min(f[i - 1][j][0] + dis[c[i - 1]][c[i]], f[i - 1][j][1] + dis[d[i - 1]][c[i]] * k[i - 1] + dis[c[i - 1]][c[i]] * (1 - k[i - 1]));
            f[i][j][1] = min(f[i - 1][j - 1][0] + dis[c[i - 1]][d[i]] * k[i] + dis[c[i - 1]][c[i]] * (1 - k[i]),
                             f[i - 1][j - 1][1] + dis[d[i - 1]][d[i]] * k[i - 1] * k[i] + dis[c[i - 1]][d[i]] * (1 - k[i - 1]) * k[i] + dis[d[i - 1]][c[i]] * k[i - 1] * (1 - k[i]) + dis[c[i - 1]][c[i]] * (1 - k[i - 1]) * (1 - k[i]));
        }
    }

    double Ans = 1e9;
    for (int i = 0; i <= m; ++i) Ans = min(Ans, min(f[n][i][0], f[n][i][1]));
    printf("%.2lf\n", Ans);

    return 0;
}
```
{% endcontentbox %}

## 有后效性的概率 / 期望 DP

此类题目需要联解方程组。

### T Broken robot

题目来源：Codeforces 24D
评测链接：<https://codeforces.com/contest/24/problem/D>

在 $n\times m$ 的矩形区域中，机器人从 $(x,y)$ 开始，等概率向左、右、下方可移动的区域移动或停留在原地。求到达最后一行的期望步数。

对只有一列的情况，特殊处理。

其余情况，按行联解方程。当前我们转移到第 $i$ 行，那么

$$
\begin{align}
f_{i,1}&=\frac{1}{3}(f_{i,1}+f_{i,2}+f_{i+1,1})+1\\\\
f_{i,j}&=\frac{1}{4}(f_{i,j}+f_{i,j+1}+f_{i,j-1}+f_{i+1,j})+1\\\\
f_{i,M}&=\frac{1}{3}(f_{i,M}+f_{i,M-1}+f_{i+1,M})+1
\end{align}
$$

整理得

$$
\begin{align}
2f_{i,1}-f{i,2}&=f_{i+1,1}+3\\\\
3f_{i,j}-f_{i,j-1}-f_{i,j+1}&=f_{i+1,j}+4\\\\
2f_{i,M}-f{i,M-1}&=f_{i+1,M}+3
\end{align}
$$

在高斯消元的时候，注意一些细节，单次时间复杂度其实是 $O(3M)$ 的。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>

const int MAXN = 1000;

int N, M, x, y;

double f[MAXN + 5][MAXN + 5];

double Mat[MAXN + 5][MAXN + 5];

void solve(int r)
{
    Mat[1][1] = 2;
    Mat[1][2] = -1;
    Mat[1][0] = f[r + 1][1] + 3;
    for (int i = 2; i < M; ++i)
    {
        Mat[i][i] = 3;
        Mat[i][i - 1] = -1;
        Mat[i][i + 1] = -1;
        Mat[i][0] = f[r + 1][i] + 4;
    }
    Mat[M][M] = 2;
    Mat[M][M - 1] = -1;
    Mat[M][0] = f[r + 1][M] + 3;

    for (int i = 1; i <= M; ++i)
    {
        Mat[i][i + 1] /= Mat[i][i];
        Mat[i][0] /= Mat[i][i];
        Mat[i][i] = 1;
        Mat[i + 1][i + 1] -= Mat[i + 1][i] * Mat[i][i + 1];
        Mat[i + 1][0] -= Mat[i + 1][i] * Mat[i][0];
        Mat[i + 1][i] = 0;
    }
    f[r][M] = Mat[M][0];
    for (int i = M - 1; i >= 1; --i) f[r][i] = Mat[i][0] - Mat[i][i + 1] * f[r][i + 1];
}

int main()
{
    scanf("%d%d", &N, &M);
    scanf("%d%d", &x, &y);

    if (M == 1) return printf("%.10lf\n", double((N - x) << 1)), 0;

    for (int i = N - 1; i >= x; --i) solve(i);

    printf("%.10lf\n", f[x][y]);

    return 0;
}
```
{% endcontentbox %}

## 综述

尘埃落定之前，所有的可能性都是概率，所有的步数都是期望。

无论是概率的步步为棋，还是期望的未来展望，都游离在不确定与确定之间，都在尘埃落定之前。

百年前，为了一个美丽的梦想，曾经有人前赴后继。

如今多想告诉你，你的梦想，一切都已尘埃落定。
