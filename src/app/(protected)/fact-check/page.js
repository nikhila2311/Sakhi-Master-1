import React from "react";
import { FaCheck } from "react-icons/fa";
import { FaX } from "react-icons/fa6";
import { MdFactCheck } from "react-icons/md";

const myth_fact_updated = [
  {
    type: "fact",
    heading: "Women's heart attack symptoms can differ from men's.",
    explanation:
      "Fact: While chest pain is common, women may also experience nausea, fatigue, and jaw pain during a heart attack.",
  },
  {
    type: "myth",
    heading: "Women are naturally more emotional than men.",
    explanation:
      "Fact: Emotions are a human experience, and while societal expressions may differ, there's no scientific basis for women being inherently more emotional.",
  },
  {
    type: "fact",
    heading: "Breastfeeding has numerous health benefits for both mother and child.",
    explanation:
      "Fact: Breast milk provides ideal nutrition for babies, and breastfeeding can lower the risk of certain diseases in mothers.",
  },
  {
    type: "myth",
    heading: "A career in leadership is unnatural for women.",
    explanation:
      "Fact: Women are capable leaders, and biases, not inherent traits, often contribute to underrepresentation in leadership roles.",
  },
  {
    type: "fact",
    heading: "Access to reproductive healthcare is essential for women's autonomy.",
    explanation:
      "Fact: The ability to make informed decisions about their bodies and reproductive health is fundamental to women's empowerment.",
  },
  {
    type: "myth",
    heading: "Strength training will make women look bulky.",
    explanation:
      "Fact: Due to hormonal differences, women typically don't build muscle bulk from strength training in the same way men do. It primarily leads to increased strength and tone.",
  },
  {
    type: "fact",
    heading: "The gender pay gap persists globally.",
    explanation:
      "Fact: On average, women still earn less than men for comparable work across many countries.",
  },
  {
    type: "myth",
    heading: "You shouldn't wash your hair during your period.",
    explanation:
      "Fact: There's no medical reason to avoid washing your hair during menstruation. It's purely a myth.",
  },
];

export default function FactCheck() {
  return (
    <div>
      <p className="text-2xl font-semibold text-center text-emerald-600 flex flex-col justify-center items-center gap-2">
        <MdFactCheck className="inline-block mt-0.5 text-5xl" />
        Fact Check
      </p>
      <div className="flex flex-col mt-4 gap-4">
        {myth_fact_updated.map((item, index) => (
          <MythFactComp key={index} data={item} />
        ))}
      </div>
    </div>
  );
}

function MythFactComp({ data }) {
  return (
    <div className="p-4 rounded-lg bg-zinc-50 flex flex-col gap-2">
      {/* Mark */}
      <div className="relative flex items-center text-sm">
        <div
          className={`p-2 rounded-full ring-[2px] ring-zinc-100 z-10 ${
            data.type === "fact" ? "bg-green-500" : "bg-red-500 "
          }`}
        >
          {data.type === "fact" ? (
            <FaCheck className="w-4 text-white" />
          ) : (
            <FaX className="w-4 text-white" />
          )}
        </div>
        <span
          className={`uppercase h-8 flex items-center pl-10 pr-4 rounded-full -ml-7 text-white font-medium tracking-wider ${
            data.type === "fact" ? "bg-green-500" : "bg-red-500 "
          }`}
        >
          {data.type}
        </span>
      </div>
      {/* Heading */}
      <p className="text-lg font-medium">{data.heading}</p>
      <p className="text-sm opacity-80 -mt-1">{data.explanation}</p>
    </div>
  );
}