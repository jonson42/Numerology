import React from 'react';

export const CosmicBackground: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative min-h-screen bg-[#070514] text-slate-100 overflow-hidden">
      {/* Lớp 1: Gradient nền vũ trụ sâu thẳm */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#0a0720] via-[#070514] to-[#04020a] pointer-events-none" />

      {/* Lớp 2: Quầng sáng Tinh vân Tím (Nebula Orb Purple) */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-purple-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-slow" />

      {/* Lớp 3: Quầng sáng Tinh vân Xanh chàm (Nebula Orb Indigo) */}
      <div className="fixed top-1/3 -right-40 w-[550px] h-[550px] bg-indigo-600/15 rounded-full blur-[130px] pointer-events-none animate-float" />

      {/* Lớp 4: Quầng sáng Tinh vân Vàng hoàng kim (Golden Aura) */}
      <div className="fixed -bottom-40 left-1/3 w-[650px] h-[650px] bg-amber-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Lớp 5: Lưới sao vũ trụ li ti (Stars Texture) */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(1.5px 1.5px at 20px 30px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 40px 70px, #e9d5ff, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 90px 40px, #fef08a, rgba(0,0,0,0)),
                            radial-gradient(2px 2px at 160px 120px, #ffffff, rgba(0,0,0,0)),
                            radial-gradient(1px 1px at 220px 240px, #a855f7, rgba(0,0,0,0)),
                            radial-gradient(1.5px 1.5px at 290px 180px, #38bdf8, rgba(0,0,0,0))`,
          backgroundSize: '350px 350px'
        }}
      />

      {/* Lớp 6: Vòng tròn ma trận hình học thiêng liêng mờ (Sacred Geometry Ring) */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full border border-purple-500/5 pointer-events-none animate-spin-slow" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-dashed border-amber-500/5 pointer-events-none animate-spin-slow" style={{ animationDirection: 'reverse' }} />

      {/* Nội dung trang */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  );
};
