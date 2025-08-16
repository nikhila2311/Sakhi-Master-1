// pages/index.js
'use client'; // Add this line at the very top

import React, { useState } from 'react';
import Head from 'next/head';

export default function Home() {
  const [flippedIndex, setFlippedIndex] = useState(null);

  const actsData = [
    {
      name: 'The Protection of Women from Domestic Violence Act, 2005',
      description: 'This Act protects women from domestic violence (physical, emotional, etc.) and allows them to seek protection, residence, monetary relief, and custody orders.'
    },
    {
      name: 'The Dowry Prohibition Act, 1961',
      description: 'This Act prohibits the giving or taking of dowry. It makes both demanding and accepting dowry punishable offenses, aiming to prevent the exploitation of women in marriage.',
    },
    {
      name: 'The Sexual Harassment of Women at Workplace (Prevention, Prohibition and Redressal) Act, 2013',
      description: 'This Act protects women from sexual harassment at their workplace. It mandates employers to constitute an Internal Complaints Committee (ICC) to handle complaints.', 
    },
    {
      name: 'The Indecent Representation of Women (Prohibition) Act, 1986',
      description: 'This Act prohibits the indecent representation of women through advertisements, books, pamphlets, and other media, aiming to protect the dignity and decency of women.',
    },
    {
      name: 'The Maternity Benefit Act, 1961',
      description: 'This Act regulates the employment of women before and after childbirth, providing for paid maternity leave, nursing breaks, and other benefits to pregnant women and new mothers.',
    },
    {
      name: 'The Equal Remuneration Act, 1976',
      description: 'This Act ensures equal pay for equal work for both men and women. It prohibits discrimination on the ground of sex in matters of employment and remuneration.',
    },
    {
      name: 'The Hindu Succession Act, 1956 (amended 2005)',
      description: 'The 2005 amendment granted daughters equal rights to inherit ancestral property as sons, removing gender discriminatory provisions in inheritance laws.', 
    },
    {
      name: 'The Medical Termination of Pregnancy Act, 1971',
      description: 'This Act allows women to legally terminate pregnancies under certain specified conditions, empowering women to make informed decisions about their reproductive health.',
    },
    {
      name: 'The Prohibition of Child Marriage Act, 2006',
      description: 'This Act prohibits the solemnization of child marriages in India, aiming to protect the rights and well-being of minors by setting legal age limits for marriage.',
    },
  ];

  const handleCardClick = (index) => {
    setFlippedIndex(flippedIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <Head>
        <title>Government Protection Acts for Women</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={styles.main}>
        <h1 style={styles.title}>
          Government Protection Acts for Women in India
        </h1>

        <p style={styles.description}>
          Click on each act to learn more.
        </p>

        <div style={styles.grid}>
          {actsData.map((act, index) => (
            <div
              key={act.name}
              style={cardStyles.card} // Removed transform from here
              onClick={() => handleCardClick(index)}
            >
              <div
                style={{
                  ...cardStyles.cardInner,
                  transform: flippedIndex === index ? 'rotateY(180deg)' : 'rotateY(0deg)', // Applied transform here
                }}
              >
                <div style={cardStyles.cardFront}>
                  <h3 style={cardStyles.cardH3}>{act.name}</h3>
                </div>
                <div style={cardStyles.cardBack}>
                  <p style={cardStyles.cardBackP}>{act.description}</p>
                  <button
                    style={cardStyles.cardBackButton}
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent card from flipping back immediately
                      setFlippedIndex(null);
                    }}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer style={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
          style={styles.footerLink}
        >
          Powered by Women
        </a>
      </footer>
    </div>
  );
}

// Inline styles using JavaScript objects
const styles = {
  container: {
    padding: '0 2rem',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundColor: '#FFFFFF', // White background
    fontFamily: 'Inter, sans-serif',
  },
  main: {
    padding: '4rem 0',
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: '2.5rem',
    marginBottom: '1.5rem',
    textAlign: 'center',
    color: '#E91E63', // Pink
    fontWeight: 'bold',
  },
  description: {
    lineHeight: 1.5,
    fontSize: '1.1rem',
    textAlign: 'center',
    marginBottom: '3rem',
    color: '#333333',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    maxWidth: '1200px',
    marginTop: '1rem',
    justifyContent: 'center',
    gap: '2rem', // Spacing between cards
  },
  footer: {
    display: 'flex',
    padding: '2rem 0',
    borderTop: '1px solid #F8BBD0', // Light pink border
    justifyContent: 'center',
    alignItems: 'center',
    color: '#E91E63', // Pink
  },
  footerLink: {
    color: '#E91E63', // Pink
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    marginLeft: '0.5rem',
    height: '1.2em',
  },
};

const cardStyles = {
  card: {
    width: '300px',
    height: '200px',
    perspective: '1000px',
    cursor: 'pointer',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    position: 'relative', // Needed for inner elements to be absolute
  },
  cardInner: {
    position: 'relative',
    width: '100%',
    height: '100%',
    textAlign: 'center',
    transition: 'transform 0.6s cubic-bezier(0.4, 0.2, 0.2, 1)',
    transformStyle: 'preserve-3d',
    borderRadius: '12px',
  },
  cardFront: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.5rem',
    boxSizing: 'border-box',
    backgroundColor: '#FFEBEE', // Lighter pink
    color: '#E91E63', // Pink
    border: '1px solid #F8BBD0', // Light pink border
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  cardBack: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backfaceVisibility: 'hidden',
    borderRadius: '12px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1.5rem',
    boxSizing: 'border-box',
    backgroundColor: '#E91E63', // Pink
    color: '#FFFFFF', // White text
    border: '1px solid #E91E63', // Pink border
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transform: 'rotateY(180deg)', // Initially rotated for the back
  },
  cardH3: {
    margin: 0,
    fontSize: '1.25rem',
    fontWeight: '600',
    lineHeight: '1.4',
  },
  cardBackP: {
    margin: '0 0 1rem 0',
    fontSize: '0.95rem',
    lineHeight: '1.6',
    textAlign: 'center',
  },
  cardBackButton: {
    marginTop: '1rem',
    padding: '0.6rem 1.5rem',
    border: 'none',
    borderRadius: '8px',
    backgroundColor: '#FFFFFF', // White button
    color: '#E91E63', // Pink text
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease, color 0.3s ease',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  // No direct hover styles in JS objects, would need a separate state or CSS-in-JS library for true hover effects.
  // For simplicity, we'll omit hover for now or rely on external CSS if allowed.
};

// Media queries for responsiveness
// Note: Inline styles don't directly support media queries in the same way CSS modules do.
// For full responsiveness with inline styles, you'd typically use JavaScript to check window width
// and apply different style objects or use a CSS-in-JS library.
// For this example, we'll keep the basic structure, but true media query responsiveness
// would require a more advanced approach than simple JS objects.
// However, the flexbox layout used for the grid will provide some basic responsiveness.
