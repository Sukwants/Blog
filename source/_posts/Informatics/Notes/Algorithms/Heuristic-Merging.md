---
title: 启发式合并
tags:
  - '启发式合并'
categories:
  - Informatics
  - Notes
date: 2022-11-13 16:35:17
---


误入迷途的次数，不会超过 $\log$

<!--more-->

## 引入

在并查集的问题中，我们需要解决有关将两个集合合并的问题。但是在一种情况下，我们还需要对待合并集合的个体进行操作，而这些操作是依赖于个体特性的，不能整体操作，但是我们可以只对待合并集合其一操作。此时只记录集合所属关系的并查集无法解决这种问题，而暴力修改又太慢，于是我们「启发式」地暴力修改。

## T 梦幻布丁

题目来源：HNOI 2009
评测链接：<https://www.luogu.com.cn/problem/P3201>

$n$ 个布丁摆成一行，进行 $m$ 次操作。每次将某个颜色的布丁全部变成另一种颜色的，然后再询问当前一共有多少段颜色。

例如，颜色分别为 $1,2,2,1$ 的四个布丁一共有 $3$ 段颜色。

<br>

这里我们相当于对颜色开集合，进行合并，但是有关连续颜色段的处理就无法通过并查集实现，也就是我们上面所说的问题模型。

我们知道，暴力做法是，考察所有待改变颜色的布丁，将其修改为欲修改的颜色，并更新答案。于是我们可以通过对每种颜色开一个链表，每次遍历链表修改，并对链表整体进行连接。也就是下面这样。

{% contentbox type:note title:参考代码 %}
```cpp
#include <cstdio>

const int MAXN = 1e5, MAXA = 1e6;

int n, m, a[MAXN + 5];

int h[MAXA + 5], nxt[MAXN + 5], sz[MAXA + 5];
int tr[MAXA + 5];

int op, x, y;

int Ans = 0;

int main()
{
    for (int i = 1; i <= MAXA; ++i) tr[i] = i;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i)
    {
        scanf("%d", a + i);
        if (a[i] != a[i - 1]) ++Ans;
        nxt[i] = h[a[i]];
        h[a[i]] = i;
    }

    for (int i = 1; i <= m; ++i)
    {
        scanf("%d", &op);
        if (op == 1)
        {
            scanf("%d%d", &x, &y);
            if (x != y)
            {
                int j = h[x];
                if (!j) continue;
                while (nxt[j])
                {
                    Ans += (a[j] == a[j - 1]) + (a[j] == a[j + 1]);
                    a[j] = y;
                    Ans -= (a[j] == a[j - 1]) + (a[j] == a[j + 1]);
                    j = nxt[j];
                }
                Ans += (a[j] == a[j - 1]) + (a[j] == a[j + 1]);
                a[j] = y;
                Ans -= (a[j] == a[j - 1]) + (a[j] == a[j + 1]);
                nxt[j] = h[y];
                h[y] = h[x];
                h[x] = 0;
            }
        }
        else printf("%d\n", Ans);
    }

    return 0;
}
```
{% endcontentbox %}

但是这样做最坏是 $O(n^2)$ 的。（虽然黑暗爆炸 OJ 上的数据太水也能过。）

试想，我们将颜色 $x$ 修改为颜色 $y$ 的时候，可能使答案发生变化的也就是每一个颜色 $x$ 和颜色 $y$ 的交界处。也就是说，我们只需要考察其中任意一个颜色即可，而合并的时候只需要 $O(1)$ 连接，因此合并我们并不关心。那么我们时间复杂度的瓶颈在于每次合并的时候，考察的链表长度。

显然，我们应该选择待合并的两条链表之中较短的一条。于是可以写出下面的代码。（虽然但是，其实如果记录了链表的尾部，是不必记录一个 `tr[]` 的。）

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

const int MAXN = 1e5, MAXA = 1e6;

int n, m, a[MAXN + 5];

int h[MAXA + 5], nxt[MAXN + 5], sz[MAXA + 5];
int tr[MAXA + 5];

int op, x, y;

int Ans = 0;

int main()
{
    for (int i = 1; i <= MAXA; ++i) tr[i] = i;
    scanf("%d%d", &n, &m);
    for (int i = 1; i <= n; ++i)
    {
        scanf("%d", a + i);
        if (a[i] != a[i - 1]) ++Ans;
        nxt[i] = h[a[i]];
        h[a[i]] = i;
        ++sz[a[i]];
    }

    for (int i = 1; i <= m; ++i)
    {
        scanf("%d", &op);
        if (op == 1)
        {
            scanf("%d%d", &x, &y);
            if (x == y) continue;
            if (sz[tr[x]] > sz[tr[y]]) swap(tr[x], tr[y]);
            x = tr[x];
            y = tr[y];
            if (!sz[x]) continue;
            int j = h[x];
            while (nxt[j])
            {
                Ans += (a[j] == a[j - 1]) + (a[j] == a[j + 1]);
                a[j] = y;
                Ans -= (a[j] == a[j - 1]) + (a[j] == a[j + 1]);
                j = nxt[j];
            }
            Ans += (a[j] == a[j - 1]) + (a[j] == a[j + 1]);
            a[j] = y;
            Ans -= (a[j] == a[j - 1]) + (a[j] == a[j + 1]);
            nxt[j] = h[y];
            h[y] = h[x];
            sz[y] += sz[x];
            h[x] = 0;
            sz[x] = 0;
        }
        else printf("%d\n", Ans);
    }

    return 0;
}
```
{% endcontentbox %}

这样看上去我们只是优化了常数，但是事实上时间复杂度降到了 $O(n\log n)$。

### 证明.法一

先给出 [@有趣的问题](https://www.luogu.com.cn/blog/AIQ/) 给出的关于「最劣情况是每次都是等长链表合并的情况」的证明。

令 $f_x$ 表示合并 $x$ 个元素的最小次数。

易得 $f_{x+1}\le f_x+1$。（我们叫他结论1）

容易有
$$
f_x=f_y+f_{x-y}+y
$$
我们钦定 $0<y<x/2$

由结论1，显然有
$$
\begin{align}
f_y-f_{x/2} & \le y-x/2\\\\
f_{x-y}-f_{x/2} & \le x-y-x/2
\end{align}
$$
容易得到
$$
\begin{align}
f_y+f_{x-y}+y-f_{x/2}-f_{x/2}-x/2 & \le y-x/2+x-y-x/2+y-x/2+y-x/2\\\\
f_y+f_{x-y}+y-f_{x/2}-f_{x/2}-x/2 & \le y-x/2
\end{align}
$$
又因为 $y<x/2$

所以
$$
f_y+f_{x-y}+y\le f_{x/2}\times 2+x/2
$$

有了上面的结论，就可以得出时间复杂度上界是 $O(n\log n)$ 了。

### 证明.法二

或者说，我推出的证明方法如下，定义规模 $n$ 的时间复杂度为 $T(n)$（以下证明并未严谨使用渐进式符号）

对于 $n>1$，假设 $\forall x\in[1,n),T(x)\leq x\log x$

令启发式合并时，这条链表是由长为 $x$ 和 $n-x$ 的两条链合并而来的，设 $x\leq n-x$ 即 $x\leq \frac{n}{2}$。

有

$$
\begin{align}
T(n)&=T(x)+T(n-x)+x\\\\
    &\leq x\log x+(n-x)\log(n-x)+x\\\\
    &=x(\log x+1)+(n-x)\log(n-x)\\\\
    &=x\log2x+(n-x)\log(n-x)\\\\
    &\leq x\log n+(n-x)\log n\\\\
    &=n\log n
\end{align}
$$

而当 $n=1$ 时，又 $T(1)=0\leq 1\log 1$，因此命题「$T(n)\leq n\log n$」得证。

### 证明.法三

将合并过程想象成一棵树，利用树上启发式合并的结论证明。

## 启发式合并

那么启发式合并的做法，就是在合并过程中处理较短的一条链表，并且时间复杂度上界是 $O(n\log n)$。

## T xor

题目来源：124OJ 2726
评测链接 1：<http://124.221.194.184/problem/2726>
评测链接 2：<https://hydro.ac/d/sukwoj/p/QZ2726>

给定一个长度为 $n$ 的非负整数序列 $a_1,\ldots,a_n$。

统计二元组 $(i,j)$ 的数量，满足 $1\leq i\leq j\leq n$ 且 $a_i\oplus a_{i+1}\oplus\ldots\oplus a_j\leq \max\\{a_i,a_{i+1},\ldots,a_j\\}$，其中 $\oplus$ 是按位异或。

<br>

枚举最大值，显而易见可以构建一棵笛卡尔树。在每个最大值的作用区间内，统计满足题意条件的二元组数量。

异或和可以预处理出前缀异或和转化为端点异或，在每个作用区间内，在左边的区间或者右边的区间枚举一个端点，通过可持久化 0/1 Trie 做一个数位 DP，可以求出该区间内的答案。

求每个作用区间的答案时，取更短的一个区间来枚举端点，这样时间复杂度可以类似启发式合并来分析。

时间复杂度为 $O(n\log n\log \mathit{MaxA})$。

{% contentbox type:success title:参考代码 %}
嘻嘻，咕咕咕
{% endcontentbox %}

## T 字符串

题目来源：124OJ 2777
评测链接 1：<http://124.221.194.184/problem/2777>
评测链接 2：<https://hydro.ac/d/sukwoj/p/QZ2777>

米拉有一个字符集为 $[1,10^{100}]$ 的字符串 。不过她把这个字符串藏了起来。设 $S[l,r]$ 表示 $S$ 的 $[L,R]$ 区间的子串。 你需要进行 次操作，每次操作会是如下两种操作的一种：

1. 给出 $l,r$ ，表示将“区间的子串是一个回文串”加入已知条件。显然，无论怎么加，一定存在一种字符串满足所有已知条件。
2. 给出 $a,b,x,y$，表示你需要回答，是否可以根据目前的已知条件，推断出 $S[a,b]$ 与 $S[x,y]$ 是否相等。你可以有三种回答： `Equal` 表示可以推断出两串相等，`Not equal` 表示可以推断出两串一定不相等， `Unknown`表示无法推断出两串是否相等。

<br>

能确定相同的字符使用同一数字表示，建一棵线段树处理字符串及其反串的哈希值，枚举已知回文串中对称的两个字符，启发式地修改字符的哈希值，时间复杂度为 $O(n^2\log n)$。

但同时，我们知道最多我们需要合并 $n-1$ 次，因此考虑快速找到需要合并的值。在当前给出的已知回文串中，二分下一个需要修改哈希值的位置，可以在线段树上查询一段子串的哈希值来判断这段子串内是否存在需要修改的值，此时找到这些位置需要的时间复杂度为 $O(n\log^2n)$。

总的时间复杂度为 $O(n\log^2n)$。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <utility>
#include <algorithm>

using namespace std;

const int MAXN = 1e5;
const int MOD = 998244353;

int n, Q, op, l, r, a, b, x, y;

int c[MAXN + 5];

long long p[MAXN + 5];

class SegmentTree
{
private:
    long long s1[(MAXN << 2) + 5], s2[(MAXN << 2) + 5];
    int id[MAXN + 5], l[(MAXN << 2) + 5], r[(MAXN << 2) + 5];
    void build(int k, int l, int r)
    {
        this->l[k] = l;
        this->r[k] = r;
        if (l == r)
        {
            id[l] = k;
            s1[k] = s2[k] = l - 1;
            return;
        }
        int mid = l + r >> 1;
        build(k << 1, l, mid);
        build(k << 1 | 1, mid + 1, r);
        s1[k] = (s1[k << 1] * p[r - mid] + s1[k << 1 | 1]) % MOD;
        s2[k] = (s2[k << 1 | 1] * p[mid - l + 1] + s2[k << 1]) % MOD;
    }
    pair<long long, long long> query(int k, int ql, int qr)
    {
        if (l[k] == ql && r[k] == qr) return make_pair(s1[k], s2[k]);
        int mid = l[k] + r[k] >> 1;
        if (qr <= mid) return query(k << 1, ql, qr);
        else if (mid + 1 <= ql) return query(k << 1 | 1, ql, qr);
        else
        {
            pair<long long, long long> resL = query(k << 1, ql, mid), resR = query(k << 1 | 1, mid + 1, qr);
            return make_pair((resL.first * p[qr - mid] + resR.first) % MOD, (resR.second * p[mid - ql + 1] + resL.second) % MOD);
        }
    }
public:
    void build(int n) { build(1, 1, n); }
    pair<long long, long long> query(int l, int r) { return query(1, l, r); }
    void modify(int x, long long k)
    {
        s1[id[x]] = s2[id[x]] = k;
        for (int i = id[x] >> 1; i; i >>= 1)
        {
            s1[i] = (s1[i << 1] * p[r[i] - (l[i] + r[i] >> 1)] + s1[i << 1 | 1]) % MOD;
            s2[i] = (s2[i << 1 | 1] * p[(l[i] + r[i] >> 1) - l[i] + 1] + s2[i << 1]) % MOD;
        }
    }
} seg;

int h[MAXN + 5], nxt[MAXN + 5], rer[MAXN + 5], sz[MAXN + 5];

void merge(int x, int y)
{
    if (sz[x] < sz[y]) swap(x, y);
    for (int i = h[y]; i; i = nxt[i])
    {
        c[i] = x;
        seg.modify(i, x);
    }
    nxt[rer[x]] = h[y];
    rer[x] = rer[y];
    sz[x] += sz[y];
}

int main()
{
    scanf("%d%d", &n, &Q);
    p[0] = 1;
    for (int i = 1; i <= n; ++i) p[i] = p[i - 1] * n % MOD;

    seg.build(n);
    for (int i = 1; i <= n; ++i) c[i] = i - 1, h[i - 1] = i, rer[i - 1] = i, sz[i - 1] = 1;

    for (int i = 1; i <= Q; ++i)
    {
        scanf("%d", &op);
        if (op == 1)
        {
            scanf("%d%d", &l, &r);
            int s = l + r, bd = (s + 1 >> 1) - 1, now = l;
            while (now <= bd)
            {
                int L = now, R = bd;
                while (L < R)
                {
                    int mid = L + R >> 1;
                    if (seg.query(L, mid).first == seg.query(s - mid, s - L).second) L = mid + 1;
                    else R = mid;
                }
                if (c[L] != c[s - L]) merge(c[L], c[s - L]);
                now = L + 1;
            }
        }
        else
        {
            scanf("%d%d%d%d", &a, &b, &x, &y);
            if (a - b != x - y) puts("Not equal");
            else if (seg.query(a, b) == seg.query(x, y)) puts("Equal");
            else puts("Unknown");
        }
    }

    return 0;
}
```
{% endcontentbox %}

## 总结

在启发式合并画出的二叉树上，左右子树更小一棵的大小与整棵树的高度此消彼长，这也就造就了我们达不到 $O(n^2)$ 的时间复杂度。简简单单看似常数的优化，在严谨的数学证明面前居然是 $O(n\log n)$。

是非的评判在于世人，只要人云亦云，误入歧途的次数就不会超过 $\log$。

但总有那么一些人，一身文人傲骨，「虽千万人吾往矣」。

那是百年前的你，是百年后的我。
