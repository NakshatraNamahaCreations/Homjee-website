import React from "react";

// Add Google Fonts Poppins once dynamically
const addGoogleFonts = () => {
  if (!document.getElementById("poppins-font")) {
    const link = document.createElement("link");
    link.id = "poppins-font";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap";
    document.head.appendChild(link);
  }
};
addGoogleFonts();

const PrivacyPolicy = () => {
  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "2rem 4vw",
        boxSizing: "border-box",
        color: "#555",
        lineHeight: 1.65,
        fontSize: 14,
      }}
    >
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          padding: "2rem 2.5rem",
          maxWidth: "100%",
          minWidth: 320,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            fontWeight: 600,
            fontSize: "2.4rem",
            color: "#222",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Privacy Policy
        </h1>

        <p>
          Your privacy is critically important to us at Homjee. This Privacy Policy outlines how Homjee ("we", "us", or "our") collects, uses, discloses, and protects your information when you use our website (the "Website") to book home services in Pune and Bengaluru.
        </p>

        <p>
          By using the Homjee Website, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this Privacy Policy, please do not use our Website.
        </p>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            1. Information We Collect
          </h3>
          <p>We collect various types of information from and about users of our Website, which may include:</p>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>
              <strong>Personal Information:</strong> This is information that can be used to identify you directly or indirectly. We collect:
              <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                <li>Contact Information: Your full name, phone number, and email address.</li>
                <li>Service Address: The address where you wish to receive the services.</li>
              </ul>
            </li>
            <li>
              <strong>Payment Information:</strong> When you make a payment for services, we collect information related to your transaction, such as the amount paid and the payment method used. Please note: While we facilitate payments through verified payment gateway links, we do not directly store your sensitive financial details (e.g., credit card numbers) on our servers. These are handled securely by our third-party payment gateway.
            </li>
            <li>
              <strong>Usage Data:</strong> Information about how you access and use the Website, such as your IP address, browser type, operating system, referring URLs, pages visited, and the dates and times of your visits.
            </li>
            <li>
              <strong>Communication Data:</strong> Records of communications when you contact us for support, feedback, or inquiries.
            </li>
          </ul>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            2. How We Collect Your Information
          </h3>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li><strong>Directly from You:</strong> When you fill out forms on our Website to book a service or contact us, you provide your name, phone number, and address.</li>
            <li><strong>Automatically:</strong> As you navigate through our Website, we may use technologies like cookies and web beacons to collect certain information automatically. This helps us understand user behavior and improve our Website.</li>
          </ul>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            3. How We Use Your Information
          </h3>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li>
              <strong>To Provide and Manage Services:</strong>
              <ul style={{ paddingLeft: 20, marginTop: 4 }}>
                <li>To process your service bookings and fulfill your requests.</li>
                <li>To communicate with you about your bookings, confirmations, changes, and updates via your provided phone number (including WhatsApp) and email address.</li>
                <li>To connect you with suitable Service Partners for your requested services.</li>
              </ul>
            </li>
            <li><strong>For Communication:</strong> To respond to your inquiries, provide customer support, and send you important notices.</li>
            <li><strong>For Payment Processing:</strong> To facilitate secure payments for services through our verified payment gateway.</li>
            <li><strong>For Website Improvement:</strong> To understand how users interact with our Website, identify areas for improvement, and enhance user experience.</li>
            <li><strong>For Security and Fraud Prevention:</strong> To protect our Website, users, and Service Partners from fraudulent activities and to ensure the security of our services.</li>
            <li><strong>For Legal Compliance:</strong> To comply with applicable laws, regulations, and legal processes.</li>
          </ul>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            4. Disclosure of Your Information
          </h3>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li> <strong>With Service Partners:</strong> We share your name, phone number, and service address with the relevant Service Partner(s) to enable them to perform the services you have booked.</li>
            <li> <strong>With Payment Gateways:</strong> Your payment information is shared with our secure third-party payment gateway to process your transactions.</li>
            <li> <strong>With Service Providers:</strong> We may engage third-party companies and individuals to facilitate our Website and services (e.g., website hosting, analytics, customer support). These third parties will have access to your information only to perform these tasks on our behalf and are obligated not to disclose or use it for any other purpose.</li>
            <li> <strong>For Legal Reasons:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court order or government agency).</li>
            <li> <strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction. We will notify you via a prominent notice on our Website if such a transfer occurs and your information becomes subject to a different privacy policy.</li>
          </ul>
          <p>We do not sell, rent, or trade your personal information to third parties for their marketing purposes.</p>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            5. Data Security
          </h3>
          <p>
            We are committed to protecting the security of your information. We implement a variety of security measures, including physical, electronic, and procedural safeguards, to protect your personal information from unauthorized access, use, or disclosure. However, please remember that no method of transmission over the Internet or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your information, we cannot guarantee its absolute security.
          </p>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            6. Data Retention
          </h3>
          <p>
            We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including for the purposes of satisfying any legal, accounting, or reporting requirements. When we no longer need your information, we will securely delete or anonymize it.
          </p>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            7. Your Choices and Rights
          </h3>
          <ul style={{ paddingLeft: 20, marginTop: 6 }}>
            <li><strong>Accessing and Correcting Your Information:</strong> If you wish to review, update, or correct your personal information, please contact us at <a href="mailto:hello@homjee.com" style={{ color: "#0d6efd" }}>hello@homjee.com</a>.</li>
            <li><strong>Opt-Out of Communications:</strong> If you no longer wish to receive non-essential communications from us (e.g., promotional messages), you may opt-out by contacting us. Please note that we may still send you essential communications related to your service bookings.</li>
          </ul>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            8. Third-Party Links
          </h3>
          <p>
            Our Website may contain links to other websites that are not operated by us. If you click on a third-party link, you will be directed to that third party's site. We strongly advise you to review the Privacy Policy of every site you visit. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.
          </p>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            9. Children's Privacy
          </h3>
          <p>
            Our Website is not intended for individuals under the age of 18. We do not knowingly collect personally identifiable information from anyone under the age of 18. If you are a parent or guardian and you are aware that your child has provided us with personal information, please contact us. If we become aware that we have collected personal information from a child without verification of parental consent, we take steps to remove that information from our servers.
          </p>
        </section>

        <section style={{ marginTop: 32 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            10. Changes to This Privacy Policy
          </h3>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page. We encourage you to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
          </p>
        </section>

        <section style={{ marginTop: 32, marginBottom: 40 }}>
          <h3 style={{ fontWeight: 600, fontSize: "1.25rem", color: "#222" }}>
            11. Contact Us
          </h3>
          <p>
            If you have any questions about this Privacy Policy, please contact us at <a href="mailto:hello@homjee.com" style={{ color: "#0d6efd" }}>hello@homjee.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
