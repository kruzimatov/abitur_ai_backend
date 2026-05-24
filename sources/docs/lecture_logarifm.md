# 1.14 LOGARIFM

## Kirish

Logarifm — bu daraja ko'rsatkichini topish amali. Ya'ni, **a^x = b** tenglamasida **x** ni topish logarifm orqali amalga oshiriladi:

> **log_a(b) = x**  ←→  **a^x = b**

**Shartlar:** a > 0, a ≠ 1, b > 0

**Misol:**
- log_2(8) = 3, chunki 2³ = 8
- log_3(81) = 4, chunki 3⁴ = 81
- log_5(1/25) = -2, chunki 5⁻² = 1/25

---

## Asosiy 10 ta Xossa

Quyidagilar uchun: **a > 0, a ≠ 1, b > 0, b ≠ 1**

### 1. a^(log_a(x)) = x
Logarifm va daraja bir-birini bekor qiladi.
- Misol: 2^(log_2(5)) = 5,  10^(lg(7)) = 7

### 2. log_a(a) = 1  va  log_a(1) = 0
- Har qanday asosda: o'zining logarifmi = 1
- Har qanday asosda: birning logarifmi = 0
- Misol: log_5(5) = 1,  log_100(1) = 0

### 3. log_a(x·y) = log_a(x) + log_a(y),  x,y > 0
Ko'paytmaning logarifmi = logarifmlar yig'indisi.
- Misol: log_2(4·8) = log_2(4) + log_2(8) = 2 + 3 = 5
- ⚠️ XATO: log_a(x + y) ≠ log_a(x) + log_a(y)

### 4. log_a(x/y) = log_a(x) - log_a(y),  x,y > 0
Bo'linmaning logarifmi = logarifmlar ayirmasi.
- Misol: log_3(27/9) = log_3(27) - log_3(9) = 3 - 2 = 1
- ⚠️ XATO: log_a(x/y) ≠ log_a(x) / log_a(y)

### 5. log_a(x^p) = p · log_a(x),  x > 0
Daraja ko'rsatkichi oldiga chiqadi.
- Misol: log_2(8) = log_2(2³) = 3·log_2(2) = 3·1 = 3
- Misol: log_3(√3) = log_3(3^(1/2)) = 1/2

### 6. log_a(x) = log_b(x) / log_b(a)  [O'tish formulasi]
Logarifm asosini ixtiyoriy sonга о'zgartirish mumkin.
- Misol: log_2(8) = lg(8)/lg(2) = 0.903/0.301 = 3
- Amalda ko'p ishlatiladi: log_a(b) = ln(b)/ln(a)

### 7. log_a(b) · log_b(a) = 1
Asosni almashtirish: ko'paytma doim 1 ga teng.
- Misol: log_2(3) · log_3(2) = 1
- Demak: log_b(a) = 1 / log_a(b)

### 8. log_a(b) = log_(a^p)(b^p),  p ≠ 0
Asos va argumentni bir xil darajaga ko'tarish mumkin.
- Misol: log_2(3) = log_4(9) = log_8(27)

### 9. a^(log_b(c)) = c^(log_b(a))
- Misol: 2^(log_3(5)) = 5^(log_3(2))

### 10. a^(√(log_a(b))) = b^(√(log_b(a)))

---

## Logarifmik Funksiya va Aniqlanish Sohasi

### log_a(f(x)) aniqlanish sohasi:
**Shart:** f(x) > 0

**Misol 1:** y = log_3(2 - x)
- 2 - x > 0  →  x < 2
- **Javob:** (-∞; 2)

### log_(g(x))(f(x)) aniqlanish sohasi:
**Shartlar (uchta birga):**
1. f(x) > 0  (argument musbat)
2. g(x) > 0  (asos musbat)
3. g(x) ≠ 1  (asos 1 ga teng emas)

**Misol 2:** y = log_x(3 - x)
- 3 - x > 0  →  x < 3
- x > 0  (asos musbat)
- x ≠ 1  (asos ≠ 1)
- **Javob:** (0; 1) ∪ (1; 3)

**Misol 3:** y = log_(x²)(4 - x)  [DTM 97-2-52]
- 4 - x > 0  →  x < 4
- x² > 0  →  x ≠ 0
- x² ≠ 1  →  x ≠ ±1
- **Javob:** (-∞;-1) ∪ (-1;0) ∪ (0;1) ∪ (1;4)

---

## Logarifmik Ifodalarni Soddalashtirish

### O'tish formulasi bilan ishlash:
log_a(b) = log_c(b) / log_c(a)

Bu formula yordamida **turli asoslarni bir asosga** keltirish mumkin.

**Misol:** log_6(45) = ?  agar log_3(5) = a, log_3(2) = b bo'lsa
- log_6(45) = log_3(45) / log_3(6)
- = log_3(9·5) / log_3(2·3)
- = (log_3(9) + log_3(5)) / (log_3(2) + log_3(3))
- = (2 + a) / (b + 1)

### Zanjir formulasi:
log_a(b) · log_b(c) = log_a(c)
log_a(b) · log_b(c) · log_c(d) = log_a(d)

**Misol:** log_3(4) · log_4(5) · log_5(6) · log_6(7) · log_7(9)
= log_3(9) = 2

---

## Logarifmik Funksiya Grafigi

| Holat | Grafik | Koordinata choragi |
|-------|--------|-------------------|
| a > 1 | O'suvchi | I va IV chorak |
| 0 < a < 1 | Kamayuvchi | II va III chorak |

- Har doim **(1; 0)** nuqtadan o'tadi
- y = -log_a(x) → x o'qi bo'yicha simmetrik

---

## Juft va Toq Funksiyalar

- **Juft:** f(-x) = f(x)  →  grafik y o'qi bo'yicha simmetrik
- **Toq:** f(-x) = -f(x)  →  grafik koordinatalar boshi bo'yicha simmetrik

**Misol:** y₁ = 3^x + 3^(-x) — juft  
y₂ = x² + lg|x| — juft  
y₃ = 3x⁵ + x³ — toq  

---

## Logarifmik Tenglamalar

### Asosiy usul:
log_a(f(x)) = log_a(g(x))  →  f(x) = g(x)  [va f(x) > 0 tekshiriladi]

log_a(f(x)) = b  →  f(x) = a^b

**Misol:** log_2(x - 3) = 3
- x - 3 = 2³ = 8
- x = 11  ✓ (chunki 11-3=8 > 0)

---

## Logarifmik Tengsizliklar

log_a(f(x)) > log_a(g(x)) da:
- **a > 1** bo'lsa: f(x) > g(x)  (ishora o'zgarmaydi)
- **0 < a < 1** bo'lsa: f(x) < g(x)  (ishora o'zgaradi!)

---

## Tez-tez Uchraydigan Xatolar

| Xato | To'g'risi |
|------|-----------|
| log(a+b) = log(a)+log(b) | log(a·b) = log(a)+log(b) |
| log(a/b) = log(a)/log(b) | log(a/b) = log(a)-log(b) |
| log_a(x) aniqlanadi x=0 da | log_a(x) faqat x>0 da aniqlanadi |
| log_a(b²) = 2log_a(b) har doim | Faqat b>0 da to'g'ri |

