'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp, HelpCircle, Mail, Phone } from 'lucide-react'

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      category: 'General',
      questions: [
        {
          question: 'What is EstateSecure?',
          answer: 'A comprehensive security management platform for residential communities integrating access control, surveillance, and emergency response systems.'
        },
        {
          question: 'How long does setup take?',
          answer: 'Average setup time is 7-10 days with full integration support from our team.'
        }
      ]
    },
    {
      category: 'Security',
      questions: [
        {
          question: 'Is the system GDPR compliant?',
          answer: 'Yes, EstateSecure implements strict data protection measures and encryption protocols.'
        },
        {
          question: 'Can you integrate with existing systems?',
          answer: 'Yes, we offer seamless integration with most existing security infrastructure.'
        }
      ]
    },
    {
      category: 'Pricing',
      questions: [
        {
          question: 'What is your pricing model?',
          answer: 'Flexible pricing based on community size. Contact us for a custom quote.'
        },
        {
          question: 'Is there a free trial?',
          answer: 'Yes, we offer a 30-day free trial with full feature access.'
        }
      ]
    },
    {
      category: 'Support',
      questions: [
        {
          question: 'What support options are available?',
          answer: '24/7 technical support via phone, email, and live chat.'
        },
        {
          question: 'Do you provide training?',
          answer: 'Yes, comprehensive training sessions included with all plans.'
        }
      ]
    }
  ]

  const toggleQuestion = (categoryIndex, questionIndex) => {
    const index = `${categoryIndex}-${questionIndex}`
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="py-16 bg-white" id='faq'>
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
         

          <div className="space-y-6">
            {faqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h3 className="text-lg font-bold text-white mb-3">
                  {category.category}
                </h3>
                <div className="space-y-4">
                  {category.questions.map((item, questionIndex) => {
                    const isOpen = openIndex === `${categoryIndex}-${questionIndex}`
                    
                    return (
                      <div key={questionIndex} className=" border-[#2a2d33]">
                        <button
                          onClick={() => toggleQuestion(categoryIndex, questionIndex)}
                          className="w-full p-4 text-left flex justify-between items-center hover:bg-[#2a2d33]"
                        >
                          <span className="font-medium text-white">
                            {item.question}
                          </span>
                          <span className="text-[#8a8f98]">
                            {isOpen ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </span>
                        </button>
                        
                        {isOpen && (
                          <div className="p-4 pt-0">
                            <p className="text-[#8a8f98]">
                              {item.answer}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="mailto:support@estatesecure.com"
                className="flex items-center gap-2 px-6 py-3 bg-[#1a1d23] text-white font-semibold  transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Support
              </a>
              <a
                href="tel:+18001234567"
                className="flex items-center gap-2 px-6 py-3 border-gray-300 text-[#8a8f98] font-semibold hover:bg-[#2a2d33] transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Support
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FAQ