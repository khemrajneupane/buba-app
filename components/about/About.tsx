import "./about.css";

const AboutPage = () => {
  return (
    <div className="intro-container">
      {/* Header with Photo Placeholders */}
      <div className="header-with-photos">
        <div className="photo-placeholder right">
          <img src="/images/buba-2.jpg" />
        </div>
        <div className="namaste-header">
          <h1>नमस्ते र हार्दिक स्वागत छ</h1>
          <div className="divider-line"></div>
        </div>
      </div>

      {/* Main Introduction Content */}
      <div className="intro-content">
        <p className="intro-text">
          यो डिजिटल संसारमा मेरो जीवनका अनुभव, स्मृतिहरू र विचारहरूको सङ्ग्रह
          हो। आठ दशकभन्दा बढीको यात्रामा देखेका दृश्य, बुझेका सीप, र सिकेका
          जीवनका मूल्यहरू यहाँ समेटिएका छन्।
        </p>

        <p className="intro-text">
          मैले बाल्यकालदेखि नै प्रविधिको विकासको साक्षी बनेको छु - टेलिफोनको
          आविष्कारदेखि स्मार्टफोनको युगसम्म, कागजको डायरीदेखि डिजिटल संसारसम्म।
          यो वेबसाइट मेरो त्यही ज्ञान र अनुभवको प्रतिबिम्ब हो।
        </p>

        <div className="nepali-quote">
          <p>
            "जीवनको सबैभन्दा ठूलो शिक्षा भनेको निरन्तर सिक्ने बानी हो। <br />
            ८३ वर्षको उमेरमा पनि म हरेक दिन नयाँ कुरा सिक्दैछु।"
          </p>
        </div>

        <p className="intro-text">
          यहाँ तपाईंले मेरा लेख, फोटो, र भिडियोहरू पाउनुहुनेछ जुन मैले आफ्नो
          जीवनभरिका अनुभवहरूबाट संकलन गरेको छु। मलाई आशा छ यी कुराहरूले नयाँ
          पुस्तालाई पनि केही सिकाउनेछन्।
        </p>
      </div>

      {/* Traditional Blessing Footer */}
      <div className="blessing-footer">
        <p className="signature">
          सबैलाई शुभकामना सहित,
          <br />
          <span className="name">घनश्याम न्यौपाने</span>
        </p>
        <p className="origin">नेपालको भोजपुर जिल्ला, दिङ्ला</p>
      </div>
    </div>
  );
};
export default AboutPage;
