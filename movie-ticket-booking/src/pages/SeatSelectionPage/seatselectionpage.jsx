import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import { useLocation } from 'react-router-dom';
//import axios from 'axios';


function BookTicketsPage() {
  const location = useLocation();
  const { movieTitle, selectedShowtime, selectedDate } = location.state || {};
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [seats, setSeats] = useState(Array(80).fill('available'));
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [paymentPhase, setPaymentPhase] = useState(false);
  const [temporarySelectedSeats, setTemporarySelectedSeats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/movies`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();

        const selectedMovie = data.find((movie) => movie.title === movieTitle);

        if (selectedMovie) {
          setMovie(selectedMovie);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [movieTitle]);

  const selectedSchedule = movie?.schedule?.find(
    (item) => item.date === selectedDate && item.showtime === selectedShowtime
  );
  
  const preselectedSeats = selectedSchedule?.seats || [];

  const handleSeatClick = (index) => {
    if (preselectedSeats.includes(index)) {
        setSeats((prevSeats) => {
            const updatedSeats = [...prevSeats];
            updatedSeats[index] = 'preselected'; 
            return updatedSeats;
        });
    }

    if (seats[index] === 'occupied') return;
  
    const updatedSeats = [...seats];
    updatedSeats[index] = updatedSeats[index] === 'selected' ? 'available' : 'selected';
    setSeats(updatedSeats);
  
    if (updatedSeats[index] === 'selected') {
      setTemporarySelectedSeats((prev) => [...prev, index]);
    } else {
      setTemporarySelectedSeats((prev) =>
        prev.filter((seatIndex) => seatIndex !== index)
      );
    }
  
    const updatedSelectedSeats = updatedSeats
      .map((status, i) => (status === 'selected' ? i : null))
      .filter((i) => i !== null);
    setSelectedSeats(updatedSelectedSeats);

    
    
  };

  const handleConfirmSeats = async() => {
    const updatedSeats = seats.map((status) =>
      status === 'selected' ? 'occupied' : status
    );
    setSeats(updatedSeats);
  
    
    const updatedSelectedSeats = updatedSeats
      .map((status, i) => (status === 'selected' ? i : null))
      .filter((i) => i !== null);
  
    setSelectedSeats(updatedSelectedSeats); 

    setPaymentPhase(true); 
  };


  const handlePayment = async () => {
    navigate(`/payment`,{
        state :{movieTitle: movie.title,
            selectedShowtime,
            selectedDate,
            temporarySelectedSeats,}
    }); 

  };

  if (loading) {
    return <p className="text-center text-white">Loading...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">Error: {error}</p>;
  }

  if (!movie) {
    return <p className="text-center text-gray-300">Movie not found</p>;
  }

  return (
    <div className="min-h-screen bg-[#1f1f2d] text-white p-8 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
      
      <div className="md:w-1/3 bg-gray-800 rounded-lg shadow-lg p-6">
        <img
          src={movie.posterURL}
          alt={movie.title}
          className="w-144 h-256 object-cover rounded-lg mb-4"
        />
      </div>

      
      <div className='md:w-1/3 bg-gray-800 rounded-lg shadow-lg p-6'>
        <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
        <p className="text-gray-400 mb-1">{movie.duration}</p>
        <p className="text-gray-400 mb-8">{movie.genre}</p>
        <p className="text-white-400">{movie.description}</p>
      </div>

    
      <div className="md:w-1/3 bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="mb-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Selected Show Time</h2>
            <h4 className="text-xl font-semibold mb-6"> {selectedShowtime}</h4>

        
            <h2 className="text-2xl font-bold mb-2">Selected Date</h2>
            <h4 className="text-xl font-semibold  mb-6">{selectedDate}</h4>      
        </div>


        <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4">Select Seats</h2>
        <div className="grid grid-cols-8 gap-1">
            {seats.map((status, index) => {
            const isPreselected = preselectedSeats.includes(index + 1);

            return (
                <div 
                key={index}
                onClick={status === 'available' ? () => handleSeatClick(index) : null}
                className={`w-10 h-10 flex items-center justify-center rounded-md cursor-pointer ${
                    status === 'available'
                    ? isPreselected
                        ? 'bg-gray-900 pointer-events-none'
                        : 'bg-gray-600 hover:bg-gray-500'
                    : status === 'selected'
                    ? 'bg-blue-500'
                    : 'bg-red-500 cursor-not-allowed'
                }`}
                >
                {index + 1}
                </div>
            );
            })}
        </div>
        </div>

        <button
          onClick={handleConfirmSeats}
          disabled={selectedSeats.length === 0}
          className={`w-full py-2 px-4 text-white font-bold rounded-md ${
            selectedSeats.length > 0
              ? 'bg-blue-700 hover:bg-blue-900'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Confirm Selection
        </button>

        {paymentPhase && (
          <button
            onClick={handlePayment}
            className="w-full py-2 px-4 mt-4 text-white font-bold rounded-md bg-green-600 hover:bg-green-800"
          >
            Pay
          </button>
        )}
      </div>
    </div>
  );
}

export default BookTicketsPage;


