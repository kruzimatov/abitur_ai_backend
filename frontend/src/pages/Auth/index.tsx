import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../../components/Login';
import Registration from '../../components/Registration';
import { IconBrain } from '@tabler/icons-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 440,
          background: 'var(--bg2)',
          border: '1px solid var(--border)',
          borderRadius: 16,
          padding: '36px 32px 32px',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--teal)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconBrain size={18} color="#07090F" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', letterSpacing: '-0.3px' }}>
            AbiturAI
          </span>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: 'flex',
            background: 'var(--bg3)',
            borderRadius: 10,
            padding: 4,
            marginBottom: 28,
          }}
        >
          <button
            onClick={() => setIsLogin(true)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: isLogin ? 'var(--bg2)' : 'transparent',
              color: isLogin ? 'var(--text)' : 'var(--text3)',
              boxShadow: isLogin ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            Kirish
          </button>
          <button
            onClick={() => setIsLogin(false)}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: !isLogin ? 'var(--bg2)' : 'transparent',
              color: !isLogin ? 'var(--text)' : 'var(--text3)',
              boxShadow: !isLogin ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
            }}
          >
            Ro'yxat
          </button>
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
            >
              <Login />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
            >
              <Registration />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Auth;
