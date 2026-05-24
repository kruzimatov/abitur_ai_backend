<?php

namespace Database\Seeders;

use App\Models\Topic;
use Illuminate\Database\Seeder;

class UpdateTopicContentSeeder extends Seeder
{
    public function run(): void
    {
        $updates = $this->getUpdatedContent();

        foreach ($updates as $title => $content) {
            $topic = Topic::where('title', $title)->first();
            if ($topic) {
                $topic->update(['content' => $content]);
                $this->command->info("Updated: {$title}");
            } else {
                $this->command->warn("Not found: {$title}");
            }
        }
    }

    private function getUpdatedContent(): array
    {
        return [
            // ═══════════════════════════════════════════════════════════════
            // FIZIKA — Kinematika asoslari (from textbook: I bob. KINEMATIKA)
            // ═══════════════════════════════════════════════════════════════
            'Mexanika — Kinematika asoslari' => <<<'CONTENT'
I BOB. KINEMATIKA

Kinematika — jismlarning harakatini sabablarga e'tibor bermay o'rganuvchi bo'lim.
Kinematikada faqat "qanday?" degan savolga javob beriladi: qanday harakat qiladi, qayerda, qachon.

═══════════════════════════════════
ASOSIY TUSHUNCHALAR
═══════════════════════════════════

• Moddiy nuqta — o'lchamlari berilgan masalada ahamiyatsiz bo'lgan jism
• Sanoq tizimi — sanoq tanasi + koordinata tizimi + soat
• Trayektoriya — jism harakatlanayotgan yo'l (chiziq)
• Ko'chish (s⃗) — boshlang'ich va oxirgi nuqtalar orasidagi vektor
• Yo'l (l) — trayektoriya bo'ylab bosib o'tilgan masofa (har doim l ≥ |s⃗|)

═══════════════════════════════════
1. MEXANIK HARAKAT TURLARI
═══════════════════════════════════

1. TO'G'RI CHIZIQLI TEKIS HARAKAT
   Jismning harakat trayektoriyasi to'g'ri chiziqdan iborat bo'ladi.
   Harakat tezligining kattaligi va yo'nalishi o'zgarmaydi.
   Formula: s = v · t

2. TO'G'RI CHIZIQLI NOTEKIS HARAKAT
   Trayektoriyasi to'g'ri chiziqdan iborat bo'ladi.
   Harakat tezligining kattaligi o'zgaradi, lekin yo'nalishi o'zgarmaydi.
   Formula: s = v_o'rt · t

3. TO'G'RI CHIZIQLI TEKIS TEZLANUVCHAN (SEKINLANUVCHAN) HARAKAT
   Jism harakat trayektoriyasi to'g'ri chiziqdan iborat bo'ladi, ya'ni
   teng vaqtlar ichida bir xil kattalikka ortadi (kamayib) boradi,
   lekin yo'nalishi o'zgarmaydi.

   Formulalar:
   v = v₀ + a·t
   s = v₀·t + (a·t²)/2
   v² = v₀² + 2·a·s
   s = (v₀ + v)/2 · t

   Ishora tekis tezlanuvchan: a > 0 ("+")
   Ishora tekis sekinlanuvchan: a < 0 ("-")

4. EGRI CHIZIQLI TEKIS HARAKAT
   Egri chiziqli harakatning xususiy holi sifatida aylana bo'ylab
   tekis harakatni olish mumkin.
   Har doim tezlik uzluksiz o'zgarib, trayektoriyaga urinma bo'lib
   yo'nalgan bo'ladi.

   Parametrlar: v — chiziqli tezlik; ω — burchak tezlik;
   T — aylanishlar davri; ν — aylanishlar chastotasi;
   S_aylanma — yoy uzunligi; s — bosib o'tilgan yo'l

═══════════════════════════════════
2. HARAKATLARNING MUSTAQILLIK PRINSIPI
═══════════════════════════════════

Jism qatnashayotgan harakatlar mustaqil bo'lib, ularning harakat
tezligi (tezlanishi) bir-biriga bog'liq emas. Bunga harakatlarning
mustaqillik prinsipi deyiladi.

Masalan, daryo bo'ylab harakatlanayotgan kema, poyezd vagoni ichida
yurish, uchib ketayotgan samolyotdan tashlangan yuk va h.k.

Misollar:
• Kema o'z dvigatelining tortish kuchi tufayli bir yo'nalishda v₁
  tezlik bilan harakatlansa, suv uni v₂ tezlik bilan oqim yo'nalishida
  harakatlantiradi — ikkita harakat qatnashayotganligi ko'rinib turibdi.
• Uchib ketayotgan samolyotdan tashlangan yukning tushish vaqti
  samolyot tezligiga BOG'LIQ EMAS!

Vektor yig'indisi:
  s⃗_umumiy = s⃗₁ + s⃗₂ + s⃗₃ + ... + s⃗ₙ
  v⃗_umumiy = v⃗₁ + v⃗₂ + v⃗₃ + ... + v⃗ₙ
  a⃗_umumiy = a⃗₁ + a⃗₂ + a⃗₃ + ... + a⃗ₙ

Umumiy holda:
  s⃗ = s⃗₀ + v⃗_um·t + (a_um·t²)/2

Proeksiyalarga ajratish:
  sₓ = s₀ₓ + vₓ·t + (aₓ·t²)/2     (1.1)
  sᵧ = s₀ᵧ + vᵧ·t + (aᵧ·t²)/2     (1.2)

═══════════════════════════════════
3. MASALA YECHISH NAMUNASI
═══════════════════════════════════

Masala: Teplovhodning tinch suvdagi tezligi 70 km/soat. U oqim
bo'ylab bir-biridan 36 km uzoqlikda joylashgan pristanlar oralig'ini
qancha vaqtda bosib o'tadi? Daryo oqimining tezligi 2 km/soat.

Berilgan:              Formulasi va yechilishi:
  s = 36 km              s = v·t;  v = v_tep + v_daryo
  v_tep = 70 km/soat     s = (v_tep + v_daryo)·t
  v_daryo = 2 km/soat
  t — ?                  t = s/(v_tep + v_daryo) = 36/(70+2) = 0.5 soat

Javob: 0.5 soat.

═══════════════════════════════════
4. TEKIS O'ZGARUVCHAN HARAKAT — BATAFSIL
═══════════════════════════════════

Tezlanish (a) — tezlikning o'zgarish tezligi:
  a = Δv/Δt = (v - v₀)/t
  Birlik: m/s² (metr/soniya kvadrat)

MUHIM FORMULALAR:
  1) v = v₀ + a·t
  2) s = v₀·t + a·t²/2
  3) v² = v₀² + 2·a·s
  4) s = (v₀ + v)·t/2
  5) sₙ = v₀ + a·(2n-1)/2  — n-chi soniyada bosib o'tilgan yo'l

ERKIN TUSHISH (vakuumda):
  g ≈ 9.8 m/s² ≈ 10 m/s² (DTM da)
  h = g·t²/2  (v₀ = 0 da)
  v = g·t
  t = √(2h/g)
  v = √(2·g·h)

  Misol: Jism 45 m balandlikdan tushdi.
  t = √(2·45/10) = √9 = 3 s
  v = 10·3 = 30 m/s

TIK OTILGAN JISM (yuqoriga v₀ bilan):
  v = v₀ - g·t
  h = v₀·t - g·t²/2
  Maks. balandlik: H = v₀²/(2g)
  Ko'tarilish vaqti: t = v₀/g
  Umumiy uchish vaqti: T = 2·v₀/g

GORIZONTAL OTILGAN JISM (h balandlikdan):
  x = v₀·t           (gorizontal — tekis)
  y = g·t²/2          (vertikal — erkin tushish)
  v = √(v₀² + (g·t)²)
  Uchar masofa: L = v₀·√(2h/g)

═══════════════════════════════════
5. O'RTACHA TEZLIK
═══════════════════════════════════

  v_o'rt = S_umumiy / t_umumiy

  ⚠️ XATO: v_o'rt ≠ (v₁+v₂)/2 (umumiy holda)
  (v₁+v₂)/2 faqat TEKIS O'ZGARUVCHAN harakatda to'g'ri

  Misol: Mashina birinchi yarmida 60 km/h, ikkinchi yarmida
  40 km/h tezlikda yurdi. v_o'rt = ?

  v_o'rt = 2·v₁·v₂/(v₁+v₂) = 2·60·40/(60+40) = 48 km/h
  (XATO: (60+40)/2 = 50 km/h emas!)

═══════════════════════════════════
6. BIRLIKLAR VA O'TKAZISH
═══════════════════════════════════

  1 km/h = 1/3.6 m/s
  1 m/s = 3.6 km/h

  72 km/h = 20 m/s
  36 km/h = 10 m/s
  54 km/h = 15 m/s
  90 km/h = 25 m/s
  108 km/h = 30 m/s

═══════════════════════════════════
7. DTM UCHUN MUHIM SAVOLLAR
═══════════════════════════════════

1. Qanday hollarda tezlik vektori tashkil etuvchilarga ajratiladi?
2. Harakatlarning mustaqillik prinsipi nimadan iborat?
3. Nima sababdan jism bir vaqtda bir necha harakatda qatnashayotgan
   bo'lsa, harakatlar bir-biriga ta'sir ko'rsatmaydi?
CONTENT,

            // ═══════════════════════════════════════════════════════════════
            // FIZIKA — Dinamika asoslari (expanded)
            // ═══════════════════════════════════════════════════════════════
            'Mexanika — Dinamika asoslari' => <<<'CONTENT'
II BOB. DINAMIKA

Dinamika — jismlarning harakatini KUCHLAR ta'sirida o'rganuvchi bo'lim.
Dinamikada "nima uchun?" degan savolga javob beriladi: nima uchun jism harakat qiladi yoki to'xtaydi.

═══════════════════════════════════
1. NYUTONNING I QONUNI (INERSIYA QONUNI)
═══════════════════════════════════

Agar jismga kuch ta'sir etmasa yoki kuchlar muvozanatlashgan bo'lsa,
jism tinch turadi yoki tekis to'g'ri chiziqli harakatda bo'ladi.

  ΣF⃗ = 0  →  a⃗ = 0  →  v⃗ = const

Inersiya — jismning o'z harakat holatini saqlashga intilish xossasi.
Massa katta bo'lsa, inersiya katta (og'ir jismni tezlashtirish qiyin).

Inersial sanoq tizimi — undagi jism inersiya qonuniga bo'ysunadi.
Noninersial sanoq tizimi — tezlanuvchi lift, burilayotgan avtomobil.

═══════════════════════════════════
2. NYUTONNING II QONUNI
═══════════════════════════════════

  F⃗ = m·a⃗
  a = F/m

  Kuch birligi: 1 N = 1 kg·m/s²

Misol: 5 kg jismga 20 N kuch ta'sir etsa:
  a = F/m = 20/5 = 4 m/s²

Bir necha kuch ta'sir etganda:
  ΣF⃗ = m·a⃗
  Natijaviy kuch: F_nat = √(F₁² + F₂² + 2·F₁·F₂·cos α)

  Maxsus hollar:
  • Bir yo'nalishda: F_nat = F₁ + F₂
  • Qarama-qarshi: F_nat = |F₁ - F₂|
  • 90° burchak ostida: F_nat = √(F₁² + F₂²)

═══════════════════════════════════
3. NYUTONNING III QONUNI
═══════════════════════════════════

  F₁₂ = -F₂₁  (ta'sir va aks ta'sir kuchlari)

  • Ikkala kuch DOIM teng va qarama-qarshi yo'nalishda
  • Ular TURLI jismlarga qo'yiladi
  • Ular bir xil tabiatga ega

  Misol: Ot aravani tortadi. Arava ham otni xuddi shunday kuch bilan
  tortadi (lekin teskari yo'nalishda). Harakat bo'lishining sababi —
  kuchlar TURLI jismlarga ta'sir etadi.

═══════════════════════════════════
4. OG'IRLIK KUCHI VA VAZN
═══════════════════════════════════

OG'IRLIK KUCHI — Yerning jismni tortish kuchi:
  F_og'ir = m·g
  Har doim Yer markaziga yo'nalgan.
  g = 9.8 m/s² (yer sirtida)

VAZN — jismning tayanchga yoki osma ipga ta'sir kuchi:
  P = m·g  (tinch holatda)
  P = m·(g + a)  — yuqoriga tezlanayotgan liftda (ortiqcha vazn)
  P = m·(g - a)  — pastga tezlanayotgan liftda (vazsizlik)
  P = 0          — erkin tushishda (to'liq vazsizlik)

  ⚠️ MUHIM: Og'irlik kuchi ≠ Vazn!
  Og'irlik kuchi JISMGA, Vazn esa TAYANCHGA ta'sir qiladi.

═══════════════════════════════════
5. ISHQALANISH KUCHI
═══════════════════════════════════

  F_ishq = μ·N

  μ — ishqalanish koeffitsienti (o'lchamsiz)
  N — tayanchning normal reaksiya kuchi

  Gorizontal sirtda: N = m·g  →  F_ishq = μ·m·g
  Qiya tekislikda:   N = m·g·cos α  →  F_ishq = μ·m·g·cos α

  Ishqalanish turlari:
  • Tinch holat ishqalanishi (eng katta)
  • Sirpanish ishqalanishi
  • Dumalanish ishqalanishi (eng kichik)

═══════════════════════════════════
6. ELASTIKLIK KUCHI (GUK QONUNI)
═══════════════════════════════════

  F = -k·Δx

  k — bikrlik koeffitsienti (N/m)
  Δx — deformatsiya (cho'zilish yoki siqilish)
  "-" ishora — kuch deformatsiyaga QARSHI yo'nalgan

  Misol: k = 200 N/m bo'lgan prujina 5 cm ga cho'zildi.
  F = 200 · 0.05 = 10 N

  Ketma-ket ulangan prujinalar: 1/k = 1/k₁ + 1/k₂
  Parallel ulangan prujinalar:  k = k₁ + k₂

═══════════════════════════════════
7. QIYA TEKISLIK
═══════════════════════════════════

Jismga ta'sir etuvchi kuchlar:
  • m·g·sin α — tekislik bo'ylab pastga (og'irlik komponenti)
  • m·g·cos α — tekislikka perpendikulyar (normal reaktsiya uchun)
  • F_ishq = μ·m·g·cos α — harakatga qarshi

Tezlanish (ishqalanishsiz):
  a = g·sin α

Tezlanish (ishqalanish bilan):
  a = g·(sin α - μ·cos α)  — pastga harakat
  a = g·(sin α + μ·cos α)  — yuqoriga harakat (sekinlashish)

═══════════════════════════════════
8. BUTUN OLAM TORTISHISH QONUNI
═══════════════════════════════════

  F = G·(m₁·m₂)/r²

  G = 6.67 × 10⁻¹¹ N·m²/kg² — gravitatsion doimiy

  Birinchi kosmik tezlik: v₁ = √(g·R) ≈ 7.9 km/s
  Ikkinchi kosmik tezlik: v₂ = √(2·g·R) ≈ 11.2 km/s

═══════════════════════════════════
9. IMPULS VA IMPULSNING SAQLANISH QONUNI
═══════════════════════════════════

  p⃗ = m·v⃗  — jism impulsi (kg·m/s)
  F·Δt = Δp  — kuch impulsi

  IMPULSNING SAQLANISH QONUNI (yopiq tizimda):
  m₁·v⃗₁ + m₂·v⃗₂ = m₁·v⃗₁' + m₂·v⃗₂'

  Masala: 2 kg jism 3 m/s, 4 kg jism -1 m/s da to'qnashib yopishdi.
  (2·3 + 4·(-1)) = (2+4)·v  →  v = 2/6 = 1/3 m/s

═══════════════════════════════════
DTM UCHUN ESDA TUTISH
═══════════════════════════════════

1. Kuch — vektor kattalik! Yo'nalishi muhim.
2. Og'irlik kuchi va vazn FARQLI tushunchalar.
3. Ishqalanish kuchi DOIM harakatga QARSHI yo'nalgan.
4. Qiya tekislik masalalarida koordinata o'qlarini TEKISLIK BO'YLAB tanlang.
5. Liftdagi vazn masalalarida g va a ning yo'nalishini EHTIYOT bo'lib aniqlang.
CONTENT,
        ];
    }
}
