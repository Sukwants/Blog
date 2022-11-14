---
title: 平衡树 - Treap
tags:
  - '[I] 二叉查找树 / 平衡树'
  - '[I] 堆'
categories:
  - Informatics
  - Notes
date: 2022-10-30 15:32:22
---


左与右，父与子

<!--more-->

## 思想的绽放

Treap 是一种平衡树，除了满足二叉查找树的性质意外，我们给它随机生成一个第二元，其满足堆的性质。这样，第一元满足二叉查找树的性质来限制左右关系，第二元满足堆的性质来限制父子关系，二者互不干扰，构成了 Tree-Heap 即 Treap。

因为第二元我们是随机生成的，因此 Treap 的期望高度是 $\log n$ 的。

Treap 有两种，旋转 Treap 和无旋 Treap。

## 父子的错位

——旋转 Treap

旋转 Treap 基于旋转操作。

### 插入

通过二叉查找树的插入方式插入元素过后，不断比较新增元素与其父结点的第二元大小关系，并通过旋转调整二者位置。

{% contentbox type:note title:参考代码 open %}
```cpp
void insert(int x)
{
    if (!ch[0][0]) return ch[0][0] = new_node(x, 0), void();
    int idx = ch[0][0];
    while (ch[idx][x > dt[idx]]) idx = ch[idx][x > dt[idx]];
    ch[idx][x > dt[idx]] = new_node(x, idx);
    idx = ch[idx][x > dt[idx]];
    while (fa[idx] && ky[fa[idx]] > ky[idx]) rotate(idx);
    pushup(fa[idx]);
}
```
{% endcontentbox %}

### 删除

比较结点的两个子结点，判断应该哪一个来作父结点，将当前节点转下去，直到转到没有儿子的时候，直接删除。

{% contentbox type:note title:参考代码 open %}
```cpp
void erase(int x)
{
    int idx = ch[0][0];
    while (dt[idx] != x) idx = ch[idx][x > dt[idx]];
    while (ch[idx][0] && ch[idx][1]) rotate(ky[ch[idx][0]] < ky[ch[idx][1]] ? ch[idx][0] : ch[idx][1]);
    if (ch[idx][0]) fa[ch[idx][0]] = fa[idx], ch[fa[idx]][idx == ch[fa[idx]][1]] = ch[idx][0];
    else fa[ch[idx][1]] = fa[idx], ch[fa[idx]][idx == ch[fa[idx]][1]] = ch[idx][1];
    pushup(fa[idx]);
}
```
{% endcontentbox %}

## 纠缠的分合

——无旋 Treap

无旋 Treap 基于分裂与合并操作

### 分裂

将 Treap 分裂为 $<x$ 和 $\geq x$ 的两棵 Treap。具体地，我们判断当前根应该属于划分到哪一棵子树内，如果应该划分到 $<x$ 的子树内，则其左子树一定划分到 $<x$ 的子树内，此时我们递归分裂右子树，将根节点的右儿子设为右子树分裂出来的 $<x$ 的部分。反之亦然。

{% contentbox type:note title:参考代码 open %}
```cpp
pair<int, int> split(int rt, int x) // Split the Treap into two parts: <x >=x
{
    if (!rt) return make_pair(0, 0);
    if (dt[rt] < x)
    {
        pair<int, int> res = split(ch[rt][1], x);
        ch[rt][1] = res.first;
        sz[rt] = sz[ch[rt][0]] + sz[ch[rt][1]] + 1;
        return make_pair(rt, res.second);
    }
    else
    {
        pair<int, int> res = split(ch[rt][0], x);
        ch[rt][0] = res.second;
        sz[rt] = sz[ch[rt][0]] + sz[ch[rt][1]] + 1;
        return make_pair(res.first, rt);
    }
}
```
{% endcontentbox %}

### 合并

合并操作需要两棵 Treap 的值域互不相交

比较待合并的两棵 Treap 的根结点，判断应该谁来作父结点，假如第一元较小的 Treap 的根节点 $x$ 作父亲，则 $x$ 的左儿子不变，右儿子设为原右儿子与另一棵 Treap 递归合并的结果。

{% contentbox type:note title:参考代码 open %}
```cpp
int merge(int x, int y)
{
    if (!x || !y) return x + y;
    if (ky[x] < ky[y])
    {
        ch[x][1] = merge(ch[x][1], y);
        sz[x] = sz[ch[x][0]] + sz[ch[x][1]] + 1;
        return x;
    }
    else
    {
        ch[y][0] = merge(x, ch[y][0]);
        sz[y] = sz[ch[y][0]] + sz[ch[y][1]] + 1;
        return y;
    }
}
```
{% endcontentbox %}

### 插入

按 $x$ 分裂 Treap，将新增元素与其中一棵合并，再合并这两棵 Treap。

{% contentbox type:note title:参考代码 open %}
```cpp
void insert(int x)
{
    int idx = new_node(x);
    pair<int, int> res = split(root, x);
    root = merge(merge(res.first, idx), res.second); 
}
```
{% endcontentbox %}

### 删除

两次分裂，分裂出三棵 Treap（$<x,=x,>x$），合并 $=x$ Treap 的两棵子树代替原 Treap，即删除了一个 $x$，再合并这三棵 Treap。

{% contentbox type:note title:参考代码 open %}
```cpp
void erase(int x)
{
    pair<int, int> res = split(root, x);
    pair<int, int> rres = split(res.second, x + 1);
    root = merge(res.first, merge(merge(ch[rres.first][0], ch[rres.first][1]), rres.second)); 
}
```
{% endcontentbox %}

### 查询指定树的排名

分裂 Treap，查询 $<x$ 的 Treap 的大小。

{% contentbox type:note title:参考代码 open %}
```cpp
int rank(int x)
{
    pair<int, int> res = split(root, x);
    int ans = sz[res.first] + 1;
    root = merge(res.first, res.second);
    return ans;
}
```
{% endcontentbox %}

## 文艺的书卷

旋转 Treap 不能实现区间操作，但是无旋 Treap 可以。我们按排名分裂出需要区间修改的区间，打上 Lazy Tag。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <utility>
#include <algorithm>

using namespace std;

const int MAXN = 1e5;

class Treap_Literary
{
private:
    int root, ky[MAXN + 5], ch[MAXN + 5][2], sz[MAXN + 5], tag[MAXN + 5];
    void pushdown(int x)
    {
        if (tag[x]) swap(ch[x][0], ch[x][1]);
        tag[ch[x][0]] ^= tag[x];
        tag[ch[x][1]] ^= tag[x];
        tag[x] = 0;
    }
    pair<int, int> split(int rt, int x)
    {
        if (!rt) return make_pair(0, 0);
        pushdown(rt);
        if (sz[ch[rt][0]] + 1 <= x)
        {
            pair<int, int> res = split(ch[rt][1], x - sz[ch[rt][0]] - 1);
            ch[rt][1] = res.first;
            sz[rt] = sz[ch[rt][0]] + sz[ch[rt][1]] + 1;
            return make_pair(rt, res.second);
        }
        else
        {
            pair<int, int> res = split(ch[rt][0], x);
            ch[rt][0] = res.second;
            sz[rt] = sz[ch[rt][0]] + sz[ch[rt][1]] + 1;
            return make_pair(res.first, rt);
        }
    }
    int merge(int x, int y)
    {
        if (!x || !y) return x + y;
        if (ky[x] < ky[y])
        {
            pushdown(x);
            ch[x][1] = merge(ch[x][1], y);
            sz[x] = sz[ch[x][0]] + sz[ch[x][1]] + 1;
            return x;
        }
        else
        {
            pushdown(y);
            ch[y][0] = merge(x, ch[y][0]);
            sz[y] = sz[ch[y][0]] + sz[ch[y][1]] + 1;
            return y;
        }
    }
    int build(int l, int r, int dep)
    {
        if (l > r) return 0;
        int mid = l + r >> 1;
        ky[mid] = dep;
        sz[mid] = sz[ch[mid][0] = build(l, mid - 1, dep + 1)] + sz[ch[mid][1] = build(mid + 1, r, dep + 1)] + 1;
        tag[mid] = 0;
        return mid;
    }
    void print(int x)
    {
        if (!x) return;
        pushdown(x);
        print(ch[x][0]);
        printf("%d ", x);
        print(ch[x][1]);
    }
public:
    void build(int n) { root = build(1, n, 0); }
    void reverse(int l, int r)
    {
        if (l > r) return;
        pair<int, int> res = split(root, l - 1);
        pair<int, int> rres = split(res.second, r - l + 1);
        tag[rres.first] ^= 1;
        root = merge(res.first, merge(rres.first, rres.second));
    }
    void print() { print(root); }
} lbt;

int n, m, l, r;

int main()
{
    scanf("%d%d", &n, &m);
    lbt.build(n);
    for (int i = 1; i <= m; i++)
    {
        scanf("%d%d", &l, &r);
        lbt.reverse(l, r);
    }
    lbt.print();
    return 0;
}
```
{% endcontentbox %}

## 花香的肆放

以树之名，限定左右；

以堆之名，限定父子。

Treap 之音，化为平凡。
