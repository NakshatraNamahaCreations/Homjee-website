import React from "react";

// Dynamically add Google Fonts Poppins once
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

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Introduction and Scope of Services",
      content: (
        <>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
            Homjee ("we", "us", or "our") provides an online platform that connects
            users ("you" or "customer") with independent third-party service
            providers ("Service Partners") for various home services in Pune and
            Bengaluru, including:
          </p>
          <ul
            style={{
              color: "#555",
              fontSize: 14,
              paddingLeft: 20,
              marginTop: 6,
              marginBottom: 12,
            }}
          >
            <li>House Painting</li>
            <li>Deep Cleaning</li>
            <li>Home Interiors</li>
            <li>Packers & Movers</li>
          </ul>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
            Homjee acts solely as an intermediary to facilitate the booking of these
            services. We do not directly provide the services ourselves. The actual
            services are performed by our Service Partners.
          </p>
        </>
      ),
    },
    {
      title: "2. Acceptance of Terms",
      content: (
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
          By accessing and using the Homjee Website, you acknowledge that you have read,
          understood, and agree to be bound by these Terms, along with our Privacy
          Policy. These Terms constitute a legally binding agreement between you and
          Homjee.
        </p>
      ),
    },
    {
      title: "3. Your Information and Communication",
      content: (
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
          To book services, we collect your name, phone number, and address. This
          information is used solely to communicate with you regarding your service
          requests and to facilitate the service delivery. You are responsible for
          providing accurate and complete information.
        </p>
      ),
    },
    {
      title: "4. Service Booking and Payments",
      content: (
        <ul
          style={{
            color: "#555",
            fontSize: 14,
            paddingLeft: 20,
            lineHeight: 1.6,
          }}
        >
          <li>
            <strong>Booking Process:</strong> You can book services through the Homjee
            Website by selecting the desired service, date, time, and providing
            necessary details.
          </li>
          <li>
            <strong>Pricing:</strong> Prices for services will be displayed on the
            Website. These prices are subject to change without prior notice but will
            be confirmed before you finalize your booking.
          </li>
          <li>
            <strong>Payment:</strong> Payments for services booked through Homjee must
            be made via our verified payment gateway payment links. These links will
            be shared with you through our official communication methods, such as our
            verified WhatsApp account, or payments can be made directly on our Website.
            We do not accept payments in cash or cheques. Any payments made directly to
            Service Partners or vendors outside of our official channels are at your
            own risk, and Homjee will not be responsible for such services.
          </li>
          <li>
            <strong>Cancellations and Rescheduling:</strong>
            <ul
              style={{
                listStyleType: "circle",
                marginTop: 6,
                marginBottom: 6,
                marginLeft: 20,
              }}
            >
              <li>
                <em>Customer Initiated:</em> You may cancel or reschedule a booking
                subject to our cancellation policy, which will be clearly communicated
                during the booking process. Late cancellations or no-shows may incur
                charges.
              </li>
              <li>
                <em>Service Partner Initiated:</em> In rare instances, a Service Partner
                may need to cancel or reschedule a booking due to unforeseen
                circumstances. We will notify you promptly and assist in finding an
                alternative Service Partner or rescheduling.
              </li>
            </ul>
          </li>
          <li>
            <strong>Refunds:</strong> Refunds will be processed according to our Refund
            Policy, which will be communicated upon request.
          </li>
        </ul>
      ),
    },
    {
      title: "5. Service Delivery",
      content: (
        <ul
          style={{
            color: "#555",
            fontSize: 14,
            paddingLeft: 20,
            lineHeight: 1.6,
          }}
        >
          <li>
            <strong>Service Partner Role:</strong> The Service Partner is solely
            responsible for the quality, safety, and performance of the services they
            provide.
          </li>
          <li>
            <strong>Customer Cooperation:</strong> You agree to provide a safe working
            environment for the Service Partner and cooperate with them to facilitate
            the timely and efficient completion of the service. This includes providing
            necessary access, utilities (e.g., water, electricity), and information.
          </li>
          <li>
            <strong>Quality Assurance:</strong> While Homjee strives to onboard only
            highly-rated Service Partners, we are not responsible for direct acts or
            omissions of Service Partners. However, we hold the payments for the
            service provider until the satisfactory completion of the work. We ensure
            that payments are released to Service Partners only after you confirm that
            the work has been completed to your satisfaction. We encourage you to
            provide feedback and ratings, which help us maintain service quality.
          </li>
          <li>
            <strong>Disputes:</strong> In case of a dispute regarding service quality,
            please contact Homjee customer support. We will act as a mediator to
            resolve the issue between you and the Service Partner, but we are not liable
            for the outcome.
          </li>
        </ul>
      ),
    },
    {
      title: "6. Limitation of Liability",
      content: (
        <ul
          style={{
            color: "#555",
            fontSize: 14,
            paddingLeft: 20,
            lineHeight: 1.6,
          }}
        >
          <li>
            Homjee acts solely as a technology platform to connect users with Service
            Partners. We are not responsible for, and expressly disclaim all liability
            for, the acts, errors, omissions, representations, warranties, breaches, or
            negligence of any Service Partner or for any personal injuries, death,
            property damage, or other damages or expenses resulting therefrom.
          </li>
          <li>
            In no event shall Homjee, its affiliates, directors, employees, or agents be
            liable for any direct, indirect, incidental, special, consequential, or
            punitive damages, including but not limited to, loss of profits, data, use,
            goodwill, or other intangible losses, resulting from (i) your access to or
            use of or inability to access or use the Website; (ii) any conduct or
            content of any third party on the Website; (iii) any content obtained from
            the Website; and (iv) unauthorized access, use, or alteration of your
            transmissions or content, whether based on warranty, contract, tort
            (including negligence), or any other legal theory, whether or not we have
            been informed of the possibility of such damage.
          </li>
          <li>
            Homjee's total liability to you for any cause whatsoever, and regardless of
            the form of the action, will at all times be limited to the amount paid by
            you for the service in question.
          </li>
        </ul>
      ),
    },
    {
      title: "7. Indemnification",
      content: (
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
          You agree to defend, indemnify, and hold harmless Homjee, its affiliates,
          licensors, and service providers, and its and their respective officers,
          directors, employees, contractors, agents, licensors, suppliers, successors,
          and assigns from and against any claims, liabilities, damages, judgments,
          awards, losses, costs, expenses, or fees (including reasonable attorneys'
          fees) arising out of or relating to your violation of these Terms or your use
          of the Website, including, but not limited to, any use of the Website's
          content, services, and products other than as expressly authorized in these
          Terms.
        </p>
      ),
    },
    {
      title: "8. Intellectual Property Rights",
      content: (
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
          All content on the Homjee Website, including text, graphics, logos, images,
          software, and their selection and arrangement, is the exclusive property of
          Homjee or its licensors and is protected by intellectual property laws. You
          may not reproduce, distribute, modify, create derivative works of, publicly
          display, publicly perform, republish, download, store, or transmit any of the
          material on our Website, except as generally and ordinarily permitted through
          the Website's functionality.
        </p>
      ),
    },
    {
      title: "9. Governing Law and Dispute Resolution",
      content: (
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
          These Terms shall be governed by and construed in accordance with the laws of
          India, without regard to its conflict of law principles. Any dispute or claim
          arising out of or in connection with these Terms or your use of the Website
          shall be subject to the exclusive jurisdiction of the courts in Pune,
          Maharashtra, India.
        </p>
      ),
    },
    {
      title: "10. Changes to Terms",
      content: (
        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
          Homjee reserves the right to modify or revise these Terms at any time, in our
          sole discretion. We will notify you of any changes by posting the updated
          Terms on the Website. Your continued use of the Website after any such changes
          constitutes your acceptance of the new Terms.
        </p>
      ),
    },
    {
      title: "11. Miscellaneous",
      content: (
        <ul
          style={{
            color: "#555",
            fontSize: 14,
            paddingLeft: 20,
            lineHeight: 1.6,
          }}
        >
          <li>
            <strong>Entire Agreement:</strong> These Terms, together with our Privacy
            Policy, constitute the entire agreement between you and Homjee regarding
            your use of the Website.
          </li>
          <li>
            <strong>Severability:</strong> If any provision of these Terms is held to be
            invalid or unenforceable, the remaining provisions will remain in full force
            and effect.
          </li>
          <li>
            <strong>Waiver:</strong> No waiver of any term of these Terms shall be deemed
            a further or continuing waiver of such term or any other term.
          </li>
          <li>
            <strong>Contact Information:</strong> For any questions regarding these Terms
            or our services, please contact us at{" "}
            <a href="mailto:hello@homjee.com" style={{ color: "#0d6efd" }}>
              hello@homjee.com
            </a>
            .
          </li>
        </ul>
      ),
    },
  ];

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
        padding: "2rem 4vw",
        boxSizing: "border-box",
      }}
    >
      

      {/* Terms content box */}
      <div
        style={{
          backgroundColor: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          padding: "2rem 2.5rem",
          boxSizing: "border-box",
          maxWidth: "100%",
          minWidth: 320,
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
          Terms and Conditions
        </h1>

        <p style={{ fontSize: 14, color: "#555", lineHeight: 1.65 }}>
          Welcome to Homjee! These Terms and Conditions ("Terms") govern your access to
          and use of the Homjee website (the "Website"), and the services we provide.
          By accessing or using our Website, you acknowledge that you have read,
          understood, and agree to be bound by these Terms. If you do not agree with
          any part of these Terms, please do not use our Website or services.
        </p>

        {sections.map(({ title, content }, i) => (
          <section key={i} style={{ marginTop: 32 }}>
            <h3
              style={{
                fontWeight: 600,
                fontSize: "1.25rem",
                color: "#222",
              }}
            >
              {title}
            </h3>
            {content}
          </section>
        ))}
      </div>
    </div>
  );
};

export default TermsAndConditions;
