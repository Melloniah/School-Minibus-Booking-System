
'use client';
 import {useState, useEffect} from 'react';
 import {useRouter} from 'next/navigation';
 import toast from 'react-hot-toast';

 export default function BookingForm(){

    const router=useRouter();
    const [formData, setFormData]=useState({
        bus_id: '',
    pickup_location: '',
    dropoff_location: '',
    seats_booked: 1,
    booking_date: '',
  
    });
    const [user, setUser]=useState(null);
    const [location, setLocation]= useState([]);
    const [buses, setBuses]=useState([]);
    const [price, setPrice]=useState(0);
    const [loading, setLoading]=useState("true");

    // fetch me
    useEffect(()=>{
      
        fetch('/me', {credentials: 'include'})
        .then(res =>{
            if (res.status===401){
                router.push("/login");
                return null
            }
            return res.json();
        })
        .then(data=>{
            if (data) setUser(data);
        })
        .finally(()=> setLoading(false));
    }, [])

    // fetch locations and buses
    useEffect(()=>{
        fetch("http://127.0.0.1:5000/location")
        .then(res=> res.json())
        .then(data => {
          console.log("Fetched locations:", data);
          setLocation(data);
        });
    }, []);
    
    useEffect(()=>{
        fetch('http://127.0.0.1:5000/buses/')
        .then(res=>res.json())
        .then(data => {
          console.log("Fetched buses", data);
          setBuses(data)
    });
        
    }, []);

    // price calculation
    useEffect(() => {
    const { pickup, dropoff, busId, seats } = formData;
    if (pickup && dropoff && pickup !== dropoff && busId) {
      const selectedBus = buses.find(b => b.id === parseInt(busId));
      const routeDistance = selectedBus?.route?.distance || 0;
      const cost = routeDistance * 1.25 * seats;
      setPrice(Math.round(cost));
    } else {
      setPrice(0);
    }
  }, [formData, buses]);

  //handling form submission
  function handleSubmit(event){
    event.preventDefault();


    if (formData.pickup === formData.dropoff){
        toast.error("Pickup and drop off cannot be the same");
        return;
    }
    
    const payLoad={
      bus_id: parseInt(formData.busId),
      pickup_location: formData.pickup,
      dropoff_location: formData.dropoff,
      seats_booked: parseInt(formData.seats),
      booking_date: new Date().toISOString().slice(0, 10),
      price: price
    };

    fetch('http://127.0.0.1:5000/bookings',{
        method: 'POST',
        credentials: 'include',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify(payLoad),
    })
    .then(res =>{
        if (!res.ok) throw new Error();
        return res.json();
    })
    .then(()=>{
        toast.success('Booking Successful');
        router.push('/my-bookings'); //come back to create this end point
    })
    .catch(() => toast.error('Booking failed.'));

    console.log("Location data:", location);

  }
 

    return (
    <form className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
  <h2 className="text-xl font-bold mb-4">Book School Ride</h2>

  <div>
    <label className="block mb-1 text-sm font-medium">Pick-up Location</label>
    <select className="w-full border border-gray-300 rounded px-3 py-2">
      {/* Options will go here dynamically */}
    </select>
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium">Drop-off Location</label>
    <select className="w-full border border-gray-300 rounded px-3 py-2">
      {/* Options will go here dynamically */}
    </select>
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium">Seats Booked</label>
    <input type="number" className="w-full border border-gray-300 rounded px-3 py-2" />
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium">Booking Date</label>
    <input type="date" className="w-full border border-gray-300 rounded px-3 py-2" />
  </div>

  <div>
    <label className="block mb-1 text-sm font-medium">Price</label>
    <input type="number" step="0.01" className="w-full border border-gray-300 rounded px-3 py-2" />
  </div>

  <button
    type="submit"
    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
  >
    Submit Booking Request
  </button>
</form>

  );
}