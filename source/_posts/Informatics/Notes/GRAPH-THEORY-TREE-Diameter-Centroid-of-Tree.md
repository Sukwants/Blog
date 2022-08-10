---
title: 图论 - 树 - 树的直径与重心
tags:
  - '[I] 图论'
  - '[I] 树'
categories:
  - Informatics
  - Notes
date: 2022-08-05 10:15:16
---


树之上，缔造出圆的影子

<!--more-->

## 树的直径

圆的直径是圆内最长的弦，树的直径是树上最长的路径。

{% asset_img diameters-of-circle-and-tree.png '"" "圆和树的直径"' %}

类似圆的直径有无数条，树的直径也可能有多条，比如上图中还有一条直径。

求树的直径一般有两种方法。

  1. 搜两次
  2. 树形 DP

### 搜两次

策略是，任选一个结点开始搜索整棵树，得到距离最远的一个结点，这是一条直径的一个端点，再从选定的结点开始搜索整棵树，得到距离最远的一个结点，这是这条直径的另一个端点。

正确性证明如下。

先考虑证明，第一次搜到的点一定是一条直径的一个端点。

如下图，设第一次我们从 $S$ 出发，最远点为 $T$，我们将中途所有结点和边均压缩成一条边。

{% asset_img searchtwice-prove1.png '"" "搜两次 算法证明 1"' %}

采取反证法，假设存在异于 $T$ 的两个结点 $W,V$，使得 $\mathit{path}(W,V)$ 是直径，且以 $T$ 为起讫点的任何路径均非直径。

因为是树，所以设 $\mathit{path}(W,S),\mathit{path}(W,T)$ 的重合部分为 $\mathit{path}(W,M)$，那么 $M$ 一定存在于 $\mathit{path}(S,T)$ 上，$M$ 可以与 $S,T$ 重合，否则会产生环 $(M,S,T,M)$。也可以说成，连接结点 $W$ 与 $S,T$ 之间的子树的路径终点 $M$ 是唯一的，而从 $M$ 进入子树过后，在字数内是四通八达的。

那么我们先把 $W$ 和 $M$ 加入图中。

{% asset_img searchtwice-prove2.png '"" "搜两次 算法证明 2"' %}

同样的，设连接结点 $V$ 与 $S,T,W$ 之间的子树的路径终点为 $N$，加入图中。这里 $N$ 可能在 $\mathit{path}(S,M),\mathit{path}(T,M),\mathit{path}(W,M)$ 上。

{% asset_img searchtwice-prove3.png '"" "搜两次 算法证明 3"' %}

$1^\circ$ 若 $M$ 在 $N$ 在 $\mathit{path}(T,M)$ 上，如图 $(a)$

$\qquad\because\mathit{path}(W,V)$ 是直径而 $\mathit{path}(W,T)$ 非直径

$\qquad\therefore L_{\mathit{path}(W,V)}>L_{\mathit{path}(W,T)}$

$\qquad\therefore L_{\mathit{path}(N,V)}>L_{\mathit{path}(N,T)}$

$\qquad\therefore L_{\mathit{path}(S,V)}>L_{\mathit{path}(S,T)}$

$\qquad$ 这与 $T$ 是距离 $S$ 最远点不符，故假设不成立。

$2^\circ$ 若 $M$ 在 $N$ 在 $\mathit{path}(W,M)$ 上，如图 $(b)$

$\qquad\therefore L_{\mathit{path}(W,V)}>L_{\mathit{path}(W,T)}$

$\qquad\therefore L_{\mathit{path}(N,V)}>L_{\mathit{path}(N,T)}$

$\qquad\therefore L_{\mathit{path}(M,V)}>L_{\mathit{path}(M,T)}$

$\qquad\therefore L_{\mathit{path}(S,V)}>L_{\mathit{path}(S,T)}$

$\qquad$ 这与 $T$ 是距离 $S$ 最远点不符，故假设不成立。

$3^\circ$ 若 $M$ 在 $N$ 在 $\mathit{path}(S,M)$ 上，如图 $(c)$

$\qquad\therefore L_{\mathit{path}(W,V)}>L_{\mathit{path}(T,V)}$

$\qquad\therefore L_{\mathit{path}(W,M)}>L_{\mathit{path}(T,M)}$

$\qquad\therefore L_{\mathit{path}(S,W)}>L_{\mathit{path}(S,T)}$

$\qquad$ 这与 $T$ 是距离 $S$ 最远点不符，故假设不成立。

综上所述，假设不成立。

故 $T$ 一定是一条直径的一个端点。

接下来，以 $T$ 为其中一个端点的直径就呼之欲出了。

### 树形 DP

首先任意指定一个结点为整棵树的根结点，化无根树为有根树。

设 $f_i$ 为以结点 $i$ 为根的子树内最长路径的长度，$g_i$ 为以结点 $i$ 为根的子树内距离结点 $i$ 最远的结点与结点 $i$ 之间的路径长度。设结点 $i$ 的子结点集合为 $S_i$。

那么有

$$
\\begin{align}
  f_i&=\\max\\{\\max\\{f_j\\ |\\ j\\in S_i\\},\\max\\{g_j+w(i,j)\\ |\\ j\\in S_i\\}+\\max'\\{g_j+w(i,j)\\ |\\ j\\in S_i\\}\\}\\\\
  g_i&=\\max\\{g_i+w(i,j)\\ |\\ j\\in S_i\\}
\\end{align}
$$

其中，$\min'$ 指次小值。

---

另外，如果有两条及两条以上的直径，那么它们一定相交，且交点或重合的部分路径平分每一条直径，用反证法可证。

## 树的中心

圆的圆心是到圆上任意一点距离相等的点，也是到圆上所有点最大距离最小的点，树的中心也是到所有结点最大距离最小的结点。

首先明确，树的中心在直径上。用反证法可证，距离直径上的任意一结点最远和次远的结点是直径的两个端点，然后，若有结点 $A$，直径上与之距离最近的结点为 $B$，那么 $B$ 到所有结点最大距离，也就是 $B$ 到直径某个端点的距离，一定小于 $A$ 到直径某个端点的距离，因此 $A$ 不会是树的中心。故树的中心在直径上。

因此，可以走一遍直径的路径，顺带着得出答案。

另外，若树有多条直径，那么树的中心即为直径的交点或在直径的重合部分路径上。

## 树的重心

英语称为 Centroid of Tree 树的质心。

啊我们知道，如果在一个维度上有 $n$ 个质点，第 $i$ 个质点在该维度上的坐标为 $x_i$，质量为 $m_i$，那么这些质点的质心坐标为 $\dfrac{\sum\limits_{i=1}^nm_ix_i}{\sum\limits_{i=1}^nm_i}$。~~当然这并不重要。~~

物理学上物体的重心是重力的等效作用点，是满足杠杆两端力矩平衡的点，信息学上树的中心也是尽量满足各方向结点数量或权值和平衡的结点，定义为删去该结点后最大的连通块最小的结点。

我们看，将无根树指定根转化为有根树后，删除一个结点所得到的的连通块的大小如何快速计算。删除一个结点，我们得到的连通块是该结点的所有子树各为一个连通块，还有除开以该结点为根的子树外的所有结点为一个连通块。那则就好计算了，只需要对每个结点计算出子树的大小即可。

$$
\\begin{align}
  & \\text{FIND-CENTROID}(x) \\\\
  & \\begin{array}{rl}
      1 &  \\mathit{Max} = 0 \\\\
      2 &  \\mathit{sz}_x = 1 \\\\
      3 &  \\textbf{for } i \\in S_x \\\\
      4 &  \\qquad \\text{FIND-CENTROID}(i) \\\\
      5 &  \\qquad \\mathit{Max} = \\max\\{\\mathit{Max},\\mathit{sz}_i\\} \\\\
      6 &  \\qquad \\mathit{sz}_x = \\mathit{sz}_x + \\mathit{sz}_i \\\\
      7 &  \\mathit{Ans} = \\min\\{Ans,\\max\\{\\mathit{Max},n-sz_x\\}\\}
    \\end{array}
\\end{align}
$$

## 总结

纵贯圆的，是直径，纵贯树的，是直径。

平衡物的，是重心，平衡树的，是重心。

藏匿在树里的，是圆的规则，是物的时空。
