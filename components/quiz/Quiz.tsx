"use client";
import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./quiz.css";
type Question = {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
};
type AttemptedQuestion = Question & { selectedAnswer: string };

export default function Quiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [timerActive, setTimerActive] = useState(true);
  const [attemptedQuestions, setAttemptedQuestions] = useState<
    AttemptedQuestion[]
  >([]);

  // Sample quiz questions
  const quizQuestions: Question[] = [
    {
      id: 1,
      question: "यक्ष प्रस्न भनेको के हो?",
      options: [
        "पाण्डवहरूले युद्धमा दुर्योधनलाई सोधेका छल-कपटसम्बन्धी प्रश्नहरू।",
        "पाण्डवहरूले जंगलमा पानी खोज्दा यक्षले सोधेका जीवन, धर्म, र न्यायसम्बन्धी गहन प्रश्नहरू",
        "द्रौपदीले स्वयंवरमा राजाहरूलाई सोधेका शर्तपूर्ण प्रश्नहरू।",
        "भीष्म पितामहले युद्धभूमिमा अर्जुनलाई सोधेका धनुर्वेदसम्बन्धी प्रश्नहरू।",
      ],
      correctAnswer:
        "पाण्डवहरूले जंगलमा पानी खोज्दा यक्षले सोधेका जीवन, धर्म, र न्यायसम्बन्धी गहन प्रश्नहरू",
      explanation: `पाचपाण्डब हरु जुवाहारी जङ्गल्को बसाइहुदा पाञ्चालि भनेकी पाण्डब हरुकी 
        पत्नी द्रौपतीलाई पानी पियास लागो धर्मयुधि ष्टिरले चारभाइलाइ पानीलिन पठाए 
        तलाउमा पानीखान खोज्दा यक्षराजले मेरो प्रस्नको उत्तर्दिएर मात्र पानी खाने लाने गर्नु 
        भन्दा जबजस्ती खानखोजे ती चारैभाइ मृत्यु भए अनि भाइहरु किना अएनन भनी दाजु 
        धर्मयुधिष्ठिर तलाउमा जादात सबै भाइ लडि राको देखि योपानीमा केरछभनी खानखोज्दा 
        यक्षले प्रस्न को उत्तर दिएरमात्र खाउभने तेसपछी यक्षले प्रस्नसोध्न लागे ।`,
    },
    {
      id: 2,
      question: "प्रस्न पृथ्बिभन्दा भारी केहो ?",
      options: ["हिमाल", "आमा (माता)", "सूर्य", "समुद्र"],
      correctAnswer: "आमा (माता)",
      explanation: `यसको उत्तर "आमा" हो किनभने यो प्रश्न एक नैतिक तथा भावनात्मक अर्थ राख्छ।
पृथ्वी भौतिक रूपमा भारी छ, तर आमाको माया, त्याग, र जिम्मेवारी पृथ्वीभन्दा पनि गहन र "भारी" हुन्छ।
यो उत्तरले मानवीय मूल्यलाई प्राथमिकता दिन्छ, जुन धार्मिक तथा सांस्कृतिक गाथाहरूमा प्रशस्त पाइन्छ।`,
    },
    {
      id: 3,
      question: "आकाशभन्दा माथि के हो?",
      options: ["चन्द्रमा", "पिता", "ताराहरू", "बादल"],
      correctAnswer: "पिता",
      explanation: `पितालाई आकाशभन्दा माथि मानिन्छ किनकि पितृ-ऋण (पिताको कर्तव्य) 
      धार्मिक रूपमा सर्वोच्च छ। यसले पिताको भूमिकालाई आध्यात्मिक, नैतिक, र संरक्षक रूपमा चिनाउँछ।`,
    },
    {
      id: 4,
      question: "हावाभन्दा तेज के हो?",
      options: ["बिजुली", "आगो", "ताराहरू", "मन"],
      correctAnswer: "मन",
      explanation: `मन हावाभन्दा तेज छ किनभने यो क्षणभरमा नै दशैं दिशा यात्रा गर्न सक्छ 
      (उदाहरण: विचार, कल्पना)। हावा शारीरिक रूपमा तेज छ, तर मनको गति अतुलनीय छ।`,
    },
    {
      id: 5,
      question: "सङ्ख्यामा ३ कोस भन्दा धेरै के हो?",
      options: ["बिजुली", "रोग", "चिन्ता", "ऋण"],
      correctAnswer: "चिन्ता",
      explanation: `"३ कोस" (यात्राको एक माप) भन्दा चिन्ता धेरै लामो हुन्छ 
      किनकि यसले मानिसलाई जीवनभर पछि लाग्छ। यो मानसिक बोझको प्रतीक हो।`,
    },
    {
      id: 6,
      question: "मानिसको मृत्युमा मित्र को हो?",
      options: ["दान", "धन", "परिवार", "कीर्ति"],
      correctAnswer: "दान",
      explanation: `दान नै मृत्युपछि मित्र हो किनकि यसले पुण्य र यश लिएर जान्छ, 
      जुन अर्को जीवनमा काम आउँछ। धर्मशास्त्रमा यसलाई "अन्तिम साथी" मानिन्छ।`,
    },
    {
      id: 7,
      question: "धर्म, यश र स्वर्ग के हो?",
      options: [
        "धर्म भनेको दक्ष, यश भनेको दान र सोर्ग भनेको सत्य",
        "धर्म भनेको शिक्षा, यश भनेको सम्मान र सोर्ग भनेको शान्ति",
        "धर्म भनेको प्रेम, यश भनेको मित्रता र सोर्ग भनेको समर्पण",
      ],
      correctAnswer: "धर्म भनेको दक्ष, यश भनेको दान र सोर्ग भनेको सत्य",
      explanation: `यसको उत्तर यक्ष-युधिष्ठिर संवादमा आधारित छ:
                  धर्म (नैतिकता) दक्षताले बढाइन्छ।
                  यश (कीर्ति) दानबाट प्राप्त हुन्छ।
                  स्वर्ग सत्यको मार्ग हो।`,
    },
    {
      id: 8,
      question: "मानिसको आत्मा के हो?",
      options: ["कर्म", "नाम", "शरीर", "सन्तान"],
      correctAnswer: "सन्तान",
      explanation: `सन्तान नै आत्मा हो किनकि यो पुर्खाको अस्तित्व र संस्कार लिएर 
      अगाडि बढ्छ। हिन्दू धर्ममा "पुत्र ऋण" भन्ने अवधारणा यसैमा आधारित छ।`,
    },
    {
      id: 9,
      question: "सुख के हो?",
      options: ["राज्य पाउनु", "शीलवान हुनु", "भोगविलास"],
      correctAnswer: "शीलवान हुनु",
      explanation: `शील (नैतिक चरित्र) नै सुखको मूल हो किनकि यसले आत्मिक 
      शान्ति दिन्छ। भौतिक सुख अस्थायी हुन्छ, तर शीलवान व्यक्ति जीवनभर सन्तुष्ट हुन्छ।`,
    },

    {
      id: 11,
      question: "वेदहरू कति छन्?",
      options: ["दुई", "तीन", "चार", "पाँच"],
      correctAnswer: "चार",
      explanation: `चारवटा वेदहरू हुन् – ऋग्वेद, यजुर्वेद, सामवेद, र अथर्ववेद। यी नै हिन्दू धर्मका मूल ग्रन्थ हुन्।`,
    },
    {
      id: 12,
      question: "भगवान बुद्धको जन्म कहाँ भएको थियो?",
      options: ["काशी", "कपिलवस्तु", "लुम्बिनी", "कुशीनगर"],
      correctAnswer: "लुम्बिनी",
      explanation: `भगवान बुद्धको जन्मस्थल नेपालको लुम्बिनी हो, जुन युनेस्को विश्व सम्पदा सूचीमा पनि सूचीकृत छ।`,
    },
    {
      id: 13,
      question: "श्रीमद्भगवद्गीतामा कति अध्याय छन्?",
      options: ["१८", "१६", "२०", "१२"],
      correctAnswer: "१८",
      explanation: `भगवद्गीतामा १८ अध्याय छन्, जसमा अर्जुन र कृष्णबीचको संवाद समावेश छ।`,
    },
    {
      id: 14,
      question: "हिन्दू धर्म अनुसार सृष्टिको रचना कसले गरे?",
      options: ["विष्णु", "शिव", "ब्रह्मा", "इन्द्र"],
      correctAnswer: "ब्रह्मा",
      explanation: `हिन्दू धर्ममा ब्रह्मालाई सृष्टिकर्ता भनिन्छ, विष्णु पालनकर्ता र शिव संहारकर्ता हुन्।`,
    },
    {
      id: 15,
      question: "रामायणका लेखक को हुन्?",
      options: ["व्यास", "वाल्मीकि", "तुलसीदास", "कालीदास"],
      correctAnswer: "वाल्मीकि",
      explanation: `वाल्मीकि ऋषिले संस्कृतमा आदिकाव्य रामायण लेखेका हुन्।`,
    },
    {
      id: 16,
      question: "महाभारतमा कति श्लोक छन्?",
      options: ["एक लाख", "पचास हजार", "दुई लाख", "सत्तरी हजार"],
      correctAnswer: "एक लाख",
      explanation: `महाभारतमा करिब एक लाख श्लोक छन् र यो विश्वकै सबैभन्दा ठूलो महाकाव्य मानिन्छ।`,
    },
    {
      id: 17,
      question: "भगवान शिवलाई कुन फूल मनपर्छ?",
      options: ["गुलाब", "कमल", "धतुरो", "जुही"],
      correctAnswer: "धतुरो",
      explanation: `धतुरो र बेलपत्र भगवान शिवलाई अति प्रिय हुन्छन् र तिनीहरूको पूजा विशेष फलदायी मानिन्छ।`,
    },
    {
      id: 18,
      question: "गायत्री मन्त्र कुन वेदमा पर्छ?",
      options: ["यजुर्वेद", "ऋग्वेद", "सामवेद", "अथर्ववेद"],
      correctAnswer: "ऋग्वेद",
      explanation: `गायत्री मन्त्र ऋग्वेदको तृतीय मण्डलमा पाइन्छ र यो सबैभन्दा पवित्र मन्त्र मानिन्छ।`,
    },
    {
      id: 19,
      question: "‘योग’ शब्दको अर्थ के हो?",
      options: ["भोग", "समाधि", "जोड्नु", "तपस्या"],
      correctAnswer: "जोड्नु",
      explanation: `‘योग’ संस्कृतको ‘युज’ धातुबाट बनेको हो, जसको अर्थ हुन्छ जोड्नु वा एक हुनु।`,
    },
    {
      id: 20,
      question: "हनुमानलाई कुन पर्वतबाट संजीवनी लिन पठाइएको थियो?",
      options: ["कैलाश", "गन्धमादन", "द्रोणगिरि", "मेरु"],
      correctAnswer: "द्रोणगिरि",
      explanation: `लक्ष्मणको प्राण बचाउन हनुमान द्रोणगिरि पर्वतबाट संजीवनी बुटी ल्याएका थिए।`,
    },
    {
      id: 21,
      question: "महाशिवरात्रि कहिले पर्छ?",
      options: [
        "कार्तिक पूर्णिमा",
        "माघ शुक्ल अष्टमी",
        "फागुन कृष्ण चतुर्दशी",
        "बैशाख पूर्णिमा",
      ],
      correctAnswer: "फागुन कृष्ण चतुर्दशी",
      explanation: `महाशिवरात्रि फागुन महिनाको कृष्ण पक्षको चतुर्दशी तिथिमा पर्छ।`,
    },
    {
      id: 22,
      question: "सत्ययुग पछि कुन युग आउँछ?",
      options: ["त्रेता", "द्वापर", "कलियुग", "अव्यक्त"],
      correctAnswer: "त्रेता",
      explanation: `सत्ययुगपछि त्रेतायुग, त्यसपछि द्वापर र अन्तमा कलियुग आउने हिन्दू मान्यता छ।`,
    },
    {
      id: 23,
      question: "हिन्दू धर्म अनुसार गंगा किन स्वर्गबाट पृथ्वीमा आएको हो?",
      options: [
        "शिवको आज्ञाले",
        "भगीरथको तपस्याले",
        "विष्णुको आदेशले",
        "इन्द्रको आग्रहले",
      ],
      correctAnswer: "भगीरथको तपस्याले",
      explanation: `राजा भगीरथको कठिन तपस्यापछि गंगा स्वर्गबाट पृथ्वीमा अवतरित भएको कथा महाभारत र पुराणहरूमा उल्लेख छ।`,
    },
    {
      id: 24,
      question: "पञ्चतत्वमा कुन तत्व पर्दैन?",
      options: ["अग्नि", "वायु", "शून्य", "जल"],
      correctAnswer: "शून्य",
      explanation: `पञ्चतत्वमा पृथ्वी, जल, अग्नि, वायु र आकाश पर्दछन्। शून्य तत्त्व होइन।`,
    },
    {
      id: 25,
      question: "भगवान कृष्णको मुखबाट अर्जुनलाई के देखिन्छ?",
      options: ["वैкун्ठ", "विराटरुप", "स्वर्ग", "नरक"],
      correctAnswer: "विराटरुप",
      explanation: `भगवद्गीतामा कृष्णले अर्जुनलाई आफ्नो विराटरुप देखाएका थिए जसमा सम्पूर्ण विश्व समेटिएको थियो।`,
    },

    {
      id: 26,
      question: "मानिसको आत्मा के हो?",
      options: ["कर्म", "नाम", "शरीर", "सन्तान"],
      correctAnswer: "सन्तान",
      explanation:
        "सन्तान नै आत्मा हो किनकि यो पुर्खाको अस्तित्व र संस्कार लिएर अगाडि बढ्छ। हिन्दू धर्ममा 'पुत्र ऋण' भन्ने अवधारणा यसैमा आधारित छ।",
    },
    {
      id: 27,
      question: "जीवनभन्दा बलियो के हो?",
      options: ["हिमाल", "लोखर्के", "धैर्य", "आगो"],
      correctAnswer: "धैर्य",
      explanation:
        "धैर्यले जीवनका सबै कठिनाइहरू सहन सक्छ। यो शारीरिक शक्तिभन्दा गहिरो मानसिक बल हो।",
    },
    {
      id: 28,
      question: "सबैभन्दा मीठो के हो?",
      options: ["मौन", "मधु", "प्रेम", "ज्ञान"],
      correctAnswer: "मौन",
      explanation:
        "मौन (चुप्पी) सबैभन्दा मीठो हो किनकि यसले झगडा, अपमान, र अहंकारबाट जोगाउँछ।",
    },
    {
      id: 29,
      question: "सबैभन्दा कडा के हो?",
      options: ["हिरा", "इच्छाशक्ति", "लोखर्के", "भक्ति"],
      correctAnswer: "इच्छाशक्ति",
      explanation:
        "इच्छाशक्ति भौतिक वस्तुभन्दा कडा छ किनकि यसले असम्भवलाई सम्भव बनाउँछ।",
    },
    {
      id: 30,
      question: "सबैभन्दा ठूलो दान के हो?",
      options: ["धन", "भूमि", "अभय", "ज्ञान"],
      correctAnswer: "अभय",
      explanation:
        "अभय दान (डरबाट मुक्ति दिने) सर्वश्रेष्ठ हो किनकि यसले मानिसको जीवन नै बदल्छ।",
    },
    {
      id: 31,
      question: "सुखको मूल के हो?",
      options: ["धन", "सन्तुष्टि", "यश", "भोग"],
      correctAnswer: "सन्तुष्टि",
      explanation:
        "सन्तुष्टि नै सुखको मूल हो किनकि यो बाहिरी वस्तुभन्दा आन्तरिक अवस्था हो।",
    },
    {
      id: 32,
      question: "नरकको मूल के हो?",
      options: ["लोभ", "क्रोध", "अज्ञान", "अहंकार"],
      correctAnswer: "लोभ",
      explanation:
        "लोभले मानिसलाई अनैतिक कार्यतिर धकेल्छ, जसले नरकको द्वार खोल्छ।",
    },
    {
      id: 33,
      question: "सबैभन्दा उत्तम धर्म के हो?",
      options: ["यज्ञ", "दान", "दया", "सत्य"],
      correctAnswer: "दया",
      explanation:
        "दया नै सर्वोत्तम धर्म हो किनकि यसले सबै प्राणीहरूप्रति समानता र प्रेम फैलाउँछ।",
    },
    {
      id: 34,
      question: "मृत्युपछि के साथ जान्छ?",
      options: ["धन", "कीर्ति", "कर्म", "परिवार"],
      correctAnswer: "कर्म",
      explanation:
        "कर्म मात्र मृत्युपछि पनि साथ जान्छ र अर्को जन्ममा फल दिन्छ।",
    },
    {
      id: 35,
      question: "सबैभन्दा बलियो बन्धन के हो?",
      options: ["लौरो", "प्रेम", "माया", "संस्कार"],
      correctAnswer: "माया",
      explanation:
        "माया (ममता) ले मानिसलाई जन्म-मृत्युको चक्रमा बाँध्छ, यो नै सबैभन्दा बलियो बन्धन हो।",
    },
    {
      id: 36,
      question: "सबैभन्दा उत्तम ज्ञान के हो?",
      options: ["वेद", "आत्मज्ञान", "विज्ञान", "इतिहास"],
      correctAnswer: "आत्मज्ञान",
      explanation:
        "आत्मज्ञान (आफ्नो वास्तविक स्वरूप बुझ्ने) नै सर्वोत्तम ज्ञान हो किनकि यसले मुक्ति दिन्छ।",
    },

    {
      id: 37,
      question: "सबैभन्दा शान्त स्थान के हो?",
      options: ["हिमाल", "मन्दिर", "मन", "वन"],
      correctAnswer: "मन",
      explanation:
        "शान्ति बाहिर होइन, मनभित्र छ। जसले आफ्नो मन नियन्त्रण गर्छ, उसको नै सबैभन्दा शान्त स्थान हो।",
    },
    {
      id: 38,
      question: "सबैभन्दा बुझ्दार मानिस को हो?",
      options: ["ज्ञानी", "जुनसुकैलाई सिकाउने", "आफूलाई जान्ने", "मौन रहने"],
      correctAnswer: "आफूलाई जान्ने",
      explanation:
        "जसले आफ्नो आत्मालाई चिन्छ, उसले सृष्टिको रहस्य बुझ्छ। 'आत्मज्ञान' नै सर्वोच्च बुद्धिमत्ता हो।",
    },
    {
      id: 39,
      question: "सबैभन्दा ठूलो अज्ञान के हो?",
      options: [
        "अन्धकार",
        "आफ्नो अहंकारलाई नबुझ्नु",
        "वेद नपढ्नु",
        "ईश्वरलाई नमान्नु",
      ],
      correctAnswer: "आफ्नो अहंकारलाई नबुझ्नु",
      explanation:
        "अहंकार ('म' भन्ने भावना) नै सबैभन्दा ठूलो अज्ञान हो किनकि यसले वास्तविक ज्ञानलाई ढाक्छ।",
    },
    {
      id: 40,
      question: "सबैभन्दा सजिलो काम के हो?",
      options: [
        "दोष अरूलाई लगाउनु",
        "आफ्नो कमजोरी नबुझ्नु",
        "धन कमाउनु",
        "यज्ञ गर्नु",
      ],
      correctAnswer: "दोष अरूलाई लगाउनु",
      explanation:
        "अरूलाई दोष दिनु सजिलो छ, तर आफ्नो गल्ती स्वीकार्नु कठिन। यो मानव स्वभावको सबैभन्दा सानो पक्ष हो।",
    },
    {
      id: 41,
      question: "सबैभन्दा कठिन तप के हो?",
      options: ["मौन व्रत", "अन्न त्याग्नु", "क्षमा गर्नु", "हिमालमा बस्नु"],
      correctAnswer: "क्षमा गर्नु",
      explanation:
        "क्षमा नै सबैभन्दा कठिन तप हो किनकि यसले अहंकारलाई पूर्ण रूपमा नष्ट गर्छ।",
    },
    {
      id: 42,
      question: "सबैभन्दा महँगो वस्तु के हो?",
      options: ["हिरा", "स्वर्ण", "समय", "प्रेम"],
      correctAnswer: "समय",
      explanation:
        "समय फर्किएर आउँदैन। यसलाई बचत गर्न सकिन्न, त्यसैले यो सबैभन्दा मूल्यवान वस्तु हो।",
    },
    {
      id: 43,
      question: "सबैभन्दा सस्तो वस्तु के हो?",
      options: ["क्रोध", "अभिमान", "निन्दा", "झूट"],
      correctAnswer: "निन्दा",
      explanation:
        "निन्दा गर्न कुनै लागत पर्दैन, तर यसले समाजमा विष फैलाउँछ। यो मानिसको सबैभन्दा सस्तो स्वभाव हो।",
    },
    {
      id: 44,
      question: "सबैभन्दा उपयोगी वस्तु के हो?",
      options: ["जल", "अग्नि", "शिक्षा", "सत्संग"],
      correctAnswer: "सत्संग",
      explanation:
        "सत्संग (सज्जनको संगत) नै सबैभन्दा उपयोगी छ किनकि यसले चरित्र, ज्ञान, र भक्ति तीनै दिन्छ।",
    },
    {
      id: 45,
      question: "सबैभन्दा निरर्थक वस्तु के हो?",
      options: ["धूलो", "खाली आशा", "अनावश्यक डर", "बिनाकारण झगडा"],
      correctAnswer: "बिनाकारण झगडा",
      explanation:
        "बिनाकारणको झगडाले न त जित हुन्छ न त कुनै फाइदा, यो नै सबैभन्दा निरर्थक कर्म हो।",
    },
    {
      id: 46,
      question: "सबैभन्दा खतरनाक आगो के हो?",
      options: ["क्रोध", "लोभ", "वासना", "ईर्ष्या"],
      correctAnswer: "वासना",
      explanation:
        "वासना (तृष्णा) नै सबैभन्दा खतरनाक आगो हो किनकि यो कहिल्यै नबुझ्ने अग्नि हो।",
    },
    {
      id: 47,
      question: "सबैभन्दा मीठो शब्द के हो?",
      options: ["प्रेम", "मातृभाषा", "सत्य", "मधुर वचन"],
      correctAnswer: "मातृभाषा",
      explanation:
        "मातृभाषामा बोलिएको शब्द हृदयसम्म पुग्छ। यो नै सबैभन्दा मीठो र आत्मिय शब्द हो।",
    },
    {
      id: 48,
      question: "बुद्धको मूल नाम के थियो?",
      options: ["सिद्धार्थ", "अशोक", "अनिरुद्ध", "अजातशत्रु"],
      correctAnswer: "सिद्धार्थ",
      explanation: `बुद्धको जन्मनाम सिद्धार्थ गौतम थियो। बुद्धत्व प्राप्त गरेपछि उनलाई बुद्ध भनियो।`,
    },
    {
      id: 49,
      question: "त्रिशूल कुन देवताको हतियार हो?",
      options: ["विष्णु", "ब्रह्मा", "शिव", "इन्द्र"],
      correctAnswer: "शिव",
      explanation: `त्रिशूल भगवान शिवको प्रमुख अस्त्र हो, जसले सृष्टि, पालन, र संहारलाई जनाउँछ।`,
    },
    {
      id: 50,
      question: "भगवान विष्णुको शैय्या के हो?",
      options: ["कमल", "गरुड", "शेषनाग", "सिंह"],
      correctAnswer: "शेषनाग",
      explanation: `भगवान विष्णु शेषनागमाथि क्षीरसागरमा शयन गरिरहेको चित्रण गरिन्छ।`,
    },
    {
      id: 51,
      question: "नेपालको राष्ट्रिय फूल कुन हो?",
      options: ["गुलाब", "लालीगुराँस", "कमल", "चम्पा"],
      correctAnswer: "लालीगुराँस",
      explanation: `लालीगुराँस नेपालकै राष्ट्रिय फूल हो, जुन हिमाली भेगमा धेरै पाइन्छ।`,
    },
    {
      id: 52,
      question: "भगवान गणेशको वाहन के हो?",
      options: ["सिंह", "मुसा", "मयूर", "गरुड"],
      correctAnswer: "मुसा",
      explanation: `भगवान गणेशको वाहन मुसा हो, जसलाई मूषक भनिन्छ।`,
    },
    {
      id: 53,
      question: "सीता माता कुन जनककी छोरी हुन्?",
      options: ["विदेह जनक", "राजा दशरथ", "राजा हरिश्चन्द्र", "राजा भरत"],
      correctAnswer: "विदेह जनक",
      explanation: `सीता माता विदेह जनकको पुत्री थिइन् जसलाई मिथिलाका जनक भनेर चिनिन्छ।`,
    },
    {
      id: 54,
      question: "भगवान विष्णुको दशावतारमा पहिलो अवतार कुन हो?",
      options: ["कूर्म", "वराह", "मत्स्य", "नरसिंह"],
      correctAnswer: "मत्स्य",
      explanation: `मत्स्य (माछा) भगवान विष्णुको पहिलो अवतार हो, जसले प्रलयमा मनुलाई बचाएका थिए।`,
    },
    {
      id: 55,
      question: "‘ओम’ को अर्थ के हो?",
      options: ["शक्ति", "ध्वनि", "सृष्टिको मूलध्वनि", "ज्ञान"],
      correctAnswer: "सृष्टिको मूलध्वनि",
      explanation: `‘ओम’ लाई सृष्टिको आदि ध्वनि वा ब्रह्मको प्रतीक मानिन्छ।`,
    },
    {
      id: 56,
      question: "महाभारतको युद्ध कति दिनसम्म चल्यो?",
      options: ["१०", "१८", "२०", "१५"],
      correctAnswer: "१८",
      explanation: `कुरुक्षेत्रको महाभारत युद्ध १८ दिनसम्म चलेको थियो।`,
    },
    {
      id: 57,
      question: "रामको भाइ लक्ष्मणको पत्नी को थिइन्?",
      options: ["सिता", "उर्मिला", "मन्दोदरी", "तारा"],
      correctAnswer: "उर्मिला",
      explanation: `लक्ष्मणको पत्नी उर्मिला थिइन्, जो जनकनन्दिनी सीताको बहिनी थिइन्।`,
    },
    {
      id: 58,
      question: "‘निर्वाण’ शब्द कुन धर्मसँग सम्बन्धित छ?",
      options: ["जैन", "हिन्दू", "बौद्ध", "सिख"],
      correctAnswer: "बौद्ध",
      explanation: `‘निर्वाण’ शब्द बौद्ध धर्ममा प्रमुख छ, जसको अर्थ जन्ममृत्युको चक्रबाट मुक्त हुनु हो।`,
    },
    {
      id: 59,
      question: "भगवान शिवको नृत्यलाई के भनिन्छ?",
      options: ["ताण्डव", "रास", "नृत्ययोग", "कथक"],
      correctAnswer: "ताण्डव",
      explanation: `भगवान शिवको नृत्यलाई ताण्डव भनिन्छ, जसले सृष्टिको संहार र पुनर्निर्माण जनाउँछ।`,
    },
    {
      id: 60,
      question: "दशहरा पर्व कसको विजयको प्रतीक हो?",
      options: [
        "रामको रावणमाथि विजय",
        "कृष्णको कंसमाथि विजय",
        "दुर्गाको महिषासुरमाथि विजय",
        "हनुमानको मेघनादमाथि विजय",
      ],
      correctAnswer: "रामको रावणमाथि विजय",
      explanation: `दशहरा रामले रावणमाथि विजय प्राप्त गरेको दिनको रूपमा मनाइन्छ।`,
    },
    {
      id: 61,
      question: "भगवान विष्णुको कछुवा अवतारलाई के भनिन्छ?",
      options: ["मत्स्य", "कूर्म", "वराह", "नरसिंह"],
      correctAnswer: "कूर्म",
      explanation: `कूर्म अवतारमा भगवान विष्णुले कछुवाको रूप लिएका थिए जसले मन्थनमा मेरु पर्वतलाई थामेका थिए।`,
    },
    {
      id: 62,
      question: "धर्मग्रन्थ अनुसार गाईलाई के भनिन्छ?",
      options: ["धन", "जननी", "कामधेनु", "लक्ष्मी"],
      correctAnswer: "कामधेनु",
      explanation: `गाईलाई कामधेनु भनिन्छ जसले सबै कामना पुरा गर्ने क्षमताको प्रतीक मानिन्छ।`,
    },
    {
      id: 63,
      question: "अर्जुनका गुरु को थिए?",
      options: ["व्यास", "भीष्म", "द्रोणाचार्य", "कृष्ण"],
      correctAnswer: "द्रोणाचार्य",
      explanation: `अर्जुनका गुरु द्रोणाचार्य थिए जसले उनलाई धनुर्विद्या सिकाएका थिए।`,
    },
    {
      id: 64,
      question: "नेपालको राष्ट्रिय जनावर कुन हो?",
      options: ["भैंसी", "गाई", "चौंरी", "बाघ"],
      correctAnswer: "चौंरी",
      explanation: `चौंरी नेपालमा हिमाली भेगमा पाइने राष्ट्रिय जनावर हो।`,
    },
    {
      id: 65,
      question: "‘श्राद्ध’ कर्म केका लागि गरिन्छ?",
      options: ["विवाह", "पुजा", "पितृको तर्पण", "नवग्रह शान्ति"],
      correctAnswer: "पितृको तर्पण",
      explanation: `श्राद्ध पितृहरूलाई तर्पण गरी तिनीहरूको शान्ति र आशीर्वादका लागि गरिन्छ।`,
    },
    {
      id: 66,
      question: "कुन पर्वमा देउसी भैली खेलिन्छ?",
      options: ["तिहार", "दशैं", "होली", "छठ"],
      correctAnswer: "तिहार",
      explanation: `तिहारमा देउसी भैली खेलिन्छ, विशेषगरी लक्ष्मीपूजाको बेलामा।`,
    },
    {
      id: 67,
      question: "रामायण अनुसार रावणको कुल कति शिर थियो?",
      options: ["पाँच", "सात", "दश", "बारह"],
      correctAnswer: "दश",
      explanation: `रावणलाई दशानन भनिन्छ, जसको अर्थ दश शिर भएको व्यक्ति हो।`,
    },
    {
      id: 68,
      question: "महाभारतमा कर्णको पिता को थिए?",
      options: ["द्रोण", "अर्जुन", "सूर्य", "कृष्ण"],
      correctAnswer: "सूर्य",
      explanation: `कर्ण सूर्यदेवका पुत्र थिए, उनको जन्म कुंतीको गर्भबाट सूर्यको आशीर्वादले भएको थियो।`,
    },
    {
      id: 69,
      question: "कुन युग अहिले चलिरहेको छ?",
      options: ["सत्ययुग", "त्रेतायुग", "द्वापरयुग", "कलियुग"],
      correctAnswer: "कलियुग",
      explanation: `वर्तमानमा कलियुग चलिरहेको हिन्दू धर्ममा मानिन्छ।`,
    },
    {
      id: 70,
      question: "तपाईंको कर्म के निर्धारण गर्छ?",
      options: ["भाग्य", "समय", "कर्म स्वयं", "भगवान"],
      correctAnswer: "कर्म स्वयं",
      explanation: `हिन्दू दर्शन अनुसार कर्म नै भविष्य निर्धारण गर्छ, भाग्य पनि कर्मको परिणाम हो।`,
    },
    {
      id: 71,
      question: "‘सत्यमेव जयते’ भन्ने वाक्य कहाँबाट लिइएको हो?",
      options: ["रामायण", "महाभारत", "ऋग्वेद", "मुण्डक उपनिषद"],
      correctAnswer: "मुण्डक उपनिषद",
      explanation: `‘सत्यमेव जयते’ मुण्डक उपनिषदको मंत्र हो जसको अर्थ सत्यको नै विजय हुन्छ।`,
    },
    {
      id: 72,
      question: "नेपालको राष्ट्रिय पंक्षी कुन हो?",
      options: ["राजधनेश", "डाँफे", "लाटोकोसेरो", "सुनचरी"],
      correctAnswer: "डाँफे",
      explanation: `डाँफे नेपालकाे राष्ट्रिय पंक्षी हो, जसलाई हिमालयन मोनाल पनि भनिन्छ।`,
    },
  ];
  // Timer effect
  useEffect(() => {
    if (!timerActive || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleNextQuestion();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, timerActive, quizCompleted]);

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQuestion?.correctAnswer;
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setTimerActive(false);

    // Store attempted question with selected answer for results later
    setAttemptedQuestions((prev) => [
      ...prev,
      {
        ...currentQuestion,
        options: [], // clear options as unnecessary for result display
        explanation: currentQuestion.explanation,
        correctAnswer: currentQuestion.correctAnswer,
        selectedAnswer: answer,
      },
    ]);

    if (answer === currentQuestion.correctAnswer) {
      setScore(score + 1);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      setQuizCompleted(true);
      setShowResult(true);
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setTimerActive(true);
      setTimeLeft(30);
    }
  };

  const handleQuitQuiz = () => {
    setShowResult(true);
    setQuizCompleted(true);
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setQuizCompleted(false);
    setTimerActive(true);
    setTimeLeft(30);
    setAttemptedQuestions([]);
  };

  if (showResult) {
    return (
      <div className="quiz-container">
        <div className="quiz-result-card">
          <h1 className="quiz-result-title">प्रश्नोत्तरीको परिणाम</h1>
          <div className="quiz-result-summary">
            <p className="quiz-result-score">
              तपाईंले <span>{quizQuestions.length}</span> मध्ये{" "}
              <span className="score">{score}</span> पाउनुभयो
            </p>
            <p className="quiz-result-percentage">
              यो{" "}
              <span>{Math.round((score / quizQuestions.length) * 100)}%</span>{" "}
              सही हो !!
            </p>

            <div className="quiz-attempted-questions">
              {attemptedQuestions.map((q, index) => (
                <div key={q.id} className="quiz-attempted-question">
                  <p className="question-text">
                    {index + 1}. {q.question}
                  </p>
                  <p
                    className={`selected-answer ${
                      q.selectedAnswer === q.correctAnswer
                        ? "correct"
                        : "incorrect"
                    }`}
                  >
                    तपाईंको उत्तर: {q.selectedAnswer}
                  </p>
                  <p className="correct-answer">सही उत्तर: {q.correctAnswer}</p>
                  {q.explanation && (
                    <p className="question-explanation">{q.explanation}</p>
                  )}
                </div>
              ))}
            </div>

            <button onClick={restartQuiz} className="quiz-restart-button">
              फेरि प्रयास गर्नुहोस्
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-card">
        <div className="quiz-header">
          <div className="quiz-progress">
            प्रश्न {currentQuestionIndex + 1}/{quizQuestions.length}
          </div>
          <div className="quiz-timer">
            <div className="timer-bar">
              <div
                className="timer-progress"
                style={{ width: `${(timeLeft / 30) * 100}%` }}
              />
            </div>
            <span className="timer-count">{timeLeft}s</span>
          </div>
        </div>

        <h2 className="quiz-question">{currentQuestion.question}</h2>

        <div className="quiz-options">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswer === option;
            let optionClass = "option-button";

            if (selectedAnswer) {
              if (option === currentQuestion.correctAnswer) {
                optionClass += " correct";
              } else if (isSelected && !isCorrect) {
                optionClass += " incorrect";
              }
            }

            return (
              <button
                key={index}
                onClick={() => !selectedAnswer && handleAnswerSelect(option)}
                disabled={!!selectedAnswer}
                className={optionClass}
              >
                {option}
              </button>
            );
          })}
        </div>

        {selectedAnswer && (
          <div className="quiz-feedback">
            {isCorrect ? (
              <p className="feedback-correct">✅ सही! राम्रो गर्नुभयो!!</p>
            ) : (
              <div>
                <p className="feedback-incorrect">❌ गलत</p>
                <p className="feedback-correct-answer">
                  सही उत्तर हो:: <span>{currentQuestion.correctAnswer}</span>
                </p>
                {currentQuestion.explanation && (
                  <p className="feedback-explanation">
                    {currentQuestion.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="quiz-footer">
          <button onClick={handleQuitQuiz} className="quit-button">
            प्रश्नोत्तरी छोड्नुहोस्
          </button>
          {selectedAnswer && (
            <button onClick={handleNextQuestion} className="next-button">
              {isLastQuestion ? "परिणाम हेर्नुहोस्" : "अर्को प्रश्न"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
