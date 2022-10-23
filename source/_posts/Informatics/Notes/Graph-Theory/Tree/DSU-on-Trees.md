---
title: 图论 - 树 - 树上启发式合并
tags:
  - '[I] 图论'
  - '[I] 树'
categories:
  - Informatics
  - Notes
date: 2022-08-12 18:30:24
---


继承者法则——树链之薪火相传

<!--more-->

## 关于 DSU on Trees

树上启发式合并的英文名叫做 DSU on Trees，而 DSU 意为 Disjoint Set Union 并查集，DSU on Trees 直译过来就是树上并查集。然而你知道的，阿拉伯数字是印度人发明的，文艺复兴实质是资本主义思想萌芽，所以 DSU on Trees 也可以和 DSU 没有关系。额，大概就是借鉴了按秩合并的思想吧。

## DP 转移受阻之时

在树上或者区间上进行 DP，或者运用树状数组、线段树等数据结构，有一个前提便是树或者区间能够被概括为有限个变量，而这些变量有可合并性且能够推演出答案。比如区间最值、子树权值最值满足可加性，区间和、子树权值和满足可加性、可减性。然而，有时却是不满足可合并性的。

比如说，树上每个结点都被涂上一个颜色，要求统计每棵子树内不同颜色的数量。其不满足可加性，也不能够状压~~（会爆空间的）~~，只能从暴力入手。

## 暴力 or 启发式

我们暴力的思路是，对于每棵子树，扫描一遍整棵子树，用一个数组 ``cnt`` 记录每个颜色的出现情况，进行统计。由于可怜的空间原因，我们没法开 $N$ 个 ``cnt``，因此我们只能每次清空 ``cnt`` 数组重来。

久而久之，我们发现了猫腻。

当前的树与其一棵子树之间，由于存在包含关系，所以子树状态不加修改即可作为当前树的状态的一部分，也就是说，我们可以从一棵子树的状态继承过来，避免重复计算这棵子树。

你是否似曾相识？

没错，这样我们能且仅能从一棵子树直接继承状态过来，和我们能且仅能将联系一棵子树的边划入联系父结点的边同一树链有异曲同工之妙。

树链剖分将一条重链拉到底部，为的就是更多的结点少走岔路，因为每走一次岔路都是对连续区间的一次分割，我们要在数量尽量少的连续区间上进行操作。我们也可以从一棵子树代代继承（向上继承？），因为每走一次岔路都是一次重复计算，我们对一棵结点的答案要尽量少的次数地统计。

借鉴树链剖分的思路，按照子树大小划分重边，剖分重链。我们在 DFS 的过程中，对于一个结点，先 DFS 除了重子结点以外的所有结点，每次结束过后清空 ``cnt`` 数组；再 DFS 重子结点，不清空 ``cnt`` 数组，直接继承状态；在此基础上朴素扫描一遍除了重子结点代表的子树外的其余所有子树，统计入答案。

大概还是把树链剖分的图贴出来。

{% asset_img decomposition.png '"" "树链剖分"' %}

可以看出，每一条重链都是代代继承的主脉，而一旦遇到轻边即宣告重链终止，也就表示重链上之前结点继承下来的状态均需重新计算。而重新计算过后，又汇入一条重链继续进行继承。

我们在树链剖分的时候曾经说明过，一个结点到根结点的路径上最多出现 $\log n$ 条轻边，因此一个结点最多被计算和重新计算 $\log n+1$ 次。这样，朴素算法 $\mathrm{O}(n^2)$ 的时间复杂度，我们降到了 $\mathrm{O}(n\log n)$。

## T Lomsat gelral

题目来源：Codeforces 600E
评测链接：<https://codeforces.com/problemset/problem/600/E>

有根树上有 $n$ 个结点，以 $1$ 号结点为根，每个结点有一个颜色，对每棵子树计算子树内数量最多的颜色，如有并列同时输出。

<br>

这就是上面介绍 DSU on Trees 的基本应用。

```cpp
#include <cstdio>
#include <cstring>

int n, x, y, c[100005];
int h[100005], to[200005], nxt[200005], tot = 0;
int fa[100005], sz[100005], hson[100005];
int cnt[100005], d;
long long ans, Ans[100005];

void add(int x, int y)
{
    ++tot;
    to[tot] = y;
    nxt[tot] = h[x];
    h[x] = tot;
}

void pre(int x)
{
    sz[x] = 1;
    for (int i = h[x]; i; i = nxt[i])
    {
        if (to[i] != fa[x])
        {
            fa[to[i]] = x;
            pre(to[i]);
            sz[x] = sz[x] + sz[to[i]];
            if (sz[to[i]] > sz[hson[x]]) hson[x] = to[i];
        }
    }
}

void scan(int x)
{
    for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x]) scan(to[i]);
    ++cnt[c[x]];
    if (cnt[c[x]] > d)
    {
        d = cnt[c[x]];
        ans = c[x];
    }
    else if (cnt[c[x]] == d) ans = ans + c[x];
}

void solve(int x)
{
    if (hson[x])
    {
        for (int i = h[x]; i; i = nxt[i])
        {
            if (to[i] != fa[x] && to[i] != hson[x])
            {
                solve(to[i]);
                memset(cnt, 0, sizeof cnt);
                d = 0;
            }
        }
        solve(hson[x]);
        for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x] && to[i] != hson[x]) scan(to[i]);
    }
    ++cnt[c[x]];
    if (cnt[c[x]] > d)
    {
        d = cnt[c[x]];
        ans = c[x];
    }
    else if (cnt[c[x]] == d) ans = ans + c[x];
    Ans[x] = ans;
}

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i) scanf("%d", &c[i]);
    for (int i = 1; i < n; ++i)
    {
        scanf("%d%d", &x, &y);
        add(x, y);
        add(y, x);
    }
    
    pre(1);
    solve(1);
    
    for (int i = 1; i <= n; ++i) printf("%lld ", Ans[i]);
    
    return 0;
}
```

## T Arpa’s letter-marked tree and Mehrdad’s Dokhtar-kosh paths

题目来源：Codeforces 741D
评测链接：<https://codeforces.com/problemset/problem/741/D>

有根树，$n$ 个结点，根为 $1$ 号结点，每条边写有一个 $a-v$ 的小写字母。求出一条最长的路径，使得路径上所有边所写的字母经过重新排列后能够生成一条回文串。

<br>

首先我们看这个要求，「使得路径上所有边所写的字母经过重新排列后能够生成一条回文串。」，其实这换一种说法就是，该路径上只有最多 $1$ 个字母出现了奇数次，而其余字母都出现了偶数次。为了能够统计每个字母出现的次数，我们发现奇偶性正与异或运算有关联，且 $a-v$ 只有 $22$ 个字母——状态压缩。

状压过后，我们就可以对每个结点计算出其到根结点的路径上所有字母的奇偶性状态，对两个结点的该值作异或运算，即得到这两个结点之间的路径上所有字母的奇偶性状态。这样我们能够在 $\mathrm{O}(23)$ 的时间内完成一条路径是否合法的比较，然而 $\mathrm{O}(n^2)$ 的时间复杂度是不够的。

对于求解路径的问题，我们一般可以用树形 DP 从左子树、右子树、跨左右子树三种情况转移，而最重要的还是在跨左右子树的情况。为了不让每次都枚举来尝试，我们可以用上哈希表，直接 $\mathrm{O}(23)$ 判断可以与该结点构成合法路径的结点是否在其余子树内存在。

所以暴力树形 DP 求解第三种情况的做法是先将根结点加入哈希表，再每次查询是否存在与子树内结点匹配的结点，接着将这棵子树的结点加入哈希表。这样依然复杂度堪忧。

你发现了——打的哈希表可以继承。

那么我们改变一下策略，在求解问题的时候，先求解非重子结点的子问题，每次结束清空哈希表，再求解重子结点的子问题，不清空哈希表，接着查询与根结点匹配的结点并将根结点加入哈希表，然后重新对各其余子树查询并加入哈希表。

这就是树上启发式合并。

```cpp
#include <iostream>
#include <cstdio>

using namespace std;

int n, p;
char c;

int h[500005], to[1000005], w[1000005], nxt[1000005], cnt = 0;
int fa[500005], sz[500005], hson[500005], wc[1000005], dep[1000005];

int hs[5000005]; 

int Ans[500005];

void add(int x, int y, int z)
{
	++cnt;
	to[cnt] = y;
	w[cnt] = z;
	nxt[cnt] = h[x];
	h[x] = cnt;
}

void pre(int x)
{
	sz[x] = 1;
	for (int i = h[x]; i; i = nxt[i])
	{
		if (to[i] != fa[x])
		{
			fa[to[i]] = x;
			wc[to[i]] = wc[x] ^ (1 << w[i]); 
			dep[to[i]] = dep[x] + 1;
			pre(to[i]);
			sz[x] = sz[x] + sz[to[i]];
			if (sz[to[i]] > sz[hson[x]]) hson[x] = to[i];
		}
	}
}

void clearhs(int x)
{
	hs[wc[x]] = 0;
	for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x]) clearhs(to[i]);
}

int count(int x)
{
	int ans = 0;
	if (hs[wc[x]] != 0) ans = dep[x] + hs[wc[x]];
	for (int i = 0; i < 22; ++i) if (hs[wc[x] ^ (1 << i)] != 0) ans = max(ans, dep[x] + hs[wc[x] ^ (1 << i)]);
	for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x]) ans = max(ans, count(to[i]));
	return ans;
}

void update(int x)
{
	hs[wc[x]] = max(hs[wc[x]], dep[x]);
	for (int i = h[x]; i; i = nxt[i]) if (to[i] != fa[x]) update(to[i]);
}

void solve(int x)
{
	Ans[x] = dep[x] * 2;
	if (hson[x])
	{
		for (int i = h[x]; i; i = nxt[i])
		{
			if (to[i] != fa[x] && to[i] != hson[x])
			{
				solve(to[i]);
				clearhs(to[i]);
			}
		}
		solve(hson[x]);
		if (hs[wc[x]] != 0) Ans[x] = max(Ans[x], dep[x] + hs[wc[x]]);
		for (int i = 0; i < 22; ++i) if (hs[wc[x] ^ (1 << i)] != 0) Ans[x] = max(Ans[x], dep[x] + hs[wc[x] ^ (1 << i)]);
		hs[wc[x]] = max(hs[wc[x]], dep[x]);
		for (int i = h[x]; i; i = nxt[i])
		{
			if (to[i] != fa[x] && to[i] != hson[x])
			{
				Ans[x] = max(Ans[x], count(to[i]));
				update(to[i]);
			}
		}
 	}
 	else hs[wc[x]] = dep[x];
 	Ans[x] = Ans[x] - dep[x] * 2;
}

void dp(int x)
{
	for (int i = h[x]; i; i = nxt[i])
	{
		if (to[i] != fa[x])
		{
			dp(to[i]);
			Ans[x] = max(Ans[x], Ans[to[i]]);
		}
	}
}

int main()
{
	scanf("%d", &n);
	for (int i = 1; i < n; ++i)
	{
		scanf("%d %c", &p, &c);
		add(p, i + 1, c - 97);
		add(i + 1, p, c - 97);
	}
	
	dep[1] = 1;
	pre(1);	
	solve(1);
	dp(1);
	
	for (int i = 1; i <= n; ++i) printf("%d ", Ans[i]);
	
	return 0;
} 
```

## 继承者法则

我翻开 OI Wiki 一查，这 Wiki 没有例题，歪歪斜斜的每页上都写着「树上启发式合并」七个字。我横竖睡不着，仔细看了半夜，才从字缝里看出字来，满本都写着两个字是「继承」！

我们讲继承，讲将最大的子树继承，为的就是对于数组之类的统计，避免可以避免的重复计算。

在重链上，走最长的康庄大道。

继承者，子树之大者，薪火相传，以为历~~久~~ $N$ 弥~~新~~ $\log N$。
