"use client";

import { motion, AnimatePresence } from "framer-motion";

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TermsModal({ isOpen, onClose }: TermsModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 max-w-lg w-full"
          >
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Termos & Condições
            </h2>

            <div className="text-sm text-gray-700 dark:text-gray-300 space-y-4">
              <p>
                <strong>1. Privacidade dos Dados:</strong><br />
                Não coletamos ou utilizamos informações sensíveis sem a sua
                autorização. Seus dados pessoais serão usados exclusivamente
                para o funcionamento da plataforma e melhoria dos serviços.
              </p>

              <p>
                <strong>2. Responsabilidade da Conta:</strong><br />
                Sua senha é pessoal e intransferível. Você é o único responsável
                por manter a confidencialidade da sua senha e pelas ações
                realizadas em sua conta.
              </p>

              <p>
                <strong>3. Uso de Dados para Inteligência Artificial:</strong><br />
                Algumas informações poderão ser utilizadas de forma anonimizada
                para aprimorar a inteligência artificial do sistema. Em nenhum
                momento seus dados individuais serão comercializados ou expostos
                a terceiros sem consentimento.
              </p>

              <p>
                <strong>4. Atualizações dos Termos:</strong><br />
                Estes Termos e Condições podem ser atualizados periodicamente
                para refletir melhorias, alterações legais ou técnicas. Continuar
                usando a plataforma após alterações significa concordar com a
                versão mais recente.
              </p>
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
              >
                Fechar
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
