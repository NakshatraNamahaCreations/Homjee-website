import React, { useEffect } from "react";

const About = () => {
  // Load Poppins font once on mount
  useEffect(() => {
    if (!document.getElementById("poppins-font")) {
      const link = document.createElement("link");
      link.id = "poppins-font";
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap";
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div
      style={{
        fontFamily: "'Poppins', sans-serif",
        color: "#222",
        backgroundColor: "#fff",
        width: "100vw",
        padding: "60px 6vw",
        boxSizing: "border-box",
        lineHeight: 1.65,
      }}
    >
      {/* Title */}
      <h1
        style={{
          color: "#d32f2f", // red headings only
          fontWeight: 700,
          fontSize: "3rem",
          marginBottom: 10,
          textAlign: "center",
        }}
      >
        About Us
      </h1>

      {/* Subtitle */}
      <p
        style={{
          fontWeight: 600,
          fontSize: "1.3rem",
          textAlign: "center",
          marginBottom: 40,
          letterSpacing: 1,
          color: "#222", // changed from blue to black
        }}
      >
        Your Trusted Partner for Home Services in Pune & Bengaluru
      </p>

      {/* Top image */}
      <div
        style={{
          textAlign: "center",
          marginBottom: 50,
        }}
      >
        <img
          src="https://images.unsplash.com/photo-1581579189317-3ed982f48142?auto=format&fit=crop&w=900&q=80"
          alt="Home cleaning service"
          style={{
            width: "100%",
            maxWidth: 900,
            borderRadius: 12,
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
            objectFit: "cover",
            height: 350,
            display: "block",
            margin: "auto",
          }}
          loading="lazy"
        />
      </div>

      {/* Content sections */}
      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            color: "#d32f2f",
            fontWeight: 600,
            fontSize: "1.9rem",
            marginBottom: 15,
          }}
        >
          Welcome to Homjee !!
        </h2>
        <p style={{ fontSize: 17, color: "#222" }}>
          We are your one-stop solution for reliable, high-quality home services in Pune and Bengaluru.
          Built on the principles of trust, transparency, and customer satisfaction, we aim to redefine your
          experience with home maintenance and enhancement.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            color: "#d32f2f",
            fontWeight: 600,
            fontSize: "1.9rem",
            marginBottom: 15,
          }}
        >
          Our Story & Vision:
        </h2>
        <p style={{ fontSize: 17, color: "#222", marginBottom: 12 }}>
          At Homjee, we understand the challenges of finding dependable and skilled professionals for your home needs.
          Whether it's the excitement of transforming your space with a fresh coat of paint, the relief of a sparkling clean home,
          the dream of a beautifully designed interior, or the stress-free transition of moving, you deserve services that are efficient,
          professional, and delivered with care.
        </p>
        <p style={{ fontSize: 17, color: "#222" }}>
          That's why we founded Homjee – to bridge the gap between discerning homeowners and top-tier service providers.
          Our vision is to empower you with convenience and peace of mind, knowing that your home is in the hands of experts.
          We are committed to simplifying your life by offering a seamless platform to book, manage, and experience exceptional home services.
        </p>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            color: "#d32f2f",
            fontWeight: 600,
            fontSize: "1.9rem",
            marginBottom: 15,
          }}
        >
          How We Work:
        </h2>
        <ul
          style={{
            fontSize: 17,
            color: "#222", // black text
            paddingLeft: 24,
            listStyleType: "disc",
          }}
        >
          <li style={{ marginBottom: 12 }}>
            <strong>Verified Professionals:</strong> We rigorously vet and onboard only experienced,
            background-checked, and highly-rated service partners. Each professional on our platform is skilled in their respective domain and committed to delivering excellence.
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Transparent Pricing:</strong> Say goodbye to hidden costs. We provide clear, upfront pricing
            for all our services, allowing you to make informed decisions without any surprises.
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Effortless Booking:</strong> Our user-friendly website makes booking a service incredibly simple.
            Just a few clicks, and your appointment is confirmed at your preferred time and date.
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Quality Assurance:</strong> We stand by the quality of our work. Our dedicated support team ensures
            that every service meets our high standards and your expectations.
          </li>
          <li>
            <strong>Customer-Centric Approach:</strong> Your satisfaction is our priority. From the moment you inquire to the completion of the service,
            we are here to assist you every step of the way.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            color: "#d32f2f",
            fontWeight: 600,
            fontSize: "1.9rem",
            marginBottom: 15,
          }}
        >
          Our Comprehensive Services:
        </h2>
        <ul
          style={{
            fontSize: 17,
            color: "#222", // black text
            paddingLeft: 24,
            listStyleType: "circle",
          }}
        >
          <li style={{ marginBottom: 12 }}>
            <strong>House Painting:</strong> Transform your living spaces with our professional house painting services.
            From interior to exterior, our skilled painters ensure a flawless finish and vibrant colors that reflect your style.
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Deep Cleaning:</strong> Experience the joy of a truly clean home. Our deep cleaning services cover every nook and cranny,
            leaving your home sparkling, hygienic, and refreshed.
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Home Interiors:</strong> Design the home of your dreams with our expert home interior solutions.
            Whether it's a complete renovation or a single room makeover, our designers bring your vision to life with creativity and functionality.
          </li>
          <li>
            <strong>Packers & Movers:</strong> Relocating can be daunting. Our reliable packers & movers service ensures a smooth,
            secure, and stress-free transition of your belongings, allowing you to settle into your new home with ease.
          </li>
        </ul>
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2
          style={{
            color: "#d32f2f",
            fontWeight: 600,
            fontSize: "1.9rem",
            marginBottom: 15,
          }}
        >
          Serving Pune & Bengaluru:
        </h2>
        <p style={{ fontSize: 17, color: "#222" }}>
          We are deeply rooted in the vibrant communities of Pune and Bengaluru. Our local teams and service partners
          are well-versed with the specific needs and preferences of residents in these cities, ensuring personalized
          and efficient service delivery.
        </p>
      </section>

      <section style={{ marginBottom: 50 }}>
        <h2
          style={{
            color: "#d32f2f",
            fontWeight: 600,
            fontSize: "1.9rem",
            marginBottom: 15,
          }}
        >
          Why Choose Homjee?
        </h2>
        <ul
          style={{
            fontSize: 17,
            color: "#222", // black text
            paddingLeft: 24,
            listStyleType: "square",
          }}
        >
          <li style={{ marginBottom: 12 }}>Reliability: We show up on time and deliver on our promises.</li>
          <li style={{ marginBottom: 12 }}>Expertise: Our professionals are highly skilled and experienced.</li>
          <li style={{ marginBottom: 12 }}>Convenience: Easy booking, flexible scheduling, and dedicated support.</li>
          <li style={{ marginBottom: 12 }}>Trust: Transparent processes and a commitment to your satisfaction.</li>
          <li>Local Focus: Understanding the unique needs of Pune and Bengaluru residents.</li>
        </ul>
      </section>

      <div style={{ textAlign: "center", marginTop: 30 }}>
        <p
          style={{
            fontWeight: 700,
            fontSize: "1.4rem",
            color: "#d32f2f",
            marginBottom: 8,
          }}
        >
          Ready to experience the Homjee difference?
        </p>
        <p style={{ fontSize: 18, color: "#222" }}>
          Explore our services and book your first appointment today. We look forward to becoming your trusted partner for all your home service needs!
        </p>
      </div>
    </div>
  );
};

export default About;
