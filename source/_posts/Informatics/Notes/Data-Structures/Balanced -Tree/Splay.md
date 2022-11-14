---
title: 平衡树 - Splay
tags:
  - '[I] 二叉查找树 / 平衡树'
categories:
  - Informatics
  - Notes
date: 2022-10-30 16:02:56
---


> 在信息之海中，它能越旋转越鲜活（NOI 2022 PV 《什么是信息学精神》）

<!--more-->

## 转时相遇

Splay，又名伸展树，是由计算机科学家 Sleator 和 Tarjan（没错，又是他）与 1985 年发明的。其基本思想，在于**每一次操作过后将操作的结点旋转到根结点**。在每一次的旋转中，它「越旋转越鲜活」。

## 转在纷繁

Splay 基于 Splay 操作，一次 Splay 操作的目标是将 $x$ 转为 $k$ 的儿子。

### Splay

Splay 要求，一次旋转两级，如果当前结点与父结点作为儿子的属性相同，则先旋转父结点，再旋转 $x$；否则，旋转两次 $x$。别问，问就是玄学。

{% contentbox type:note title:参考代码 open %}
```cpp
void splay(int x, int k)
{
    while (fa[x] != k)
    {
        if (fa[fa[x]] == k) rotate(x);
        else if ((x == ch[fa[x]][1]) == (fa[x] == ch[fa[fa[x]]][1])) rotate(fa[x]), rotate(x);
        else rotate(x), rotate(x);
    }
}
```
{% endcontentbox %}

### 插入

通过二叉查找树的插入方式，插入过后将新增结点转到根节点。

{% contentbox type:note title:参考代码 open %}
```cpp
void insert(int x)
{
    if (!ch[0][0]) return ch[0][0] = new_node(x ,0), void();
    int idx = ch[0][0];
    while (ch[idx][x > dt[idx]]) idx = ch[idx][x > dt[idx]];
    ch[idx][x > dt[idx]] = new_node(x, idx);
    splay(ch[idx][x > dt[idx]], 0);
}
```
{% endcontentbox %}

### 删除

将待删除结点转到根结点，合并两棵子树。

合并的做法是，将左子树的最大结点转到左子树的根节点，并将其右儿子设为右子树，最后将该结点设为 Splay 的根结点。

{% contentbox type:note title:参考代码 open %}
```cpp
void erase(int x)
{
    int idx = ch[0][0];
    while (dt[idx] != x) idx = ch[idx][x > dt[idx]];
    splay(idx, 0);
    if (!ch[idx][0] && !ch[idx][1]) ch[0][0] = 0;
    else if (!ch[idx][0]) fa[ch[idx][1]] = 0, ch[0][0] = ch[idx][1];
    else
    {
        int idxx = ch[idx][0];
        while (ch[idxx][1]) idxx = ch[idxx][1];
        splay(idxx, idx);
        fa[idxx] = 0;
        ch[0][0] = idxx;
        fa[ch[idx][1]] = idxx;
        ch[idxx][1] = ch[idx][1];
        sz[idxx] = sz[ch[idxx][0]] + sz[ch[idxx][1]] + 1;
    }
}
```
{% endcontentbox %}

### 查询指定数的排名

将对应结点转到根结点，查询左子树大小。

{% contentbox type:note title:参考代码 open %}
```cpp
int rank(int x)
{
    if (!ch[0][0]) return 1;
    int idx = ch[0][0];
    while (ch[idx][x > dt[idx]]) idx = ch[idx][x > dt[idx]];
    splay(idx, 0);
    return sz[ch[idx][0]] + (dt[idx] < x) + 1;
}
```
{% endcontentbox %}

## 转出翻转

Splay 实现文艺平衡树的操作是，将区间的前驱转到根结点，后继转到根结点的右儿子，那么根结点右儿子的左子树即为这个区间，打上 Lazy Tag。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <algorithm>

using namespace std;

const int MAXN = 1e5;

class Splay_Literary
{
private:
    int dt[MAXN + 5], fa[MAXN + 5], ch[MAXN + 5][2], sz[MAXN + 5], tag[MAXN + 5], tot = 0;
    void pushdown(int x)
    {
        if (tag[x]) swap(ch[x][0], ch[x][1]);
        tag[ch[x][0]] ^= tag[x];
        tag[ch[x][1]] ^= tag[x];
        tag[x] = 0;
    }
    void rotate(int x)
    {
        int y = fa[x];
        int z = fa[y];
        int sel = x == ch[y][1];
        int w = ch[x][sel ^ 1];

        pushdown(y);
        pushdown(x);
        
        fa[x] = z;
        ch[z][y == ch[z][1]] = x;
        
        fa[y] = x;
        ch[x][sel ^ 1] = y;

        fa[w] = y;
        ch[y][sel] = w;

        sz[y] = sz[ch[y][0]] + sz[ch[y][1]] + 1;
        sz[x] = sz[ch[x][0]] + sz[ch[x][1]] + 1;
    }
    void splay(int x, int k)
    {
        while (fa[x] != k)
        {
            if (fa[fa[x]] == k) rotate(x);
            else if ((x == ch[fa[x]][1]) == (fa[x] == ch[fa[fa[x]]][1])) rotate(fa[x]), rotate(x);
            else rotate(x), rotate(x);
        }
    }
    int build(int l, int r, int f)
    {
        if (l > r) return 0;
        int mid = l + r >> 1, k = ++tot;
        dt[k] = mid;
        fa[k] = f;
        sz[k] = sz[ch[k][0] = build(l, mid - 1, k)] + sz[ch[k][1] = build(mid + 1, r, k)] + 1;
        tag[k] = 0;
        return k;
    }
    void get(int x, int k)
    {
        int idx = ch[0][0];
        while (pushdown(idx), sz[ch[idx][0]] + 1 != x)
            if (x < sz[ch[idx][0]] + 1) idx = ch[idx][0];
            else x -= sz[ch[idx][0]] + 1, idx = ch[idx][1];
        splay(idx, k);
    }
    void print(int n, int id, int rk)
    {
        if (!id) return;
        pushdown(id);
        print(n, ch[id][0], rk);
        if (dt[id] >= 1 && dt[id] <= n) printf("%d ", dt[id]);
        print(n, ch[id][1], rk + sz[ch[id][0]] + 1);
    }
public:
    void build(int n) { ch[0][0] = build(0, n + 1, 0); }
    void reverse(int l, int r)
    {
        get(l, 0);
        get(r + 2, ch[0][0]);
        tag[ch[ch[ch[0][0]][1]][0]] ^= 1;
    }
    void print(int n) { print(n, ch[0][0], 0); }
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
    lbt.print(n);
    return 0;
}
```
{% endcontentbox %}

## 转至宁静

Splay 之音，在旋转，在永不止息地旋转。

人生之义，亦在旋转，在永不止息地旋转。
