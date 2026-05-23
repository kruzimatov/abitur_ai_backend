import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Login from '../../components/Login';
import Registration from '../../components/Registration';
import Logo from '../../assets/abiturai_logo.svg';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-gray-900 dark:bg-[#0F0F1A] dark:text-white">
      <div className="w-full max-w-lg p-8 bg-[#1A1A2E] rounded-2xl shadow-xl">
        <div className="mb-8">
          <img src={Logo} alt="logo" />
        </div>

        <div className="flex bg-[#1a1a20] p-1.5 rounded-xl mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${isLogin ? 'bg-[#252530] text-white' : 'text-gray-400'}`}
          >Kirish</button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${!isLogin ? 'bg-[#252530] text-white' : 'text-gray-400'}`}
          >Ro'yxat</button>
        </div>

        <AnimatePresence mode="wait">
          {isLogin ? (
            <motion.div
              key="login"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
            >
              <Login />
            </motion.div>
          ) : (
            <motion.div
              key="register"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Registration />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* <div className='absolute top-0 right-0 m-4'>
        <ThemeToggle />
      </div> */}
    </div>
  );
};

export default Auth;