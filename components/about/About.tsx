import "./about.css";

const AboutPage = () => {
  return (
    <div className="intro-container">
      {/* Header with Full-Width Image */}
      <div className="full-width-image">
        <img src="/images/buba-2.jpg" alt="Buba" />
      </div>

      <div className="namaste-header">
        <h1>नमस्ते र हार्दिक स्वागत छ</h1>
        <div className="divider-line"></div>
      </div>

      {/* Main Introduction Content */}
      <div className="intro-content">
        <p className="intro-text">
          यो डिजिटल संसारमा मेरो जीवनका अनुभव, स्मृतिहरू र विचारहरूको सङ्ग्रह
          हो। ...
        </p>

        <p className="intro-text">
          मैले बाल्यकालदेखि नै प्रविधिको विकासको साक्षी बनेको छु ...
        </p>

        <div className="nepali-quote">
          <p>
            "जीवनको सबैभन्दा ठूलो शिक्षा भनेको निरन्तर सिक्ने बानी हो। <br />
            ८३ वर्षको उमेरमा पनि म हरेक दिन नयाँ कुरा सिक्दैछु।"
          </p>
        </div>

        <p className="intro-text">
          यहाँ तपाईंले मेरा लेख, फोटो, र भिडियोहरू पाउनुहुनेछ ...
        </p>
      </div>

      {/* Blessing Footer */}
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
