'use client'; // This directive marks the component as a Client Component

import React from 'react';

// Data for 10 Indian women achievers
const indianWomenAchievers = [
  {
    name: 'Indira Gandhi',
    imageUrl: 'https://www.shutterstock.com/image-illustration/indira-gandhi-portrait-illustration-indian-260nw-2373867177.jpg', // Placeholder image with pink background
    description: 'The first and, to date, only female Prime Minister of India. A central figure in Indian politics.',
  },
  {
    name: 'Kalpana Chawla',
    imageUrl: 'https://i.ndtvimg.com/i/2018-05/kalpana-chawla-astronaut_650x400_41525153439.jpg?downsize=545:307', // Placeholder image with pink background
    description: 'An American astronaut and the first woman of Indian origin to go to space.',
  },
  {
    name: 'Mary Kom',
    imageUrl: 'https://m.media-amazon.com/images/I/51JZzHz3TWL._AC_UF894,1000_QL80_.jpg', // Placeholder image with pink background
    description: 'An Indian Olympic boxer, a five-time World Amateur Boxing Champion, and the only female boxer to win a medal in each of the first seven World Championships.',
  },
  {
    name: 'Saina Nehwal',
    imageUrl: 'https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w440/f_auto/primary/sepiusnv60ttgdcoa4jy', // Placeholder image with pink background
    description: 'An Indian professional badminton player. A former world No. 1, she has won over 24 international titles, including eleven Super series titles.',
  },
  {
    name: 'Kiran Bedi',
    imageUrl: 'https://alumni.iitd.ac.in/uploads/About/16909565071688380801AA8GbVa.jpg', // Placeholder image with pink background
    description: 'A retired Indian Police Service officer, social activist, and former tennis player. She was the first woman to join the Indian Police Service (IPS) in 1972.',
  },
  {
    name: 'Mother Teresa',
    imageUrl: 'https://media.gettyimages.com/id/618239768/photo/mother-teresa-accompanied-by-children-at-her-mission-in-calcutta-india.jpg?s=612x612&w=gi&k=20&c=ovlRQBit3WbC2TbwRmpiJIkqUBx00ncSDZ0LnP3kUY4=', // Placeholder image with pink background
    description: 'An Albanian-Indian Catholic nun who founded the Missionaries of Charity in Kolkata, India. She received the Nobel Peace Prize in 1979 for her humanitarian work.',
  },
  {
    name: 'PV Sindhu',
    imageUrl: 'https://akm-img-a-in.tosshub.com/indiatoday/images/story/202412/pv-sindhu-010803956-1x1.jpg?VersionId=93ADusV_C4T0DvyjdI49EbBF0ddpGbZf', // Placeholder image with pink background
    description: 'An Indian professional badminton player. Considered one of India\'s most successful sportspersons, Sindhu has won medals at various tournaments including the Olympics and the BWF World Championships.',
  },
  {
    name: 'Mithali Raj',
    imageUrl: 'https://uniquelytelangana.in/wp-content/uploads/2023/06/mithali-raj-biopic-12001-768x427.jpg', // Placeholder image with pink background
    description: 'An Indian cricketer who captains the Indian women\'s national cricket team. She is the highest run-scorer in women\'s international cricket and the only female cricketer to surpass 6,000 runs in WODIs.',
  },
  {
    name: 'Lata Mangeshkar',
    imageUrl: 'https://femina.wwmindia.com/content/2023/sep/latamangeshkar01-sm-thumb1695716897.jpg', // Placeholder image with pink background
    description: 'An Indian playback singer and occasional music composer. She is one of the greatest and most influential singers in India.',
  },
  {
    name: 'Sudha Murty',
    imageUrl: 'https://www.thebuckstopper.com/wp-content/uploads/2024/03/sudha.jpg', // Placeholder image with pink background
    description: 'An Indian engineering teacher, author, and philanthropist who is the chairperson of the Infosys Foundation. She is also the wife of co-founder of Infosys, N. R. Narayana Murthy.',
  },
];

// Main React component to display the achievers
export default function App() {
  return (
    <div className="min-h-screen w-full p-4 bg-pink-50 font-sans"> {/* Light pink background */}
      {/* Page Title */}
      <h1 className="text-3xl md:text-4xl font-extrabold mb-10 text-center text-pink-800 tracking-wide"> {/* Darker pink for title, increased margin, tracking */}
        Inspiring Indian Women Achievers
      </h1>

      {/* Grid container for achiever cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-6xl mx-auto"> {/* Increased gap */}
        {indianWomenAchievers.map((achiever, index) => (
          <div
            key={index}
            className="
              bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col
              border border-pink-100 transform hover:-translate-y-1 hover:scale-105
              opacity-0 animate-fade-in-up
            "
            // Apply animation delay for staggered effect
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Image container */}
            <div className="relative w-full h-48 sm:h-56 overflow-hidden">
              <img
                src={achiever.imageUrl}
                alt={achiever.name}
                className="w-full h-full object-cover rounded-t-xl"
                // Fallback for image loading errors
                onError={(e) => {
                  e.target.onerror = null; // Prevents infinite loop
                  e.target.src = `https://placehold.co/200x200/FCE4EC/880E4F?text=Image+Error`; // Pink-themed error placeholder
                }}
              />
            </div>

            {/* Description content */}
            <div className="p-6 flex flex-col flex-grow text-center"> {/* Increased padding, center text */}
              <h2 className="text-xl font-semibold mb-2 text-pink-700"> {/* Pink for names */}
                {achiever.name}
              </h2>
              <p className="text-gray-700 text-sm leading-relaxed flex-grow"> {/* Standard gray for description for readability */}
                {achiever.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Custom CSS for fade-in-up animation */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
