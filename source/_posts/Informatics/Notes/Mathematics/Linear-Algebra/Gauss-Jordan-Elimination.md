---
title: 数学 - 线性代数 - 高斯消元法
tags:
  - '[I] 数学'
  - '[I] 线性代数'
categories:
  - Informatics
  - Notes
date: 2022-10-30 20:23:48
---


错位的去与留

<!--more-->

## 线性方程组

高斯消元法用于求解线性方程组，也就是以下形式的方程组：

$$
\left\\{\begin{matrix}
a_{1,1}x_1+a_{1,2}x_2+\ldots+a_{1,n}x_n=b_1\\\\
a_{2,1}x_1+a_{2,2}x_2+\ldots+a_{2,n}x_n=b_2\\\\
\vdots\\\\
a_{n,1}x_1+a_{n,2}x_2+\ldots+a_{n,n}x_n=b_n
\end{matrix}\right.
$$

### T 【模板】高斯消元法

评测链接：<https://www.luogu.com.cn/problem/P3389>

给定一个线性方程组，对其求解

## 初等行变换

我们将这样的方程组写成矩阵形式

$$
\left[\begin{array}{llll|l}
a_{1,1} & a_{1,2} & \ldots & a_{1,n} & b_1\\\\
a_{2,1} & a_{2,2} & \ldots & a_{2,n} & b_2\\\\
\vdots & \vdots & \ddots & \vdots & \vdots\\\\
a_{n,1} & a_{n,2} & \ldots & a_{n,n} & b_n\\\\
\end{array}\right]
$$

求解线性方程组需要用到三种操作类型：

  1. 对一行的数同时乘上一个数
  2. 将一行的数同时乘上一个数过后加到另一行上
  3. 交换两行

这被称为矩阵的「初等行变换」。显而易见的是，在线性方程组的增广矩阵中使用初等行变换，所生成的线性方程组依然等价。

同样的我们可以定义「初等列变换」，但在此不作讨论。

## 高斯消元法

高斯消元的做法是，扫描第 $i\gets 1\text{ to }n$ 行，用第 $i$ 行去消掉第 $j\in[i+1,n]$ 行的第 $i$ 个未知数，到最后一个方程的时候就只剩下了一个元，接下来我们再将其依次回带，求出所有的未知数的值。

比如我们有一个矩阵

$$
\left[\begin{array}{llll|l}
1 & 2 & -1 & 6 \\\\
2 & 1 & -3 & -9 \\\\
-1 & -1 & 2 & 7
\end{array}\right]
$$

用第 $1$ 行去消去第 $2$ 行、第 $3$ 行的第 $1$ 个未知数，得到

$$
\left[\begin{array}{llll|l}
1 & 2 & -1 & 6 \\\\
0 & -3 & -1 & -21 \\\\
0 & 1 & 1 & 13
\end{array}\right]
$$

接着将第 $2$ 行的第 $2$ 个元的系数化为 $1$ 并消去第 $3$ 行的第 $2$ 个元。

$$
\left[\begin{array}{llll|l}
1 & 2 & -1 & 6 \\\\
0 & 1 & \frac{1}{3} & 7 \\\\
0 & 0 & \frac{2}{3} & 6
\end{array}\right]
$$

然后将第 $3$ 行的第 $3$ 个元的系数化为 $1$。

$$
\left[\begin{array}{llll|l}
1 & 2 & -1 & 6 \\\\
0 & 1 & \frac{1}{3} & 7 \\\\
0 & 0 & 1 & 9
\end{array}\right]
$$

此时我们得到了 $x_3=9$，再依次回带，即可得出 $x_1,x_2,x_3$ 了。

当然，我们也可以体现在增广矩阵上，让我们通过初等行变换依次消掉其余行内的多余元。

$$
\left[\begin{array}{llll|l}
1 & 0 & 0 & 7 \\\\
0 & 1 & 0 & 4 \\\\
0 & 0 & 1 & 9
\end{array}\right]
$$

我们就做完了高斯消元法。

在具体实现中，有可能还会出现第 $i$ 行的第 $i$ 个系数为 $0$ 的情况，因此这个时候我们需要找到一个第 $i$ 个元的系数非零的行，将其作为第 $i$ 行消去其他行的第 $i$ 个未知数。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cmath>
#include <algorithm>

using namespace std;

const int MAXN = 100;
const double eps = 1e-5;

int n;
struct eq
{
    double d[MAXN + 5];
    eq operator+(const eq &x) const
    {
        eq res;
        for (int i = 0; i <= n; i++) res.d[i] = d[i] + x.d[i];
        return res;
    }
    eq operator*(double x) const
    {
        eq res;
        for (int i = 0; i <= n; i++) res.d[i] = d[i] * x;
        return res;
    }
} e[MAXN + 5];

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= n; j++) scanf("%lf", &e[i].d[j]);
        scanf("%lf", &e[i].d[0]);
    }

    for (int i = 1; i <= n; i++)
    {
        int x = i;
        while (x <= n && fabs(e[x].d[i]) < eps) ++x;
        if (x > n) return puts("No Solution"), 0;
        swap(e[i], e[x]);
        e[i] = e[i] * (1 / e[i].d[i]);
        for (int j = i + 1; j <= n; ++j) e[j] = e[j] + e[i] * (-e[j].d[i]);
    }

    for (int i = n; i >= 1; i--) for (int j = 1; j < i; j++) e[j] = e[j] + e[i] * (-e[j].d[i]); 
    
    for (int i = 1; i <= n; i++) printf("%.2f\n", e[i].d[0]);

    return 0;
}
```
{% endcontentbox %}

## 约旦消元法

高斯 - 约旦消元法，本质上不过是高斯消元法的另一种实现形式，依然是运用的传统高斯消元法的思想。

其基本步骤是，对第 $i$ 个未知数，找到一个该未知数的系数非 $0$ 且未被选过的行，用它去消除其他所有行的该元，不止是第 $j\in[i+1,n]$ 行。最后不用回带，直接就得出了每个未知数的解。正确性显然，因为处理第 $i$ 个元的时候，选定的行中第 $j\in[1,i-1]$ 个系数一定为 $0$，因此对其他行并不会产生这些系数的影响。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cmath>
#include <algorithm>

using namespace std;

const int MAXN = 100;
const double eps = 1e-5;

int n;
struct eq
{
    double d[MAXN + 5];
    eq operator+(const eq &x) const
    {
        eq res;
        for (int i = 0; i <= n; i++) res.d[i] = d[i] + x.d[i];
        return res;
    }
    eq operator*(double x) const
    {
        eq res;
        for (int i = 0; i <= n; i++) res.d[i] = d[i] * x;
        return res;
    }
} e[MAXN + 5];

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= n; i++)
    {
        for (int j = 1; j <= n; j++) scanf("%lf", &e[i].d[j]);
        scanf("%lf", &e[i].d[0]);
    }

    for (int i = 1; i <= n; i++)
    {
        int x = i;
        while (x <= n && fabs(e[x].d[i]) < eps) x++;
        if (x > n) return puts("No Solution"), 0;
        swap(e[i], e[x]);
        e[i] = e[i] * (1 / e[i].d[i]);
        for (int j = 1; j <= n; j++) if (i != j) e[j] = e[j] + e[i] * (-e[j].d[i]);
    }
    
    for (int i = 1; i <= n; i++) printf("%.2lf\n", e[i].d[0]);

    return 0;
}
```
{% endcontentbox %}

## 时空复杂度

时间复杂度是 $O(n^3)$ 的，而空间复杂度与输入规模同级，是 $O(n^2)$ 的。

## 多解与无解

当我们在尝试消去第 $i$ 个元的时候，如果找不到这个元的系数非 $0$ 的行，那么说明这个元无论取何值，其他元都有唯一确定解。并且，在消元过程中，如果出现了 $k$ 个这样的元，那么我们称这 $k$ 个元为自由元，其余元为主元。显然，自由元与主元是相对的，但是这并不代表任意 $k$ 个元都可以作为自由元。

无解的情况在于，如果最后消完元，发现有某一行系数部分均为 $0$ 而增广部分非 $0$，那么这个方程组无解。并且，无解的优先级高于多解。

## 不等的情况

当未知数的数量 $n$ 与方程个数 $m$ 不等的时候。

  1. 如果 $m>n$，那么在对用前 $n$ 个方程消完元过后，如果出现了后 $m-n$ 行的增广部分非 $0$ 的情况，方程组无解。否则，按正常情况考虑。
  2. 如果 $m<n$，那么除了解答过程中得出的无解情况，其他情况均无穷多组解。

## 最后的话语

高斯消元成功在于将 $x_1$ 消去时留下了 $x_2$，失败在于 $x_1$ 与 $x_2$ 不得不同时消去。当 $\frac{a_{1,1}}{a_{2,1}}\leq\frac{a_{1,2}}{a_{2,2}}$ 的时候高斯消元完成了分离去与留的使命，我们才因此能够分离不同的元。

消元的美，在于错位，因为错位，才有了去留。

而错位的美，彰显了每个元最独特的个性。
