import React from 'react';
import { PAYMENT_PHONE, ADMIN_EMAIL } from '../data/initialData';
import { Gamepad2, ShieldCheck, PhoneCall, Mail, Smartphone, Lock, Wallet } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="backdrop-blur-xl bg-slate-950/70 border-t border-white/10 text-right pt-12 pb-8 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-8 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-white">
                متجر <span className="text-cyan-400">حسابات الألعاب</span>
              </h3>
            </div>
            <p className="text-xs text-white/60 leading-relaxed">
              المنصة الموثوقة الأولى في العراق لبيع وشراء حسابات ببجي، فورتنايت، فالورانت، وكلاش بأمان تام وضمان التسليم الفوري.
            </p>
          </div>

          {/* Payment Info Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Wallet className="w-4 h-4 text-cyan-400" /> بوابات الدفع المعتمدة:
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 backdrop-blur-md">
                <span className="text-white/60 block text-[10px]">رقم التحويل (زين كاش واسياسيل):</span>
                <span className="font-mono font-bold text-cyan-400 text-sm dir-ltr block">
                  {PAYMENT_PHONE}
                </span>
              </div>
              <p className="text-[11px] text-white/60">
                * أرسل إثبات الدفع وسكرين شوت التحويل وسيقوم الأدمن بتأكيد إضافة الرصيد فوراً.
              </p>
            </div>
          </div>

          {/* Admin & Support Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4 text-cyan-400" /> التواصل والأدمن:
            </h4>
            <ul className="space-y-2 text-xs text-white/80">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono dir-ltr text-white/90">{ADMIN_EMAIL}</span>
              </li>
              <li className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span className="font-mono dir-ltr text-white/90">{PAYMENT_PHONE}</span>
              </li>
              <li className="text-[11px] text-white/50 mt-1">
                دعم متواصل 24/7 لمساعدتك في استلام الحساب وتوثيقه.
              </li>
            </ul>
          </div>

          {/* Guarantee Col */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-300" /> ضمان المتجر:
            </h4>
            <ul className="space-y-1.5 text-xs text-white/70">
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>تسليم فوري للمعلومات بعد الشراء</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>ضمان تغيير الإيميل والربط كاملاً</span>
              </li>
              <li className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>شحن محفظة دقيق عبر إثبات الدفع</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-white/50">
          <p>© {new Date().getFullYear()} جميع الحقوق محفوظة لمتجر حسابات الألعاب - العراق</p>
          <p className="mt-2 sm:mt-0 font-mono">الادمن المسؤول: {ADMIN_EMAIL}</p>
        </div>

      </div>
    </footer>
  );
};
