---
title: 字符串 - KMP 算法 & Z 算法
tags:
  - '字符串'
categories:
  - Informatics
  - Notes
date: 2022-10-23 14:25:09
---


正因为有了羁绊，彼此才成为家人

<!--more-->

## 落种

只有在旅途上回头看，才能发现当时未能注意到的风景。

本文以 $S_{i\ldots j}$ 表示 $S$ 下标在 $[i,j]$ 之间的子串，字符串下标从 $1$ 开始。

## 羁绊

字符串匹配的问题一般这样描述：给定主串 $S$ 和模式串 $T$（$|S|\geq|T|$），求有多少个 $i\in[i,|S|-|T|+1]$，满足 $S_{i\ldots i+|T|-1}=T$。

暴力做法显而易见。

KMP 算法解决此类问题，因其提出者 D.E.Knuth、J.H.Morris 和 V.R.Pratt 而得名。

我们从暴力算法开始思考。暴力算法中，我们枚举每一个起始位置 $i\in[i,|S|-|T|+1]$，验证是否满足 $S_{i\ldots i+|T|-1}=T$。我们记一个函数 $f(x)$ 表示从 $x$ 出发最长匹配长度。

显然，对于任何 $y>x\land y+f(y)-1\leq x+f(x)-1$，都有 $f(y)<f(x)$。它表示，当我们在 $i=x$ 作为起始位置向右扩展到右端点 $j$ 扩展不动的时候，再考虑任何 $\leq j$ 的右端点是没有任何意义的。于是我们考虑 $j=j+1$。

我们需要找到最小的 $i$ 满足 $S_{i\ldots j}=T_{1\ldots j-i+1}$。记 $g(j)$ 表示这个意义。显然 $g(j)$ 是要 $>g(j-1)$ 的，然后我们观察

{% asset_img kmp.png '"" "KMP 示意图"' %}

我们会发现 $S_{g(j-1)\ldots j},S_{g(j)\ldots j}$ 有一个公共部分。

根据 $g(x)$ 的定义，我们可以知道 $S_{g(j-1)\ldots j-1}=T_{1\ldots (j-1)-g(j-1)+1},S_{g(j)\ldots j}  =T_{i\ldots j-g(j)+1}$ 的。截取出其中公共部分，就是

$$
S_{g(j)\ldots j-1}=T_{g(j)-g(j-1)+1,j-1-g(j-1)+1}=T_{1,j-1-g(j)+1}
$$

令 $h(x)=x-g(x)+1$，有

$$
T_{h(j-1)-h(j)+2\ldots h(j-1)}=T_{1\ldots h(j)-1}
$$

也就是要模式串的子串 $T_{1,\ldots h(j-1)}$ 要满足长为 $h(j)-1$ 的前缀和后缀相同。

于是我们在匹配过程中，如果此时匹配到的右端点是 $x$，最大长度是 $len$，那么我们应该考虑所有的 $len'$ 满足 $T_{1\ldots len'}=T_{len-len'+1\ldots len}$，其中可以扩展 $x$ 的取最大的 $len$ 转移。

通俗地说，就是在考虑要扩展右端点 $x$ 到 $x-1$ 的时候，找到所有右端点能达到 $x$ 的子串，取能继续向右扩展的最长的一个扩展。而这些子串满足的充要条件是 $T_{1\ldots len'}=T_{len-len'+1\ldots len}$。

我们可以看到，上面的等式与 $S$ 无关，因此预处理派上用场。我们用 $p(i)$ 表示最大的 $j\neq i$ 满足 $T_{1\ldots j}=T_{i-j+1\ldots i}$，在过程中只需要不断 $len=p(len)$ 即可找到所有满足条件的 $len$。预处理的过程与上述过程类似。

于是我们用双指针 $i,j$，在 $j$ 不断右移的过程中要满足 $S_{i\ldots j}=T_{1\ldots j-i+1}$，我们就用上述方法调整到合适的 $i$ 再进行向右扩展。

在过程中，右指针匀速向右移动，左指针向右移动 $|S|$ 次，向左最多移动到 $0$，因此总的时间复杂度是 $O(n)$ 的。有兴趣也可以势能分析一下。

## 剪花

（T 剪花布条）

评测链接：<https://loj.ac/p/10043>

一块花布条，里面有些图案，另有一块直接可用的小饰条，里面也有一些图案。对于给定的花布条和小饰条，计算一下能从花布条中尽可能剪出几块小饰条来呢？

{% contentbox type:success title:参考代码 %}
```cpp
#include <iostream>
#include <cstdio>
#include <cstring>

using namespace std;

char s[1005], t[1005];
int p[1005], Ans;

int main()
{
    for (;;)
    {
        scanf("%s", s + 1);
        if (strcmp(s + 1, "#") == 0) break;
        scanf("%s", t + 1);

        p[0] = -1;
        for (int i = 1; t[i]; ++i)
        {
            int j = p[i - 1];
            while (~j && t[j + 1] != t[i]) j = p[j];
            p[i] = j + 1;
        }

        Ans = 0;
        for (int i = 1, j = 0; s[i]; ++i)
        {
            while (~j && t[j + 1] != s[i]) j = p[j];
            j++;
            if (!t[j + 1])
            {
                ++Ans;
                j = 0;
            }
        }

        printf("%d\n", Ans);
    }
    return 0;
}
```
{% endcontentbox %}

KMP 的核心在于：利用已知信息减少重复计算的时间。

## 装彩

KMP 的 `p` 数组是一个非常神奇的东西，它一般还应用于循环节。怎么说呢？

{% asset_img repeat.png '"" "循环节"' %}

这告诉我们，这个字符串是由长度为 $p-p(x)$ 的**不完全**循环节循环生成的，即使有可能最后一个循环节不完全。推广所有递归生成的 $x'=p(x')$，都有 $x-x'$ 是这个字符串的不完全循环节。

换言之，对于所有递归生成的 $x'=p(x')$，如果 $(x-x')\mid x$ 则 $(x-x')$ 是字符串的循环节。并且，上述方法能找到所有循环节。显然做法是 $O(n)$ 的。

在我们求出 $p$ 后，尝试 $O(1)$ 求出最小循环节。

假若字符串不存在重复两次以上的循环节，那么显然有 $x-p(x)\nmid x$。

假若存在重复两次的循环节最小 $y$，那么一定有 $p(x)\geq x-y$。对于 $p(x)>x-y$ 的情况，我们继续思考。

{% asset_img repeat2.png '"" "循环节"' %}

令 $z=x-p(x)$。由图中可以看到，这种情况下，对于 $\forall i\in[1,y]$，都有 $S_i=S_{(i+z-1)\bmod y+1}$。该等式不断传递下去，就会有对于任意 $x,y\in[1,y]\land x\equiv y\pmod{\gcd(y,z)}$，有 $S_x=S_y$。也就是会出现更小的循环节 $\gcd(y,z)$，这与 $y$ 是最小循环节矛盾，故假设 $p(x)>x-y$ 不成立。

因此，对于任何存在重复两次的循环节的字符串，$x-p(x)$ 就是其最小循环节，同时可以得出 $x-p(x)\mid x$ 在这种情况下恒成立。

综上所述，对于 $x-p(x)\nmid x$ 的情况，不存在重复两次以上的循环节，否则最小循环节为 $x-p(x)$。

（T 字符串匹配）

题目来源：NOIP 2020
评测链接：<https://www.luogu.com.cn/problem/P7114>

小 C 学习完了字符串匹配的相关内容，现在他正在做一道习题。

对于一个字符串 $S$，题目要求他找到 $S$ 的所有具有下列形式的拆分方案数：

$S = ABC$，$S = ABABC$，$S = ABAB \ldots ABC$，其中 $A$，$B$，$C$ 均是非空字符串，且 $A$ 中出现奇数次的字符数量不超过 $C$ 中出现奇数次的字符数量。

更具体地，我们可以定义 $AB$ 表示两个字符串 $A$，$B$ 相连接，例如 $A = \texttt{aab}$，$B = \texttt{ab}$，则 $AB = \texttt{aabab}$。

并递归地定义 $A^1=A$，$A^n = A^{n - 1} A$（$n \ge 2$ 且为正整数）。例如 $A = \texttt{abb}$，则 $A^3=\texttt{abbabbabb}$。

则小 C 的习题是求 $S = {(AB)}^iC$ 的方案数，其中 $F(A) \le F(C)$，$F(S)$ 表示字符串 $S$ 中出现奇数次的字符的数量。两种方案不同当且仅当拆分出的 $A$、$B$、$C$ 中有至少一个字符串不同。

小 C 并不会做这道题，只好向你求助，请你帮帮他。

<br>

枚举 $AB$，维护出现奇数次字符数量小于等于 $i$ 的 $A$ 的数量 $d_i$，接着枚举 $i$，相应地得出 $C$，利用上述规律和我们维护的 $d_i$ 统计答案。

当然如果你说孩子没事做，「维护出现奇数次字符数量小于等于 $i$ 的 $A$ 的数量」也可以用树状数组做到 $O(\log 26)$）（魔法披风）。

{% contentbox type:success title:参考代码 %}
```cpp
#include <iostream> 
#include <cstdio>
#include <cstring>

using namespace std;

int T, p[1100000], c[1100000], cnt[26], d[30], x, len, lp[1100000];
char s[1100000];
long long Ans = 0;

int main()
{
    scanf("%d", &T);
    for (int test = 1; test <= T; ++test)
    {
        scanf("%s", s + 1);
        len = strlen(s + 1);
        
        p[0] = -1;
        for (int i = 1; i <= len; ++i)
        {
            int j = p[i - 1];
            while (~j && s[j + 1] != s[i]) j = p[j]; 
            p[i] = j + 1;
            
            lp[i] = i - p[i];
        }
        
        memset(cnt, 0, sizeof cnt);
        c[len + 1] = 0;
        for (int i = len; i >= 1; --i)
        {
            cnt[s[i] - 'a']++;
            if (cnt[s[i] - 'a'] & 1) c[i] = c[i + 1] + 1;
            else c[i] = c[i + 1] - 1;
        }
        
        memset(cnt, 0, sizeof cnt);
        cnt[s[1] - 'a'] = 1;
        x = 1;
        for (int i = 0; i <= 26; ++i) d[i] = (i >= x);
        Ans = 0;
        for (int i = 2; i < len; ++i)
        {
            Ans += d[c[i + 1]];
            for (int j = i * 2; j < len; j += i)
            {
                if (i % lp[j] == 0) Ans += d[c[j + 1]];
            }
            cnt[s[i] - 'a']++;
            if (cnt[s[i] - 'a'] & 1) x++;
            else x--;
            for (int j = x; j <= 26; ++j) d[j]++;
        }
        printf("%lld\n", Ans);
    }
    
    return 0;
}
```
{% endcontentbox %}

## 点灯

Z 算法（扩展 KMP）解决这类问题，有字符串 $T$，对于任何 $i\in[1,|T|]$，$z(i)$ 表示 $T$ 和 $T_{i,|T|}$ 的最长公共前缀（LCP），$z(i)$ 被称为 Z 函数。

暴力做法显然，$O(n^2)$。

类似 KMP 的思路，充分利用已知信息来加速转移。

在计算到 $z(i)$ 的时候，我们记 $j\in[1,i-1]$ 的 $j+z(j)-1$ 最大的 $j$ 为 $l$，$j+z(j)-1$ 为 $r$。接下来分情况讨论：

如果 $i\leq r$，那么根据定义有 $T_{i,r}=T_{i-l+1,r-l+1}$，于是当 $z(i-l+1)<r-i+1$ 的时候有 $z(i)=z(i-l+1)$，而 $z(i-l+1)\geq r-i+1$ 的时候有 $z(i)\geq z(i-l+1)$。于是我们的做法是，先将 $z(i)$ 赋为 $\min\\{z(i-l+1),r-i+1\\}$，然后尝试向右扩展。因为只有 $z(i-l+1)\geq r-i+1$ 的时候才有可能扩展成功，因此右端点只会从 $r$ 开始向右扩展，最后扩展出一个新的 $r$。

如果 $i>r$，那么暴力扩展，此时也相当于从 $r$ 开始扩展右端点。

因为整个过程中右端点只会被扩展 $|T|$ 次，因此时间复杂度是 $O(|T|)$ 的。

需要注意的是 $z(1)$ 需要单独处理，并不能计入 $l,r$ 的更新，不然每一次都会 $z(i)=\min\\{z(i),|T|-i+1\\}$，显然正确又显然不正确。

{% contentbox type:note title:参考代码 open %}
```cpp
l = 0, r = 0;
for (int i = 2; i <= m; i++)
{
    if (i <= r) z[i] = min(z[i - l + 1], r - i + 1);
    while (i + z[i] <= m && b[z[i] + 1] == b[i + z[i]]) z[i]++;
    if (i + z[i] - 1 > r) l = i, r = i + z[i] - 1;
}
```
{% endcontentbox %}

## 光舞

（T 【模板】扩展 KMP（Z 函数））

评测链接：<https://www.luogu.com.cn/problem/P5410>

给定两个字符串 $a,b$，你要求出两个数组：

- $b$ 的 $z$ 函数数组 $z$，即 $b$ 与 $b$ 的每一个后缀的 LCP 长度。
- $b$ 与 $a$ 的每一个后缀的 LCP 长度数组 $p$。

对于一个长度为 $n$ 的数组 $a$，设其权值为 $\operatorname{xor}_{i=1}^n i \times (a_i + 1)$。

<br>

对于第二个询问，在预处理出 $b$ 的 $z$ 数组过后，采取类似的思路，用 $i+p(i)-1$ 最大的 $(i,i+p(i)-1)$ 去更新 $(l, r)$。对于 $i\leq r$ 的 $i$，先赋 $z(i)$ 为 $\min\\{z(i-l+1),r-i+1\\}$ 再尝试扩展。

当然，需要注意的是这里并不能用 $i+z(i)-1$ 最大的 $(i,i+z(i)-1)$ 去更新 $(l, r)$，赋 $z(i)$ 为 $\min\\{p(i-l+1),r-i+1\\}$，因为这样右端点 $r$ 的扩展就失去了连续性，复杂度可能会假掉。

并且这里并不需要把 $p(1)$ 单独拎出来处理，因为 $z(i)$ 已经得出结果了。

{% contentbox type:success title:参考代码 %}
```cpp
#include <iostream>
#include <cstdio>
#include <cstring>

using namespace std;

char a[20000005], b[20000005];
int n, m;

int z[20000005], p[20000005];
long long Z, P;

int l, r;

int main()
{
    scanf("%s%s", a + 1, b + 1);
    n = strlen(a + 1);
    m = strlen(b + 1);

    Z = (z[1] = m) + 1;
    l = 0, r = 0;
    for (int i = 2; i <= m; i++)
    {
        if (i <= r) z[i] = min(z[i - l + 1], r - i + 1);
        while (i + z[i] <= m && b[z[i] + 1] == b[i + z[i]]) z[i]++;
        if (i + z[i] - 1 > r) l = i, r = i + z[i] - 1;
        Z ^= i * (z[i] + 1ll);
    }

    l = 0, r = 0;
    for (int i = 1; i <= n; i++)
    {
        if (i <= r) p[i] = min(z[i - l + 1], r - i + 1);
        while (i + p[i] <= n && b[p[i] + 1] == a[i + p[i]]) p[i]++;
        if (i + p[i] - 1 > r) l = i, r = i + p[i] - 1;
        P ^= i * (p[i] + 1ll);
    }

    printf("%lld\n%lld\n", Z, P);

    return 0;
}
```
{% endcontentbox %}

Z 算法的思想事实上和 Manacher 比较类似，采取已经处理出的右端点最右的区间带来的特性进行简化，并且只有当初始即扩展到右端点的时候右边界才有可能扩展。

而在上题中，我们如果统计 $z(i)=|B|$ 的次数，实际就实现了 KMP 的功能，所以被称为扩展 KMP 算法。或者说还有一点就是对模式串预处理的思想是相同的。

## 花开

（脑袋短路了，为了写 Z 算法的博客把 KMP 也写了）

君住长江头，我住长江尾，日日思君不见君，共饮长江水。

字符串有了纠缠，平方才降为线性。

人世间有了羁绊，亲情才化为陪伴。
