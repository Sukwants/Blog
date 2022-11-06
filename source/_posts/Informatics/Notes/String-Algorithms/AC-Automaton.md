---
title: 字符串 - AC 自动机
tags:
  - '[I] 字符串'
  - '[I] 自动机'
categories:
  - Informatics
  - Notes
date: 2022-10-25 23:49:03
---


旅途中的下一个驿站将在何方

<!--more-->

## 眺望

多模式串匹配问题，在 KMP 所讨论的匹配问题基础上，同时对多个模式串匹配。

## 旧习

AC 自动机，常常被解释为在 Trie 树上的 KMP，于是我写出了这样的代码。

{% contentbox type:failure title:错误代码 open %}
```cpp
p[0] = -1;
for (int i = 0; i < 26; i++) if (ch[0][i]) q[++r] = ch[0][i];
while (f <= r)
{
    int x = q[f++];
    p[x] = p[fa[x]];
    while (~p[x] && !ch[p[x]][c[x] - 97]) p[x] = p[p[x]];
    if (~p[x]) p[x] = ch[p[x]][c[x] - 97];
    else p[x] = 0;
    for (int i = 0; i < 26; i++) if (ch[x][i]) q[++r] = ch[x][i];
}
for (int i = 1, j = 0; t[i]; i++)
{
    while (~j && !ch[j][t[i] - 97]) j = p[j];
    if (~j) j = ch[j][t[i] - 97];
    else j = 0;
    ans[j]++;
}
```
{% endcontentbox %}

但是它的复杂度可能就假掉了，我们 KMP 的时候是线性的复杂度，是从指针移动的角度思考的，而在 Trie 树上，指针移动却并不能这么简单地思考。

## 路标

我们希望不通过 ``while`` 就能够 $O(1)$ 的转移。具体地，我们通过处理出当前串再追加一个字母能够继续匹配的最长串。我们就对 $26$ 个中每一个字母都考虑，当前串如果有这个字母的儿子，那么就直接指向这个儿子，否则指向不断跳 $p$ 的过程中能够继续匹配的最长串。

我们的 $p$ 数组和新的跳转数组此时都能够 $O(1)$ 或者说 $O(26)$ 地得到。

{% contentbox type:note title:参考代码 open %}
```cpp
p[0] = 1;
for (int i = 0; i < 26; i++) if (ch[0][i]) q[++r] = ch[0][i];
while (f <= r)
{
    int x = q[f++];
    p[x] = ch[p[fa[x]]][c[x] - 97];
    for (int i = 0; i < 26; i++)
        if (!ch[x][i]) ch[x][i] = ch[p[x]][i];
        else q[++r] = ch[x][i];
}
```
{% endcontentbox %}

接下来我们思考，有时候一个串出现时并不是作为最长串，因此我们需要将能够跳到这个串的答案都累计上来。具体做法，倒序扫描手写队列，将 $Ans_{p_i}$ 加上 $Ans_i$。

```cpp
for (int i = r; i >= 1; i--) Ans[p[q[i]]] += Ans[q[i]];
```

这样统计到每个结点代表的串的真实答案，接下来一切都好做。

## 书写

### T 【模板】AC 自动机（简单版）

评测链接：<https://www.luogu.com.cn/problem/P3808>

（其实是假的）

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstring>

int n;
char s[1000005], t[1000005];

int ch[1000005][26], fa[1000005], tot = 0;
char c[1000005];
int h[1000005], nxt[1000005];

void add(char *s, int d)
{
    int idx = 0;
    for (int i = 1; s[i]; i++)
    {
        if (!ch[idx][s[i] - 97]) ch[idx][s[i] - 97] = ++tot, c[tot] = s[i], fa[tot] = idx;
        idx = ch[idx][s[i] - 97];
    }
    nxt[d] = h[idx];
    h[idx] = d;
}

int q[1000005], f = 1, r = 0;

int p[1000005];

int ans[1000005], Ans = 0;

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= n; i++)
    {
        scanf("%s", s + 1);
        add(s, i);
    }

    p[0] = -1;
    for (int i = 0; i < 26; i++) if (ch[0][i]) q[++r] = ch[0][i];
    while (f <= r)
    {
        int x = q[f++];
        p[x] = p[fa[x]];
        while (~p[x] && !ch[p[x]][c[x] - 97]) p[x] = p[p[x]];
        if (~p[x]) p[x] = ch[p[x]][c[x] - 97];
        else p[x] = 0;
        for (int i = 0; i < 26; i++) if (ch[x][i]) q[++r] = ch[x][i];
    }

    scanf("%s", t + 1);
    for (int i = 1, j = 0; t[i]; i++)
    {
        while (~j && !ch[j][t[i] - 97]) j = p[j];
        if (~j) j = ch[j][t[i] - 97];
        else j = 0;
        ans[j]++;
    }

    for (int i = r; i >= 1; i--) ans[p[i]] += ans[i];

    for (int i = 1; i <= r; i++) if (ans[i]) for (int j = h[i]; j; j = nxt[j]) Ans++;
    
    printf("%d\n", Ans);

    return 0;
}
```
{% endcontentbox %}

### T 【模板】AC 自动机（加强版）

{% contentbox type:success title:参考代码 %}
评测链接：<https://www.luogu.com.cn/problem/P3796>

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>

using namespace std;

int N;
char S[155][75], T[1000005];

int ch[11000][26], fa[11000], tot = 1;
char c[11000];

int dx[155];

int add(char *s)
{
    int idx = 0;
    for (int i = 1; s[i]; i++)
    {
        if (!ch[idx][s[i] - 97]) ch[idx][s[i] - 97] = ++tot, fa[tot] = idx, c[tot] = s[i];
        idx = ch[idx][s[i] - 97];
    }
    return idx;
}

int q[11000], f = 1, r = 0;

int p[11000];

int Ans[11000], b[155];

bool cmp(int x, int y) { return Ans[dx[x]] > Ans[dx[y]] || Ans[dx[x]] == Ans[dx[y]] && x < y; }

int main()
{
    for (;;)
    {
        scanf("%d", &N);
        if (!N) return 0;

        memset(ch, 0, sizeof ch);
        memset(Ans, 0, sizeof Ans);
        tot = 1;
        f = 1, r = 0;

        for (int i = 1; i <= N; i++)
        {
            scanf("%s", S[i] + 1);
            dx[i] = add(S[i]);
            b[i] = i;
        }

        p[0] = 1;
        for (int i = 0; i < 26; i++) if (ch[0][i]) q[++r] = ch[0][i];
        while (f <= r)
        {
            int x = q[f++];
            p[x] = ch[p[fa[x]]][c[x] - 97];
            for (int i = 0; i < 26; i++)
                if (!ch[x][i]) ch[x][i] = ch[p[x]][i];
                else q[++r] = ch[x][i];
        }

        scanf("%s", T + 1);
        for (int i = 1, j = 0; T[i]; i++)
        {
            j = ch[j][T[i] - 97];
            Ans[j]++;
        }

        for (int i = r; i >= 1; i--) Ans[p[q[i]]] += Ans[q[i]];
        
        sort(b + 1, b + N + 1, cmp);
        printf("%d\n", Ans[dx[b[1]]]);
        for (int i = 1; i <= N && Ans[dx[b[i]]] == Ans[dx[b[1]]]; i++) puts(S[b[i]] + 1);
    }
}
```
{% endcontentbox %}

### T 【模板】AC 自动机（二次加强版）

评测链接：<https://www.luogu.com.cn/problem/P5357>

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>

int n, dx[200005];
char T[200005], S[2000005];

int ch[200005][26], fa[200005], ct[200005], tot = 1;

int add(char *s)
{
    int idx = 0;
    for (int i = 1; s[i]; i++)
    {
        if (!ch[idx][s[i] - 97]) ch[idx][s[i] - 97] = ++tot, fa[tot] = idx, ct[tot] = s[i] - 97;
        idx = ch[idx][s[i] - 97];
    }
    return idx;
}

int p[200005];

int q[200005], f = 1, r = 0;

int Ans[200005];

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= n; i++)
    {
        scanf("%s", T + 1);
        dx[i] = add(T);
    }

    p[0] = 1;
    for (int i = 0; i < 26; i++) if (ch[0][i]) q[++r] = ch[0][i];
    while (f <= r)
    {
        int x = q[f++];
        p[x] = ch[p[fa[x]]][ct[x]];
        for (int i = 0; i < 26; i++)
            if (ch[x][i]) q[++r] = ch[x][i];
            else ch[x][i] = ch[p[x]][i];
    }

    scanf("%s", S + 1);
    for (int i = 1, j = 0; S[i]; i++)
    {
        j = ch[j][S[i] - 97];
        Ans[j]++;
    }

    for (int i = r; i >= 2; i--) Ans[p[q[i]]] += Ans[q[i]];

    for (int i = 1; i <= n; i++) printf("%d\n", Ans[dx[i]]);

    return 0;
}
```
{% endcontentbox %}

## 地图

这下我们再来看一看 AC 自动机的构建和使用过程。主要看使用过程，我们直接 ``j = ch[j][S[i] - 97];`` 就完成了跳转，构建过程也类似，就好像对所有下一步接受的字符都设置好了转移方式，这就是它被称为自动机的原因。

自动机的玄妙就在于，它对于一串一次接受的信号序列，对于每个信号，都有早已决定好的转移方式。事实上 Trie 树、KMP 算法（这个我倒是不太理解）也可以被视为自动机。而当 AC 自动机退化为只有一个模式串的时候，也能够 $O(26n)$ 地解决单模式串匹配问题。

## 再看

这一路上走走停停，你可知驿路上下一站又在何方？但心中永远存在一条归途——

回家的路。
