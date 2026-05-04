import { Shield, ExternalLink, AlertCircle } from 'lucide-react';

interface NCALayerHelpProps {
  onClose: () => void;
}

const NCALayerHelp = ({ onClose }: NCALayerHelpProps) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield size={24} className="text-[#f9bc06]" />
            Инструкция по установке NCALayer
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-yellow-600 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-semibold mb-1">Важно!</p>
                <p>NCALayer — это официальное ПО Национального удостоверяющего центра Республики Казахстан для работы с электронной цифровой подписью.</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Шаги установки:</h3>
            <ol className="space-y-3">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#111827] text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Скачайте NCALayer</p>
                  <p className="text-xs text-gray-600">Загрузите с официального сайта pki.gov.kz</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#111827] text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Установите приложение</p>
                  <p className="text-xs text-gray-600">Запустите установщик и следуйте инструкциям</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#111827] text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Запустите NCALayer</p>
                  <p className="text-xs text-gray-600">Приложение должно быть запущено в фоне</p>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-[#111827] text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                <div>
                  <p className="text-sm font-medium text-gray-900">Установите сертификат</p>
                  <p className="text-xs text-gray-600">Добавьте ваш сертификат ЭЦП в NCALayer</p>
                </div>
              </li>
            </ol>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <p className="font-medium text-gray-900 mb-2">Полезные ссылки:</p>
            <div className="space-y-2">
              <a
                href="https://pki.gov.kz"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink size={14} />
                Официальный сайт НУЦ (pki.gov.kz)
              </a>
              <a
                href="https://pki.gov.kz/index.php/ru/ncalayer"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink size={14} />
                Скачать NCALayer
              </a>
              <a
                href="https://pki.gov.kz/index.php/ru/support"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <ExternalLink size={14} />
                Техническая поддержка
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Системные требования:</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Windows 7/8/10/11 или macOS 10.12+</li>
              <li>• Java Runtime Environment (JRE) 8 или выше</li>
              <li>• Установленный сертификат ЭЦП</li>
              <li>• Интернет-соединение для проверки статуса</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <button
              onClick={onClose}
              className="flex-1 bg-[#111827] text-white py-2.5 rounded-lg font-medium hover:bg-black transition-colors"
            >
              Понятно
            </button>
            <button
              onClick={() => {
                window.open('https://pki.gov.kz/index.php/ru/ncalayer', '_blank');
                onClose();
              }}
              className="flex-1 bg-[#f9bc06] text-[#0a1b33] py-2.5 rounded-lg font-medium hover:bg-[#e5ac05] transition-colors"
            >
              Скачать NCALayer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NCALayerHelp;