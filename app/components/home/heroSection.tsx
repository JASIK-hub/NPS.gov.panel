import { Container } from "../shared/container";
import Image from 'next/image';
import Link from 'next/link';

const HeroSection = () => {
  return (
    <section className="relative bg-[#1a365d] text-white pt-20 pb-40 overflow-hidden">
      <Container className="relative z-10">
        
        <div className="inline-flex items-center gap-2 bg-white/30 border border-white/20 px-4 py-2 rounded-full text-sm mb-8">
          <Image
            src="/nps.shield.png"
            alt='shield-security-photo'
            width={22}
            height={22}
            priority
            sizes="22px"
          />
          Официальный государственный портал
        </div>

        <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Ваш голос формирует будущее Казахстана
        </h1>
        <p className="text-lg md:text-xl text-blue-100/80 mb-10 max-w-2xl">
          Национальная цифровая система общественных опросов. 
          Участвуйте в принятии государственных решений.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link href="/register" className="bg-[#f9bc06] hover:bg-[#e5ac05] font-bold px-8 py-4 rounded-lg transition-colors flex items-center gap-2">
            Принять участие
            <span>→</span>
          </Link>
          <button className="bg-white/30 hover:bg-white/20 border border-white/30 px-8 py-4 rounded-lg font-semibold transition-colors">
            Посмотреть результаты
          </button>
        </div>

        <div className="mt-8 flex items-center gap-6 text-sm">
          <span className="text-blue-100/60">Уже зарегистрированы?</span>
          <div className="flex gap-4">
            <Link href="/auth/login" className="text-white font-semibold hover:text-blue-200 transition-colors underline">
              Войти
            </Link>
            <Link href="/auth/forgot-password" className="text-blue-200 hover:text-white transition-colors underline">
              Забыли пароль?
            </Link>
          </div>
        </div>
      </Container>

      <div className="absolute bottom-0 left-0 w-full leading-[0]">
    <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto block">
      <path d="M0 60 C240 110, 480 10, 720 60 C960 110, 1200 10, 1440 60 L1440 120 L0 120 Z" fill="white"/>
    </svg>
  </div>
    </section>
  );
};
export default HeroSection