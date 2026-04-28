
const InstructionsSection = () => {
  const steps = [
    { id: 1, title: "Авторизация", desc: "Войдите через ЭЦП или систему eGov для верификации личности гражданина." },
    { id: 2, title: "Участие в опросе", desc: "Выберите интересующий опрос, ознакомьтесь с описанием и оставьте свой голос." },
    { id: 3, title: "Влияние", desc: "Ваш голос учитывается при принятии важных государственных решений." },
  ];

  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4 uppercase tracking-wide text-slate-800">Порядок участия</h2>
        <p className="text-slate-500 italic">Простой и прозрачный процесс выражения вашего мнения</p>
      </div>
    </section>
  );
};

export default InstructionsSection;