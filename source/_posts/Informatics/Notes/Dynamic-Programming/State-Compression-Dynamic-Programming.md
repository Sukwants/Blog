---
title: 动态规划 - 状态压缩动态规划
tags:
  - '动态规划'
categories:
  - Informatics
  - Notes
date: 2022-07-01 20:27:55
---


几近搜索量级的**巨**大状态转移

<!--more-->

## 逻辑运算与位运算

以下属于漫无边际的大发议论，可以直接跳到[位运算](#importantbegins)。

众所周知，计算机的底层是逻辑电路。而根据初中知识，我们知道以下两种电路：

{% asset_img seriesparallel.png '"" "串联和并联"' %}

这里我们用 $1$ 表示开关闭合，用 $0$ 表示开关断开。记第一个开关的状态为 $f_1\\in\\{0,1\\}$，第二个开关的状态为 $f_2\\in\\{0,1\\}$，另外两个开关总的作用效果可以用一个开关替代（等效替代法），我们记它的状态为 $f\\in\\{0,1\\}$。

那么在串联电路中，当且仅当 $f_1=1$ 且 $f_2=1$ 时，有 $f=1$，否则 $f=0$；在并联电路中，当且仅当 $f_1=0$ 且 $f_2=0$ 时，有 $f=0$，否则 $f=1$。

在数学上，我们将类似上述串联电路的运算称为**逻辑与运算**，符号为 $\\land$；类似上述并联电路的运算称为**逻辑或运算**，符号为 $\\lor$。二者均属于**逻辑运算**，又称布尔运算。逻辑运算的运算元和结果均为 $0$ 或 $1$。

于是在串联电路中满足 $f=f_1\\land f_2$，在并联电路中满足 $f=f_1\\lor f_2$。

同样属于逻辑运算的还有**逻辑非**（$\\lnot$），**逻辑异或**（$\\oplus$），**逻辑同或**（$\\odot$）。$\\lnot$ 是单元运算符，有 $x=1\\Rightarrow \\lnot x=0,x=0\\Rightarrow \\lnot x=1$；$\\oplus$ 是双元运算符，对于两个运算元 $x\\in\\{0,1\\},y\\in\\{0,1\\}$，有 $x=y\\Rightarrow x\\oplus y=0,x\\neq y\\Rightarrow x\\oplus y=1$；$x\\odot y=\\lnot(x\\oplus y)$。

在 C++ 里，$\\land$ 可以用关键字 **``and``** 和运算符 ``&&``，$\\lor$ 可以用关键字 **``or``** 和运算符 ``||``，$\\lnot$ 可以用关键字 **``not``** 和运算符 ``!``，$\\oplus$ 可以用按位异或的 **``xor``** 和 ``^``。

在计算机里，$0$ 和 $1$ 只能表示 1 位二进制数，称为 1 位~~（不是废话）~~（$\\mathrm{bit}$)。而我们将 8 位 $0$ 和 $1$ 打包，可以表示 8 位二进制数，称为 1 字节（$\\mathrm{byte,B}$）。因此 $1\\ \\mathrm{byte}=8\\ \\mathrm{bit}$。在 $\\mathrm{byte}$ 之上还有 $\\mathrm{kilobyte,KB}$、$\\mathrm{megabyte,MB}$、$\\mathrm{gigabyte,GB}$、$\\mathrm{terabyte,TB}$。

而多个字节组合，就可以作为计算机的基本数据类型。如 $1\\ \\mathrm{B}$ 的 ``char``、``bool``，$2\\ \\mathrm{B}$ 的 ``(unsigned) short [int]`` （无符号）短整型，$4\\ \\mathrm{B}$ 的 ``(unsigned) long [int]`` （无符号）长整型，$8\\ \\mathrm{B}$ 的 ``(unsigned) long long [int]``。

``int`` 类型在 C++ 标准中仅仅规定了位数不低于 16 位，因此将其与 32 位整型 ``long int`` 划等号是不严谨的，但在大多数现代计算机上 ``int`` 确实是 32 位整型，我们也经常这样用。

无符号整数的存储方式很简单，就是将整数转换为二进制形式存储。对于有符号整数，我们把最高位作为符号位，0 表示正数，1 表示负数，剩下位为数值位，但这样不利于加减运算，于是智慧的前人创造了反码和补码。正数的反码、补码与原码相同。对于负数，在原码的基础上，除符号位不变，其余各位取反，就成了反码；给反码在抛开符号位特殊意义的基础上加 1，就成了补码。计算机中的有符号整数都是以补码的形式存储的，这样既能够解决加减法的不方便，又能够解决 +0 和 -0 在原码和反码下存在 2 种不同形式的问题。

因此 32 位有符号整型的范围为 $-2^{31} \sim 2^{31}-1$，64 位有符号整型的范围为……

视线回到逻辑运算，聪明的你可能已经发现

$$
\\begin{align}
  & 0 \\oplus 0 = 0, && 0 \\oplus 1 = 1, && 1 \\oplus 0 = 1, && 1 \\oplus 1 = \\ \\ 0 \\\\
  & 0 + 0 = 0, && 0 + 1 = 1, && 1 + 0 = 1, && 1 + 1 = 10_{(2)}
\\end{align}
$$

逻辑异或就是「不进位的加法」。事实上，逻辑异或也是「不进位的减法」。

而再看

$$
\\begin{align}
  & 0 \\land 0 = 0, && 0 \\land 1 = 0, && 1 \\land 0 = 0, && 1 \\land 1 = 1\\\\
  & 0 + 0 = 00, && 0 + 1 = 01, && 1 + 0 = 01, && 1 + 1 = 10_{(2)}
\\end{align}
$$

逻辑与也可以看作是加法的进位。

这样，计算机就学会了加法，进而学会了减法、乘法、除法……

<span id="importantbegins"></span>

接下来我们进入到了位运算~~，真正对 OI 学习有帮助的部分~~。

位运算是一个非常底层的操作，是对数据的存储形式进行直接操作，由其名字就可以知道这是按位进行操作的一种运算。因为如此底层，所以如此快速。

  - 按位与（``&``），对数据的每一位进行逻辑与运算，如 $01010101_{(2)} \\ \\& \\ 11110000_{(2)} = 01010000_{(2)}$。
  - 按位或（``|``），对数据的每一位进行逻辑或运算，如 $01010101_{(2)} \\ | \\ 11110000_{(2)} = 11110101_{(2)}$。
  - 按位取反（``~``），对数据的每一位取反，如 $\\sim01010101_{(2)} = 10101010_{(2)}$。
  - 按位异或（``^``），对数据的每一位进行逻辑异或运算，如 ${01010101_{(2)}}\\ ^\\wedge \\ 11110000_{(2)} = 10100101_{(2)}$。
  - 按位左移（``<<``），将数据的每一位向左移动，高位舍弃，低位用 0 补齐，如 $01010101_{(2)} << 3 = 10101000_{(2)}$，$11110000_{(2)} << 3 = 10000000_{(2)}$。
  - 按位右移（``>>``）（算术右移），将数据的每一位向右移动，低位舍弃，高位用符号位补齐，如 $01010101_{(2)} >> 3 = 00001010_{(2)}$，$11110000_{(2)} >> 3 = 11111110_{(2)}$。

这里的每一位指的是数据类型存储的每一位，包含前导 0。还需要注意的是，位运算由于过于底层，是直接对二进制补码进行操作，并不考虑符号位和数值位的区别（按位右移除外）。

由以上定义可以得出位运算的一些性质：

  - $x \\ \\& \\ y = y \\ \\& \\ x,x \\ | \\ y = y \\ | \\ x,x \\ ^\\wedge \\ y = y \\ ^\\wedge \\ x$
  - $\\forall x \\in \\mathbb{N}_+,-x=\\sim x-1$
  - $x \\ ^\\wedge \\ y = z \\Rightarrow z \\ ^\\wedge \\ y = x$
  - $x << 1 = 2x$（在不超过数据类型存储范围的情况下）
  - $x >> 1 = \\left \\lfloor \\frac{x}{2} \\right \\rfloor $
  - ……

通常情况下，我们在 $[0,2^{n})$ 的范围内运算，其中 $n$ 不足 31，此时大可不必考虑溢出到符号位的情况。

## 状态压缩

试想，通过位运算的强大，我们可以干些什么？数据不再仅仅是一个数，它可以用作存储 $N$ 个一位二进制数。当一个数不再属于它自己，便诞生了状态压缩，数据的每一位都被赋予了新的使命，背负着新的时代责任。

## T 互不侵犯

题目来源：SCOI 2005
评测链接：<https://www.luogu.com.cn/problem/P1896>

在 N × N 的棋盘里面放 K 个国王，使他们互不攻击，共有多少种摆放方案。国王能攻击到它上下左右，以及左上左下右上右下八个方向上附近的各一个格子，共 8 个格子。

<br>

走过了战火纷飞，才会懂得和平的弥足珍贵。当今世界人类是一个命运共同体，又因何冲突不断，和平不续？

为了走独立自主的和平外交道路，和平共处五项原则显得尤为重要，当然不是下面这个

<div style="width:50%;margin:auto">
  {% asset_img 5principles.jpg '"" "和平共处五项原则"' %}
</div>

<center>图源：<a target="_blank" rel="noopener" href="https://song-gan.github.io/">@Ganshin</a></center>

为了倡导一带一路建设，推动构建人类命运共同体，弘扬 OIer 核心价值观，我们建立了区域全面最优子结构战略伙伴关系。由于 N <= 9，我们完全可以将一行内的国王的状态压缩到一个 int 里去，在互不侵犯领土的情况下抱团取暖，一致对外。这种情况下，行间和平共处也可以有位运算的强大保障来考验。

具体来说，用 $1$ 表示有国王，用 $0$ 表示无国王，接下来用一个 int 的每一位代表一行内一个位置有无国王的状态。比如，我们在某一行（共 $8$ 格）的第 $1$ 格、第 $4$ 格和第 $8$ 格放置了国王，那么这一行的状态就可以表示为 $10010001$，作为二进制形式存到一个 int 里。

你大概能够迅速反应过来，一行内「和平共处」，当且仅当这一行的状态表示为 $x$ 满足 $x \ \\& \ (x << 1) = 0$。

那么行间「和平共处」，当且仅当这两行的状态表示为 $x,y$ 满足 $x \ \\& \ y = 0 \land x \ \\& \ (y << 1) \land x \ \\& \ (y >> 1)$。

状态压缩的目的，就是为了能够用 1 个整型表示出状态，而「状态」在动态规划里的含义也十分明确，无非就是 ``f`` 数组的一个或几个下标。

整型变量再怎么说也只是 32 位的，顶多能压缩 32 个 0/1 值，但这足够了。我们将一行压缩，同时行间作为阶段进行转移。我们已经能够快速判断一行或行间是否合法，那么转移就只需要 $\mathrm{O}(1)$ 的时间复杂度。

具体在这道题里，我们用 $f_{i,j}$ 表示当第 $i$ 行的状态表示为 $j$ 时，前 $i$ 行的总方案数。那么转移条件为 $j$、$k$ 合法、并且 $j$、$k$ 之间能够「和平共处」，转移就是简简单单的加法。

状态转移方程可以写成

$$
f_{i,j}=\sum_{k\ |\ p(k,j)}f_{i-1,k}
$$

其中，$p(k,j)$ 为 $k$、$j$ 均合法且可相邻的条件。

考虑边界条件，第 $1$ 行不用考虑行间冲突，只要是行内合法的方案均可。不与任何行冲突的状态取 $0$，因此可以让 $f_{0,0}=1$，让第 $1$ 行的所有合法方案均有方案数 $1$。

扫描状态的方法，只用将 $[0,1<<n)$ 的所有整数扫描一遍即可。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cmath>

int n, k;
long long f[10][100][600];

int bits(int x)
{
    if (!x) return 0;
    return bits(x - (x & -x)) + 1;
}

int main()
{
    scanf("%d%d", &n, &k);
    int _2n = pow(2, n);
    f[0][0][0] = 1;

    for (int i = 1; i <= n; ++i)
    {
        for (int j = 0; j <= k; ++j)
        {
            for (int a = 0; a < _2n; ++a)
            {
                if (bits(a) <= j && !(a & (a << 1)))
                {
                    for (int b = 0; b < _2n; ++b)
                    {
                        if (!(a & b) && !(a & (b << 1)) && !(a & (b >> 1)) && !(b & (b << 1)) && bits(a) + bits(b) <= j)
                        {
                            f[i][j][a] += f[i - 1][j - bits(a)][b];
                        }
                    }
                }
            }
        }
    }

    long long Ans = 0;
    for (int i = 0; i < _2n; ++i)
        Ans += f[n][k][i];
    printf("%lld", Ans);

    return 0;
}
```
{% endcontentbox %}

通过一道题的做题经验我们就可以发现，状压 DP 需要扫描每一行的所有合法方案，虽然有的时候可以预处理，但是这种类似于排列组合的枚举方法都已经接近搜索了。

更何况所有合法方案都是 ``f`` 数组的一个下标，所以 ``f`` 数组会开得很大。并且因为枚举过程的巨大贡献，时间复杂度为 $\mathrm{O}(2^nn)$。因此状压 DP 的题 $n$ 不可能很大，一不小心不是 <font style="color:blue">TLE</font> 就会 <font style="color:blue">MLE</font>。一般来说， $n$ 在 $10$ 左右，只比搜索好一点。所以做状压 DP 题的时候得先看一下时空复杂度能不能承受再确定此题状压 DP 解法是否为真。

如此庞大的状态转移，带来了沉重的时空消耗，但这只是状态压缩的缺点，DP 的优势仍然不时闪耀着光芒~~（不信你用 DFS 切这道题试试）~~。

## T 覆盖问题

题目来源：124OJ 383
评测链接 1：<http://124.221.137.247/problem/383>
评测链接 2：<https://hydro.ac/d/sukwoj/p/QZ383>
类题链接：<https://www.acwing.com/problem/content/293/>

输出用 $1 \times 2$ 的骨牌完全覆盖 $M(\leq 10)$ 行 $N(\leq 1000)$ 列的棋盘的方案总数，答案对 $1234567$ 取模。

<br>

此题我们一看就知道是棋盘类的状压 DP，一看数据范围更加证实了我们的猜想。同上一道题一样的套路，我们需要将一行的状态压缩，然后行间转移，但是如何定义状态便成了难点。

不难发现，放置的 $1 \times 2$ 的骨牌只有两种状态——横放与竖放。横放的骨牌在行内就可以解决，但竖放的骨牌却需要两行同时解决。我们要进行行间转移，势必要对竖放的骨牌进行分割，分成上半部分和下半部分，那我们就先这样定义状态，用 $0,1,2$ 三个数表示，但这样就会失去位运算的优秀表现。

再细想，在行间转移的时候，在上一行放置的骨牌状态对下一行（同一位置）的影响只有两种——上一行放了上半部分决定下一行只能放下半部分，否则可以放上半部分或者横放骨牌。这样我们惊奇地发现，之前决策对当前决策的影响已经可以用最后一行的上半部分和非上半部分决定了，满足动态规划无后效性原则。

既然这样，那么我们就可以按照其对下一行的影响，用 $1$ 表示此处放置了竖放骨牌上半部分，$0$ 表示此处放置了其他情况，压缩到整型变量里去。

那么，行间转移的条件就要满足（两行状态为 $x,y$）

  1. 令 $z = x \\  | \\ y$，那么 $z$ 需要满足二进制形势下连续一段 $0$ 的个数为偶数个，因为 $z$ 中 $1$ 表示竖放骨牌，$0$ 表示横放骨牌。
  2. $x \\ \\& \\ y = 0$，因为竖放骨牌的上半部分之下不能再是竖放骨牌的上半部分。

那么就用 $f_{i,s}$ 表示转移到第 $i$ 行、状态标识为 $s$ 的方案数，转移自然就是简单的 ``+=``。

代码如下。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>

const int MOD = 1234567;

int m, n, f[1005][1200], _up;
bool ex[1200];

bool exmn(int x)
{
    for (int i = 1; i <= _up; i <<= 1) if (!(x & i)) if ((i <<= 1) > _up || x & i) return 0;
    return 1;
}

void preset()
{
    for (int i = 0; i <= _up; ++i) ex[i] = exmn(i);
}

int main()
{
    scanf("%d%d", &m, &n);
    
    if (m & 1 && n & 1)
    {
        printf("-1");
        return 0;
    }
    
    _up = (1 << m) - 1;
    preset();
    
    f[0][0] = 1;
    for (int i = 1; i <= n; ++i)
    {
        for (int j = 0; j <= _up; ++j)
        {
            for (int k = 0; k <= _up; ++k)
            {
                if (!(j & k) && ex[j | k]) f[i][j] = (f[i][j] + f[i - 1][k]) % MOD;
            }
        }
    }
    printf("%d", f[n][0]);
    return 0;
}
```
{% endcontentbox %}

这道题还可以用矩阵快速幂加速（真的吗？）~~，这里留给读者自己思考~~。

## T 平板涂色

评测链接：<https://www.luogu.com.cn/problem/P1283>

CE 数码公司开发了一种名为自动涂色机（APM）的产品。它能用预定的颜色给一块由不同尺寸且互不覆盖的矩形构成的平板涂色。

为了涂色，APM 需要使用一组刷子。每个刷子涂一种不同的颜色 $C_i(1\le C_i \le 20)$ 。APM 拿起一把有颜色 $C_i$ 的刷子，并给所有颜色为 $C_i$ 且符合下面限制的矩形涂色：

{% asset_img apm.png '"" ""平板涂色 题图' %}

为了避免颜料渗漏使颜色混合，一个矩形只能在所有紧靠它上方的矩形涂色后，才能涂色。例如图中矩形 $F$ 必须在 $C$ 和 $D$ 涂色后才能涂色。注意，每一个矩形必须立刻涂满，不能只涂一部分。

输入矩形的个数 $N(1\le N \le 16)$，以及每个矩形的范围信息，用左上角的 $y$ 坐标和 $x$ 坐标、右下角的 $y$ 坐标和 $x$ 坐标表示，$0 \le x_i,y_i \le 99$。

写一个程序求一个使 APM 拿起刷子次数最少的涂色方案。注意，如果一把刷子被拿起超过一次，则每一次都必须记入总数中。

<br>

本题中，刷子换一次颜色算拿起一次，而每次拿起刷子可以将这个颜色的当前可涂色的所有区域都涂上颜色。

因为矩形区域覆盖在二维平面上，并未确定一定的涂色顺序，无法用一个数据概括已经涂过的区域。而已经涂过的区域又会对下一步操作产生影响，因此不得不保存涂色状态。$N$ 的范围在 $16$ 以内，因此考虑状压 DP。

同样的套路，用二进制状压矩形区域是否已经被涂色。

转移时，抓住本题的特点，拿起一次刷子可以涂完这个颜色当前所有可涂色的区域，想到「扩展」的思想，如果这次新涂色的区域与刚才涂色的区域颜色相同，不用再拿起刷子，即代价不 $+1$。

因此用 $f_{s,i}$ 表示要达到 $s$ 的涂色状态，最后一步涂区域 $i$ 的最小代价。

检验状态是否合法，需要预处理出要在 $i$ 涂色之前涂色的区域，确认这些区域是否在状态中即可。至于除 $i$ 以外的区域是否可以被合法涂色，不需要在当前考虑，因为当前状态需要从合法状态转移过来，而除 $i$ 以外的区域都会在前面某个合法状态中被检验。

因此通过枚举上一次的最后涂色区域，比较后进行转移。

{% contentbox type:success title:参考代码 %}
```cpp
#include <cstdio>
#include <cstring>

template <class T>
T min(T x, T y)
{
    return x < y ? x : y;
}

int n, _n;
int f[65600][20];
int re[20][20];
int map[105][105];
struct area
{
    int x1, y1, x2, y2, c;
} a[20];

int main()
{
    scanf("%d", &n);
    for (int i = 1; i <= n; ++i)
    {
        scanf("%d%d%d%d%d", &a[i].y1, &a[i].x1, &a[i].y2, &a[i].x2, &a[i].c);
        for (int y = a[i].y1 + 1; y <= a[i].y2; ++y) for (int x = a[i].x1 + 1; x <= a[i].x2; ++x) map[y][x] = i;
    }

    for (int i = 1; i <= n; ++i)
    {
        if (a[i].y1 != 0)
        {
            re[i][++re[i][0]] = map[a[i].y1][a[i].x1 + 1];
            for (int x = a[i].x1 + 2; x <= a[i].x2; ++x)
            {
                if (map[a[i].y1][x] != map[a[i].y1][x - 1]) re[i][++re[i][0]] = map[a[i].y1][x];
            }
        }
    }

    memset(f, 0x3f, sizeof f);
    for (int i = 1; i <= n; ++i)
    {
        if (!re[i][0]) f[1 << i - 1][i] = 1;
    }

    _n = 1 << n;
    for (int i = 0; i < _n; ++i)
    {
        for (int j = 1; j <= n; ++j)
        {
            if (i & (1 << j - 1))
            {
                for (int k = 1; k <= re[j][0]; ++k) if (!(i & (1 << re[j][k] - 1))) goto Label;
                // if (i == 8703 && j == 9) fprintf(stderr, "ZYCAKIOI!\n");
                for (int k = 1; k <= n; ++k)
                {
                    if (i & (1 << k - 1) && k != j)
                    {
                        f[i][j] = min(f[i][j], f[i ^ (1 << j - 1)][k] + (a[k].c == a[j].c ? 0 : 1));
                    }
                }
            }
        Label:
            continue;
        }
    }

    // fprintf(stderr, "%d\n", 8703 & (1 << 13));
    // fprintf(stderr, "%d", f[8703][9]);

    int Ans = 0x3f3f3f3f;
    for (int i = 1; i <= n; ++i) Ans = min(Ans, f[_n - 1][i]);

    printf("%d", Ans);

    return 0;
}
```
{% endcontentbox %}

还有一种思路，不用逐个区域转移，每次枚举涂色的颜色，将这个颜色的当前可以涂色的区域都涂色。这种思路会有一个坑，如果有两个相同颜色的区域上下相邻，则需要保证上面的区域先被扫描到，这样才能保证下面的区域被正确判断为可以涂色。因此需要事先排序。

## 总结

状态压缩是一类利用二进制和位运算压缩表示状态的技巧，当然有时也可以预处理出幂用于三进制等等。

状压 DP 就是运用状态压缩技巧的典型，让庞大的状态得以成为最优子结构的一位。然而枚举的代价是巨大的，状态的种类也非常繁多，时空复杂度都会带指数，因此状压 DP 的题目中规模不会太大。

人生旅途中，我们何尝不会面对许许多多影响决策的内外因素？与其强行压缩，确保每一个因素都被考虑进去，让时空的承受沉重无比，不如卸下包袱，轻装上阵，用感性的心情去沐浴每一秒阳光的美好。

学着去放下，才能行走得更加轻快。
