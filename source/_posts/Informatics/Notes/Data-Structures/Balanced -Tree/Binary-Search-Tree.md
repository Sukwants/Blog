---
title: 平衡树 - 二叉查找树
tags:
  - '[I] 平衡树'
categories:
  - Informatics
  - Notes
date: 2022-10-30 15:30:29
---


是树合成了序列，还是序列断成了树

<!--more-->

## 介绍

二叉查找树，英语为 Binary Search Tree，又名二叉搜索树、二叉排序树。是这样的一棵二叉树，其左子树内所有结点的值均小于（等于）根节点，右子树内所有结点的值均大于（等于）根节点，且左右子树各为一棵二叉查找树。显而易见的是，这棵树的中序遍历结果即为一个有序数列。

这样的树，一般用来维护无序数集。

## 基本操作

### 插入

```cpp
void insert(int x)
{
    if (!ch[0][0])
    {
        ch[0][0] = ++cnt;
        d[cnt] = x;
        fa[cnt] = 0;
        sz[cnt] = 1;
        return;
    }
    
    int idx = ch[0][0];
    while (1)
    {
        int sel = x > d[idx];
        if (!ch[idx][sel])
        {
            ch[idx][sel] = ++cnt;
            d[cnt] = x;
            fa[cnt] = idx;
            pushup(cnt);
            break;
        }
        idx = ch[idx][sel];
    }
}
```

### 删除

```cpp
void erase(int x)
{
    int idx = ch[0][0];
    while (d[idx] != x)
    {
        if (d[idx] > x) idx = ch[idx][0];
        else idx = ch[idx][1];
    }
    
    if (!ch[idx][0] && !ch[idx][1])
    {
        ch[fa[idx]][idx == ch[fa[idx]][1]] = 0;
        pushup(fa[idx]);
    }
    else if (!ch[idx][0])
    {
        fa[ch[idx][1]] = fa[idx];
        ch[fa[idx]][idx == ch[fa[idx]][1]] = ch[idx][1];
        pushup(fa[idx]);
    }
    else if(!ch[idx][1])
    {
        fa[ch[idx][0]] = fa[idx];
        ch[fa[idx]][idx == ch[fa[idx]][1]] = ch[idx][0];
        pushup(fa[idx]);
    }
    else
    {
        int idxx = ch[idx][0];
        while (ch[idxx][1]) idxx = ch[idxx][1];

        d[idx] = d[idxx];
        ch[fa[idxx]][idxx == ch[fa[idxx]][1]] = ch[idxx][0];
        fa[ch[idxx][0]] = fa[idxx];
        fa[0] = 0;
        pushup(fa[idxx]);
    }
}
```

### 查询指定数的排名

```cpp
int rank(int x)
{
    int ans = 0, idx = ch[0][0];
    while (1)
    {
        if (d[idx] >= x)
        {
            if (!ch[idx][0]) return ans + 1;
            else idx = ch[idx][0];
        }
        else
        {
            if (!ch[idx][1]) return ans + sz[ch[idx][0]] + 2;
            else ans += sz[ch[idx][0]] + 1, idx = ch[idx][1];
        }
    }
}
```

### 查询指定排名的数

```cpp
int at(int x)
{
    int idx = ch[0][0];
    while (x)
    {
        if (sz[ch[idx][0]] >= x) idx = ch[idx][0];
        else if (sz[ch[idx][0]] + 1 == x) return d[idx];
        else x -= sz[ch[idx][0]] + 1, idx = ch[idx][1];
    }
}
```

### 查询前驱

```cpp
int pre(int x)
{
    int ans = -1, idx = ch[0][0];
    while (1)
    {
        if (d[idx] >= x)
        {
            if (!ch[idx][0]) return ans;
            else idx = ch[idx][0];
        }
        else
        {
            if (!ch[idx][1]) return d[idx];
            else ans = d[idx], idx = ch[idx][1];
        }
    }
}
```

### 查询后继

```cpp
int suc(int x)
{
    int ans = -1, idx = ch[0][0];
    while (1)
    {
        if (d[idx] > x)
        {
            if (!ch[idx][0]) return d[idx];
            else ans = d[idx], idx = ch[idx][0];
        }
        else
        {
            if (!ch[idx][1]) return ans;
            else idx = ch[idx][1];
        }
    }
}
```

## 树排序

树排序即，将元素依次插入二叉查找树，最后中序遍历输出。树排序是稳定的排序。

当然，朴素二叉查找树是不行的，我们需要平衡树。

## 旋转操作

对于确定的数集，二叉查找树的形态不一定确定。在 Treap 和 Splay 等平衡树中，我们会用到旋转操作来改变二叉查找树的形态。有时候会将旋转操作分为左旋和右旋，我们这里统一为，将一个结点旋转到它父结点的位置上。

{% asset_img rotate.png '"" "旋转"' %}

```cpp
void rotate(int x)
{
    int y = fa[x];
    int z = fa[y];
    int sel = x == ch[y][1];
    int w = ch[x][sel ^ 1];

    fa[y] = x;
    ch[x][sel ^ 1] = y;

    fa[x] = z;
    ch[z][y == ch[z][1]] = x;

    fa[w] = y;
    ch[y][sel] = w;

    sz[y] = sz[ch[y][0]] + sz[ch[y][1]] + 1;
    sz[x] = sz[ch[x][0]] + sz[ch[x][1]] + 1;
}
```

## 平衡树

在某种特定情况下，二叉查找树会退化成一条链，被卡到 $O(n^2)$，我们为了使它保持「平衡」，让时间复杂度保持在 $O(n\log n)$ 的水平，发明了种种平衡树。

![【模板】普通平衡树](https://loj.ac/p/104)

![【模板】文艺平衡树](https://loj.ac/p/105)

![【模板】二逼平衡树](https://loj.ac/p/106)

## 总结

究竟是树合成了序列，还是序列断成了树？

树将序列分成两段，而序列将树重新连接。分治成树，而合并成序列。

这是对立，亦是统一。
