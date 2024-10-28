"use client";
import { useState } from "react";

export default function PatentFAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "특허란 무엇인가요?",
      answer:
        "특허는 발명자가 새로운 기술 또는 아이디어에 대해 법적으로 보호받을 수 있는 권리를 말합니다. 이를 통해 타인이 발명을 무단으로 사용하지 못하게 할 수 있습니다.",
    },
    {
      question: "특허 출원을 위한 절차는 무엇인가요?",
      answer:
        "특허 출원 절차는 발명의 설명서 작성, 출원서 제출, 심사 청구, 심사를 거쳐 등록이 완료되는 단계로 이루어집니다. 출원 과정 중에 선행기술 조사를 통해 발명이 기존에 존재하는지 검토하는 과정이 필요합니다.",
    },
    {
      question: "특허 출원 비용은 얼마나 드나요?",
      answer:
        "특허 출원 비용은 국가마다 다르지만, 일반적으로 출원 수수료, 심사 청구료, 변리사 비용 등이 포함됩니다. 이 비용은 발명의 복잡성 및 출원 전략에 따라 달라질 수 있습니다.",
    },
    {
      question: "특허 출원 후 얼마나 시간이 걸리나요?",
      answer:
        "특허 출원 후 심사까지의 시간은 약 1년에서 3년까지 걸릴 수 있습니다. 기술 분야나 국가에 따라 다르며, 심사 기간을 단축하기 위한 우선 심사 제도가 존재합니다.",
    },
    {
      question: "특허와 실용신안의 차이점은 무엇인가요?",
      answer:
        "특허는 고도의 창의적 발명을 보호하며, 실용신안은 소규모의 개선 발명에 대해 보호를 제공합니다. 실용신안은 특허보다 심사가 간소하며, 보호 기간도 더 짧습니다.",
    },
    {
      question: "특허를 받기 위한 기본 요건은 무엇인가요?",
      answer:
        "특허를 받기 위해서는 발명이 신규성, 진보성, 산업적 이용 가능성을 만족해야 합니다. 즉, 발명이 기존에 공개되지 않았고, 기술적으로 진보성이 있어야 하며, 산업에서 실용적으로 활용 가능해야 합니다.",
    },
    {
      question: "특허 등록 후 유지비용은 어떻게 되나요?",
      answer:
        "특허 등록 후 유지비용은 국가마다 다르며, 일반적으로 연차료가 발생합니다. 등록 후 일정 기간마다 이 연차료를 납부하지 않으면 특허가 취소될 수 있습니다.",
    },
    {
      question: "특허 침해가 발생했을 때 어떻게 대응하나요?",
      answer:
        "특허 침해가 발생하면 변리사와 상의하여 경고장을 발송하거나 법원에 소송을 제기할 수 있습니다. 특허권 침해 소송은 시간이 오래 걸릴 수 있지만, 법적으로 침해를 중지시키고 손해 배상을 청구할 수 있습니다.",
    },
  ];

  return (
    <div>
      <div className="text-[25px] font-bold text-center">특허 FAQ</div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border-b-[1px] border-[#AE81FE] pb-4"
            onClick={() => toggleFAQ(index)}
          >
            <div className="cursor-pointer text-[20px] font-semibold text-[#AE81FE]">
                {faq.question}
            </div>
            {openIndex === index && (
              <div className="mt-2 text-lg text-gray-700 font-bold">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
