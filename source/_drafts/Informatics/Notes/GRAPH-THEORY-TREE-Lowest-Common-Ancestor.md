---
title: 图论 - 树 - 最近公共祖先
tags:
  - '[I] 图论'
  - '[I] 树'
categories:
  - Informatics
  - Notes
date: 2022-08-05 15:18:05
---


沿着时间之线追溯遥远的血缘

<!--more-->

## 问题

知一棵树之族，问两结点来自远古的血脉自何时始分化。

抑或言之，求树上两个结点的公共祖先中深度最深的那一个。

这是最近公共祖先（Lowest Common Ancestor, LCA）问题。

朴素算法是，首先将深度较深的结点跳到它的一个祖先，让其与另一个结点深度相同。然后不停对两个结点找父亲，直到两个结点相同，即找到了最近公共祖先。无疑，很容易 TLE。

当然，我们这里讨论的是对同一棵树多次询问，如果是单次询问的话那么朴素算法就是最快的。

## 倍增法

我们对结点一层一层地跳，那么就很容易被卡到 $\mathrm{O}(n)$，此时我们思考，是否可以一次性跳过很多层，来迅速略过祖先不同的时期，并且也要不至于找到非最深的公共祖先。具体要跳多少层我们并不清楚，但我们可以判断出跳过去是否超过了应该直接略过的层数，也就是如果我们跳过去过后两个结点相同了，那么就是超过。根据每个正整数都可以分解为若干个 $2$ 的幂之和的性质，我们可以每次跳过 $2$ 的幂层，这样时间即使被卡也被减少到了 $\mathrm{O}(\log n)$。即每次找最大可以跳的也就是跳过去不会相同的 $2$ 的幂层，直到两结点的父亲相同时为止。

我们预处理出一个空间复杂度为 $\mathrm{O}(n\log k)$ 的数组 $f_{i,j}$，指向结点 $i$ 的 $j$ 代祖先。预处理时间复杂度为 $\mathrm{O}(n\log k)$，因此单次询问就不要用倍增法了。

## Tarjan
