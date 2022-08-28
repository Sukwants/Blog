---
title: 数学 - 数论 - 同余
tags:
  - '[I] 数学'
  - '[I] 同余'
categories:
  - Informatics
  - Notes
date: 2022-08-28 17:54:55
---


数论的守望

<!--more-->

## 同余

若 $a\bmod m=b\bmod m$，则称 $a,b$ 关于 $m$ 同余，或者 $a$ 同余于 $b$ 模 $m$。记作 $a\equiv b\pmod m$。

易证，同余方程具有可加性、可减性、可乘性，即模 $p$ 意义下我们能够做加、减、乘法。

## 同余类与剩余系

所有模 $n$ 同余的数构成一个同余类。集合 $\\{\ldots,a-2n,a-n,a,a+n,a+2n,\ldots\\}$ 为模 $n$ 的一个同余类，记作 $\overline a$，$a$ 被称为该同余类的代表数，显然，同余类中每个数都可以作为代表数。模 $n$ 的同余类一共有 $n$ 个，分别是 $\overline0,\overline1,\ldots,\overline{n-1}$。

完全剩余系指的是模 $n$ 的所有同余类的代表数的集合，剩余系中两两模 $n$ 不等。所有同余类都以最小非负整数代表的完全剩余系被称为最小剩余系。完全剩余系中与 $n$ 互质的代表数组成的集合被称为简化剩余系，同理最小简化剩余系，可以证明同一同余类中所有数与模数 $n$ 是否互质是统一的。

## 费马小定理

### 定理

若 $p$ 为质数且 $\gcd(a,p)=1$，则 $a^{p-1}\equiv1\pmod p$。

另一种形式，若 $p$ 为质数，对于任意整数 $a$，$a^p\equiv a\pmod p$。

### 证明

首先，若 $\gcd(c,m)=1$，则 $a\cdot c\equiv b\cdot c\pmod m\implies a\equiv b\pmod m$。

证明：$\because a\cdot c\equiv b\cdot c\pmod m$，$\therefore (a-b)\cdot c\equiv 0\pmod m$，又 $\because \gcd(c,m)=1$ 即 $c\not\equiv 0\pmod m$，$\therefore a-b\equiv 0\pmod m$ 即 $a\equiv b\pmod m$。

由此可得，若 $\\{a_1,a_2,\ldots,a_m\\}$ 构成 $m$ 的一个完全剩余系，$\gcd(c,m)=1$，则 $\\{a_1\cdot c,a_2\cdot c,\ldots,a_m\cdot c\\}$ 也构成 $m$ 的一个完全剩余系。

因此，若有数列 $$