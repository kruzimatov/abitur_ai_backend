import { Link } from 'react-router-dom';
import {
  IconBrain,
  IconChartBar,
  IconClipboardCheck,
  IconBook,
  IconTargetArrow,
  IconFlame,
  IconArrowRight,
  IconCheck,
  IconX,
  IconStar,
  IconCrown,
} from '@tabler/icons-react';

const features = [
  {
    icon: IconBrain,
    color: 'var(--purple)',
    dim: 'var(--purple-dim)',
    title: 'AI Tutor',
    desc: "Gemini AI + RAG texnologiyasi bilan har qanday savolga javob olish. Mavzuga oid kontekstli, chuqur tushuntirishlar.",
  },
  {
    icon: IconClipboardCheck,
    color: 'var(--teal)',
    dim: 'var(--teal-dim)',
    title: 'Mock testlar',
    desc: "DTM formatidagi testlar bilan mashq qiling. Har bir xato javob uchun AI tahlil va maslahat.",
  },
  {
    icon: IconBook,
    color: 'var(--amber)',
    dim: 'var(--amber-dim)',
    title: 'Feynman usuli',
    desc: "Mavzuni o'z so'zlaringiz bilan tushuntiring — AI bilimingizni baholaydi va kamchiliklarni ko'rsatadi.",
  },
  {
    icon: IconChartBar,
    color: 'var(--green)',
    dim: 'var(--green-dim)',
    title: 'Progress tracking',
    desc: "Har bir fan va mavzu bo'yicha progressingizni kuzating. AI sizga qaysi mavzularni takrorlashni tavsiya qiladi.",
  },
  {
    icon: IconTargetArrow,
    color: 'var(--red)',
    dim: 'var(--red-dim)',
    title: 'AI diagnostika',
    desc: "Test yakunida AI sizning xatolaringizni tahlil qiladi: noto'g'ri tushuncha, to'g'ri yechim va maslahat.",
  },
  {
    icon: IconFlame,
    color: 'var(--amber)',
    dim: 'var(--amber-dim)',
    title: 'Streak tizimi',
    desc: "Har kuni o'qish odatini shakllantiring. Kunlik streak va faollik kalendari motivatsiyangizni oshiradi.",
  },
];

const steps = [
  { num: '01', title: "Ro'yxatdan o'ting", desc: "Email va parol bilan 30 soniyada ro'yxatdan o'ting" },
  { num: '02', title: "Fan tanlang", desc: "DTM yo'nalishingizga mos fanlarni tanlang" },
  { num: '03', title: "Mavzularni o'rganing", desc: "Har bir mavzuni AI yordam bilan chuqur o'rganing" },
  { num: '04', title: "Test yeching", desc: "Mock testlar bilan bilimingizni sinab, AI tahlil oling" },
];

const plans = [
  {
    name: 'Bepul',
    price: '0',
    period: "oyiga",
    desc: "Platformani sinab ko'rish uchun",
    icon: IconStar,
    color: 'var(--text2)',
    borderColor: 'var(--border)',
    bg: 'var(--bg2)',
    features: [
      { text: "Kuniga 5 ta AI savol", included: true },
      { text: "2 ta fan", included: true },
      { text: "Kuniga 1 ta mock test", included: true },
      { text: "Asosiy mavzular", included: true },
      { text: "AI diagnostika", included: false },
      { text: "Feynman tekshiruvi", included: false },
      { text: "Cheksiz AI chat", included: false },
      { text: "Barcha fanlar", included: false },
    ],
  },
  {
    name: 'Pro',
    price: "49,000",
    period: "oyiga",
    desc: "Jiddiy tayyorgarlik uchun",
    icon: IconCrown,
    color: 'var(--teal)',
    borderColor: 'var(--teal)',
    bg: 'var(--bg2)',
    popular: true,
    features: [
      { text: "Cheksiz AI savol", included: true },
      { text: "Barcha fanlar", included: true },
      { text: "Cheksiz mock testlar", included: true },
      { text: "Barcha mavzular + kontent", included: true },
      { text: "AI diagnostika + tahlil", included: true },
      { text: "Feynman usuli", included: true },
      { text: "Progress tracking", included: true },
      { text: "Ustuvor yordam", included: false },
    ],
  },
  {
    name: 'Premium',
    price: "99,000",
    period: "oyiga",
    desc: "Maksimal natija uchun",
    icon: IconCrown,
    color: 'var(--purple)',
    borderColor: 'var(--purple)',
    bg: 'var(--bg2)',
    features: [
      { text: "Pro rejadagi hamma narsa", included: true },
      { text: "Shaxsiy AI o'quv rejasi", included: true },
      { text: "Haftalik AI hisobotlar", included: true },
      { text: "Ustuvor yordam 24/7", included: true },
      { text: "Guruh reytingi", included: true },
      { text: "PDF yuklab olish", included: true },
      { text: "Oilaviy tarif (3 foydalanuvchi)", included: true },
      { text: "Yangi funksiyalarga erta kirish", included: true },
    ],
  },
];

const Landing = () => {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', overflowX: 'hidden' }}>
      {/* Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px 40px', borderBottom: '1px solid var(--border)',
        background: 'rgba(7,9,15,0.8)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 50,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--teal)', display: 'grid', placeItems: 'center' }}>
            <IconBrain size={18} color="#07090F" />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: 'var(--text)', letterSpacing: '-0.5px' }}>AbiturAI</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/login" style={{ padding: '10px 20px', fontSize: 14, color: 'var(--text2)', textDecoration: 'none', fontWeight: 600 }}>
            Kirish
          </Link>
          <Link to="/login" style={{ padding: '10px 24px', fontSize: 14, fontWeight: 800, background: 'var(--teal)', color: '#07090F', borderRadius: 'var(--r-sm)', textDecoration: 'none' }}>
            Boshlash
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        padding: '100px 40px 80px', textAlign: 'center', maxWidth: 800, margin: '0 auto',
        position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,196,154,0.08) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: 'var(--teal-dim)', border: '1px solid var(--teal-border)',
          borderRadius: 30, padding: '6px 18px', fontSize: 13, color: 'var(--teal)',
          fontWeight: 700, marginBottom: 28,
        }}>
          <IconBrain size={15} /> AI bilan DTM tayyorgarlik
        </div>
        <h1 style={{
          fontSize: 56, fontWeight: 800, lineHeight: 1.15, marginBottom: 20,
          fontFamily: "'DM Serif Display', serif", color: 'var(--text)',
          position: 'relative',
        }}>
          DTM imtihoniga{' '}
          <span style={{ color: 'var(--teal)' }}>AI</span> bilan tayyorlaning
        </h1>
        <p style={{ fontSize: 18, color: 'var(--text2)', lineHeight: 1.7, marginBottom: 40, maxWidth: 600, margin: '0 auto 40px' }}>
          Sun'iy intellekt yordamida o'rganing, mashq qiling va bilimingizni sinang.
          Shaxsiy AI tutor, mock testlar va xato tahlili — barchasi bir platformada.
        </p>
        <div style={{ display: 'flex', gap: 14, justifyContent: 'center' }}>
          <Link to="/login" style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '16px 36px', fontSize: 16, fontWeight: 800,
            background: 'var(--teal)', color: '#07090F', borderRadius: 'var(--r)',
            textDecoration: 'none',
          }}>
            Bepul boshlash <IconArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '80px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: "'DM Serif Display', serif", marginBottom: 12 }}>
            Nimalar bor?
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 500, margin: '0 auto' }}>
            AbiturAI platformasining asosiy imkoniyatlari
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                borderRadius: 'var(--r)', padding: 28,
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 'var(--r)',
                  background: f.dim, display: 'grid', placeItems: 'center', marginBottom: 18,
                }}>
                  <Icon size={24} style={{ color: f.color }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: 'var(--text2)', lineHeight: 1.7 }}>{f.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: "'DM Serif Display', serif", marginBottom: 12 }}>
              Qanday ishlaydi?
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text2)' }}>4 oddiy qadamda DTM ga tayyorlaning</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {steps.map((step) => (
              <div key={step.num} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 36, fontWeight: 800, color: 'var(--teal)',
                  fontFamily: "'DM Mono', monospace", marginBottom: 14, opacity: 0.6,
                }}>
                  {step.num}
                </div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: 13, color: 'var(--text3)', lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Capabilities */}
      <section style={{ padding: '80px 40px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 32, fontWeight: 800, fontFamily: "'DM Serif Display', serif", marginBottom: 16 }}>
              AI Tutor — shaxsiy o'qituvchingiz
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text2)', lineHeight: 1.8, marginBottom: 24 }}>
              Google Gemini va RAG texnologiyasi asosida ishlaydigan AI tutor har qanday savolingizga javob beradi.
              Faqat bazadagi mavzular emas — istalgan fan bo'yicha yordam olishingiz mumkin.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                "Har qanday mavzu bo'yicha tushuntirish",
                "DTM formatida savol va javob",
                "Xatolaringiz tahlili va maslahat",
                "Feynman usuli bilan bilim tekshiruvi",
              ].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, color: 'var(--text2)' }}>
                  <IconCheck size={16} style={{ color: 'var(--teal)', flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div style={{
            background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--r)',
            padding: 24, display: 'flex', flexDirection: 'column', gap: 12,
          }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,var(--teal),var(--purple))', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>S</span>
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--purple-dim)', borderRadius: '14px 14px 14px 4px', fontSize: 13, color: 'var(--text2)' }}>
                Logarifm nima? Oddiy tilda tushuntir
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--purple-dim)', border: '1px solid rgba(129,140,248,0.3)', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                <IconBrain size={14} style={{ color: 'var(--purple)' }} />
              </div>
              <div style={{ padding: '10px 14px', background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '14px 14px 14px 4px', fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
                Logarifm — bu daraja ko'rsatkichini topish amali. Masalan: 2 ning qanday darajasi 8 ga teng? Javob: 3, chunki 2^3 = 8. Buni log_2(8) = 3 deb yozamiz...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ padding: '80px 40px', background: 'var(--bg2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: "'DM Serif Display', serif", marginBottom: 12 }}>
              Tariflar
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 500, margin: '0 auto' }}>
              O'zingizga mos rejani tanlang. Istalgan vaqtda yangilash mumkin.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'stretch' }}>
            {plans.map((plan) => {
              const PlanIcon = plan.icon;
              return (
                <div key={plan.name} style={{
                  background: plan.bg,
                  border: `1.5px solid ${plan.popular ? plan.borderColor : 'var(--border)'}`,
                  borderRadius: 'var(--r)',
                  padding: 32,
                  display: 'flex', flexDirection: 'column',
                  position: 'relative',
                  boxShadow: plan.popular ? '0 0 40px rgba(0,196,154,0.08)' : 'none',
                }}>
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      background: 'var(--teal)', color: '#07090F',
                      padding: '4px 16px', borderRadius: 20,
                      fontSize: 11, fontWeight: 800, textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}>
                      Mashhur
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                    <PlanIcon size={20} style={{ color: plan.color }} />
                    <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)' }}>{plan.name}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text3)', marginBottom: 20 }}>{plan.desc}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 24 }}>
                    <span style={{ fontSize: 40, fontWeight: 800, color: plan.color === 'var(--text2)' ? 'var(--text)' : plan.color }}>
                      {plan.price}
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--text3)' }}>
                      {plan.price === '0' ? '' : "so'm"} / {plan.period}
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 24 }}>
                    {plan.features.map((f) => (
                      <div key={f.text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: f.included ? 'var(--text2)' : 'var(--text3)' }}>
                        {f.included
                          ? <IconCheck size={15} style={{ color: plan.color === 'var(--text2)' ? 'var(--teal)' : plan.color, flexShrink: 0 }} />
                          : <IconX size={15} style={{ color: 'var(--text3)', opacity: 0.5, flexShrink: 0 }} />
                        }
                        <span style={{ opacity: f.included ? 1 : 0.6 }}>{f.text}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/login" style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 24px', fontSize: 14, fontWeight: 700,
                    background: plan.popular ? 'var(--teal)' : 'transparent',
                    color: plan.popular ? '#07090F' : 'var(--text)',
                    border: plan.popular ? 'none' : '1px solid var(--border)',
                    borderRadius: 'var(--r-sm)',
                    textDecoration: 'none',
                    transition: 'all 0.2s',
                  }}>
                    {plan.price === '0' ? 'Bepul boshlash' : 'Tanlash'}
                    <IconArrowRight size={15} />
                  </Link>
                </div>
              );
            })}
          </div>
          <div style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text3)' }}>
            * Barcha narxlar UZS da. Payme, Click va karta orqali to'lash mumkin.
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '80px 40px', textAlign: 'center',
        background: 'linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%)',
        borderTop: '1px solid var(--border)',
      }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, fontFamily: "'DM Serif Display', serif", marginBottom: 12 }}>
          DTM tayyorgarligini <span style={{ color: 'var(--teal)' }}>bugun</span> boshlang
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text2)', marginBottom: 32, maxWidth: 500, margin: '0 auto 32px' }}>
          Bepul ro'yxatdan o'ting va AI yordamida samarali tayyorlaning
        </p>
        <Link to="/login" style={{
          display: 'inline-flex', alignItems: 'center', gap: 10,
          padding: '16px 40px', fontSize: 16, fontWeight: 800,
          background: 'var(--teal)', color: '#07090F', borderRadius: 'var(--r)',
          textDecoration: 'none',
        }}>
          Bepul boshlash <IconArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 40px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--teal)', display: 'grid', placeItems: 'center' }}>
            <IconBrain size={14} color="#07090F" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>AbiturAI</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text3)' }}>
          2026 AbiturAI. AI bilan DTM tayyorgarlik platformasi.
        </div>
      </footer>
    </div>
  );
};

export default Landing;
